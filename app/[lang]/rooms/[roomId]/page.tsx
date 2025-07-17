import { useLanguage } from "@/contexts/language-context"

export default async function RoomDetailPage({ params }: { params: { lang: string, roomId: string } }) {
  const lang = params.lang || "en"
  const { t } = useLanguage()
  // ...rest of the room detail page code, update translation usage as needed
} 