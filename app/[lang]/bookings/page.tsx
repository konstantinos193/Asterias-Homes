"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import {
  format,
  differenceInDays,
  addDays,
  startOfDay,
  isAfter,
} from "date-fns"
import { el, enUS } from "date-fns/locale"
import {
  Users,
  Bed,
  Wifi,
  Coffee,
  Bath,
  Star,
  ArrowRight,
  CheckCircle,
  X,
  Plus,
  Minus,
  Scale,
  Snowflake,
  Tv,
  Shield,
  Building,
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
import { DatePicker } from "@/components/ui/date-picker"
import { api } from "@/lib/api-client"
import RoomSelection from "@/components/room-selection"
import { useRooms, useRoom } from "@/hooks/api"
import { logger } from "@/lib/logger"
import { normalizeImageUrl } from "@/lib/utils"
import { apiCache, availabilityRateLimiter } from "@/lib/api-cache"
import CacheMonitor from "@/components/cache-monitor"

export default function BookingsPage() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [adults, setAdults] = useState("2")
  const [children, setChildren] = useState("0")
  const [showResults, setShowResults] = useState(false)
  // Remove filter states since all rooms are identical
  const [compareRooms, setCompareRooms] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const { data: roomsData = [], isLoading: loadingRooms, error: roomsError } = useRooms()
  const [roomAvailabilities, setRoomAvailabilities] = useState<Record<string, number>>({});
  const [availability, setAvailability] = useState<Record<string, any>>({});

  // Get roomId from URL query params
  const roomIdParam = searchParams?.get('roomId') || null

  // Fetch specific room when roomId is present
  const { data: specificRoom, isLoading: loadingSpecificRoom } = useRoom(roomIdParam, {
    enabled: !!roomIdParam
  })

  // Normalize rooms data and filter by roomId if provided
  const rooms = useMemo(() => {
    const allRooms = Array.isArray(roomsData) ? roomsData : []
    if (roomIdParam && specificRoom) {
      // When a specific room is found, include it in the rooms array
      const roomId = specificRoom._id || specificRoom.id || ''
      const existsInAllRooms = allRooms.some((room: any) => {
        const rId = room._id || room.id || ''
        return rId === roomIdParam || String(rId) === String(roomIdParam)
      })
      if (existsInAllRooms) {
        // Filter to show only the specified room
        return allRooms.filter((room: any) => {
          const rId = room._id || room.id || ''
          return rId === roomIdParam || String(rId) === String(roomIdParam)
        })
      } else {
        // Room not in allRooms, but we have it from useRoom, so add it
        return [specificRoom]
      }
    }
    return allRooms
  }, [roomsData, roomIdParam, specificRoom])

  const dateLocale = language === "el" ? el : enUS
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  // Log errors if any
  if (roomsError) {
    logger.error('Error fetching rooms in bookings page', roomsError as Error)
  }

  // Debug: Log the actual rooms data
  console.log('🔥 Bookings page - roomsData:', roomsData)
  console.log('🔥 Bookings page - rooms:', rooms)
  console.log('🔥 Bookings page - rooms length:', rooms?.length)
  console.log('🔥 Bookings page - loadingRooms:', loadingRooms)
  console.log('🔥 Bookings page - roomsError:', roomsError)

  // Debug: Log each room's structure
  if (rooms && rooms.length > 0) {
    rooms.forEach((room, index) => {
      console.log(`🔥 Room ${index}:`, {
        id: room._id || room.id,
        name: room.name,
        hasName: !!room.name,
        nameType: typeof room.name,
        description: room.description,
        price: room.price,
        image: room.image,
        images: room.images
      })
    })
  }

  // Handle room selection from RoomSelection component
  const handleRoomSelect = (quantity: number, totalPrice: number) => {
    logger.info('Room selected in bookings page', { quantity, totalPrice });
    // Navigate to booking wizard with selected room data
    const searchParams = new URLSearchParams({
      rooms: quantity.toString(),
      price: totalPrice.toString(),
      guests: (parseInt(adults) + parseInt(children)).toString(),
      checkIn: checkIn ? format(checkIn, 'yyyy-MM-dd') : '',
      checkOut: checkOut ? format(checkOut, 'yyyy-MM-dd') : ''
    });
    window.location.href = `/book?${searchParams.toString()}`;
  };



  // Map backend data to frontend format (if needed) - memoized to prevent unnecessary recalculations
  const availableRooms = useMemo(() => {
    if (!Array.isArray(rooms)) return [];
    
    return rooms.map((room) => {
      // Store original amenities as object before converting to array
      const roomAmenitiesObj = room.amenities && typeof room.amenities === 'object' && !Array.isArray(room.amenities) 
        ? (room.amenities as Record<string, any>)
        : null;
      return {
      ...room,
      name: room.name || `Room ${room.id}`,
      description: room.description || 'Room description',
      amenities: roomAmenitiesObj ? Object.keys(roomAmenitiesObj).filter(key => roomAmenitiesObj[key]) : [],
      features: room.features || [],
      bedType: room.bedType || 'Standard',
      view: room.view || 'Room View',
      bathroom: room.bathroom || 'Private Bathroom',
      image: (() => {
        const imgUrl = room.image || (Array.isArray(room.images) && room.images.length > 0 ? room.images[0] : undefined) || "/placeholder.svg";
        // Ensure imgUrl is always a string
        const imgString = typeof imgUrl === 'string' ? imgUrl : "/placeholder.svg";
        // Normalize the image URL using the shared utility
        return normalizeImageUrl(imgString);
      })(),
      // Pass full images array for RoomSelection component
      images: (() => {
        const roomImages = Array.isArray(room.images) ? room.images : (room.image ? [room.image] : []);
        // Filter out empty/null/undefined images and normalize URLs
        return roomImages
          .filter((img: string) => img && typeof img === 'string' && img.trim() !== '')
          .map((img: string) => normalizeImageUrl(img));
      })(),
      totalRooms: typeof room.totalRooms === 'number' ? room.totalRooms : 1,
      rating: typeof room.rating === 'number' ? room.rating : 0,
      reviews: typeof room.reviewCount === 'number' ? room.reviewCount : 0,
      price: typeof room.price === 'number' ? room.price : 0,
      originalPrice: typeof room.originalPrice === 'number' ? room.originalPrice : (typeof room.price === 'number' ? room.price : 0),
      size: typeof room.size === 'number' ? room.size : (typeof room.size === 'string' ? parseInt(room.size) || 35 : 35),
      id: room._id || room.id || '',
      // Room configuration based on actual data
      maxGuests: room.capacity || 2,
      available: true, // All rooms are available by default
      availableCount: typeof room.availableCount === 'number' ? room.availableCount : 0, // Add availableCount to the room object
      // Add properties for comparison modal
      wifi: roomAmenitiesObj?.wifi ?? false,
      airConditioning: roomAmenitiesObj?.ac ?? false,
      tv: roomAmenitiesObj?.tv ?? false,
      minibar: roomAmenitiesObj?.minibar ?? false,
      breakfast: false,
      parking: true,
      balcony: roomAmenitiesObj?.balcony ?? false
      };
    });
  }, [rooms, t]); // Only recalculate when rooms or t function changes

  // Fetch availability for list view when search is performed - debounced and optimized
  useEffect(() => {
    if (!checkIn || !checkOut || !showResults || !availableRooms.length) return;
    
    const timeoutId = setTimeout(async () => {
      // Type guard: ensure checkIn and checkOut are defined
      if (!checkIn || !checkOut) return;
      
      logger.info('Fetching availabilities for search...');
      const checkInStr = format(checkIn, "yyyy-MM-dd");
      const checkOutStr = format(checkOut, "yyyy-MM-dd");
      const newAvailabilities: Record<string, number> = {};
      
      try {
        await Promise.all(
          availableRooms.map(async (room) => {
            try {
              // Check rate limit first
              if (!availabilityRateLimiter.canMakeRequest(room.id)) {
                logger.warn(`Rate limit exceeded for room ${room.id}, skipping request`);
                newAvailabilities[room.id] = typeof room.totalRooms === 'number' ? room.totalRooms : 1;
                return;
              }

              const headers: Record<string, string> = {};
              if (apiKey) {
                headers['x-api-key'] = apiKey;
              }
              
              const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://asterias-backend.onrender.com'}/api/bookings/availability?roomId=${room.id}&checkIn=${checkInStr}&checkOut=${checkOutStr}`;
              const res = await apiCache.get(url, { headers }, 30000); // 30 seconds cache
              newAvailabilities[room.id] = res.available;
              logger.info('Fetched availability for room', { roomId: room.id, availability: res.available });
            } catch (error) {
              logger.error(`Error fetching availability for room ${room.id}`, error as Error);
              // Fallback to default availability
              newAvailabilities[room.id] = typeof room.totalRooms === 'number' ? room.totalRooms : 1;
            }
          })
        );
        setRoomAvailabilities(newAvailabilities);
        logger.info('All availabilities fetched', { availabilities: newAvailabilities });
      } catch (error) {
        logger.error('Error fetching availabilities', error as Error);
        // Fallback to default availability
        availableRooms.forEach(room => {
          newAvailabilities[room.id] = typeof room.totalRooms === 'number' ? room.totalRooms : 1;
        });
        setRoomAvailabilities(newAvailabilities);
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [checkIn, checkOut, showResults, JSON.stringify(availableRooms.map(r => r.id))]); // Use stable dependencies

  // Fetch calendar availability for all rooms - optimized with stable dependencies
  useEffect(() => {
    if (!availableRooms.length) return;
    
    const roomIds = availableRooms.map(r => r.id).sort().join(',');
    
    async function fetchCalendarAvailability() {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      try {
        logger.info('Fetching aggregated calendar availability', { month: currentMonth, year: currentYear });
        const response = await api.availability.getCalendarAvailability(currentMonth, currentYear) as { availability?: Record<string, any> };
        
        // Set availability data
        setAvailability(response?.availability || {});
      } catch (error) {
        logger.error('Error fetching calendar availability', error as Error);
        setAvailability({});
      }
    }
    
    fetchCalendarAvailability();
    
    // Set up real-time updates every 10 minutes instead of 5
    const interval = setInterval(fetchCalendarAvailability, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [JSON.stringify(availableRooms.map(r => r.id))]); // Use stable room IDs instead of array length

  const nights = checkIn && checkOut
    ? differenceInDays(startOfDay(checkOut), startOfDay(checkIn))
    : 0;

  const handleSearch = () => {
    logger.info("Booking search initiated", { checkIn, checkOut, nights });
    if (checkIn && checkOut && nights > 0) {
      setShowResults(true)
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

  // No filtering needed since all rooms are identical
  const filteredRooms = availableRooms; // Show all rooms directly

  // Automatically show results when roomId is present - with proper dependencies
  useEffect(() => {
    if (roomIdParam && rooms.length > 0 && !showResults) {
      setShowResults(true)
    }
  }, [roomIdParam, rooms.length, showResults, JSON.stringify(rooms.map(r => r.id))]) // Use stable room IDs

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
                  <Image src={typeof room.image === 'string' ? room.image : "/placeholder.svg"} alt={room.name} fill className="object-cover" />
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

  return (
    <>
      <div className="relative h-[60vh] bg-gradient-to-br from-[#8B4B5C] to-[#7A4251] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.07)_0%,transparent_80%)]"></div>
        <div className="absolute inset-0 bg-black/20"></div>
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
          <div className="bg-[#F8F6F2] border border-slate-200 rounded-2xl shadow-xl p-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
                  {t("bookingsPage.form.checkInLabel", "Arrival")}
                </label>
                <DatePicker
                  selectedDate={checkIn}
                  onDateSelect={(date) => {
                    setCheckIn(date);
                    if (checkOut && isAfter(checkOut, date)) {
                      setCheckOut(undefined);
                    }
                  }}
                  placeholder="Select arrival date"
                  minDate={new Date()}
                  language={language}
                  showAvailability={true}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
                  {t("bookingsPage.form.checkOutLabel", "Departure")}
                </label>
                <DatePicker
                  selectedDate={checkOut}
                  onDateSelect={(date) => setCheckOut(date)}
                  placeholder="Select departure date"
                  disabled={!checkIn}
                  minDate={checkIn ? addDays(checkIn, 1) : new Date()}
                  language={language}
                  showAvailability={true}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
                  {t("bookingsPage.form.adultsLabel")}
                </label>
                <select
                  value={adults}
                  onChange={e => setAdults(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-300 px-4 text-base font-alegreya focus:border-slate-800 focus:ring-2 focus:ring-slate-200 transition"
                >
                  <option value="1">{t("bookingsPage.form.adultsValue.1")}</option>
                  <option value="2">{t("bookingsPage.form.adultsValue.2")}</option>
                  <option value="3">{t("bookingsPage.form.adultsValue.3")}</option>
                  <option value="4">{t("bookingsPage.form.adultsValue.4")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
                  {t("bookingsPage.form.childrenLabel")}
                </label>
                <select
                  value={children}
                  onChange={e => setChildren(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-300 px-4 text-base font-alegreya focus:border-slate-800 focus:ring-2 focus:ring-slate-200 transition"
                >
                  <option value="0">{t("bookingsPage.form.childrenValue.0")}</option>
                  <option value="1">{t("bookingsPage.form.childrenValue.1")}</option>
                  <option value="2">{t("bookingsPage.form.childrenValue.2")}</option>
                  <option value="3">{t("bookingsPage.form.childrenValue.3")}</option>
                </select>
              </div>
              <div>
                <button
                  onClick={handleSearch}
                  disabled={!checkIn || !checkOut || nights <= 0}
                  className="w-full h-12 bg-slate-800 text-white rounded-lg font-alegreya text-lg font-semibold shadow hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("bookingsPage.form.searchButton")}
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>
              </div>
            </div>
            {checkIn && checkOut && nights > 0 && (
              <div className="mt-8 p-4 bg-slate-100 rounded-lg text-slate-700 text-center font-alegreya text-base flex flex-col md:flex-row md:justify-between md:items-center">
                <span>
                  {nights} {nights === 1 ? t("bookingsPage.summary.nights_one") : t("bookingsPage.summary.nights_other")} • {adults} {adults === "1" ? t("bookingsPage.summary.adults_one") : t("bookingsPage.summary.adults_other")}
                  {children !== "0" && ` • ${children} ${children === "1" ? t("bookingsPage.summary.children_one") : t("bookingsPage.summary.children_other")}`}
                </span>
                <span className="text-slate-500 font-medium mt-2 md:mt-0">
                  {format(checkIn, "dd MMM", { locale: dateLocale })} - {format(checkOut, "dd MMM", { locale: dateLocale })}
                </span>
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
          
          <div className="max-w-7xl mx-auto">
            {/* Show rooms both before and after search */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Loading state when searching */}
              {showResults && Object.keys(roomAvailabilities).length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <div className="text-slate-600 font-alegreya">
                    🔍 {t("bookingsPage.checkingAvailability")}
                  </div>
                </div>
              )}
              
              {/* Show loading state */}
              {(loadingRooms || (roomIdParam && loadingSpecificRoom)) && (
                <div className="col-span-2 text-center py-8">
                  <div className="text-slate-600 font-alegreya">
                    ⏳ {roomIdParam ? t('loading.room') || 'Loading room...' : t('loading.rooms')}
                  </div>
                </div>
              )}
              
              {/* Show no rooms message */}
              {!loadingRooms && !loadingSpecificRoom && filteredRooms.length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <div className="text-slate-600 font-alegreya">
                    {roomIdParam ? (
                      <>
                        ❌ Room with ID "{roomIdParam}" not found. 
                        <Link href={`/${language}/bookings`} className="ml-2 text-[#8B4B5C] underline hover:text-[#7A4251]">
                          View all rooms
                        </Link>
                      </>
                    ) : (
                      <>❌ No rooms found. Check console for errors.</>
                    )}
                  </div>
                </div>
              )}
              
              {/* Show specific room banner when roomId is present */}
              {roomIdParam && specificRoom && (
                <div className="col-span-2 mb-4">
                  <div className="bg-[#8B4B5C]/10 border border-[#8B4B5C] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-[#8B4B5C]" />
                        <div>
                          <p className="text-sm font-medium text-slate-700 font-alegreya">
                            {t("bookingsPage.viewingRoom") || "Viewing specific room"}:
                          </p>
                          <p className="text-lg font-semibold text-[#8B4B5C] font-cormorant">
                            {specificRoom.name || t("bookingsPage.roomList.standardApartment")}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/${language}/rooms/${roomIdParam}`}
                        className="text-sm text-[#8B4B5C] hover:text-[#7A4251] underline font-alegreya"
                      >
                        {t("bookingsPage.viewRoomDetails") || "View Room Details"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Replace duplicate room cards with consolidated RoomSelection component */}
              {!loadingRooms && filteredRooms.length > 0 && (
                <div className="col-span-2">
                  <RoomSelection
                    onRoomSelect={handleRoomSelect}
                    guestCount={parseInt(adults) + parseInt(children)}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    roomImages={availableRooms[0]?.images || []}
                  />
                  

                </div>
              )}
              </div>
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
      
      {/* Development-only cache monitor */}
      <CacheMonitor />
      </>
    )
  }