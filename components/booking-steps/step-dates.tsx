"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { format, differenceInDays } from "date-fns"
import { CalendarIcon, Users, Baby } from "lucide-react"
import type { BookingData } from "@/types/booking"
import { useLanguage } from "@/contexts/language-context"

interface StepDatesProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
}

export default function StepDates({ bookingData, updateBookingData }: StepDatesProps) {
  const { t } = useLanguage()
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [checkOutOpen, setCheckOutOpen] = useState(false)
  const nights =
    bookingData.checkIn && bookingData.checkOut ? differenceInDays(bookingData.checkOut, bookingData.checkIn) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-cormorant font-semibold text-slate-800 mb-2">
          {t("bookingWizard.dates.title")}
        </h2>
        <p className="text-slate-600 font-alegreya">
          {t("bookingWizard.dates.subtitle", "Please select your stay dates and number of guests")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
            {t("bookingWizard.dates.checkIn")}
          </label>
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger onClick={() => setCheckInOpen(true)}>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bookingData.checkIn ? format(bookingData.checkIn, "dd/MM/yyyy") : t("bookingWizard.dates.selectDate", "Select date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={bookingData.checkIn}
                onSelect={(date) => {
                  updateBookingData({ checkIn: date })
                  setCheckInOpen(false)
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
            {t("bookingWizard.dates.checkOut")}
          </label>
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger onClick={() => setCheckOutOpen(true)}>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bookingData.checkOut ? format(bookingData.checkOut, "dd/MM/yyyy") : t("bookingWizard.dates.selectDate", "Select date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={bookingData.checkOut}
                onSelect={(date) => {
                  updateBookingData({ checkOut: date })
                  setCheckOutOpen(false)
                }}
                disabled={(date) => date <= (bookingData.checkIn || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
            <Users className="inline w-4 h-4 mr-1" />
            {t("bookingWizard.dates.adults")}
          </label>
          <Select
            value={bookingData.adults.toString()}
            onValueChange={(value) => updateBookingData({ adults: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 6 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
            <Baby className="inline w-4 h-4 mr-1" />
            {t("bookingWizard.dates.children")}
          </label>
          <Select
            value={bookingData.children.toString()}
            onValueChange={(value) => updateBookingData({ children: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {nights > 0 && (
        <div className="bg-slate-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="font-alegreya text-slate-700">Διανυκτερεύσεις:</span>
            <span className="font-cormorant font-semibold text-slate-800">{nights} νύχτες</span>
          </div>
        </div>
      )}
    </div>
  )
}
