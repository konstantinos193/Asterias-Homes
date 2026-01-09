"use client"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

// Gallery data with translation keys
const galleryData = [
  {
    id: 7,
    src: "/gallery-sunset-1.jpeg",
    alt: "Serene sunset over Koronisia waters",
    translationKey: "tranquilSunset",
    category: "sunset"
  },
  {
    id: 8,
    src: "/gallery-sunset-2.jpeg",
    alt: "Rugged sunset with power lines over Koronisia",
    translationKey: "ruggedSunset",
    category: "sunset"
  },
  {
    id: 9,
    src: "/gallery-sunset-3.jpeg",
    alt: "Urban-coastal sunset over Mediterranean rooftops",
    translationKey: "urbanCoastalSunset",
    category: "sunset"
  },
  {
    id: 10,
    src: "/gallery-sunset-4.jpeg",
    alt: "Hillside sunset view with tree and residential area",
    translationKey: "hillsideSunset",
    category: "sunset"
  },
  {
    id: 11,
    src: "/gallery-landscape-1.jpeg",
    alt: "Daytime residential landscape with water view",
    translationKey: "daytimeResidential",
    category: "landscape"
  },
  {
    id: 12,
    src: "/gallery-landscape-2.jpeg",
    alt: "Stone bell tower view over Koronisia landscape",
    translationKey: "bellTowerView",
    category: "landscape"
  },
  {
    id: 13,
    src: "/gallery-landscape-3.jpeg",
    alt: "Elevated view of Koronisia coastal landscape",
    translationKey: "elevatedCoastalView",
    category: "landscape"
  },
                {
                id: 14,
                src: "/gallery-landscape-4.jpeg",
                alt: "Natural coastal perspective with sunset sky and rocky shoreline",
                translationKey: "naturalPerspective",
                category: "landscape"
              }
];

export default function GalleryPage() {
  const { t, language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<typeof galleryData[0] | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const categories = [
    { key: "all", label: t("gallery.categories.all") },
    { key: "village", label: t("gallery.categories.village") },
    { key: "nature", label: t("gallery.categories.nature") },
    { key: "sunset", label: t("gallery.categories.sunset") },
    { key: "activities", label: t("gallery.categories.activities") }
  ]

  const filteredImages = selectedCategory === "all" 
    ? galleryData 
    : galleryData.filter(img => img.category === selectedCategory)

  const openLightbox = (image: typeof galleryData[0], index: number) => {
    setSelectedImage(image)
    setCurrentImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredImages.length
    setCurrentImageIndex(nextIndex)
    setSelectedImage(filteredImages[nextIndex])
  }

  const previousImage = () => {
    const prevIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1
    setCurrentImageIndex(prevIndex)
    setSelectedImage(filteredImages[prevIndex])
  }

  return (
    <div className="bg-white text-slate-700">
      {/* Header Section */}
      <section
        className="relative h-[400px] md:h-[500px] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/gallery-sunset-1.jpeg')" }}
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
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-6 py-3 rounded-lg font-alegreya transition-all duration-300 ${
                  selectedCategory === category.key
                    ? "bg-[#0A4A4A] text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800 border border-slate-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="mb-12 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group overflow-hidden rounded-lg shadow-lg cursor-pointer"
                onClick={() => openLightbox(image, index)}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={400}
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                    loading={index < 3 ? "eager" : "lazy"}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                      <p className="font-alegreya text-sm font-medium">{t("gallery.viewImage")}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-t-0 border-slate-200">
                  <h3 className="text-lg font-cormorant font-light text-slate-800 mb-2">
                    {t(`gallery.images.${image.translationKey}.title`)}
                  </h3>
                  <p className="text-slate-600 font-alegreya text-sm mb-2">
                    {t(`gallery.images.${image.translationKey}.description`)}
                  </p>
                  <p className="text-slate-500 font-alegreya text-xs capitalize">
                    {t(`gallery.categories.${image.category}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500 font-alegreya text-lg">
                {t("gallery.noImagesFound")}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
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
              onClick={previousImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <ChevronRight size={40} />
            </button>

            {/* Image */}
            <div className="relative">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
                priority
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white text-center">
              <h3 className="font-cormorant font-semibold text-2xl mb-2">
                {t(`gallery.images.${selectedImage.translationKey}.title`)}
              </h3>
              <p className="text-lg opacity-90 mb-2 max-w-2xl mx-auto leading-relaxed font-alegreya">
                {t(`gallery.images.${selectedImage.translationKey}.description`)}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm opacity-75 font-alegreya">
                <span>{t(`gallery.images.${selectedImage.translationKey}.location`)}</span>
                <span>•</span>
                <span>{t(`gallery.images.${selectedImage.translationKey}.date`)}</span>
                <span>•</span>
                <span className="px-2 py-1 rounded-full bg-white/20">
                  {t(`gallery.categories.${selectedImage.category}`)}
                </span>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-alegreya">
              {t("gallery.imageCounter", undefined, { current: currentImageIndex + 1, total: filteredImages.length })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}