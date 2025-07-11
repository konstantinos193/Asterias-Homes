"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Clock, AlertCircle, Search, Filter, Download } from "lucide-react"

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
    case "confirmed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "checked-in":
      return <CheckCircle className="h-4 w-4 text-blue-500" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-slate-500" />
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
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">Διαχείριση Κρατήσεων</h1>
          <p className="text-slate-600 font-alegreya">Προβολή και διαχείριση όλων των κρατήσεων</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
            <Download className="h-4 w-4 mr-2" />
            Εξαγωγή
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Αναζήτηση με όνομα, email ή αριθμό κράτησης..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 font-alegreya"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="font-alegreya">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Κατάσταση" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες οι κρατήσεις</SelectItem>
                  <SelectItem value="confirmed">Επιβεβαιωμένες</SelectItem>
                  <SelectItem value="pending">Εκκρεμείς</SelectItem>
                  <SelectItem value="checked-in">Check-in</SelectItem>
                  <SelectItem value="cancelled">Ακυρωμένες</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Αριθμός
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Επισκέπτης
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Δωμάτιο
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Check-in / Check-out
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Κατάσταση
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Σύνολο
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-alegreya">
                    <Link href={`/admin/bookings/${booking.id}`} className="hover:text-[#0A4A4A] hover:underline">
                      {booking.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    <div>{booking.guest}</div>
                    <div className="text-xs text-slate-500">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">{booking.room}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    <div>{booking.checkIn}</div>
                    <div className="text-xs text-slate-500">έως {booking.checkOut}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-alegreya">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(
                        booking.status,
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">{getStatusText(booking.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">{booking.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
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
        {filteredBookings.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-500 font-alegreya">Δεν βρέθηκαν κρατήσεις με τα επιλεγμένα κριτήρια</p>
          </div>
        )}
      </div>
    </div>
  )
}
