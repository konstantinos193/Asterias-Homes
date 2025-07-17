"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Calendar, Tag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { offersAPI } from "@/lib/api"

interface Offer {
  _id: string
  titleKey: string
  descriptionKey: string
  image: string
  discount?: number
  price?: number
  validUntil: string
  badgeKey?: string
  roomTypeKey?: string
  includesKeys?: string[]
  featured?: boolean
}

export default function SpecialOffersSection() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await offersAPI.getAll()
        const allOffers: Offer[] = response.offers || []
        const featured = allOffers.filter((offer) => offer.featured)
        setOffers(featured)
      } catch (error) {
        console.error("Failed to fetch special offers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  const nextSlide = () => {
    setActiveIndex((current) => (current === offers.length - 1 ? 0 : current + 1))
  }

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? offers.length - 1 : current - 1))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(t("locale"), { day: "2-digit", month: "2-digit", year: "numeric" }).format(date)
  }

  const getDaysRemaining = (dateString: string) => {
    const today = new Date()
    const expiryDate = new Date(dateString)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 text-center">
        <p>{t("common.loading")}</p>
      </section>
    )
  }

  if (offers.length === 0) {
    return null // Don't render anything if there are no featured offers
  }

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

        <div className="relative mb-16 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {offers.map((offer) => (
              <div key={offer._id} className="w-full flex-shrink-0">
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
                        <h4 className="text-2xl font-cormorant font-light text-slate-800 mb-3">
                          {t(offer.titleKey)}
                        </h4>
                        <p className="text-slate-600 font-alegreya mb-4">{t(offer.descriptionKey)}</p>

                        {offer.includesKeys && offer.includesKeys.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-slate-700 mb-2 font-alegreya">
                              {t("offers.includes")}
                            </h5>
                            <ul className="space-y-1">
                              {offer.includesKeys.map((key, i) => (
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
                              {getDaysRemaining(offer.validUntil)} {t("offers.days")} {t("offers.daysRemaining")}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-1 text-[#0A4A4A]" />
                              <span className="text-sm text-slate-500 font-alegreya">{t("offers.from")}</span>
                            </div>
                            {offer.price && (
                              <div className="flex items-baseline">
                                <span className="text-2xl font-cormorant font-semibold text-[#0A4A4A]">
                                  {offer.price}€
                                </span>
                                <span className="text-slate-500 text-sm font-alegreya ml-1">
                                  {t("offers.perNight")}
                                </span>
                              </div>
                            )}
                          </div>

                          <Link href={`/offers/${offer._id}`}>
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

          <div className="flex justify-center mt-4">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "w-2 h-2 mx-1 rounded-full transition-all",
                  index === activeIndex ? "bg-[#0A4A4A] w-4" : "bg-slate-300"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
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
