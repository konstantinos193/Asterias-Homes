export type LanguageCode = "el" | "en" | "de"

export interface Translations {
  [key: string]: any // Can be a string or a nested object
}
// All translation data and logic has been removed from this file. Use language-context.tsx for translations. 