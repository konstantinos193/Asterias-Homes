"use client"

import Image from "next/image"
import { CheckCircle, CalendarDays, Users, BedDouble, CreditCard, Landmark } from "lucide-react"
import type { BookingData } from "@/types/booking"
import { allRoomsData, type RoomData } from "@/data/rooms" // Corrected import
import { useLanguage } from "@/contexts/language-context"
import { format } from "date-fns"
import { el, de } from "date-fns/locale"

interface StepConfirmationProps {
  bookingData: BookingData
}

export default function StepConfirmation({ bookingData }: StepConfirmationProps) {
  const { language, t } = useLanguage()

  const selectedRoom: RoomData | undefined = allRoomsData.find((room) => room._id === bookingData.roomId)

  const getDateLocale = () => {
    if (language === "el") return el
    if (language === "de") return de
    return undefined // Default for English or other languages
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A"
    return format(date, "PPP", { locale: getDateLocale() })
  }

  const getRoomName = (room: RoomData | undefined) => {
    if (!room) return t("bookingWizard.confirmation.roomNotFound") || "Room Not Found"
    return t(room.nameKey) || room.id // Fallback to ID if translation missing
  }

  const getRoomFeature = (featureKey: string) => {
    return t(featureKey) || featureKey
  }

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const diffTime = Math.abs(bookingData.checkOut.getTime() - bookingData.checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays > 0 ? diffDays : 1 // Ensure at least 1 night
    }
    return 0
  }

  const nights = calculateNights()
  // Get price from selected room data from backend
  const roomPricePerNight = selectedRoom?.price || 0
  const totalPrice = nights * roomPricePerNight

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-3xl font-cormorant font-semibold text-slate-800 mb-2">
          {t("bookingWizard.confirmation.title") || "Booking Confirmed!"}
        </h2>
        <p className="text-slate-600 font-alegreya max-w-md">
          {t("bookingWizard.confirmation.subtitle")}
        </p>
      </div>

      <div className="border border-slate-200 rounded-lg p-6 space-y-4 bg-slate-50">
        <h3 className="text-xl font-cormorant font-semibold text-slate-700">
          {t("bookingWizard.confirmation.summaryTitle")}
        </h3>

        {selectedRoom && (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={selectedRoom.image || "/placeholder.svg?width=128&height=96&query=hotel+room"}
                alt={getRoomName(selectedRoom)}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-cormorant font-semibold text-[#0A4A4A]">{getRoomName(selectedRoom)}</h4>
              <p className="text-sm text-slate-600 font-alegreya">
                {selectedRoom.size ? `${selectedRoom.size}` : ""}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-alegreya">
          <div>
            <p className="text-sm text-slate-500">{t("bookingWizard.confirmation.checkIn") || "Check-in"}</p>
            <p className="text-slate-700 font-medium flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 text-slate-500" />
              {formatDate(bookingData.checkIn)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">{t("bookingWizard.confirmation.checkOut") || "Check-out"}</p>
            <p className="text-slate-700 font-medium flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 text-slate-500" />
              {formatDate(bookingData.checkOut)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">{t("bookingWizard.confirmation.guests") || "Guests"}</p>
            <p className="text-slate-700 font-medium flex items-center">
              <Users className="w-4 h-4 mr-2 text-slate-500" />
              {bookingData.adults} {t("bookingWizard.adultsLabel")}
              {bookingData.children > 0 &&
                `, ${bookingData.children} ${t("bookingWizard.childrenLabel")}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">{t("bookingWizard.confirmation.nights") || "Nights"}</p>
            <p className="text-slate-700 font-medium flex items-center">
              <BedDouble className="w-4 h-4 mr-2 text-slate-500" />
              {nights}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500 font-alegreya">
            {t("bookingWizard.confirmation.paymentMethod") || "Payment Method"}
          </p>
          <p className="text-slate-700 font-medium font-alegreya flex items-center">
            {bookingData.paymentMethod === "card" ? (
              <>
                <CreditCard className="w-4 h-4 mr-2 text-slate-500" />
                {t("bookingWizard.confirmation.paidWithCard") || "Paid with Credit Card"}
              </>
            ) : (
              <>
                <Landmark className="w-4 h-4 mr-2 text-slate-500" />
                {t("bookingWizard.confirmation.payOnArrival") || "Pay on Arrival"}
              </>
            )}
          </p>
        </div>

        {/* Show booking number if available */}
        {bookingData.bookingResult?.booking?.bookingNumber && (
          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-500 font-alegreya">
              {t("bookingWizard.confirmation.bookingNumber") || "Booking Number"}
            </p>
            <p className="text-slate-700 font-medium font-alegreya">
              #{bookingData.bookingResult.booking.bookingNumber}
            </p>
          </div>
        )}

        {selectedRoom && bookingData.paymentMethod === "card" && (
          <div className="border-t border-slate-200 pt-4 mt-4">
            <div className="flex justify-between items-center font-cormorant text-lg">
              <span className="font-semibold text-slate-700">
                {t("bookingWizard.confirmation.totalPrice") || "Total Price:"}
              </span>
              <span className="font-bold text-[#0A4A4A]">€{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center font-alegreya">
        <p className="text-slate-600">
          {t("bookingWizard.confirmation.anyQuestions") || "If you have any questions, feel free to"}{" "}
          <a href="/contact" className="text-[#0A4A4A] hover:underline">
            {t("bookingWizard.confirmation.contactUs") || "contact us"}
          </a>
          .
        </p>
      </div>
    </div>
  )
}
