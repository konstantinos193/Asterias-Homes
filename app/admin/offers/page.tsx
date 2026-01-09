"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Trash, Edit, ToggleLeft, ToggleRight } from "lucide-react"
import Link from "next/link"
import { useAdminOffers, useDeleteOffer, useToggleOffer, Offer } from "@/hooks/api/use-offers"
import { useToast } from "@/components/ui/use-toast"

export default function AdminOffersPage() {
  const { toast } = useToast()
  const { data: offers = [], isLoading, error } = useAdminOffers()
  const deleteOfferMutation = useDeleteOffer()
  const toggleOfferMutation = useToggleOffer()

  const handleDelete = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την προσφορά;")) return
    try {
      await deleteOfferMutation.mutateAsync(id)
      toast({
        title: "Επιτυχία",
        description: "Η προσφορά διαγράφηκε επιτυχώς",
      })
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία διαγραφής προσφοράς",
        variant: "destructive",
      })
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await toggleOfferMutation.mutateAsync(id)
      toast({
        title: "Επιτυχία",
        description: "Η κατάσταση της προσφοράς ενημερώθηκε",
      })
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία ενημέρωσης κατάστασης προσφοράς",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-sm font-alegreya">
        {error.message || "Αποτυχία φόρτωσης προσφορών"}
      </div>
    )
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center p-12">
                    <p className="text-slate-500 font-alegreya">Φόρτωση...</p>
                  </td>
                </tr>
              ) : offers.length > 0 ? (
                offers.map((offer) => {
                  const offerId = offer._id || offer.id || ''
                  const isActive = offer.active ?? false
                  return (
                  <tr key={offerId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-alegreya">
                      {offer.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      {offer.discount}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      {offer.endDate 
                        ? new Date(offer.endDate).toLocaleDateString('el-GR') 
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {isActive ? "Ενεργή" : "Ανενεργή"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggle(offerId)}
                        disabled={toggleOfferMutation.isPending}
                        title={isActive ? "Απενεργοποίηση" : "Ενεργοποίηση"}
                      >
                        {isActive ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-slate-400" />
                        )}
                      </Button>
                      <Link href={`/admin/offers/edit/${offerId}`}>
                        <Button variant="ghost" size="icon" title="Επεξεργασία">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(offerId)}
                        disabled={deleteOfferMutation.isPending}
                        className="text-red-600 hover:text-red-800"
                        title="Διαγραφή"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  )
                })
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
