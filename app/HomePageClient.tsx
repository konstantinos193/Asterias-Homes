"use client"

import Hero from "@/components/hero"
import WelcomeSection from "@/components/welcome-section"
import FeaturesSection from "@/components/features-section"
import HighlightsSection from "@/components/testimonial-section"
import SpecialOffersSection from "@/components/special-offers-section"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import RoomCard from "@/components/room-card"
import { Room } from "@/types/booking"

interface HomePageClientProps {
  featuredRooms: Room[]
}

export default function HomePageClient({ featuredRooms }: HomePageClientProps) {
  const { t } = useLanguage()

  const apartmentsToDisplay = featuredRooms.map((roomType, index) => ({
    ...roomType,
    displayId: `${roomType.id}-featured-${index}`,
    image: roomType.images[index % roomType.images.length],
  }))

  const translations = {
    subtitle: t("rooms.section.subtitle"),
    title: t("rooms.section.title"),
    description: t("rooms.section.description"),
    viewAll: t("rooms.viewAll"),
    discoverTitle: t("discover.title"),
    discoverDescription: t("discover.description"),
    discoverButton: t("discover.button"),
    discoverImageAlt: t("discover.imageAlt"),
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#f8f6f1] via-[#e8e2d5] to-[#dbe6e4]" aria-hidden="true" />
      <Hero />
      <WelcomeSection />

      <div className="-mt-8 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
          <path d="M0 40 Q 360 80 720 40 T 1440 40 V80 H0V40Z" fill="#f8f6f1" />
        </svg>
      </div>

      <section className="py-20 bg-slate-50 overflow-hidden mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#0A4A4A] font-alegreya uppercase tracking-wider text-sm mb-3">
              {translations.subtitle}
            </h2>
            <h3 className="text-3xl font-cormorant font-light text-slate-800 mb-4">
              {translations.title}
            </h3>
            <div className="w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-6" />
            <p className="text-slate-600 font-alegreya">
              {translations.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartmentsToDisplay.map((apartment) => (
              <RoomCard
                key={apartment.displayId}
                id={apartment.id}
                name={apartment.name}
                description={apartment.description}
                image={apartment.image}
                price={`${apartment.price}€`}
                features={apartment.features}
                nameKey={apartment.nameKey}
                descriptionKey={apartment.descriptionKey}
                featureKeys={apartment.featureKeys}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/rooms"
              className="inline-block px-8 py-3 bg-transparent border-2 border-[#0A4A4A] text-[#0A4A4A] hover:bg-[#0A4A4A] hover:text-white transition-colors font-alegreya"
            >
              {translations.viewAll}
            </Link>
          </div>
        </div>
      </section>

      <div className="-mb-8 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 rotate-180">
          <path d="M0 40 Q 360 80 720 40 T 1440 40 V80 H0V40Z" fill="#f8f6f1" />
        </svg>
      </div>

      <SpecialOffersSection />
      <FeaturesSection />

      <div className="-mt-8 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
          <path d="M0 40 Q 360 80 720 40 T 1440 40 V80 H0V40Z" fill="#e8e2d5" />
        </svg>
      </div>

      <section className="py-20 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.imgur.com/GEeXP4k.jpeg"
            alt={translations.discoverImageAlt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-cormorant font-light mb-6">{translations.discoverTitle}</h2>
            <div className="w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-8"></div>
            <p className="text-lg font-alegreya mb-10 text-slate-200">{translations.discoverDescription}</p>
            <Link
              href="/about"
              className="inline-block px-8 py-3 bg-[#0A4A4A] text-white font-alegreya hover:bg-[#083a3a] transition-colors"
            >
              {translations.discoverButton}
            </Link>
          </div>
        </div>
      </section>

      <HighlightsSection />
    </>
  )
} 