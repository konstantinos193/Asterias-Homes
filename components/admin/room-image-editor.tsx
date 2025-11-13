"use client"

import { useState, useRef } from 'react'
import { Upload, X, Trash2, Star, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { getBackendUrl } from '@/lib/backend-url'

interface ExistingImage {
  id: string
  url: string
  isExisting: true
}

interface NewImage {
  id: string
  file: File
  url: string
  name: string
  isExisting: false
  uploaded?: boolean
}

type RoomImage = ExistingImage | NewImage

interface RoomImageEditorProps {
  images: RoomImage[]
  onImagesChange: (images: RoomImage[]) => void
  maxImages?: number
  maxSizeMB?: number
  onDeleteExisting?: (imageUrl: string) => void
}

export default function RoomImageEditor({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  maxSizeMB = 5,
  onDeleteExisting
}: RoomImageEditorProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files)
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} δεν είναι έγκυρη εικόνα`)
        return false
      }
      
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`${file.name} είναι πολύ μεγάλο. Μέγιστο μέγεθος: ${maxSizeMB}MB`)
        return false
      }
      
      return true
    })

    // Check total count
    if (images.length + validFiles.length > maxImages) {
      alert(`Μπορείτε να ανεβάσετε μέγιστο ${maxImages} εικόνες`)
      return
    }

    // Create image objects
    const newImages: NewImage[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isExisting: false,
      uploaded: false
    }))

    onImagesChange([...images, ...newImages])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files)
      // Reset input so same file can be selected again
      e.target.value = ''
    }
  }

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id)
    
    if (imageToRemove) {
      // If it's a new image (not uploaded), revoke the object URL
      if (!imageToRemove.isExisting && 'uploaded' in imageToRemove && !imageToRemove.uploaded) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      
      // If it's an existing image, call the delete callback
      if (imageToRemove.isExisting && onDeleteExisting) {
        onDeleteExisting(imageToRemove.url)
      }
    }
    
    onImagesChange(images.filter(img => img.id !== id))
  }

  const uploadNewImages = async () => {
    const newImages = images.filter((img): img is NewImage => 
      !img.isExisting && 'file' in img && !img.uploaded && !!img.file
    )
    
    if (newImages.length === 0) return

    setUploading(true)

    try {
      for (const image of newImages) {
        if (!image.file) continue

        const formData = new FormData()
        formData.append('images', image.file)

        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const result = await response.json()
        const uploadedFile = result.files[0]
        const backendUrl = getBackendUrl()

        // Update image with server URL
        const updatedImages = images.map(img => 
          img.id === image.id 
            ? { 
                ...img, 
                url: `${backendUrl}${uploadedFile.url}`,
                uploaded: true,
                isExisting: false
              } as NewImage
            : img
        )
        onImagesChange(updatedImages)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Σφάλμα κατά την ανέβασμα των εικόνων')
    } finally {
      setUploading(false)
    }
  }

  const hasUnuploadedImages = images.some(img => 
    !img.isExisting && 'file' in img && 'uploaded' in img && !img.uploaded && !!img.file
  )

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => {
          const isBanner = index === 0
          return (
            <div key={image.id} className="relative group">
              <div className="relative h-40 rounded-sm overflow-hidden bg-slate-100 border-2 border-transparent group-hover:border-[#0A4A4A] transition-colors">
                <Image
                  src={image.url}
                  alt={image.isExisting ? 'Room image' : ('name' in image ? image.name : 'Room image')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {isBanner && (
                  <div className="absolute top-2 left-2 bg-[#0A4A4A] text-white px-2 py-1 rounded text-xs font-alegreya flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Κύρια Εικόνα
                  </div>
                )}
                {!image.isExisting && 'uploaded' in image && !image.uploaded && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="text-xs text-white bg-black/50 px-2 py-1 rounded font-alegreya">
                      Δεν ανέβηκε
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...images]
                      const [movedImage] = newImages.splice(index, 1)
                      newImages.unshift(movedImage)
                      onImagesChange(newImages)
                    }}
                    className="p-1 bg-[#0A4A4A] text-white rounded hover:bg-[#083a3a]"
                    title="Ορισμός ως κύρια εικόνα"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Διαγραφή"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const newImages = [...images]
                    const temp = newImages[index]
                    newImages[index] = newImages[index - 1]
                    newImages[index - 1] = temp
                    onImagesChange(newImages)
                  }}
                  className="absolute bottom-2 left-2 p-1 bg-slate-700/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700"
                  title="Μετακίνηση προς τα πάνω"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              )}
            </div>
          )
        })}
        
        {/* Upload Area */}
        {images.length < maxImages && (
          <div
            className={`relative h-40 border-2 border-dashed rounded-sm flex flex-col items-center justify-center text-slate-500 hover:text-[#0A4A4A] hover:border-[#0A4A4A] transition-colors cursor-pointer ${
              isDragging ? 'border-[#0A4A4A] bg-[#0A4A4A]/5' : 'border-slate-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
            <Upload className="h-8 w-8 mb-2" />
            <span className="text-sm font-alegreya">Προσθήκη Εικόνας</span>
          </div>
        )}
      </div>

      {/* Upload Button for New Images */}
      {hasUnuploadedImages && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={uploadNewImages}
            disabled={uploading}
            className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
          >
            {uploading ? 'Ανέβασμα...' : 'Ανέβασμα Νέων Εικόνων'}
          </Button>
        </div>
      )}
    </div>
  )
}

