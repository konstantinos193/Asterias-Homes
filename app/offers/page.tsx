import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This would typically come from a database or API
const offers = [
  {
    id: "summer-escape",
    title: "Καλοκαιρινή Απόδραση",
    description: "Απολαύστε το καλοκαίρι στην Κορωνησία με ειδικές τιμές και δωρεάν πρωινό.",
    image: "/offers/summer-escape.png",
    discount: 20,
    originalPrice: 100,
    price: 80,
    validUntil: "2024-09-30",
    category: "seasonal",
    badge: "Προσφορά Καλοκαιριού",
    featured: true,
    roomType: "Όλα τα δωμάτια",
    includes: ["Δωρεάν πρωινό", "Καλωσόρισμα με τοπικό κρασί", "Αργό check-out"],
  },
  {
    id: "romantic-weekend",
    title: "Ρομαντικό Σαββατοκύριακο",
    description: "Ιδανικό πακέτο για ζευγάρια με σαμπάνια κατά την άφιξη και ρομαντικό δείπνο.",
    image: "/offers/romantic-weekend.png",
    price: 150,
    validUntil: "2024-12-31",
    category: "package",
    badge: "Για Ζευγάρια",
    roomType: "Ρομαντικό Δωμάτιο",
    includes: ["Σαμπάνια κατά την άφιξη", "Ρομαντικό δείπνο", "Αργό check-out", "Πρωινό στο δωμάτιο"],
  },
  {
    id: "family-fun",
    title: "Οικογενειακή Διασκέδαση",
    description: "Πακέτο για οικογένειες με δραστηριότητες για παιδιά και έκπτωση για οικογενειακά δωμάτια.",
    image: "/offers/family-fun.png",
    discount: 15,
    originalPrice: 120,
    price: 102,
    validUntil: "2024-10-31",
    category: "package",
    roomType: "Οικογενειακό Δωμάτιο",
    includes: ["Δωρεάν διαμονή για παιδιά κάτω των 12", "Παιδικές δραστηριότητες", "Οικογενειακό πρωινό"],
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Κάντε κράτηση τουλάχιστον 60 ημέρες νωρίτερα και κερδίστε έκπτωση 25%.",
    image: "/offers/early-bird.png",
    discount: 25,
    price: 75,
    validUntil: "2024-12-31",
    category: "early-booking",
    badge: "Έγκαιρη Κράτηση",
    includes: ["25% έκπτωση σε όλα τα δωμάτια", "Δωρεάν αναβάθμιση δωματίου (βάσει διαθεσιμότητας)"],
  },
  {
    id: "last-minute",
    title: "Last Minute Deal",
    description: "Ειδικές τιμές για κρατήσεις της τελευταίας στιγμής. Περιορισμένη διαθεσιμότητα!",
    image: "/offers/last-minute.png",
    discount: 30,
    originalPrice: 100,
    price: 70,
    validUntil: "2024-08-31",
    category: "last-minute",
    badge: "Τελευταίο Λεπτό",
    featured: true,
    includes: ["30% έκπτωση", "Άμεση επιβεβαίωση"],
  },
  {
    id: "autumn-retreat",
    title: "Φθινοπωρινή Απόδραση",
    description: "Ανακαλύψτε την ομορφιά της Κορωνησίας το φθινόπωρο με ειδικές τιμές και δωρεάν περιηγήσεις.",
    image: "/offers/autumn-retreat.png",
    discount: 15,
    originalPrice: 90,
    price: 76.5,
    validUntil: "2024-11-30",
    category: "seasonal",
    badge: "Φθινοπωρινή Προσφορά",
    includes: ["Δωρεάν περιήγηση στον Αμβρακικό", "Τοπικά προϊόντα καλωσορίσματος"],
  },
  {
    id: "winter-escape",
    title: "Χειμερινή Απόδραση",
    description: "Απολαύστε τη γαλήνη της Κορωνησίας το χειμώνα με ειδικές τιμές και δωρεάν ζεστά ροφήματα.",
    image: "/offers/winter-escape.png",
    discount: 25,
    originalPrice: 80,
    price: 60,
    validUntil: "2024-03-31",
    category: "seasonal",
    badge: "Χειμερινή Προσφορά",
    includes: ["Δωρεάν ζεστά ροφήματα", "Αργό check-out", "Έκπτωση 15% στο εστιατόριο"],
  },
  {
    id: "weekend-getaway",
    title: "Απόδραση Σαββατοκύριακου",
    description: "Ιδανικό πακέτο για σύντομες αποδράσεις το Σαββατοκύριακο με ειδικές τιμές.",
    image: "/offers/weekend-getaway.png",
    discount: 10,
    originalPrice: 90,
    price: 81,
    validUntil: "2024-12-31",
    category: "package",
    includes: ["Αργό check-out την Κυριακή", "Δωρεάν πρωινό"],
  },
  {
    id: "honeymoon-package",
    title: "Πακέτο Μήνα του Μέλιτος",
    description: "Ειδικό πακέτο για νεόνυμφους με ρομαντικές εκπλήξεις και πολυτελείς παροχές.",
    image: "/offers/honeymoon-package.png",
    price: 200,
    validUntil: "2024-12-31",
    category: "package",
    badge: "Για Νεόνυμφους",
    roomType: "Ρομαντικό Δωμάτιο",
    includes: ["Σαμπάνια & φρούτα κατά την άφιξη", "Ρομαντικό δείπνο με κεριά", "Πρωινό στο δωμάτιο", "Αργό check-out"],
  },
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

export default function OffersPage() {
  return (
    <>
      {/* Page Header */}
      <div className="relative h-[300px] overflow-hidden">
        <Image src="/offers-header.png" alt="Special Offers" fill className="object-cover" />
        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-cormorant font-light mb-4">Ειδικές Προσφορές & Πακέτα</h1>
            <div className="w-16 h-0.5 bg-white mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-slate-600 font-alegreya text-lg">
            Ανακαλύψτε τις αποκλειστικές προσφορές και τα ειδικά πακέτα του Asterias Hotel. Από εποχιακές εκπτώσεις και
            προσφορές έγκαιρης κράτησης μέχρι ειδικά πακέτα για ζευγάρια και οικογένειες, έχουμε την ιδανική προσφορά
            για κάθε ταξιδιώτη.
          </p>
        </div>

        {/* Offers Tabs */}
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-5 mb-8">
            <TabsTrigger value="all" className="font-alegreya">
              Όλες
            </TabsTrigger>
            <TabsTrigger value="seasonal" className="font-alegreya">
              Εποχιακές
            </TabsTrigger>
            <TabsTrigger value="package" className="font-alegreya">
              Πακέτα
            </TabsTrigger>
            <TabsTrigger value="early-booking" className="font-alegreya">
              Έγκαιρη Κράτηση
            </TabsTrigger>
            <TabsTrigger value="last-minute" className="font-alegreya">
              Τελευταίου Λεπτού
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </TabsContent>

          <TabsContent value="seasonal" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers
              .filter((offer) => offer.category === "seasonal")
              .map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
          </TabsContent>

          <TabsContent value="package" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers
              .filter((offer) => offer.category === "package")
              .map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
          </TabsContent>

          <TabsContent value="early-booking" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers
              .filter((offer) => offer.category === "early-booking")
              .map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
          </TabsContent>

          <TabsContent value="last-minute" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers
              .filter((offer) => offer.category === "last-minute")
              .map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
          </TabsContent>
        </Tabs>

        {/* Terms and Conditions */}
        <div className="max-w-3xl mx-auto mt-16 p-6 bg-slate-50 rounded-sm">
          <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-4">Όροι & Προϋποθέσεις</h3>
          <ul className="space-y-2 text-sm text-slate-600 font-alegreya">
            <li>• Όλες οι προσφορές ισχύουν βάσει διαθεσιμότητας.</li>
            <li>• Οι τιμές περιλαμβάνουν ΦΠΑ και τοπικούς φόρους.</li>
            <li>• Απαιτείται προκαταβολή 30% για την επιβεβαίωση της κράτησης.</li>
            <li>• Δωρεάν ακύρωση έως 48 ώρες πριν την άφιξη (εκτός αν αναφέρεται διαφορετικά).</li>
            <li>• Οι προσφορές δεν μπορούν να συνδυαστούν με άλλες εκπτώσεις ή προωθητικές ενέργειες.</li>
            <li>
              • Το ξενοδοχείο διατηρεί το δικαίωμα να τροποποιήσει ή να αποσύρει τις προσφορές χωρίς προειδοποίηση.
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

// Offer Card Component
function OfferCard({ offer }: { offer: any }) {
  return (
    <div className="bg-white rounded-sm shadow-md overflow-hidden group h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={offer.image || "/placeholder.svg"}
          alt={offer.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {offer.badge && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-[#0A4A4A] hover:bg-[#0A4A4A] text-white px-3 py-1 text-sm font-alegreya">
              {offer.badge}
            </Badge>
          </div>
        )}
        {offer.discount && (
          <div className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold">
            <span className="text-center leading-none">-{offer.discount}%</span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-xl font-cormorant font-light text-slate-800 mb-2">{offer.title}</h4>
        <p className="text-slate-600 font-alegreya text-sm mb-4">{offer.description}</p>

        {offer.includes && (
          <div className="mb-4 mt-auto">
            <h5 className="text-sm font-medium text-slate-700 mb-2 font-alegreya">Περιλαμβάνει:</h5>
            <ul className="space-y-1">
              {offer.includes.slice(0, 3).map((item: string, i: number) => (
                <li key={i} className="flex items-start text-sm">
                  <span className="text-[#0A4A4A] mr-2">✓</span>
                  <span className="font-alegreya text-slate-600">{item}</span>
                </li>
              ))}
              {offer.includes.length > 3 && (
                <li className="text-sm italic text-slate-500 font-alegreya">+ {offer.includes.length - 3} ακόμα</li>
              )}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-slate-500 font-alegreya mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Έως: {formatDate(offer.validUntil)}</span>
          </div>
          {offer.roomType && <div className="text-sm italic">{offer.roomType}</div>}
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            {offer.originalPrice && (
              <span className="text-slate-400 line-through mr-2 font-alegreya text-sm">{offer.originalPrice}€</span>
            )}
            <span className="text-xl font-cormorant font-semibold text-[#0A4A4A]">{offer.price}€</span>
            <span className="text-slate-500 text-xs font-alegreya ml-1">/ διανυκτέρευση</span>
          </div>

          <Link href={`/offers/${offer.id}`}>
            <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya text-sm">Κράτηση</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
