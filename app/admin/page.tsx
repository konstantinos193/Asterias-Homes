"use client"

import { useEffect, useState } from "react"
import { Calendar, Bed, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { adminAPI } from "@/lib/api"

// Mock data fallback
const mockStatsData = [
  {
    nameKey: "admin.dashboard.stats.todayArrivals",
    value: "8",
    icon: Calendar,
    change: "+2",
    changeType: "increase",
  },
  {
    nameKey: "admin.dashboard.stats.availableRooms",
    value: "12",
    icon: Bed,
    change: "-3",
    changeType: "decrease",
  },
  {
    nameKey: "admin.dashboard.stats.totalGuests",
    value: "24",
    icon: Users,
    change: "+5",
    changeType: "increase",
  },
  {
    nameKey: "admin.dashboard.stats.occupancy",
    value: "75%",
    icon: TrendingUp,
    change: "+12%",
    changeType: "increase",
  },
]

const recentBookingsData = [
  {
    id: "AST-2024-001",
    guest: "Μαρία Παπαδοπούλου", // Guest names are dynamic data, not typically translated via i18n keys
    room: "Standard Δωμάτιο", // Room names might be dynamic or could be keys if fixed
    checkIn: "2024-01-15",
    checkOut: "2024-01-17",
    status: "confirmed",
    total: "135.60€",
  },
  {
    id: "AST-2024-002",
    guest: "Γιάννης Κωνσταντίνου",
    room: "Οικογενειακό Δωμάτιο",
    checkIn: "2024-01-16",
    checkOut: "2024-01-20",
    status: "pending",
    total: "361.60€",
  },
  {
    id: "AST-2024-003",
    guest: "Ελένη Μιχαηλίδου",
    room: "Ρομαντικό Δωμάτιο",
    checkIn: "2024-01-18",
    checkOut: "2024-01-21",
    status: "confirmed",
    total: "339.00€",
  },
]

const todayArrivalsData = [
  {
    guest: "Δημήτρης Αντωνίου",
    room: "Standard Δωμάτιο",
    time: "15:30",
    status: "checked-in",
  },
  {
    guest: "Σοφία Γεωργίου",
    room: "Ρομαντικό Δωμάτιο",
    time: "16:00",
    status: "pending",
  },
  {
    guest: "Νίκος Παπαδάκης",
    room: "Οικογενειακό Δωμάτιο",
    time: "17:30",
    status: "pending",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
    case "checked-in":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-slate-500" />
  }
}

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await adminAPI.getDashboard()
        setDashboardData(data)
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 font-alegreya">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-sm font-alegreya">
        {error}
      </div>
    )
  }

  // Use real data from backend or fallback to mock data
  const statsData = dashboardData?.stats || mockStatsData

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return t("admin.status.confirmed")
      case "pending":
        return t("admin.status.pending")
      case "cancelled":
        return t("admin.status.cancelled")
      case "checked-in":
        return t("admin.status.checkedIn")
      case "checked-out": // Added for completeness
        return t("admin.status.checkedOut")
      default:
        return status
    }
  }

  // Note: Guest names and specific room names in bookings/arrivals are dynamic data.
  // If room names are fixed types (e.g., "Standard Room"), they could also be translated.
  // For this example, I'm keeping them as is from the mock data.

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-cormorant font-light text-slate-800">{t("admin.dashboard.title")}</h1>
        <p className="text-slate-600 font-alegreya">{t("admin.dashboard.subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat: any) => (
          <div key={stat.nameKey} className="bg-white p-6 rounded-sm border border-slate-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-[#0A4A4A]" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 font-alegreya truncate">{t(stat.nameKey)}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-slate-900 font-cormorant">{stat.value}</div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-cormorant font-semibold text-slate-800">
              {t("admin.dashboard.recentBookings.title")}
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {recentBookingsData.map((booking) => (
              <div key={booking.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(booking.status)}
                      <p className="text-sm font-medium text-slate-900 font-alegreya truncate">{booking.guest}</p>
                    </div>
                    <p className="text-sm text-slate-500 font-alegreya">{booking.room}</p>
                    <p className="text-xs text-slate-400 font-alegreya">
                      {booking.checkIn} - {booking.checkOut}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 font-alegreya">{booking.total}</p>
                    <p className="text-xs text-slate-500 font-alegreya">{getStatusText(booking.status)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-slate-200">
            <Link href="/admin/bookings" className="text-sm text-[#0A4A4A] hover:underline font-alegreya">
              {t("admin.dashboard.recentBookings.viewAll")}
            </Link>
          </div>
        </div>

        {/* Today's Arrivals */}
        <div className="bg-white rounded-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-cormorant font-semibold text-slate-800">
              {t("admin.dashboard.todayArrivals.title")}
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {todayArrivalsData.map((arrival, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(arrival.status)}
                      <p className="text-sm font-medium text-slate-900 font-alegreya truncate">{arrival.guest}</p>
                    </div>
                    <p className="text-sm text-slate-500 font-alegreya">{arrival.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 font-alegreya">{arrival.time}</p>
                    <p className="text-xs text-slate-500 font-alegreya">{getStatusText(arrival.status)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-slate-200">
            <Link href="/admin/bookings" className="text-sm text-[#0A4A4A] hover:underline font-alegreya">
              {t("admin.dashboard.todayArrivals.manage")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
