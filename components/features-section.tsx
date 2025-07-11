"use client"

import { Wifi, Coffee, Car, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function FeaturesSection() {
  const { t, language } = useLanguage()

  const features = [
    {
      name: "Δωρεάν Wi-Fi",
      englishName: "Free Wi-Fi",
      germanName: "Kostenloses WLAN",
      description: "Υψηλής ταχύτητας σύνδεση σε όλους τους χώρους",
      englishDescription: "High-speed connection throughout the premises",
      germanDescription: "Hochgeschwindigkeitsverbindung im gesamten Gebäude",
      icon: Wifi,
    },
    {
      name: "Πρωινό",
      englishName: "Breakfast",
      germanName: "Frühstück",
      description: "Παραδοσιακό πρωινό με τοπικά προϊόντα",
      englishDescription: "Traditional breakfast with local products",
      germanDescription: "Traditionelles Frühstück mit regionalen Produkten",
      icon: Coffee,
    },
    {
      name: "Χώρος Στάθμευσης",
      englishName: "Parking",
      germanName: "Parken",
      description: "Δωρεάν χώρος στάθμευσης",
      englishDescription: "Free parking space",
      germanDescription: "Kostenloser Parkplatz",
      icon: Car,
    },
    {
      name: "Καθημερινή Καθαριότητα",
      englishName: "Daily Cleaning",
      germanName: "Tägliche Reinigung",
      description: "Καθαρισμός δωματίων καθημερινά",
      englishDescription: "Daily room cleaning",
      germanDescription: "Tägliche Zimmerreinigung",
      icon: Sparkles,
    },
  ]

  return (
    <section className="py-16 bg-[#E8E2D5]/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-cormorant font-light text-slate-800 mb-4">{t("featuresSection.title")}</h2>
          <div className="w-16 h-0.5 bg-[#8B4B5C] mx-auto mb-6"></div>
          <p className="text-slate-600 font-alegreya">{t("featuresSection.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={language === "el" ? feature.name : language === "en" ? feature.englishName : feature.germanName}
              className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow rounded-sm border-t-2 border-[#8B4B5C]"
            >
              <div className="inline-flex items-center justify-center p-3 bg-[#E8E2D5]/50 rounded-sm mb-6">
                <feature.icon className="h-6 w-6 text-[#8B4B5C]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-3">
                {language === "el" ? feature.name : language === "en" ? feature.englishName : feature.germanName}
              </h3>
              <p className="text-slate-600 font-alegreya">
                {language === "el"
                  ? feature.description
                  : language === "en"
                    ? feature.englishDescription
                    : feature.germanDescription}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
