import OfferDetailPageClient from "./OfferDetailPageClient"

export default async function OfferDetailPage({ params }: { params: Promise<{ lang: string, offerId: string }> }) {
  const { lang, offerId } = await params
  return <OfferDetailPageClient offerId={offerId} />
} 