"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Users, Maximize, Star, Eye, Bath, Check } from "lucide-react"
import { roomsAPI } from "@/lib/api"
import { normalizeRoomName } from "@/lib/utils"
import type { RoomData } from "@/data/rooms"
import type { BookingData } from "@/types/booking"
import { useLanguage } from "@/contexts/language-context"

interface StepRoomDetailsProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
}

export default function StepRoomDetails({ bookingData, updateBookingData }: StepRoomDetailsProps) {
  const { t, language } = useLanguage()
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Wait for language context to be properly loaded
  if (!language) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0A4A4A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-alegreya">
            {t("common.loading", "Loading...")}
          </p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const fetchSelectedRoom = async () => {
      try {
        setIsLoading(true)
        const roomsData = await roomsAPI.getAll()
        // Find the specific room being booked
        const room = roomsData.find(room => room.id === bookingData.roomId || room._id === bookingData.roomId)
        if (room) {
          setSelectedRoom(room)
        } else {
          setError('Selected room not found')
        }
      } catch (err) {
        setError('Failed to load room information')
      } finally {
        setIsLoading(false)
      }
    }

    if (bookingData.roomId) {
      fetchSelectedRoom()
    } else {
      setError('No room selected')
      setIsLoading(false)
    }
  }, [bookingData.roomId])

  // Helper function to get translated room name
  const getRoomName = (room: RoomData) => {
    // Use the normalized room name to ensure all identical rooms show the same name
    const normalizedName = normalizeRoomName(room.name)
    
    // Return translated room name based on language
    return t("rooms.standard.name", normalizedName)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0A4A4A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-alegreya">
            {t("bookingsPage.loading", "Loading room information...")}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-cormorant font-semibold text-red-700 mb-2">
          {t("bookingsPage.error", "Error Loading Room")}
        </h3>
        <p className="text-slate-600 font-alegreya mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#0A4A4A] text-white rounded-lg hover:bg-[#083a3a] transition-colors font-alegreya"
        >
          {t("bookingsPage.retry", "Try Again")}
        </button>
      </div>
    )
  }

  if (!selectedRoom) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-slate-600" />
        </div>
        <h3 className="text-lg font-cormorant font-semibold text-slate-700 mb-2">
          {t("bookingsPage.noRoom", "No Room Selected")}
        </h3>
        <p className="text-slate-600 font-alegreya">
          {t("bookingsPage.noRoomMessage", "Please go back and select a room to continue.")}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-cormorant font-semibold text-slate-800 mb-2">
          {t("bookingWizard.roomDetails.title", "Your Selected Room")}
        </h2>
        <p className="text-slate-600 font-alegreya">
          {t("bookingWizard.roomDetails.confirmation", "Confirm your room selection")}
        </p>
      </div>

      {/* Display only the selected room */}
      <div className="border border-[#0A4A4A] rounded-lg p-6 bg-[#0A4A4A]/5">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative w-full lg:w-80 h-64 lg:h-auto rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={selectedRoom.image || "/room-1.png"}
              alt={getRoomName(selectedRoom)}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h3 className="font-cormorant font-semibold text-2xl text-slate-800 mb-2">
                {getRoomName(selectedRoom)}
              </h3>
              {selectedRoom.rating && (
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-alegreya text-slate-600">{selectedRoom.rating}</span>
                </div>
              )}
              <p className="text-slate-600 font-alegreya text-lg">
                {t("bookingWizard.roomDetails.description", "A beautifully furnished apartment with modern amenities, perfect for a relaxing getaway in Koronisia. All our apartments are identical in style and layout, offering consistent comfort and quality.")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedRoom.size && (
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-4 text-[#0A4A4A]" />
                  <span className="text-slate-700 font-alegreya">{selectedRoom.size}</span>
                </div>
              )}
              {selectedRoom.capacity && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-4 text-[#0A4A4A]" />
                  <span className="text-slate-700 font-alegreya">
                    {selectedRoom.capacity} {t("bookingWizard.roomDetails.guests", "guests")}
                  </span>
                </div>
              )}
              {selectedRoom.view && (
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-4 text-[#0A4A4A]" />
                  <span className="text-slate-700 font-alegreya">{t("bookingWizard.roomDetails.view", selectedRoom.view)}</span>
                </div>
              )}
              {selectedRoom.bathroom && (
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-4 text-[#0A4A4A]" />
                  <span className="text-slate-700 font-alegreya">{t("bookingWizard.roomDetails.bathroom", selectedRoom.bathroom)}</span>
                </div>
              )}
            </div>

            {selectedRoom.features && selectedRoom.features.length > 0 && (
              <div className="mb-4">
                <h4 className="font-cormorant font-semibold text-lg text-slate-800 mb-2">
                  {t("bookingWizard.roomDetails.features", "Room Features")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-[#0A4A4A]/10 text-[#0A4A4A] text-sm rounded-full font-alegreya border border-[#0A4A4A]/20"
                    >
                      {t(`bookingWizard.roomDetails.feature.${feature.toLowerCase().replace(/\s+/g, '')}`, feature)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-alegreya text-slate-700">
                  {t("bookingWizard.roomDetails.pricePerNight", "Price per night")}
                </span>
                <span className="text-3xl font-cormorant font-semibold text-[#0A4A4A]">
                  €{selectedRoom.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room confirmation message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <span className="font-alegreya text-green-800">
            {t("bookingWizard.roomDetails.confirmed", "Room selection confirmed!")}
          </span>
        </div>
        <p className="text-sm text-green-700 font-alegreya mt-1">
          {t("bookingWizard.roomDetails.proceed", "You can now proceed to the next step to enter your guest information.")}
        </p>
      </div>
    </div>
  )
}
