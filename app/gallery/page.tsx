"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const GalleryPage = () => {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Gallery images organized by categories
  const galleryImages = [
    // Village & Nature
    { src: "/about1.png", alt: "Koronisia village view", category: "village" },
    { src: "/about2.png", alt: "Scenic landscape", category: "nature" },
    { src: "/about3.png", alt: "Village atmosphere", category: "village" },
    { src: "/welcome-new.jpg", alt: "Welcome to Koronisia", category: "village" },
    { src: "/welcome12.png", alt: "Village charm", category: "village" },
    
    // Rooms & Accommodations
    { src: "/room1.png", alt: "Comfortable apartment", category: "rooms" },
    { src: "/room-1.png", alt: "Room interior", category: "rooms" },
    { src: "/room-2.png", alt: "Room view", category: "rooms" },
    { src: "/room-3.png", alt: "Room amenities", category: "rooms" },
    { src: "/room-4.png", alt: "Room details", category: "rooms" },
    { src: "/room-5.png", alt: "Room comfort", category: "rooms" },
    { src: "/room-6.png", alt: "Room atmosphere", category: "rooms" },
    
    // Activities & Experiences
    { src: "/offers/summer-escape.png", alt: "Summer activities", category: "activities" },
    { src: "/offers/family-fun.png", alt: "Family activities", category: "activities" },
    { src: "/offers/romantic-weekend.png", alt: "Romantic experiences", category: "activities" },
    { src: "/offers/weekend-getaway.png", alt: "Weekend adventures", category: "activities" },
    
    // Sunsets & Views
    { src: "/hero-1.png", alt: "Sunset over Koronisia", category: "sunset" },
    { src: "/hero-2.png", alt: "Gulf views", category: "sunset" },
    { src: "/hero-3.png", alt: "Seaside beauty", category: "sunset" },
    { src: "/parallax-bg.png", alt: "Scenic background", category: "sunset" },
    
    // Welcome & Atmosphere
    { src: "/welcome-1.png", alt: "Welcome atmosphere", category: "village" },
    { src: "/welcome-2.png", alt: "Village welcome", category: "village" },
  ]

  const [activeCategory, setActiveCategory] = useState("all")

  const filteredImages = activeCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory)

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return
    
    if (direction === "prev") {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1)
    } else {
      setSelectedImage(selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowLeft") navigateImage("prev")
    if (e.key === "ArrowRight") navigateImage("next")
  }

  return (
    <div className="bg-white text-slate-700">
      {/* Header Section */}
      <section
        className="relative h-[400px] md:h-[500px] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/about1.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-cormorant font-bold text-white mb-4">
            {t("gallery.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-alegreya max-w-2xl mx-auto">
            {t("gallery.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto py-12 md:py-20 px-4 mt-12">
        {/* Gallery Introduction */}
        <section className="mb-12 md:mb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-sm font-alegreya uppercase tracking-wider text-[#0A4A4A] mb-2">
              {t("gallery.subtitle")}
            </h2>
            <h3 className="text-3xl md:text-4xl font-cormorant font-light text-slate-800 mb-6">
              {t("gallery.title")}
            </h3>
            <p className="text-slate-600 leading-relaxed font-alegreya">
              {t("gallery.description")}
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-12 md:mb-20">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(t("gallery.categories")).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-3 rounded-lg font-alegreya transition-all duration-300 ${
                  activeCategory === key
                    ? "bg-[#0A4A4A] text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800 border border-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="mb-12 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-lg shadow-lg cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={400}
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                      <p className="font-alegreya text-sm font-medium">{t("gallery.viewImage")}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-t-0 border-slate-200">
                  <h3 className="text-lg font-cormorant font-light text-slate-800 mb-2">{image.alt}</h3>
                  <p className="text-slate-600 font-alegreya text-sm capitalize">{image.category}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500 font-alegreya text-lg">
                No images found for this category.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X size={32} />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage("prev")
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage("next")
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <ChevronRight size={40} />
            </button>

            {/* Image */}
            <div className="relative">
              <Image
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-alegreya text-sm">
              {selectedImage + 1} / {filteredImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryPage
