"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Calendar, Tag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

// Types for our offers
interface Offer {
  id: string
  titleKey: string // Changed from title
  descriptionKey: string // Changed from description
  image: string
  discount?: number
  originalPrice?: number
  price: number
  validUntil: string
  category: "seasonal" | "package" | "early-booking" | "last-minute"
  badgeKey?: string // Changed from badge
  featured?: boolean
  roomTypeKey?: string // Changed from roomType
  includesKeys?: string[] // Changed from includes
}

// Sample offers data
const offers: Offer[] = [
  {
    id: "summer-escape",
    titleKey: "offers.summerEscape.title",
    descriptionKey: "offers.summerEscape.description",
    image: "/offers/summer-escape.png",
    discount: 20,
    originalPrice: 100,
    price: 80,
    validUntil: "2024-09-30",
    category: "seasonal",
    badgeKey: "offers.summerEscape.badge",
    featured: true,
    roomTypeKey: "offers.summerEscape.roomType",
    includesKeys: [
      "offers.summerEscape.includes.freeBreakfast",
      "offers.summerEscape.includes.welcomeWine",
      "offers.summerEscape.includes.lateCheckout",
    ],
  },
  {
    id: "romantic-weekend",
    titleKey: "offers.romanticWeekend.title",
    descriptionKey: "offers.romanticWeekend.description",
    image: "/offers/romantic-weekend.png",
    price: 150,
    validUntil: "2024-12-31",
    category: "package",
    badgeKey: "offers.romanticWeekend.badge",
    roomTypeKey: "offers.romanticWeekend.roomType",
    includesKeys: [
      "offers.romanticWeekend.includes.champagne",
      "offers.romanticWeekend.includes.romanticDinner",
      "offers.romanticWeekend.includes.lateCheckout",
      "offers.romanticWeekend.includes.breakfastInRoom",
    ],
  },
  {
    id: "family-fun",
    titleKey: "offers.familyFun.title",
    descriptionKey: "offers.familyFun.description",
    image: "/offers/family-fun.png",
    discount: 15,
    originalPrice: 120,
    price: 102,
    validUntil: "2024-10-31",
    category: "package",
    roomTypeKey: "offers.familyFun.roomType",
    includesKeys: [
      "offers.familyFun.includes.freeKidsStay",
      "offers.familyFun.includes.kidsActivities",
      "offers.familyFun.includes.familyBreakfast",
    ],
  },
  {
    id: "early-bird",
    titleKey: "offers.earlyBird.title",
    descriptionKey: "offers.earlyBird.description",
    image: "/offers/early-bird.png",
    discount: 25,
    price: 75, // Assuming original price was 100 for 25% discount
    validUntil: "2024-12-31",
    category: "early-booking",
    badgeKey: "offers.earlyBird.badge",
    includesKeys: ["offers.earlyBird.includes.discountAllRooms", "offers.earlyBird.includes.freeUpgrade"],
  },
  {
    id: "last-minute",
    titleKey: "offers.lastMinute.title",
    descriptionKey: "offers.lastMinute.description",
    image: "/offers/last-minute.png",
    discount: 30,
    originalPrice: 100,
    price: 70,
    validUntil: "2024-08-31", // Note: This date might be in the past depending on current date
    category: "last-minute",
    badgeKey: "offers.lastMinute.badge",
    featured: true,
    includesKeys: ["offers.lastMinute.includes.discount", "offers.lastMinute.includes.instantConfirmation"],
  },
  {
    id: "autumn-retreat",
    titleKey: "offers.autumnRetreat.title",
    descriptionKey: "offers.autumnRetreat.description",
    image: "/offers/autumn-retreat.png",
    discount: 15,
    originalPrice: 90,
    price: 76.5,
    validUntil: "2024-11-30",
    category: "seasonal",
    badgeKey: "offers.autumnRetreat.badge",
    includesKeys: ["offers.autumnRetreat.includes.freeTour", "offers.autumnRetreat.includes.localWelcomeProducts"],
  },
]

export default function SpecialOffersSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const featuredOffers = offers.filter((offer) => offer.featured)

  const nextSlide = () => {
    setActiveIndex((current) => (current === featuredOffers.length - 1 ? 0 : current + 1))
  }

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? featuredOffers.length - 1 : current - 1))
  }

  // Format date to Greek format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("el-GR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date)
  }

  // Calculate days remaining until offer expires
  const getDaysRemaining = (dateString: string) => {
    const today = new Date()
    const expiryDate = new Date(dateString)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const { t } = useLanguage()

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#0A4A4A] font-alegreya uppercase tracking-wider text-sm mb-3">
            {t("offers.section.subtitle")}
          </h2>
          <h3 className="text-3xl font-cormorant font-light text-slate-800 mb-4">{t("offers.section.title")}</h3>
          <div className="w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-6"></div>
          <p className="text-slate-600 font-alegreya">{t("offers.section.description")}</p>
        </div>

        {/* Featured Offer Slider */}
        <div className="relative mb-16 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {featuredOffers.map((offer, index) => (
              <div key={offer.id} className="w-full flex-shrink-0">
                <div className="bg-white rounded-sm shadow-md overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 relative">
                      <div className="relative h-64 lg:h-full">
                        <Image
                          src={offer.image || "/placeholder.svg"}
                          alt={t(offer.titleKey)}
                          fill
                          className="object-cover"
                        />
                        {offer.badgeKey && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-[#0A4A4A] hover:bg-[#0A4A4A] text-white px-3 py-1 text-sm font-alegreya">
                              {t(offer.badgeKey)}
                            </Badge>
                          </div>
                        )}
                        {offer.discount && (
                          <div className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold">
                            <span className="text-center leading-none">-{offer.discount}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between">
                      <div>
                        <h4 className="text-2xl font-cormorant font-light text-slate-800 mb-3">{t(offer.titleKey)}</h4>
                        <p className="text-slate-600 font-alegreya mb-4">{t(offer.descriptionKey)}</p>

                        {offer.includesKeys && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-slate-700 mb-2 font-alegreya">
                              {t("offers.includes")}
                            </h5>
                            <ul className="space-y-1">
                              {offer.includesKeys?.map((key, i) => (
                                <li key={i} className="flex items-start text-sm">
                                  <span className="text-[#0A4A4A] mr-2">✓</span>
                                  <span className="font-alegreya text-slate-600">{t(key)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-sm text-slate-500 font-alegreya">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {t("offers.validUntil")} {formatDate(offer.validUntil)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-slate-500 font-alegreya">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {t("offers.daysRemaining")} {getDaysRemaining(offer.validUntil)} {t("offers.days")}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-1 text-[#0A4A4A]" />
                              <span className="text-sm text-slate-500 font-alegreya">{t("offers.from")}</span>
                            </div>
                            <div className="flex items-baseline">
                              {offer.originalPrice && (
                                <span className="text-slate-400 line-through mr-2 font-alegreya">
                                  {offer.originalPrice}€
                                </span>
                              )}
                              <span className="text-2xl font-cormorant font-semibold text-[#0A4A4A]">
                                {offer.price}€
                              </span>
                              <span className="text-slate-500 text-sm font-alegreya ml-1">{t("offers.perNight")}</span>
                            </div>
                          </div>

                          <Link href={`/offers/${offer.id}`}>
                            <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
                              {t("offers.viewOffer")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-md transition-all"
            aria-label="Previous offer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-md transition-all"
            aria-label="Next offer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-4">
            {featuredOffers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "w-2 h-2 mx-1 rounded-full transition-all",
                  index === activeIndex ? "bg-[#0A4A4A] w-4" : "bg-slate-300",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Other Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers
            .filter((offer) => !offer.featured)
            .slice(0, 3)
            .map((offer) => (
              <div key={offer.id} className="bg-white rounded-sm shadow-md overflow-hidden group">
                <div className="relative h-48">
                  <Image
                    src={offer.image || "/placeholder.svg"}
                    alt={t(offer.titleKey)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {offer.badgeKey && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#0A4A4A] hover:bg-[#0A4A4A] text-white px-3 py-1 text-sm font-alegreya">
                        {t(offer.badgeKey)}
                      </Badge>
                    </div>
                  )}
                  {offer.discount && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
                      <span className="text-center leading-none">-{offer.discount}%</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-cormorant font-light text-slate-800 mb-2">{t(offer.titleKey)}</h4>
                  <p className="text-slate-600 font-alegreya text-sm mb-4 line-clamp-2">{t(offer.descriptionKey)}</p>

                  <div className="flex items-center justify-between text-sm text-slate-500 font-alegreya mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {t("offers.validUntil")} {formatDate(offer.validUntil)}
                      </span>
                    </div>
                    {offer.roomTypeKey && <div className="text-sm italic">{t(offer.roomTypeKey)}</div>}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      {offer.originalPrice && (
                        <span className="text-slate-400 line-through mr-2 font-alegreya text-sm">
                          {offer.originalPrice}€
                        </span>
                      )}
                      <span className="text-xl font-cormorant font-semibold text-[#0A4A4A]">{offer.price}€</span>
                    </div>

                    <Link href={`/offers/${offer.id}`}>
                      <Button
                        variant="outline"
                        className="text-[#0A4A4A] border-[#0A4A4A] hover:bg-[#0A4A4A] hover:text-white font-alegreya text-sm"
                      >
                        {t("offers.moreDetails")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/offers">
            <Button className="bg-transparent border-2 border-[#0A4A4A] text-[#0A4A4A] hover:bg-[#0A4A4A] hover:text-white transition-colors font-alegreya px-8">
              {t("offers.viewAllOffers")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
