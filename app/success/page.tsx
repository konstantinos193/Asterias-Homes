import Link from "next/link"
import { CheckCircle, Calendar, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Επιτυχής Κράτηση | Asterias Hotel",
  description: "Η κράτησή σας ολοκληρώθηκε με επιτυχία",
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-cormorant font-light text-slate-800 mb-4">Η κράτησή σας ολοκληρώθηκε!</h1>
            <p className="text-lg text-slate-600 font-alegreya">
              Σας ευχαριστούμε για την κράτησή σας στο Asterias Hotel. Θα λάβετε σύντομα email επιβεβαίωσης.
            </p>
          </div>

          <div className="bg-white p-8 rounded-sm border border-slate-200 mb-8">
            <h2 className="text-xl font-cormorant font-semibold text-slate-800 mb-6">Στοιχεία Κράτησης</h2>

            <div className="space-y-4 text-left">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 font-alegreya">Αριθμός Κράτησης:</span>
                <span className="font-alegreya font-semibold">#AST-2024-001</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 font-alegreya">Δωμάτιο:</span>
                <span className="font-alegreya">Standard Δωμάτιο</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 font-alegreya">Check-in:</span>
                <span className="font-alegreya">15/01/2024</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 font-alegreya">Check-out:</span>
                <span className="font-alegreya">17/01/2024</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600 font-alegreya">Σύνολο:</span>
                <span className="font-alegreya font-semibold text-[#0A4A4A]">135.60€</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0A4A4A]/5 p-6 rounded-sm mb-8">
            <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-4">Τι ακολουθεί;</h3>
            <div className="space-y-3 text-sm text-slate-700 font-alegreya">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#0A4A4A] mt-0.5 flex-shrink-0" />
                <span>Θα λάβετε email επιβεβαίωσης με όλες τις λεπτομέρειες της κράτησής σας</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#0A4A4A] mt-0.5 flex-shrink-0" />
                <span>Θα επικοινωνήσουμε μαζί σας 24 ώρες πριν την άφιξή σας</span>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-[#0A4A4A] mt-0.5 flex-shrink-0" />
                <span>Check-in: 15:00 - 22:00 στην υποδοχή του ξενοδοχείου</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
                Επιστροφή στην Αρχική
              </Button>
            </Link>

            <div className="text-center">
              <p className="text-slate-600 font-alegreya mb-2">Χρειάζεστε βοήθεια;</p>
              <Link href="/contact" className="text-[#0A4A4A] hover:underline font-alegreya">
                Επικοινωνήστε μαζί μας
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
