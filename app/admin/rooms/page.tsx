"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react"
import { adminAPI } from "@/lib/api"

// Mock data - in a real app, this would come from your database
const rooms = [
  {
    id: "standard",
    number: "101",
    name: "Standard Δωμάτιο",
    capacity: 2,
    price: 60,
    status: "available",
    image: "/room-1.png",
  },
  {
    id: "standard-2",
    number: "102",
    name: "Standard Δωμάτιο",
    capacity: 2,
    price: 60,
    status: "occupied",
    image: "/room-1.png",
  },
  {
    id: "standard-3",
    number: "103",
    name: "Standard Δωμάτιο",
    capacity: 2,
    price: 60,
    status: "maintenance",
    image: "/room-1.png",
  },
  {
    id: "family",
    number: "201",
    name: "Οικογενειακό Δωμάτιο",
    capacity: 4,
    price: 80,
    status: "available",
    image: "/room-2.png",
  },
  {
    id: "family-2",
    number: "202",
    name: "Οικογενειακό Δωμάτιο",
    capacity: 4,
    price: 80,
    status: "occupied",
    image: "/room-2.png",
  },
  {
    id: "romantic",
    number: "301",
    name: "Ρομαντικό Δωμάτιο",
    capacity: 2,
    price: 100,
    status: "available",
    image: "/room-3.png",
  },
]

const getStatusText = (status: string) => {
  switch (status) {
    case "available":
      return "Διαθέσιμο"
    case "occupied":
      return "Κατειλημμένο"
    case "maintenance":
      return "Συντήρηση"
    case "reserved":
      return "Κρατημένο"
    default:
      return status
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-50 text-green-700 border-green-200"
    case "occupied":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "maintenance":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "reserved":
      return "bg-purple-50 text-purple-700 border-purple-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await adminAPI.getAllRooms()
        setRooms(response.rooms || [])
      } catch (err: any) {
        setError(err.message || "Failed to load rooms")
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || room.available === (statusFilter === "available")
    const matchesType = typeFilter === "all" || room.name === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleDeleteRoom = async (roomId: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await adminAPI.deleteRoom(roomId)
        // Refresh rooms after deletion
        const response = await adminAPI.getAllRooms()
        setRooms(response.rooms || [])
      } catch (err: any) {
        setError(err.message || "Failed to delete room")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 font-alegreya">Loading rooms...</div>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">Διαχείριση Δωματίων</h1>
          <p className="text-slate-600 font-alegreya">Προβολή και διαχείριση όλων των δωματίων</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/rooms/new">
            <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
              <Plus className="h-4 w-4 mr-2" />
              Προσθήκη Δωματίου
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Αναζήτηση με αριθμό ή όνομα δωματίου..."
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
                  <SelectItem value="available">Διαθέσιμα</SelectItem>
                  <SelectItem value="occupied">Κατειλημμένα</SelectItem>
                  <SelectItem value="maintenance">Συντήρηση</SelectItem>
                  <SelectItem value="reserved">Κρατημένα</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="font-alegreya">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Τύπος" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλοι οι τύποι</SelectItem>
                  <SelectItem value="Standard Δωμάτιο">Standard</SelectItem>
                  <SelectItem value="Οικογενειακό Δωμάτιο">Οικογενειακό</SelectItem>
                  <SelectItem value="Ρομαντικό Δωμάτιο">Ρομαντικό</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room._id} className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="relative h-48">
              <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(
                    room.available ? "available" : "occupied",
                  )}`}
                >
                  {getStatusText(room.available ? "available" : "occupied")}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-cormorant font-semibold text-slate-800">{room.name}</h3>
                  <p className="text-sm text-slate-600 font-alegreya">{room.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-cormorant font-semibold text-[#0A4A4A]">€{room.price}</p>
                  <p className="text-xs text-slate-500 font-alegreya">ανά διανυκτέρευση</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 font-alegreya mb-4">
                <span>Χωρητικότητα: {room.capacity} άτομα</span>
                {room.size && <span>• {room.size}</span>}
              </div>
              <div className="flex justify-between">
                <Link href={`/rooms/${room._id}`}>
                  <Button variant="outline" size="sm" className="font-alegreya">
                    <Eye className="h-4 w-4 mr-1" />
                    Προβολή
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Link href={`/admin/rooms/${room._id}`}>
                    <Button variant="outline" size="sm" className="font-alegreya">
                      <Edit className="h-4 w-4 mr-1" />
                      Επεξεργασία
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 font-alegreya"
                    onClick={() => handleDeleteRoom(room._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="bg-white p-12 rounded-sm border border-slate-200 text-center">
          <p className="text-slate-500 font-alegreya">Δεν βρέθηκαν δωμάτια με τα επιλεγμένα κριτήρια</p>
        </div>
      )}
    </div>
  )
}
