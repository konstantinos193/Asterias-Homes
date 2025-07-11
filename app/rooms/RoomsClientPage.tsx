"use client"

import { useLanguage } from "@/contexts/language-context"
import RoomCard from "@/components/room-card"
import { allRoomsData } from "@/data/rooms" // Assuming this is your rooms data source
import { Aperture } from "lucide-react" // Example icon

export default function RoomsClientPage() {
  const { t } = useLanguage()

  // Example: Add filtering logic here if needed in the future
  // const [filteredRooms, setFilteredRooms] = useState(allRoomsData);

  return (
    <div className="bg-slate-50">
      {/* Header Section */}
      <header
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{ backgroundImage: "url('/room1.png')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Aperture className="mx-auto h-16 w-16 text-white mb-4" />
          <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-white mb-2">
            {t("roomsPage.title", "Our Accommodations")}
          </h1>
          <p className="text-lg md:text-xl font-alegreya text-slate-200 max-w-2xl mx-auto">
            {t(
              "roomsPage.subtitle",
              "Explore our range of comfortable and traditionally styled rooms, each designed to offer a unique and relaxing stay in the heart of Koronisia.",
            )}
          </p>
        </div>
      </header>

      {/* Rooms Grid Section */}
      <main className="py-12 md:py-16 mt-12">
        <div className="container mx-auto px-6">
          {/* Optional: Filters section can be added here */}
          {/* <div className="mb-8 p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-cormorant text-slate-700 mb-4">{t("roomsPage.filter.title", "Filter Rooms")}</h2>
            <p className="text-slate-600 font-alegreya">{t("roomsPage.filter.comingSoon", "Filtering options coming soon.")}</p>
          </div> */}

          {allRoomsData && allRoomsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allRoomsData.map((room) => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  nameKey={room.nameKey}
                  descriptionKey={room.descriptionKey}
                  image={room.image}
                  price={room.price} // Assuming price is not translated or handled differently
                  featureKeys={room.featureKeys}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-slate-600 font-alegreya">
                {t("roomsPage.noRooms", "No rooms available at the moment. Please check back later.")}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
