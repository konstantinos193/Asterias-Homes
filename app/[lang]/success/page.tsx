"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { CheckCircle, Calendar, Users, CreditCard, Landmark, Mail, Phone, MapPin, Home } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { el, enUS, de } from "date-fns/locale"

export default function SuccessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const paymentMethod = searchParams.get("payment_method") || "card"
  const bookingId = searchParams.get("booking_id")
  const bookingNumber = searchParams.get("booking_number")

  const dateLocale = language === "el" ? el : language === "de" ? de : enUS

  useEffect(() => {
    // If we have a booking ID, fetch booking details
    if (bookingId) {
      fetchBookingDetails(bookingId)
    } else {
      setLoading(false)
    }
  }, [bookingId])

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (apiKey) {
        headers["x-api-key"] = apiKey
      }

      const response = await fetch(
        `https://asterias-backend.onrender.com/api/bookings/${bookingId}`,
        { headers }
      )
      
      if (response.ok) {
        const data = await response.json()
        setBookingData(data)
      }
    } catch (error) {
      console.error("Error fetching booking details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f6f1] via-[#e8e2d5] to-[#dbe6e4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A4A4A] mx-auto mb-4"></div>
          <p className="text-slate-600 font-alegreya">{t("loading") || "Loading..."}</p>
        </div>
      </div>
    )
  }

  const displayCheckIn = bookingData?.checkIn 
    ? format(new Date(bookingData.checkIn), "PPP", { locale: dateLocale })
    : null
  const displayCheckOut = bookingData?.checkOut 
    ? format(new Date(bookingData.checkOut), "PPP", { locale: dateLocale })
    : null
  const nights = bookingData?.checkIn && bookingData?.checkOut
    ? Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#e8e2d5] to-[#dbe6e4] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon and Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-[#0A4A4A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-cormorant font-light text-slate-800 mb-4">
              {t("bookingWizard.confirmation.success") || "Your booking has been confirmed!"}
            </h1>
            <div className="w-24 h-0.5 bg-[#0A4A4A] mx-auto mb-6"></div>
            <p className="text-lg text-slate-600 font-alegreya max-w-2xl mx-auto">
              {t("bookingWizard.confirmation.subtitle") || "Thank you for your booking. A confirmation email has been sent to you with all the details."}
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-cormorant font-semibold text-slate-800 mb-6">
              {t("bookingWizard.confirmation.details") || "Booking Details"}
            </h2>

            {/* Booking Number */}
            {(bookingNumber || bookingData?.bookingNumber) && (
              <div className="mb-6 p-4 bg-[#0A4A4A]/5 rounded-lg border border-[#0A4A4A]/20">
                <p className="text-sm text-slate-600 font-alegreya mb-1">
                  {t("bookingWizard.confirmation.bookingNumber") || "Booking Number"}
                </p>
                <p className="text-2xl font-cormorant font-bold text-[#0A4A4A]">
                  #{(bookingNumber || bookingData?.bookingNumber)}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {/* Check-in / Check-out */}
              {(displayCheckIn || displayCheckOut) && (
                <div className="flex flex-col sm:flex-row gap-6">
                  {displayCheckIn && (
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm font-alegreya font-medium">
                          {t("bookingWizard.confirmation.checkIn") || "Check-in"}
                        </span>
                      </div>
                      <p className="text-lg font-alegreya text-slate-800">{displayCheckIn}</p>
                    </div>
                  )}
                  {displayCheckOut && (
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm font-alegreya font-medium">
                          {t("bookingWizard.confirmation.checkOut") || "Check-out"}
                        </span>
                      </div>
                      <p className="text-lg font-alegreya text-slate-800">{displayCheckOut}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Guests and Nights */}
              {(bookingData?.adults || nights) && (
                <div className="flex flex-col sm:flex-row gap-6">
                  {bookingData?.adults && (
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Users className="h-5 w-5" />
                        <span className="text-sm font-alegreya font-medium">
                          {t("bookingWizard.confirmation.guests") || "Guests"}
                        </span>
                      </div>
                      <p className="text-lg font-alegreya text-slate-800">
                        {bookingData.adults} {bookingData.adults === 1 ? "adult" : "adults"}
                        {bookingData.children > 0 && `, ${bookingData.children} ${bookingData.children === 1 ? "child" : "children"}`}
                      </p>
                    </div>
                  )}
                  {nights && (
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm font-alegreya font-medium">
                          {t("bookingWizard.confirmation.nights") || "Nights"}
                        </span>
                      </div>
                      <p className="text-lg font-alegreya text-slate-800">{nights} {nights === 1 ? "night" : "nights"}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Method */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  {paymentMethod === "card" ? (
                    <CreditCard className="h-5 w-5" />
                  ) : (
                    <Landmark className="h-5 w-5" />
                  )}
                  <span className="text-sm font-alegreya font-medium">
                    {t("bookingWizard.confirmation.paymentMethod") || "Payment Method"}
                  </span>
                </div>
                <p className="text-lg font-alegreya text-slate-800">
                  {paymentMethod === "card" 
                    ? (t("bookingWizard.confirmation.paidWithCard") || "Paid with Credit Card")
                    : (t("bookingWizard.confirmation.payOnArrival") || "Pay on Arrival")}
                </p>
              </div>

              {/* Total Price */}
              {bookingData?.totalAmount && (
                <div className="border-t border-slate-200 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-alegreya font-semibold text-slate-700">
                      {t("bookingWizard.confirmation.totalPrice") || "Total Price:"}
                    </span>
                    <span className="text-3xl font-cormorant font-bold text-[#0A4A4A]">
                      €{bookingData.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Confirmation Notice */}
          {bookingData?.guestInfo?.email && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-alegreya font-semibold text-blue-900 mb-1">
                    {t("bookingWizard.confirmation.emailSent")?.replace("{email}", bookingData.guestInfo.email) || 
                     `A confirmation email has been sent to ${bookingData.guestInfo.email}`}
                  </h3>
                  <p className="text-sm text-blue-700 font-alegreya">
                    {t("bookingWizard.confirmation.checkEmail") || "Please check your inbox for booking details."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-8 mb-8">
            <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-4">
              {t("bookingWizard.confirmation.contactInfo") || "Contact Information"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#0A4A4A]" />
                <a href="tel:+306972705881" className="text-slate-700 hover:text-[#0A4A4A] font-alegreya">
                  +30 6972705881
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#0A4A4A]" />
                <a href="mailto:asterias.apartmentskoronisia@gmail.com" className="text-slate-700 hover:text-[#0A4A4A] font-alegreya">
                  asterias.apartmentskoronisia@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#0A4A4A] mt-0.5" />
                <p className="text-slate-700 font-alegreya">
                  Koronisia, Arta 48100, Greece
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${language}`}
              className="px-8 py-3 bg-[#0A4A4A] hover:bg-[#083a3a] text-white rounded-lg transition-colors font-alegreya font-semibold flex items-center justify-center gap-2"
            >
              <Home className="h-5 w-5" />
              {t("bookingWizard.confirmation.backToHome") || "Back to Home"}
            </Link>
            <Link
              href={`/${language}/bookings`}
              className="px-8 py-3 bg-white hover:bg-slate-50 text-[#0A4A4A] border-2 border-[#0A4A4A] rounded-lg transition-colors font-alegreya font-semibold"
            >
              {t("bookingWizard.confirmation.bookAnother") || "Book Another Room"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
