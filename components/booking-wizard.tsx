"use client"

import { useState, useEffect } from "react"
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import StepRoomDetails from "./booking-steps/step-room-details"
import StepGuestInfo from "./booking-steps/step-guest-info"
import StepPayment from "./booking-steps/step-payment"
import StepConfirmation from "./booking-steps/step-confirmation"
import type { BookingData } from "@/types/booking"
import { useLanguage } from "@/contexts/language-context"
import { paymentsAPI } from "@/lib/api"

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js" // Import Stripe hooks

const stepsConfig = (t: Function) => [
  { id: 1, name: t("bookingWizard.steps.room"), component: StepRoomDetails },
  { id: 2, name: t("bookingWizard.steps.guestInfo"), component: StepGuestInfo },
  { id: 3, name: t("bookingWizard.steps.payment"), component: StepPayment },
  { id: 4, name: t("bookingWizard.steps.confirmation"), component: StepConfirmation },
]

interface BookingWizardProps {
  initialRoomId: string
  preFilledData?: {
    checkIn?: string
    checkOut?: string
    adults?: number
    children?: number
    rooms?: number
    price?: number
    guests?: number
  }
  language?: string // Add language prop to preserve context
}

export default function BookingWizard({ initialRoomId, preFilledData, language }: BookingWizardProps) {
  const { t, language: contextLanguage, setLanguage } = useLanguage()
  
  // Use the passed language prop to set the context language if different
  useEffect(() => {
    if (language && language !== contextLanguage) {
      setLanguage(language as "el" | "en" | "de")
    }
  }, [language, contextLanguage, setLanguage])
  
  const steps = stepsConfig(t)
  
  // Always start from step 1 (Room Details) since dates are pre-filled
  const [currentStep, setCurrentStep] = useState(1)
  
  const [bookingData, setBookingData] = useState<BookingData>({
    roomId: initialRoomId,
    checkIn: preFilledData?.checkIn ? new Date(preFilledData.checkIn) : undefined,
    checkOut: preFilledData?.checkOut ? new Date(preFilledData.checkOut) : undefined,
    adults: preFilledData?.adults || 2,
    children: preFilledData?.children || 0,
    roomQuantity: preFilledData?.rooms || 1,
    roomPrice: preFilledData?.price && preFilledData?.checkIn && preFilledData?.checkOut
      ? Math.ceil((new Date(preFilledData.checkOut).getTime() - new Date(preFilledData.checkIn).getTime()) / (1000 * 60 * 60 * 24)) > 0
        ? Math.round(preFilledData.price / Math.ceil((new Date(preFilledData.checkOut).getTime() - new Date(preFilledData.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
        : preFilledData.price
      : 0,
    nights: preFilledData?.checkIn && preFilledData?.checkOut 
      ? Math.ceil((new Date(preFilledData.checkOut).getTime() - new Date(preFilledData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
      : 1,
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
  const [isCardComplete, setIsCardComplete] = useState(false) // Track card completion

  const stripe = useStripe()
  const elements = useElements()

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
    if (data.paymentMethod) {
      setPaymentError(null) // Clear error on payment method change
      setIsCardComplete(false) // Reset card completion when payment method changes
    }
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: // Room Details (now step 1)
        return !!bookingData.roomId
      case 2: // Guest Information (now step 2)
        return !!(
          bookingData.guestInfo.firstName &&
          bookingData.guestInfo.lastName &&
          bookingData.guestInfo.email &&
          bookingData.guestInfo.phone
        )
      case 3: // Payment step (now step 3)
        // For cash payment, it's always valid to proceed
        if (bookingData.paymentMethod === "cash") return true
        // For card payment, we need to validate that Stripe is loaded and card details are entered
        if (!stripe || !elements) return false
        // Check if card element has been interacted with (basic validation)
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) return false
        // Use our state variable to track card completion
        return isCardComplete
      case 4: // Confirmation step (now step 4)
        // Only allow confirmation if payment is properly set up
        if (bookingData.paymentMethod === "cash") return true
        // For card payments, ensure Stripe is ready
        return !!(stripe && elements)
      default:
        return false
    }
  }

  const canProceed = isStepValid(currentStep)
  const canGoBack = currentStep > 1

  const handleNext = async () => {
    if (canProceed && currentStep < steps.length) {
      // If we're on the payment step (step 3), process payment before proceeding
      if (currentStep === 3) {
        if (bookingData.paymentMethod === "card") {
          await handleSubmitBooking()
          return // Don't proceed if payment is being processed
        } else if (bookingData.paymentMethod === "cash") {
          // For cash payments, create the booking directly
          try {
            setIsProcessingPayment(true)
            const confirmationResult = await paymentsAPI.createCashBooking({
              roomId: bookingData.roomId,
              checkIn: bookingData.checkIn!.toISOString(),
              checkOut: bookingData.checkOut!.toISOString(),
              adults: bookingData.adults,
              children: bookingData.children,
              totalAmount: (bookingData.roomPrice || 0) * (bookingData.nights || 1),
              guestInfo: {
                ...bookingData.guestInfo,
                language: language
              },
              specialRequests: bookingData.guestInfo.specialRequests
            });
            
            console.log("Cash booking created:", confirmationResult);
            
            // Proceed to confirmation step
            setCurrentStep(currentStep + 1)
            setIsProcessingPayment(false)
            setPaymentError(null) // Clear any payment errors
            
            // Store the booking result
            setBookingData(prev => ({
              ...prev,
              bookingResult: confirmationResult
            }))
            return
          } catch (error: any) {
            console.error("Cash booking creation failed:", error);
            setPaymentError(error.message || t("bookingWizard.errors.bookingCreationFailed"));
            setIsProcessingPayment(false);
            return;
          }
        }
      }
      
      setCurrentStep(currentStep + 1)
      // Clear payment errors when moving to confirmation step
      if (currentStep + 1 === 4) {
        setPaymentError(null)
      }
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
          
          // Instead of redirecting, proceed to the next step (confirmation)
          setCurrentStep(currentStep + 1)
          setIsProcessingPayment(false)
          setPaymentError(null) // Clear any payment errors
          
          // Store the booking result for the confirmation step
          setBookingData(prev => ({
            ...prev,
            bookingResult: confirmationResult
          }))
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
    <>
      {/* Background gradient matching main page */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#f8f6f1] via-[#e8e2d5] to-[#dbe6e4]" aria-hidden="true" />
      
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
                        : "border-slate-300 text-slate-400 cursor-default"
                  }`}
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
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4 sm:p-6 mb-6 min-h-[300px] shadow-lg">
          <CurrentStepComponent
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            // Pass paymentError and setIsCardComplete to StepPayment if it's the current component
            {...(CurrentStepComponent === StepPayment && { 
              paymentError,
              setIsCardComplete 
            })}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={!canGoBack || isProcessingPayment}
            className="flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-colors font-alegreya"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("bookingWizard.buttons.previous")}
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed || isProcessingPayment}
              className="flex items-center gap-2 px-8 py-3 bg-[#0A4A4A] hover:bg-[#083a3a] text-white border-2 border-[#0A4A4A] transition-colors font-alegreya"
            >
              {isProcessingPayment && currentStep === steps.length - 1 ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isProcessingPayment && currentStep === steps.length - 1
                ? t("bookingWizard.buttons.processing")
                : t("bookingWizard.buttons.next")}
              {!isProcessingPayment && <ChevronRight className="w-4 w-4" />}
            </Button>
          ) : (
            <Button
              onClick={handleSubmitBooking}
              disabled={!canProceed || isProcessingPayment || !stripe || !elements}
              className="px-8 py-3 bg-[#0A4A4A] hover:bg-[#083a3a] text-white border-2 border-[#0A4A4A] transition-colors font-alegreya min-w-[180px]"
            >
              {isProcessingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isProcessingPayment ? t("bookingWizard.buttons.processing") : t("bookingWizard.buttons.completeBooking")}
            </Button>
          )}
        </div>
      </div>
      
      {/* Only show payment errors on payment step, not on confirmation */}
      {currentStep === 3 && paymentError && (
        <p className="text-sm text-red-600 font-alegreya mt-4 text-right">{paymentError}</p>
      )}
    </>
  )
}
