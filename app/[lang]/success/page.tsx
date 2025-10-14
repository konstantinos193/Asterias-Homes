import { useLanguage } from "@/contexts/language-context"

export default async function SuccessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const { t } = useLanguage()
  // ...rest of the success page code, update translation usage as needed
} 