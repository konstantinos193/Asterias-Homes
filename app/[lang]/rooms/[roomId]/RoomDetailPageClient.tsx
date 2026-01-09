"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useRoom, Room as HookRoom } from "@/hooks/api"
import { Room } from "@/types/booking"
import Image from "next/image"
import Link from "next/link"
import { Star, Users, Maximize, Eye, Bath, Check, Calendar } from "lucide-react"
import { logger } from "@/lib/logger"
import { normalizeImageUrl } from "@/lib/utils"

interface RoomDetailPageClientProps {
  roomId: string
  initialRoom?: Room | null // Server-fetched room data for SSR
}

export default function RoomDetailPageClient({ roomId, initialRoom }: RoomDetailPageClientProps) {
  const { t, language } = useLanguage()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  
  // Use client-side hook for revalidation, but prefer initialRoom if available
  // Cast initialRoom to HookRoom type since they're structurally compatible
  const { data: roomData, isLoading: loading, error: queryError } = useRoom(roomId, {
    initialData: initialRoom ? (initialRoom as unknown as HookRoom) : null,
    enabled: !initialRoom, // Only fetch if we don't have initial data
  })

  // Handle errors
  const error = queryError ? (() => {
    logger.error('Failed to fetch room', queryError as Error)
    return 'Failed to load room'
  })() : null

  // Use initialRoom if available, otherwise use roomData from hook
  const room = initialRoom || (roomData ? (roomData as unknown as Room) : null)
  
  // Only show loading if we don't have initial data and we're still loading
  const isLoading = !initialRoom && loading

  if (isLoading) {
    return (
      <main className="bg-[#A9AEA2]/30 text-slate-800 pt-20 sm:pt-24 font-alegreya min-h-screen">
        <div className="container mx-auto container-mobile py-12 text-center">
          <p className="text-slate-600">{t("common.loading") || "Loading..."}</p>
        </div>
      </main>
    )
  }

  if (error || !room) {
    return (
      <main className="bg-[#A9AEA2]/30 text-slate-800 pt-20 sm:pt-24 font-alegreya min-h-screen">
        <div className="container mx-auto container-mobile py-12 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-2">
            {error || "Room Not Found"}
          </h2>
          <p className="text-slate-600 mb-6">
            {t("rooms.notFound") || "The room you're looking for doesn't exist."}
          </p>
          <Link
            href={`/${language}/rooms`}
            className="inline-block bg-[#8B4B5C] text-white px-6 py-3 rounded-md hover:bg-[#7A4251] transition-colors"
          >
            {t("rooms.backToRooms") || "Back to Rooms"}
          </Link>
        </div>
      </main>
    )
  }

  const displayName = room?.nameKey ? t(room.nameKey) : room?.name || ''
  const displayDescription = room?.descriptionKey ? t(room.descriptionKey) : room?.description || ''
  const displayFeatures = room?.featureKeys ? room.featureKeys.map(key => t(key)) : (Array.isArray(room?.features) ? room.features : [])
  
  // Get images array - handle both Room type and backend response format
  const roomImages = (room as any)?.images || (room as any)?.image ? [(room as any).image] : []
  // Filter out empty/null/undefined images and normalize URLs
  const rawImages = roomImages && roomImages.length > 0 
    ? roomImages.filter((img: string) => img && typeof img === 'string' && img.trim() !== '')
    : []
  const images = rawImages.length > 0 
    ? rawImages.map((img: string) => normalizeImageUrl(img))
    : ["/room-featured-1.jpeg"] // Fallback to a default image

  return (
    <main className="bg-[#A9AEA2]/30 text-slate-800 pt-20 sm:pt-24 font-alegreya min-h-screen">
      {/* Hero Image */}
      <section className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        {images[selectedImageIndex] && !imageErrors.has(selectedImageIndex) && (
          <Image
            src={images[selectedImageIndex]}
            alt={displayName}
            fill
            className="object-cover"
            priority
            onError={() => {
              setImageErrors(prev => new Set(prev).add(selectedImageIndex))
              logger.error('Failed to load room image', undefined, { imageUrl: images[selectedImageIndex], roomId })
            }}
          />
        )}
        {(!images[selectedImageIndex] || imageErrors.has(selectedImageIndex)) && (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-sm">Image not available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/20"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 text-white">
          <div className="container mx-auto container-mobile">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-cormorant font-bold mb-2">
              {displayName}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg">{room.rating || 5.0}</span>
              </div>
              <div className="text-lg">
                €{room.price} {t("rooms.perNight") || "/night"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {images.length > 1 && (
        <section className="py-4 bg-white/80">
          <div className="container mx-auto container-mobile">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-[#8B4B5C]' : 'border-transparent'
                  }`}
                >
                  {!imageErrors.has(index) ? (
                    <Image
                      src={img}
                      alt={`${displayName} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={() => {
                        setImageErrors(prev => new Set(prev).add(index))
                        logger.error('Failed to load room thumbnail', undefined, { imageUrl: img, roomId, index })
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-xs">N/A</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto container-mobile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
                <h2 className="text-2xl sm:text-3xl font-cormorant font-semibold mb-4">
                  {t("rooms.aboutRoom") || "About This Room"}
                </h2>
                <div className="w-12 h-0.5 bg-[#8B4B5C] mb-6"></div>
                <p className="text-slate-600 mb-6 whitespace-pre-line">
                  {displayDescription}
                </p>

                {/* Room Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-[#8B4B5C]" />
                    <div>
                      <p className="text-xs text-slate-500">{t("rooms.maxGuests") || "Max Guests"}</p>
                      <p className="text-sm font-semibold">{room.maxGuests || (room as any).capacity}</p>
                    </div>
                  </div>
                  {room.size && (
                    <div className="flex items-center space-x-2">
                      <Maximize className="h-5 w-5 text-[#8B4B5C]" />
                      <div>
                        <p className="text-xs text-slate-500">{t("rooms.size") || "Size"}</p>
                        <p className="text-sm font-semibold">{room.size}</p>
                      </div>
                    </div>
                  )}
                  {room.view && (
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-[#8B4B5C]" />
                      <div>
                        <p className="text-xs text-slate-500">{t("rooms.view") || "View"}</p>
                        <p className="text-sm font-semibold">{room.view}</p>
                      </div>
                    </div>
                  )}
                  {room.bathroom && (
                    <div className="flex items-center space-x-2">
                      <Bath className="h-5 w-5 text-[#8B4B5C]" />
                      <div>
                        <p className="text-xs text-slate-500">{t("rooms.bathroom") || "Bathroom"}</p>
                        <p className="text-sm font-semibold">{room.bathroom}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                {displayFeatures.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-cormorant font-semibold mb-4">
                      {t("rooms.features") || "Room Features"}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {displayFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-[#8B4B5C] flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-4xl sm:text-5xl font-cormorant font-bold text-[#8B4B5C] mb-2">
                    €{room.price}
                  </div>
                  <p className="text-slate-600 text-sm">
                    {t("rooms.perNight") || "per night"}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Users className="h-5 w-5 text-[#8B4B5C]" />
                    <span className="text-sm">
                      {t("rooms.accommodates") || "Accommodates"} {room.maxGuests || (room as any).capacity} {t("rooms.guests") || "guests"}
                    </span>
                  </div>
                  {room.bedType && (
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Calendar className="h-5 w-5 text-[#8B4B5C]" />
                      <span className="text-sm">{room.bedType}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Link
                    href={`/${language}/bookings?roomId=${roomId}`}
                    className="block w-full text-center bg-[#8B4B5C] text-white px-6 py-3 rounded-md hover:bg-[#7A4251] transition-colors font-medium"
                  >
                    {t("rooms.bookNow") || "Book Now"}
                  </Link>
                  <Link
                    href={`/${language}/contact`}
                    className="block w-full text-center border border-[#8B4B5C] text-[#8B4B5C] px-6 py-3 rounded-md hover:bg-[#8B4B5C] hover:text-white transition-colors font-medium"
                  >
                    {t("rooms.contactUs") || "Contact Us"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

