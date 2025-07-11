"use client"

import { Anchor, Fish, Sunset, Camera } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function HighlightsSection() {
  const { t, language } = useLanguage()

  const highlights = [
    {
      title: "Μαγευτικά Ηλιοβασιλέματα",
      englishTitle: "Magical Sunsets",
      germanTitle: "Magische Sonnenuntergänge",
      description: "Απολαύστε μοναδικά ηλιοβασιλέματα πάνω από τον Αμβρακικό Κόλπο από το μπαλκόνι του δωματίου σας.",
      englishDescription: "Enjoy unique sunsets over the Amvrakikos Gulf from your room's balcony.",
      germanDescription:
        "Genießen Sie einzigartige Sonnenuntergänge über dem Amvrakischen Golf vom Balkon Ihres Zimmers.",
      icon: Sunset,
    },
    {
      title: "Φρέσκα Θαλασσινά",
      englishTitle: "Fresh Seafood",
      germanTitle: "Frische Meeresfrüchte",
      description: "Γευτείτε φρέσκα ψάρια και θαλασσινά από τοπικούς ψαράδες στις παραδοσιακές ταβέρνες της περιοχής.",
      englishDescription: "Taste fresh fish and seafood from local fishermen at the traditional taverns in the area.",
      germanDescription:
        "Probieren Sie frischen Fisch und Meeresfrüchte von lokalen Fischern in den traditionellen Tavernen der Gegend.",
      icon: Fish,
    },
    {
      title: "Παραδοσιακό Λιμάνι",
      englishTitle: "Traditional Harbor",
      germanTitle: "Traditioneller Hafen",
      description: "Περπατήστε στο γραφικό λιμάνι της Κορωνησίας και ζήστε την αυθεντική ατμόσφαιρα ενός ψαροχωριού.",
      englishDescription:
        "Walk around the picturesque harbor of Koronisia and experience the authentic atmosphere of a fishing village.",
      germanDescription:
        "Spazieren Sie durch den malerischen Hafen von Koronisia und erleben Sie die authentische Atmosphäre eines Fischerdorfes.",
      icon: Anchor,
    },
    {
      title: "Φωτογραφικές Τοποθεσίες",
      englishTitle: "Photographic Locations",
      germanTitle: "Fotografische Orte",
      description: "Ανακαλύψτε μοναδικά τοπία και σημεία ιδανικά για φωτογράφιση στον υγρότοπο του Αμβρακικού.",
      englishDescription: "Discover unique landscapes and ideal spots for photography in the Amvrakikos wetland.",
      germanDescription:
        "Entdecken Sie einzigartige Landschaften und ideale Orte zum Fotografieren im Feuchtgebiet von Amvrakikos.",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="bg-white p-8 rounded-sm relative shadow-sm border-t-2 border-[#0A4A4A]">
              <div className="inline-flex items-center justify-center p-3 bg-[#A9AEA2]/20 rounded-sm mb-6">
                <highlight.icon className="h-6 w-6 text-[#0A4A4A]" />
              </div>
              <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-3">
                {language === "el"
                  ? highlight.title
                  : language === "en"
                    ? highlight.englishTitle
                    : highlight.germanTitle}
              </h3>
              <p className="font-alegreya text-slate-700">
                {language === "el"
                  ? highlight.description
                  : language === "en"
                    ? highlight.englishDescription
                    : highlight.germanDescription}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
