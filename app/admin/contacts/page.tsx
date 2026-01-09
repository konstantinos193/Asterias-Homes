"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare, Search, Filter, Trash2 } from "lucide-react"
import { useContacts, useDeleteContact, useCloseContact, useMarkContactAsRead, type Contact } from "@/hooks/api/use-contacts"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "REPLIED":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "READ":
      return <Clock className="h-4 w-4 text-blue-500" />
    case "UNREAD":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    case "CLOSED":
      return <XCircle className="h-4 w-4 text-slate-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-slate-500" />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "UNREAD":
      return "Μη αναγνωσμένο"
    case "READ":
      return "Αναγνωσμένο"
    case "REPLIED":
      return "Απαντημένο"
    case "CLOSED":
      return "Κλειστό"
    default:
      return status
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "UNREAD":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "READ":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "REPLIED":
      return "bg-green-50 text-green-700 border-green-200"
    case "CLOSED":
      return "bg-slate-50 text-slate-700 border-slate-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "URGENT":
      return "bg-red-50 text-red-700 border-red-200"
    case "HIGH":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "MEDIUM":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "LOW":
      return "bg-green-50 text-green-700 border-green-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case "URGENT":
      return "Επείγον"
    case "HIGH":
      return "Υψηλό"
    case "MEDIUM":
      return "Μέτριο"
    case "LOW":
      return "Χαμηλό"
    default:
      return priority
  }
}

export default function AdminContactsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [priorityFilter, setPriorityFilter] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null)
  const { toast } = useToast()

  const { data, isLoading, error, refetch } = useContacts({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    page,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const deleteContact = useDeleteContact()
  const closeContact = useCloseContact()
  const markAsRead = useMarkContactAsRead()

  const contacts = data?.contacts || []
  const pagination = data?.pagination

  const handleDelete = async (id: string) => {
    try {
      await deleteContact.mutateAsync(id)
      toast({
        title: "Επιτυχία",
        description: "Το μήνυμα διαγράφηκε επιτυχώς",
      })
      setDeleteContactId(null)
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία διαγραφής του μηνύματος",
        variant: "destructive",
      })
    }
  }

  const handleClose = async (id: string) => {
    try {
      await closeContact.mutateAsync(id)
      toast({
        title: "Επιτυχία",
        description: "Το μήνυμα έκλεισε επιτυχώς",
      })
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία κλεισίματος του μηνύματος",
        variant: "destructive",
      })
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id)
      toast({
        title: "Επιτυχία",
        description: "Το μήνυμα επισημάνθηκε ως αναγνωσμένο",
      })
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία επισημάνσεως του μηνύματος",
        variant: "destructive",
      })
    }
  }

  // Filter contacts by search query
  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.subject.toLowerCase().includes(query) ||
      contact.message.toLowerCase().includes(query)
    )
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 font-alegreya">Φόρτωση μηνυμάτων...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg font-alegreya">
        {error instanceof Error ? error.message : "Αποτυχία φόρτωσης μηνυμάτων"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-cormorant font-semibold text-slate-800">
            Μηνύματα Επικοινωνίας
          </h1>
          <p className="text-slate-600 mt-1 font-alegreya">
            Διαχείριση μηνυμάτων από την φόρμα επικοινωνίας
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-sm border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Αναζήτηση..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-alegreya"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="font-alegreya">
              <SelectValue placeholder="Κατάσταση">
                {statusFilter === "UNREAD" && "Μη αναγνωσμένο"}
                {statusFilter === "READ" && "Αναγνωσμένο"}
                {statusFilter === "REPLIED" && "Απαντημένο"}
                {statusFilter === "CLOSED" && "Κλειστό"}
                {!statusFilter && "Όλες οι καταστάσεις"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Όλες οι καταστάσεις</SelectItem>
              <SelectItem value="UNREAD">Μη αναγνωσμένο</SelectItem>
              <SelectItem value="READ">Αναγνωσμένο</SelectItem>
              <SelectItem value="REPLIED">Απαντημένο</SelectItem>
              <SelectItem value="CLOSED">Κλειστό</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="font-alegreya">
              <SelectValue placeholder="Προτεραιότητα">
                {priorityFilter === "URGENT" && "Επείγον"}
                {priorityFilter === "HIGH" && "Υψηλό"}
                {priorityFilter === "MEDIUM" && "Μέτριο"}
                {priorityFilter === "LOW" && "Χαμηλό"}
                {!priorityFilter && "Όλες οι προτεραιότητες"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Όλες οι προτεραιότητες</SelectItem>
              <SelectItem value="URGENT">Επείγον</SelectItem>
              <SelectItem value="HIGH">Υψηλό</SelectItem>
              <SelectItem value="MEDIUM">Μέτριο</SelectItem>
              <SelectItem value="LOW">Χαμηλό</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setStatusFilter("")
              setPriorityFilter("")
              setSearchQuery("")
              setPage(1)
            }}
            className="font-alegreya"
          >
            <Filter className="h-4 w-4 mr-2" />
            Εκκαθάριση
          </Button>
        </div>
      </div>

      {/* Stats */}
      {pagination && (
        <div className="text-sm text-slate-600 font-alegreya">
          Εμφάνιση {contacts.length} από {pagination.total} μηνύματα
        </div>
      )}

      {/* Contacts List */}
      <div className="bg-white rounded-sm border border-slate-200">
        <div className="divide-y divide-slate-200">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact: Contact) => (
              <div key={contact._id || contact.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(contact.status)}
                      <Link
                        href={`/admin/contacts/${contact._id || contact.id}`}
                        className="text-lg font-semibold text-slate-900 hover:text-[#0A4A4A] font-cormorant truncate"
                      >
                        {contact.subject}
                      </Link>
                      <Badge className={`${getStatusColor(contact.status)} border font-alegreya text-xs`}>
                        {getStatusText(contact.status)}
                      </Badge>
                      <Badge className={`${getPriorityColor(contact.priority)} border font-alegreya text-xs`}>
                        {getPriorityText(contact.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 font-alegreya mb-2">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{contact.name}</span>
                        <span className="text-slate-400">&lt;{contact.email}&gt;</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(contact.createdAt).toLocaleDateString('el-GR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 font-alegreya line-clamp-2">
                      {contact.message}
                    </p>
                    {contact.response && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm font-alegreya">
                        <div className="flex items-center gap-2 text-green-700 mb-1">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Απαντήθηκε</span>
                          {contact.response.respondedAt && (
                            <span className="text-xs text-green-600">
                              στις {new Date(contact.response.respondedAt).toLocaleDateString('el-GR')}
                            </span>
                          )}
                        </div>
                        <p className="text-green-800 line-clamp-2">{contact.response.message}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {contact.status === 'UNREAD' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(contact._id || contact.id || '')}
                        className="font-alegreya text-xs"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Σημάνω ως αναγνωσμένο
                      </Button>
                    )}
                    {contact.status !== 'CLOSED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClose(contact._id || contact.id || '')}
                        className="font-alegreya text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Κλείσιμο
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteContactId(contact._id || contact.id || '')}
                      className="font-alegreya text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Διαγραφή
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-alegreya">Δεν βρέθηκαν μηνύματα</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600 font-alegreya">
              Σελίδα {pagination.page} από {pagination.pages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="font-alegreya"
              >
                Προηγούμενη
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="font-alegreya"
              >
                Επόμενη
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteContactId} onOpenChange={() => setDeleteContactId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cormorant">Επιβεβαίωση Διαγραφής</AlertDialogTitle>
            <AlertDialogDescription className="font-alegreya">
              Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το μήνυμα; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-alegreya">Ακύρωση</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteContactId && handleDelete(deleteContactId)}
              className="bg-red-600 hover:bg-red-700 font-alegreya"
            >
              Διαγραφή
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

