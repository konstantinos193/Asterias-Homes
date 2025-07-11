"use client"

import Link from "next/link"
import BookingWizard from "@/components/booking-wizard"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useLanguage } from "@/contexts/language-context" // Assuming you have this for translations

// Make sure to set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface BookingPageProps {
  params: { roomId: string }
}

export default function BookingPage({ params }: BookingPageProps) {
  const { roomId } = params
  const { t } = useLanguage() // For translations

  const options = {
    // passing the client secret obtained from the server
    // clientSecret: '{{CLIENT_SECRET}}', // This will be set dynamically later if needed for appearance
    appearance: {
      theme: "stripe" as const,
      labels: "floating" as const,
      variables: {
        colorPrimary: "#0A4A4A", // Your primary color
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: "Alegreya, Ideal Sans, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "4px",
        // See all possible variables below
      },
    },
  }

  // If Stripe is not configured, show an error or fallback
  if (!stripePromise) {
    return (
      <div className="pt-24 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-cormorant font-semibold text-slate-800 mb-4">
              Payment System Unavailable
            </h1>
            <p className="text-slate-600 font-alegreya">
              The payment system is currently being configured. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="pt-24 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <nav className="text-sm font-alegreya text-slate-600 mb-6">
            <Link href="/" className="hover:text-[#0A4A4A]">
              {t("bookingPage.nav.home")}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/rooms" className="hover:text-[#0A4A4A]">
              {t("bookingPage.nav.rooms")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800">{t("bookingPage.nav.booking")}</span>
          </nav>

          <h1 className="text-3xl font-cormorant font-light text-slate-800 mb-2">{t("bookingPage.title")}</h1>
          <p className="text-slate-600 font-alegreya">{t("bookingPage.subtitle")}</p>
        </div>
      </div>

      <section className="pb-16 bg-white mt-12">
        <div className="container mx-auto px-4">
          {/* Wrap BookingWizard with Elements provider */}
          <Elements stripe={stripePromise} options={options}>
            <BookingWizard initialRoomId={roomId} />
          </Elements>
        </div>
      </section>
    </>
  )
}
