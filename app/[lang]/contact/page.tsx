import { useLanguage } from "@/contexts/language-context"

export default async function ContactPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en"
  const { t } = useLanguage()
  // ...rest of the contact page code, update translation usage as needed
} 