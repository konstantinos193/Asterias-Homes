"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useMyBookings, useCancelBooking, Booking } from "@/hooks/api/use-bookings"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Euro,
  Users,
  Home,
  Mail,
  Phone,
  FileText,
  Trash2,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { el, enUS, de } from "date-fns/locale"
import { logger } from "@/lib/logger"
import { useToast } from "@/hooks/use-toast"

const dateLocales = { el, en: enUS, de }

export default function MyBookingsPage() {
  const { t, language } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)

  const { data, isLoading, error } = useMyBookings({ page, limit: 10, status: statusFilter !== "all" ? statusFilter : undefined, enabled: !!user && !authLoading })
  const cancelBookingMutation = useCancelBooking()

  // Redirect to bookings page if not authenticated (using useEffect to avoid render issues)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${language}/bookings`)
    }
  }, [authLoading, user, router, language])

  const bookings = data?.bookings || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, pages: 1 }

  const dateLocale = dateLocales[language as keyof typeof dateLocales] || enUS

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
    return t(`myBookings.status.${status?.toLowerCase() || "unknown"}`, status)
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

  const canCancel = (booking: Booking) => {
    const status = (booking.bookingStatus as string)?.toUpperCase()
    return status === "CONFIRMED" || status === "PENDING"
  }

  const handleCancelClick = (bookingId: string) => {
    setSelectedBookingId(bookingId)
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = async () => {
    if (!selectedBookingId) return

    try {
      await cancelBookingMutation.mutateAsync(selectedBookingId)
      toast({
        title: t("myBookings.cancelSuccess", "Booking cancelled successfully"),
        description: t("myBookings.cancelSuccessDescription", "Your booking has been cancelled."),
      })
      setCancelDialogOpen(false)
      setSelectedBookingId(null)
    } catch (error) {
      logger.error("Error cancelling booking", error as Error)
      toast({
        title: t("myBookings.cancelError", "Cancellation failed"),
        description: t("myBookings.cancelErrorDescription", "Failed to cancel booking. Please try again or contact support."),
        variant: "destructive",
      })
    }
  }

  // Don't render anything if redirecting
  if (!authLoading && !user) {
    return null
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0A4A4A] mx-auto mb-4" />
          <p className="text-slate-600 font-alegreya">{t("common.loading", "Loading...")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {t("myBookings.errorTitle", "Error loading bookings")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 font-alegreya mb-4">
              {t("myBookings.errorDescription", "There was an error loading your bookings. Please try again later.")}
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              {t("common.retry", "Retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-br from-[#0A4A4A] to-[#083a3a] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.07)_0%,transparent_80%)]"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl font-cormorant font-light mb-4">
              {t("myBookings.title", "My Bookings")}
            </h1>
            <div className="w-24 h-0.5 bg-[#E8E2D5] mx-auto mb-4"></div>
            <p className="text-xl font-alegreya opacity-90">
              {t("myBookings.subtitle", "View and manage your apartment reservations")}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-20 relative z-20">
        {/* Filters and Stats */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 font-alegreya bg-white">
                <SelectValue placeholder={t("myBookings.filterStatus", "Filter by status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("myBookings.status.all", "All Bookings")}</SelectItem>
                <SelectItem value="CONFIRMED">{t("myBookings.status.confirmed", "Confirmed")}</SelectItem>
                <SelectItem value="PENDING">{t("myBookings.status.pending", "Pending")}</SelectItem>
                <SelectItem value="CHECKED_IN">{t("myBookings.status.checked_in", "Checked In")}</SelectItem>
                <SelectItem value="CHECKED_OUT">{t("myBookings.status.checked_out", "Checked Out")}</SelectItem>
                <SelectItem value="CANCELLED">{t("myBookings.status.cancelled", "Cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-slate-600 font-alegreya">
            {t("myBookings.totalBookings", "Total: {count} bookings").replace("{count}", pagination.total.toString())}
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">{t("myBookings.noBookingsTitle", "No Bookings Found")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 font-alegreya mb-6">
                {t("myBookings.noBookingsDescription", "You don't have any bookings yet. Start by searching for available apartments.")}
              </p>
              <Link href={`/${language}/bookings`}>
                <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white">
                  {t("nav.bookings", "Book Now")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 max-w-6xl mx-auto">
            {bookings.map((booking: Booking) => {
              const bookingId = (booking._id || booking.id) as string
              const guestInfo = booking.guestInfo as any
              const room = booking.room as any || booking.roomId as any
              const checkIn = booking.checkIn ? new Date(booking.checkIn) : null
              const checkOut = booking.checkOut ? new Date(booking.checkOut) : null
              const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
              const bookingStatus = (booking.bookingStatus as string) || "UNKNOWN"

              return (
                <Card key={bookingId} className="overflow-hidden">
                  <CardHeader className="bg-slate-50 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <CardTitle className="text-lg font-cormorant">
                            {t("myBookings.bookingNumber", "Booking #{number}").replace("{number}", String(booking.bookingNumber || bookingId.slice(-8)))}
                          </CardTitle>
                          <CardDescription className="font-alegreya mt-1">
                            {booking.createdAt
                              ? format(new Date(booking.createdAt as string), "PPP", { locale: dateLocale })
                              : t("myBookings.unknownDate", "Date unknown")}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(bookingStatus)}`}
                        >
                          {getStatusIcon(bookingStatus)}
                          <span className="font-alegreya">{getStatusText(bookingStatus)}</span>
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Dates */}
                      <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-2">
                          <Calendar className="h-4 w-4" />
                          {t("myBookings.dates", "Dates")}
                        </div>
                        <div className="font-alegreya">
                          <div className="font-medium">{t("myBookings.checkIn", "Check-in")}</div>
                          <div className="text-slate-600">
                            {checkIn ? format(checkIn, "PPP", { locale: dateLocale }) : "-"}
                          </div>
                          <div className="font-medium mt-2">{t("myBookings.checkOut", "Check-out")}</div>
                          <div className="text-slate-600">
                            {checkOut ? format(checkOut, "PPP", { locale: dateLocale }) : "-"}
                          </div>
                          {nights > 0 && (
                            <div className="text-sm text-slate-500 mt-2">
                              {nights} {nights === 1 ? t("bookingsPage.summary.nights_one", "night") : t("bookingsPage.summary.nights_other", "nights")}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Room */}
                      <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-2">
                          <Home className="h-4 w-4" />
                          {t("myBookings.room", "Apartment")}
                        </div>
                        <div className="font-alegreya">
                          <div className="font-medium">{room?.name || t("myBookings.standardApartment", "Standard Apartment")}</div>
                          {room?.type && <div className="text-sm text-slate-600">{room.type}</div>}
                        </div>
                      </div>

                      {/* Guests */}
                      <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-2">
                          <Users className="h-4 w-4" />
                          {t("myBookings.guests", "Guests")}
                        </div>
                        <div className="font-alegreya">
                          <div className="font-medium">
                            {booking.adults || guestInfo?.adults || 0}{" "}
                            {t("bookingsPage.summary.adults_other", "Adults")}
                          </div>
                          {(booking.children || guestInfo?.children || 0) > 0 && (
                            <div className="text-sm text-slate-600">
                              {booking.children || guestInfo?.children || 0}{" "}
                              {t("bookingsPage.summary.children_other", "Children")}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment */}
                      <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-2">
                          <Euro className="h-4 w-4" />
                          {t("myBookings.total", "Total")}
                        </div>
                        <div className="font-alegreya">
                          <div className="text-lg font-semibold text-[#0A4A4A]">
                            €{booking.totalAmount?.toFixed(2) || "0.00"}
                          </div>
                          <div className="text-sm text-slate-600">
                            {t(`myBookings.paymentStatus.${(booking.paymentStatus as string)?.toLowerCase() || "pending"}`, String(booking.paymentStatus || "pending"))}
                          </div>
                          {booking.paymentMethod ? (
                            <div className="text-xs text-slate-500 mt-1">
                              {String(booking.paymentMethod) === "CARD" ? t("myBookings.paymentMethod.card", "Card") : t("myBookings.paymentMethod.cash", "Cash")}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Guest Info */}
                    {guestInfo && (
                      <div className="mt-6 pt-6 border-t">
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-3">
                          <FileText className="h-4 w-4" />
                          {t("myBookings.guestInformation", "Guest Information")}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-alegreya">
                          <div>
                            <div className="text-sm text-slate-500">{t("myBookings.guestName", "Name")}</div>
                            <div className="font-medium">
                              {guestInfo.firstName} {guestInfo.lastName}
                            </div>
                          </div>
                          {guestInfo.email && (
                            <div>
                              <div className="flex items-center gap-1 text-sm text-slate-500">
                                <Mail className="h-3 w-3" />
                                {t("myBookings.email", "Email")}
                              </div>
                              <div className="font-medium text-sm break-all">{guestInfo.email}</div>
                            </div>
                          )}
                          {guestInfo.phone && (
                            <div>
                              <div className="flex items-center gap-1 text-sm text-slate-500">
                                <Phone className="h-3 w-3" />
                                {t("myBookings.phone", "Phone")}
                              </div>
                              <div className="font-medium">{guestInfo.phone}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {canCancel(booking) && (
                      <div className="mt-6 pt-6 border-t flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => handleCancelClick(bookingId)}
                          disabled={cancelBookingMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("myBookings.cancelBooking", "Cancel Booking")}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {t("common.previous", "Previous")}
                </Button>
                <span className="text-slate-600 font-alegreya">
                  {t("myBookings.pageInfo", "Page {current} of {total}", {
                    current: pagination.page,
                    total: pagination.pages,
                  })}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                >
                  {t("common.next", "Next")}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("myBookings.cancelConfirmTitle", "Cancel Booking?")}</AlertDialogTitle>
            <AlertDialogDescription className="font-alegreya">
              {t("myBookings.cancelConfirmDescription", "Are you sure you want to cancel this booking? This action cannot be undone. If you've already made a payment, a refund will be processed according to our cancellation policy.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.cancelling", "Cancelling...")}
                </>
              ) : (
                t("myBookings.confirmCancel", "Yes, Cancel Booking")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

