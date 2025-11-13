"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Wifi, Coffee, Car, Sparkles, Bath, Bed, Eye, Snowflake, Save } from "lucide-react"
import { adminAPI } from "@/lib/api"
import RoomImageEditor from "@/components/admin/room-image-editor"
import { getBackendUrl } from "@/lib/backend-url"

type RoomImage = {
  id: string
  url: string
  isExisting: true
} | {
  id: string
  file: File
  url: string
  name: string
  isExisting: false
  uploaded?: boolean
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

export default function RoomEditPage() {
  const router = useRouter()
  const params = useParams()
  const roomId = params?.roomId as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [room, setRoom] = useState<any>(null)
  const [images, setImages] = useState<RoomImage[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [newAmenity, setNewAmenity] = useState({ name: "", icon: "wifi" })

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) {
        setError('Room ID not provided')
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        setError("")
        console.log('Fetching room with ID:', roomId)
        const response = await adminAPI.getRoomById(roomId)
        console.log('Room response:', response)
        const roomData = response.room || response
        console.log('🔍 Room data amenities (raw from backend):', roomData.amenities)
        console.log('🔍 Type of amenities:', typeof roomData.amenities)
        
        if (!roomData) {
          throw new Error('Room data not found in response')
        }
        
        // Convert room images to RoomImage format
        const backendUrl = getBackendUrl()
        const existingImages: RoomImage[] = (roomData.images || []).map((url: string, index: number) => ({
          id: `existing-${index}-${url}`,
          url: url.startsWith('http') ? url : `${backendUrl}${url}`,
          isExisting: true as const
        }))
        
        // Convert amenities from object to array format for editing
        // Backend stores amenities as { wifi: true, ac: true, safe: true } (booleans)
        // Frontend needs array format [{ name: 'wifi', icon: 'wifi' }, ...] for editing
        let amenitiesArray = []
        if (roomData.amenities) {
          if (Array.isArray(roomData.amenities)) {
            amenitiesArray = roomData.amenities
          } else if (typeof roomData.amenities === 'object') {
            // Convert object format { wifi: true, ac: true } to array format
            // Only include amenities that are true
            amenitiesArray = Object.entries(roomData.amenities)
              .filter(([name, value]) => value === true) // Only include true values
              .map(([name, value]) => {
                // Map common amenity names to their icon names
                const iconMap: Record<string, string> = {
                  wifi: 'wifi',
                  ac: 'snowflake',
                  tv: 'tv',
                  minibar: 'coffee',
                  balcony: 'eye',
                  seaView: 'eye',
                  roomService: 'sparkles',
                  safe: 'shield'
                }
                return { 
                  name, 
                  icon: iconMap[name.toLowerCase()] || name.toLowerCase() || 'wifi' 
                }
              })
          }
        }
        
        setRoom({
          ...roomData,
          amenities: amenitiesArray
        })
        setImages(existingImages)
        console.log('Room loaded successfully')
      } catch (err: any) {
        console.error('Error fetching room:', err)
        const errorMessage = err?.message || err?.error || 'Σφάλμα κατά τη φόρτωση του δωματίου'
        setError(errorMessage)
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [roomId])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setRoom((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setRoom((prev: any) => ({ 
        ...prev, 
        features: [...(prev.features || []), newFeature] 
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setRoom((prev: any) => ({
      ...prev,
      features: (prev.features || []).filter((_: any, i: number) => i !== index),
    }))
  }

  const handleAddAmenity = () => {
    if (newAmenity.name.trim()) {
      setRoom((prev: any) => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity],
      }))
      setNewAmenity({ name: "", icon: "wifi" })
    }
  }

  const handleRemoveAmenity = (index: number) => {
    setRoom((prev: any) => ({
      ...prev,
      amenities: (prev.amenities || []).filter((_: any, i: number) => i !== index),
    }))
  }

  const handleDeleteExistingImage = (imageUrl: string) => {
    // Remove from images state (already handled by RoomImageEditor)
    // This callback is for any additional cleanup if needed
    console.log('Deleting image:', imageUrl)
  }

  const handleSave = async () => {
    if (!room) return

    setSaving(true)
    setError("")

    try {
      // First, upload any new images that haven't been uploaded yet
      const newImages = images.filter((img): img is Extract<RoomImage, { isExisting: false }> => 
        !img.isExisting && 'file' in img && 'uploaded' in img && !img.uploaded && !!img.file
      )

      // Upload new images
      for (const image of newImages) {
        if (!image.file) continue

        const formData = new FormData()
        formData.append('images', image.file)

        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const result = await response.json()
        const uploadedFile = result.files[0]
        const backendUrl = getBackendUrl()
        
        // Update image URL in state
        const updatedImages = images.map(img => 
          img.id === image.id 
            ? { 
                ...img, 
                url: `${backendUrl}${uploadedFile.url}`,
                uploaded: true,
                isExisting: false
              } as Extract<RoomImage, { isExisting: false }>
            : img
        )
        setImages(updatedImages)
      }

      // Collect all image URLs (existing + newly uploaded)
      const backendUrl = getBackendUrl()
      const imageUrls = images
        .filter(img => img.isExisting || ('uploaded' in img && img.uploaded))
        .map(img => {
          // If it's an existing image, use the original URL
          // If it's a new uploaded image, use the full URL
          const url = img.url
          // Extract the path from the full URL if it includes the backend URL
          if (url.includes(backendUrl)) {
            return url.replace(backendUrl, '')
          }
          // If it already starts with /, return as is
          if (url.startsWith('/')) {
            return url
          }
          // Otherwise return the full URL (might be external)
          return url
        })

      // Convert amenities from array back to object format for backend
      // Backend expects { wifi: true, ac: true } (boolean values, not objects)
      // Backend schema defines: wifi, ac, tv, minibar, balcony, seaView, roomService, safe
      const definedAmenities = ['wifi', 'ac', 'tv', 'minibar', 'balcony', 'seaView', 'roomService', 'safe']
      let amenitiesObject: Record<string, boolean> = {}
      
      console.log('🔍 Converting amenities for save. Current room.amenities:', room.amenities)
      console.log('🔍 Type of room.amenities:', typeof room.amenities, Array.isArray(room.amenities))
      
      if (Array.isArray(room.amenities)) {
        // Start with all amenities set to false
        definedAmenities.forEach(amenity => {
          amenitiesObject[amenity] = false
        })
        // Set the ones in the array to true
        room.amenities.forEach((amenity: any) => {
          if (amenity && amenity.name && definedAmenities.includes(amenity.name)) {
            amenitiesObject[amenity.name] = true
          }
        })
      } else if (typeof room.amenities === 'object' && room.amenities !== null) {
        // If it's already an object, ensure all values are booleans
        // Check if values are objects (with icon) or booleans
        Object.entries(room.amenities).forEach(([key, value]) => {
          if (definedAmenities.includes(key)) {
            // If value is an object (like { icon: 'safe' }), set to true
            // If value is already a boolean, use it
            if (typeof value === 'object' && value !== null) {
              amenitiesObject[key] = true
            } else {
              amenitiesObject[key] = value === true || value === 'true'
            }
          }
        })
        // Ensure all defined amenities are present
        definedAmenities.forEach(amenity => {
          if (!(amenity in amenitiesObject)) {
            amenitiesObject[amenity] = false
          }
        })
      } else {
        // Default: set all to false
        definedAmenities.forEach(amenity => {
          amenitiesObject[amenity] = false
        })
      }
      
      console.log('✅ Converted amenities object:', amenitiesObject)
      // Verify all values are booleans
      Object.entries(amenitiesObject).forEach(([key, value]) => {
        if (typeof value !== 'boolean') {
          console.error(`❌ ERROR: ${key} is not a boolean! Value:`, value, 'Type:', typeof value)
          amenitiesObject[key] = Boolean(value)
        }
      })

      // Set the banner/featured image (first image in the array, or keep existing if no images)
      const bannerImage = imageUrls.length > 0 ? imageUrls[0] : room.image || null

      // Prepare room data for update
      const roomData = {
        name: room.name,
        description: room.description,
        price: room.price,
        capacity: room.capacity,
        size: room.size,
        bedType: room.bedType,
        features: room.features || [],
        amenities: amenitiesObject,
        images: imageUrls,
        image: bannerImage, // Set the first image as the banner/featured image
        available: room.available !== undefined ? room.available : true
      }
      
      console.log('📤 Sending room data to backend:', JSON.stringify(roomData, null, 2))

      await adminAPI.updateRoom(roomId, roomData)
      router.push("/admin/rooms")
    } catch (err: any) {
      console.error('Error saving room:', err)
      setError(err.message || 'Σφάλμα κατά την αποθήκευση του δωματίου')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-600 font-alegreya">Φόρτωση...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-alegreya">Δεν βρέθηκε το δωμάτιο</p>
          <Link href="/admin/rooms" className="text-[#0A4A4A] hover:underline mt-4 inline-block">
            Επιστροφή στη λίστα
          </Link>
        </div>
      </div>
    )
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
            {room.name || 'Δωμάτιο'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="font-alegreya" 
            onClick={() => router.push("/admin/rooms")}
            disabled={saving}
          >
            Ακύρωση
          </Button>
          <Button 
            className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya" 
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-alegreya">
          {error}
        </div>
      )}

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
                    Όνομα Δωματίου
                  </label>
                  <Input
                    value={room.name || ""}
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
                    value={room.price || ""}
                    onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Χωρητικότητα (άτομα)
                  </label>
                  <Input
                    type="number"
                    value={room.capacity || ""}
                    onChange={(e) => handleInputChange("capacity", Number.parseInt(e.target.value))}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Μέγεθος (m²)</label>
                  <Input
                    type="text"
                    value={room.size || ""}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Τύπος Κρεβατιού</label>
                  <Input
                    type="text"
                    value={room.bedType || ""}
                    onChange={(e) => handleInputChange("bedType", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Διαθέσιμο</label>
                  <Select 
                    value={room.available ? "true" : "false"} 
                    onValueChange={(value) => handleInputChange("available", value === "true")}
                  >
                    <SelectTrigger className="font-alegreya">
                      <SelectValue placeholder="Επιλέξτε" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Ναι</SelectItem>
                      <SelectItem value="false">Όχι</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Περιγραφή</label>
                  <Textarea
                    value={room.description || ""}
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
              <p className="text-sm text-slate-500 font-alegreya mt-1">
                Η πρώτη εικόνα θα είναι η κύρια εικόνα (banner) που εμφανίζεται στη λίστα δωματίων
              </p>
            </div>
            <div className="p-6">
              <RoomImageEditor
                images={images}
                onImagesChange={setImages}
                maxImages={10}
                maxSizeMB={5}
                onDeleteExisting={handleDeleteExistingImage}
              />
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
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddFeature()
                      }
                    }}
                  />
                  <Button
                    className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
                    onClick={handleAddFeature}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {(room.features || []).map((feature: string, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-sm">
                      <span className="font-alegreya">{feature}</span>
                      <button 
                        className="text-red-500 hover:text-red-700" 
                        onClick={() => handleRemoveFeature(index)}
                        type="button"
                      >
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
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Όνομα ανέσεως..."
                      value={newAmenity.name}
                      onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
                      className="font-alegreya flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddAmenity()
                        }
                      }}
                    />
                    <Button
                      className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
                      onClick={handleAddAmenity}
                      disabled={!newAmenity.name.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 font-alegreya mb-2">
                      Εικονίδιο Ανέσεως
                    </label>
                    <Select
                      value={newAmenity.icon}
                      onValueChange={(value) => setNewAmenity({ ...newAmenity, icon: value })}
                    >
                      <SelectTrigger className="w-full font-alegreya">
                        <div className="flex items-center gap-2">
                          {getIconComponent(newAmenity.icon)}
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="wifi" className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4 text-slate-600" />
                            <span>Wi-Fi</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="coffee" className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Coffee className="h-4 w-4 text-slate-600" />
                            <span>Καφές</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="car" className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-slate-600" />
                            <span>Αυτοκίνητο</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="sparkles" className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-slate-600" />
                            <span>Καθαριότητα</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bath" className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Bath className="h-4 w-4 text-slate-600" />
                            <span>Μπάνιο</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bed" className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Bed className="h-4 w-4 text-slate-600" />
                            <span>Κρεβάτι</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="eye" className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-slate-600" />
                            <span>Θέα</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="snowflake" className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Snowflake className="h-4 w-4 text-slate-600" />
                            <span>Κλιματισμός</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  {(room.amenities || []).map((amenity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-sm">
                      <div className="flex items-center gap-2">
                        {getIconComponent(amenity.icon || "wifi")}
                        <span className="font-alegreya">{amenity.name}</span>
                      </div>
                      <button 
                        className="text-red-500 hover:text-red-700" 
                        onClick={() => handleRemoveAmenity(index)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
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
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-alegreya"
                  onClick={async () => {
                    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το δωμάτιο;')) {
                      try {
                        await adminAPI.deleteRoom(roomId)
                        router.push("/admin/rooms")
                      } catch (err: any) {
                        alert(err.message || 'Σφάλμα κατά τη διαγραφή')
                      }
                    }
                  }}
                  disabled={saving}
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
