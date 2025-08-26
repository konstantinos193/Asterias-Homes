"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
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
import { calendarAPI } from "@/lib/api"
import RoomSelection from "@/components/room-selection"

export default function BookingsPage() {
  const { t, language } = useLanguage()
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [adults, setAdults] = useState("2")
  const [children, setChildren] = useState("0")
  const [showResults, setShowResults] = useState(false)
  // Remove filter states since all rooms are identical
  const [compareRooms, setCompareRooms] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomAvailabilities, setRoomAvailabilities] = useState<Record<string, number>>({});
  const [availability, setAvailability] = useState<Record<string, any>>({});


  const dateLocale = language === "el" ? el : enUS
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  // Fetch rooms from backend - only once on mount
  useEffect(() => {
    async function fetchRooms() {
      setLoadingRooms(true);
      try {
        console.log('Fetching rooms from backend...');
        const res = await fetch("https://asterias-backend.onrender.com/api/rooms");
        const data = await res.json();
        console.log('Backend rooms response:', data);
        console.log('Backend rooms data structure:', {
          hasRooms: !!data.rooms,
          roomsType: typeof data.rooms,
          roomsLength: data.rooms?.length,
          firstRoom: data.rooms?.[0],
          fullResponse: data
        });
        setRooms(data.rooms || data); // Try both data.rooms and data directly
      } catch (e) {
        console.error('Error fetching rooms:', e);
        setRooms([]);
      }
      setLoadingRooms(false);
    }
    fetchRooms();
  }, []); // Empty dependency array - only run once



  // Handle room selection from RoomSelection component
  const handleRoomSelect = (quantity: number, totalPrice: number) => {
    console.log(`Selected ${quantity} rooms for €${totalPrice}`);
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
    
    return rooms.map((room) => ({
      ...room,
              name: t("bookingsPage.roomList.standardApartment"),
      description: t("bookingsPage.roomList.roomDescription"),
      amenities: room.amenities ? Object.keys(room.amenities).filter(key => room.amenities[key]) : [
        'WiFi',
        'Air Conditioning', 
        'TV',
        'Private Bathroom',
        'Balcony',
        'Safe'
      ],
      features: room.features || [
        'Entire Place',
        'Free Parking',
        'Breakfast Included',
        'Private Bathroom',
        'Free Wifi',
        'Shower',
        'Air Conditioning',
        'Flat-screen TV',
        'Kitchenette',
        'Non-smoking'
      ],
      bedType: t("bookingsPage.roomList.bedConfiguration"),
      view: 'Garden or Sea View',
      bathroom: 'Private Bathroom with Shower',
      image: room.image || (room.images && room.images[0]) || "/placeholder.svg",
      totalRooms: room.totalRooms || 7, // We have 7 identical rooms
      rating: room.rating || 4.8,
      reviews: room.reviewCount || 25,
      price: room.price || 85,
      originalPrice: room.originalPrice || room.price || 85,
      size: room.size || 35,
      id: room._id || room.id,
      // Proper room configuration for 7 identical standard rooms
      maxGuests: 4, // Each room can accommodate 4 guests (1 double + 2 single beds)
      available: true, // All rooms are available by default
      availableCount: room.availableCount || 0 // Add availableCount to the room object
    }));
  }, [rooms, t]); // Only recalculate when rooms or t function changes

  // Fetch availability for list view when search is performed - only when needed
  useEffect(() => {
    if (!checkIn || !checkOut || !showResults || !availableRooms.length) return;
    
    async function fetchAvailabilities() {
      console.log('Fetching availabilities for search...');
      const checkInStr = format(checkIn, "yyyy-MM-dd");
      const checkOutStr = format(checkOut, "yyyy-MM-dd");
      const newAvailabilities: Record<string, number> = {};
      
      try {
        await Promise.all(
          availableRooms.map(async (room) => {
            try {
              console.log('FETCHING AVAILABILITY', `https://asterias-backend.onrender.com/api/bookings/availability?roomId=${room.id}&checkIn=${checkInStr}&checkOut=${checkOutStr}`);
              const res = await fetch(
                `https://asterias-backend.onrender.com/api/bookings/availability?roomId=${room.id}&checkIn=${checkInStr}&checkOut=${checkOutStr}`,
                {
                  headers: {
                    'x-api-key': apiKey,
                  },
                },
              );
              const data = await res.json();
              newAvailabilities[room.id] = data.available;
              console.log('Fetched availability for', room.id, data);
            } catch (error) {
              console.error(`Error fetching availability for room ${room.id}:`, error);
              // Fallback to default availability
              newAvailabilities[room.id] = room.totalRooms || 1;
            }
          })
        );
        setRoomAvailabilities(newAvailabilities);
        console.log('All availabilities:', newAvailabilities);
      } catch (error) {
        console.error('Error fetching availabilities:', error);
        // Fallback to default availability
        availableRooms.forEach(room => {
          newAvailabilities[room.id] = room.totalRooms || 1;
        });
        setRoomAvailabilities(newAvailabilities);
      }
    }
    
    fetchAvailabilities();
  }, [checkIn, checkOut, showResults, availableRooms.length]); // Only depend on actual values, not objects

  // Fetch calendar availability for all rooms - optimized
  useEffect(() => {
    if (!availableRooms.length) return;
    
    async function fetchCalendarAvailability() {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      try {
        console.log('Fetching aggregated calendar availability for month:', currentMonth, 'year:', currentYear);
        const data = await calendarAPI.getCalendarAvailability(currentMonth, currentYear);
        console.log('Calendar availability response:', data);
        
        // Set availability data
        setAvailability(data.availability || {});
      } catch (error) {
        console.error('Error fetching calendar availability:', error);
        setAvailability({});
      }
    }
    
    fetchCalendarAvailability();
    
    // Set up real-time updates every 10 minutes instead of 5
    const interval = setInterval(fetchCalendarAvailability, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [availableRooms.length]); // Only depend on length, not the array itself

  const nights = checkIn && checkOut
    ? differenceInDays(startOfDay(checkOut), startOfDay(checkIn))
    : 0;

  const handleSearch = () => {
    console.log("handleSearch", { checkIn, checkOut, nights });
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
                    🔍 Checking room availability for your dates...
                  </div>
                </div>
              )}
              
              {/* Show loading state */}
              {loadingRooms && (
                <div className="col-span-2 text-center py-8">
                  <div className="text-slate-600 font-alegreya">
                    ⏳ {t('loading.rooms')}
                  </div>
                </div>
              )}
              
              {/* Show no rooms message */}
              {!loadingRooms && filteredRooms.length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <div className="text-slate-600 font-alegreya">
                    ❌ No rooms found. Check console for errors.
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
                    rooms={rooms}
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
      </>
    )
  }
         