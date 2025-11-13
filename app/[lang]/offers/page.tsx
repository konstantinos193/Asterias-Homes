import OffersPageClient from "./OffersPageClient"

export default async function OffersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <OffersPageClient />
} 