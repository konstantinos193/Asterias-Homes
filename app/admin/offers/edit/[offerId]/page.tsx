"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAdminRooms } from "@/hooks/api/use-admin"
import { useOffer, useUpdateOffer } from "@/hooks/api/use-offers"
import { logger } from "@/lib/logger"
import { ArrowLeft, Save, Percent, Calendar, Tag, MapPin } from "lucide-react"
import Link from "next/link"

interface Room {
  _id: string
  name: string
  price: number
  description: string
  images?: string[]
}

export default function EditOfferPage() {
  const router = useRouter()
  const params = useParams()
  const offerId = params?.offerId as string
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data: roomsData = [], isLoading: loadingRooms, error: roomsError } = useAdminRooms()
  const { data: offer, isLoading: loadingOffer, error: offerError } = useOffer(offerId)
  const updateOfferMutation = useUpdateOffer()

  // Normalize rooms data - handle both array and { rooms: [] } formats
  const rooms = Array.isArray(roomsData) 
    ? (Array.isArray((roomsData as any).rooms) ? (roomsData as any).rooms : roomsData) as Room[]
    : []
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    selectedRooms: [] as string[],
    active: true
  })

  // Initialize form data when offer is loaded
  useEffect(() => {
    if (offer) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDateForInput = (dateString: string | undefined) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ""
        return date.toISOString().split('T')[0]
      }

      setFormData({
        name: offer.title || "",
        description: offer.description || "",
        discount: offer.discount?.toString() || "",
        startDate: formatDateForInput(offer.startDate),
        endDate: formatDateForInput(offer.endDate),
        selectedRooms: offer.applicableRooms || [],
        active: offer.active ?? true
      })
    }
  }, [offer])

  // Handle errors
  useEffect(() => {
    if (roomsError) {
      logger.error('Error fetching rooms for edit offer', roomsError as Error)
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία φόρτωσης δωματίων",
        variant: "destructive",
      })
    }
    if (offerError) {
      logger.error('Error fetching offer for editing', offerError as Error)
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία φόρτωσης προσφοράς",
        variant: "destructive",
      })
    }
  }, [roomsError, offerError, toast])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRoomToggle = (roomId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRooms: prev.selectedRooms.includes(roomId)
        ? prev.selectedRooms.filter(id => id !== roomId)
        : [...prev.selectedRooms, roomId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (formData.selectedRooms.length === 0) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ επιλέξτε τουλάχιστον ένα δωμάτιο",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const offerData = {
        title: formData.name,
        description: formData.description,
        discount: parseFloat(formData.discount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        applicableRooms: formData.selectedRooms,
        active: formData.active
      }

      await updateOfferMutation.mutateAsync({ id: offerId, data: offerData })
      logger.info('Offer updated successfully', { offerId, offerData })
      toast({
        title: "Επιτυχία",
        description: "Η προσφορά ενημερώθηκε επιτυχώς",
      })
      router.push("/admin/offers")
    } catch (error) {
      logger.error("Failed to update offer", error as Error)
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία ενημέρωσης προσφοράς",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateDiscountedPrice = (originalPrice: number, discount: string) => {
    if (!discount) return originalPrice
    const discountPercent = parseFloat(discount)
    return originalPrice - (originalPrice * discountPercent / 100)
  }

  if (loadingOffer || loadingRooms) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 font-alegreya">Φόρτωση...</div>
      </div>
    )
  }

  if (offerError || !offer) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 text-center">
            <h1 className="text-xl font-cormorant font-semibold text-red-800 mb-2">
              Προσφορά δεν βρέθηκε
            </h1>
            <p className="text-slate-600 font-alegreya mb-4">
              Η προσφορά που αναζητάτε δεν υπάρχει ή δεν μπορεί να φορτωθεί.
            </p>
            <Link href="/admin/offers">
              <Button variant="outline" className="font-alegreya">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Επιστροφή στις Προσφορές
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/admin/offers" className="w-fit">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Πίσω</span>
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-cormorant font-light text-slate-800">
                Επεξεργασία Προσφοράς
              </h1>
              <p className="text-sm md:text-base text-slate-600 font-alegreya mt-1">
                Ενημερώστε τα στοιχεία της προσφοράς
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Offer Details */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-cormorant font-semibold text-slate-800">
                  Στοιχεία Προσφοράς
                </h2>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Offer Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3 font-alegreya">
                  Όνομα Προσφοράς *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="π.χ. Καλοκαιρινή Προσφορά, Πρώιμη Κράτηση"
                  className="font-alegreya h-12"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3 font-alegreya">
                  Περιγραφή
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Περιγράψτε την προσφορά..."
                  rows={3}
                  className="font-alegreya resize-none"
                />
              </div>

              {/* Discount and Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3 font-alegreya">
                    <Percent className="h-4 w-4 text-slate-500" />
                    Έκπτωση (%) *
                  </label>
                  <Input
                    required
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.discount}
                    onChange={(e) => handleInputChange('discount', e.target.value)}
                    placeholder="20"
                    className="font-alegreya h-12"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3 font-alegreya">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    Από *
                  </label>
                  <Input
                    required
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="font-alegreya h-12"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3 font-alegreya">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    Έως *
                  </label>
                  <Input
                    required
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="font-alegreya h-12"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-alegreya cursor-pointer"
                >
                  Ενεργή προσφορά
                </label>
              </div>
            </div>
          </div>

          {/* Room Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-cormorant font-semibold text-slate-800">
                  Επιλογή Δωματίων
                </h2>
              </div>
              <p className="text-sm text-slate-600 mt-1 font-alegreya">
                Επιλέξτε τα δωμάτια στα οποία θα εφαρμοστεί η προσφορά ({formData.selectedRooms.length} επιλεγμένα)
              </p>
            </div>

            <div className="p-4 md:p-6">
              {rooms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 font-alegreya">Δεν βρέθηκαν δωμάτια. Δημιουργήστε πρώτα κάποια δωμάτια.</p>
                  <Link href="/admin/rooms/new" className="inline-block mt-4">
                    <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
                      Δημιουργία Δωματίου
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => {
                    const isSelected = formData.selectedRooms.includes(room._id)
                    const originalPrice = room.price
                    const discountedPrice = calculateDiscountedPrice(originalPrice, formData.discount)
                    
                    return (
                      <div
                        key={room._id}
                        className={`
                          relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                          ${isSelected 
                            ? 'border-[#0A4A4A] bg-[#0A4A4A]/5 shadow-md' 
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                          }
                        `}
                        onClick={() => handleRoomToggle(room._id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900 font-alegreya">
                              {room.name}
                            </h3>
                            <p className="text-sm text-slate-600 font-alegreya line-clamp-2 mt-1">
                              {room.description}
                            </p>
                          </div>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleRoomToggle(room._id)}
                            className="ml-3"
                          />
                        </div>

                        {/* Price Display */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 font-alegreya">Κανονική τιμή:</span>
                            <span className={`text-sm font-alegreya ${formData.discount ? 'line-through text-slate-500' : 'font-medium text-slate-900'}`}>
                              €{originalPrice}
                            </span>
                          </div>
                          {formData.discount && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-700 font-alegreya">Τιμή με έκπτωση:</span>
                              <span className="text-sm font-medium text-green-700 font-alegreya">
                                €{discountedPrice.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-[#0A4A4A] text-white rounded-full flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Link href="/admin/offers" className="w-full sm:w-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full sm:w-auto font-alegreya h-12"
                  disabled={isSubmitting}
                >
                  Άκυρο
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting || updateOfferMutation.isPending || formData.selectedRooms.length === 0}
                className="w-full sm:w-auto bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya h-12 px-8"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting || updateOfferMutation.isPending ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

