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

export default function Home() {
  const { t } = useLanguage()

  const featuredRooms = [
    {
      id: "standard",
      nameKey: "rooms.standard.name",
      descriptionKey: "rooms.standard.description",
      image: "/room-1.png",
      price: "60€",
      featureKeys: ["rooms.feature.doubleBed", "rooms.feature.ac", "rooms.feature.wifi", "rooms.feature.tv"],
    },
    {
      id: "family",
      nameKey: "rooms.family.name",
      descriptionKey: "rooms.family.description",
      image: "/room-2.png",
      price: "80€",
      featureKeys: ["rooms.feature.upTo4", "rooms.feature.balcony", "rooms.feature.ac", "rooms.feature.fridge"],
    },
    {
      id: "romantic",
      nameKey: "rooms.romantic.name",
      descriptionKey: "rooms.romantic.description",
      image: "/room-3.png",
      price: "100€",
      featureKeys: [
        "rooms.feature.seaView",
        "rooms.feature.whirlpool",
        "rooms.feature.kingBed",
        "rooms.feature.breakfast",
      ],
    },
  ]

  return (
    <>
      <Hero />
      <WelcomeSection />

      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#0A4A4A] font-alegreya uppercase tracking-wider text-sm mb-3">
              {t("rooms.section.subtitle")}
            </h2>
            <h3 className="text-3xl font-cormorant font-light text-slate-800 mb-4">{t("rooms.section.title")}</h3>
            <div className="w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-6" />
            <p className="text-slate-600 font-alegreya">{t("rooms.section.description")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <RoomCard
                key={room.id}
                id={room.id}
                nameKey={room.nameKey}
                descriptionKey={room.descriptionKey}
                image={room.image}
                price={room.price} // Pass the hardcoded price string
                featureKeys={room.featureKeys}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/rooms"
              className="inline-block px-8 py-3 bg-transparent border-2 border-[#0A4A4A] text-[#0A4A4A] hover:bg-[#0A4A4A] hover:text-white transition-colors font-alegreya"
            >
              {t("rooms.viewAll")}
            </Link>
          </div>
        </div>
      </section>

      <SpecialOffersSection />
      <FeaturesSection />

      <section className="py-20 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/4O5A8818.png"
            alt={t("discover.imageAlt", "Koronisia sunset view")} // Added fallback for alt
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-cormorant font-light mb-6">{t("discover.title")}</h2>
            <div className="w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-8"></div>
            <p className="text-lg font-alegreya mb-10 text-slate-200">{t("discover.description")}</p>
            <Link
              href="/about"
              className="inline-block px-8 py-3 bg-[#0A4A4A] text-white font-alegreya hover:bg-[#083a3a] transition-colors"
            >
              {t("discover.button")}
            </Link>
          </div>
        </div>
      </section>

      <HighlightsSection />
    </>
  )
}
