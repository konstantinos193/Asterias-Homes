import { useState } from 'react'
import { api } from '@/lib/api-client'

export function usePdfGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateBookingConfirmation = async (bookingId: string) => {
    setIsGenerating(true)
    setError(null)

    try {
      const blob = await api.pdf.generateBookingConfirmation(bookingId)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `booking-confirmation-${bookingId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to generate PDF')
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generateBookingConfirmation,
    isGenerating,
    error,
  }
}
