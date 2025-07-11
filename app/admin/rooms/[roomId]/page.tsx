"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Plus, Trash2, Wifi, Coffee, Car, Sparkles, Bath, Bed, Eye, Snowflake } from "lucide-react"

// Mock room data
const roomData = {
  id: "standard",
  number: "101",
  name: "Standard Δωμάτιο",
  description:
    "Άνετο δωμάτιο με διπλό κρεβάτι, ιδανικό για ζευγάρια. Διαθέτει κλιματισμό, τηλεόραση και ιδιωτικό μπάνιο με όλες τις σύγχρονες ανέσεις.",
  capacity: 2,
  size: 25,
  price: 60,
  status: "available",
  images: ["/room-1.png", "/room-2.png", "/room-3.png"],
  amenities: [
    { name: "Διπλό Κρεβάτι", icon: "bed" },
    { name: "Κλιματισμός", icon: "snowflake" },
    { name: "Δωρεάν Wi-Fi", icon: "wifi" },
    { name: "Ιδιωτικό Μπάνιο", icon: "bath" },
    { name: "Τηλεόραση", icon: "eye" },
    { name: "Καθημερινή Καθαριότητα", icon: "sparkles" },
  ],
  features: [
    "Διπλό κρεβάτι με ορθοπεδικό στρώμα",
    "Κλιματισμός με ατομικό έλεγχο",
    "Δωρεάν Wi-Fi υψηλής ταχύτητας",
    "Τηλεόραση LED 32 ιντσών",
    "Ιδιωτικό μπάνιο με ντους",
    "Πετσέτες και σεντόνια υψηλής ποιότητας",
    "Καθημερινή καθαριότητα",
    "Θέα στον κήπο",
  ],
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "wifi":
      return <Wifi className="h-4 w-4" />
    case "coffee":
      return <Coffee className="h-4 w-4" />
    case "car":
      return <Car className="h-4 w-4" />
    case "sparkles":
      return <Sparkles className="h-4 w-4" />
    case "bath":
      return <Bath className="h-4 w-4" />
    case "bed":
      return <Bed className="h-4 w-4" />
    case "eye":
      return <Eye className="h-4 w-4" />
    case "snowflake":
      return <Snowflake className="h-4 w-4" />
    default:
      return <Plus className="h-4 w-4" />
  }
}

export default function RoomEditPage({ params }: { params: { roomId: string } }) {
  const [room, setRoom] = useState({ ...roomData })
  const [newFeature, setNewFeature] = useState("")
  const [newAmenity, setNewAmenity] = useState({ name: "", icon: "wifi" })

  const handleInputChange = (field: string, value: string | number) => {
    setRoom((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setRoom((prev) => ({ ...prev, features: [...prev.features, newFeature] }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setRoom((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleAddAmenity = () => {
    if (newAmenity.name.trim()) {
      setRoom((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity],
      }))
      setNewAmenity({ name: "", icon: "wifi" })
    }
  }

  const handleRemoveAmenity = (index: number) => {
    setRoom((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }))
  }

  const handleSave = () => {
    // In a real app, you would save the room data to the database
    console.log("Saving room:", room)
    // Redirect to rooms list
    window.location.href = "/admin/rooms"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/rooms" className="text-slate-500 hover:text-[#0A4A4A]">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-cormorant font-light text-slate-800">Επεξεργασία Δωματίου</h1>
          </div>
          <p className="text-slate-600 font-alegreya mt-1">
            Δωμάτιο {room.number} - {room.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-alegreya" onClick={() => (window.location.href = "/admin/rooms")}>
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
          {/* Basic Information */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Βασικές Πληροφορίες</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Αριθμός Δωματίου
                  </label>
                  <Input
                    value={room.number}
                    onChange={(e) => handleInputChange("number", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Όνομα Δωματίου</label>
                  <Input
                    value={room.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Τιμή (€ ανά διανυκτέρευση)
                  </label>
                  <Input
                    type="number"
                    value={room.price}
                    onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Κατάσταση</label>
                  <Select value={room.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="font-alegreya">
                      <SelectValue placeholder="Επιλέξτε κατάσταση" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Διαθέσιμο</SelectItem>
                      <SelectItem value="occupied">Κατειλημμένο</SelectItem>
                      <SelectItem value="maintenance">Συντήρηση</SelectItem>
                      <SelectItem value="reserved">Κρατημένο</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Χωρητικότητα (άτομα)
                  </label>
                  <Input
                    type="number"
                    value={room.capacity}
                    onChange={(e) => handleInputChange("capacity", Number.parseInt(e.target.value))}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Μέγεθος (m²)</label>
                  <Input
                    type="number"
                    value={room.size}
                    onChange={(e) => handleInputChange("size", Number.parseInt(e.target.value))}
                    className="font-alegreya"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Περιγραφή</label>
                  <Textarea
                    value={room.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="font-alegreya"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Εικόνες</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {room.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-40 rounded-sm overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Room ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="relative h-40 border-2 border-dashed border-slate-300 rounded-sm flex flex-col items-center justify-center text-slate-500 hover:text-[#0A4A4A] hover:border-[#0A4A4A] transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm font-alegreya">Προσθήκη Εικόνας</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Χαρακτηριστικά</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Προσθήκη νέου χαρακτηριστικού..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="font-alegreya"
                  />
                  <Button
                    className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
                    onClick={handleAddFeature}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-sm">
                      <span className="font-alegreya">{feature}</span>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleRemoveFeature(index)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Amenities */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Ανέσεις</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Όνομα ανέσεως..."
                    value={newAmenity.name}
                    onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
                    className="font-alegreya"
                  />
                  <Select
                    value={newAmenity.icon}
                    onValueChange={(value) => setNewAmenity({ ...newAmenity, icon: value })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wifi">Wi-Fi</SelectItem>
                      <SelectItem value="coffee">Καφές</SelectItem>
                      <SelectItem value="car">Αυτοκίνητο</SelectItem>
                      <SelectItem value="sparkles">Καθαριότητα</SelectItem>
                      <SelectItem value="bath">Μπάνιο</SelectItem>
                      <SelectItem value="bed">Κρεβάτι</SelectItem>
                      <SelectItem value="eye">Θέα</SelectItem>
                      <SelectItem value="snowflake">Κλιματισμός</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
                    onClick={handleAddAmenity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-sm">
                      <div className="flex items-center gap-2">
                        {getIconComponent(amenity.icon)}
                        <span className="font-alegreya">{amenity.name}</span>
                      </div>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleRemoveAmenity(index)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Προεπισκόπηση</h2>
            </div>
            <div className="p-6">
              <div className="text-center">
                <Link
                  href={`/rooms/${room.id}`}
                  target="_blank"
                  className="inline-block bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya px-4 py-2 rounded-sm"
                >
                  Προβολή Δωματίου
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
                <Button
                  className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
                  onClick={handleSave}
                >
                  Αποθήκευση Αλλαγών
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-alegreya"
                >
                  Διαγραφή Δωματίου
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
