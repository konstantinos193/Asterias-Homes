"use client"

import React, { useState, useEffect, useRef } from 'react'
import { format, addDays, isBefore, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth } from 'date-fns'
import { el, enUS, de } from 'date-fns/locale'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'

interface DatePickerProps {
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  placeholder: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  language?: 'en' | 'el' | 'de'
}

export function DatePicker({
  selectedDate,
  onDateSelect,
  placeholder,
  disabled = false,
  minDate = new Date(),
  maxDate,
  language = 'en'
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())
  const dropdownRef = useRef<HTMLDivElement>(null)

  const dateLocale = language === 'el' ? el : language === 'de' ? de : enUS

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDateClick = (date: Date) => {
    if (isBefore(date, minDate) || (maxDate && isBefore(maxDate, date))) return
    
    onDateSelect(date)
    setIsOpen(false)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => addDays(prev, -30))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => addDays(prev, 30))
  }

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    return (
      <div className="bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-4 min-w-[360px]">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600 group-hover:text-[#8B4B5C]" />
          </button>
          <h3 className="text-lg font-semibold text-slate-800 font-cormorant">
            {format(currentMonth, "MMMM yyyy", { locale: dateLocale })}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
          >
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-[#8B4B5C]" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {dayNames.map((day, index) => (
            <div key={index} className="text-center text-xs font-semibold text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const isCurrentMonth = isSameMonth(date, currentMonth)
            const isToday = isSameDay(date, new Date())
            const isSelected = selectedDate && isSameDay(date, selectedDate)
            const isDisabled = isBefore(date, minDate) || (maxDate && isBefore(maxDate, date))
            
            // Mock availability colors - replace with real data later
            let availabilityClass = ''
            let availabilityText = ''
            
            if (isDisabled) {
              availabilityClass = 'bg-slate-100 text-slate-300 cursor-not-allowed'
            } else if (isSelected) {
              availabilityClass = 'bg-[#8B4B5C] text-white font-semibold shadow-lg ring-2 ring-[#8B4B5C] ring-offset-1'
            } else if (isToday) {
              availabilityClass = 'bg-slate-100 text-slate-800 font-semibold ring-2 ring-[#8B4B5C] ring-offset-1'
            } else {
              // Random availability for demo - replace with real data
              const random = Math.random()
              if (random > 0.7) {
                availabilityClass = 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                availabilityText = language === 'el' ? 'Κλεισμένο' : language === 'de' ? 'Gebucht' : 'Booked'
              } else if (random > 0.4) {
                availabilityClass = 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200'
                availabilityText = language === 'el' ? 'Περιορισμένο' : language === 'de' ? 'Eingeschränkt' : 'Limited'
              } else {
                availabilityClass = 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                availabilityText = language === 'el' ? 'Διαθέσιμο' : language === 'de' ? 'Verfügbar' : 'Available'
              }
            }

            return (
              <div key={index} className="relative">
                <button
                  onClick={() => handleDateClick(date)}
                  disabled={isDisabled}
                  className={`
                    w-12 h-12 text-sm rounded-lg transition-all duration-200 flex flex-col items-center justify-center font-medium
                    ${availabilityClass}
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                  `}
                >
                  <span className="text-sm font-bold mb-1">{format(date, "d")}</span>
                  {availabilityText && !isSelected && (
                    <span className="text-[8px] font-medium opacity-90 leading-none">{availabilityText}</span>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Availability Legend */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-slate-600">{language === 'el' ? 'Διαθέσιμο' : language === 'de' ? 'Verfügbar' : 'Available'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span className="text-slate-600">{language === 'el' ? 'Περιορισμένο' : language === 'de' ? 'Eingeschränkt' : 'Limited'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-slate-600">{language === 'el' ? 'Κλεισμένο' : language === 'de' ? 'Gebucht' : 'Booked'}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full h-12 justify-start text-left font-normal bg-white border-2 border-slate-300 hover:border-[#8B4B5C] hover:bg-slate-50 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
        {selectedDate ? format(selectedDate, "MMM d, yyyy", { locale: dateLocale }) : placeholder}
      </Button>
      
      {isOpen && (
        <div className="absolute z-50 mt-2 animate-in slide-in-from-top-2 duration-200">
          {renderCalendar()}
        </div>
      )}
    </div>
  )
}
