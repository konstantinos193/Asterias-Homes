import { useLanguage } from "@/contexts/language-context"

export default async function RoomDetailPage({ params }: { params: Promise<{ lang: string, roomId: string }> }) {
  const { lang, roomId } = await params
  const { t } = useLanguage()
  // ...rest of the room detail page code, update translation usage as needed
} 