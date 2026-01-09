import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Bookings | Asterias Homes",
  description: "View and manage your apartment reservations",
}

export default function MyBookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

