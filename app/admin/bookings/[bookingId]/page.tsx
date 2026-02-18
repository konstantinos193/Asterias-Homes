"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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
import {
  ArrowLeft,
  Calendar,
  User,
  Home,
  CreditCard,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
  DollarSign,
} from "lucide-react"
import { useAdminBooking, useRefundBooking, useCancelAdminBooking, useSendBookingEmail } from "@/hooks/api/use-admin"
import { useUpdateBookingStatus } from "@/hooks/api/use-bookings"
import { format, differenceInDays } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { logger } from "@/lib/logger"

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.bookingId as string
  const { toast } = useToast()

  const { data: booking, isLoading, error, refetch } = useAdminBooking(bookingId)
  const updateStatusMutation = useUpdateBookingStatus()
  const refundMutation = useRefundBooking()
  const cancelMutation = useCancelAdminBooking()
  const sendEmailMutation = useSendBookingEmail()

  const [status, setStatus] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [refundAmount, setRefundAmount] = useState<string>("")
  const [adminNotes, setAdminNotes] = useState("")
  const [customEmailDialogOpen, setCustomEmailDialogOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState("")

  // Initialize state from booking data
  useEffect(() => {
    if (booking) {
      const bookingStatus = (booking as any).bookingStatus || ""
      const bookingNotes = (booking as any).notes || (booking as any).adminNotes || ""
      setStatus(bookingStatus)
      setNotes(bookingNotes)
    }
  }, [booking])

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        bookingId,
        status: newStatus,
        adminNotes: notes || undefined,
      })
      setStatus(newStatus)
      toast({
        title: "Status updated",
        description: "Booking status has been updated successfully.",
      })
      refetch()
    } catch (error) {
      logger.error("Error updating booking status", error as Error)
      toast({
        title: "Update failed",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveNotes = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        bookingId,
        status: status || (booking as any)?.bookingStatus || "PENDING",
        adminNotes: notes || undefined,
      })
      toast({
        title: "Notes saved",
        description: "Booking notes have been saved successfully.",
      })
      refetch()
    } catch (error) {
      logger.error("Error saving notes", error as Error)
      toast({
        title: "Save failed",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelBooking = async () => {
    try {
      await cancelMutation.mutateAsync({
        bookingId,
        cancellationReason: cancellationReason || "Cancelled by admin",
        refundAmount: refundAmount ? parseFloat(refundAmount) : undefined,
        adminNotes: adminNotes || notes,
      })
      toast({
        title: "Booking cancelled",
        description: "Booking has been cancelled successfully.",
      })
      setCancelDialogOpen(false)
      setCancellationReason("")
      setRefundAmount("")
      setAdminNotes("")
      refetch()
      router.push("/admin/bookings")
    } catch (error) {
      logger.error("Error cancelling booking", error as Error)
      toast({
        title: "Cancellation failed",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefund = async () => {
    try {
      await refundMutation.mutateAsync(bookingId)
      toast({
        title: "Refund processed",
        description: "Payment has been refunded successfully.",
      })
      setRefundDialogOpen(false)
      refetch()
    } catch (error) {
      logger.error("Error processing refund", error as Error)
      toast({
        title: "Refund failed",
        description: "Failed to process refund. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = async (emailType: string, message?: string) => {
    try {
      await sendEmailMutation.mutateAsync({
        bookingId,
        emailType,
        customMessage: message,
      })
      toast({
        title: "Email sent",
        description: `Email has been sent successfully to ${(bookingData.guestInfo as any)?.email || 'guest'}.`,
      })
      if (emailType === 'custom') {
        setCustomEmailDialogOpen(false)
        setCustomMessage("")
      }
    } catch (error) {
      logger.error("Error sending email", error as Error)
      toast({
        title: "Email failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "CHECKED_IN":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "CHECKED_OUT":
        return <CheckCircle className="h-5 w-5 text-purple-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-slate-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
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
        return status || "Unknown"
    }
  }

  const getStatusClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-50 text-green-700 border-green-200"
      case "CHECKED_IN":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200"
      case "CHECKED_OUT":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0A4A4A] mx-auto mb-4" />
          <p className="text-slate-600 font-alegreya">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-cormorant font-semibold text-slate-800 mb-2">Booking Not Found</h2>
          <p className="text-slate-600 font-alegreya mb-4">
            {error ? (error as Error).message : "The booking you're looking for doesn't exist."}
          </p>
          <Link href="/admin/bookings">
            <Button variant="outline">Back to Bookings</Button>
          </Link>
        </div>
      </div>
    )
  }

  const bookingData = booking as any
  const guestInfo = bookingData.guestInfo || {}
  const room = bookingData.roomId || bookingData.room || {}
  const checkIn = bookingData.checkIn ? new Date(bookingData.checkIn) : null
  const checkOut = bookingData.checkOut ? new Date(bookingData.checkOut) : null
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const bookingStatus = (bookingData.bookingStatus || status || "").toUpperCase()
  const paymentStatus = (bookingData.paymentStatus || "").toUpperCase()
  const canRefund = paymentStatus === "PAID" && bookingStatus !== "CANCELLED"
  const canCancel = bookingStatus !== "CANCELLED" && bookingStatus !== "CHECKED_OUT"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/bookings" className="text-slate-500 hover:text-[#0A4A4A]">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-cormorant font-light text-slate-800">
              Κράτηση #{bookingData.bookingNumber || bookingId.slice(-8)}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(bookingStatus)}`}>
              {getStatusIcon(bookingStatus)}
              <span className="ml-1 font-alegreya">{getStatusText(bookingStatus)}</span>
            </span>
          </div>
          <p className="text-slate-600 font-alegreya mt-1">
            Δημιουργήθηκε στις {bookingData.createdAt ? format(new Date(bookingData.createdAt), "PPP 'στις' HH:mm") : "N/A"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="font-alegreya"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Booking Details */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Λεπτομέρειες Κράτησης</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                      <Calendar className="h-4 w-4" />
                      Ημερομηνίες
                    </div>
                    <div className="font-alegreya">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span className="font-medium">{checkIn ? format(checkIn, "PPP") : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-medium">{checkOut ? format(checkOut, "PPP") : "N/A"}</span>
                      </div>
                      {nights > 0 && (
                        <div className="flex justify-between">
                          <span>Διανυκτερεύσεις:</span>
                          <span className="font-medium">{nights}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                      <Home className="h-4 w-4" />
                      Δωμάτιο
                    </div>
                    <div className="font-alegreya">
                      <div className="flex justify-between">
                        <span>Τύπος:</span>
                        <span className="font-medium">{room?.name || "N/A"}</span>
                      </div>
                      {room?.type && (
                        <div className="flex justify-between">
                          <span>Τύπος:</span>
                          <span className="font-medium">{room.type}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                      <User className="h-4 w-4" />
                      Επισκέπτες
                    </div>
                    <div className="font-alegreya">
                      <div className="flex justify-between">
                        <span>Ενήλικες:</span>
                        <span className="font-medium">{bookingData.adults || guestInfo.adults || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Παιδιά:</span>
                        <span className="font-medium">{bookingData.children || guestInfo.children || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                      <CreditCard className="h-4 w-4" />
                      Πληρωμή
                    </div>
                    <div className="font-alegreya">
                      <div className="flex justify-between">
                        <span>Μέθοδος:</span>
                        <span className="font-medium">
                          {bookingData.paymentMethod === "CARD" ? "Κάρτα" : bookingData.paymentMethod === "CASH" ? "Μετρητά" : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Κατάσταση:</span>
                        <span className={`font-medium ${
                          paymentStatus === "PAID" ? "text-green-600" :
                          paymentStatus === "REFUNDED" ? "text-red-600" :
                          paymentStatus === "FAILED" ? "text-red-600" :
                          "text-yellow-600"
                        }`}>
                          {paymentStatus || "PENDING"}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Σύνολο:</span>
                        <span className="text-[#0A4A4A]">€{bookingData.totalAmount?.toFixed(2) || "0.00"}</span>
                      </div>
                      {bookingData.refundAmount && bookingData.refundAmount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Επιστροφή:</span>
                          <span className="font-medium">€{bookingData.refundAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {bookingData.stripePaymentIntentId && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                        <CreditCard className="h-4 w-4" />
                        Stripe Payment
                      </div>
                      <div className="font-alegreya text-xs text-slate-600">
                        ID: {bookingData.stripePaymentIntentId}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                      <Mail className="h-4 w-4" />
                      Ειδικά Αιτήματα
                    </div>
                    <p className="font-alegreya text-slate-700 text-sm">
                      {guestInfo.specialRequests || bookingData.specialRequests || "Δεν υπάρχουν ειδικά αιτήματα"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          {bookingData.history && bookingData.history.length > 0 && (
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-cormorant font-semibold text-slate-800">Ιστορικό Κράτησης</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {bookingData.history.map((item: any, index: number) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#0A4A4A] mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-alegreya">
                          {item.date ? format(new Date(item.date), "PPP 'στις' HH:mm") : "N/A"}
                        </p>
                        <p className="font-alegreya">
                          {item.action} {item.user ? <span className="text-slate-500">από {item.user}</span> : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add Note */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Σημειώσεις Διαχειριστή</h2>
            </div>
            <div className="p-6">
              <Textarea
                placeholder="Προσθέστε μια σημείωση για αυτή την κράτηση..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="font-alegreya mb-4"
                rows={3}
              />
              <Button
                onClick={handleSaveNotes}
                disabled={updateStatusMutation.isPending}
                className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Αποθήκευση Σημείωσης"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Guest Information */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Στοιχεία Επισκέπτη</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                    <User className="h-4 w-4" />
                    Όνομα
                  </div>
                  <p className="font-alegreya font-medium">
                    {guestInfo.firstName} {guestInfo.lastName}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="font-alegreya text-sm break-all">{guestInfo.email || "N/A"}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                    <Phone className="h-4 w-4" />
                    Τηλέφωνο
                  </div>
                  <p className="font-alegreya">{guestInfo.phone || "N/A"}</p>
                </div>
                {guestInfo.language && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                      <User className="h-4 w-4" />
                      Γλώσσα
                    </div>
                    <p className="font-alegreya">{guestInfo.language.toUpperCase()}</p>
                  </div>
                )}
              </div>
              {guestInfo.email && (
                <div className="mt-6">
                  <Link
                    href={`/admin/guests/${encodeURIComponent(guestInfo.email)}`}
                    className="text-sm text-[#0A4A4A] hover:underline font-alegreya"
                  >
                    Προβολή προφίλ επισκέπτη →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Ενέργειες</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Αλλαγή Κατάστασης
                  </label>
                  <Select
                    value={status}
                    onValueChange={updateStatusMutation.isPending ? () => {} : handleStatusChange}
                  >
                    <SelectTrigger className={`font-alegreya ${updateStatusMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                </div>

                <div className="pt-4 space-y-2 border-t">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
                      Αποστολή Email
                    </label>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleSendEmail('confirmation')}
                        disabled={sendEmailMutation.isPending || !guestInfo.email}
                        variant="outline"
                        className="w-full font-alegreya"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {sendEmailMutation.isPending ? "Sending..." : "Αποστολή Επιβεβαίωσης"}
                      </Button>
                      <Button
                        onClick={() => handleSendEmail('reminder')}
                        disabled={sendEmailMutation.isPending || !guestInfo.email}
                        variant="outline"
                        className="w-full font-alegreya"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {sendEmailMutation.isPending ? "Sending..." : "Αποστολή Υπενθύμισης"}
                      </Button>
                      <Button
                        onClick={() => setCustomEmailDialogOpen(true)}
                        disabled={sendEmailMutation.isPending || !guestInfo.email}
                        variant="outline"
                        className="w-full font-alegreya"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Προσαρμοσμένο Email
                      </Button>
                    </div>
                  </div>
                  {canRefund && (
                    <Button
                      onClick={() => setRefundDialogOpen(true)}
                      disabled={refundMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-alegreya"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      {refundMutation.isPending ? "Processing..." : "Refund Payment"}
                    </Button>
                  )}
                  {canCancel && (
                    <Button
                      variant="outline"
                      onClick={() => setCancelDialogOpen(true)}
                      disabled={cancelMutation.isPending}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-alegreya"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Ακύρωση Κράτησης
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Booking Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ακύρωση Κράτησης</AlertDialogTitle>
            <AlertDialogDescription className="font-alegreya space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Λόγος Ακύρωσης</label>
                <Textarea
                  placeholder="Εισάγετε τον λόγο ακύρωσης..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows={3}
                />
              </div>
              {paymentStatus === "PAID" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ποσό Επιστροφής (€)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">Αφήστε κενό για πλήρη επιστροφή</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Σημειώσεις Διαχειριστή</label>
                <Textarea
                  placeholder="Προαιρετικές σημειώσεις..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Άκυρο</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700"
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ακύρωση...
                </>
              ) : (
                "Ναι, Ακύρωση"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Refund Dialog */}
      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Επιστροφή Χρημάτων</AlertDialogTitle>
            <AlertDialogDescription className="font-alegreya">
              Είστε σίγουροι ότι θέλετε να επιστρέψετε τα χρήματα για αυτή την κράτηση;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Σύνολο Κράτησης:</span>
                <span className="font-semibold">€{bookingData.totalAmount?.toFixed(2) || "0.00"}</span>
              </div>
              {bookingData.paymentMethod === "CARD" && bookingData.stripePaymentIntentId ? (
                <p className="text-sm text-slate-600">Η επιστροφή θα γίνει μέσω Stripe.</p>
              ) : (
                <p className="text-sm text-yellow-600">Προσοχή: Αυτή είναι μια πληρωμή μετρητά. Θα χρειαστεί χειροκίνητη επεξεργασία.</p>
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Άκυρο</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRefund}
              className="bg-green-600 hover:bg-green-700"
              disabled={refundMutation.isPending}
            >
              {refundMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Ναι, Επιστροφή"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Custom Email Dialog */}
      <AlertDialog open={customEmailDialogOpen} onOpenChange={setCustomEmailDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Αποστολή Προσαρμοσμένου Email</AlertDialogTitle>
            <AlertDialogDescription className="font-alegreya">
              Στείλτε ένα προσαρμοσμένο μήνυμα στον επισκέπτη.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Μήνυμα</label>
              <Textarea
                placeholder="Εισάγετε το μήνυμα που θέλετε να στείλετε..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={6}
                className="font-alegreya min-h-[120px]"
              />
              <p className="text-xs text-slate-500 mt-1">Το email θα σταλεί στο: {guestInfo.email || "N/A"}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setCustomEmailDialogOpen(false)
              setCustomMessage("")
            }}>Άκυρο</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSendEmail('custom', customMessage)}
              className="bg-[#0A4A4A] hover:bg-[#083a3a]"
              disabled={sendEmailMutation.isPending || !customMessage.trim()}
            >
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Αποστολή"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
