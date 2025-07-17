import { useLanguage } from "@/contexts/language-context"

export default async function OfferDetailPage({ params }: { params: { lang: string, offerId: string } }) {
  const lang = params.lang || "en"
  const { t } = useLanguage()
  // ...rest of the offer detail page code, update translation usage as needed
} 