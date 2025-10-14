import { useLanguage } from "@/contexts/language-context"

export default async function OfferDetailPage({ params }: { params: Promise<{ lang: string, offerId: string }> }) {
  const { lang, offerId } = await params
  const { t } = useLanguage()
  // ...rest of the offer detail page code, update translation usage as needed
} 