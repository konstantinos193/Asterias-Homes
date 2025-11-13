import RoomDetailPageClient from "./RoomDetailPageClient"

export default async function RoomDetailPage({ params }: { params: Promise<{ lang: string, roomId: string }> }) {
  const { lang, roomId } = await params
  return <RoomDetailPageClient roomId={roomId} />
} 