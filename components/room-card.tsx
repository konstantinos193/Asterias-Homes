"use client" // Ensure RoomCard is a client component if using hooks

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context" // Import useLanguage

interface RoomCardProps {
  id: string
  image: string
  name?: string
  description?: string
  price?: string
  features?: string[]
  nameKey?: string
  descriptionKey?: string
  featureKeys?: string[]
}

export default function RoomCard({
  id,
  image,
  name,
  description,
  price,
  features,
  nameKey,
  descriptionKey,
  featureKeys,
}: RoomCardProps) {
  const { t } = useLanguage() // Get t function

  const displayName = (nameKey ? t(nameKey) : name) || "";
  const displayDescription = descriptionKey ? t(descriptionKey) : description;
  const displayFeatures = featureKeys ? featureKeys.map(key => t(key)) : (Array.isArray(features) ? features : []);

  return (
    <div className="group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={displayName || "Room image"}
          width={600}
          height={400}
          className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {price && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#0A4A4A] text-white px-3 sm:px-4 py-2 font-cormorant rounded-sm">
            <span className="text-lg sm:text-xl font-semibold">{price}</span>
            <span className="text-xs sm:text-sm"> {t("rooms.perNight")}</span> {/* Translate per night */}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 bg-white border border-t-0 border-slate-200">
        <h3 className="text-xl sm:text-2xl font-cormorant font-light text-slate-800 mb-2 sm:mb-3">{displayName}</h3>
        <p className="text-sm sm:text-base text-slate-600 font-alegreya mb-3 sm:mb-4 line-clamp-2">{displayDescription}</p>
        {displayFeatures && displayFeatures.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {displayFeatures.slice(0, 6).map((feature, index) => (
              <li key={index} className="text-xs bg-slate-100 px-2 sm:px-3 py-1 text-slate-700 font-alegreya rounded-sm">
                {feature}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/rooms/${id}`}
          className="inline-block w-full text-center py-2.5 sm:py-3 border border-[#0A4A4A] text-[#0A4A4A] hover:bg-[#0A4A4A] hover:text-white transition-colors font-alegreya rounded-sm min-h-[44px] min-w-[44px] flex items-center justify-center text-sm sm:text-base"
        >
          {t("roomCard.bookNow")} {/* Translate button text */}
        </Link>
      </div>
    </div>
  )
}
