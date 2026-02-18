"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  Euro,
  Percent,
  Download,
  Clock,
  Building,
  Target,
  FileText,
  Settings
} from "lucide-react"
import { useAdminAnalytics, useAdminRevenueReports } from "@/hooks/api/use-admin"
import { logger } from "@/lib/logger"
import * as XLSX from 'xlsx'

interface AnalyticsData {
  dateRange: { start: string; end: string }
  totalRooms: number
  bookingStatistics: {
    totalBookings: number
    confirmedBookings: number
    cancelledBookings: number
    checkedInBookings: number
    checkedOutBookings: number
    totalRevenue: number
    averageBookingValue: number
    totalGuests: number
    totalNights: number
  }
  bookingTrends: Array<{
    _id: { date: string }
    count: number
    revenue: number
  }>
  roomPerformance: Array<{
    _id: string
    bookings: number
    revenue: number
    averageRate: number
    totalNights: number
  }>
  leadTimeAnalysis: {
    averageLeadTime: number
    minLeadTime: number
    maxLeadTime: number
  }
  occupancyData: Array<{
    _id: { year: number; month: number }
    totalNights: number
  }>
  guestDemographics: {
    totalAdults: number
    totalChildren: number
    averageGroupSize: number
    familyBookings: number
    coupleBookings: number
    soloBookings: number
  }
  cancellationRate: number
  averageDailyRate: number
}

interface RevenueData {
  monthlyRevenue: Array<{
    _id: { year: number; month: number }
    revenue: number
    bookings: number
    averageBookingValue: number
  }>
  revenueByRoom: Array<{
    _id: string
    revenue: number
    bookings: number
    percentage: number
  }>
  paymentMethods: Array<{
    _id: string
    revenue: number
    count: number
  }>
  totalRevenue: number
  period: number
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("30")
  const [revenuePeriod, setRevenuePeriod] = useState("12")

  const { data: analyticsResponse, isLoading: analyticsLoading, error: analyticsError } = useAdminAnalytics({ period })
  const { data: revenueResponse, isLoading: revenueLoading, error: revenueError } = useAdminRevenueReports(revenuePeriod)

  const loading = analyticsLoading || revenueLoading
  const analyticsData = analyticsResponse as AnalyticsData | null
  const revenueData = revenueResponse as RevenueData | null

  // Handle errors
  const error = analyticsError || revenueError ? (() => {
    const err = (analyticsError || revenueError) as Error
    logger.error('Error fetching reports data', err)
    return err.message || "Failed to load reports data"
  })() : null

  const formatCurrency = (amount: number | undefined | null) => {
    if (!amount || isNaN(amount)) return '0,00 €'
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatPercentage = (value: number | undefined | null) => {
    if (!value || isNaN(value)) return '0%'
    return `${Math.round(value)}%`
  }

  const getMonthName = (month: number) => {
    const months = [
      'Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαι', 'Ιουν',
      'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'
    ]
    return months[month - 1] || ''
  }

  const calculateOccupancyRate = () => {
    if (!analyticsData || !analyticsData.bookingStatistics?.totalNights || !analyticsData.totalRooms) {
      return 0
    }
    const periodDays = parseInt(period)
    const availableRoomNights = analyticsData.totalRooms * periodDays
    if (availableRoomNights === 0) return 0
    return Math.round((analyticsData.bookingStatistics.totalNights / availableRoomNights) * 100)
  }

  const exportAnalyticsReport = () => {
    if (!analyticsData || !revenueData) return

    // Booking Statistics Summary
    const summaryData = [{
      'Μετρική': 'Σύνολο Κρατήσεων',
      'Αξία': analyticsData?.bookingStatistics?.totalBookings || 0
    }, {
      'Μετρική': 'Επιβεβαιωμένες Κρατήσεις',
      'Αξία': analyticsData?.bookingStatistics?.confirmedBookings || 0
    }, {
      'Μετρική': 'Ακυρωμένες Κρατήσεις',
      'Αξία': analyticsData?.bookingStatistics?.cancelledBookings || 0
    }, {
      'Μετρική': 'Ποσοστό Ακυρώσεων',
      'Αξία': analyticsData?.cancellationRate ? `${analyticsData.cancellationRate}%` : '0%'
    }, {
      'Μετρική': 'Συνολικά Έσοδα',
      'Αξία': formatCurrency(analyticsData?.bookingStatistics?.totalRevenue || 0)
    }, {
      'Μετρική': 'Μέση Αξία Κράτησης',
      'Αξία': formatCurrency(analyticsData?.bookingStatistics?.averageBookingValue || 0)
    }, {
      'Μετρική': 'Μέσος Ημερήσιος Τιμή (ADR)',
      'Αξία': formatCurrency(analyticsData?.averageDailyRate || 0)
    }, {
      'Μετρική': 'Ποσοστό Πληρότητας',
      'Αξία': `${calculateOccupancyRate()}%`
    }, {
      'Μετρική': 'Συνολικοί Επισκέπτες',
      'Αξία': analyticsData?.bookingStatistics?.totalGuests || 0
    }, {
      'Μετρική': 'Μέσος Χρόνος Προκράτησης (μέρες)',
      'Αξία': Math.round(analyticsData?.leadTimeAnalysis?.averageLeadTime || 0)
    }]

    // Room Performance
    const roomPerformanceData = analyticsData?.roomPerformance?.map(room => ({
      'Δωμάτιο': room._id,
      'Κρατήσεις': room.bookings,
      'Έσοδα': formatCurrency(room.revenue),
      'Μέση Τιμή': formatCurrency(room.averageRate),
      'Σύνολο Νυχτών': Math.round(room.totalNights)
    }))

    // Guest Demographics
    const demographicsData = [{
      'Τύπος Κράτησης': 'Μόνος/η',
      'Αριθμός': analyticsData?.guestDemographics?.soloBookings || 0
    }, {
      'Τύπος Κράτησης': 'Ζευγάρι',
      'Αριθμός': analyticsData?.guestDemographics?.coupleBookings || 0
    }, {
      'Τύπος Κράτησης': 'Οικογένεια',
      'Αριθμός': analyticsData?.guestDemographics?.familyBookings || 0
    }]

    // Monthly Revenue
    const monthlyRevenueData = revenueData?.monthlyRevenue?.map(month => ({
      'Μήνας': `${getMonthName(month._id.month)} ${month._id.year}`,
      'Έσοδα': formatCurrency(month.revenue),
      'Κρατήσεις': month.bookings,
      'Μέση Αξία Κράτησης': formatCurrency(month.averageBookingValue)
    }))

    // Create workbook
    const wb = XLSX.utils.book_new()
    
    // Add worksheets
    const summaryWs = XLSX.utils.json_to_sheet(summaryData)
    const roomWs = XLSX.utils.json_to_sheet(roomPerformanceData)
    const demographicsWs = XLSX.utils.json_to_sheet(demographicsData)
    const revenueWs = XLSX.utils.json_to_sheet(monthlyRevenueData)
    
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Σύνοψη')
    XLSX.utils.book_append_sheet(wb, roomWs, 'Απόδοση Δωματίων')
    XLSX.utils.book_append_sheet(wb, demographicsWs, 'Δημογραφικά')
    XLSX.utils.book_append_sheet(wb, revenueWs, 'Μηνιαία Έσοδα')
    
    // Generate filename
    const today = new Date().toISOString().split('T')[0]
    const filename = `Αναφορές_Asterias_${today}.xlsx`
    
    XLSX.writeFile(wb, filename)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 font-alegreya">Φόρτωση αναφορών...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg font-alegreya">
        {error}
      </div>
    )
  }

  if (!analyticsData || !revenueData) {
    return (
      <div className="p-4 bg-slate-50 text-slate-600 rounded-lg font-alegreya">
        Δεν βρέθηκαν δεδομένα αναφορών
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
          <h1 className="text-2xl md:text-3xl font-cormorant font-semibold text-slate-800">
            Αναφορές Ακινήτου
        </h1>
        <p className="text-slate-600 mt-1 font-alegreya">
            Αναλύστε τάσεις και απόδοση των κρατήσεων δωματίων
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-48 font-alegreya text-sm bg-white">
              <SelectValue placeholder="Επιλέξτε περίοδο">
                {period === "7" && "Τελευταίες 7 μέρες"}
                {period === "30" && "Τελευταίες 30 μέρες"}
                {period === "90" && "Τελευταίες 90 μέρες"}
                {period === "365" && "Τελευταίος χρόνος"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              <SelectItem value="7">Τελευταίες 7 μέρες</SelectItem>
              <SelectItem value="30">Τελευταίες 30 μέρες</SelectItem>
              <SelectItem value="90">Τελευταίες 90 μέρες</SelectItem>
              <SelectItem value="365">Τελευταίος χρόνος</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={exportAnalyticsReport}
            className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
          >
            <Download className="h-4 w-4 mr-2" />
            Εξαγωγή Αναφοράς
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-alegreya text-slate-600">
              Συνολικές Κρατήσεις
            </CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-cormorant">
              {analyticsData.bookingStatistics?.totalBookings || 0}
            </div>
            <p className="text-xs text-slate-600 font-alegreya">
              {analyticsData.bookingStatistics?.confirmedBookings || 0} επιβεβαιωμένες
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-alegreya text-slate-600">
              Συνολικά Έσοδα
            </CardTitle>
            <Euro className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-cormorant">
              {formatCurrency(analyticsData.bookingStatistics?.totalRevenue)}
            </div>
            <p className="text-xs text-slate-600 font-alegreya">
              Μέση αξία: {formatCurrency(analyticsData.bookingStatistics?.averageBookingValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-alegreya text-slate-600">
              Πληρότητα
            </CardTitle>
            <Percent className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-cormorant">
              {formatPercentage(calculateOccupancyRate())}
            </div>
            <p className="text-xs text-slate-600 font-alegreya">
              {Math.round(analyticsData.bookingStatistics?.totalNights || 0)} συνολικές νύχτες
            </p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-alegreya text-slate-600">
              Ποσοστό Ακυρώσεων
              </CardTitle>
            <TrendingDown className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold font-cormorant">
              {formatPercentage(analyticsData?.cancellationRate || 0)}
            </div>
                        <p className="text-xs text-slate-600 font-alegreya">
              {analyticsData.bookingStatistics?.cancelledBookings || 0} ακυρώσεις
            </p>
            </CardContent>
          </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-cormorant">
              <BarChart3 className="h-5 w-5 text-[#0A4A4A]" />
              Απόδοση Δωματίων
            </CardTitle>
            <CardDescription className="font-alegreya">
              Έσοδα και κρατήσεις ανά τύπο δωματίου
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData?.roomPerformance?.slice(0, 5).length > 0 ? (
                analyticsData.roomPerformance.slice(0, 5).map((room, index) => (
                <div key={room._id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium font-alegreya">{room._id}</span>
                      <span className="text-sm text-slate-600 font-alegreya">
                        {formatCurrency(room.revenue)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-[#0A4A4A] h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((room.revenue / (analyticsData?.roomPerformance?.[0]?.revenue || 1)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-alegreya mt-1">
                      <span>{room.bookings} κρατήσεις</span>
                      <span>{Math.round(room.totalNights)} νύχτες</span>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8 text-slate-500 font-alegreya">
                  Δεν υπάρχουν διαθέσιμα δεδομένα απόδοσης δωματίων
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Guest Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-cormorant">
              <Users className="h-5 w-5 text-[#0A4A4A]" />
              Δημογραφικά Επισκεπτών
            </CardTitle>
            <CardDescription className="font-alegreya">
              Ανάλυση τύπων κρατήσεων
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold font-cormorant">
                    {analyticsData.guestDemographics?.totalAdults || 0}
                  </div>
                  <div className="text-sm text-slate-600 font-alegreya">Ενήλικες</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold font-cormorant">
                    {analyticsData.guestDemographics?.totalChildren || 0}
                  </div>
                  <div className="text-sm text-slate-600 font-alegreya">Παιδιά</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-alegreya">Οικογένειες</span>
                  <span className="text-sm font-medium font-alegreya">{analyticsData.guestDemographics?.familyBookings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-alegreya">Ζευγάρια</span>
                  <span className="text-sm font-medium font-alegreya">{analyticsData.guestDemographics?.coupleBookings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-alegreya">Μόνοι/ες</span>
                  <span className="text-sm font-medium font-alegreya">{analyticsData.guestDemographics?.soloBookings || 0}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-alegreya">Μέσο μέγεθος ομάδας</span>
                  <span className="text-sm font-medium font-alegreya">
                    {Math.round((analyticsData?.guestDemographics?.averageGroupSize || 0) * 10) / 10}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-cormorant">
                <LineChart className="h-5 w-5 text-[#0A4A4A]" />
                Μηνιαία Έσοδα
          </CardTitle>
              <CardDescription className="font-alegreya">
                Παρακολούθηση εσόδων ανά μήνα
          </CardDescription>
            </div>
            <Select value={revenuePeriod} onValueChange={setRevenuePeriod}>
              <SelectTrigger className="w-36 font-alegreya text-sm bg-white">
                <SelectValue placeholder="Περίοδος">
                  {revenuePeriod === "6" && "6 μήνες"}
                  {revenuePeriod === "12" && "12 μήνες"}
                  {revenuePeriod === "24" && "24 μήνες"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectItem value="6">6 μήνες</SelectItem>
                <SelectItem value="12">12 μήνες</SelectItem>
                <SelectItem value="24">24 μήνες</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueData?.monthlyRevenue?.slice(-6).map((month, index) => (
              <div key={`${month._id.year}-${month._id.month}`} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium font-alegreya">
                      {getMonthName(month._id.month)} {month._id.year}
                    </span>
                    <span className="text-sm text-slate-600 font-alegreya">
                      {formatCurrency(month.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-[#0A4A4A] h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((month.revenue / Math.max(...(revenueData?.monthlyRevenue?.map(m => m.revenue) || [1]))) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-alegreya mt-1">
                    <span>{month.bookings} κρατήσεις</span>
                    <span>Μέση αξία: {formatCurrency(month.averageBookingValue)}</span>
                  </div>
                </div>
              </div>
            ))}
            {(!revenueData?.monthlyRevenue || revenueData.monthlyRevenue.length === 0) && (
              <div className="text-center py-8 text-slate-500 font-alegreya">
                Δεν υπάρχουν διαθέσιμα δεδομένα εσόδων
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-cormorant">
              <Clock className="h-5 w-5 text-[#0A4A4A]" />
              Χρόνος Προκράτησης
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-alegreya">Μέσος χρόνος</span>
                <span className="text-sm font-medium font-alegreya">
                  {Math.round(analyticsData?.leadTimeAnalysis?.averageLeadTime || 0)} μέρες
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-alegreya">Ελάχιστος</span>
                <span className="text-sm font-medium font-alegreya">
                  {Math.round(analyticsData?.leadTimeAnalysis?.minLeadTime || 0)} μέρες
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-alegreya">Μέγιστος</span>
                <span className="text-sm font-medium font-alegreya">
                  {Math.round(analyticsData?.leadTimeAnalysis?.maxLeadTime || 0)} μέρες
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-cormorant">
              <Target className="h-5 w-5 text-[#0A4A4A]" />
              Μέσος Ημερήσιος Τιμή
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold font-cormorant mb-2">
                {formatCurrency(analyticsData.averageDailyRate)}
              </div>
              <p className="text-sm text-slate-600 font-alegreya">
                Μέση τιμή ανά νύχτα
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-cormorant">
              <Building className="h-5 w-5 text-[#0A4A4A]" />
              Χρήση Δωματίων
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-alegreya">Σύνολο δωματίων</span>
                <span className="text-sm font-medium font-alegreya">{analyticsData.totalRooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-alegreya">Πληρότητα</span>
                <span className="text-sm font-medium font-alegreya">
                  {formatPercentage(calculateOccupancyRate())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-alegreya">Συνολικές νύχτες</span>
                <span className="text-sm font-medium font-alegreya">
                  {Math.round(analyticsData.bookingStatistics?.totalNights || 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Report Generator */}
      <Card className="border-2 border-dashed border-slate-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-cormorant">
            <FileText className="h-5 w-5 text-[#0A4A4A]" />
            Προσαρμοσμένη Αναφορά
          </CardTitle>
          <CardDescription className="font-alegreya">
            Δημιουργήστε και εξάγετε προσαρμοσμένες αναφορές βάσει των συγκεκριμένων σας αναγκών
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-slate-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 font-alegreya mb-2">
                    Προσαρμοσμένος Γεννήτορας Αναφορών
                  </h4>
                  <p className="text-sm text-slate-600 font-alegreya mb-4">
                    Η λειτουργία δημιουργίας προσαρμοσμένων αναφορών θα είναι διαθέσιμη σε μελλοντική ενημέρωση. 
                    Αυτή τη στιγμή, μπορείτε να χρησιμοποιήσετε την ενότητα "Εξαγωγή Αναφορών" παραπάνω για 
                    να εξάγετε τις υπάρχουσες αναφορές σε Excel.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={exportAnalyticsReport}
                      disabled={!analyticsData || !revenueData}
                      className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Εξαγωγή Τρέχουσας Αναφοράς
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coming Soon Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-white border border-slate-200 rounded-lg">
                <h5 className="font-semibold text-slate-800 font-alegreya mb-2">Μελλοντικές Λειτουργίες:</h5>
                <ul className="space-y-2 text-sm text-slate-600 font-alegreya">
                  <li className="flex items-center gap-2">
                    <span className="text-[#0A4A4A]">•</span>
                    Επιλογή προσαρμοσμένων ημερομηνιών
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#0A4A4A]">•</span>
                    Φιλτράρισμα βάσει συγκεκριμένων κριτηρίων
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#0A4A4A]">•</span>
                    Επιλογή πεδίων για εξαγωγή
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#0A4A4A]">•</span>
                    Εξαγωγή σε PDF, CSV, Excel
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#0A4A4A]">•</span>
                    Προεπισκόπηση αναφοράς
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-lg">
                <h5 className="font-semibold text-slate-800 font-alegreya mb-2">Τρέχουσες Δυνατότητες:</h5>
                <ul className="space-y-2 text-sm text-slate-600 font-alegreya">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Εξαγωγή αναλυτικών δεδομένων
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Εξαγωγή δεδομένων εσόδων
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Εξαγωγή στοιχείων δωματίων
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Εξαγωγή δημογραφικών δεδομένων
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Πολλαπλά φύλλα Excel
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
