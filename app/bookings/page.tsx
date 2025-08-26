"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import {
  format,
  differenceInDays,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns"
import { el, enUS } from "date-fns/locale"
import {
  CalendarIcon,
  Users,
  Bed,
  Wifi,
  Coffee,
  Bath,
  Star,
  ArrowRight,
  CheckCircle,
  Filter,
  X,
  Grid,
  List,
  Plus,
  Minus,
  Scale,
  Snowflake,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"

const initialAvailableRooms = [
  {
    id: "standard",
    nameKey: "bookingsPage.rooms.standard.name",
    descriptionKey: "bookingsPage.rooms.standard.description",
    price: 60,
    originalPrice: 75,
    maxGuests: 2,
    size: 25,
    image: "/room-1.png",
    amenitiesKeys: [
      "bookingsPage.amenities.wifi",
      "bookingsPage.amenities.ac",
      "bookingsPage.amenities.privateBathroom",
      "bookingsPage.amenities.tv",
    ],
    featuresKeys: [
      "bookingsPage.features.doubleBed",
      "bookingsPage.features.gardenView",
      "bookingsPage.features.balcony",
    ],
    available: true,
    rating: 4.5,
    reviews: 28,
    totalRooms: 4,
    bedTypeKey: "bookingsPage.rooms.standard.bedType",
    viewKey: "bookingsPage.rooms.standard.view",
    bathroomKey: "bookingsPage.rooms.standard.bathroom",
    balcony: true,
    airConditioning: true,
    wifi: true,
    tv: true,
    minibar: false,
    breakfast: false,
    parking: true,
  },
  {
    id: "family",
    nameKey: "bookingsPage.rooms.family.name",
    descriptionKey: "bookingsPage.rooms.family.description",
    price: 80,
    originalPrice: 95,
    maxGuests: 4,
    size: 35,
    image: "/room-2.png",
    amenitiesKeys: [
      "bookingsPage.amenities.wifi",
      "bookingsPage.amenities.ac",
      "bookingsPage.amenities.refrigerator",
      "bookingsPage.amenities.balcony",
    ],
    featuresKeys: ["bookingsPage.features.doubleBed", "bookingsPage.features.sofaBed", "bookingsPage.features.seaView"],
    available: true,
    rating: 4.7,
    reviews: 15,
    totalRooms: 3,
    bedTypeKey: "bookingsPage.rooms.family.bedType",
    viewKey: "bookingsPage.rooms.family.view",
    bathroomKey: "bookingsPage.rooms.family.bathroom",
    balcony: true,
    airConditioning: true,
    wifi: true,
    tv: true,
    minibar: true,
    breakfast: false,
    parking: true,
  },
  {
    id: "romantic",
    nameKey: "bookingsPage.rooms.romantic.name",
    descriptionKey: "bookingsPage.rooms.romantic.description",
    price: 100,
    originalPrice: 120,
    maxGuests: 2,
    size: 30,
    image: "/room-3.png",
    amenitiesKeys: [
      "bookingsPage.amenities.wifi",
      "bookingsPage.amenities.jacuzzi",
      "bookingsPage.amenities.breakfast",
      "bookingsPage.amenities.minibar",
    ],
    featuresKeys: [
      "bookingsPage.features.kingSizeBed",
      "bookingsPage.features.seaView",
      "bookingsPage.features.privateBalcony",
    ],
    available: true,
    rating: 4.9,
    reviews: 22,
    totalRooms: 2,
    bedTypeKey: "bookingsPage.rooms.romantic.bedType",
    viewKey: "bookingsPage.rooms.romantic.view",
    bathroomKey: "bookingsPage.rooms.romantic.bathroom",
    balcony: true,
    airConditioning: true,
    wifi: true,
    tv: true,
    minibar: true,
    breakfast: true,
    parking: true,
  },
  {
    id: "superior",
    nameKey: "bookingsPage.rooms.superior.name",
    descriptionKey: "bookingsPage.rooms.superior.description",
    price: 120,
    originalPrice: 140,
    maxGuests: 2,
    size: 40,
    image: "/room-4.png",
    amenitiesKeys: [
      "bookingsPage.amenities.wifi",
      "bookingsPage.amenities.minibar",
      "bookingsPage.amenities.coffeemaker",
      "bookingsPage.amenities.seaView",
    ],
    featuresKeys: [
      "bookingsPage.features.kingSizeBed",
      "bookingsPage.features.livingArea",
      "bookingsPage.features.premiumBathroom",
    ],
    available: false,
    rating: 4.8,
    reviews: 12,
    totalRooms: 1,
    bedTypeKey: "bookingsPage.rooms.superior.bedType",
    viewKey: "bookingsPage.rooms.superior.view",
    bathroomKey: "bookingsPage.rooms.superior.bathroom",
    balcony: true,
    airConditioning: true,
    wifi: true,
    tv: true,
    minibar: true,
    breakfast: true,
    parking: true,
  },
]

// Mock availability data
const generateAvailabilityData = (rooms: any[]) => {
  const today = new Date()
  const endDate = addDays(today, 90) // Next 3 months
  const dates = eachDayOfInterval({ start: today, end: endDate })

  const availability: Record<string, Record<string, number>> = {}

  rooms.forEach((room) => {
    availability[room.id] = {}
    dates.forEach((date) => {
      const dateStr = format(date, "yyyy-MM-dd")
      const randomFactor = Math.random()
      let availableCount = room.totalRooms

      const dayOfWeek = date.getDay()
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        availableCount = Math.floor(room.totalRooms * (0.3 + randomFactor * 0.4))
      } else {
        availableCount = Math.floor(room.totalRooms * (0.5 + randomFactor * 0.5))
      }

      if (randomFactor < 0.1) {
        availableCount = 0
      }
      availability[room.id][dateStr] = availableCount
    })
  })
  return availability
}

export default function BookingsPage() {
  const { t, language } = useLanguage()
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [adults, setAdults] = useState("2")
  const [children, setChildren] = useState("0")
  const [showResults, setShowResults] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 150])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedRoomType, setSelectedRoomType] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [selectedRoomForCalendar, setSelectedRoomForCalendar] = useState<string>("all")
  const [compareRooms, setCompareRooms] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const dateLocale = language === "el" ? el : enUS

  const availableRooms = initialAvailableRooms.map((room) => ({
    ...room,
    name: t(room.nameKey),
    description: t(room.descriptionKey),
    amenities: room.amenitiesKeys.map((key) => t(key)),
    features: room.featuresKeys.map((key) => t(key)),
    bedType: t(room.bedTypeKey),
    view: t(room.viewKey),
    bathroom: t(room.bathroomKey),
  }))

  const availability = generateAvailabilityData(availableRooms)
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0

  const handleSearch = () => {
    if (checkIn && checkOut && nights > 0) {
      setShowResults(true)
    }
  }

  const handleDateSelect = (date: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date)
      setCheckOut(undefined)
    } else if (checkIn && !checkOut) {
      if (isAfter(date, checkIn)) {
        setCheckOut(date)
      } else {
        setCheckIn(date)
        setCheckOut(undefined)
      }
    }
  }

  const toggleCompareRoom = (roomId: string) => {
    setCompareRooms((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId)
      } else if (prev.length < 3) {
        return [...prev, roomId]
      }
      return prev
    })
  }

  const clearComparison = () => {
    setCompareRooms([])
    setShowComparison(false)
  }

  const allAmenities = Array.from(new Set(availableRooms.flatMap((room) => room.amenities))).sort()

  const roomTypes = [
    { id: "all", nameKey: "bookingsPage.filters.roomType.all" },
    { id: "standard", nameKey: "bookingsPage.filters.roomType.standard" },
    { id: "family", nameKey: "bookingsPage.filters.roomType.family" },
    { id: "romantic", nameKey: "bookingsPage.filters.roomType.romantic" },
    { id: "superior", nameKey: "bookingsPage.filters.roomType.superior" },
  ].map((rt) => ({ ...rt, name: t(rt.nameKey) }))

  const filteredRooms = availableRooms.filter((room) => {
    const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1]
    const matchesAmenities =
      selectedAmenities.length === 0 || selectedAmenities.every((amenity) => room.amenities.includes(amenity))
    const matchesType = selectedRoomType === "all" || room.id.includes(selectedRoomType)
    return matchesPrice && matchesAmenities && matchesType
  })

  const getAvailabilityStatus = (date: Date, roomId: string) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const room = availableRooms.find((r) => r.id === roomId)
    if (!room || !availability[roomId] || !availability[roomId][dateStr] === undefined) return "unavailable"

    const available = availability[roomId][dateStr]
    const total = room.totalRooms

    if (available === 0) return "unavailable"
    if (available === total) return "available"
    return "limited"
  }

  const getOverallAvailability = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    let totalAvailable = 0
    let totalRooms = 0

    availableRooms.forEach((room) => {
      if (availability[room.id] && availability[room.id][dateStr] !== undefined) {
        totalAvailable += availability[room.id][dateStr]
        totalRooms += room.totalRooms
      }
    })

    if (totalAvailable === 0) return "unavailable"
    if (totalAvailable === totalRooms) return "available"
    return "limited"
  }

  const getAmenityIcon = (amenity: string) => {
    // These checks should ideally use keys or more robust identifiers if amenities are diverse
    if (amenity.toLowerCase().includes(t("bookingsPage.amenities.wifi").toLowerCase()))
      return <Wifi className="h-4 w-4" />
    if (amenity.toLowerCase().includes(t("bookingsPage.amenities.ac").toLowerCase()))
      return <Snowflake className="h-4 w-4" />
    if (amenity.toLowerCase().includes(t("bookingsPage.amenities.privateBathroom").toLowerCase()))
      return <Bath className="h-4 w-4" />
    if (
      amenity.toLowerCase().includes(t("bookingsPage.amenities.breakfast").toLowerCase()) ||
      amenity.toLowerCase().includes(t("bookingsPage.amenities.coffeemaker").toLowerCase())
    )
      return <Coffee className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  const ComparisonModal = () => {
    const roomsToCompare = availableRooms.filter((room) => compareRooms.includes(room.id))
    if (roomsToCompare.length === 0) return null

    return (
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-cormorant font-light text-slate-800 flex items-center gap-2">
              <Scale className="h-6 w-6 text-[#8B4B5C]" />
              {t("bookingsPage.comparison.modalTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {roomsToCompare.map((room) => (
              <div key={room.id} className="bg-slate-50 rounded-lg p-6 relative">
                <button
                  onClick={() => toggleCompareRoom(room.id)}
                  className="absolute top-4 right-4 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title={t("bookingsPage.comparison.removeTooltip")}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{room.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-2">{room.name}</h3>
                  <div className="flex items-center gap-2">
                    {room.originalPrice > room.price && (
                      <span className="text-sm text-slate-400 line-through font-alegreya">{room.originalPrice}€</span>
                    )}
                    <span className="text-2xl font-cormorant font-bold text-[#8B4B5C]">{room.price}€</span>
                    <span className="text-xs text-slate-500 font-alegreya">
                      {t("bookingsPage.comparison.pricePerNight")}
                    </span>
                  </div>
                  {nights > 0 && (
                    <div className="text-sm font-medium text-slate-700 font-alegreya mt-1">
                      {t("bookingsPage.comparison.totalPrice")
                        .replace("{price}", (room.price * nights).toFixed(0))
                        .replace("{nights}", nights.toString())}
                    </div>
                  )}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-alegreya">
                      {t("bookingsPage.comparison.sizeLabel")}
                    </span>
                    <span className="text-sm font-medium font-alegreya">{room.size}m²</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-alegreya">
                      {t("bookingsPage.comparison.capacityLabel")}
                    </span>
                    <span className="text-sm font-medium font-alegreya">
                      {t("bookingsPage.comparison.capacityText").replace("{count}", room.maxGuests.toString())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-alegreya">
                      {t("bookingsPage.comparison.bedLabel")}
                    </span>
                    <span className="text-sm font-medium font-alegreya">{room.bedType}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-alegreya">
                      {t("bookingsPage.comparison.viewLabel")}
                    </span>
                    <span className="text-sm font-medium font-alegreya">{room.view}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-sm text-slate-600 font-alegreya">
                      {t("bookingsPage.comparison.bathroomLabel")}
                    </span>
                    <span className="text-sm font-medium font-alegreya">{room.bathroom}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 font-alegreya mb-3">
                    {t("bookingsPage.comparison.amenitiesTitle")}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "wifi", labelKey: "bookingsPage.comparison.featureLabel.wifi", value: room.wifi },
                      {
                        key: "airConditioning",
                        labelKey: "bookingsPage.comparison.featureLabel.ac",
                        value: room.airConditioning,
                      },
                      { key: "tv", labelKey: "bookingsPage.comparison.featureLabel.tv", value: room.tv },
                      { key: "minibar", labelKey: "bookingsPage.comparison.featureLabel.minibar", value: room.minibar },
                      {
                        key: "breakfast",
                        labelKey: "bookingsPage.comparison.featureLabel.breakfast",
                        value: room.breakfast,
                      },
                      { key: "parking", labelKey: "bookingsPage.comparison.featureLabel.parking", value: room.parking },
                      { key: "balcony", labelKey: "bookingsPage.comparison.featureLabel.balcony", value: room.balcony },
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            feature.value ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {feature.value ? <CheckCircle className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </div>
                        <span className="text-xs font-alegreya text-slate-700">{t(feature.labelKey)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    href={`/rooms/${room.id}`}
                    className="block w-full text-center py-2 border border-[#8B4B5C] text-[#8B4B5C] hover:bg-[#8B4B5C] hover:text-white transition-colors font-alegreya rounded-lg text-sm"
                  >
                    {t("bookingsPage.comparison.detailsButton")}
                  </Link>
                  {room.available ? (
                    <Link
                      href={`/book/${room.id}`} // This should ideally pass dates and guest count
                      className="block w-full text-center py-2 bg-[#8B4B5C] text-white hover:bg-[#7A4251] transition-colors font-alegreya rounded-lg text-sm"
                    >
                      {t("bookingsPage.comparison.bookButton")}
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 bg-slate-300 text-slate-500 cursor-not-allowed font-alegreya rounded-lg text-sm"
                    >
                      {t("bookingsPage.comparison.unavailableButton")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button onClick={clearComparison} variant="outline" className="font-alegreya">
              {t("bookingsPage.comparison.clearButton")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const CalendarView = () => {
    const monthStart = startOfMonth(calendarMonth)
    const monthEnd = endOfMonth(calendarMonth)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const roomsToShow =
      selectedRoomForCalendar === "all"
        ? availableRooms
        : availableRooms.filter((room) => room.id === selectedRoomForCalendar)

    const dayHeaders = [
      t("bookingsPage.calendar.dayHeader.sun"),
      t("bookingsPage.calendar.dayHeader.mon"),
      t("bookingsPage.calendar.dayHeader.tue"),
      t("bookingsPage.calendar.dayHeader.wed"),
      t("bookingsPage.calendar.dayHeader.thu"),
      t("bookingsPage.calendar.dayHeader.fri"),
      t("bookingsPage.calendar.dayHeader.sat"),
    ]

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-cormorant font-semibold text-slate-800">
              {t("bookingsPage.calendar.title")} {format(calendarMonth, "MMMM yyyy", { locale: dateLocale })}
            </h3>
            <p className="text-slate-600 font-alegreya">{t("bookingsPage.calendar.subtitle")}</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedRoomForCalendar} onValueChange={setSelectedRoomForCalendar}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("bookingsPage.calendar.selectRoomPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("bookingsPage.calendar.allRoomsOption")}</SelectItem>
                {availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCalendarMonth(addDays(calendarMonth, -30))}>
                ←
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCalendarMonth(addDays(calendarMonth, 30))}>
                →
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm font-alegreya">{t("bookingsPage.calendar.legend.available")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm font-alegreya">{t("bookingsPage.calendar.legend.limited")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm font-alegreya">{t("bookingsPage.calendar.legend.unavailable")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#8B4B5C] rounded"></div>
            <span className="text-sm font-alegreya">{t("bookingsPage.calendar.legend.selected")}</span>
          </div>
        </div>

        {selectedRoomForCalendar === "all" ? (
          <div className="grid grid-cols-7 gap-2">
            {dayHeaders.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-slate-600 font-alegreya">
                {day}
              </div>
            ))}
            {monthDays.map((date) => {
              const status = getOverallAvailability(date)
              const isSelected = (checkIn && isSameDay(date, checkIn)) || (checkOut && isSameDay(date, checkOut))
              const isInRange = checkIn && checkOut && isAfter(date, checkIn) && isBefore(date, checkOut)
              return (
                <button
                  key={format(date, "yyyy-MM-dd")}
                  onClick={() => handleDateSelect(date)}
                  className={`p-2 text-sm font-alegreya rounded-lg transition-all hover:scale-105 ${isSelected ? "bg-[#8B4B5C] text-white" : isInRange ? "bg-[#8B4B5C]/20 text-[#8B4B5C]" : status === "available" ? "bg-green-100 text-green-800 hover:bg-green-200" : status === "limited" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : "bg-red-100 text-red-800 cursor-not-allowed"}`}
                  disabled={status === "unavailable"}
                >
                  {format(date, "d")}
                </button>
              )
            })}
          </div>
        ) : (
          <div>
            {roomsToShow.map((room) => (
              <div key={room.id} className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={room.image || "/placeholder.svg"}
                    alt={room.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-cormorant font-semibold text-slate-800">{room.name}</h4>
                    <p className="text-sm text-slate-600 font-alegreya">
                      {t("bookingsPage.calendar.roomAvailabilityText").replace("{count}", room.totalRooms.toString())}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xl font-cormorant font-bold text-[#8B4B5C]">{room.price}€</div>
                    <div className="text-xs text-slate-500 font-alegreya">
                      {t("bookingsPage.calendar.roomPricePerNight")}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {dayHeaders.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-slate-600 font-alegreya">
                      {day}
                    </div>
                  ))}
                  {monthDays.map((date) => {
                    const status = getAvailabilityStatus(date, room.id)
                    const availableCount = availability[room.id]?.[format(date, "yyyy-MM-dd")] || 0
                    const isSelected = (checkIn && isSameDay(date, checkIn)) || (checkOut && isSameDay(date, checkOut))
                    const isInRange = checkIn && checkOut && isAfter(date, checkIn) && isBefore(date, checkOut)
                    return (
                      <button
                        key={format(date, "yyyy-MM-dd")}
                        onClick={() => handleDateSelect(date)}
                        className={`p-2 text-sm font-alegreya rounded-lg transition-all hover:scale-105 relative ${isSelected ? "bg-[#8B4B5C] text-white" : isInRange ? "bg-[#8B4B5C]/20 text-[#8B4B5C]" : status === "available" ? "bg-green-100 text-green-800 hover:bg-green-200" : status === "limited" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : "bg-red-100 text-red-800 cursor-not-allowed"}`}
                        disabled={status === "unavailable"}
                        title={t("bookingsPage.calendar.availabilityTooltip")
                          .replace("{availableCount}", availableCount.toString())
                          .replace("{totalRooms}", room.totalRooms.toString())}
                      >
                        <div>{format(date, "d")}</div>
                        {status !== "unavailable" && <div className="text-xs opacity-75">{availableCount}</div>}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {checkIn && checkOut && (
          <div className="mt-6 p-4 bg-[#E8E2D5]/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-cormorant font-semibold text-slate-800">
                  {t("bookingsPage.calendar.selectedDatesSummaryTitle")}
                </h4>
                <p className="text-sm text-slate-600 font-alegreya">
                  {format(checkIn, "dd/MM/yyyy", { locale: dateLocale })} -{" "}
                  {format(checkOut, "dd/MM/yyyy", { locale: dateLocale })} ({nights}{" "}
                  {nights === 1
                    ? t("bookingsPage.calendar.selectedDatesNights_one").replace("{nights}", nights.toString())
                    : t("bookingsPage.calendar.selectedDatesNights_other").replace("{nights}", nights.toString())}
                  )
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowResults(true)
                  setViewMode("list")
                }}
                className="bg-[#8B4B5C] hover:bg-[#7A4251] text-white font-alegreya"
              >
                {t("bookingsPage.calendar.viewAvailableRoomsButton")}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="relative h-[60vh] bg-gradient-to-br from-[#8B4B5C] to-[#7A4251] overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <Image
            src="/bookings-header.png"
            alt={t("bookingsPage.hero.title")}
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-cormorant font-light mb-6">{t("bookingsPage.hero.title")}</h1>
            <div className="w-24 h-0.5 bg-[#E8E2D5] mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl font-alegreya opacity-90 mb-8">{t("bookingsPage.hero.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="relative -mt-20 z-20 mt-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
                  {t("bookingsPage.form.checkInLabel")}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-12 border-2 hover:border-[#8B4B5C]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#8B4B5C]" />
                      {checkIn
                        ? format(checkIn, "dd/MM/yyyy", { locale: dateLocale })
                        : t("bookingsPage.form.datePlaceholder")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => {
                        if (date && checkOut && isAfter(date, checkOut)) {
                          setCheckOut(undefined) // Reset checkout if new checkin is after current checkout
                        }
                        setCheckIn(date)
                      }}
                      initialFocus
                      locale={dateLocale}
                      disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
                  {t("bookingsPage.form.checkOutLabel")}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-12 border-2 hover:border-[#8B4B5C]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#8B4B5C]" />
                      {checkOut
                        ? format(checkOut, "dd/MM/yyyy", { locale: dateLocale })
                        : t("bookingsPage.form.datePlaceholder")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      initialFocus
                      disabled={
                        (date) =>
                          isBefore(date, addDays(startOfDay(new Date()), 1)) || // Must be tomorrow or later
                          (checkIn ? isBefore(date, addDays(checkIn, 1)) : false) // And if checkIn is set, must be after checkIn
                      }
                      locale={dateLocale}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
                  {t("bookingsPage.form.adultsLabel")}
                </label>
                <Select value={adults} onValueChange={setAdults}>
                  <SelectTrigger className="h-12 border-2 hover:border-[#8B4B5C]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t("bookingsPage.form.adultsValue.1")}</SelectItem>
                    <SelectItem value="2">{t("bookingsPage.form.adultsValue.2")}</SelectItem>
                    <SelectItem value="3">{t("bookingsPage.form.adultsValue.3")}</SelectItem>
                    <SelectItem value="4">{t("bookingsPage.form.adultsValue.4")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
                  {t("bookingsPage.form.childrenLabel")}
                </label>
                <Select value={children} onValueChange={setChildren}>
                  <SelectTrigger className="h-12 border-2 hover:border-[#8B4B5C]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t("bookingsPage.form.childrenValue.0")}</SelectItem>
                    <SelectItem value="1">{t("bookingsPage.form.childrenValue.1")}</SelectItem>
                    <SelectItem value="2">{t("bookingsPage.form.childrenValue.2")}</SelectItem>
                    <SelectItem value="3">{t("bookingsPage.form.childrenValue.3")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button
                  onClick={handleSearch}
                  disabled={!checkIn || !checkOut || nights <= 0}
                  className="w-full h-12 bg-[#8B4B5C] hover:bg-[#7A4251] text-white font-alegreya text-lg"
                >
                  {t("bookingsPage.form.searchButton")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            {checkIn && checkOut && nights > 0 && (
              <div className="mt-6 p-4 bg-[#E8E2D5]/30 rounded-lg">
                <div className="flex items-center justify-between text-sm font-alegreya">
                  <span className="text-slate-600">
                    {nights}{" "}
                    {nights === 1 ? t("bookingsPage.summary.nights_one") : t("bookingsPage.summary.nights_other")} •{" "}
                    {adults}{" "}
                    {adults === "1" ? t("bookingsPage.summary.adults_one") : t("bookingsPage.summary.adults_other")}
                    {children !== "0" &&
                      ` • ${children} ${children === "1" ? t("bookingsPage.summary.children_one") : t("bookingsPage.summary.children_other")}`}
                  </span>
                  <span className="text-[#8B4B5C] font-medium">
                    {format(checkIn, "dd MMM", { locale: dateLocale })} -{" "}
                    {format(checkOut, "dd MMM", { locale: dateLocale })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {compareRooms.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-[#8B4B5C] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4">
            <Scale className="h-5 w-5" />
            <span className="font-alegreya">
              {compareRooms.length} {t("bookingsPage.comparison.barText")}
            </span>
            <Button
              onClick={() => setShowComparison(true)}
              size="sm"
              className="bg-white text-[#8B4B5C] hover:bg-[#E8E2D5] font-alegreya"
            >
              {t("bookingsPage.comparison.compareButton")}
            </Button>
            <Button onClick={clearComparison} size="sm" variant="ghost" className="text-white hover:bg-white/20 p-1">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <ComparisonModal />

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-cormorant font-light text-slate-800 mb-4">
              {viewMode === "calendar"
                ? t("bookingsPage.viewToggle.calendarTitle")
                : t("bookingsPage.viewToggle.listTitle")}
            </h2>
            <div className="w-16 h-0.5 bg-[#8B4B5C] mx-auto mb-6"></div>
            <p className="text-slate-600 font-alegreya mb-6">
              {viewMode === "calendar"
                ? t("bookingsPage.viewToggle.calendarSubtitle")
                : t("bookingsPage.viewToggle.listSubtitle")}
            </p>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "list" | "calendar")}
              className="w-fit mx-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  {t("bookingsPage.viewToggle.listViewTab")}
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  {t("bookingsPage.viewToggle.calendarViewTab")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="max-w-7xl mx-auto">
            {viewMode === "calendar" ? (
              <CalendarView />
            ) : (
              <>
                {showResults && (
                  <div className="mb-6">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 text-slate-700 border-slate-300 hover:border-[#8B4B5C] hover:text-[#8B4B5C]"
                        >
                          <Filter className="h-5 w-5" />
                          {t("bookingsPage.filters.openButton")}
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[350px] sm:w-[400px] flex flex-col p-0">
                        <SheetHeader className="p-6 pb-4 border-b">
                          <SheetTitle className="text-xl font-cormorant font-semibold text-slate-800">
                            {t("bookingsPage.filters.title")}
                          </SheetTitle>
                        </SheetHeader>
                        <div className="flex-grow overflow-y-auto p-6 space-y-8">
                          {/* Price Range Filter */}
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 font-alegreya mb-3">
                              {t("bookingsPage.filters.priceRangeLabel")}
                            </h4>
                            <div className="px-1">
                              <Slider
                                defaultValue={[0, 150]}
                                max={200}
                                step={10}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                className="mb-4"
                              />
                              <div className="flex justify-between text-xs text-slate-500 font-alegreya">
                                <span>{priceRange[0]}€</span>
                                <span>{priceRange[1]}€</span>
                              </div>
                            </div>
                          </div>

                          {/* Room Type Filter */}
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 font-alegreya mb-3">
                              {t("bookingsPage.filters.roomTypeLabel")}
                            </h4>
                            <div className="space-y-2">
                              {roomTypes.map((type) => (
                                <button
                                  key={type.id}
                                  onClick={() => setSelectedRoomType(type.id)}
                                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-alegreya transition-colors ${
                                    selectedRoomType === type.id
                                      ? "bg-[#8B4B5C]/10 text-[#8B4B5C] font-medium"
                                      : "text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  {type.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Amenities Filter */}
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 font-alegreya mb-3">
                              {t("bookingsPage.filters.amenitiesLabel")}
                            </h4>
                            <div className="space-y-3">
                              {allAmenities.map((amenity) => (
                                <div key={amenity} className="flex items-center">
                                  <Checkbox
                                    id={`sheet-amenity-${amenity}`} // Ensure unique ID for sheet
                                    checked={selectedAmenities.includes(amenity)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedAmenities([...selectedAmenities, amenity])
                                      } else {
                                        setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity))
                                      }
                                    }}
                                    className="border-slate-300 data-[state=checked]:bg-[#8B4B5C] data-[state=checked]:border-[#8B4B5C]"
                                  />
                                  <label
                                    htmlFor={`sheet-amenity-${amenity}`}
                                    className="ml-2 text-sm font-alegreya text-slate-700 cursor-pointer"
                                  >
                                    {amenity}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <SheetFooter className="p-6 pt-4 border-t bg-slate-50">
                          <div className="flex flex-col gap-3 w-full">
                            <div className="text-xs text-slate-600 font-alegreya">
                              <span className="font-medium text-slate-800">{filteredRooms.length}</span>{" "}
                              {t("bookingsPage.filters.resultsSummary")
                                .replace("{count}", filteredRooms.length.toString())
                                .replace("{total}", availableRooms.length.toString())}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPriceRange([0, 150])
                                setSelectedAmenities([])
                                setSelectedRoomType("all")
                              }}
                              className="w-full text-[#8B4B5C] border-[#8B4B5C] hover:bg-[#8B4B5C]/10 font-alegreya"
                            >
                              {t("bookingsPage.filters.clearButton")}
                            </Button>
                            <SheetClose asChild>
                              <Button
                                size="sm"
                                className="w-full bg-[#8B4B5C] hover:bg-[#7A4251] text-white font-alegreya"
                              >
                                {t("bookingsPage.filters.applyButton")}
                              </Button>
                            </SheetClose>
                          </div>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                )}
                {showResults && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredRooms.length > 0 ? (
                      filteredRooms.map((room) => (
                        <div
                          key={room.id}
                          className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${!room.available ? "opacity-75" : ""}`}
                        >
                          <div className="relative h-64">
                            <Image
                              src={room.image || "/placeholder.svg"}
                              alt={room.name}
                              fill
                              className="object-cover"
                            />
                            {!room.available && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-white text-slate-800 px-4 py-2 rounded-full font-alegreya font-medium">
                                  {t("bookingsPage.roomList.unavailableOverlay")}
                                </span>
                              </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{room.rating}</span>
                                <span className="text-xs text-slate-500">({room.reviews})</span>
                              </div>
                            </div>
                            <div className="absolute top-4 left-4">
                              <Button
                                onClick={() => toggleCompareRoom(room.id)}
                                size="sm"
                                variant={compareRooms.includes(room.id) ? "default" : "outline"}
                                className={`${compareRooms.includes(room.id) ? "bg-[#8B4B5C] text-white" : "bg-white/90 text-slate-700 hover:bg-white"} backdrop-blur-sm`}
                                disabled={!compareRooms.includes(room.id) && compareRooms.length >= 3}
                              >
                                {compareRooms.includes(room.id) ? (
                                  <Minus className="h-4 w-4" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-2">
                                  {room.name}
                                </h3>
                                <p className="text-slate-600 font-alegreya text-sm mb-3">{room.description}</p>
                                <div className="flex items-center gap-4 text-sm text-slate-500 font-alegreya">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>
                                      {t("bookingsPage.roomList.capacityText").replace(
                                        "{count}",
                                        room.maxGuests.toString(),
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Bed className="h-4 w-4" />
                                    <span>{room.size}m²</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                {room.originalPrice > room.price && (
                                  <div className="text-sm text-slate-400 line-through font-alegreya">
                                    {room.originalPrice}€
                                  </div>
                                )}
                                <div className="text-2xl font-cormorant font-bold text-[#8B4B5C]">{room.price}€</div>
                                <div className="text-xs text-slate-500 font-alegreya">
                                  {t("bookingsPage.roomList.pricePerNight")}
                                </div>
                                {nights > 0 && (
                                  <div className="text-sm font-medium text-slate-700 font-alegreya mt-1">
                                    {t("bookingsPage.roomList.totalPrice").replace(
                                      "{price}",
                                      (room.price * nights).toFixed(0),
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {room.amenities.slice(0, 4).map((amenity, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-full"
                                  >
                                    {getAmenityIcon(amenity)}
                                    <span className="font-alegreya">{amenity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="mb-6">
                              <div className="flex flex-wrap gap-2">
                                {room.features.map((feature, index) => (
                                  <span
                                    key={index}
                                    className="text-xs text-slate-600 bg-[#E8E2D5]/50 px-2 py-1 rounded font-alegreya"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Link
                                href={`/rooms/${room.id}`}
                                className="flex-1 text-center py-2 border border-[#8B4B5C] text-[#8B4B5C] hover:bg-[#8B4B5C] hover:text-white transition-colors font-alegreya rounded-lg"
                              >
                                {t("bookingsPage.roomList.detailsButton")}
                              </Link>
                              {room.available ? (
                                <Link
                                  href={`/book/${room.id}`}
                                  className="flex-1 text-center py-2 bg-[#8B4B5C] text-white hover:bg-[#7A4251] transition-colors font-alegreya rounded-lg"
                                >
                                  {t("bookingsPage.roomList.bookButton")}
                                </Link>
                              ) : (
                                <button
                                  disabled
                                  className="flex-1 py-2 bg-slate-300 text-slate-500 cursor-not-allowed font-alegreya rounded-lg"
                                >
                                  {t("bookingsPage.roomList.unavailableButton")}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 py-12 text-center">
                        <div className="bg-white rounded-lg shadow-md p-8">
                          <h3 className="text-xl font-cormorant font-semibold text-slate-800 mb-4">
                            {t("bookingsPage.roomList.noRoomsFoundTitle")}
                          </h3>
                          <p className="text-slate-600 font-alegreya mb-6">
                            {t("bookingsPage.roomList.noRoomsFoundSubtitle")}
                          </p>
                          <Button
                            onClick={() => {
                              setPriceRange([0, 150])
                              setSelectedAmenities([])
                              setSelectedRoomType("all")
                            }}
                            className="bg-[#8B4B5C] hover:bg-[#7A4251] text-white font-alegreya"
                          >
                            {t("bookingsPage.roomList.clearFiltersButton")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-cormorant font-light text-slate-800 mb-4">
              {t("bookingsPage.benefits.title")}
            </h2>
            <div className="w-16 h-0.5 bg-[#8B4B5C] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8E2D5]/50 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-[#8B4B5C]" />
              </div>
              <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-2">
                {t("bookingsPage.benefits.item1.title")}
              </h3>
              <p className="text-slate-600 font-alegreya">{t("bookingsPage.benefits.item1.description")}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8E2D5]/50 rounded-full mb-4">
                <svg className="h-8 w-8 text-[#8B4B5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-2">
                {t("bookingsPage.benefits.item2.title")}
              </h3>
              <p className="text-slate-600 font-alegreya">{t("bookingsPage.benefits.item2.description")}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8E2D5]/50 rounded-full mb-4">
                <svg className="h-8 w-8 text-[#8B4B5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-2">
                {t("bookingsPage.benefits.item3.title")}
              </h3>
              <p className="text-slate-600 font-alegreya">{t("bookingsPage.benefits.item3.description")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#8B4B5C] to-[#7A4251]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl font-cormorant font-light mb-4">{t("bookingsPage.cta.title")}</h2>
            <p className="text-lg font-alegreya mb-8 opacity-90">{t("bookingsPage.cta.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3 bg-white text-[#8B4B5C] hover:bg-[#E8E2D5] transition-colors font-alegreya rounded-lg"
              >
                {t("bookingsPage.cta.contactButton")}
              </Link>
              <a
                href="tel:+306972705881"
                className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-[#8B4B5C] transition-colors font-alegreya rounded-lg"
              >
                {t("bookingsPage.cta.callButton")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
