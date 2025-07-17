"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
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
  const { t } = useLanguage()
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
        title: t("common.error"),
        description: t("admin.offers.errors.fetch"),
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
    if (!confirm(t("admin.offers.confirmDelete"))) return
    try {
      await offersAPI.delete(id)
      toast({
        title: t("common.success"),
        description: t("admin.offers.success.delete"),
      })
      fetchOffers() // Refresh the list
    } catch (error) {
      console.error("Failed to delete offer", error)
      toast({
        title: t("common.error"),
        description: t("admin.offers.errors.delete"),
        variant: "destructive",
      })
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await offersAPI.toggle(id)
      toast({
        title: t("common.success"),
        description: t("admin.offers.success.toggle"),
      })
      fetchOffers() // Refresh the list
    } catch (error) {
      console.error("Failed to toggle offer status", error)
      toast({
        title: t("common.error"),
        description: t("admin.offers.errors.toggle"),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">{t("admin.offers.title")}</h1>
          <p className="text-slate-600 font-alegreya">{t("admin.offers.subtitle")}</p>
        </div>
        <div>
          <Link href="/admin/offers/new">
            <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya">
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("admin.offers.addNew")}
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
                  {t("admin.offers.table.name")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  {t("admin.offers.table.discount")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  {t("admin.offers.table.validUntil")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  {t("admin.offers.table.status")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                >
                  {t("admin.offers.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-12">
                    <p className="text-slate-500 font-alegreya">{t("common.loading")}</p>
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
                      {new Date(offer.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          offer.active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {offer.active
                          ? t("admin.offers.status.active")
                          : t("admin.offers.status.inactive")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggle(offer._id)}
                        title={offer.active ? "Deactivate" : "Activate"}
                      >
                        {offer.active ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-slate-400" />
                        )}
                      </Button>
                      <Link href={`/admin/offers/edit/${offer._id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(offer._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-12">
                    <p className="text-slate-500 font-alegreya">{t("admin.offers.noOffers")}</p>
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
