'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Wifi, Snowflake, Tv, Shield, Building, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getDiverseRoomImages, RoomImage } from '@/lib/image-utils'

interface RoomSelectionProps {
  onRoomSelect: (quantity: number, totalPrice: number) => void
  guestCount: number
  checkIn?: Date
  checkOut?: Date
  rooms?: any[] // Add rooms prop to receive backend data
}

export default function RoomSelection({ onRoomSelect, guestCount, checkIn, checkOut, rooms = [] }: RoomSelectionProps) {
  const { t } = useLanguage()
  const [showMultiRoomDialog, setShowMultiRoomDialog] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  
  // Calculate nights between check-in and check-out
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  const nights = calculateNights()
  
  // Single room type: Standard Apartment
  const roomType = {
    name: t('roomSelection.standardApartment'),
    description: t('roomSelection.description'),
    pricePerRoom: 85, // Base price per room per night
    capacity: 4, // Each room can accommodate up to 4 guests
    totalRooms: 7, // Total available rooms
    features: [
      t('roomSelection.feature1'),
      t('roomSelection.feature2'),
      t('roomSelection.feature3')
    ],
    amenities: { wifi: true, ac: true, tv: true, safe: true }
  }

  // Calculate how many rooms are needed for the guest count
  const calculateRequiredRooms = () => {
    return Math.ceil(guestCount / roomType.capacity)
  }

  // Calculate total price based on required rooms and nights
  const calculateTotalPrice = () => {
    const requiredRooms = calculateRequiredRooms()
    return roomType.pricePerRoom * requiredRooms * nights
  }

  // Calculate savings (if any)
  const calculateSavings = () => {
    const originalPrice = roomType.pricePerRoom * 1.1 // 10% markup
    const requiredRooms = calculateRequiredRooms()
    return Math.round((originalPrice - roomType.pricePerRoom) * requiredRooms * nights)
  }

  // Handle room selection
  const handleRoomSelect = () => {
    const requiredRooms = calculateRequiredRooms()
    const totalPrice = calculateTotalPrice()
    
    // Navigate to booking wizard with selected room data
    const searchParams = new URLSearchParams({
      rooms: requiredRooms.toString(),
      price: totalPrice.toString(),
      guests: guestCount.toString(),
      checkIn: checkIn ? checkIn.toISOString().split('T')[0] : '',
      checkOut: checkOut ? checkOut.toISOString().split('T')[0] : ''
    });
    
    // Get current language from URL or default to 'en'
    const currentLang = window.location.pathname.split('/')[1] || 'en';
    window.location.href = `/${currentLang}/book?${searchParams.toString()}`;
  }

  // Check if we have enough rooms for the guest count
  const requiredRooms = calculateRequiredRooms()
  const hasEnoughRooms = requiredRooms <= roomType.totalRooms

  // Show multi-room dialog when more than 4 guests
  useEffect(() => {
    if (guestCount > 4 && requiredRooms > 1) {
      setShowMultiRoomDialog(true)
    }
  }, [guestCount, requiredRooms])

  // Get organized room images for display
  const [roomImages, setRoomImages] = useState<RoomImage[]>([])
  
  // Load organized images on component mount
  useEffect(() => {
    const images = getDiverseRoomImages(4)
    setRoomImages(images)
  }, [])
  
  // Handle image click to show in modal
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Only show room selection when dates are selected */}
      {!checkIn || !checkOut ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('roomSelection.noDatesTitle')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('roomSelection.noDatesDescription')}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('roomSelection.title')}
            </h2>
            <p className="text-gray-600">
              {t('roomSelection.subtitle').replace('{guests}', guestCount.toString())}
            </p>
            
            {/* Guest count info */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-800">
                <Users className="h-5 w-5" />
                <span className="font-semibold">
                  {t('roomSelection.guestInfo').replace('{guests}', guestCount.toString()).replace('{rooms}', requiredRooms.toString()).replace('{capacity}', roomType.capacity.toString())}
                </span>
              </div>
              {!hasEnoughRooms && (
                <p className="text-red-600 text-sm mt-2">
                  {t('roomSelection.notEnoughRooms').replace('{required}', requiredRooms.toString()).replace('{available}', roomType.totalRooms.toString())}
                </p>
              )}
            </div>
          </div>

                    {/* Single Room Type Card */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building className="h-6 w-6 text-blue-600" />
                    {roomType.name}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{roomType.description}</p>
                  
                  {/* Features - dynamically scaled based on required rooms */}
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">{t('roomSelection.features')}</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {/* Dynamic bed features based on required rooms */}
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {requiredRooms === 1 ? (
                          t('roomSelection.feature1')
                        ) : (
                          t('roomSelection.feature1Multiple').replace('{quantity}', requiredRooms.toString())
                        )}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {t('roomSelection.feature2')}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {t('roomSelection.feature3')}
                      </li>
                      
                      {/* Dynamic features based on required rooms */}
                      {requiredRooms > 1 && (
                        <>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {requiredRooms === 2 ? t('roomSelection.featureMultiple2') : t('roomSelection.featureMultiple').replace('{quantity}', requiredRooms.toString())}
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {t('roomSelection.featureCapacity').replace('{total}', (requiredRooms * roomType.capacity).toString())}
                          </li>
                        </>
                      )}
                      
                      {/* Guest-specific features */}
                      {guestCount > roomType.capacity && (
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          {t('roomSelection.featureLargeGroup').replace('{guests}', guestCount.toString())}
                        </li>
                      )}
                    </ul>
                  </div>
                  
                                     {/* Price and savings */}
                   <div className="mt-4">
                     <div className="text-2xl font-bold text-blue-600">
                       €{calculateTotalPrice()}
                     </div>
                                           <div className="text-sm text-gray-600">
                        {nights === 1 
                          ? `${t('roomSelection.pricePerRoom').replace('{price}', roomType.pricePerRoom.toString())}`
                          : `${t('roomSelection.pricePerRoom').replace('{price}', roomType.pricePerRoom.toString())} × ${nights} ${nights === 1 ? 'night' : 'nights'}`
                        }
                      </div>
                     {calculateSavings() > 0 && (
                       <Badge className="mt-2">
                         {t('roomSelection.save').replace('{amount}', calculateSavings().toString())}
                       </Badge>
                     )}
                   </div>
                </div>
                
                                 {/* Room Images - positioned to the right side */}
                 <div className="ml-8 flex-shrink-0">
                   <div className="space-y-3">
                     {roomImages.length > 0 ? (
                       // Use organized room images
                       roomImages.map((image, index) => (
                         <div 
                           key={index} 
                           className="w-48 h-32 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                           onClick={() => handleImageClick(image.url)}
                         >
                           <img 
                             src={image.url} 
                             alt={image.description}
                             title={image.description}
                             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                             onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.src = '/placeholder.jpg';
                             }}
                           />
                         </div>
                       ))
                     ) : (
                       // Fallback to static images if no organized images
                       <>
                         <div 
                           className="w-48 h-32 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                           onClick={() => handleImageClick('/room-1.png')}
                         >
                           <img 
                             src="/room-1.png" 
                             alt="Standard Apartment View 1" 
                             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                             onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.src = '/placeholder.jpg';
                             }}
                           />
                         </div>
                         <div 
                           className="w-48 h-32 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                           onClick={() => handleImageClick('/room-2.png')}
                         >
                           <img 
                             src="/room-2.png" 
                             alt="Standard Apartment View 2" 
                             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                             onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.src = '/placeholder.jpg';
                             }}
                           />
                         </div>
                         <div 
                           className="w-48 h-32 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                           onClick={() => handleImageClick('/room-3.png')}
                         >
                           <img 
                             src="/room-3.png" 
                             alt="Standard Apartment View 3" 
                             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                             onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.src = '/placeholder.jpg';
                             }}
                           />
                         </div>
                       </>
                     )}
                   </div>
                 </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {/* Amenities */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">{t('roomSelection.amenities')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {roomType.amenities.wifi && (
                        <div className="flex items-center gap-2">
                          <Wifi className="h-5 w-5 text-green-600" />
                          <span className="text-sm text-gray-700">Free WiFi</span>
                        </div>
                      )}
                      {roomType.amenities.ac && (
                        <div className="flex items-center gap-2">
                          <Snowflake className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-gray-700">Air Conditioning</span>
                        </div>
                      )}
                      {roomType.amenities.tv && (
                        <div className="flex items-center gap-2">
                          <Tv className="h-5 w-5 text-purple-600" />
                          <span className="text-sm text-gray-700">Flat-screen TV</span>
                        </div>
                      )}
                      {roomType.amenities.safe && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-orange-600" />
                          <span className="text-sm text-gray-700">Safe</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Automatic room allocation info */}
                  <div className="mb-6">
                    {/* Show required rooms info only when multiple rooms are needed */}
                    {requiredRooms > 1 && (
                      <div className="text-center text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {t('roomSelection.guestInfo').replace('{guests}', guestCount.toString()).replace('{rooms}', requiredRooms.toString()).replace('{capacity}', roomType.capacity.toString())}
                          </span>
                        </div>
                        <div className="text-xs text-blue-700">
                          {t('roomSelection.multipleRoomsExplanation').replace('{rooms}', requiredRooms.toString())}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Select button */}
                  <Button
                    onClick={handleRoomSelect}
                    className="w-full"
                    size="lg"
                    disabled={!hasEnoughRooms}
                    variant={hasEnoughRooms ? "default" : "secondary"}
                  >
                    {hasEnoughRooms 
                      ? t('roomSelection.selectRooms')
                      : t('roomSelection.noRoomsAvailable')
                    }
                  </Button>
                  
                  {!hasEnoughRooms && (
                    <div className="text-center mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-700 text-sm font-medium">
                        {t('roomSelection.insufficientRooms')}
                      </p>
                      <p className="text-red-600 text-xs mt-1">
                        {t('roomSelection.insufficientRoomsExplanation')
                          .replace('{required}', requiredRooms.toString())
                          .replace('{available}', roomType.totalRooms.toString())
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

             {/* Multi-room notification dialog */}
       <Dialog open={showMultiRoomDialog} onOpenChange={setShowMultiRoomDialog}>
         <DialogContent className="sm:max-w-md">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2 text-orange-600">
               <AlertCircle className="h-5 w-5" />
               {t('roomSelection.multiRoomTitle')}
             </DialogTitle>
             <p className="text-gray-700">
               {t('roomSelection.multiRoomDescription')
                 .replace('{guests}', guestCount.toString())
                 .replace('{rooms}', requiredRooms.toString())
                 .replace('{capacity}', roomType.capacity.toString())
               }
             </p>
           </DialogHeader>
           <div className="flex justify-end gap-2 mt-4">
             <Button
               variant="outline"
               onClick={() => setShowMultiRoomDialog(false)}
             >
               {t('roomSelection.understand')}
             </Button>
           </div>
         </DialogContent>
       </Dialog>

               {/* Image modal popup */}
        {showImageModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setShowImageModal(false)}
          >
            <div className="w-full h-full flex justify-center items-center">
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt="Room Preview" 
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          </div>
        )}
    </div>
  )
}
