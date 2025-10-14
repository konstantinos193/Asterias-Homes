import { useLanguage } from "@/contexts/language-context"

export default async function OffersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const { t } = useLanguage()
  // ...rest of the offers page code, update translation usage as needed
} 