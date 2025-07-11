"use client"
import Image from "next/image"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Banknote, Shield, Lock } from "lucide-react"
import { CardElement } from "@stripe/react-stripe-js" // Import CardElement
import type { BookingData } from "@/types/booking"
import { useLanguage } from "@/contexts/language-context"

interface StepPaymentProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  paymentError?: string | null // To display payment errors
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Alegreya", "Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true, // You can configure this as needed
}

export default function StepPayment({ bookingData, updateBookingData, paymentError }: StepPaymentProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-cormorant font-semibold text-slate-800 mb-2">
          {t("bookingWizard.payment.title")}
        </h2>
        <p className="text-slate-600 font-alegreya">{t("bookingWizard.payment.subtitle")}</p>
      </div>

      <RadioGroup
        value={bookingData.paymentMethod}
        onValueChange={(value: "card" | "cash") => updateBookingData({ paymentMethod: value })}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 border rounded-lg p-4 has-[:checked]:border-[#0A4A4A] has-[:checked]:ring-1 has-[:checked]:ring-[#0A4A4A]">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
            <CreditCard className="w-5 h-5 text-[#0A4A4A]" />
            <span className="font-alegreya">{t("bookingWizard.payment.creditCardLabel")}</span>
          </Label>
          <div className="flex gap-1 sm:gap-2">
            <Image src="/visa-card-logo.png" alt="Visa" width={32} height={20} className="object-contain" />
            <Image src="/mastercard-logo.png" alt="Mastercard" width={32} height={20} className="object-contain" />
            <Image
              src="/american-express-logo.png"
              alt="American Express"
              width={32}
              height={20}
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 border rounded-lg p-4 has-[:checked]:border-[#0A4A4A] has-[:checked]:ring-1 has-[:checked]:ring-[#0A4A4A]">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
            <Banknote className="w-5 h-5 text-[#0A4A4A]" />
            <span className="font-alegreya">{t("bookingWizard.payment.cashOnArrivalLabel")}</span>
          </Label>
        </div>
      </RadioGroup>

      {bookingData.paymentMethod === "card" && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-cormorant font-semibold text-slate-800">
            {t("bookingWizard.payment.cardDetailsTitle")}
          </h3>

          {/* Stripe Card Element */}
          <div className="p-3 border rounded-md bg-slate-50">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>

          {paymentError && <p className="text-sm text-red-600 font-alegreya">{paymentError}</p>}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-cormorant font-semibold text-green-800 mb-1">
                  {t("bookingWizard.payment.securePaymentTitle")}
                </h3>
                <p className="text-sm text-green-700 font-alegreya">{t("bookingWizard.payment.securePaymentInfo")}</p>
              </div>
              <Lock className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
            </div>
          </div>
        </div>
      )}
      {bookingData.paymentMethod === "cash" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-700 font-alegreya">{t("bookingWizard.payment.cashInfo")}</p>
        </div>
      )}
    </div>
  )
}
