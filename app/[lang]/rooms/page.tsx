import { translationsData } from "@/lib/translations"

export default async function RoomsPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en"
  const t = translationsData[lang as keyof typeof translationsData] || translationsData.en
  // ...rest of the rooms page code, update translation usage as needed
} 