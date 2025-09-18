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

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          <h1
            className={`font-cormorant font-light mb-3 sm:mb-4 tracking-wide ${
              language === "de" 
                ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl" 
                : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            }`}
          >
            {slides[currentSlide].title}
          </h1>

          <div className="w-16 sm:w-20 md:w-24 h-0.5 bg-[#8B4B5C] mx-auto mb-4 sm:mb-6"></div>

          <p
            className={`font-cormorant italic mb-8 sm:mb-10 md:mb-12 tracking-wide ${
              language === "de" 
                ? "text-base sm:text-lg md:text-xl lg:text-2xl" 
                : "text-lg sm:text-xl md:text-2xl lg:text-3xl"
            }`}
          >
            {slides[currentSlide].subtitle}
          </p>

          <Link
            href={`/${language}/bookings`}
            className="inline-flex items-center justify-center rounded-md border-2 border-[#8B4B5C] bg-rose-200/30 text-white hover:bg-[#8B4B5C] hover:text-white transition-colors font-alegreya text-base md:text-lg whitespace-nowrap px-5 py-3 md:px-6 md:py-3 min-h-[44px] max-w-fit"
          >
            {t("hero.book")}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              index === currentSlide ? "bg-[#8B4B5C]" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
