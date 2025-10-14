"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash, Edit, ToggleLeft, ToggleRight } from "lucide-react"
import Link from "next/link"
import { offersAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

// Define the Offer type according to your backend model
interface Offer {
  _id: string
  title: string
  discount: number
  endDate: string
  active: boolean
}

export default function AdminOffersPage() {
  const { toast } = useToast()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const response = await offersAPI.getAllAdmin()
      setOffers(response.offers)
    } catch (error) {
      console.error("Failed to fetch offers", error)
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία φόρτωσης προσφορών",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την προσφορά;")) return
    try {
      await offersAPI.delete(id)
      toast({
        title: "Επιτυχία",
        description: "Η προσφορά διαγράφηκε επιτυχώς",
      })
      fetchOffers() // Refresh the list
    } catch (error) {
      console.error("Failed to delete offer", error)
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία διαγραφής προσφοράς",
        variant: "destructive",
      })
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await offersAPI.toggle(id)
      toast({
        title: "Επιτυχία",
        description: "Η κατάσταση της προσφοράς ενημερώθηκε",
      })
      fetchOffers() // Refresh the list
    } catch (error) {
      console.error("Failed to toggle offer status", error)
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία ενημέρωσης κατάστασης προσφοράς",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">Προσφορές</h1>
          <p className="text-slate-600 font-alegreya">Διαχείριση ειδικών προσφορών και εκπτώσεων</p>
        </div>
        <div>
          <Link href="/admin/offers/new">
            <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
              <PlusCircle className="h-4 w-4 mr-2" />
              Δημιουργία Νέας Προσφοράς
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Όνομα
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Έκπτωση
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Ισχύει Μέχρι
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Κατάσταση
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-12">
                    <p className="text-slate-500 font-alegreya">Φόρτωση...</p>
                  </td>
                </tr>
              ) : offers.length > 0 ? (
                offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-alegreya">
                      {offer.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      {offer.discount}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      {new Date(offer.endDate).toLocaleDateString('el-GR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          offer.active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {offer.active ? "Ενεργή" : "Ανενεργή"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggle(offer._id)}
                        title={offer.active ? "Απενεργοποίηση" : "Ενεργοποίηση"}
                      >
                        {offer.active ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-slate-400" />
                        )}
                      </Button>
                      <Link href={`/admin/offers/edit/${offer._id}`}>
                        <Button variant="ghost" size="icon" title="Επεξεργασία">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(offer._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Διαγραφή"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-12">
                    <p className="text-slate-500 font-alegreya">Δεν βρέθηκαν προσφορές. Ξεκινήστε προσθέτοντας μια νέα προσφορά.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
