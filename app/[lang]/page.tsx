"use client"
import { useEffect, useState } from "react"
import HomePageClient from "../HomePageClient"
import { useLanguage } from "@/contexts/language-context"
import { getRooms } from "@/lib/api"
import { Room } from "@/types/booking"

export default function Home() {
  const { language } = useLanguage()
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    getRooms().then((rooms) => {
      const roomType: Room | undefined = (rooms || [])[0]
      if (roomType) {
        const numberOfFeatured = 3
        featuredRooms = Array.from({ length: numberOfFeatured }, (_, index) => ({
          ...roomType,
          displayId: `${roomType.id}-featured-${index}`,
          image: roomType.images[index % roomType.images.length],
          featureKeys: [
            "rooms.feature.entirePlace",
            "rooms.feature.freeParking",
            "rooms.feature.breakfastIncluded",
            "rooms.feature.balcony",
            "rooms.feature.privateBathroom",
            "rooms.feature.freeWifi",
            "rooms.feature.shower",
            "rooms.feature.airConditioning",
            "rooms.feature.flatScreenTV",
            "rooms.feature.kitchenette",
            "rooms.feature.nonSmoking",
            "rooms.feature.familyFriendly"
          ]
        }))
      }
    })
  }, [])

  let featuredRooms: Room[] = []

  // HomePageClient will use the context for translations
  return <HomePageClient featuredRooms={featuredRooms} />
} 