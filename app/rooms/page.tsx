import { getRooms } from "@/lib/api"
import RoomCard from "@/components/room-card"
import { Room } from "@/types/booking"

export default async function RoomsPage() {
  const data = await getRooms()
  const roomType: Room | undefined = (data.rooms || [])[0]

  if (!roomType) {
    return (
      <div className="text-center py-20">
        <p>No apartments available at the moment. Please check back later.</p>
      </div>
    )
  }

  // Create an array of apartments to display, one for each available room
  const apartmentsToDisplay = Array.from({ length: roomType.totalRooms }, (_, index) => ({
    ...roomType,
    // Create a unique ID for the key prop for React's rendering
    displayId: `${roomType.id}-${index}`,
    // Cycle through the available images for variety
    image: roomType.images[index % roomType.images.length],
  }))

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
          {apartmentsToDisplay.map((apartment) => (
            <RoomCard
              key={apartment.displayId}
              id={apartment.id} // The original ID for booking
              name={apartment.name}
              description={apartment.description}
              image={apartment.image}
              price={`${apartment.price}€`}
              features={apartment.features}
              nameKey={apartment.nameKey}
              descriptionKey={apartment.descriptionKey}
              featureKeys={apartment.featureKeys}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
