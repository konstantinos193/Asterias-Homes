"use client"
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import en from "@/contexts/jsons/en.json"
import el from "@/contexts/jsons/el.json"
import de from "@/contexts/jsons/de.json"

export type LanguageCode = "el" | "en" | "de"

// Helper function to get nested values from an object using a dot-separated string
const getNestedValue = (obj: any, path: string, language?: string): string | undefined => {
  const keys = path.split(".")
  let current = obj
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }
  if (typeof current === "string") return current
  if (typeof current === "object" && current !== null && language && language in current) return current[language]
  return undefined
}

interface Translations {
  [key: string]: any // Can be a string or a nested object
}

interface LanguageContextProps {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: string, defaultValue?: string, replacements?: Record<string, string | number>) => string
}

export const translationsData: Record<LanguageCode, Translations> = {
  en,
  el,
  de,
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

export const LanguageProvider = ({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: LanguageCode;
}) => {
  const [language, setLanguageState] = useState<LanguageCode>(initialLanguage || "el");

  useEffect(() => {
    // If initialLanguage changes (from URL), update state
    if (initialLanguage && initialLanguage !== language) {
      setLanguageState(initialLanguage);
      localStorage.setItem("language", initialLanguage);
    }
  }, [initialLanguage]);

  useEffect(() => {
    // Only load from localStorage if no initialLanguage is provided
    if (!initialLanguage) {
      const savedLanguage = localStorage.getItem("language") as LanguageCode;
      if (savedLanguage && ["el", "en", "de"].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    }
  }, [initialLanguage]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  const t = useCallback(
    (key: string, defaultValue?: string, replacements?: Record<string, string | number>): string => {
      const currentLangTranslations = translationsData[language]
      const fallbackLangTranslations = translationsData["en"] // English as fallback

      let translatedString = getNestedValue(currentLangTranslations, key, language)

      if (translatedString === undefined) {
        translatedString = getNestedValue(fallbackLangTranslations, key, language)
      }

      if (translatedString === undefined) {
        // console.warn(`Translation key "${key}" not found for language "${language}" or fallback "en". Using default or key.`);
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
