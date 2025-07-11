"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Phone, Calendar, User, CreditCard, Clock } from "lucide-react"

// Mock guest data
const guestData = {
  id: "1",
  name: "Μαρία Παπαδοπούλου",
  email: "maria@example.com",
  phone: "+30 694 123 4567",
  country: "Ελλάδα",
  address: "Λεωφόρος Αλεξάνδρας 15, Αθήνα",
  postalCode: "11521",
  visits: 3,
  lastVisit: "2024-01-17",
  status: "active",
  notes: "Προτιμά δωμάτια με θέα στη θάλασσα. Αλλεργία στη γύρη.",
  bookings: [
    {
      id: "AST-2024-001",
      room: "Standard Δωμάτιο",
      checkIn: "2024-01-15",
      checkOut: "2024-01-17",
      status: "completed",
      total: "135.60€",
    },
    {
      id: "AST-2023-045",
      room: "Οικογενειακό Δωμάτιο",
      checkIn: "2023-08-10",
      checkOut: "2023-08-15",
      status: "completed",
      total: "452.00€",
    },
    {
      id: "AST-2023-012",
      room: "Ρομαντικό Δωμάτιο",
      checkIn: "2023-02-14",
      checkOut: "2023-02-16",
      status: "completed",
      total: "226.00€",
    },
  ],
}

export default function GuestDetailPage({ params }: { params: { guestId: string } }) {
  const [guest, setGuest] = useState({ ...guestData })
  const [notes, setNotes] = useState(guestData.notes)

  const handleInputChange = (field: string, value: string) => {
    setGuest((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // In a real app, you would save the guest data to the database
    console.log("Saving guest:", { ...guest, notes })
    // Redirect to guests list
    window.location.href = "/admin/guests"
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Ολοκληρωμένη"
      case "upcoming":
        return "Επερχόμενη"
      case "cancelled":
        return "Ακυρωμένη"
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700"
      case "upcoming":
        return "bg-blue-50 text-blue-700"
      case "cancelled":
        return "bg-red-50 text-red-700"
      default:
        return "bg-slate-50 text-slate-700"
    }
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
          <p className="text-slate-600 font-alegreya mt-1">ID: {guest.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-alegreya" onClick={() => (window.location.href = "/admin/guests")}>
            Ακύρωση
          </Button>
          <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya" onClick={handleSave}>
            Αποθήκευση
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
                  <Input
                    type="email"
                    value={guest.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="font-alegreya"
                  />
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
              {guest.bookings.length > 0 ? (
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
                  <p className="font-alegreya font-medium">
                    {guest.bookings
                      .reduce((total, booking) => {
                        const amount = Number.parseFloat(booking.total.replace("€", "").replace(",", "."))
                        return total + amount
                      }, 0)
                      .toFixed(2)}
                    €
                  </p>
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
              <Button className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
                Αποθήκευση Σημειώσεων
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
                >
                  Διαγραφή Επισκέπτη
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
