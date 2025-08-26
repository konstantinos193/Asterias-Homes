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
  setIsCardComplete?: (complete: boolean) => void // To track card completion
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

export default function StepPayment({ bookingData, updateBookingData, paymentError, setIsCardComplete }: StepPaymentProps) {
  const { t } = useLanguage()

  // Handle card element change to track completion
  const handleCardChange = (event: any) => {
    if (setIsCardComplete) {
      setIsCardComplete(event.complete)
    }
  }

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
          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-amber-800">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-alegreya font-medium">
                🔒 Your payment information is protected by bank-level security
              </span>
            </div>
          </div>
          
          <h3 className="text-lg font-cormorant font-semibold text-slate-800">
            {t("bookingWizard.payment.cardDetailsTitle")}
          </h3>

          {/* Stripe Card Element */}
          <div className="p-3 border rounded-md bg-slate-50">
            <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardChange} />
          </div>

          {/* Card completion status */}
          {setIsCardComplete && (
            <div className="text-sm text-slate-600 font-alegreya">
              {t("bookingWizard.payment.cardStatus", "Please complete your card details to proceed")}
            </div>
          )}

          {paymentError && <p className="text-sm text-red-600 font-alegreya">{paymentError}</p>}

          {/* Enhanced Security Information */}
          <div className="space-y-4 mt-4">
            {/* Stripe Security Badge */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm p-1.5">
                    <img 
                      src="/stripe-4.svg" 
                      alt="Stripe" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-base">
                      Powered by Stripe
                    </h3>
                    <p className="text-xs text-slate-600">Secure payment processing</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>PCI DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>GDPR Compliant</span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {t("bookingWizard.payment.stripeSecurityInfo")}
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Trusted by millions of businesses worldwide</span>
                  <div className="flex items-center gap-1">
                    <span className="text-green-600">●</span>
                    <span>Secure</span>
                  </div>
                </div>
              </div>
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
