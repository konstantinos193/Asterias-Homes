import { translationsData } from "@/lib/translations"

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en"
  const t = translationsData[lang as keyof typeof translationsData] || translationsData.en
  // ...rest of the about page code, update translation usage as needed
} 