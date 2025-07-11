"use client" // Ensure RoomCard is a client component if using hooks

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context" // Import useLanguage

interface RoomCardProps {
  id: string
  nameKey: string // Changed from name to nameKey
  descriptionKey: string // Changed from description to descriptionKey
  image: string
  price?: string
  featureKeys?: string[] // Changed from features to featureKeys
}

export default function RoomCard({ id, nameKey, descriptionKey, image, price, featureKeys }: RoomCardProps) {
  const { t } = useLanguage() // Get t function

  return (
    <div className="group overflow-hidden">
      <div className="relative overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={t(nameKey)} // Translate alt text
          width={600}
          height={400}
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {price && (
          <div className="absolute top-4 right-4 bg-[#0A4A4A] text-white px-4 py-2 font-cormorant">
            <span className="text-xl font-semibold">{price}</span>
            <span className="text-sm"> {t("rooms.perNight")}</span> {/* Translate per night */}
          </div>
        )}
      </div>

      <div className="p-6 bg-white border border-t-0 border-slate-200">
        <h3 className="text-2xl font-cormorant font-light text-slate-800 mb-3">{t(nameKey)}</h3> {/* Translate name */}
        <p className="text-slate-600 font-alegreya mb-4">{t(descriptionKey)}</p> {/* Translate description */}
        {featureKeys && featureKeys.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-6">
            {featureKeys.map((featureKey, index) => (
              <li key={index} className="text-xs bg-slate-100 px-3 py-1 text-slate-700 font-alegreya">
                {t(featureKey)} {/* Translate feature */}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/rooms/${id}`}
          className="inline-block w-full text-center py-3 border border-[#0A4A4A] text-[#0A4A4A] hover:bg-[#0A4A4A] hover:text-white transition-colors font-alegreya"
        >
          {t("roomCard.bookNow")} {/* Translate button text */}
        </Link>
      </div>
    </div>
  )
}
