import { translationsData } from "@/lib/translations"

export default async function RoomDetailPage({ params }: { params: { lang: string, roomId: string } }) {
  const lang = params.lang || "en"
  const t = translationsData[lang as keyof typeof translationsData] || translationsData.en
  // ...rest of the room detail page code, update translation usage as needed
} 