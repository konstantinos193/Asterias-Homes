import { getRooms } from "@/lib/api"
import { Room } from "@/types/booking"
import HomePageClient from "./HomePageClient"
import { translationsData } from "@/lib/translations"

// Helper to get translations from the translationsData object
async function getTranslations(lang: string) {
  return translationsData[lang as keyof typeof translationsData] || translationsData.en
}

export default async function Home({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en"
  const t = await getTranslations(lang)

  console.log("Loaded translations for lang:", lang, t);

  const data = await getRooms()
  const roomType: Room | undefined = (data.rooms || [])[0]
  let featuredRooms: Room[] = []

  if (roomType) {
    const numberOfFeatured = 3
    featuredRooms = Array.from({ length: numberOfFeatured }, (_, index) => ({
      ...roomType,
      displayId: `${roomType.id}-featured-${index}`,
      image: roomType.images[index % roomType.images.length],
    }))
  }

  const translations = {
    subtitle: t.rooms?.section?.subtitle ?? "",
    title: t.rooms?.section?.title ?? "",
    description: t.rooms?.section?.description ?? "",
    viewAll: t.rooms?.viewAll ?? "",
    discoverTitle: t.discover?.title ?? "",
    discoverDescription: t.discover?.description ?? "",
    discoverButton: t.discover?.button ?? "",
    discoverImageAlt: t.discover?.imageAlt ?? "",
  }

  return <HomePageClient featuredRooms={featuredRooms} translations={translations} />
}
