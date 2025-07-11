import Image from "next/image"
import Link from "next/link"
import { Users, Wifi, Coffee, Sparkles, Bath, Bed, Eye, Snowflake } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock room data - in a real app, this would come from a database
const roomsData = {
  standard: {
    id: "standard",
    name: "Standard Δωμάτιο",
    description:
      "Άνετο δωμάτιο με διπλό κρεβάτι, ιδανικό για ζευγάρια. Διαθέτει κλιματισμό, τηλεόραση και ιδιωτικό μπάνιο με όλες τις σύγχρονες ανέσεις.",
    price: 60,
    maxGuests: 2,
    size: 25,
    images: ["/room-1.png", "/room-2.png", "/room-3.png"],
    amenities: [
      { name: "Διπλό Κρεβάτι", icon: Bed },
      { name: "Κλιματισμός", icon: Snowflake },
      { name: "Δωρεάν Wi-Fi", icon: Wifi },
      { name: "Ιδιωτικό Μπάνιο", icon: Bath },
      { name: "Τηλεόραση", icon: Eye },
      { name: "Καθημερινή Καθαριότητα", icon: Sparkles },
    ],
    features: [
      "Διπλό κρεβάτι με ορθοπεδικό στρώμα",
      "Κλιματισμός με ατομικό έλεγχο",
      "Δωρεάν Wi-Fi υψηλής ταχύτητας",
      "Τηλεόραση LED 32 ιντσών",
      "Ιδιωτικό μπάνιο με ντους",
      "Πετσέτες και σεντόνια υψηλής ποιότητας",
      "Καθημερινή καθαριότητα",
      "Θέα στον κήπο",
    ],
  },
  family: {
    id: "family",
    name: "Οικογενειακό Δωμάτιο",
    description:
      "Ευρύχωρο δωμάτιο με διπλό κρεβάτι και καναπέ-κρεβάτι, ιδανικό για οικογένειες. Διαθέτει κλιματισμό, μπαλκόνι και όλες τις απαραίτητες ανέσεις.",
    price: 80,
    maxGuests: 4,
    size: 35,
    images: ["/room-2.png", "/room-4.png", "/room-5.png"],
    amenities: [
      { name: "Έως 4 Άτομα", icon: Users },
      { name: "Μπαλκόνι", icon: Eye },
      { name: "Κλιματισμός", icon: Snowflake },
      { name: "Ψυγείο", icon: Coffee },
      { name: "Δωρεάν Wi-Fi", icon: Wifi },
      { name: "Καθημερινή Καθαριότητα", icon: Sparkles },
    ],
    features: [
      "Διπλό κρεβάτι και καναπέ-κρεβάτι",
      "Ιδιωτικό μπαλκόνι με θέα",
      "Μίνι ψυγείο",
      "Κλιματισμός με ατομικό έλεγχο",
      "Δωρεάν Wi-Fi υψηλής ταχύτητας",
      "Τηλεόραση LED 40 ιντσών",
      "Ιδιωτικό μπάνιο με ντους",
      "Χώρος καθιστικού",
    ],
  },
  romantic: {
    id: "romantic",
    name: "Ρομαντικό Δωμάτιο",
    description:
      "Δωμάτιο με θέα στη θάλασσα, ιδανικό για ζευγάρια. Διαθέτει διπλό κρεβάτι, τζακούζι και ιδιωτικό μπαλκόνι με μαγευτική θέα στον Αμβρακικό Κόλπο.",
    price: 100,
    maxGuests: 2,
    size: 30,
    images: ["/room-3.png", "/room-6.png", "/room-1.png"],
    amenities: [
      { name: "Θέα Θάλασσα", icon: Eye },
      { name: "Τζακούζι", icon: Bath },
      { name: "King Size Κρεβάτι", icon: Bed },
      { name: "Πρωινό", icon: Coffee },
      { name: "Δωρεάν Wi-Fi", icon: Wifi },
      { name: "Κλιματισμός", icon: Snowflake },
    ],
    features: [
      "King size κρεβάτι με premium στρώμα",
      "Ιδιωτικό τζακούζι",
      "Μπαλκόνι με θέα στη θάλασσα",
      "Δωρεάν πρωινό στο δωμάτιο",
      "Κλιματισμός με ατομικό έλεγχο",
      "Δωρεάν Wi-Fi υψηλής ταχύτητας",
      "Τηλεόραση Smart TV 43 ιντσών",
      "Πολυτελές μπάνιο με premium προϊόντα",
    ],
  },
}

interface RoomDetailPageProps {
  params: Promise<{ roomId: string }>
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { roomId } = await params
  const room = roomsData[roomId as keyof typeof roomsData]

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-cormorant text-slate-800 mb-4">Δωμάτιο δεν βρέθηκε</h1>
          <Link href="/rooms" className="text-[#0A4A4A] hover:underline">
            Επιστροφή στα δωμάτια
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
              Αρχική
            </Link>
            <span className="mx-2">/</span>
            <Link href="/rooms" className="hover:text-[#0A4A4A]">
              Δωμάτια
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800">{room.name}</span>
          </nav>
        </div>
      </div>

      <section className="pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="relative h-96 overflow-hidden rounded-sm">
                  <Image
                    src={room.images[0] || "/placeholder.svg"}
                    alt={room.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {room.images.slice(1).map((image, index) => (
                    <div key={index} className="relative h-48 overflow-hidden rounded-sm">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${room.name} ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Info & Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-slate-50 p-6 rounded-sm border border-slate-200">
                  <h1 className="text-3xl font-cormorant font-light text-slate-800 mb-2">{room.name}</h1>

                  <div className="flex items-center gap-4 text-sm text-slate-600 font-alegreya mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Έως {room.maxGuests} άτομα
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {room.size}m²
                    </span>
                  </div>

                  <div className="text-3xl font-cormorant font-semibold text-[#0A4A4A] mb-6">
                    {room.price}€<span className="text-lg text-slate-600 font-normal"> / διανυκτέρευση</span>
                  </div>

                  <p className="text-slate-700 font-alegreya mb-6">{room.description}</p>

                  <Link href={`/book/${room.id}`}>
                    <Button className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white py-3 font-alegreya">
                      Κράτηση Τώρα
                    </Button>
                  </Link>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-4">Ανέσεις Δωματίου</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {room.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-slate-700 font-alegreya">
                          <amenity.icon className="h-4 w-4 text-[#0A4A4A]" />
                          {amenity.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Features */}
          <div className="mt-16">
            <h2 className="text-2xl font-cormorant font-light text-slate-800 mb-8">Λεπτομέρειες Δωματίου</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-4">Χαρακτηριστικά</h3>
                <ul className="space-y-2">
                  {room.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700 font-alegreya">
                      <span className="w-2 h-2 bg-[#0A4A4A] rounded-full mt-2 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-4">Πολιτικές</h3>
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
                    Δωρεάν ακύρωση έως 48 ώρες πριν
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-[#0A4A4A] rounded-full mt-2 flex-shrink-0"></span>
                    Δεν επιτρέπονται κατοικίδια
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-[#0A4A4A] rounded-full mt-2 flex-shrink-0"></span>
                    Απαγόρευση καπνίσματος
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
  return [{ roomId: "standard" }, { roomId: "family" }, { roomId: "romantic" }]
}

export async function generateMetadata({ params }: RoomDetailPageProps) {
  const { roomId } = await params
  const room = roomsData[roomId as keyof typeof roomsData]

  if (!room) {
    return {
      title: "Δωμάτιο δεν βρέθηκε | Asterias Hotel",
    }
  }

  return {
    title: `${room.name} | Asterias Hotel Koronisia`,
    description: room.description,
  }
}
