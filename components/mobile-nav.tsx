"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Home, Info, Bed, Calendar, Phone, X, Globe, FileText } from "lucide-react"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { t, language } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const pathname = usePathname()

  const navigation = [
    { 
      name: "nav.home", 
      href: `/${language}`, 
      icon: Home,
      current: pathname === `/${language}` || pathname === "/"
    },
    { 
      name: "nav.about", 
      href: `/${language}/about`, 
      icon: Info,
      current: pathname === `/${language}/about`
    },
    { 
      name: "nav.rooms", 
      href: `/${language}/rooms`, 
      icon: Bed,
      current: pathname === `/${language}/rooms`
    },
    { 
      name: "nav.bookings", 
      href: `/${language}/bookings`, 
      icon: Calendar,
      current: pathname === `/${language}/bookings`
    },
    { 
      name: "nav.contact", 
      href: `/${language}/contact`, 
      icon: Phone,
      current: pathname === `/${language}/contact`
    },
  ]

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Navigation Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-[#8B4B5C]" />
              <span className="text-lg font-semibold text-gray-900">Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors min-h-[44px] ${
                      item.current
                        ? 'bg-[#8B4B5C] text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[#8B4B5C]'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${item.current ? 'text-white' : 'text-gray-500'}`} />
                    <span className="font-medium">{t(item.name)}</span>
                  </Link>
                )
              })}
              
              {/* My Bookings Link - Only show if authenticated */}
              {user && !authLoading && (
                <Link
                  href={`/${language}/my-bookings`}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors min-h-[44px] ${
                    pathname === `/${language}/my-bookings`
                      ? 'bg-[#8B4B5C] text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#8B4B5C]'
                  }`}
                >
                  <FileText className={`h-5 w-5 ${pathname === `/${language}/my-bookings` ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">{t("nav.myBookings")}</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href={`/${language}/bookings`}
              onClick={onClose}
              className="w-full bg-[#8B4B5C] text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-[#7A4251] transition-colors min-h-[44px] flex items-center justify-center"
            >
              {t("nav.book")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
