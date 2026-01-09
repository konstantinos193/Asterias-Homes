"use client"

import { useLanguage } from "@/contexts/language-context"
import { translationsData } from "@/contexts/language-context"

export default function PrivacyPage() {
  const { t, language } = useLanguage()
  
  // Fixed date: January 9, 2026
  const currentDate = language === 'el' 
    ? '9 Ιανουαρίου 2026'
    : language === 'de'
    ? '9. Januar 2026'
    : 'January 9, 2026'

  // Helper to get nested translation value
  const getTranslationValue = (key: string): any => {
    const keys = key.split(".")
    let current: any = translationsData[language]
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k]
      } else {
        // Fallback to English
        current = translationsData["en"]
        for (const k2 of keys) {
          if (current && typeof current === "object" && k2 in current) {
            current = current[k2]
          } else {
            return undefined
          }
        }
        break
      }
    }
    return current
  }

  const sections: Array<{
    key: string
    content?: string
    items?: string[]
  }> = [
    {
      key: "introduction",
      content: t("privacy.introduction.content")
    },
    {
      key: "dataCollection",
      items: getTranslationValue("privacy.dataCollection.items") || []
    },
    {
      key: "dataUsage",
      items: getTranslationValue("privacy.dataUsage.items") || []
    },
    {
      key: "dataSharing",
      items: getTranslationValue("privacy.dataSharing.items") || []
    },
    {
      key: "dataSecurity"
    },
    {
      key: "yourRights",
      items: getTranslationValue("privacy.yourRights.items") || []
    },
    {
      key: "cookies"
    },
    {
      key: "retention"
    },
    {
      key: "children"
    },
    {
      key: "changes"
    }
  ]

  return (
    <main className="bg-[#A9AEA2]/30 text-slate-800 pt-20 sm:pt-24 font-alegreya min-h-screen">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto container-mobile">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-cormorant font-bold mb-3 sm:mb-4 text-center">
              {t("privacy.title")}
            </h1>
            <div className="w-12 sm:w-16 h-0.5 bg-[#0A4A4A] mb-4 sm:mb-6 mx-auto"></div>
            <p className="text-sm sm:text-base text-slate-600 text-center mb-6">
              {t("privacy.lastUpdated", undefined, { date: currentDate })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 sm:py-12 md:py-14">
        <div className="container mx-auto container-mobile">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
            {sections.map((section, index) => (
              <div key={section.key} className="bg-white/80 backdrop-blur-sm rounded-lg p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-cormorant font-semibold mb-3 sm:mb-4 text-[#0A4A4A]">
                  {t(`privacy.${section.key}.title`)}
                </h2>
                <div className="w-8 sm:w-12 h-0.5 bg-[#0A4A4A] mb-4"></div>
                
                {section.content && (
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                    {section.content}
                  </p>
                )}
                
                {!section.content && section.key !== "dataCollection" && (
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {t(`privacy.${section.key}.content`)}
                  </p>
                )}
                
                {section.key === "dataCollection" && (
                  <>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                      {t("privacy.dataCollection.content")}
                    </p>
                    {section.items && section.items.length > 0 && (
                      <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-sm sm:text-base text-slate-700">
                        {section.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
                
                {section.items && section.key !== "dataCollection" && section.items.length > 0 && (
                  <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-sm sm:text-base text-slate-700">
                    {section.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 sm:py-12 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto container-mobile">
          <div className="max-w-4xl mx-auto bg-slate-50 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-cormorant font-semibold mb-3 sm:mb-4 text-[#0A4A4A]">
              {t("privacy.contact.title")}
            </h2>
            <div className="w-8 sm:w-12 h-0.5 bg-[#0A4A4A] mb-4"></div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
              {t("privacy.contact.content")}
            </p>
            <div className="space-y-2 text-sm sm:text-base text-slate-700">
              <p>{t("privacy.contact.email")}</p>
              <p>{t("privacy.contact.phone")}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

