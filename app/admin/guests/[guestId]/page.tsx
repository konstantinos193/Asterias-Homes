"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Phone, Calendar, User, CreditCard, Clock, Loader2 } from "lucide-react"
import { useGuestByEmail, useUpdateGuest, useDeleteGuest, useAdminUsers } from "@/hooks/api/use-admin"
import { useToast } from "@/components/ui/use-toast"

// Helper function to determine if a string is an email
function isEmail(str: string): boolean {
  return str.includes("@") && str.includes(".")
}

// Helper function to get email from guestId (could be MongoDB _id or email)
function getEmailFromGuestId(guestId: string, users: any[]): string | null {
  if (isEmail(guestId)) {
    return guestId
  }
  // If it's a MongoDB _id, find the user with matching _id and get their email
  const user = users.find((u) => u._id === guestId)
  return user?.email || null
}

export default function GuestDetailPage({ params }: { params: { guestId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: usersData = [] } = useAdminUsers()
  const users = Array.isArray(usersData) ? usersData : []

  // Determine email from guestId
  const email = useMemo(() => {
    return getEmailFromGuestId(params.guestId, users)
  }, [params.guestId, users])

  // Fetch guest data
  const { data: guestData, isLoading, error } = useGuestByEmail(email || null)
  const updateGuestMutation = useUpdateGuest()
  const deleteGuestMutation = useDeleteGuest()

  // Transform backend data to frontend format
  const transformedGuest = useMemo(() => {
    if (!guestData?.guest) return null

    const guest = guestData.guest as any
    const bookings = (guestData.bookings || []) as any[]

    return {
      id: guest._id || guest.email,
      email: guest.email || "",
      name: guest.firstName && guest.lastName 
        ? `${guest.firstName} ${guest.lastName}`.trim()
        : guest.firstName || guest.lastName || guest.name || "",
      firstName: guest.firstName || "",
      lastName: guest.lastName || "",
      phone: guest.phone || "",
      country: guest.country || "",
      address: guest.address || "",
      postalCode: guest.postalCode || "",
      visits: guest.totalVisits || 0,
      lastVisit: guest.lastVisit ? new Date(guest.lastVisit).toISOString().split("T")[0] : "",
      status: guest.status || "active",
      notes: guest.notes || "",
      totalSpent: guest.totalSpent || 0,
      bookings: bookings.map((booking: any) => ({
        id: booking._id || booking.bookingNumber || booking.id || "",
        room: booking.roomId?.name || booking.roomType || "Unknown Room",
        checkIn: booking.checkIn ? new Date(booking.checkIn).toISOString().split("T")[0] : "",
        checkOut: booking.checkOut ? new Date(booking.checkOut).toISOString().split("T")[0] : "",
        status: booking.bookingStatus?.toLowerCase() || "completed",
        total: `${booking.totalAmount?.toFixed(2) || "0.00"}€`,
      })),
    }
  }, [guestData])

  const [guest, setGuest] = useState(transformedGuest)
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Update local state when data loads
  useEffect(() => {
    if (transformedGuest) {
      setGuest(transformedGuest)
      setNotes(transformedGuest.notes || "")
    }
  }, [transformedGuest])

  const handleInputChange = (field: string, value: string) => {
    setGuest((prev) => {
      if (!prev) return prev
      return { ...prev, [field]: value }
    })
  }

  const handleSave = async () => {
    if (!guest || !email) {
      toast({
        title: "Σφάλμα",
        description: "Δεν είναι δυνατή η αποθήκευση. Λείπουν απαραίτητα στοιχεία.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Split name into firstName and lastName if needed
      const nameParts = guest.name.split(" ")
      const firstName = guest.firstName || nameParts[0] || ""
      const lastName = guest.lastName || nameParts.slice(1).join(" ") || ""

      const updateData = {
        firstName: firstName,
        lastName: lastName,
        phone: guest.phone || "",
        country: guest.country || "",
        address: guest.address || "",
        postalCode: guest.postalCode || "",
        status: guest.status || "active",
        notes: notes || "",
      }

      await updateGuestMutation.mutateAsync({ email, data: updateData })

      toast({
        title: "Επιτυχία",
        description: "Τα στοιχεία του επισκέπτη ενημερώθηκαν επιτυχώς.",
      })

      // Refresh data after save
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (error: any) {
      toast({
        title: "Σφάλμα",
        description: error?.message || "Αποτυχία αποθήκευσης των στοιχείων.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!email) {
      toast({
        title: "Σφάλμα",
        description: "Δεν είναι δυνατή η διαγραφή. Λείπει το email.",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον επισκέπτη;")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteGuestMutation.mutateAsync(email)

      toast({
        title: "Επιτυχία",
        description: "Ο επισκέπτης διαγράφηκε επιτυχώς.",
      })

      // Redirect to guests list
      setTimeout(() => {
        router.push("/admin/guests")
      }, 1000)
    } catch (error: any) {
      toast({
        title: "Σφάλμα",
        description: error?.message || "Αποτυχία διαγραφής του επισκέπτη.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
      case "confirmed":
        return "Ολοκληρωμένη"
      case "upcoming":
      case "pending":
        return "Επερχόμενη"
      case "cancelled":
      case "cancelled":
        return "Ακυρωμένη"
      case "checked_in":
        return "Σε Διαμονή"
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
      case "confirmed":
        return "bg-green-50 text-green-700"
      case "upcoming":
      case "pending":
        return "bg-blue-50 text-blue-700"
      case "cancelled":
        return "bg-red-50 text-red-700"
      case "checked_in":
        return "bg-purple-50 text-purple-700"
      default:
        return "bg-slate-50 text-slate-700"
    }
  }

  // Loading state
  if (isLoading || !email) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#0A4A4A]" />
        <span className="ml-3 text-slate-600 font-alegreya">Φόρτωση στοιχείων επισκέπτη...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/admin/guests" className="text-slate-500 hover:text-[#0A4A4A]">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">Προφίλ Επισκέπτη</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-sm p-4">
          <p className="text-red-700 font-alegreya">
            {error instanceof Error ? error.message : "Αποτυχία φόρτωσης των στοιχείων του επισκέπτη."}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/guests")} className="font-alegreya">
          Επιστροφή στη λίστα επισκεπτών
        </Button>
      </div>
    )
  }

  // No guest data
  if (!guest) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/admin/guests" className="text-slate-500 hover:text-[#0A4A4A]">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">Προφίλ Επισκέπτη</h1>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-sm p-4">
          <p className="text-slate-700 font-alegreya">Δεν βρέθηκαν στοιχεία για τον επισκέπτη.</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/guests")} className="font-alegreya">
          Επιστροφή στη λίστα επισκεπτών
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/guests" className="text-slate-500 hover:text-[#0A4A4A]">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-cormorant font-light text-slate-800">Προφίλ Επισκέπτη</h1>
          </div>
          <p className="text-slate-600 font-alegreya mt-1">Email: {guest.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-alegreya" onClick={() => router.push("/admin/guests")}>
            Ακύρωση
          </Button>
          <Button
            className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Αποθήκευση...
              </>
            ) : (
              "Αποθήκευση"
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Προσωπικά Στοιχεία</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Ονοματεπώνυμο</label>
                  <Input
                    value={guest.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Email</label>
                  <Input type="email" value={guest.email} className="font-alegreya" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Τηλέφωνο</label>
                  <Input
                    value={guest.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Χώρα</label>
                  <Input
                    value={guest.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Διεύθυνση</label>
                  <Input
                    value={guest.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Ταχυδρομικός Κώδικας
                  </label>
                  <Input
                    value={guest.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Κατάσταση</label>
                  <Select value={guest.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="font-alegreya">
                      <SelectValue placeholder="Επιλέξτε κατάσταση" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ενεργός</SelectItem>
                      <SelectItem value="pending">Εκκρεμής</SelectItem>
                      <SelectItem value="inactive">Ανενεργός</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Ιστορικό Κρατήσεων</h2>
            </div>
            <div className="p-6">
              {guest.bookings && guest.bookings.length > 0 ? (
                <div className="space-y-4">
                  {guest.bookings.map((booking) => (
                    <div key={booking.id} className="border border-slate-200 rounded-sm p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-900 font-alegreya">{booking.id}</span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                                booking.status,
                              )}`}
                            >
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 font-alegreya">{booking.room}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-700 font-alegreya">
                            {booking.checkIn} - {booking.checkOut}
                          </p>
                          <p className="text-sm font-medium text-[#0A4A4A] font-alegreya">{booking.total}</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="text-sm text-[#0A4A4A] hover:underline font-alegreya"
                        >
                          Προβολή Κράτησης
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 font-alegreya">Δεν υπάρχουν κρατήσεις</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Guest Summary */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Σύνοψη</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="h-24 w-24 bg-[#0A4A4A]/10 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-[#0A4A4A]" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                    <Calendar className="h-4 w-4" />
                    Επισκέψεις
                  </div>
                  <p className="font-alegreya font-medium">{guest.visits} επισκέψεις</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                    <Clock className="h-4 w-4" />
                    Τελευταία Επίσκεψη
                  </div>
                  <p className="font-alegreya">{guest.lastVisit || "Καμία επίσκεψη"}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                    <CreditCard className="h-4 w-4" />
                    Συνολικές Δαπάνες
                  </div>
                  <p className="font-alegreya font-medium">{guest.totalSpent.toFixed(2)}€</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Σημειώσεις</h2>
            </div>
            <div className="p-6">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="font-alegreya mb-4"
                rows={5}
                placeholder="Προσθέστε σημειώσεις για τον επισκέπτη..."
              />
              <Button
                className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Αποθήκευση...
                  </>
                ) : (
                  "Αποθήκευση Σημειώσεων"
                )}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Ενέργειες</h2>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <Button className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
                  <Mail className="h-4 w-4 mr-2" />
                  Αποστολή Email
                </Button>
                <Button variant="outline" className="w-full font-alegreya">
                  <Phone className="h-4 w-4 mr-2" />
                  Κλήση
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-alegreya"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Διαγραφή...
                    </>
                  ) : (
                    "Διαγραφή Επισκέπτη"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
