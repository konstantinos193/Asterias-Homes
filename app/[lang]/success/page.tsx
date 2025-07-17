import { useLanguage } from "@/contexts/language-context"

export default async function SuccessPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en"
  const { t } = useLanguage()
  // ...rest of the success page code, update translation usage as needed
} 