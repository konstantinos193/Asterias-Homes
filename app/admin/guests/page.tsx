"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Mail, Phone, Calendar, User } from "lucide-react"

// Mock data - in a real app, this would come from your database
const guests = [
  {
    id: "1",
    name: "Μαρία Παπαδοπούλου",
    email: "maria@example.com",
    phone: "+30 694 123 4567",
    country: "Ελλάδα",
    visits: 3,
    lastVisit: "2024-01-17",
    status: "active",
  },
  {
    id: "2",
    name: "Γιάννης Κωνσταντίνου",
    email: "giannis@example.com",
    phone: "+30 697 765 4321",
    country: "Ελλάδα",
    visits: 1,
    lastVisit: "2024-01-20",
    status: "active",
  },
  {
    id: "3",
    name: "Ελένη Μιχαηλίδου",
    email: "eleni@example.com",
    phone: "+30 698 222 3333",
    country: "Ελλάδα",
    visits: 2,
    lastVisit: "2024-01-21",
    status: "active",
  },
  {
    id: "4",
    name: "Δημήτρης Αντωνίου",
    email: "dimitris@example.com",
    phone: "+30 691 444 5555",
    country: "Ελλάδα",
    visits: 1,
    lastVisit: "2024-01-22",
    status: "active",
  },
  {
    id: "5",
    name: "Σοφία Γεωργίου",
    email: "sofia@example.com",
    phone: "+30 693 666 7777",
    country: "Ελλάδα",
    visits: 0,
    lastVisit: "",
    status: "pending",
  },
  {
    id: "6",
    name: "Hans Schmidt",
    email: "hans@example.com",
    phone: "+49 123 456 7890",
    country: "Γερμανία",
    visits: 2,
    lastVisit: "2023-12-15",
    status: "active",
  },
  {
    id: "7",
    name: "Emma Johnson",
    email: "emma@example.com",
    phone: "+44 7700 900123",
    country: "Ηνωμένο Βασίλειο",
    visits: 1,
    lastVisit: "2023-11-10",
    status: "inactive",
  },
]

export default function GuestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || guest.status === statusFilter
    const matchesCountry = countryFilter === "all" || guest.country === countryFilter

    return matchesSearch && matchesStatus && matchesCountry
  })

  const countries = Array.from(new Set(guests.map((guest) => guest.country)))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">Διαχείριση Επισκεπτών</h1>
          <p className="text-slate-600 font-alegreya">Προβολή και διαχείριση όλων των επισκεπτών</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">Εξαγωγή Λίστας</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Αναζήτηση με όνομα, email ή τηλέφωνο..."
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
                  <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
                  <SelectItem value="active">Ενεργοί</SelectItem>
                  <SelectItem value="pending">Εκκρεμείς</SelectItem>
                  <SelectItem value="inactive">Ανενεργοί</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="font-alegreya">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Χώρα" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες οι χώρες</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
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
                  Επικοινωνία
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Χώρα
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Επισκέψεις
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Τελευταία Επίσκεψη
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Κατάσταση
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
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#0A4A4A]/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-[#0A4A4A]" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 font-alegreya">{guest.name}</div>
                        <div className="text-sm text-slate-500 font-alegreya">ID: {guest.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 font-alegreya flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-slate-400" />
                      {guest.email}
                    </div>
                    <div className="text-sm text-slate-700 font-alegreya flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-slate-400" />
                      {guest.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">{guest.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">{guest.visits}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    {guest.lastVisit ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                        {guest.lastVisit}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        guest.status === "active"
                          ? "bg-green-50 text-green-700"
                          : guest.status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-slate-50 text-slate-700"
                      }`}
                    >
                      {guest.status === "active" ? "Ενεργός" : guest.status === "pending" ? "Εκκρεμής" : "Ανενεργός"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/guests/${guest.id}`}
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
        {filteredGuests.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-500 font-alegreya">Δεν βρέθηκαν επισκέπτες με τα επιλεγμένα κριτήρια</p>
          </div>
        )}
      </div>
    </div>
  )
}
