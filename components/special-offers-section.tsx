"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Calendar, Star } from "lucide-react"
import { offersAPI } from "@/lib/api"
import { Offer } from "@/types/offers"

export default function SpecialOffersSection() {
  const { t } = useLanguage()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)
        const response = await offersAPI.getAll()
        if (response && response.offers) {
          // Filter only active offers that are currently valid
          const now = new Date()
          const activeOffers = response.offers.filter(offer => 
            offer.active && 
            new Date(offer.startDate) <= now && 
            new Date(offer.endDate) >= now
          )
          setOffers(activeOffers)
        } else {
          setOffers([])
        }
      } catch (err) {
        console.error('Failed to fetch offers:', err)
        setError('Failed to load offers')
        setOffers([])
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  // Don't render anything if there are no offers
  if (loading) {
    return null // Don't show loading state, just don't render
  }

  if (error || offers.length === 0) {
    return null // Don't render the section if there are no offers
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#E8E2D5] to-[#D4C9B8]">
      <div className="container mx-auto container-mobile">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-cormorant font-light text-slate-800 mb-3 sm:mb-4">
            {t("offers.section.title")}
          </h2>
          <div className="w-12 sm:w-16 h-0.5 bg-[#8B4B5C] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-alegreya">
            {t("offers.section.subtitle")}
          </p>
        </div>

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
                />
                <div className="absolute top-3 right-3 bg-[#8B4B5C] text-white px-2 py-1 rounded-full text-xs font-medium">
                  Special Offer
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

                {/* Features - if offer has includesKeys, use them, otherwise show default features */}
                {offer.includesKeys && offer.includesKeys.length > 0 ? (
                  <ul className="space-y-2 mb-4 sm:mb-6">
                    {offer.includesKeys.slice(0, 3).map((featureKey, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-[#8B4B5C] rounded-full flex-shrink-0"></div>
                        <span>{t(featureKey)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-2 mb-4 sm:mb-6">
                    <li className="flex items-center space-x-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-[#8B4B5C] rounded-full flex-shrink-0"></div>
                      <span>Special discount available</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-[#8B4B5C] rounded-full flex-shrink-0"></div>
                      <span>Limited time offer</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-[#8B4B5C] rounded-full flex-shrink-0"></div>
                      <span>Book now to secure</span>
                    </li>
                  </ul>
                )}

                {/* Price and Validity */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl font-cormorant font-bold text-[#8B4B5C]">
                    {offer.discount}% OFF
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>Valid until {new Date(offer.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-0 sm:space-x-2 sm:flex">
                  <Link
                    href={`/offers/${offer._id}`}
                    className="block w-full sm:w-auto text-center bg-[#8B4B5C] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-[#7A4251] transition-colors font-medium text-sm sm:text-base min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {t("offers.viewOffer")}
                  </Link>
                  <Link
                    href="/bookings"
                    className="block w-full sm:w-auto text-center border border-[#8B4B5C] text-[#8B4B5C] px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-[#8B4B5C] hover:text-white transition-colors font-medium text-sm sm:text-base min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Offers */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/offers"
            className="inline-block bg-transparent border-2 border-[#8B4B5C] text-[#8B4B5C] hover:bg-[#8B4B5C] hover:text-white transition-colors font-alegreya px-6 sm:px-8 py-3 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center text-sm sm:text-base"
          >
            {t("offers.viewAllOffers")}
          </Link>
        </div>
      </div>
    </section>
  )
}
