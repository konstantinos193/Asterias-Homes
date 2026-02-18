"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Clock, AlertCircle, Search, Filter, Download, Calendar, User, MapPin, Euro, Phone, Mail, Trash2, CheckSquare, Square } from "lucide-react"
import { useAdminBookings, useUpdateBookingStatus, Booking } from "@/hooks/api/use-bookings"
import { useBulkDeleteBookings, useBulkUpdateBookingStatus } from "@/hooks/api/use-admin"
import * as XLSX from 'xlsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

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
  const { data: bookings = [], isLoading, error } = useAdminBookings()
  const updateBookingStatusMutation = useUpdateBookingStatus()
  const bulkDeleteMutation = useBulkDeleteBookings()
  const bulkUpdateStatusMutation = useBulkUpdateBookingStatus()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set())
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false)
  const [bulkStatus, setBulkStatus] = useState("")

  const filteredBookings = bookings.filter((booking: Booking) => {
    const matchesSearch =
      (booking.bookingNumber as string)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${(booking.guestInfo as any)?.firstName} ${(booking.guestInfo as any)?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.guestInfo as any)?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.bookingStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatusMutation.mutateAsync({ bookingId, status: newStatus })
      toast({
        title: "Status updated",
        description: "Booking status has been updated successfully.",
      })
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSelectAll = () => {
    if (selectedBookings.size === filteredBookings.length) {
      setSelectedBookings(new Set())
    } else {
      setSelectedBookings(new Set(filteredBookings.map((b: Booking) => (b._id || b.id) as string)))
    }
  }

  const handleSelectBooking = (bookingId: string) => {
    const newSelected = new Set(selectedBookings)
    if (newSelected.has(bookingId)) {
      newSelected.delete(bookingId)
    } else {
      newSelected.add(bookingId)
    }
    setSelectedBookings(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedBookings.size === 0) return
    try {
      await bulkDeleteMutation.mutateAsync(Array.from(selectedBookings))
      toast({
        title: "Bookings deleted",
        description: `Successfully deleted ${selectedBookings.size} booking(s).`,
      })
      setSelectedBookings(new Set())
      setBulkDeleteDialogOpen(false)
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: "Failed to delete bookings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkUpdateStatus = async () => {
    if (selectedBookings.size === 0 || !bulkStatus) return
    try {
      await bulkUpdateStatusMutation.mutateAsync({
        bookingIds: Array.from(selectedBookings),
        status: bulkStatus,
      })
      toast({
        title: "Status updated",
        description: `Successfully updated ${selectedBookings.size} booking(s).`,
      })
      setSelectedBookings(new Set())
      setBulkStatus("")
      setBulkStatusDialogOpen(false)
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    // Prepare data for Excel export
    const excelData = filteredBookings.map((booking: Booking) => {
      const guestInfo = booking.guestInfo as any
      const room = (booking as any).roomId // API returns room data under roomId
      return {
        'Αριθμός Κράτησης': booking.bookingNumber || '',
        'Επισκέπτης': `${guestInfo?.firstName || ''} ${guestInfo?.lastName || ''}`.trim(),
        'Email': guestInfo?.email || '',
        'Τηλέφωνο': guestInfo?.phone || '',
        'Διαμέρισμα': room?.name || '',
        'Check-in': booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('el-GR') : '',
        'Check-out': booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('el-GR') : '',
        'Ενήλικες': (booking as any).adults || 0,
        'Παιδιά': (booking as any).children || 0,
        'Σύνολο (€)': booking.totalAmount || 0,
        'Κατάσταση': booking.bookingStatus === 'CONFIRMED' ? 'Επιβεβαιωμένη' :
                    booking.bookingStatus === 'PENDING' ? 'Εκκρεμής' :
                    booking.bookingStatus === 'CANCELLED' ? 'Ακυρωμένη' :
                    booking.bookingStatus === 'CHECKED_IN' ? 'Check-in' :
                    booking.bookingStatus === 'CHECKED_OUT' ? 'Check-out' :
                    (booking.bookingStatus as string) || '',
        'Ημερομηνία Δημιουργίας': (booking as any).createdAt ? new Date((booking as any).createdAt).toLocaleDateString('el-GR') : '',
        'Ειδικές Απαιτήσεις': guestInfo?.specialRequests || '',
        'Μέθοδος Πληρωμής': (booking as any).paymentMethod === 'CARD' ? 'Κάρτα' : 
                            (booking as any).paymentMethod === 'CASH' ? 'Μετρητά' : 
                            (booking as any).paymentMethod || '',
        'Κατάσταση Πληρωμής': (booking as any).paymentStatus === 'PAID' ? 'Πληρωμένο' :
                             (booking as any).paymentStatus === 'PENDING' ? 'Εκκρεμές' :
                             (booking as any).paymentStatus === 'FAILED' ? 'Αποτυχία' :
                             (booking as any).paymentStatus === 'REFUNDED' ? 'Επιστράφηκε' :
                             (booking as any).paymentStatus || ''
      }
    })

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 font-alegreya">Φόρτωση κρατήσεων...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-sm font-alegreya">
        {error.message || "Αποτυχία φόρτωσης κρατήσεων"}
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
        <div className="flex justify-between items-center">
          {selectedBookings.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-alegreya text-slate-600">
                {selectedBookings.size} επιλεγμένη/ες
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkStatusDialogOpen(true)}
                disabled={bulkUpdateStatusMutation.isPending}
                className="font-alegreya"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Αλλαγή Κατάστασης
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkDeleteDialogOpen(true)}
                disabled={bulkDeleteMutation.isPending}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-alegreya"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Διαγραφή
              </Button>
            </div>
          )}
          <div className="flex gap-2 ml-auto">
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya w-12">
                  <input
                    type="checkbox"
                    checked={selectedBookings.size === filteredBookings.length && filteredBookings.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-[#0A4A4A] focus:ring-[#0A4A4A]"
                  />
                </th>
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
              {filteredBookings.map((booking: Booking) => {
                const bookingId = (booking._id || booking.id) as string
                const guestInfo = booking.guestInfo as any
                const room = (booking as any).roomId // API returns room data under roomId
                const isSelected = selectedBookings.has(bookingId)
                return (
                  <tr key={bookingId} className={`hover:bg-slate-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectBooking(bookingId)}
                        className="h-4 w-4 rounded border-slate-300 text-[#0A4A4A] focus:ring-[#0A4A4A]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-alegreya">
                      <Link href={`/admin/bookings/${bookingId}`} className="hover:text-[#0A4A4A] hover:underline">
                        {String(booking.bookingNumber || 'N/A')}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      <div>{guestInfo?.firstName} {guestInfo?.lastName}</div>
                      <div className="text-xs text-slate-500">{guestInfo?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      {room?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      <div>{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A'}</div>
                      <div className="text-xs text-slate-500">έως {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-alegreya">
                      <Select
                        value={booking.bookingStatus as string}
                        onValueChange={(value) => {
                          if (!updateBookingStatusMutation.isPending) {
                            handleStatusUpdate(bookingId, value)
                          }
                        }}
                      >
                        <SelectTrigger 
                          className={`w-32 ${updateBookingStatusMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <SelectValue>{getStatusText(booking.bookingStatus as string)}</SelectValue>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">€{booking.totalAmount || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/bookings/${bookingId}`}
                        className="text-[#0A4A4A] hover:text-[#083a3a] font-alegreya"
                      >
                        Λεπτομέρειες
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredBookings.map((booking: Booking) => {
          const bookingId = (booking._id || booking.id) as string
          const guestInfo = booking.guestInfo as any
          const room = (booking as any).roomId // API returns room data under roomId
          const createdAt = (booking as any).createdAt
          const isSelected = selectedBookings.has(bookingId)
          return (
            <div key={bookingId} className={`bg-white rounded-lg border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200'} p-4 shadow-sm`}>
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectBooking(bookingId)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0A4A4A] focus:ring-[#0A4A4A]"
                  />
                  <div className="flex-1">
                    <Link href={`/admin/bookings/${bookingId}`} className="text-sm font-medium text-[#0A4A4A] hover:underline font-alegreya">
                      {String(booking.bookingNumber || 'N/A')}
                    </Link>
                    <div className="text-xs text-slate-500 mt-1 font-alegreya">
                      {createdAt ? new Date(createdAt).toLocaleDateString('el-GR') : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900 font-alegreya">€{booking.totalAmount || 0}</div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getStatusClass(booking.bookingStatus as string)}`}>
                    {getStatusIcon(booking.bookingStatus as string)}
                    <span className="ml-1">{getStatusText(booking.bookingStatus as string)}</span>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm text-slate-700 font-alegreya">
                  <User className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{guestInfo?.firstName} {guestInfo?.lastName}</span>
                </div>
                <div className="flex items-center text-sm text-slate-700 font-alegreya">
                  <Mail className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="truncate">{guestInfo?.email}</span>
                </div>
                {guestInfo?.phone && (
                  <div className="flex items-center text-sm text-slate-700 font-alegreya">
                    <Phone className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{guestInfo.phone}</span>
                  </div>
                )}
              </div>

              {/* Room & Dates */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-700 font-alegreya">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{room?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm text-slate-700 font-alegreya">
                  <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                  <span>
                    {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('el-GR') : 'N/A'} - {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('el-GR') : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Status Update & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex-1 mr-3">
                  <Select
                    value={booking.bookingStatus as string}
                    onValueChange={(value) => {
                      if (!updateBookingStatusMutation.isPending) {
                        handleStatusUpdate(bookingId, value)
                      }
                    }}
                  >
                    <SelectTrigger 
                      className={`text-xs h-8 ${updateBookingStatusMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <SelectValue>{getStatusText(booking.bookingStatus as string)}</SelectValue>
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
                  href={`/admin/bookings/${bookingId}`}
                  className="text-xs text-[#0A4A4A] hover:text-[#083a3a] font-alegreya font-medium"
                >
                  Λεπτομέρειες →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Results */}
      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-sm border border-slate-200 py-12 text-center">
          <p className="text-slate-500 font-alegreya">Δεν βρέθηκαν κρατήσεις με τα επιλεγμένα κριτήρια</p>
        </div>
      )}

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Διαγραφή Κρατήσεων</AlertDialogTitle>
            <AlertDialogDescription className="font-alegreya">
              Είστε σίγουροι ότι θέλετε να διαγράψετε {selectedBookings.size} κράτηση/σεις; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Άκυρο</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? "Deleting..." : "Διαγραφή"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Status Update Dialog */}
      <AlertDialog open={bulkStatusDialogOpen} onOpenChange={setBulkStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Αλλαγή Κατάστασης</AlertDialogTitle>
            <AlertDialogDescription className="font-alegreya space-y-4">
              <p>Επιλέξτε την νέα κατάσταση για {selectedBookings.size} κράτηση/σεις:</p>
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="font-alegreya">
                  <SelectValue placeholder="Επιλέξτε κατάσταση" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Εκκρεμής</SelectItem>
                  <SelectItem value="CONFIRMED">Επιβεβαιωμένη</SelectItem>
                  <SelectItem value="CHECKED_IN">Check-in</SelectItem>
                  <SelectItem value="CHECKED_OUT">Check-out</SelectItem>
                  <SelectItem value="CANCELLED">Ακυρωμένη</SelectItem>
                </SelectContent>
              </Select>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setBulkStatusDialogOpen(false)
              setBulkStatus("")
            }}>Άκυρο</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkUpdateStatus}
              className="bg-[#0A4A4A] hover:bg-[#083a3a]"
              disabled={bulkUpdateStatusMutation.isPending || !bulkStatus}
            >
              {bulkUpdateStatusMutation.isPending ? "Updating..." : "Ενημέρωση"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
