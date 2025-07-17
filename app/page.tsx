'use client'

import { getRooms } from "@/lib/api"
import { Room } from "@/types/booking"
import HomePageClient from "./HomePageClient"
import { useLanguage } from "@/contexts/language-context"
import { useEffect, useState } from "react"

export default function Home() {
  const { t } = useLanguage()
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([])

  useEffect(() => {
    getRooms().then((data) => {
      const roomType: Room | undefined = (data.rooms || [])[0]
      if (roomType) {
        const numberOfFeatured = 3
        const featured = Array.from({ length: numberOfFeatured }, (_, index) => ({
          ...roomType,
          displayId: `${roomType.id}-featured-${index}`,
          image: roomType.images[index % roomType.images.length],
        }))
        setFeaturedRooms(featured)
      }
    })
  }, [])

  return <HomePageClient featuredRooms={featuredRooms} />
}
