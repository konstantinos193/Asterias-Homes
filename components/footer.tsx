"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { usePathname } from "next/navigation" // Import usePathname

export default function Footer() {
  const { t } = useLanguage()
  const pathname = usePathname() // Get current path

  // Don't render the main footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-white">
      <div className="container mx-auto">
        {/* Main footer content */}
        <div className="px-6 py-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6">
              <Image src="https://i.imgur.com/yogQh0J.png" alt="Asterias Hotel" width={1200} height={450} className="h-32 w-auto" />
            </div>
            <div className="w-24 h-0.5 bg-[#8B4B5C] mb-6"></div>
            <p className="text-slate-300 font-alegreya text-center max-w-xl mb-4">{t("footer.description")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-alegreya font-light mb-4 text-[#E8E2D5]">{t("footer.contact")}</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-slate-300 font-alegreya font-light">{t("footer.details.phone.number")}</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-slate-300 font-alegreya font-light">{t("footer.details.email.address")}</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-slate-300 font-alegreya font-light">
                    {t("footer.details.address.street")}
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-alegreya font-light mb-4 text-[#E8E2D5]">{t("footer.links")}</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <Link href="/" className="text-slate-300 hover:text-white transition-colors font-alegreya font-light">
                  {t("nav.home")}
                </Link>
                <Link href="/rooms" className="text-slate-300 hover:text-white transition-colors font-alegreya font-light">
                  {t("nav.rooms")}
                </Link>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors font-alegreya font-light">
                  {t("nav.about")}
                </Link>
                <Link href="/bookings" className="text-slate-300 hover:text-white transition-colors font-alegreya font-light">
                  {t("nav.bookings")}
                </Link>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors font-alegreya font-light">
                  {t("nav.contact")}
                </Link>
                <Link href="/admin" className="text-slate-300 hover:text-white transition-colors font-alegreya font-light">
                  {t("nav.admin")}
                </Link>
              </div>
            </div>

            {/* Reception Hours */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-alegreya font-light mb-4 text-[#E8E2D5]">
                {t("footer.receptionHours.title")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-white font-alegreya font-light">{t("footer.receptionHours.mondayFriday")}</p>
                    <p className="text-slate-300 font-alegreya font-light">{t("footer.receptionHours.mondayFridayHours")}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0 opacity-0 md:opacity-100" />{" "}
                  <div>
                    <p className="text-white font-alegreya font-light">{t("footer.receptionHours.saturday")}</p>
                    <p className="text-slate-300 font-alegreya font-light">{t("footer.receptionHours.saturdayHours")}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0 opacity-0 md:opacity-100" />{" "}
                  <div>
                    <p className="text-white font-alegreya font-light">{t("footer.receptionHours.sunday")}</p>
                    <p className="text-slate-300 font-alegreya font-light">{t("footer.receptionHours.sundayHours")}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-slate-700/50 py-4 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400 font-alegreya mb-4 md:mb-0">© 2025 adinfinity. All rights reserved.</p>
            <div className="flex items-center">
              <span className="text-sm text-slate-400 font-alegreya mr-2">#VisitKoronisia</span>
              <div className="w-2 h-2 bg-[#8B4B5C] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
