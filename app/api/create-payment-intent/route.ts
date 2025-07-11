import { NextResponse } from "next/server"
import Stripe from "stripe"
import { roomsData } from "@/data/rooms" // Assuming this path is correct
import { differenceInDays } from "date-fns"

// Initialize Stripe with your secret key
// Ensure STRIPE_SECRET_KEY is set in your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10", // Use the latest API version
})

export async function POST(request: Request) {
  try {
    const { roomId, checkIn, checkOut, currency = "eur" } = await request.json()

    if (!roomId || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing booking details" }, { status: 400 })
    }

    const room = roomsData[roomId]
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const nights = differenceInDays(new Date(checkOut), new Date(checkIn))
    if (nights <= 0) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
    }

    const basePrice = nights * room.price
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
    console.error("Error creating PaymentIntent:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
