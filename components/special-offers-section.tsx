"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Calendar, Star, MapPin } from "lucide-react"

export default function SpecialOffersSection() {
  const { t } = useLanguage()

  const offers = [
    {
      id: "summer-escape",
      image: "/offers/summer-escape.png",
      title: "offers.summer.title",
      description: "offers.summer.description",
      price: "offers.summer.price",
      validUntil: "offers.summer.validUntil",
      features: ["offers.summer.feature1", "offers.summer.feature2", "offers.summer.feature3"]
    },
    {
      id: "honeymoon-package",
      image: "/offers/honeymoon-package.png",
      title: "offers.honeymoon.title",
      description: "offers.honeymoon.description",
      price: "offers.honeymoon.price",
      validUntil: "offers.honeymoon.validUntil",
      features: ["offers.honeymoon.feature1", "offers.honeymoon.feature2", "offers.honeymoon.feature3"]
    },
    {
      id: "family-fun",
      image: "/offers/family-fun.png",
      title: "offers.family.title",
      description: "offers.family.description",
      price: "offers.family.price",
      validUntil: "offers.family.validUntil",
      features: ["offers.family.feature1", "offers.family.feature2", "offers.family.feature3"]
    }
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#E8E2D5] to-[#D4C9B8]">
      <div className="container mx-auto container-mobile">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-cormorant font-light text-slate-800 mb-3 sm:mb-4">
            {t("offersSection.title")}
          </h2>
          <div className="w-12 sm:w-16 h-0.5 bg-[#8B4B5C] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-alegreya">
            {t("offersSection.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <Image
                  src={offer.image}
                  alt={t(offer.title)}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-[#8B4B5C] text-white px-2 py-1 rounded-full text-xs font-medium">
                  {t("offersSection.special")}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-cormorant font-semibold text-slate-800 flex-1">
                    {t(offer.title)}
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
                  {t(offer.description)}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-4 sm:mb-6">
                  {offer.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-[#8B4B5C] rounded-full flex-shrink-0"></div>
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>

                {/* Price and Validity */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl font-cormorant font-bold text-[#8B4B5C]">
                    {t(offer.price)}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{t(offer.validUntil)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-0 sm:space-x-2 sm:flex">
                  <Link
                    href={`/offers/${offer.id}`}
                    className="block w-full sm:w-auto text-center bg-[#8B4B5C] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-[#7A4251] transition-colors font-medium text-sm sm:text-base min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {t("offersSection.viewDetails")}
                  </Link>
                  <Link
                    href="/bookings"
                    className="block w-full sm:w-auto text-center border border-[#8B4B5C] text-[#8B4B5C] px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-[#8B4B5C] hover:text-white transition-colors font-medium text-sm sm:text-base min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {t("offersSection.bookNow")}
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
            {t("offersSection.viewAllOffers")}
          </Link>
        </div>
      </div>
    </section>
  )
}
