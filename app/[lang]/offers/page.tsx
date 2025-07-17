import { useLanguage } from "@/contexts/language-context"

export default async function OffersPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en"
  const { t } = useLanguage()
  // ...rest of the offers page code, update translation usage as needed
} 