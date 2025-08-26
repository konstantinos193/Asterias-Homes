import Image from "next/image"
import Link from "next/link"
import { Users, Bed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { allRoomsData } from "@/data/rooms"

interface RoomDetailPageProps {
  params: Promise<{ roomId: string }>
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { roomId } = await params
  const room = allRoomsData.find(r => r.id === roomId)

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-cormorant text-slate-800 mb-4">Room not found</h1>
          <Link href="/rooms" className="text-[#0A4A4A] hover:underline">
            Back to rooms
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="pt-24 pb-8 bg-white">
        <div className="container mx-auto px-4">
          <nav className="text-sm font-alegreya text-slate-600 mb-6">
            <Link href="/" className="hover:text-[#0A4A4A]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/rooms" className="hover:text-[#0A4A4A]">
              Rooms
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800">{room.id}</span>
          </nav>
        </div>
      </div>

      <section className="pb-16 bg-white mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="relative h-96 overflow-hidden rounded-sm">
                  <Image
                    src={room.image}
                    alt={room.id}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Room Info & Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-slate-50 p-6 rounded-sm border border-slate-200">
                  <h1 className="text-3xl font-cormorant font-light text-slate-800 mb-2">{room.id}</h1>

                  <div className="flex items-center gap-4 text-sm text-slate-600 font-alegreya mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Up to {room.capacity} people
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {room.size}
                    </span>
                  </div>

                  <p className="text-slate-700 font-alegreya mb-6">Basic room with standard amenities.</p>

                  <Link href={`/book/${room.id}`}>
                    <Button className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white py-3 font-alegreya">
                      Book Now
                    </Button>
                  </Link>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-4">Room Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-alegreya">
                        <span className="w-2 h-2 bg-[#0A4A4A] rounded-full"></span>
                        Air conditioning
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-alegreya">
                        <span className="w-2 h-2 bg-[#0A4A4A] rounded-full"></span>
                        Free Wi-Fi
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-alegreya">
                        <span className="w-2 h-2 bg-[#0A4A4A] rounded-full"></span>
                        TV
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-alegreya">
                        <span className="w-2 h-2 bg-[#0A4A4A] rounded-full"></span>
                        Private bathroom
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Features */}
          <div className="mt-16">
            <h2 className="text-2xl font-cormorant font-light text-slate-800 mb-8">Room Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-4">Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-700 font-alegreya">
                    <span className="w-2 h-2 bg-[#0A4A4A] rounded-full mt-2 flex-shrink-0"></span>
                    Basic room setup
                  </li>
                  <li className="flex items-start gap-2 text-slate-700 font-alegreya">
                    <span className="w-2 h-2 bg-[#0A4A4A] rounded-full mt-2 flex-shrink-0"></span>
                    Standard amenities
                  </li>
                  <li className="flex items-start gap-2 text-slate-700 font-alegreya">
                    <span className="w-2 h-2 bg-[#0A4A4A] rounded-full mt-2 flex-shrink-0"></span>
                    Comfortable stay
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-4">Policies</h3>
                <ul className="space-y-2 text-slate-700 font-alegreya">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-[#0A4A4A] rounded-full mt-2 flex-shrink-0"></span>
                    Check-in: 15:00 - 22:00
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-[#0A4A4A] rounded-full mt-2 flex-shrink-0"></span>
                    Check-out: 08:00 - 11:00
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-[#0A4A4A] rounded-full mt-2 flex-shrink-0"></span>
                    No pets allowed
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-[#0A4A4A] rounded-full mt-2 flex-shrink-0"></span>
                    Non-smoking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export async function generateStaticParams() {
  return allRoomsData.map(room => ({ roomId: room.id }))
}

export async function generateMetadata({ params }: RoomDetailPageProps) {
  const { roomId } = await params
  const room = allRoomsData.find(r => r.id === roomId)

  if (!room) {
    return {
      title: "Room not found | Asterias Homes",
    }
  }

  return {
    title: `${room.id} | Asterias Homes Koronisia`,
    description: "Basic room with standard amenities.",
  }
}
