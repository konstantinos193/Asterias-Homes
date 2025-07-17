import { translationsData } from "@/lib/translations"

export default async function OffersPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en"
  const t = translationsData[lang as keyof typeof translationsData] || translationsData.en
  // ...rest of the offers page code, update translation usage as needed
} 