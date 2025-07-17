import { translationsData } from "@/lib/translations"

export default async function BookingsPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en"
  const t = translationsData[lang as keyof typeof translationsData] || translationsData.en
  // ...rest of the bookings page code, update translation usage as needed
} 