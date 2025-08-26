"use client"
import { useLanguage } from "@/contexts/language-context"
import { getRooms } from "@/lib/api"
import RoomCard from "@/components/room-card"
import { useEffect, useState } from "react"
import { Room } from "@/types/booking"

export default function RoomsPage({ params }: { params: { lang: string } }) {
  const { t } = useLanguage()
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    getRooms().then((rooms) => setRooms(rooms || []))
  }, [])

  if (!rooms.length) {
    return (
      <div className="text-center py-20">
        <p>{t("roomsPage.noRooms")}</p>
      </div>
    )
  }

  // Example: show all rooms (adjust as needed)
  return (
    <div className="bg-gray-50">
      <header
        className="relative h-64 md:h-80 flex items-center justify-center"
        style={{
          backgroundImage: "url('https://i.imgur.com/2PrC7NV.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-10 z-10"></div>
        <img
          src="https://i.imgur.com/2PrC7NV.png"
          alt={t("roomsPage.title")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="relative z-20 text-center text-white p-4 flex flex-col items-center"
          style={{
            marginTop: "6rem", // or even higher, like "8rem"
            paddingTop: "3rem",
            paddingBottom: "2.5rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            maxWidth: "90vw",
          }}
        >
          <h1 className="text-4xl md:text-6xl font-cormorant font-bold">{t("roomsPage.title")}</h1>
          <p className="mt-2 text-lg md:text-xl font-alegreya">
            {t("roomsPage.subtitle")}
          </p>
        </div>
      </header>

      {/* This is the important part: use container here */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, idx) => (
              <RoomCard
                key={room.id + "-" + idx}
                id={room.id}
                name={t(`rooms.${room.nameKey}.name`)}
                description={t(`rooms.${room.nameKey}.description`)}
                image={room.images[0]}
                price={`${room.price}€`}
                features={room.features}
                nameKey={room.nameKey}
                descriptionKey={room.descriptionKey}
                featureKeys={room.featureKeys}
              />
            ))}
          </div>
        </main>
    </div>
  )
} 