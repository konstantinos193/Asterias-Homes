"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

// Mock data for offers - replace with actual data fetching and state management
const sampleOffers = [
  { id: "1", nameKey: "offers.summerEscape.title", discount: "20%", validUntil: "2024-09-30", status: "Active" },
  { id: "2", nameKey: "offers.romanticWeekend.title", discount: "N/A", validUntil: "2024-12-31", status: "Active" },
  { id: "3", nameKey: "offers.earlyBird.title", discount: "25%", validUntil: "2024-12-31", status: "Inactive" },
]

export default function AdminOffersPage() {
  const { t } = useLanguage()

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
              {sampleOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-alegreya">
                    {t(offer.nameKey)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">{offer.discount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    {offer.validUntil}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        offer.status === "Active" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {t(offer.status === "Active" ? "admin.offers.status.active" : "admin.offers.status.inactive")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/offers/edit/${offer.id}`}
                      className="text-[#0A4A4A] hover:underline font-alegreya"
                    >
                      {t("admin.offers.table.edit")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sampleOffers.length === 0 && (
          <div className="text-center p-12">
            <p className="text-slate-500 font-alegreya">{t("admin.offers.noOffers")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
