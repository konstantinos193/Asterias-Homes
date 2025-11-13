"use client"

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ImageFile {
  id: string
  file?: File
  url: string
  name: string
  uploaded?: boolean
}

interface ImageUploadProps {
  images: ImageFile[]
  onImagesChange: (images: ImageFile[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  maxSizeMB = 5 
}: ImageUploadProps) {
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
    const newImages: ImageFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
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
    }
  }

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id)
    if (imageToRemove && !imageToRemove.uploaded) {
      URL.revokeObjectURL(imageToRemove.url)
    }
    onImagesChange(images.filter(img => img.id !== id))
  }

  const uploadImages = async () => {
    const unuploadedImages = images.filter(img => !img.uploaded && img.file)
    
    if (unuploadedImages.length === 0) return

    setUploading(true)

    try {
      for (const image of unuploadedImages) {
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

        // Update image with server URL
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://asterias-backend.onrender.com';
        const updatedImages = images.map(img => 
          img.id === image.id 
            ? { 
                ...img, 
                url: `${backendUrl}${uploadedFile.url}`,
                uploaded: true 
              }
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

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-[#0A4A4A] bg-[#0A4A4A]/5' 
            : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-3">
          <Upload className="h-8 w-8 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-700 font-alegreya">
              Σύρετε εικόνες εδώ ή{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#0A4A4A] hover:underline"
              >
                επιλέξτε αρχεία
              </button>
            </p>
            <p className="text-xs text-slate-500 font-alegreya">
              Μέγιστο {maxImages} εικόνες, έως {maxSizeMB}MB η καθεμία
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-700 font-alegreya">
              Εικόνες ({images.length}/{maxImages})
            </h4>
            {images.some(img => !img.uploaded) && (
              <Button
                type="button"
                onClick={uploadImages}
                disabled={uploading}
                size="sm"
                className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
              >
                {uploading ? 'Ανέβασμα...' : 'Ανέβασμα Εικόνων'}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group border border-slate-200 rounded-lg overflow-hidden bg-white"
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {!image.uploaded && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="text-xs text-white bg-black/50 px-2 py-1 rounded font-alegreya">
                        Δεν ανέβηκε
                      </span>
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
                
                <div className="p-2">
                  <p className="text-xs text-slate-600 truncate font-alegreya">
                    {image.name}
                  </p>
                  {image.uploaded && (
                    <span className="text-xs text-green-600 font-alegreya">✓ Ανέβηκε</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 