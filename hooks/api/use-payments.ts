// React Query hooks for payment operations
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

interface CreatePaymentIntentRequest {
  roomId: string
  checkIn: string
  checkOut: string
  adults: number
  children?: number
  currency?: string
}

interface CreatePaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

interface ConfirmPaymentRequest {
  paymentIntentId: string
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    language?: string
    specialRequests?: string
  }
  specialRequests?: string
}

interface ConfirmPaymentResponse {
  booking: {
    _id: string
    bookingNumber: string
    status: string
  }
  message: string
}

interface CreateCashBookingRequest {
  roomId: string
  checkIn: string
  checkOut: string
  adults: number
  children?: number
  totalAmount: number
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    language?: string
    specialRequests?: string
  }
  specialRequests?: string
}

interface CreateCashBookingResponse {
  booking: {
    _id: string
    bookingNumber: string
    status: string
  }
  message: string
}

/**
 * Hook for creating a Stripe payment intent
 */
export function useCreatePaymentIntent(): UseMutationResult<
  CreatePaymentIntentResponse,
  Error,
  CreatePaymentIntentRequest
> {
  return useMutation({
    mutationFn: async (data: CreatePaymentIntentRequest) =>
      api.payments.createPaymentIntent(data) as Promise<CreatePaymentIntentResponse>,
  })
}

/**
 * Hook for confirming a payment and creating a booking
 */
export function useConfirmPayment(): UseMutationResult<
  ConfirmPaymentResponse,
  Error,
  ConfirmPaymentRequest
> {
  return useMutation({
    mutationFn: async (data: ConfirmPaymentRequest) =>
      api.payments.confirmPayment(data) as Promise<ConfirmPaymentResponse>,
  })
}

/**
 * Hook for creating a cash booking (pay on arrival)
 */
export function useCreateCashBooking(): UseMutationResult<
  CreateCashBookingResponse,
  Error,
  CreateCashBookingRequest
> {
  return useMutation({
    mutationFn: async (data: CreateCashBookingRequest) =>
      api.payments.createCashBooking(data) as Promise<CreateCashBookingResponse>,
  })
}

