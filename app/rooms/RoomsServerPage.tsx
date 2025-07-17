import { Aperture } from "lucide-react" 
import RoomCard from "@/components/room-card"
import { getRooms } from "@/lib/api"

export default async function RoomsClientPage() {
  const rooms = await getRooms();

  return (
    <div className="bg-slate-50">
      {/* Header Section */}
      <header
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{ backgroundImage: "url('/rooms-header.png')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Aperture className="mx-auto h-16 w-16 text-white mb-4" />
          <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-white mb-2">
            Our Accommodations
          </h1>
          <p className="text-lg md:text-xl font-alegreya text-slate-200 max-w-2xl mx-auto">
            Explore our comfortable and traditionally styled apartments, each designed to offer a unique and relaxing stay in the heart of Koronisia.
          </p>
        </div>
      </header>

      {/* Rooms Grid Section */}
      <main className="py-12 md:py-16 mt-12">
        <div className="container mx-auto px-6">
          {rooms && rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  id={room._id}
                  name={room.name}
                  description={room.description}
                  image={room.image}
                  price={room.price}
                  features={room.features}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-slate-600 font-alegreya">
                No rooms available at the moment. Please check back later.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
