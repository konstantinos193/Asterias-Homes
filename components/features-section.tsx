"use client"

import { Wifi, Coffee, Car, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      nameKey: "featuresSection.item1.title",
      descriptionKey: "featuresSection.item1.description",
      icon: Wifi,
    },
    {
      nameKey: "featuresSection.item2.title",
      descriptionKey: "featuresSection.item2.description",
      icon: Coffee,
    },
    {
      nameKey: "featuresSection.item3.title",
      descriptionKey: "featuresSection.item3.description",
      icon: Car,
    },
    {
      nameKey: "featuresSection.item4.title",
      descriptionKey: "featuresSection.item4.description",
      icon: Sparkles,
    },
  ]

  return (
    <section className="py-12 sm:py-16 bg-[#E8E2D5]/30">
      <div className="container mx-auto container-mobile">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-cormorant font-light text-slate-800 mb-3 sm:mb-4">{t("featuresSection.title")}</h2>
          <div className="w-12 sm:w-16 h-0.5 bg-[#8B4B5C] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-sm sm:text-base text-slate-600 font-alegreya">{t("featuresSection.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 rounded-sm border-t-2 border-[#8B4B5C] relative overflow-hidden group"
            >
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B4B5C] via-[#A9AEA2] to-[#0A4A4A]"></div>
              
              <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-[#E8E2D5]/50 rounded-sm mb-4 sm:mb-6 group-hover:bg-[#E8E2D5]/70 transition-colors duration-300">
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#8B4B5C] group-hover:scale-110 group-hover:text-[#040000] transition-all duration-300" aria-hidden="true" />
              </div>
              <h3 className="text-lg sm:text-xl font-cormorant font-semibold text-slate-800 mb-2 sm:mb-3">
                {t(feature.nameKey)}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-alegreya">
                {t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
