import { allRoomsData } from "@/data/rooms"
import RoomCard from "@/components/room-card"

export default function RoomsPage() {
  const roomsData = allRoomsData

  if (!roomsData || roomsData.length === 0) {
    return (
      <div className="text-center py-20">
        <p>No apartments available at the moment. Please check back later.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <header className="relative h-64 md:h-80 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <img
          src="/rooms-header.png"
          alt="View of the hotel rooms from the outside"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-cormorant font-bold">Our Apartments</h1>
          <p className="mt-2 text-lg md:text-xl font-alegreya">
            Comfort and elegance in the heart of Koronisia.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roomsData.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              image={room.image}
              price={room.price}
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
