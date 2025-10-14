import { useLanguage } from "@/contexts/language-context"

export default async function BookRoomPage({ params }: { params: Promise<{ lang: string, roomId: string }> }) {
  const { lang, roomId } = await params
  const { t } = useLanguage()
  // ...rest of the book room page code, update translation usage as needed
} 