'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Users, Calendar, Euro, CheckCircle, Star, Loader2, AlertCircle } from 'lucide-react'
import BookingWizard from '@/components/booking-wizard'
import StripeProvider from '@/components/stripe-provider'
import { useRooms } from '@/hooks/api'
import { logger } from '@/lib/logger'
import { getBackendApiUrl } from '@/lib/backend-url'
import type { RoomData } from '@/data/rooms'

export default function BookPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  
  const [showBookingWizard, setShowBookingWizard] = useState(false)
  const [bookingData, setBookingData] = useState({
    rooms: 0,
    price: 0,
    guests: 0,
    checkIn: '',
    checkOut: ''
  })
  const [roomData, setRoomData] = useState<RoomData | null>(null)
  const [roomError, setRoomError] = useState<string | null>(null)
  const [availabilityWarning, setAvailabilityWarning] = useState<string | null>(null)
  
  // Use React Query hook for rooms data
  const { data: roomsData = [], isLoading: loadingRooms, error: roomsError } = useRooms()

  useEffect(() => {
    // Get booking data from URL parameters
    const rooms = parseInt(searchParams.get('rooms') || '0')
    const price = parseInt(searchParams.get('price') || '0')
    const guests = parseInt(searchParams.get('guests') || '0')
    const checkIn = searchParams.get('checkIn') || ''
    const checkOut = searchParams.get('checkOut') || ''

    setBookingData({ rooms, price, guests, checkIn, checkOut })
  }, [searchParams])
  
  useEffect(() => {
    if (loadingRooms || !roomsData.length || !bookingData.checkIn || !bookingData.checkOut) return
    
    // Get all standard rooms - check both name and nameKey for better compatibility
    const standardRooms = (roomsData as unknown as RoomData[]).filter((room: RoomData) => {
      const name = room.name?.toLowerCase() || ''
      const nameKey = room.nameKey?.toLowerCase() || ''
      return name.includes('standard') || nameKey.includes('standard') || name.includes('apartment')
    })
    
    if (standardRooms.length === 0) {
      // If no standard rooms found, use the first available room
      const firstRoom = roomsData[0] as unknown as RoomData
      if (firstRoom) {
        setRoomData(firstRoom)
        setAvailabilityWarning(null)
        setRoomError(null)
        logger.warn('No standard rooms found, using first available room', { roomId: firstRoom._id || firstRoom.id })
      } else {
        setRoomError('No rooms found in the system. Please contact us for assistance.')
        setRoomData(null)
      }
      return
    }

    // Check availability for each room and find an available one
    const checkAvailability = async () => {
      let availableRoom = null
      let checkedRooms = 0
      let failedChecks = 0
      
      for (const room of standardRooms) {
        try {
          // Check if this specific room is available for the selected dates
          const roomId = room._id || room.id
          const url = getBackendApiUrl(`/api/rooms/${roomId}/availability?checkIn=${bookingData.checkIn}&checkOut=${bookingData.checkOut}`)
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          checkedRooms++
          
          if (response.ok) {
            const availabilityData = await response.json()
            if (availabilityData.isAvailable) {
              availableRoom = room
              logger.info('Found available room', { roomId, checkIn: bookingData.checkIn, checkOut: bookingData.checkOut })
              break
            } else {
              logger.debug('Room not available', { roomId, checkIn: bookingData.checkIn, checkOut: bookingData.checkOut })
            }
          } else {
            failedChecks++
            const errorText = await response.text()
            logger.warn('Availability check returned error', { 
              roomId, 
              status: response.status, 
              error: errorText,
              checkIn: bookingData.checkIn, 
              checkOut: bookingData.checkOut 
            })
            // Continue to next room even if this one failed
          }
        } catch (err) {
          failedChecks++
          logger.error('Failed to check availability for room', err as Error, { 
            roomId: room._id || room.id,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut
          })
          // Continue to next room
        }
      }

      // If we found an available room, use it
      if (availableRoom) {
        setRoomData(availableRoom)
        setRoomError(null)
        setAvailabilityWarning(null)
      } else if (failedChecks === checkedRooms && checkedRooms > 0) {
        // All checks failed - this is a technical issue, but we'll still allow booking
        setRoomData(standardRooms[0])
        setRoomError(null)
        setAvailabilityWarning('Unable to verify room availability automatically. Please proceed with caution or contact us to confirm.')
        logger.error('All availability checks failed', undefined, { 
          checkedRooms, 
          failedChecks,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut
        })
      } else if (checkedRooms > 0) {
        // We checked rooms but none were available - show warning but allow booking
        setRoomData(standardRooms[0])
        setRoomError(null)
        setAvailabilityWarning('⚠️ All rooms appear to be booked for the selected dates. You can still proceed, but we recommend contacting us to confirm availability.')
        logger.info('No available rooms found', { 
          checkedRooms, 
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut
        })
      } else {
        // Fallback: use first room if we couldn't check any
        setRoomData(standardRooms[0])
        setRoomError(null)
        setAvailabilityWarning(null)
        logger.warn('Could not check availability, using first standard room', { roomId: standardRooms[0]._id || standardRooms[0].id })
      }
    }
    
    checkAvailability()
  }, [roomsData, loadingRooms, bookingData.checkIn, bookingData.checkOut])
  
  // Log errors if any
  if (roomsError) {
    logger.error('Error fetching rooms in book page', roomsError as Error)
    if (!roomError) {
      setRoomError('Failed to load room information')
    }
  }
  
  const isLoading = loadingRooms

  const handleStartBooking = () => {
    // Show the booking wizard instead of redirecting
    setShowBookingWizard(true)
  }

  const handleBackToSelection = () => {
    router.back()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f6f1] via-[#e8e2d5] to-[#dbe6e4]">
        <Card className="w-full max-w-md border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-[#0A4A4A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <CardTitle className="text-xl text-[#0A4A4A] font-alegreya font-semibold">
              {t('bookPage.loading', 'Loading Booking Details')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-6 font-alegreya">
              {t('bookPage.loadingMessage', 'Please wait while we prepare your booking summary...')}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state - only show after loading is complete
  if (!bookingData.rooms || !bookingData.price) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f6f1] via-[#e8e2d5] to-[#dbe6e4]">
        <Card className="w-full max-w-md border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-700 font-alegreya font-semibold">
              {t('bookPage.invalidData', 'Invalid Booking Data')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-6 font-alegreya">
              {t('bookPage.noDataFound', 'No booking information found. Please go back and select your room.')}
            </p>
            <Button 
              onClick={handleBackToSelection} 
              className="w-full px-8 py-3 bg-transparent border-2 border-[#0A4A4A] text-[#0A4A4A] hover:bg-[#0A4A4A] hover:text-white transition-colors font-alegreya"
            >
              {t('bookPage.backToSelection', 'Back to Room Selection')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Room data error state - only show for critical errors (no rooms found, etc.)
  if (roomError && !roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f6f1] via-[#e8e2d5] to-[#dbe6e4]">
        <Card className="w-full max-w-md border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-700 font-alegreya font-semibold">
              {t('bookPage.roomError', 'Room Data Error')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-6 font-alegreya">{roomError}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full px-8 py-3 bg-[#0A4A4A] text-white hover:bg-[#083a3a] transition-colors font-alegreya"
            >
              {t('bookPage.retry', 'Try Again')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show booking wizard if button was clicked
  if (showBookingWizard && roomData) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-cormorant font-light text-slate-800 mb-4">
                {t('bookPage.title', 'Complete Your Booking')}
              </h1>
              <div className="w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-4" />
              <p className="text-slate-600 font-alegreya text-lg">
                {t('bookPage.subtitle', 'Please complete the following steps to confirm your reservation.')}
              </p>
            </div>
            <StripeProvider>
              <BookingWizard 
                initialRoomId={roomData.id || roomData._id} 
                preFilledData={{
                  checkIn: bookingData.checkIn,
                  checkOut: bookingData.checkOut,
                  adults: Math.ceil(bookingData.guests / 2), // Estimate adults from total guests
                  children: Math.floor(bookingData.guests / 2), // Estimate children from total guests
                  rooms: bookingData.rooms,
                  price: bookingData.price,
                  guests: bookingData.guests
                }}
                language={lang} // Pass the current language to preserve context
              />
            </StripeProvider>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Background gradient matching your site */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#f8f6f1] via-[#e8e2d5] to-[#dbe6e4]" aria-hidden="true" />
      
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Success Message - matching your typography style */}
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-[#0A4A4A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-cormorant font-light text-slate-800 mb-4">
                {t('bookPage.title', 'Confirm Your Booking')}
              </h1>
              <div className="w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-6" />
              <p className="text-slate-600 font-alegreya max-w-2xl mx-auto text-lg">
                {t('bookPage.subtitle', 'You\'re just one step away from experiencing the luxury of Asterias Homes. Please review your booking details below.')}
              </p>
            </div>

            {/* Availability Warning Banner */}
            {availabilityWarning && (
              <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-amber-800 font-alegreya text-sm">
                      {availabilityWarning}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Booking Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-[#0A4A4A] text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-cormorant font-light text-white mb-2">
                      {t('bookPage.summary', 'Booking Summary')}
                    </CardTitle>
                    <p className="text-slate-200 font-alegreya">
                      {t('bookPage.summarySubtitle', 'Your selected accommodation details')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-cormorant font-light text-white">
                      €{bookingData.price}
                    </div>
                    <div className="text-slate-200 text-sm font-alegreya">
                      {t('bookPage.totalPrice', 'Total Price')}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                {/* Booking Details Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Left Column - Main Details */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-cormorant font-light text-slate-800 mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5 text-[#0A4A4A]" />
                        {t('bookPage.accommodationDetails', 'Accommodation Details')}
                      </h3>
                      <div className="space-y-3 font-alegreya">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t('bookPage.rooms', 'Rooms')}</span>
                          <span className="font-semibold text-slate-800">{bookingData.rooms}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t('bookPage.guests', 'Guests')}</span>
                          <span className="font-semibold text-slate-800">{bookingData.guests}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t('bookPage.roomType', 'Room Type')}</span>
                          <span className="font-semibold text-slate-800">{t('bookPage.standardApartment', 'Standard Apartment')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-cormorant font-light text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#0A4A4A]" />
                        {t('bookPage.stayDetails', 'Stay Details')}
                      </h3>
                      <div className="space-y-3 font-alegreya">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t('bookPage.checkIn', 'Check-in')}</span>
                          <span className="font-semibold text-slate-800">{bookingData.checkIn}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t('bookPage.checkOut', 'Check-out')}</span>
                          <span className="font-semibold text-slate-800">{bookingData.checkOut}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t('bookPage.nights', 'Nights')}</span>
                          <span className="font-semibold text-slate-800">
                            {Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Features & Amenities */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-cormorant font-light text-slate-800 mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-[#0A4A4A]" />
                        {t('bookPage.includedFeatures', 'Included Features')}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm font-alegreya">
                        <div className="flex items-center gap-2 text-slate-700">
                          <div className="w-2 h-2 bg-[#0A4A4A] rounded-full"></div>
                          {t('bookPage.freeWifi', 'Free WiFi')}
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <div className="w-2 h-2 bg-[#0A4A4A] rounded-full"></div>
                          {t('bookPage.airConditioning', 'Air Conditioning')}
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <div className="w-2 h-2 bg-[#0A4A4A] rounded-full"></div>
                          {t('bookPage.flatScreenTv', 'Flat-screen TV')}
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <div className="w-2 h-2 bg-[#0A4A4A] rounded-full"></div>
                          {t('bookPage.safe', 'Safe')}
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <div className="w-2 h-2 bg-[#0A4A4A] rounded-full"></div>
                          {t('bookPage.privateBathroom', 'Private Bathroom')}
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <div className="w-2 h-2 bg-[#0A4A4A] rounded-full"></div>
                          {t('bookPage.balcony', 'Balcony')}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-cormorant font-light text-slate-800 mb-4 flex items-center gap-2">
                        <Euro className="h-5 w-5 text-[#0A4A4A]" />
                        {t('bookPage.pricingBreakdown', 'Pricing Breakdown')}
                      </h3>
                      <div className="space-y-2 text-sm font-alegreya">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t('bookPage.pricePerRoom', 'Price per room/night')}</span>
                          <span className="text-slate-800">€85</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">{t('bookPage.rooms', 'Rooms')} × {t('bookPage.nights', 'Nights')}</span>
                          <span className="text-slate-800">{bookingData.rooms} × {Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24))}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 mt-3">
                          <div className="flex items-center justify-between font-semibold text-lg">
                            <span className="text-slate-800">{t('bookPage.total', 'Total')}</span>
                            <span className="text-slate-800">€{bookingData.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - matching your button style */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                  <Button 
                    onClick={handleBackToSelection} 
                    variant="outline" 
                    className="flex-1 px-8 py-3 bg-transparent border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-colors font-alegreya"
                  >
                    {t('bookPage.backButton', 'Back to Selection')}
                  </Button>
                  <Button 
                    onClick={handleStartBooking} 
                    className="flex-1 px-8 py-3 bg-[#0A4A4A] border-2 border-[#0A4A4A] text-white hover:bg-[#0A4A4A]/90 transition-colors font-alegreya"
                  >
                    {t('bookPage.startBookingButton', 'Start Booking')}
                  </Button>
                </div>

                {/* Info Text - matching your section style */}
                <div className="text-center mt-12 p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-[#0A4A4A]" />
                    <span className="font-medium text-[#0A4A4A] font-alegreya">
                      {t('bookPage.secureBooking', 'Secure & Easy Booking Process')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-alegreya">
                    {t('bookPage.info', 'Click "Start Booking" to proceed with your reservation. You will be guided through the booking process step by step with secure payment options.')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
