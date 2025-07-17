"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Clock, AlertCircle, Search, Filter, Download, Calendar, User, MapPin, Euro, Phone, Mail } from "lucide-react"
import { adminAPI } from "@/lib/api"
import { useLanguage } from "@/contexts/language-context"
import * as XLSX from 'xlsx'

// Mock data - in a real app, this would come from your database
const bookings = [
  {
    id: "AST-2024-001",
    guest: "Μαρία Παπαδοπούλου",
    email: "maria@example.com",
    phone: "+30 694 123 4567",
    room: "Standard Δωμάτιο",
    checkIn: "2024-01-15",
    checkOut: "2024-01-17",
    status: "confirmed",
    total: "135.60€",
    created: "2024-01-05",
  },
  {
    id: "AST-2024-002",
    guest: "Γιάννης Κωνσταντίνου",
    email: "giannis@example.com",
    phone: "+30 697 765 4321",
    room: "Οικογενειακό Δωμάτιο",
    checkIn: "2024-01-16",
    checkOut: "2024-01-20",
    status: "pending",
    total: "361.60€",
    created: "2024-01-06",
  },
  {
    id: "AST-2024-003",
    guest: "Ελένη Μιχαηλίδου",
    email: "eleni@example.com",
    phone: "+30 698 222 3333",
    room: "Ρομαντικό Δωμάτιο",
    checkIn: "2024-01-18",
    checkOut: "2024-01-21",
    status: "confirmed",
    total: "339.00€",
    created: "2024-01-07",
  },
  {
    id: "AST-2024-004",
    guest: "Δημήτρης Αντωνίου",
    email: "dimitris@example.com",
    phone: "+30 691 444 5555",
    room: "Standard Δωμάτιο",
    checkIn: "2024-01-20",
    checkOut: "2024-01-22",
    status: "checked-in",
    total: "135.60€",
    created: "2024-01-08",
  },
  {
    id: "AST-2024-005",
    guest: "Σοφία Γεωργίου",
    email: "sofia@example.com",
    phone: "+30 693 666 7777",
    room: "Ρομαντικό Δωμάτιο",
    checkIn: "2024-01-22",
    checkOut: "2024-01-25",
    status: "pending",
    total: "339.00€",
    created: "2024-01-09",
  },
  {
    id: "AST-2024-006",
    guest: "Νίκος Παπαδάκης",
    email: "nikos@example.com",
    phone: "+30 695 888 9999",
    room: "Οικογενειακό Δωμάτιο",
    checkIn: "2024-01-25",
    checkOut: "2024-01-30",
    status: "cancelled",
    total: "452.00€",
    created: "2024-01-10",
  },
  {
    id: "AST-2024-007",
    guest: "Αναστασία Λάμπρου",
    email: "anastasia@example.com",
    phone: "+30 692 111 2222",
    room: "Standard Δωμάτιο",
    checkIn: "2024-01-28",
    checkOut: "2024-01-31",
    status: "confirmed",
    total: "203.40€",
    created: "2024-01-11",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "CHECKED_IN":
      return <CheckCircle className="h-4 w-4 text-blue-500" />
    case "CHECKED_OUT":
      return <CheckCircle className="h-4 w-4 text-gray-500" />
    case "PENDING":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "CANCELLED":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-slate-500" />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "Επιβεβαιωμένη"
    case "PENDING":
      return "Εκκρεμής"
    case "CANCELLED":
      return "Ακυρωμένη"
    case "CHECKED_IN":
      return "Check-in"
    case "CHECKED_OUT":
      return "Check-out"
    default:
      return status
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-50 text-green-700 border-green-200"
    case "CHECKED_IN":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "CHECKED_OUT":
      return "bg-gray-50 text-gray-700 border-gray-200"
    case "PENDING":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const getStatusFilterText = (status: string) => {
  switch (status) {
    case "all":
      return "Όλες οι κρατήσεις"
    case "CONFIRMED":
      return "Επιβεβαιωμένες"
    case "PENDING":
      return "Εκκρεμείς"
    case "CHECKED_IN":
      return "Check-in"
    case "CHECKED_OUT":
      return "Check-out"
    case "CANCELLED":
      return "Ακυρωμένες"
    default:
      return "Κατάσταση"
  }
}

export default function BookingsPage() {
  const { t } = useLanguage()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await adminAPI.getAllBookings()
        setBookings(response.bookings || [])
      } catch (err: any) {
        setError(err.message || "Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${booking.guestInfo?.firstName} ${booking.guestInfo?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.bookingStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, newStatus)
      // Refresh bookings after update
      const response = await adminAPI.getAllBookings()
      setBookings(response.bookings || [])
    } catch (err: any) {
      setError(err.message || "Failed to update booking status")
    }
  }

  const handleExport = () => {
    // Prepare data for Excel export
    const excelData = filteredBookings.map(booking => ({
      'Αριθμός Κράτησης': booking.bookingNumber || '',
      'Επισκέπτης': `${booking.guestInfo?.firstName || ''} ${booking.guestInfo?.lastName || ''}`.trim(),
      'Email': booking.guestInfo?.email || '',
      'Τηλέφωνο': booking.guestInfo?.phone || '',
      'Διαμέρισμα': booking.room?.name || '',
      'Check-in': booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('el-GR') : '',
      'Check-out': booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('el-GR') : '',
      'Ενήλικες': booking.adults || 0,
      'Παιδιά': booking.children || 0,
      'Σύνολο (€)': booking.totalAmount || 0,
      'Κατάσταση': booking.bookingStatus === 'CONFIRMED' ? 'Επιβεβαιωμένη' :
                  booking.bookingStatus === 'PENDING' ? 'Εκκρεμής' :
                  booking.bookingStatus === 'CANCELLED' ? 'Ακυρωμένη' :
                  booking.bookingStatus === 'CHECKED_IN' ? 'Check-in' :
                  booking.bookingStatus === 'CHECKED_OUT' ? 'Check-out' :
                  booking.bookingStatus || '',
      'Ημερομηνία Δημιουργίας': booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('el-GR') : '',
      'Ειδικές Απαιτήσεις': booking.guestInfo?.specialRequests || '',
      'Μέθοδος Πληρωμής': booking.paymentMethod === 'CARD' ? 'Κάρτα' : 
                          booking.paymentMethod === 'CASH' ? 'Μετρητά' : 
                          booking.paymentMethod || '',
      'Κατάσταση Πληρωμής': booking.paymentStatus === 'PAID' ? 'Πληρωμένο' :
                           booking.paymentStatus === 'PENDING' ? 'Εκκρεμές' :
                           booking.paymentStatus === 'FAILED' ? 'Αποτυχία' :
                           booking.paymentStatus === 'REFUNDED' ? 'Επιστράφηκε' :
                           booking.paymentStatus || ''
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)
    
    // Set column widths for better readability
    const colWidths = [
      { wch: 15 }, // Αριθμός Κράτησης
      { wch: 20 }, // Επισκέπτης
      { wch: 25 }, // Email
      { wch: 15 }, // Τηλέφωνο
      { wch: 20 }, // Διαμέρισμα
      { wch: 12 }, // Check-in
      { wch: 12 }, // Check-out
      { wch: 10 }, // Ενήλικες
      { wch: 8 },  // Παιδιά
      { wch: 12 }, // Σύνολο
      { wch: 15 }, // Κατάσταση
      { wch: 18 }, // Ημερομηνία Δημιουργίας
      { wch: 30 }, // Ειδικές Απαιτήσεις
      { wch: 15 }, // Μέθοδος Πληρωμής
      { wch: 15 }  // Κατάσταση Πληρωμής
    ]
    ws['!cols'] = colWidths

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Κρατήσεις')
    
    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0]
    const filename = `Κρατήσεις_Asterias_${today}.xlsx`
    
    // Save and download the file
    XLSX.writeFile(wb, filename)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 font-alegreya">Φόρτωση κρατήσεων...</div>
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
          <h1 className="text-xl md:text-2xl font-cormorant font-light text-slate-800">Κρατήσεις</h1>
          <p className="text-sm md:text-base text-slate-600 font-alegreya">Διαχείριση όλων των κρατήσεων δωματίων</p>
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
              placeholder="Αναζήτηση με όνομα, email ή αριθμό κράτησης..."
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
                <SelectItem value="all">Όλες οι κρατήσεις</SelectItem>
                <SelectItem value="CONFIRMED">Επιβεβαιωμένες</SelectItem>
                <SelectItem value="PENDING">Εκκρεμείς</SelectItem>
                <SelectItem value="CHECKED_IN">Check-in</SelectItem>
                <SelectItem value="CHECKED_OUT">Check-out</SelectItem>
                <SelectItem value="CANCELLED">Ακυρωμένες</SelectItem>
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
                  Αριθμός
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Επισκέπτης
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Δωμάτιο
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Check-in / Check-out
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Κατάσταση
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Σύνολο
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-alegreya">
                    <Link href={`/admin/bookings/${booking._id}`} className="hover:text-[#0A4A4A] hover:underline">
                      {booking.bookingNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    <div>{booking.guestInfo?.firstName} {booking.guestInfo?.lastName}</div>
                    <div className="text-xs text-slate-500">{booking.guestInfo?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    {booking.room?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500">έως {new Date(booking.checkOut).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-alegreya">
                    <Select
                      value={booking.bookingStatus}
                      onValueChange={(value) => handleStatusUpdate(booking._id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>{getStatusText(booking.bookingStatus)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONFIRMED">Επιβεβαιωμένη</SelectItem>
                        <SelectItem value="PENDING">Εκκρεμής</SelectItem>
                        <SelectItem value="CHECKED_IN">Check-in</SelectItem>
                        <SelectItem value="CHECKED_OUT">Check-out</SelectItem>
                        <SelectItem value="CANCELLED">Ακυρωμένη</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">€{booking.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/bookings/${booking._id}`}
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
        {filteredBookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Link href={`/admin/bookings/${booking._id}`} className="text-sm font-medium text-[#0A4A4A] hover:underline font-alegreya">
                  {booking.bookingNumber}
                </Link>
                <div className="text-xs text-slate-500 mt-1 font-alegreya">
                  {new Date(booking.createdAt).toLocaleDateString('el-GR')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900 font-alegreya">€{booking.totalAmount}</div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getStatusClass(booking.bookingStatus)}`}>
                  {getStatusIcon(booking.bookingStatus)}
                  <span className="ml-1">{getStatusText(booking.bookingStatus)}</span>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm text-slate-700 font-alegreya">
                <User className="h-4 w-4 mr-2 text-slate-400" />
                <span>{booking.guestInfo?.firstName} {booking.guestInfo?.lastName}</span>
              </div>
              <div className="flex items-center text-sm text-slate-700 font-alegreya">
                <Mail className="h-4 w-4 mr-2 text-slate-400" />
                <span className="truncate">{booking.guestInfo?.email}</span>
              </div>
              {booking.guestInfo?.phone && (
                <div className="flex items-center text-sm text-slate-700 font-alegreya">
                  <Phone className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{booking.guestInfo?.phone}</span>
                </div>
              )}
            </div>

            {/* Room & Dates */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-slate-700 font-alegreya">
                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                <span>{booking.room?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-slate-700 font-alegreya">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                <span>
                  {new Date(booking.checkIn).toLocaleDateString('el-GR')} - {new Date(booking.checkOut).toLocaleDateString('el-GR')}
                </span>
              </div>
            </div>

            {/* Status Update & Action */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex-1 mr-3">
                <Select
                  value={booking.bookingStatus}
                  onValueChange={(value) => handleStatusUpdate(booking._id, value)}
                >
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue>{getStatusText(booking.bookingStatus)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONFIRMED">Επιβεβαιωμένη</SelectItem>
                    <SelectItem value="PENDING">Εκκρεμής</SelectItem>
                    <SelectItem value="CHECKED_IN">Check-in</SelectItem>
                    <SelectItem value="CHECKED_OUT">Check-out</SelectItem>
                    <SelectItem value="CANCELLED">Ακυρωμένη</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Link
                href={`/admin/bookings/${booking._id}`}
                className="text-xs text-[#0A4A4A] hover:text-[#083a3a] font-alegreya font-medium"
              >
                Λεπτομέρειες →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-sm border border-slate-200 py-12 text-center">
          <p className="text-slate-500 font-alegreya">Δεν βρέθηκαν κρατήσεις με τα επιλεγμένα κριτήρια</p>
        </div>
      )}
    </div>
  )
}
