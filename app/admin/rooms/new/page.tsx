"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Euro, Users, Bed, Building, CheckSquare, Image, Info } from 'lucide-react'
import { adminAPI } from '@/lib/api'
import ImageUpload from '@/components/admin/image-upload'

interface ImageFile {
  id: string
  file?: File
  url: string
  name: string
  uploaded?: boolean
}

export default function NewRoomPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<ImageFile[]>([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    bedType: '',
    features: [] as string[],
    available: true
  })

  const predefinedFeatures = [
    { id: 'entire-place', label: 'Ολόκληρος ο χώρος είναι δικός σας', icon: '🏠' },
    { id: 'size-35m2', label: '35 m² μέγεθος', icon: '📐' },
    { id: 'free-parking', label: 'Δωρεάν πάρκινγκ', icon: '🚗' },
    { id: 'breakfast', label: 'Πρωινό', icon: '🍳' },
    { id: 'private-bathroom', label: 'Ιδιωτικό μπάνιο', icon: '🚿' },
    { id: 'free-wifi', label: 'Δωρεάν Wi-Fi', icon: '📶' },
    { id: 'balcony', label: 'Μπαλκόνι', icon: '🏡' },
    { id: 'non-smoking', label: 'Δωμάτια μη καπνιστών', icon: '🚭' },
    { id: 'air-conditioning', label: 'Κλιματισμός', icon: '❄️' },
    { id: 'family-rooms', label: 'Οικογενειακά δωμάτια', icon: '👨‍👩‍👧‍👦' }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Prepare room data
      const roomData = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        totalRooms: 1, // Always 1 room
        images: images.filter(img => img.uploaded).map(img => img.url)
      }

      await adminAPI.createRoom(roomData)
      router.push('/admin/rooms')
    } catch (err: any) {
      setError(err.message || 'Σφάλμα κατά τη δημιουργία του δωματίου')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/admin/rooms" className="w-fit">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Πίσω</span>
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-cormorant font-light text-slate-800">
                Νέο Δωμάτιο
              </h1>
              <p className="text-sm md:text-base text-slate-600 font-alegreya mt-1">
                Δημιουργήστε ένα νέο δωμάτιο για την ιστοσελίδα
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 font-alegreya">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-cormorant font-semibold text-slate-800">
                  Βασικές Πληροφορίες
                </h2>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Room Name - Full Width */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3 font-alegreya">
                  <Bed className="h-4 w-4 text-slate-500" />
                  Όνομα Δωματίου *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="π.χ. Standard Δωμάτιο"
                  className="font-alegreya h-12"
                />
              </div>

              {/* Two Column Grid for Mobile, Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3 font-alegreya">
                    <Euro className="h-4 w-4 text-slate-500" />
                    Τιμή (€) *
                  </label>
                  <Input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="80.00"
                    className="font-alegreya h-12"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3 font-alegreya">
                    <Users className="h-4 w-4 text-slate-500" />
                    Χωρητικότητα *
                  </label>
                  <Input
                    required
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="2"
                    className="font-alegreya h-12"
                  />
                </div>
              </div>

              {/* Bed Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3 font-alegreya">
                  <Bed className="h-4 w-4 text-slate-500" />
                  Τύπος Κρεβατιού *
                </label>
                <Select value={formData.bedType} onValueChange={(value) => handleInputChange('bedType', value)}>
                  <SelectTrigger className="font-alegreya h-12">
                    <SelectValue placeholder="Επιλέξτε τύπο κρεβατιού" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Μονό</SelectItem>
                    <SelectItem value="double">Διπλό</SelectItem>
                    <SelectItem value="queen">Queen</SelectItem>
                    <SelectItem value="king">King</SelectItem>
                    <SelectItem value="twin">Δίδυμα</SelectItem>
                    <SelectItem value="family">Οικογενειακό</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3 font-alegreya">
                  Περιγραφή *
                </label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Περιγράψτε το δωμάτιο με λεπτομέρειες που θα βοηθήσουν τους επισκέπτες..."
                  rows={4}
                  className="font-alegreya resize-none"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-cormorant font-semibold text-slate-800">
                  Παροχές
                </h2>
              </div>
              <p className="text-sm text-slate-600 mt-1 font-alegreya">
                Επιλέξτε τις παροχές που περιλαμβάνει το δωμάτιο
              </p>
            </div>

            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {predefinedFeatures.map((feature) => (
                  <label 
                    key={feature.id}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${formData.features.includes(feature.id) 
                        ? 'border-[#0A4A4A] bg-[#0A4A4A]/5 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                      className="rounded border-slate-300 text-[#0A4A4A] focus:ring-[#0A4A4A] w-4 h-4"
                    />
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-sm text-slate-700 font-alegreya font-medium">
                      {feature.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-cormorant font-semibold text-slate-800">
                  Εικόνες
                </h2>
              </div>
              <p className="text-sm text-slate-600 mt-1 font-alegreya">
                Προσθέστε έως 6 εικόνες του δωματίου (μέγιστο 5MB ανά εικόνα)
              </p>
            </div>

            <div className="p-4 md:p-6">
              <ImageUpload 
                images={images}
                onImagesChange={setImages}
                maxImages={6}
                maxSizeMB={5}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Link href="/admin/rooms" className="w-full sm:w-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full sm:w-auto font-alegreya h-12"
                  disabled={loading}
                >
                  Άκυρο
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya h-12 px-8"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Δημιουργία...' : 'Δημιουργία Δωματίου'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 