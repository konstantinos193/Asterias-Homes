"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChartIcon } from "lucide-react"

export default function AdminReportsPage() {
  const { t } = useLanguage()

  const reportSections = [
    {
      key: "bookingStats",
      icon: <BarChart className="h-8 w-8 text-[#0A4A4A]" />,
      descriptionKey: "admin.reports.bookingStats.description",
    },
    {
      key: "revenueReports",
      icon: <LineChart className="h-8 w-8 text-[#0A4A4A]" />,
      descriptionKey: "admin.reports.revenue.description",
    },
    {
      key: "occupancyAnalysis",
      icon: <PieChartIcon className="h-8 w-8 text-[#0A4A4A]" />,
      descriptionKey: "admin.reports.occupancy.description",
    },
    // Add more report types here if needed
    // {
    //   key: "guestDemographics",
    //   icon: <Users className="h-8 w-8 text-[#0A4A4A]" />,
    //   descriptionKey: "admin.reports.guestDemographics.description",
    // },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-cormorant font-semibold text-slate-800">
          {t("admin.reports.title", "Hotel Reports")}
        </h1>
        <p className="text-slate-600 mt-1 font-alegreya">
          {t("admin.reports.subtitle", "Analyze trends and performance across various hotel operations.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportSections.map((section) => (
          <Card key={section.key} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-cormorant font-semibold text-slate-700">
                {t(
                  `admin.reports.${section.key}.title`,
                  section.key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()) + " Reports",
                )}
              </CardTitle>
              {section.icon}
            </CardHeader>
            <CardContent>
              <CardDescription className="font-alegreya text-slate-500">
                {t(section.descriptionKey, "Detailed insights and charts will be available here soon.")}
              </CardDescription>
              <p className="text-sm text-slate-400 mt-4 font-alegreya">
                {t("admin.reports.comingSoon", "Functionality coming soon.")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-cormorant text-slate-700">
            {t("admin.reports.customReport.title", "Custom Report Generator")}
          </CardTitle>
          <CardDescription className="font-alegreya text-slate-500">
            {t(
              "admin.reports.customReport.description",
              "Build and export custom reports based on your specific needs. (Future Implementation)",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 font-alegreya">
            {t("admin.reports.customReport.comingSoon", "This feature is planned for future development.")}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
