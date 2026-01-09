"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Filter, Plus, Edit, Trash2, Eye, UserPlus } from "lucide-react"
import { useAdminUsers, useUpdateUser, useDeleteUser, useCreateAdminUser } from "@/hooks/api/use-admin"
import { logger } from "@/lib/logger"
import { toast } from "sonner"
import * as XLSX from 'xlsx'

const getRoleText = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Διαχειριστής"
    case "USER":
      return "Χρήστης"
    default:
      return role
  }
}

const getStatusText = (status: boolean | undefined) => {
  return status ? "Ενεργός" : "Ανενεργός"
}

const getStatusFilterText = (status: string) => {
  switch (status) {
    case "all":
      return "Όλες οι καταστάσεις"
    case "active":
      return "Ενεργοί"
    case "inactive":
      return "Ανενεργοί"
    default:
      return "Κατάσταση"
  }
}

const getRoleFilterText = (role: string) => {
  switch (role) {
    case "all":
      return "Όλοι οι ρόλοι"
    case "ADMIN":
      return "Διαχειριστές"
    case "USER":
      return "Χρήστες"
    default:
      return "Ρόλος"
  }
}

export default function UsersPage() {
  const { data: usersData = [], isLoading, error: queryError } = useAdminUsers()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()
  const createAdminUserMutation = useCreateAdminUser()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  
  // Form states for create
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  
  // Form states for edit
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "USER" as "ADMIN" | "USER",
    isActive: true,
  })

  // Normalize users data - handle both array and { users: [] } formats
  const users = Array.isArray(usersData) 
    ? usersData 
    : (usersData && typeof usersData === 'object' && 'users' in usersData && Array.isArray((usersData as any).users) 
      ? (usersData as any).users 
      : [])

  // Handle errors
  const error = queryError ? (() => {
    const err = queryError as Error
    logger.error('Error fetching users', err)
    return err.message || "Failed to load users"
  })() : null

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.isActive === (statusFilter === "active")
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleCreateUser = async () => {
    if (!createFormData.name || !createFormData.email || !createFormData.password) {
      toast.error("Παρακαλώ συμπληρώστε όλα τα πεδία")
      return
    }

    if (createFormData.password.length < 6) {
      toast.error("Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες")
      return
    }

    try {
      await createAdminUserMutation.mutateAsync(createFormData)
      toast.success("Ο χρήστης δημιουργήθηκε επιτυχώς")
      setIsCreateDialogOpen(false)
      setCreateFormData({ name: "", email: "", password: "" })
    } catch (err: any) {
      logger.error('Failed to create user', err as Error)
      toast.error(err.message || "Αποτυχία δημιουργίας χρήστη")
    }
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "USER",
      isActive: user.isActive !== undefined ? user.isActive : true,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser?._id) return

    if (!editFormData.name || !editFormData.email) {
      toast.error("Παρακαλώ συμπληρώστε όλα τα πεδία")
      return
    }

    try {
      await updateUserMutation.mutateAsync({
        userId: selectedUser._id,
        data: editFormData,
      })
      toast.success("Ο χρήστης ενημερώθηκε επιτυχώς")
      setIsEditDialogOpen(false)
      setSelectedUser(null)
    } catch (err: any) {
      logger.error('Failed to update user', err as Error)
      toast.error(err.message || "Αποτυχία ενημέρωσης χρήστη")
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τον χρήστη "${userName}"?`)) return

    try {
      await deleteUserMutation.mutateAsync(userId)
      toast.success("Ο χρήστης διαγράφηκε επιτυχώς")
    } catch (err: any) {
      logger.error('Failed to delete user', err as Error)
      toast.error(err.message || "Αποτυχία διαγραφής χρήστη")
    }
  }

  const handleExport = () => {
    // Prepare data for Excel export
    const excelData = filteredUsers.map((user: any) => ({
      'Όνομα': user.name || '',
      'ID': user._id || '',
      'Email': user.email || '',
      'Ρόλος': getRoleText(user.role || 'USER'),
      'Κατάσταση': getStatusText(user.isActive),
      'Ημερομηνία Εγγραφής': user.createdAt ? new Date(user.createdAt).toLocaleDateString('el-GR') : '',
      'Τελευταία Σύνδεση': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('el-GR') : '',
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)
    
    // Set column widths for better readability
    const colWidths = [
      { wch: 25 }, // Όνομα
      { wch: 25 }, // ID
      { wch: 30 }, // Email
      { wch: 15 }, // Ρόλος
      { wch: 15 }, // Κατάσταση
      { wch: 20 }, // Ημερομηνία Εγγραφής
      { wch: 20 }, // Τελευταία Σύνδεση
    ]
    ws['!cols'] = colWidths
    
    XLSX.utils.book_append_sheet(wb, ws, 'Χρήστες')
    
    // Generate filename
    const today = new Date().toISOString().split('T')[0]
    const filename = `Χρήστες_Asterias_${today}.xlsx`
    
    XLSX.writeFile(wb, filename)
    toast.success("Το αρχείο εξήχθη επιτυχώς")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 font-alegreya">Φόρτωση χρηστών...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-sm font-alegreya">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">Διαχείριση Χρηστών</h1>
          <p className="text-slate-600 font-alegreya">Διαχείριση χρηστών και διαχειριστών συστήματος</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleExport}
            variant="outline"
            className="font-alegreya"
          >
            <Search className="h-4 w-4 mr-2" />
            Εξαγωγή Excel
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
                <UserPlus className="h-4 w-4 mr-2" />
                Νέος Χρήστης
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="font-cormorant">Δημιουργία Νέου Χρήστη</DialogTitle>
                <DialogDescription className="font-alegreya">
                  Δημιουργήστε έναν νέο διαχειριστή χρήστη
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="create-name" className="font-alegreya">Όνομα</Label>
                  <Input
                    id="create-name"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                    placeholder="Εισάγετε όνομα"
                    className="font-alegreya"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-email" className="font-alegreya">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="font-alegreya"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-password" className="font-alegreya">Κωδικός</Label>
                  <Input
                    id="create-password"
                    type="password"
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                    placeholder="Ελάχιστο 6 χαρακτήρες"
                    className="font-alegreya"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="font-alegreya"
                >
                  Ακύρωση
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={createAdminUserMutation.isPending}
                  className="bg-[#0A4A4A] hover:bg-[#083a3a] font-alegreya"
                >
                  {createAdminUserMutation.isPending ? "Δημιουργία..." : "Δημιουργία"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Αναζήτηση με όνομα, email ή ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-alegreya"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] font-alegreya">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Κατάσταση" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
            <SelectItem value="active">Ενεργοί</SelectItem>
            <SelectItem value="inactive">Ανενεργοί</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px] font-alegreya">
            <SelectValue placeholder="Ρόλος" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλοι οι ρόλοι</SelectItem>
            <SelectItem value="ADMIN">Διαχειριστές</SelectItem>
            <SelectItem value="USER">Χρήστες</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Όνομα
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Ρόλος
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Κατάσταση
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Ημερομηνία Εγγραφής
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-alegreya">
                      {user.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      {user.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {getRoleText(user.role || 'USER')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {getStatusText(user.isActive)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('el-GR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(user)}
                        title="Επεξεργασία"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        disabled={deleteUserMutation.isPending}
                        className="text-red-600 hover:text-red-800"
                        title="Διαγραφή"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-12">
                    <p className="text-slate-500 font-alegreya">
                      {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                        ? "Δεν βρέθηκαν χρήστες που να αντιστοιχούν στα φίλτρα."
                        : "Δεν βρέθηκαν χρήστες. Ξεκινήστε προσθέτοντας έναν νέο χρήστη."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-cormorant">Επεξεργασία Χρήστη</DialogTitle>
            <DialogDescription className="font-alegreya">
              Ενημερώστε τις πληροφορίες του χρήστη
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="font-alegreya">Όνομα</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                placeholder="Εισάγετε όνομα"
                className="font-alegreya"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email" className="font-alegreya">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                placeholder="email@example.com"
                className="font-alegreya"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role" className="font-alegreya">Ρόλος</Label>
              <Select
                value={editFormData.role}
                onValueChange={(value: string) => setEditFormData({ ...editFormData, role: value as "ADMIN" | "USER" })}
              >
                <SelectTrigger className="font-alegreya">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Χρήστης</SelectItem>
                  <SelectItem value="ADMIN">Διαχειριστής</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={editFormData.isActive}
                onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                className="rounded border-slate-300"
              />
              <Label htmlFor="edit-active" className="font-alegreya cursor-pointer">
                Ενεργός Χρήστης
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="font-alegreya"
            >
              Ακύρωση
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isPending}
              className="bg-[#0A4A4A] hover:bg-[#083a3a] font-alegreya"
            >
              {updateUserMutation.isPending ? "Αποθήκευση..." : "Αποθήκευση"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

