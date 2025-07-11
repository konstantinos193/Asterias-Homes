import Image from "next/image"
import Link from "next/link"
import { Calendar, Tag, Clock, Check, Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// This would typically come from a database or API
const offers = [
  {
    id: "summer-escape",
    title: "Καλοκαιρινή Απόδραση",
    description: "Απολαύστε το καλοκαίρι στην Κορωνησία με ειδικές τιμές και δωρεάν πρωινό.",
    longDescription: `Ανακαλύψτε την ομορφιά της Κορωνησίας το καλοκαίρι με την ειδική μας προσφορά "Καλοκαιρινή Απόδραση". 

Απολαύστε τη διαμονή σας στο Asterias Hotel με έκπτωση 20% σε όλους τους τύπους δωματίων και επωφεληθείτε από τις επιπλέον παροχές μας. Ξεκινήστε την ημέρα σας με ένα πλούσιο πρωινό, απολαύστε το καλωσόρισμα με τοπικό κρασί και χαλαρώστε με αργό check-out την ημέρα της αναχώρησής σας.

Η Κορωνησία, ένα μικρό παραθαλάσσιο χωριό στην καρδιά του Αμβρακικού Κόλπου, προσφέρει μοναδικές εμπειρίες το καλοκαίρι. Απολαύστε τις παραλίες, εξερευνήστε τη φύση και ζήστε αυθεντικές στιγμές σε ένα περιβάλλον απαράμιλλης ομορφιάς.`,
    image: "/offers/summer-escape.png",
    galleryImages: ["/offers/summer-gallery-1.png", "/offers/summer-gallery-2.png", "/offers/summer-gallery-3.png"],
    discount: 20,
    originalPrice: 100,
    price: 80,
    validUntil: "2024-09-30",
    category: "seasonal",
    badge: "Προσφορά Καλοκαιριού",
    featured: true,
    roomType: "Όλα τα δωμάτια",
    includes: [
      "Δωρεάν πρωινό",
      "Καλωσόρισμα με τοπικό κρασί",
      "Αργό check-out",
      "Έκπτωση 20% σε όλα τα δωμάτια",
      "Δωρεάν Wi-Fi υψηλής ταχύτητας",
      "Πρόσβαση στις εγκαταστάσεις του ξενοδοχείου",
    ],
    terms: [
      "Η προσφορά ισχύει για κρατήσεις έως 30/09/2024",
      "Η διαθεσιμότητα είναι περιορισμένη",
      "Απαιτείται προκαταβολή 30% για την επιβεβαίωση της κράτησης",
      "Δωρεάν ακύρωση έως 48 ώρες πριν την άφιξη",
      "Η προσφορά δεν μπορεί να συνδυαστεί με άλλες εκπτώσεις",
    ],
    minStay: 2,
    availableRooms: [
      {
        id: "standard",
        name: "Standard Δωμάτιο",
        originalPrice: 75,
        price: 60,
        image: "/room-1.png",
      },
      {
        id: "family",
        name: "Οικογενειακό Δωμάτιο",
        originalPrice: 100,
        price: 80,
        image: "/room-2.png",
      },
      {
        id: "romantic",
        name: "Ρομαντικό Δωμάτιο",
        originalPrice: 125,
        price: 100,
        image: "/room-3.png",
      },
    ],
  },
  // Other offers would be here
]

// Format date to Greek format
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("el-GR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date)
}

// Calculate days remaining until offer expires
const getDaysRemaining = (dateString: string) => {
  const today = new Date()
  const expiryDate = new Date(dateString)
  const diffTime = expiryDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

export default function OfferDetailPage({ params }: { params: { offerId: string } }) {
  // In a real app, you would fetch this data from an API or database
  const offer = offers.find((o) => o.id === params.offerId)

  if (!offer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-cormorant font-light text-slate-800 mb-4">Η προσφορά δεν βρέθηκε</h1>
        <p className="text-slate-600 font-alegreya mb-8">Η προσφορά που αναζητάτε δεν είναι διαθέσιμη.</p>
        <Link href="/offers">
          <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">Επιστροφή στις Προσφορές</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Offer Header */}
      <div className="relative h-[400px] overflow-hidden">
        <Image src={offer.image || "/placeholder.svg"} alt={offer.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-cormorant font-light mb-4">{offer.title}</h1>
            <div className="w-16 h-0.5 bg-white mx-auto mb-4"></div>
            {offer.badge && (
              <Badge className="bg-[#0A4A4A] hover:bg-[#0A4A4A] text-white px-3 py-1 text-sm font-alegreya">
                {offer.badge}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Offer Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-cormorant font-light text-slate-800 mb-4">Περιγραφή</h2>
              <div className="prose max-w-none font-alegreya text-slate-600">
                {offer.longDescription.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {offer.galleryImages && offer.galleryImages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-cormorant font-light text-slate-800 mb-4">Φωτογραφίες</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {offer.galleryImages.map((image, index) => (
                    <div key={index} className="relative h-48 overflow-hidden rounded-sm">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${offer.title} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Rooms */}
            {offer.availableRooms && offer.availableRooms.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-cormorant font-light text-slate-800 mb-4">Διαθέσιμα Δωμάτια</h2>
                <div className="space-y-4">
                  {offer.availableRooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex flex-col md:flex-row border border-slate-200 rounded-sm overflow-hidden"
                    >
                      <div className="md:w-1/4 relative h-48 md:h-auto">
                        <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                      </div>
                      <div className="p-6 md:w-3/4 flex flex-col">
                        <h3 className="text-xl font-cormorant font-light text-slate-800 mb-2">{room.name}</h3>

                        <div className="flex items-baseline mt-auto">
                          <span className="text-slate-400 line-through mr-2 font-alegreya">{room.originalPrice}€</span>
                          <span className="text-2xl font-cormorant font-semibold text-[#0A4A4A]">{room.price}€</span>
                          <span className="text-slate-500 text-sm font-alegreya ml-1">/ διανυκτέρευση</span>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <Link href={`/rooms/${room.id}`}>
                            <Button
                              variant="outline"
                              className="text-[#0A4A4A] border-[#0A4A4A] hover:bg-[#0A4A4A] hover:text-white font-alegreya"
                            >
                              Λεπτομέρειες
                            </Button>
                          </Link>
                          <Link href={`/book/${room.id}?offer=${offer.id}`}>
                            <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
                              Κράτηση
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="mb-8">
              <h2 className="text-2xl font-cormorant font-light text-slate-800 mb-4">Όροι & Προϋποθέσεις</h2>
              <ul className="space-y-2 text-slate-600 font-alegreya">
                {offer.terms.map((term, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#0A4A4A] mr-2">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Offer Summary */}
            <div className="bg-white border border-slate-200 rounded-sm p-6 mb-6 sticky top-6">
              <h3 className="text-xl font-cormorant font-light text-slate-800 mb-4">Σύνοψη Προσφοράς</h3>

              <div className="space-y-4">
                {/* Price */}
                <div>
                  <div className="flex items-center text-sm text-slate-500 font-alegreya mb-1">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>Τιμή από</span>
                  </div>
                  <div className="flex items-baseline">
                    {offer.originalPrice && (
                      <span className="text-slate-400 line-through mr-2 font-alegreya">{offer.originalPrice}€</span>
                    )}
                    <span className="text-3xl font-cormorant font-semibold text-[#0A4A4A]">{offer.price}€</span>
                    <span className="text-slate-500 text-sm font-alegreya ml-1">/ διανυκτέρευση</span>
                  </div>
                </div>

                {/* Validity */}
                <div>
                  <div className="flex items-center text-sm text-slate-500 font-alegreya mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Ισχύει έως</span>
                  </div>
                  <div className="font-alegreya">
                    {formatDate(offer.validUntil)}
                    <span className="ml-2 text-sm text-orange-600">
                      (Απομένουν {getDaysRemaining(offer.validUntil)} ημέρες)
                    </span>
                  </div>
                </div>

                {/* Minimum Stay */}
                {offer.minStay && (
                  <div>
                    <div className="flex items-center text-sm text-slate-500 font-alegreya mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Ελάχιστη Διαμονή</span>
                    </div>
                    <div className="font-alegreya">
                      {offer.minStay} {offer.minStay === 1 ? "νύχτα" : "νύχτες"}
                    </div>
                  </div>
                )}

                {/* Room Type */}
                {offer.roomType && (
                  <div>
                    <div className="flex items-center text-sm text-slate-500 font-alegreya mb-1">
                      <Info className="h-4 w-4 mr-1" />
                      <span>Τύπος Δωματίου</span>
                    </div>
                    <div className="font-alegreya">{offer.roomType}</div>
                  </div>
                )}

                {/* Includes */}
                {offer.includes && offer.includes.length > 0 && (
                  <div>
                    <div className="flex items-center text-sm text-slate-500 font-alegreya mb-2">
                      <Check className="h-4 w-4 mr-1" />
                      <span>Η Προσφορά Περιλαμβάνει</span>
                    </div>
                    <ul className="space-y-1">
                      {offer.includes.map((item, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="font-alegreya text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="pt-4">
                  <Link href={`/bookings?offer=${offer.id}`}>
                    <Button className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
                      Κάντε Κράτηση Τώρα
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Limited Availability Alert */}
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-cormorant">Περιορισμένη Διαθεσιμότητα</AlertTitle>
              <AlertDescription className="font-alegreya text-sm">
                Η προσφορά ισχύει για περιορισμένο αριθμό δωματίων. Κάντε την κράτησή σας σήμερα!
              </AlertDescription>
            </Alert>

            {/* Need Help */}
            <div className="bg-slate-50 p-6 rounded-sm">
              <h3 className="text-lg font-cormorant font-light text-slate-800 mb-2">Χρειάζεστε Βοήθεια;</h3>
              <p className="text-slate-600 font-alegreya text-sm mb-4">
                Για περισσότερες πληροφορίες ή βοήθεια με την κράτησή σας, επικοινωνήστε μαζί μας.
              </p>
              <div className="font-alegreya text-sm">
                <div className="flex items-center mb-2">
                  <span className="text-[#0A4A4A] mr-2">✆</span>
                  <span>+30 XXX XXX XXXX</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#0A4A4A] mr-2">✉</span>
                  <span>info@hotelkoronisia.gr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
