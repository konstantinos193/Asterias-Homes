"use client"

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Trash2, Star, GripVertical, Loader2, AlertCircle, Check, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import NextImage from 'next/image'
import { getBackendUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

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
  progress?: number
  error?: string
}

type RoomImage = ExistingImage | NewImage

interface RoomImageEditorProps {
  images: RoomImage[]
  onImagesChange: (images: RoomImage[]) => void
  maxImages?: number
  maxSizeMB?: number
  onDeleteExisting?: (imageUrl: string) => void
}

export default function ModernRoomImageEditor({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  maxSizeMB = 10,
  onDeleteExisting
}: RoomImageEditorProps) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Compress image before upload
  const compressImage = useCallback(async (file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/jpeg',
          quality
        )
      }
      
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const handleFileSelect = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files)
    
    // Validate and process files
    const processedFiles = await Promise.all(
      fileArray.map(async (file) => {
        // Check file type
        if (!file.type.startsWith('image/')) {
          return { file, error: `${file.name} δεν είναι έγκυρη εικόνα` }
        }
        
        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          return { file, error: `${file.name} είναι πολύ μεγάλο. Μέγιστο μέγεθος: ${maxSizeMB}MB` }
        }
        
        // Compress image
        try {
          const compressedFile = await compressImage(file)
          return { file: compressedFile, error: null }
        } catch (error) {
          logger.error('Image compression error', error instanceof Error ? error : new Error(String(error)))
          return { file, error: null } // Fall back to original file
        }
      })
    )
    
    // Filter out files with errors and show alerts
    const validFiles = processedFiles.filter(({ error }) => !error).map(({ file }) => file)
    const errors = processedFiles.filter(({ error }) => error).map(({ error }) => error)
    
    if (errors.length > 0) {
      // Show errors as toast notifications
      errors.forEach(error => {
        toast({
          title: "Σφάλμα αρχείου",
          description: error,
          variant: "destructive"
        })
      })
    }
    
    // Check total count
    if (images.length + validFiles.length > maxImages) {
      toast({
        title: "Όριο εικόνων",
        description: `Μπορείτε να ανεβάσετε μέγιστο ${maxImages} εικόνες`,
        variant: "destructive"
      })
      return
    }
    
    // Create image objects with initial progress
    const newImages: NewImage[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isExisting: false,
      uploaded: false,
      progress: 0
    }))
    
    onImagesChange([...images, ...newImages])
    
    // Start uploading immediately
    uploadImages(newImages)
  }, [images, maxImages, maxSizeMB, compressImage, onImagesChange])

  const uploadImages = useCallback(async (newImages: NewImage[]) => {
    for (const image of newImages) {
      try {
        const formData = new FormData()
        formData.append('images', image.file)
        
        // Create XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest()
        
        // Track progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            onImagesChange(
              images.map(img => 
                img.id === image.id 
                  ? { ...img, progress } 
                  : img
              )
            )
          }
        })
        
        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText)
              const uploadedFile = result.files[0]
              
              onImagesChange(
                images.map(img => 
                  img.id === image.id 
                    ? { 
                        ...img, 
                        url: uploadedFile.url.startsWith('http') 
                          ? uploadedFile.url 
                          : `${getBackendUrl()}${uploadedFile.url}`,
                        uploaded: true,
                        progress: 100
                      } as NewImage
                    : img
                )
              )
            } catch (error) {
              onImagesChange(
                images.map(img => 
                  img.id === image.id 
                    ? { ...img, error: 'Upload failed' } 
                    : img
                )
              )
            }
          } else {
            onImagesChange(
              images.map(img => 
                img.id === image.id 
                  ? { ...img, error: 'Upload failed' } 
                  : img
              )
            )
          }
        })
        
        // Handle error
        xhr.addEventListener('error', () => {
          onImagesChange(
            images.map(img => 
              img.id === image.id 
                ? { ...img, error: 'Network error' } 
                : img
            )
          )
        })
        
        // Send request
        xhr.open('POST', '/api/images/upload')
        xhr.withCredentials = true
        xhr.send(formData)
        
      } catch (error) {
        logger.error('Upload error', error instanceof Error ? error : new Error(String(error)))
        onImagesChange(
          images.map(img => 
            img.id === image.id 
              ? { ...img, error: 'Upload failed' } 
              : img
          )
        )
      }
    }
  }, [onImagesChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev - 1)
    if (dragCounter === 1) {
      setIsDragging(false)
    }
  }, [dragCounter])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }, [handleFileSelect])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files)
      // Reset input so same file can be selected again
      e.target.value = ''
    }
  }, [handleFileSelect])

  const removeImage = useCallback((id: string) => {
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
  }, [images, onDeleteExisting, onImagesChange])

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }, [images, onImagesChange])

  const setAsBanner = useCallback((index: number) => {
    const newImages = [...images]
    const [bannerImage] = newImages.splice(index, 1)
    newImages.unshift(bannerImage)
    onImagesChange(newImages)
  }, [images, onImagesChange])

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
            isDragging 
              ? "border-[#0A4A4A] bg-[#0A4A4A]/5" 
              : "border-slate-300 hover:border-[#0A4A4A] hover:bg-slate-50"
          )}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
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
          <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-slate-700">Drag & Drop εικόνες εδώ</h3>
            <p className="text-sm text-slate-500">ή κάντε κλικ για να επιλέξετε αρχεία</p>
            <p className="text-xs text-slate-400">Μέγιστο μέγεθος: {maxSizeMB}MB • Μέγιστο: {maxImages} εικόνες</p>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => {
          const isBanner = index === 0
          const isUploading = !image.isExisting && 'progress' in image && image.progress !== undefined && image.progress < 100
          const hasError = !image.isExisting && 'error' in image && image.error
          
          return (
            <div key={image.id} className="group relative">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border-2 border-transparent transition-all duration-200">
                {/* Image */}
                <NextImage
                  src={image.url}
                  alt={image.isExisting ? 'Room image' : ('name' in image ? image.name : 'Room image')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Overlay for uploading/error states */}
                {(isUploading || hasError) && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    {isUploading ? (
                      <div className="text-center text-white p-4">
                        <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                        <p className="text-sm">Ανέβασμα... {image.progress}%</p>
                        <Progress value={image.progress} className="w-32 mt-2" />
                      </div>
                    ) : (
                      <div className="text-center text-white p-4">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Σφάλμα ανεβάσματος</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Banner indicator */}
                {isBanner && (
                  <div className="absolute top-2 left-2 bg-[#0A4A4A] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Κύρια Εικόνα
                  </div>
                )}
                
                {/* Hover controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(image.url)}
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    title="Προεπισκόπηση"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  {!isBanner && (
                    <button
                      type="button"
                      onClick={() => setAsBanner(index)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      title="Ορισμός ως κύρια εικόνα"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-500 transition-colors"
                    title="Διαγραφή"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Reorder controls */}
              <div className="flex justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-1 bg-slate-200 rounded hover:bg-slate-300 transition-colors"
                    title="Μετακίνηση προς τα πάνω"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-1 bg-slate-200 rounded hover:bg-slate-300 transition-colors"
                    title="Μετακίνηση προς τα κάτω"
                  >
                    <GripVertical className="h-4 w-4 rotate-180" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <NextImage
              src={previewImage}
              alt="Preview"
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
