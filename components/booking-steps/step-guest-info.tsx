"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { BookingData } from "@/types/booking"

interface StepGuestInfoProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
}

export default function StepGuestInfo({ bookingData, updateBookingData }: StepGuestInfoProps) {
  const handleInputChange = (field: keyof BookingData["guestInfo"], value: string) => {
    updateBookingData({
      guestInfo: {
        ...bookingData.guestInfo,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-cormorant font-semibold text-slate-800 mb-2">Στοιχεία επισκέπτη</h2>
        <p className="text-slate-600 font-alegreya">Παρακαλώ συμπληρώστε τα στοιχεία σας για την κράτηση</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">Όνομα *</label>
          <Input
            required
            value={bookingData.guestInfo.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="font-alegreya"
            placeholder="Εισάγετε το όνομά σας"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">Επώνυμο *</label>
          <Input
            required
            value={bookingData.guestInfo.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="font-alegreya"
            placeholder="Εισάγετε το επώνυμό σας"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">Email *</label>
          <Input
            type="email"
            required
            value={bookingData.guestInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="font-alegreya"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">Τηλέφωνο *</label>
          <Input
            type="tel"
            required
            value={bookingData.guestInfo.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="font-alegreya"
            placeholder="+30 210 1234567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">Ειδικά αιτήματα</label>
        <Textarea
          rows={4}
          value={bookingData.guestInfo.specialRequests}
          onChange={(e) => handleInputChange("specialRequests", e.target.value)}
          className="font-alegreya"
          placeholder="Παρακαλώ αναφέρετε τυχόν ειδικά αιτήματα (π.χ. όροφος, θέα, διατροφικές απαιτήσεις)..."
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-cormorant font-semibold text-blue-800 mb-2">Σημαντικές πληροφορίες</h3>
        <ul className="text-sm text-blue-700 font-alegreya space-y-1">
          <li>• Check-in: 15:00 - 22:00</li>
          <li>• Check-out: 08:00 - 11:00</li>
          <li>• Δωρεάν ακύρωση έως 48 ώρες πριν την άφιξη</li>
          <li>• Τα παιδιά κάτω των 12 ετών διαμένουν δωρεάν</li>
        </ul>
      </div>
    </div>
  )
}
