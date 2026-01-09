import roomImagesData from '@/data/room-images.json'

export interface RoomImage {
  url: string
  description: string
  category: string
}

export interface RoomType {
  type: string
  description: string
  images: RoomImage[]
}

export interface StandardApartment {
  id: string
  name: string
  description: string
  capacity: number
  totalRooms: number
  roomTypes: RoomType[]
  features: string[]
  displayLogic: string
}

export interface ImageData {
  houses: any[]
  standardApartments: StandardApartment
  additionalViews: {
    id: string
    description: string
    images: RoomImage[]
  }
  metadata: {
    totalImages: number
    organizedImages: number
    remainingImages: number
    lastUpdated: string
    description: string
    usage: Record<string, string>
  }
}

// Get the organized image data
export const getRoomImages = (): ImageData => {
  return roomImagesData as ImageData
}

// Get images for a specific room type/category
export const getImagesByCategory = (category: string): RoomImage[] => {
  const data = getRoomImages()
  const standardApartment = data.standardApartments
  
  const categoryImages: RoomImage[] = []
  
  standardApartment.roomTypes.forEach(roomType => {
    if (roomType.type === category) {
      categoryImages.push(...roomType.images)
    }
  })
  
  return categoryImages
}

// Get best images for room selection (3-4 images from different categories)
export const getBestRoomSelectionImages = (count: number = 4): RoomImage[] => {
  const data = getRoomImages()
  const standardApartment = data.standardApartments
  
  const bestImages: RoomImage[] = []
  
  // Priority categories - one image from each to show variety
  const priorityCategories = ['bedroom-main', 'kitchen', 'bathroom', 'exterior-views']
  
  priorityCategories.forEach(category => {
    const categoryImages = getImagesByCategory(category)
    if (categoryImages.length > 0) {
      bestImages.push(categoryImages[0]) // Take the first (best) image from each category
    }
  })
  
  // If we need more images, add from other categories but avoid bedroom duplicates
  if (bestImages.length < count) {
    const remainingCategories = ['living-area', 'amenities']
    
    remainingCategories.forEach(category => {
      if (bestImages.length < count) {
        const categoryImages = getImagesByCategory(category)
        if (categoryImages.length > 0) {
          bestImages.push(categoryImages[0])
        }
      }
    })
  }
  
  // Ensure we don't show more than requested
  return bestImages.slice(0, count)
}

// Get all images for a specific room type
export const getAllImagesForRoomType = (roomType: string): RoomImage[] => {
  return getImagesByCategory(roomType)
}

// Get images for checkout confirmation (showing what the user is booking)
export const getCheckoutConfirmationImages = (): RoomImage[] => {
  return getBestRoomSelectionImages(6) // Show more images during checkout
}

// Get images by specific categories for detailed view
export const getImagesByCategories = (categories: string[]): RoomImage[] => {
  const allImages: RoomImage[] = []
  
  categories.forEach(category => {
    const categoryImages = getImagesByCategory(category)
    allImages.push(...categoryImages)
  })
  
  return allImages
}

// Get random images for variety (useful for room selection)
export const getRandomRoomImages = (count: number = 3): RoomImage[] => {
  const data = getRoomImages()
  const standardApartment = data.standardApartments
  
  const allImages: RoomImage[] = []
  
  standardApartment.roomTypes.forEach(roomType => {
    allImages.push(...roomType.images)
  })
  
  // Shuffle and return random images
  const shuffled = allImages.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Get images for specific use cases
export const getImagesForUseCase = (useCase: 'roomSelection' | 'roomDetails' | 'checkout' | 'admin'): RoomImage[] => {
  switch (useCase) {
    case 'roomSelection':
      return getBestRoomSelectionImages(4)
    case 'roomDetails':
      return getBestRoomSelectionImages(8)
    case 'checkout':
      return getCheckoutConfirmationImages()
    case 'admin':
      return getBestRoomSelectionImages(6)
    default:
      return getBestRoomSelectionImages(4)
  }
}

// Get diverse room images ensuring no duplicates from same area
export const getDiverseRoomImages = (count: number = 4): RoomImage[] => {
  const data = getRoomImages()
  const standardApartment = data.standardApartments
  
  const diverseImages: RoomImage[] = []
  
  // Define distinct areas to avoid duplicates
  const distinctAreas = [
    'bedroom-main',      // Main bedroom (double bed)
    'kitchen',           // Kitchen area
    'bathroom',          // Bathroom
    'exterior-views',    // Balcony/outside view
    'living-area'        // Living/dining area
  ]
  
  // Take one image from each distinct area
  distinctAreas.forEach(area => {
    if (diverseImages.length < count) {
      const areaImages = getImagesByCategory(area)
      if (areaImages.length > 0) {
        diverseImages.push(areaImages[0])
      }
    }
  })
  
  // If we still need more images, add from amenities
  if (diverseImages.length < count) {
    const amenityImages = getImagesByCategory('amenities')
    if (amenityImages.length > 0) {
      diverseImages.push(amenityImages[0])
    }
  }
  
  return diverseImages.slice(0, count)
}