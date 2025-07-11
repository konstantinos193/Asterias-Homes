"use client"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { format, differenceInDays } from "date-fns"
import { CalendarIcon, Users, Baby } from "lucide-react"
import type { BookingData } from "@/types/booking"

interface StepDatesProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
}

export default function StepDates({ bookingData, updateBookingData }: StepDatesProps) {
  const nights =
    bookingData.checkIn && bookingData.checkOut ? differenceInDays(bookingData.checkOut, bookingData.checkIn) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-cormorant font-semibold text-slate-800 mb-2">
          Επιλέξτε ημερομηνίες και επισκέπτες
        </h2>
        <p className="text-slate-600 font-alegreya">
          Παρακαλώ επιλέξτε τις ημερομηνίες διαμονής σας και τον αριθμό των επισκεπτών
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">Ημερομηνία άφιξης</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bookingData.checkIn ? format(bookingData.checkIn, "dd/MM/yyyy") : "Επιλέξτε ημερομηνία"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={bookingData.checkIn}
                onSelect={(date) => updateBookingData({ checkIn: date })}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">Ημερομηνία αναχώρησης</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bookingData.checkOut ? format(bookingData.checkOut, "dd/MM/yyyy") : "Επιλέξτε ημερομηνία"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={bookingData.checkOut}
                onSelect={(date) => updateBookingData({ checkOut: date })}
                disabled={(date) => date <= (bookingData.checkIn || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-alegreya mb-2">
            <Users className="inline w-4 h-4 mr-1" />
            Ενήλικες
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
            Παιδιά
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
