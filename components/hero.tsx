"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t, language } = useLanguage()

  const heroImage = "https://i.imgur.com/mQuYaP7.jpeg"

  const slides = [
    {
      title: t("hero.slide1.title"),
      subtitle: t("hero.slide1.subtitle"),
    },
    {
      title: t("hero.slide2.title"),
      subtitle: t("hero.slide2.subtitle"),
    },
    {
      title: t("hero.slide3.title"),
      subtitle: t("hero.slide3.subtitle"),
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Single static image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Asterias Homes"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/60" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1
            className={`font-cormorant font-light mb-4 tracking-wide ${
              language === "de" ? "text-3xl sm:text-4xl md:text-5xl" : "text-4xl sm:text-5xl md:text-6xl"
            }`}
          >
            {slides[currentSlide].title}
          </h1>

          <div className="w-24 h-0.5 bg-[#8B4B5C] mx-auto mb-6"></div>

          <p
            className={`font-cormorant italic mb-12 tracking-wide ${
              language === "de" ? "text-lg sm:text-xl md:text-2xl" : "text-xl sm:text-2xl md:text-3xl"
            }`}
          >
            {slides[currentSlide].subtitle}
          </p>

          <Link
            href="/bookings"
            className="inline-block px-8 py-3 border-2 border-[#8B4B5C] text-white bg-rose-200/30 hover:bg-[#8B4B5C] hover:text-white transition-colors font-alegreya tracking-wide text-lg"
          >
            {t("hero.book")}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentSlide ? "bg-[#8B4B5C]" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
