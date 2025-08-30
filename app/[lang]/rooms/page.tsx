"use client"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { getRooms } from "@/lib/api"
import { Room } from "@/types/booking"
import RoomCard from "@/components/room-card"
import { Filter, Search, MapPin, Star } from "lucide-react"

export default function RoomsPage() {
  const { t, language } = useLanguage()
  const [rooms, setRooms] = useState<Room[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  useEffect(() => {
    getRooms().then((rooms) => {
      if (rooms) {
        setRooms(rooms)
        setFilteredRooms(rooms)
      }
    })
  }, [])

  // Filter rooms based on search and filters
  useEffect(() => {
    let filtered = rooms.filter((room) => {
      const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1]
      
      const matchesFeatures = selectedFeatures.length === 0 || 
                            selectedFeatures.some(feature => room.features.includes(feature))
      
      return matchesSearch && matchesPrice && matchesFeatures
    })
    
    setFilteredRooms(filtered)
  }, [rooms, searchTerm, priceRange, selectedFeatures])

  const availableFeatures = Array.from(new Set(rooms.flatMap(room => room.features)))

  return (
    <main className="bg-[#A9AEA2]/30 text-slate-800 pt-20 sm:pt-24 font-alegreya">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto container-mobile text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-cormorant font-bold mb-3 sm:mb-4">{t("rooms.pageTitle")}</h1>
          <div className="w-12 sm:w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-sm sm:text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
            {t("rooms.pageDescription")}
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-6 sm:py-8 bg-white/60">
        <div className="container mx-auto container-mobile">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("rooms.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#8B4B5C] focus:border-transparent transition-colors text-sm sm:text-base"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("rooms.priceRange")}: €{priceRange[0]} - €{priceRange[1]}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Features Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("rooms.features")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {availableFeatures.map((feature) => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeatures([...selectedFeatures, feature])
                          } else {
                            setSelectedFeatures(selectedFeatures.filter(f => f !== feature))
                          }
                        }}
                        className="h-4 w-4 text-[#8B4B5C] focus:ring-[#8B4B5C] border-slate-300 rounded"
                      />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || priceRange[0] > 0 || priceRange[1] < 500 || selectedFeatures.length > 0) && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setPriceRange([0, 500])
                    setSelectedFeatures([])
                  }}
                  className="text-sm text-[#8B4B5C] hover:text-[#7A4251] transition-colors underline"
                >
                  {t("rooms.clearFilters")}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="py-4 sm:py-6">
        <div className="container mx-auto container-mobile">
          <div className="flex items-center justify-between">
            <p className="text-sm sm:text-base text-slate-600">
              {t("rooms.showingResults", { count: filteredRooms.length, total: rooms.length })}
            </p>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>{t("rooms.qualityAssured")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto container-mobile">
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  name={room.name}
                  description={room.description}
                  image={room.images[0]}
                  price={`${room.price}€`}
                  features={room.features}
                  nameKey={room.nameKey}
                  descriptionKey={room.descriptionKey}
                  featureKeys={room.featureKeys}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <MapPin className="h-16 w-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                {t("rooms.noResultsTitle")}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6">
                {t("rooms.noResultsDescription")}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setPriceRange([0, 500])
                  setSelectedFeatures([])
                }}
                className="bg-[#8B4B5C] text-white px-6 py-3 rounded-md hover:bg-[#7A4251] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-sm sm:text-base"
              >
                {t("rooms.resetFilters")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 sm:py-12 md:py-16 bg-white/80">
        <div className="container mx-auto container-mobile text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-cormorant font-semibold mb-4 sm:mb-6">
            {t("rooms.ctaTitle")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t("rooms.ctaDescription")}
          </p>
          <a
            href={`/${language}/contact`}
            className="inline-block bg-[#8B4B5C] text-white px-6 sm:px-8 py-3 rounded-md hover:bg-[#7A4251] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-sm sm:text-base"
          >
            {t("rooms.contactUs")}
          </a>
        </div>
      </section>
    </main>
  )
} 