"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { offersAPI } from "@/lib/api"
import { Offer } from "@/types/offers"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Star, ArrowLeft, Tag, Check } from "lucide-react"

interface OfferDetailPageClientProps {
  offerId: string
}

export default function OfferDetailPageClient({ offerId }: OfferDetailPageClientProps) {
  const { t, language } = useLanguage()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true)
        const response = await offersAPI.getById(offerId)
        if (response && response.offer) {
          setOffer(response.offer)
        } else if (response) {
          setOffer(response)
        } else {
          setError('Offer not found')
        }
      } catch (err) {
        console.error('Failed to fetch offer:', err)
        setError('Failed to load offer')
      } finally {
        setLoading(false)
      }
    }

    if (offerId) {
      fetchOffer()
    }
  }, [offerId])

  if (loading) {
    return (
      <main className="bg-[#A9AEA2]/30 text-slate-800 pt-20 sm:pt-24 font-alegreya min-h-screen">
        <div className="container mx-auto container-mobile py-12 text-center">
          <p className="text-slate-600">{t("common.loading") || "Loading..."}</p>
        </div>
      </main>
    )
  }

  if (error || !offer) {
    return (
      <main className="bg-[#A9AEA2]/30 text-slate-800 pt-20 sm:pt-24 font-alegreya min-h-screen">
        <div className="container mx-auto container-mobile py-12 text-center">
          <Tag className="h-16 w-16 mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-2">
            {error || "Offer Not Found"}
          </h2>
          <p className="text-slate-600 mb-6">
            {t("offers.notFound") || "The offer you're looking for doesn't exist or has expired."}
          </p>
          <Link
            href={`/${language}/offers`}
            className="inline-block bg-[#8B4B5C] text-white px-6 py-3 rounded-md hover:bg-[#7A4251] transition-colors"
          >
            {t("offers.backToOffers") || "Back to Offers"}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#A9AEA2]/30 text-slate-800 pt-20 sm:pt-24 font-alegreya min-h-screen">
      {/* Back Button */}
      <section className="py-4 sm:py-6 bg-white/80">
        <div className="container mx-auto container-mobile">
          <Link
            href={`/${language}/offers`}
            className="inline-flex items-center space-x-2 text-[#8B4B5C] hover:text-[#7A4251] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("common.back") || "Back to Offers"}</span>
          </Link>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#E8E2D5] to-[#D4C9B8]"></div>
        )}
        <div className="absolute inset-0 bg-slate-900/40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 text-white">
          <div className="container mx-auto container-mobile">
            <div className="inline-block bg-[#8B4B5C] text-white px-3 py-1 rounded-full text-xs font-medium mb-4">
              {t("offers.specialOffer") || "Special Offer"}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-cormorant font-bold mb-2">
              {offer.title}
            </h1>
            <div className="text-2xl sm:text-3xl font-cormorant font-bold text-[#8B4B5C]">
              {offer.discount}% OFF
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto container-mobile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
                <h2 className="text-2xl sm:text-3xl font-cormorant font-semibold mb-4">
                  {t("offers.aboutOffer") || "About This Offer"}
                </h2>
                <div className="w-12 h-0.5 bg-[#8B4B5C] mb-6"></div>
                <p className="text-slate-600 mb-6 whitespace-pre-line">
                  {offer.description}
                </p>

                {/* Features */}
                {offer.includesKeys && offer.includesKeys.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-cormorant font-semibold mb-4">
                      {t("offers.whatsIncluded") || "What's Included"}
                    </h3>
                    <ul className="space-y-3">
                      {offer.includesKeys.map((featureKey, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-[#8B4B5C] flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600">{t(featureKey)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conditions */}
                {offer.conditions && (
                  <div className="mt-8">
                    <h3 className="text-xl font-cormorant font-semibold mb-4">
                      {t("offers.conditions") || "Terms & Conditions"}
                    </h3>
                    <p className="text-slate-600 whitespace-pre-line">
                      {offer.conditions}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-4xl sm:text-5xl font-cormorant font-bold text-[#8B4B5C] mb-2">
                    {offer.discount}% OFF
                  </div>
                  <p className="text-slate-600 text-sm">
                    {t("offers.discount") || "Special Discount"}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="h-5 w-5 text-[#8B4B5C]" />
                    <div>
                      <p className="text-sm font-medium">
                        {t("offers.validFrom") || "Valid From"}
                      </p>
                      <p className="text-sm">
                        {new Date(offer.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="h-5 w-5 text-[#8B4B5C]" />
                    <div>
                      <p className="text-sm font-medium">
                        {t("offers.validUntil") || "Valid Until"}
                      </p>
                      <p className="text-sm">
                        {new Date(offer.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {offer.code && (
                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-slate-600 mb-2">
                      {t("offers.promoCode") || "Promo Code"}
                    </p>
                    <p className="text-lg font-mono font-bold text-[#8B4B5C]">
                      {offer.code}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Link
                    href={`/${language}/rooms`}
                    className="block w-full text-center bg-[#8B4B5C] text-white px-6 py-3 rounded-md hover:bg-[#7A4251] transition-colors font-medium"
                  >
                    {t("offers.bookNow") || "Book Now"}
                  </Link>
                  <Link
                    href={`/${language}/contact`}
                    className="block w-full text-center border border-[#8B4B5C] text-[#8B4B5C] px-6 py-3 rounded-md hover:bg-[#8B4B5C] hover:text-white transition-colors font-medium"
                  >
                    {t("offers.contactUs") || "Contact Us"}
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

