"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Mail, Phone, Calendar, User, Download, Building } from "lucide-react"
import { adminAPI } from "@/lib/api"
import * as XLSX from 'xlsx'

const getStatusText = (status: boolean) => {
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

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await adminAPI.getAllUsers()
        setGuests(response.users || [])
      } catch (err: any) {
        setError(err.message || "Failed to load guests")
      } finally {
        setLoading(false)
      }
    }

    fetchGuests()
  }, [])

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone?.includes(searchTerm) ||
      guest._id?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || guest.isActive === (statusFilter === "active")

    return matchesSearch && matchesStatus
  })

  const handleExport = () => {
    // Prepare data for Excel export
    const excelData = filteredGuests.map(guest => ({
      'Όνομα': guest.name || '',
      'ID': guest._id || '',
      'Email': guest.email || '',
      'Τηλέφωνο': guest.phone || '',
      'Ρόλος': guest.role === 'ADMIN' ? 'Admin' : 'User',
      'Ημερομηνία Εγγραφής': guest.createdAt ? new Date(guest.createdAt).toLocaleDateString('el-GR') : '',
      'Τελευταία Σύνδεση': guest.lastLogin ? new Date(guest.lastLogin).toLocaleDateString('el-GR') : '',
      'Κατάσταση': guest.isActive ? 'Ενεργός' : 'Ανενεργός',
      'Σύνολο Κρατήσεων': guest.bookings?.length || 0,
      'Preferences': guest.preferences ? JSON.stringify(guest.preferences) : '',
      'Ενεργός Χρήστης': guest.isActive ? 'Ναι' : 'Όχι'
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)
    
    // Set column widths for better readability
    const colWidths = [
      { wch: 20 }, // Όνομα
      { wch: 25 }, // ID
      { wch: 30 }, // Email
      { wch: 15 }, // Τηλέφωνο
      { wch: 10 }, // Ρόλος
      { wch: 15 }, // Ημερομηνία Εγγραφής
      { wch: 15 }, // Τελευταία Σύνδεση
      { wch: 12 }, // Κατάσταση
      { wch: 12 }, // Σύνολο Κρατήσεων
      { wch: 20 }, // Preferences
      { wch: 12 }  // Ενεργός Χρήστης
    ]
    ws['!cols'] = colWidths

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Επισκέπτες')
    
    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0]
    const filename = `Επισκέπτες_Asterias_${today}.xlsx`
    
    // Save and download the file
    XLSX.writeFile(wb, filename)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 font-alegreya">Φόρτωση επισκεπτών...</div>
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
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-cormorant font-light text-slate-800">Διαχείριση Επισκεπτών</h1>
          <p className="text-sm md:text-base text-slate-600 font-alegreya">Προβολή και διαχείριση όλων των επισκεπτών</p>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleExport}
            className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya text-sm"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Εξαγωγή
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-sm border border-slate-200">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Αναζήτηση με όνομα, email, τηλέφωνο ή ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 font-alegreya"
            />
          </div>
          
          {/* Status Filter */}
          <div className="w-full md:w-64">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="font-alegreya">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue>{getStatusFilterText(statusFilter)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
                <SelectItem value="active">Ενεργοί</SelectItem>
                <SelectItem value="inactive">Ανενεργοί</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Επισκέπτης
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Επικοινωνία
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Ρόλος
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Κρατήσεις
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Τελευταία Σύνδεση
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Κατάσταση
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredGuests.map((guest) => (
                <tr key={guest._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#0A4A4A]/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-[#0A4A4A]" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 font-alegreya">{guest.name}</div>
                        <div className="text-sm text-slate-500 font-alegreya">ID: {guest._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 font-alegreya flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-slate-400" />
                      {guest.email}
                    </div>
                    {guest.phone && (
                      <div className="text-sm text-slate-700 font-alegreya flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-slate-400" />
                        {guest.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    {guest.role === 'ADMIN' ? 'Admin' : 'User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    {guest.bookings?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    {guest.lastLogin ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                        {new Date(guest.lastLogin).toLocaleDateString('el-GR')}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        guest.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {getStatusText(guest.isActive)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/guests/${guest._id}`}
                      className="text-[#0A4A4A] hover:text-[#083a3a] font-alegreya"
                    >
                      Λεπτομέρειες
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredGuests.map((guest) => (
          <div key={guest._id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0 h-10 w-10 bg-[#0A4A4A]/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-[#0A4A4A]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900 font-alegreya">{guest.name}</div>
                  <div className="text-xs text-slate-500 font-alegreya">ID: {guest._id}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  guest.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {getStatusText(guest.isActive)}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm text-slate-700 font-alegreya">
                <Mail className="h-4 w-4 mr-2 text-slate-400" />
                <span className="truncate">{guest.email}</span>
              </div>
              {guest.phone && (
                <div className="flex items-center text-sm text-slate-700 font-alegreya">
                  <Phone className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{guest.phone}</span>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-slate-700 font-alegreya">
                <Building className="h-4 w-4 mr-2 text-slate-400" />
                <span>Ρόλος: {guest.role === 'ADMIN' ? 'Admin' : 'User'}</span>
              </div>
              <div className="flex items-center text-sm text-slate-700 font-alegreya">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                <span>
                  Κρατήσεις: {guest.bookings?.length || 0} | 
                  Τελευταία σύνδεση: {guest.lastLogin ? new Date(guest.lastLogin).toLocaleDateString('el-GR') : '-'}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-slate-100">
              <Link
                href={`/admin/guests/${guest._id}`}
                className="text-xs text-[#0A4A4A] hover:text-[#083a3a] font-alegreya font-medium"
              >
                Λεπτομέρειες →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredGuests.length === 0 && (
        <div className="bg-white rounded-sm border border-slate-200 py-12 text-center">
          <p className="text-slate-500 font-alegreya">Δεν βρέθηκαν επισκέπτες με τα επιλεγμένα κριτήρια</p>
        </div>
      )}
    </div>
  )
}
