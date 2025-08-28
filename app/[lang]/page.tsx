"use client"
import { useEffect, useState } from "react"
import HomePageClient from "../HomePageClient"
import { useLanguage } from "@/contexts/language-context"
import { getRooms } from "@/lib/api"
import { Room } from "@/types/booking"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Luxury Vacation Apartments in Koronisia, Arta",
  description: "Experience luxury vacation apartments in Koronisia, Arta, in the heart of Amvrakikos Gulf. 7 beautifully appointed apartments with modern amenities, surrounded by natural beauty and tranquility.",
  keywords: [
    "vacation apartments Koronisia",
    "luxury accommodation Arta",
    "Greek holiday homes",
    "Amvrakikos Gulf apartments",
    "beachfront accommodation Greece",
    "Koronisia vacation rentals",
    "Arta tourism accommodation",
    "Greek island apartments"
  ],
  openGraph: {
    title: "Luxury Vacation Apartments in Koronisia, Arta",
    description: "Experience luxury vacation apartments in Koronisia, Arta, in the heart of Amvrakikos Gulf. 7 beautifully appointed apartments with modern amenities.",
    images: [
      {
        url: "/hero-1.png",
        width: 1200,
        height: 630,
        alt: "Asterias Homes - Luxury Vacation Apartments in Greece",
      }
    ],
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "el-GR": "/el",
      "de-DE": "/de",
    },
  },
}

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