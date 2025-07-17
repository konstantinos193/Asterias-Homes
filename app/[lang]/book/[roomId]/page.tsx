import { translationsData } from "@/lib/translations"

export default async function BookRoomPage({ params }: { params: { lang: string, roomId: string } }) {
  const lang = params.lang || "en"
  const t = translationsData[lang as keyof typeof translationsData] || translationsData.en
  // ...rest of the book room page code, update translation usage as needed
} 