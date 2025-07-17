import { translationsData } from "@/lib/translations"

export default async function OfferDetailPage({ params }: { params: { lang: string, offerId: string } }) {
  const lang = params.lang || "en"
  const t = translationsData[lang as keyof typeof translationsData] || translationsData.en
  // ...rest of the offer detail page code, update translation usage as needed
} 