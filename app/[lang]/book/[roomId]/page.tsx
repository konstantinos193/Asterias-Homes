import { useLanguage } from "@/contexts/language-context"

export default async function BookRoomPage({ params }: { params: { lang: string, roomId: string } }) {
  const lang = params.lang || "en"
  const { t } = useLanguage()
  // ...rest of the book room page code, update translation usage as needed
} 