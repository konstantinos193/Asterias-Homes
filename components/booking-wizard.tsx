"use client"

import { useState } from "react"
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import StepDates from "./booking-steps/step-dates"
import StepRoomDetails from "./booking-steps/step-room-details"
import StepGuestInfo from "./booking-steps/step-guest-info"
import StepPayment from "./booking-steps/step-payment"
import StepConfirmation from "./booking-steps/step-confirmation"
import type { BookingData } from "@/types/booking"
import { useLanguage } from "@/contexts/language-context"
import { paymentsAPI } from "@/lib/api"

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js" // Import Stripe hooks

const stepsConfig = (t: Function) => [
  { id: 1, name: t("bookingWizard.steps.dates"), component: StepDates },
  { id: 2, name: t("bookingWizard.steps.room"), component: StepRoomDetails },
  { id: 3, name: t("bookingWizard.steps.guestInfo"), component: StepGuestInfo },
  { id: 4, name: t("bookingWizard.steps.payment"), component: StepPayment },
  { id: 5, name: t("bookingWizard.steps.confirmation"), component: StepConfirmation },
]

interface BookingWizardProps {
  initialRoomId: string
}

export default function BookingWizard({ initialRoomId }: BookingWizardProps) {
  const { t, language } = useLanguage()
  const steps = stepsConfig(t)
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    roomId: initialRoomId,
    checkIn: undefined,
    checkOut: undefined,
    adults: 2,
    children: 0,
    guestInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
    paymentMethod: "card", // Default to card
    // cardDetails are no longer needed here if Stripe handles them directly
  })
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
    if (data.paymentMethod) setPaymentError(null) // Clear error on payment method change
  }

  const isStepValid = (step: number): boolean => {
    // ... (keep existing validation logic)
    // For step 4 (Payment), if method is 'card', Stripe element validity is handled at submission
    // For step 4 (Payment), if method is 'cash', it's always valid to proceed
    switch (step) {
      case 1:
        return !!(bookingData.checkIn && bookingData.checkOut && bookingData.adults > 0)
      case 2:
        return !!bookingData.roomId
      case 3:
        return !!(
          bookingData.guestInfo.firstName &&
          bookingData.guestInfo.lastName &&
          bookingData.guestInfo.email &&
          bookingData.guestInfo.phone
        )
      case 4: // Payment step
        if (bookingData.paymentMethod === "cash") return true
        // For card, Stripe element handles validation, so we assume it's valid to proceed to confirmation
        // Actual card validation happens on final submission.
        return true
      case 5: // Confirmation step
        return true
      default:
        return false
    }
  }

  const canProceed = isStepValid(currentStep)
  const canGoBack = currentStep > 1

  const handleNext = () => {
    if (canProceed && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      setPaymentError(null) // Clear previous errors
    }
  }

  const handleBack = () => {
    if (canGoBack) {
      setCurrentStep(currentStep - 1)
      setPaymentError(null) // Clear previous errors
    }
  }

  const handleStepClick = (stepNumber: number) => {
    // Allow navigation to already visited/valid steps
    if (
      stepNumber < currentStep ||
      stepNumber === currentStep ||
      (stepNumber > currentStep && isStepValid(stepNumber - 1))
    ) {
      setCurrentStep(stepNumber)
      setPaymentError(null)
    }
  }

  const handleSubmitBooking = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      setPaymentError(t("bookingWizard.errors.stripeNotLoaded"))
      return
    }
    setPaymentError(null)
    setIsProcessingPayment(true)

    if (bookingData.paymentMethod === "cash") {
      // Handle cash payment: typically means saving booking and redirecting
      console.log("Processing cash booking:", bookingData)
      // Here you would typically save the booking to your database with 'pending payment' or 'pay on arrival' status
      window.location.href = "/success?payment_method=cash" // Redirect to success page
      setIsProcessingPayment(false)
      return
    }

    // Handle card payment
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setPaymentError(t("bookingWizard.errors.cardElementNotFound"))
      setIsProcessingPayment(false)
      return
    }

    try {
      // 1. Create PaymentIntent on the server
      const paymentIntentResult = await paymentsAPI.createPaymentIntent({
        roomId: bookingData.roomId,
        checkIn: bookingData.checkIn!.toISOString(),
        checkOut: bookingData.checkOut!.toISOString(),
        adults: bookingData.adults,
        children: bookingData.children,
        currency: "eur",
      })

      if (!paymentIntentResult.clientSecret) {
        setPaymentError(t("bookingWizard.errors.paymentIntentCreationFailed"))
        setIsProcessingPayment(false)
        return
      }

      // 2. Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentResult.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${bookingData.guestInfo.firstName} ${bookingData.guestInfo.lastName}`,
            email: bookingData.guestInfo.email,
            phone: bookingData.guestInfo.phone,
          },
        },
      })

      if (error) {
        setPaymentError(error.message || t("bookingWizard.errors.paymentFailed"))
        setIsProcessingPayment(false)
      } else if (paymentIntent?.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent)
        
        // 3. Confirm payment and create booking on the backend
        try {
          const confirmationResult = await paymentsAPI.confirmPayment({
            paymentIntentId: paymentIntent.id,
            guestInfo: {
              ...bookingData.guestInfo,
              language: language // Include the customer's language
            },
            specialRequests: bookingData.guestInfo.specialRequests
          });
          
          console.log("Booking created:", confirmationResult);
          window.location.href = `/success?payment_intent=${paymentIntent.id}&payment_method=card&booking_id=${confirmationResult.booking?.bookingNumber}`; // Redirect to success page
        } catch (confirmError: any) {
          console.error("Booking creation failed:", confirmError);
          setPaymentError(confirmError.message || t("bookingWizard.errors.bookingCreationFailed"));
          setIsProcessingPayment(false);
          return;
        }
      } else {
        setPaymentError(t("bookingWizard.errors.paymentNotSucceeded") + ` ${paymentIntent?.status}`)
        setIsProcessingPayment(false)
      }
    } catch (err: any) {
      setPaymentError(err.message || t("bookingWizard.errors.unexpectedError"))
      setIsProcessingPayment(false)
    }
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.id} className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}>
              <button
                onClick={() => handleStepClick(step.id)}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors shrink-0 ${
                  step.id < currentStep
                    ? "bg-[#0A4A4A] border-[#0A4A4A] text-white cursor-pointer"
                    : step.id === currentStep
                      ? "border-[#0A4A4A] text-[#0A4A4A] cursor-pointer"
                      : "border-slate-300 text-slate-400 cursor-default" // Changed to cursor-default for future steps
                }`}
                // disabled={step.id > currentStep && !isStepValid(step.id - 1)} // Allow clicking to current step
              >
                {step.id < currentStep ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <span className="font-semibold text-sm sm:text-base">{step.id}</span>
                )}
              </button>
              <div className="ml-2 sm:ml-3 hidden md:block">
                <p
                  className={`text-xs sm:text-sm font-medium ${step.id <= currentStep ? "text-slate-800" : "text-slate-400"}`}
                >
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ml-2 sm:ml-4 mr-2 sm:mr-4 ${
                    step.id < currentStep ? "bg-[#0A4A4A]" : "bg-slate-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 mb-6 min-h-[300px]">
        <CurrentStepComponent
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          // Pass paymentError to StepPayment if it's the current component
          {...(CurrentStepComponent === StepPayment && { paymentError })}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={!canGoBack || isProcessingPayment}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {t("bookingWizard.buttons.previous")}
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed || isProcessingPayment}
            className="flex items-center gap-2 bg-[#0A4A4A] hover:bg-[#083a3a]"
          >
            {isProcessingPayment && currentStep === steps.length - 1 ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isProcessingPayment && currentStep === steps.length - 1
              ? t("bookingWizard.buttons.processing")
              : t("bookingWizard.buttons.next")}
            {!isProcessingPayment && <ChevronRight className="w-4 h-4" />}
          </Button>
        ) : (
          <Button
            onClick={handleSubmitBooking}
            disabled={!canProceed || isProcessingPayment || !stripe || !elements}
            className="bg-[#0A4A4A] hover:bg-[#083a3a] min-w-[180px]"
          >
            {isProcessingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isProcessingPayment ? t("bookingWizard.buttons.processing") : t("bookingWizard.buttons.completeBooking")}
          </Button>
        )}
      </div>
      {currentStep === steps.length && paymentError && bookingData.paymentMethod === "card" && (
        <p className="text-sm text-red-600 font-alegreya mt-4 text-right">{paymentError}</p>
      )}
    </div>
  )
}
