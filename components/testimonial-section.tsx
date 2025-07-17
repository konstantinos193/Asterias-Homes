"use client"

import { Anchor, Fish, Sunset, Camera } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function HighlightsSection() {
  const { t } = useLanguage()

  const highlights = [
    {
      titleKey: "highlights.item1.title",
      descriptionKey: "highlights.item1.description",
      icon: Sunset,
    },
    {
      titleKey: "highlights.item2.title",
      descriptionKey: "highlights.item2.description",
      icon: Fish,
    },
    {
      titleKey: "highlights.item3.title",
      descriptionKey: "highlights.item3.description",
      icon: Anchor,
    },
    {
      titleKey: "highlights.item4.title",
      descriptionKey: "highlights.item4.description",
      icon: Camera,
    },
  ]

  return (
    <section className="py-20 bg-[#A9AEA2]/30 text-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-cormorant font-light mb-4">{t("highlights.title")}</h2>
          <div className="w-16 h-0.5 bg-[#0A4A4A] mx-auto"></div>
          <p className="mt-6 text-lg font-alegreya text-slate-700">{t("highlights.description")}</p>
        </div>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="bg-white p-8 rounded-sm relative shadow-sm border-t-2 border-[#0A4A4A] group">
              <div className="inline-flex items-center justify-center p-3 bg-[#A9AEA2]/20 rounded-sm mb-6 group-hover:bg-[#A9AEA2]/30 transition-colors duration-300">
                <highlight.icon className="h-6 w-6 text-[#0A4A4A] group-hover:animate-pulse transition-all duration-300" />
              </div>
              <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-3">
                {t(highlight.titleKey)}
              </h3>
              <p className="font-alegreya text-slate-700">
                {t(highlight.descriptionKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile horizontal scroll version */}
        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-6 w-max">
            {highlights.map((highlight, index) => (
              <div key={index} className="bg-white p-6 rounded-sm relative shadow-sm border-t-2 border-[#0A4A4A] group min-w-[280px]">
                <div className="inline-flex items-center justify-center p-3 bg-[#A9AEA2]/20 rounded-sm mb-4 group-hover:bg-[#A9AEA2]/30 transition-colors duration-300">
                  <highlight.icon className="h-6 w-6 text-[#0A4A4A] group-hover:animate-pulse transition-all duration-300" />
                </div>
                <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-2">
                  {t(highlight.titleKey)}
                </h3>
                <p className="font-alegreya text-slate-700 text-sm">
                  {t(highlight.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
