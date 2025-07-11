"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, User, Home, CreditCard, Mail, Phone, Clock, CheckCircle, XCircle } from "lucide-react"

// Mock data - in a real app, this would come from your database
const bookingData = {
  id: "AST-2024-001",
  guest: {
    name: "Μαρία Παπαδοπούλου",
    email: "maria@example.com",
    phone: "+30 694 123 4567",
  },
  room: {
    type: "Standard Δωμάτιο",
    number: "101",
  },
  dates: {
    checkIn: "2024-01-15",
    checkOut: "2024-01-17",
    nights: 2,
  },
  guests: {
    adults: 2,
    children: 0,
  },
  payment: {
    method: "Μετρητά κατά την άφιξη",
    status: "pending",
    subtotal: "120.00€",
    tax: "15.60€",
    total: "135.60€",
  },
  status: "confirmed",
  specialRequests: "Θα θέλαμε ένα δωμάτιο με θέα στη θάλασσα, αν είναι δυνατόν.",
  created: "2024-01-05 14:32",
  history: [
    {
      date: "2024-01-05 14:32",
      action: "Δημιουργία κράτησης",
      user: "Πελάτης",
    },
    {
      date: "2024-01-05 15:10",
      action: "Επιβεβαίωση κράτησης",
      user: "Σύστημα",
    },
    {
      date: "2024-01-06 09:45",
      action: "Αποστολή email επιβεβαίωσης",
      user: "Σύστημα",
    },
  ],
}

export default function BookingDetailPage({ params }: { params: { bookingId: string } }) {
  const [status, setStatus] = useState(bookingData.status)
  const [notes, setNotes] = useState("")

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    // In a real app, you would update the booking status in the database
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "checked-in":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Επιβεβαιωμένη"
      case "pending":
        return "Εκκρεμής"
      case "cancelled":
        return "Ακυρωμένη"
      case "checked-in":
        return "Check-in"
      case "checked-out":
        return "Check-out"
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200"
      case "checked-in":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      case "checked-out":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/bookings" className="text-slate-500 hover:text-[#0A4A4A]">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-cormorant font-light text-slate-800">Κράτηση #{params.bookingId}</h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(
                status,
              )}`}
            >
              {getStatusIcon(status)}
              <span className="ml-1 font-alegreya">{getStatusText(status)}</span>
            </span>
          </div>
          <p className="text-slate-600 font-alegreya mt-1">Δημιουργήθηκε στις {bookingData.created}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-alegreya">
            Αποστολή Email
          </Button>
          <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">Εκτύπωση</Button>
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
                        <span className="font-medium">{bookingData.dates.checkIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-medium">{bookingData.dates.checkOut}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Διανυκτερεύσεις:</span>
                        <span className="font-medium">{bookingData.dates.nights}</span>
                      </div>
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
                        <span className="font-medium">{bookingData.room.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Αριθμός:</span>
                        <span className="font-medium">{bookingData.room.number}</span>
                      </div>
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
                        <span className="font-medium">{bookingData.guests.adults}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Παιδιά:</span>
                        <span className="font-medium">{bookingData.guests.children}</span>
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
                        <span className="font-medium">{bookingData.payment.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Υποσύνολο:</span>
                        <span className="font-medium">{bookingData.payment.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Φόρος:</span>
                        <span className="font-medium">{bookingData.payment.tax}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Σύνολο:</span>
                        <span className="text-[#0A4A4A]">{bookingData.payment.total}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                      <Mail className="h-4 w-4" />
                      Ειδικά Αιτήματα
                    </div>
                    <p className="font-alegreya text-slate-700">
                      {bookingData.specialRequests || "Δεν υπάρχουν ειδικά αιτήματα"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Ιστορικό Κράτησης</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {bookingData.history.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#0A4A4A] mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-alegreya">{item.date}</p>
                      <p className="font-alegreya">
                        {item.action} <span className="text-slate-500">από {item.user}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Note */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Προσθήκη Σημείωσης</h2>
            </div>
            <div className="p-6">
              <Textarea
                placeholder="Προσθέστε μια σημείωση για αυτή την κράτηση..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="font-alegreya mb-4"
                rows={3}
              />
              <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">Προσθήκη Σημείωσης</Button>
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
                  <p className="font-alegreya font-medium">{bookingData.guest.name}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="font-alegreya">{bookingData.guest.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-alegreya mb-1">
                    <Phone className="h-4 w-4" />
                    Τηλέφωνο
                  </div>
                  <p className="font-alegreya">{bookingData.guest.phone}</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/admin/guests" className="text-sm text-[#0A4A4A] hover:underline font-alegreya">
                  Προβολή προφίλ επισκέπτη →
                </Link>
              </div>
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
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="font-alegreya">
                      <SelectValue placeholder="Επιλέξτε κατάσταση" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Εκκρεμής</SelectItem>
                      <SelectItem value="confirmed">Επιβεβαιωμένη</SelectItem>
                      <SelectItem value="checked-in">Check-in</SelectItem>
                      <SelectItem value="checked-out">Check-out</SelectItem>
                      <SelectItem value="cancelled">Ακυρωμένη</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
                    Επεξεργασία Κράτησης
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-alegreya"
                  >
                    Ακύρωση Κράτησης
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
