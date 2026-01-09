"use client"

import { useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useOffers } from "@/hooks/api"
import { Offer } from "@/types/offers"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Star, Tag } from "lucide-react"
import { logger } from "@/lib/logger"

export default function OffersPageClient() {
  const { t, language } = useLanguage()
  const { data: offersData, isLoading: loading, error: queryError } = useOffers()

  // Process and filter active offers
  const offers = useMemo(() => {
    if (!offersData || !Array.isArray(offersData)) return []
    
    // Filter only active offers that are currently valid
    // Cast to the expected Offer type from types/offers.ts
    const allOffers = offersData as unknown as Offer[]
    const now = new Date()
    return allOffers.filter((offer: Offer) => {
      return offer.active && 
        new Date(offer.startDate || '') <= now && 
        new Date(offer.endDate || '') >= now
    })
  }, [offersData])

  // Handle errors
  const error = queryError ? (() => {
    logger.error('Failed to fetch offers', queryError as Error)
    return 'Failed to load offers'
  })() : null

  return (
    <main className="bg-[#A9AEA2]/30 text-slate-800 pt-20 sm:pt-24 font-alegreya">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto container-mobile text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-cormorant font-bold mb-3 sm:mb-4">
            {t("offers.pageTitle") || t("offers.section.title")}
          </h1>
          <div className="w-12 sm:w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-sm sm:text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
            {t("offers.pageDescription") || t("offers.section.subtitle")}
          </p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto container-mobile">
          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-slate-600">{t("common.loading") || "Loading..."}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#8B4B5C] text-white px-6 py-3 rounded-md hover:bg-[#7A4251] transition-colors"
              >
                {t("common.retry") || "Retry"}
              </button>
            </div>
          ) : offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <Image
                      src={offer.image || "/placeholder.svg"}
                      alt={offer.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-[#8B4B5C] text-white px-2 py-1 rounded-full text-xs font-medium">
                      {t("offers.specialOffer") || "Special Offer"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-cormorant font-semibold text-slate-800 flex-1">
                        {offer.title}
                      </h3>
                      <div className="flex items-center space-x-1 ml-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 line-clamp-3">
                      {offer.description}
                    </p>

                    {/* Features */}
                    {offer.includesKeys && offer.includesKeys.length > 0 ? (
                      <ul className="space-y-2 mb-4 sm:mb-6">
                        {offer.includesKeys.slice(0, 3).map((featureKey, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 bg-[#8B4B5C] rounded-full flex-shrink-0"></div>
                            <span>{t(featureKey)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {/* Price and Validity */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="text-2xl sm:text-3xl font-cormorant font-bold text-[#8B4B5C]">
                        {offer.discount}% OFF
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {t("offers.validUntil") || "Valid until"} {new Date(offer.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 sm:space-y-0 sm:space-x-2 sm:flex">
                      <Link
                        href={`/${language}/offers/${offer._id}`}
                        className="inline-flex items-center justify-center rounded-md bg-[#8B4B5C] text-white px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-[#7A4251] transition-colors font-medium text-sm sm:text-base min-h-[44px] max-w-fit"
                      >
                        {t("offers.viewOffer") || "View Offer"}
                      </Link>
                      <Link
                        href={`/${language}/rooms`}
                        className="inline-flex items-center justify-center rounded-md border border-[#8B4B5C] text-[#8B4B5C] px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-[#8B4B5C] hover:text-white transition-colors font-medium text-sm sm:text-base min-h-[44px] max-w-fit"
                      >
                        {t("offers.bookNow") || "Book Now"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <Tag className="h-16 w-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                {t("offers.noOffersTitle") || "No Special Offers Available"}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6">
                {t("offers.noOffersDescription") || "Check back soon for exciting offers and discounts!"}
              </p>
              <Link
                href={`/${language}/rooms`}
                className="inline-block bg-[#8B4B5C] text-white px-6 py-3 rounded-md hover:bg-[#7A4251] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-sm sm:text-base"
              >
                {t("offers.viewRooms") || "View Rooms"}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 sm:py-12 md:py-16 bg-white/80">
        <div className="container mx-auto container-mobile text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-cormorant font-semibold mb-4 sm:mb-6">
            {t("offers.ctaTitle") || t("rooms.ctaTitle")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t("offers.ctaDescription") || t("rooms.ctaDescription")}
          </p>
          <Link
            href={`/${language}/contact`}
            className="inline-block bg-[#8B4B5C] text-white px-6 sm:px-8 py-3 rounded-md hover:bg-[#7A4251] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-sm sm:text-base"
          >
            {t("bookingWizard.confirmation.contactUs") || "Contact Us"}
          </Link>
        </div>
      </section>
    </main>
  )
}

