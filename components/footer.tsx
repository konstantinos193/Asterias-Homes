"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const { t, language } = useLanguage()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto container-mobile">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="https://i.imgur.com/leL7gRY.png"
                  alt="Asterias Homes Logo"
                  width={120}
                  height={48}
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {t("footer.description")}
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{t("footer.quickLinks")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${language}`}
                    className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base block py-1"
                  >
                    {t("nav.home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${language}/about`}
                    className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base block py-1"
                  >
                    {t("nav.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${language}/rooms`}
                    className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base block py-1"
                  >
                    {t("nav.rooms")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${language}/contact`}
                    className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base block py-1"
                  >
                    {t("nav.contact")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{t("footer.services")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${language}/bookings`}
                    className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base block py-1"
                  >
                    {t("footer.booking")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${language}/offers`}
                    className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base block py-1"
                  >
                    {t("footer.specialOffers")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${language}/gallery`}
                    className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base block py-1"
                  >
                    {t("footer.gallery")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{t("footer.contactInfo")}</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-[#8B4B5C] mt-0.5 flex-shrink-0" />
                  <p className="text-sm sm:text-base text-slate-300">
                    {t("footer.address")}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#8B4B5C] flex-shrink-0" />
                  <a
                    href="tel:+302680123456"
                    className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors"
                  >
                    +30 2680 123 456
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#8B4B5C] flex-shrink-0" />
                  <a
                    href="mailto:info@asteriashome.gr"
                    className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors"
                  >
                    info@asteriashome.gr
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-slate-400 text-center sm:text-left">
              © {currentYear} Asterias Homes. {t("footer.allRightsReserved")}
            </p>
            <div className="flex space-x-6 text-sm text-slate-400">
              <Link
                href={`/${language}/privacy`}
                className="hover:text-white transition-colors"
              >
                {t("footer.privacyPolicy")}
              </Link>
              <Link
                href={`/${language}/terms`}
                className="hover:text-white transition-colors"
              >
                {t("footer.termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
