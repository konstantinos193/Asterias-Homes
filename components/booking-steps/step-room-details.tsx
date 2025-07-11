"use client"

import Image from "next/image"
import { Users, Maximize } from "lucide-react"
import { allRoomsData } from "@/data/rooms"
import type { RoomData } from "@/data/rooms"
import type { BookingData } from "@/types/booking"
import { useLanguage } from "@/contexts/language-context" // Assuming you'll need this for translations

interface StepRoomDetailsProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
}

export default function StepRoomDetails({ bookingData, updateBookingData }: StepRoomDetailsProps) {
  const { t } = useLanguage() // For translating room details later

  const availableRooms = allRoomsData.filter(
    (room: RoomData) => (room.capacity ?? 0) >= bookingData.adults + bookingData.children,
  )

  const selectedRoom = allRoomsData.find((room: RoomData) => room.id === bookingData.roomId)

  // Helper function to get translated room name (or other properties)
  // You'll need to implement this based on your translation keys structure
  const getRoomName = (room: RoomData) => {
    // Example: if nameKey is "rooms.standard.name"
    return t(room.nameKey) || "Room Name Not Found"
  }

  const getRoomFeature = (featureKey: string) => {
    return t(featureKey) || featureKey // Fallback to key if translation missing
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-cormorant font-semibold text-slate-800 mb-2">
          {t("bookingsPage.steps.roomDetails.title") || "Επιλέξτε το δωμάτιό σας"}
        </h2>
        <p className="text-slate-600 font-alegreya">
          {t("bookingsPage.steps.roomDetails.availableFor", {
            adults: bookingData.adults,
            children:
              bookingData.children > 0
                ? ` ${t("bookingsPage.steps.roomDetails.and")} ${bookingData.children} ${t("bookingsPage.steps.roomDetails.children", { count: bookingData.children })}`
                : "",
          }) ||
            `Διαθέσιμα δωμάτια για ${bookingData.adults} ενήλικες${bookingData.children > 0 ? ` και ${bookingData.children} παιδιά` : ""}`}
        </p>
      </div>

      <div className="grid gap-4">
        {availableRooms.map((room) => (
          <div
            key={room.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              bookingData.roomId === room.id
                ? "border-[#0A4A4A] bg-[#0A4A4A]/5"
                : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => updateBookingData({ roomId: room.id })}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-40 h-32 sm:h-auto rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={room.image || "/placeholder.svg?width=160&height=120&query=hotel+room"}
                  alt={getRoomName(room)}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-2">
                  <div>
                    <h3 className="font-cormorant font-semibold text-lg text-slate-800">{getRoomName(room)}</h3>
                    {/* Rating is not in RoomData, assuming it might be added or handled differently */}
                    {/* <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-alegreya text-slate-600">{room.rating}</span>
                  </div> */}
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <div className="text-2xl font-cormorant font-semibold text-[#0A4A4A]">{room.price}</div>
                    <div className="text-sm text-slate-600 font-alegreya">
                      {t("bookingsPage.steps.roomDetails.perNight") || "ανά νύχτα"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600 font-alegreya mb-3">
                  {room.size && (
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4 text-slate-500" />
                      {room.size}
                    </div>
                  )}
                  {room.capacity && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-500" />
                      {room.capacity} {t("bookingsPage.steps.roomDetails.guests", { count: room.capacity }) || "άτομα"}
                    </div>
                  )}
                  {/* View and Bathroom are not directly in RoomData, these would need to be featureKeys */}
                  {/* <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {room.view}
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  {room.bathroom}
                </div> */}
                </div>

                {room.featureKeys && room.featureKeys.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {room.featureKeys.slice(0, 4).map((featureKey) => (
                        <span
                          key={featureKey}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-alegreya"
                        >
                          {getRoomFeature(featureKey)}
                        </span>
                      ))}
                      {room.featureKeys.length > 4 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-alegreya">
                          +{room.featureKeys.length - 4}{" "}
                          {t("bookingsPage.steps.roomDetails.moreFeatures") || "περισσότερα"}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="bg-slate-50 p-4 rounded-lg border mt-6">
          <h3 className="font-cormorant font-semibold text-slate-800 mb-2">
            {t("bookingsPage.steps.roomDetails.selectedRoomTitle") || "Επιλεγμένο δωμάτιο"}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-alegreya text-slate-700">{getRoomName(selectedRoom)}</span>
            <span className="font-cormorant font-semibold text-[#0A4A4A]">
              {selectedRoom.price}/{t("bookingsPage.steps.roomDetails.perNightShort") || "νύχτα"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
