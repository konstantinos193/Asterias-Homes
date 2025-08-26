"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { BookingData } from "@/types/booking"
import { useLanguage } from "@/contexts/language-context"

interface StepGuestInfoProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
}

export default function StepGuestInfo({ bookingData, updateBookingData }: StepGuestInfoProps) {
  const { t } = useLanguage()

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
        <h2 className="text-2xl font-cormorant font-semibold text-slate-800 mb-2">
          {t("bookingWizard.guestInfo.title")}
        </h2>
        <p className="text-slate-600 font-alegreya">{t("bookingWizard.guestInfo.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
            {t("bookingWizard.guestInfo.firstName")} *
          </label>
          <Input
            required
            value={bookingData.guestInfo.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="font-alegreya"
            placeholder={t("bookingWizard.guestInfo.firstNamePlaceholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
            {t("bookingWizard.guestInfo.lastName")} *
          </label>
          <Input
            required
            value={bookingData.guestInfo.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="font-alegreya"
            placeholder={t("bookingWizard.guestInfo.lastNamePlaceholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
            {t("bookingWizard.guestInfo.email")} *
          </label>
          <Input
            type="email"
            required
            value={bookingData.guestInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="font-alegreya"
            placeholder={t("bookingWizard.guestInfo.emailPlaceholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
            {t("bookingWizard.guestInfo.phone")} *
          </label>
          <Input
            type="tel"
            required
            value={bookingData.guestInfo.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="font-alegreya"
            placeholder={t("bookingWizard.guestInfo.phonePlaceholder")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
          {t("bookingWizard.guestInfo.specialRequests")}
        </label>
        <Textarea
          rows={4}
          value={bookingData.guestInfo.specialRequests}
          onChange={(e) => handleInputChange("specialRequests", e.target.value)}
          className="font-alegreya"
          placeholder={t("bookingWizard.guestInfo.specialRequestsPlaceholder")}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-cormorant font-semibold text-blue-800 mb-2">
          {t("bookingWizard.guestInfo.importantInfo")}
        </h3>
        <ul className="text-sm text-blue-700 font-alegreya space-y-1">
          <li>• {t("bookingWizard.guestInfo.checkInTime")}</li>
          <li>• {t("bookingWizard.guestInfo.checkOutTime")}</li>
          <li>• {t("bookingWizard.guestInfo.cancellationPolicy")}</li>
        </ul>
      </div>
    </div>
  )
}
