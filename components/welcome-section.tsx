"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function WelcomeSection() {
  const { t } = useLanguage()

  return (
    <section className="section-mobile bg-white overflow-hidden">
      <div className="container mx-auto container-mobile">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10">
              <Image
                src="https://i.imgur.com/KNyJnbp.jpeg"
                alt="Asterias Homes welcome view"
                width={500}
                height={600}
                className="w-full h-auto object-cover rounded-sm shadow-xl"
              />
            </div>
            {/* Decorative elements - hidden on mobile */}
            <div className="absolute -bottom-8 -right-8 z-0 hidden lg:block">
              <Image
                src="https://i.imgur.com/KNyJnbp.jpeg"
                alt="Hotel exterior"
                width={300}
                height={400}
                className="w-72 h-auto object-cover border-8 border-white shadow-xl rounded-sm"
              />
            </div>
            <div className="absolute -top-8 -left-8 z-0 hidden lg:block">
              <div className="w-48 h-48 border-2 border-[#8B4B5C] rounded-sm"></div>
            </div>
          </div>

          {/* Glassmorphism card */}
          <div className="order-1 lg:order-2 lg:pl-8">
            <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 lg:p-12 border border-white/60">
              <h2 className="text-[#8B4B5C] font-alegreya uppercase tracking-wider text-xs sm:text-sm mb-2 sm:mb-3">
                {t("welcome.subtitle")}
              </h2>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-cormorant font-light text-slate-800 mb-4 sm:mb-6">
                {t("welcome.title")} <span className="italic text-[#8B4B5C]">Asterias</span>
              </h3>

              <div className="w-12 sm:w-16 h-0.5 bg-[#8B4B5C] mb-6 sm:mb-8"></div>

              <p className="text-slate-600 font-alegreya text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">{t("welcome.paragraph1")}</p>

              <p className="text-slate-600 font-alegreya text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">{t("welcome.paragraph2")}</p>

              <Link
                href="/about"
                className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-[#8B4B5C] text-white font-alegreya hover:bg-[#7A4251] transition-colors rounded-sm min-h-[44px] min-w-[44px] flex items-center justify-center text-sm sm:text-base"
              >
                {t("welcome.button")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
