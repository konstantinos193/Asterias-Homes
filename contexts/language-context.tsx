"use client"
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { LanguageCode, Translations, translationsData } from "@/lib/translations"

// Helper function to get nested values from an object using a dot-separated string
const getNestedValue = (obj: any, path: string): string | undefined => {
  const keys = path.split(".")
  let current = obj
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }
  return typeof current === "string" ? current : undefined
}

interface LanguageContextProps {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: string, defaultValue?: string, replacements?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  // Extract language from the first segment of the path
  const pathLang = (() => {
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length > 0 && ["el", "en", "de"].includes(parts[0])) {
      return parts[0] as LanguageCode
    }
    return "en" as LanguageCode // fallback
  })()
  const [language, setLanguageState] = useState<LanguageCode>(pathLang)

  // Sync language state with URL
  useEffect(() => {
    setLanguageState(pathLang)
  }, [pathLang])

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang)
    // No localStorage, navigation is handled by header
  }, [])

  const t = useCallback(
    (key: string, defaultValue?: string, replacements?: Record<string, string | number>): string => {
      const currentLangTranslations = translationsData[language]
      const fallbackLangTranslations = translationsData["en"] // English as fallback

      let translatedString = getNestedValue(currentLangTranslations, key)

      if (translatedString === undefined) {
        translatedString = getNestedValue(fallbackLangTranslations, key)
      }

      if (translatedString === undefined) {
        return defaultValue !== undefined ? defaultValue : key
      }

      if (replacements) {
        Object.keys(replacements).forEach((placeholder) => {
          translatedString = (translatedString as string).replace(`{${placeholder}}`, String(replacements[placeholder]))
        })
      }
      return translatedString as string
    },
    [language],
  )

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
