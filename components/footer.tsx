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
            <Image src="/logo-white.png" alt="Asterias Hotel" width={180} height={70} className="h-12 w-auto mb-6" />
            <div className="w-24 h-0.5 bg-[#8B4B5C] mb-6"></div>
            <p className="text-slate-300 font-alegreya text-center max-w-xl mb-4">{t("footer.description")}</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8B4B5C]/20 text-white hover:bg-[#8B4B5C] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8B4B5C]/20 text-white hover:bg-[#8B4B5C] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-cormorant font-semibold mb-4 text-[#E8E2D5]">{t("footer.contact")}</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-slate-300 font-alegreya">{t("footer.details.phone.number")}</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-slate-300 font-alegreya">{t("footer.details.email.address")}</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-slate-300 font-alegreya">{t("footer.details.address")}</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-cormorant font-semibold mb-4 text-[#E8E2D5]">{t("footer.links")}</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <Link href="/" className="text-slate-300 hover:text-white transition-colors font-alegreya">
                  {t("nav.home")}
                </Link>
                <Link href="/rooms" className="text-slate-300 hover:text-white transition-colors font-alegreya">
                  {t("nav.rooms")}
                </Link>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors font-alegreya">
                  {t("nav.about")}
                </Link>
                <Link href="/bookings" className="text-slate-300 hover:text-white transition-colors font-alegreya">
                  {t("nav.bookings")}
                </Link>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors font-alegreya">
                  {t("nav.contact")}
                </Link>
                <Link href="/admin" className="text-slate-300 hover:text-white transition-colors font-alegreya">
                  {t("nav.admin")}
                </Link>
              </div>
            </div>

            {/* Reception Hours */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-cormorant font-semibold mb-4 text-[#E8E2D5]">
                {t("footer.receptionHours.title")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-white font-alegreya font-medium">{t("footer.receptionHours.mondayFriday")}</p>
                    <p className="text-slate-300 font-alegreya">{t("footer.receptionHours.mondayFridayHours")}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0 opacity-0 md:opacity-100" />{" "}
                  <div>
                    <p className="text-white font-alegreya font-medium">{t("footer.receptionHours.saturday")}</p>
                    <p className="text-slate-300 font-alegreya">{t("footer.receptionHours.saturdayHours")}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-[#8B4B5C] mt-0.5 mr-3 flex-shrink-0 opacity-0 md:opacity-100" />{" "}
                  <div>
                    <p className="text-white font-alegreya font-medium">{t("footer.receptionHours.sunday")}</p>
                    <p className="text-slate-300 font-alegreya">{t("footer.receptionHours.sundayHours")}</p>
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
