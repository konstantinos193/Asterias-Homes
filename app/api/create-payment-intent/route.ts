import { NextResponse } from "next/server"
import { allRoomsData } from "@/data/rooms"
import { differenceInDays } from "date-fns"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 })
    }

    // Import Stripe only when needed
    const { default: Stripe } = await import("stripe")
    
    // Initialize Stripe with your secret key - only when the route is called
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover", // Use the latest API version
    })

    const { roomId, checkIn, checkOut, currency = "eur" } = await request.json()

    if (!roomId || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing booking details" }, { status: 400 })
    }

    const room = allRoomsData.find(room => room.id === roomId)
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const nights = differenceInDays(new Date(checkOut), new Date(checkIn))
    if (nights <= 0) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
    }

    if (!room.price) {
      return NextResponse.json({ error: "Room price not available" }, { status: 400 })
    }
    
    // Use price directly since it's already a number
    const priceValue = room.price
    const basePrice = nights * priceValue
    const taxAmount = basePrice * 0.13 // Assuming 13% tax
    const amountInCents = Math.round((basePrice + taxAmount) * 100) // Stripe expects amount in cents

    if (amountInCents <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      // You can add metadata here, like bookingId, customerId, etc.
      // metadata: { bookingId: 'your_booking_id' }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: amountInCents / 100, // Send amount back for display if needed
    })
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error("Error creating PaymentIntent", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
