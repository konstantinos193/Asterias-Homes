"use client"

import { Calendar, Bed, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useAdminDashboard } from "@/hooks/api"
import { logger } from "@/lib/logger"
import { Button } from "@/components/ui/button"

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

// Mock data removed - using real data from backend

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
  const { data: dashboardData, isLoading: loading, error: queryError } = useAdminDashboard()

  // Handle errors
  const error = queryError ? (() => {
    const err = queryError as Error
    logger.error('Admin dashboard error', err)
    
    // Show a clear error message for 401, but do not redirect or clear auth state
    if (err.message && err.message.includes('401')) {
      return 'You are not authorized to view the admin dashboard. Please log in as an admin user.'
    }
    return err.message || "Failed to load dashboard data"
  })() : null

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
  const dashboard = dashboardData as any
  const statsData = dashboard?.data?.stats ? [
    {
      nameKey: "admin.dashboard.stats.todayArrivals",
      value: dashboard.data.stats.todayArrivals?.value?.toString() || dashboard.data.stats.todayArrivals?.toString() || "0",
      icon: Calendar,
      change: dashboard.data.stats.todayArrivals?.change,
      changeType: dashboard.data.stats.todayArrivals?.changeType,
    },
    {
      nameKey: "admin.dashboard.stats.availableRooms", 
      value: dashboard.data.stats.availableRooms?.value?.toString() || dashboard.data.stats.availableRooms?.toString() || "0",
      icon: Bed,
      change: dashboard.data.stats.availableRooms?.change,
      changeType: dashboard.data.stats.availableRooms?.changeType,
    },
    {
      nameKey: "admin.dashboard.stats.totalGuests",
      value: dashboard.data.stats.totalGuests?.value?.toString() || dashboard.data.stats.totalGuests?.toString() || "0", 
      icon: Users,
      change: dashboard.data.stats.totalGuests?.change,
      changeType: dashboard.data.stats.totalGuests?.changeType,
    },
    {
      nameKey: "admin.dashboard.stats.occupancy",
      value: dashboard.data.stats.occupancyRate?.value || dashboard.data.stats.occupancyRate || "0%",
      icon: TrendingUp,
      change: dashboard.data.stats.occupancyRate?.change,
      changeType: dashboard.data.stats.occupancyRate?.changeType,
    },
  ] : mockStatsData

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Επιβεβαιωμένη"
      case "pending":
        return "Εκκρεμής"
      case "cancelled":
        return "Ακυρωμένη"
      case "checked-in":
        return "Έγινε Check-in"
      case "checked-out": // Added for completeness
        return "Έγινε Check-out"
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
        <h1 className="text-2xl font-cormorant font-light text-slate-800">Πίνακας Ελέγχου</h1>
        <p className="text-slate-600 font-alegreya">Επισκόπηση της κατάστασης των δωματίων</p>
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
                  <dt className="text-sm font-medium text-slate-500 font-alegreya truncate">
                    {stat.nameKey === "admin.dashboard.stats.todayArrivals" ? "Σημερινές Άφιξεις" :
                     stat.nameKey === "admin.dashboard.stats.availableRooms" ? "Διαθέσιμα Δωμάτια" :
                     stat.nameKey === "admin.dashboard.stats.totalGuests" ? "Σύνολο Επισκεπτών" :
                     stat.nameKey === "admin.dashboard.stats.occupancy" ? "Πληρότητα" : stat.nameKey}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-slate-900 font-cormorant">{stat.value}</div>
                    {stat.change && (
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-sm border border-slate-200 lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-cormorant font-semibold text-slate-800">
              Πρόσφατες Κρατήσεις
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {dashboard?.data?.recentBookings && dashboard.data.recentBookings.length > 0 ? (
              dashboard.data.recentBookings.map((booking: any, index: number) => (
              <div key={booking._id || booking.id || index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(booking.bookingStatus || booking.status)}
                      <p className="text-sm font-medium text-slate-900 font-alegreya truncate">
                        {booking.guestInfo ? `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}` : booking.guest || 'Guest'}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500 font-alegreya">
                      {booking.room?.name || booking.room || booking.roomType || 'Room'}
                    </p>
                    <p className="text-xs text-slate-400 font-alegreya">
                      {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : booking.checkInDate} - {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : booking.checkOutDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 font-alegreya">
                      €{booking.totalAmount || booking.total || '0.00'}
                    </p>
                    <p className="text-xs text-slate-500 font-alegreya">
                      {(booking.bookingStatus || booking.status) === "CONFIRMED" ? "Επιβεβαιωμένη" :
                       (booking.bookingStatus || booking.status) === "PENDING" ? "Εκκρεμής" :
                       (booking.bookingStatus || booking.status) === "CANCELLED" ? "Ακυρωμένη" :
                       (booking.bookingStatus || booking.status) === "CHECKED_IN" ? "Έγινε Check-in" :
                       (booking.bookingStatus || booking.status) === "CHECKED_OUT" ? "Έγινε Check-out" :
                       booking.bookingStatus || booking.status}
                    </p>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-slate-500 font-alegreya">Δεν υπάρχουν πρόσφατες κρατήσεις</p>
              </div>
            )}
          </div>
          <div className="px-6 py-3 border-t border-slate-200">
            <Link href="/admin/bookings" className="text-sm text-[#0A4A4A] hover:underline font-alegreya">
              Προβολή όλων των κρατήσεων →
            </Link>
          </div>
        </div>

        {/* Unread Contacts */}
        <div className="bg-white rounded-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-cormorant font-semibold text-slate-800">
              Μη αναγνωσμένα Μηνύματα
            </h2>
            {dashboard?.data?.unreadContacts && dashboard.data.unreadContacts > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 font-alegreya">
                {dashboard.data.unreadContacts}
              </span>
            )}
          </div>
          <div className="px-6 py-8 text-center">
            {dashboard?.data?.unreadContacts && dashboard.data.unreadContacts > 0 ? (
              <>
                <MessageSquare className="h-12 w-12 text-[#0A4A4A] mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-900 font-cormorant mb-1">
                  {dashboard.data.unreadContacts}
                </p>
                <p className="text-sm text-slate-600 font-alegreya mb-4">
                  {dashboard.data.unreadContacts === 1 ? "Μη αναγνωσμένο μήνυμα" : "Μη αναγνωσμένα μηνύματα"}
                </p>
                <Link href="/admin/contacts?status=UNREAD">
                  <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya w-full">
                    Προβολή Μηνυμάτων
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-alegreya mb-4">
                  Όλα τα μηνύματα έχουν διαβαστεί
                </p>
                <Link href="/admin/contacts">
                  <Button variant="outline" className="font-alegreya w-full">
                    Προβολή Όλων
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Today's Arrivals */}
      <div className="bg-white rounded-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-cormorant font-semibold text-slate-800">
            Σημερινές Άφιξεις
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {dashboard?.data?.todayArrivals && dashboard.data.todayArrivals.length > 0 ? (
            dashboard.data.todayArrivals.map((arrival: any, index: number) => (
              <div key={arrival._id || index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(arrival.bookingStatus || arrival.status)}
                      <p className="text-sm font-medium text-slate-900 font-alegreya truncate">
                        {arrival.guestInfo ? `${arrival.guestInfo.firstName} ${arrival.guestInfo.lastName}` : arrival.guest || 'Guest'}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500 font-alegreya">
                      {arrival.room?.name || arrival.room || 'Room'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 font-alegreya">
                      {arrival.checkIn ? new Date(arrival.checkIn).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' }) : arrival.time}
                    </p>
                    <p className="text-xs text-slate-500 font-alegreya">
                      {(arrival.bookingStatus || arrival.status) === "CONFIRMED" ? "Επιβεβαιωμένη" :
                       (arrival.bookingStatus || arrival.status) === "PENDING" ? "Εκκρεμής" :
                       (arrival.bookingStatus || arrival.status) === "CHECKED_IN" ? "Έγινε Check-in" :
                       arrival.bookingStatus || arrival.status}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-slate-500 font-alegreya">Δεν υπάρχουν άφιξεις σήμερα</p>
            </div>
          )}
        </div>
        <div className="px-6 py-3 border-t border-slate-200">
          <Link href="/admin/bookings" className="text-sm text-[#0A4A4A] hover:underline font-alegreya">
            Διαχείριση κρατήσεων →
          </Link>
        </div>
      </div>
    </div>
  )
}
