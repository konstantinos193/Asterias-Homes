'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from './button'

interface ImageGalleryProps {
  images: Array<{
    url: string
    description: string
    category?: string
  }>
  maxDisplay?: number
  showModal?: boolean
  className?: string
}

export function ImageGallery({ 
  images, 
  maxDisplay = 4, 
  showModal = true, 
  className = "" 
}: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  if (!images || images.length === 0) {
    return null
  }

  const displayedImages = images.slice(0, maxDisplay)
  const hasMoreImages = images.length > maxDisplay

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openModal = (index: number) => {
    if (showModal) {
      setCurrentImageIndex(index)
      setShowImageModal(true)
    }
  }

  return (
    <>
      <div className={`grid grid-cols-2 gap-2 ${className}`}>
        {displayedImages.map((image, index) => (
          <div
            key={index}
            className={`relative cursor-pointer group overflow-hidden rounded-lg ${
              index === 0 ? 'col-span-2 row-span-2' : ''
            }`}
            onClick={() => openModal(index)}
          >
            <img
              src={image.url}
              alt={image.description}
              title={image.description}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder.jpg'
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            {index === 0 && hasMoreImages && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                +{images.length - maxDisplay} more
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {showModal && showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            {/* Close button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Current image */}
            <img
              src={images[currentImageIndex].url}
              alt={images[currentImageIndex].description}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Image description */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded text-sm">
              {images[currentImageIndex].description}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
