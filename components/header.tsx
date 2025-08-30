"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { useLanguage, type LanguageCode } from "@/contexts/language-context"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation";

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  {
    code: "el",
    name: "Ελληνικά",
    flag: "/flags/gr-flag-new.png",
  },
  {
    code: "en",
    name: "English",
    flag: "/flags/gb-flag-new.png",
  },
  {
    code: "de",
    name: "Deutsch",
    flag: "/flags/de-flag-new.png",
  },
]

export default function Header() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isAdminPage = pathname.startsWith("/admin")
  const [renderHeader, setRenderHeader] = useState(!pathname.startsWith("/admin"))
  const useLightHeaderBg = scrolled || (!scrolled && pathname === "/")

  useEffect(() => {
    // Initialize renderHeader based on the current path
    setRenderHeader(!pathname.startsWith("/admin"))

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [pathname, mobileMenuOpen]) // Add mobileMenuOpen to dependency array

  const selectedLang = languages.find((lang) => lang.code === language) || languages[0]

  // Update navigation links to use language prefix
  const langPrefix = `/${language}`
  const navigation = [
    { name: "nav.home", href: `${langPrefix}` },
    { name: "nav.about", href: `${langPrefix}/about` },
    { name: "nav.rooms", href: `${langPrefix}/rooms` },
    { name: "nav.bookings", href: `${langPrefix}/bookings` },
    { name: "nav.contact", href: `${langPrefix}/contact` },
  ]

  const router = useRouter();

  const handleLanguageChange = (newLang: LanguageCode) => {
    // Get the current path, e.g., /en/rooms/123
    const segments = pathname.split("/");
    // Replace the first segment (which is the language code)
    if (segments[1] === "en" || segments[1] === "el" || segments[1] === "de") {
      segments[1] = newLang;
    } else {
      // If for some reason the language is missing, add it
      segments.splice(1, 0, newLang);
    }
    const newPath = segments.join("/") || "/";
    setLanguage(newLang);
    router.push(newPath);
  };

  if (!renderHeader) {
    return null
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F0F0E0] shadow-md py-2" // Scrolled state: solid color
          : pathname === "/"
            ? "bg-header-home py-4" // Not scrolled, on homepage
            : "bg-transparent py-4" // Not scrolled, on other pages (transparent)
      }`}
    >
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex-shrink-0 mr-2 sm:mr-4">
            <Link href={langPrefix || "/"} className="block">
              <span className="sr-only">{t("logo.altPublic", "Asterias Hotel")}</span>
              <div className={`relative transition-all duration-300 ${scrolled ? "w-32 h-16 sm:w-48 sm:h-20" : "w-40 h-20 sm:w-56 sm:h-24"}`}>
                <Image
                  src="https://i.imgur.com/leL7gRY.png"
                  alt={t("logo.altPublic", "Asterias Hotel Logo")}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Center Navigation - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-lg font-cormorant font-medium tracking-wide transition-colors hover:scale-105 transform duration-200 ${
                    useLightHeaderBg ? "text-slate-800 hover:text-[#8B4B5C]" : "text-white hover:text-[#E8E2D5]"
                  }`}
                >
                  {t(item.name)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side - Language and Booking - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border ${
                  useLightHeaderBg
                    ? "text-slate-700 hover:text-[#8B4B5C] border-slate-200 hover:border-[#8B4B5C] bg-white/80 hover:bg-white"
                    : "text-white/90 hover:text-white border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
                } ${languageDropdownOpen ? (useLightHeaderBg ? "border-[#8B4B5C] bg-white" : "border-white/40 bg-white/15") : ""}`}
              >
                <div className="w-5 h-auto relative overflow-hidden">
                  <Image
                    src={selectedLang.flag || "/placeholder.svg"}
                    alt={`${selectedLang.name} flag`}
                    width={20}
                    height={15}
                    className="object-contain"
                  />
                </div>
                <span className="font-alegreya text-xs tracking-wide">{selectedLang.code.toUpperCase()}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${languageDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {languages.map((lang, index) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageChange(lang.code)
                        setLanguageDropdownOpen(false)
                      }}
                      className={`flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-[#E8E2D5]/50 transition-colors duration-150 ${
                        index === 0 ? "rounded-t-lg" : ""
                      } ${index === languages.length - 1 ? "rounded-b-lg" : ""} ${
                        lang.code === language ? "bg-[#E8E2D5]/30" : ""
                      }`}
                    >
                      <div className="w-6 h-auto mr-3 relative overflow-hidden shadow-sm">
                        <Image
                          src={lang.flag || "/placeholder.svg"}
                          alt={`${lang.name} flag`}
                          width={24}
                          height={16}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium font-alegreya">{lang.code.toUpperCase()}</span>
                        <span className="text-xs text-slate-500 font-alegreya">{lang.name}</span>
                      </div>
                      {lang.code === language && <div className="ml-auto w-2 h-2 bg-[#8B4B5C] rounded-full"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`${langPrefix}/bookings`}
              className={`px-6 py-2.5 rounded-lg text-white font-medium tracking-wide transition-all duration-200 transform hover:scale-105 ${
                scrolled ? "bg-[#8B4B5C] hover:bg-[#7A4251] shadow-md" : "bg-[#8B4B5C]/90 hover:bg-[#8B4B5C]"
              }`}
            >
              {t("nav.book")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              className={`p-2 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                useLightHeaderBg ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t("header.openMenu", "Open menu")}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-4 sm:px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">{t("logo.altPublic", "Asterias Hotel")}</span>
              <div className="relative h-16 w-44">
                <Image
                  src="https://i.imgur.com/leL7gRY.png"
                  alt={t("logo.altPublic", "Asterias Hotel Logo")}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <button
              type="button"
              className="rounded-md p-2.5 text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
              aria-label={t("header.closeMenu", "Close menu")}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              {/* Navigation Links */}
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-4 text-lg font-cormorant font-medium text-slate-800 hover:bg-[#E8E2D5] rounded-md transition-colors min-h-[44px] flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.name)}
                  </Link>
                ))}
              </div>
              
              {/* Language Selector */}
              <div className="py-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-500 font-alegreya mb-4 px-3">
                    {t("languageSelector.titleMobile")}
                  </h3>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`flex items-center w-full text-sm font-medium px-3 py-4 rounded-lg transition-colors min-h-[44px] ${
                          lang.code === language
                            ? "bg-[#E8E2D5]/50 text-[#8B4B5C]"
                            : "text-slate-600 hover:text-[#8B4B5C] hover:bg-[#E8E2D5]/30"
                        }`}
                        onClick={() => {
                          handleLanguageChange(lang.code)
                          setMobileMenuOpen(false)
                        }}
                      >
                        <div className="w-6 h-auto mr-3 relative overflow-hidden shadow-sm">
                          <Image
                            src={lang.flag || "/placeholder.svg"}
                            alt={`${lang.name} flag`}
                            width={24}
                            height={16}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium font-alegreya">{lang.code.toUpperCase()}</span>
                          <span className="text-xs text-slate-500 font-alegreya">{lang.name}</span>
                        </div>
                        {lang.code === language && <div className="ml-auto w-2 h-2 bg-[#8B4B5C] rounded-full"></div>}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Mobile Booking Button */}
                <Link
                  href="/bookings"
                  className="block w-full px-4 py-4 text-center bg-[#8B4B5C] text-white font-medium rounded-lg hover:bg-[#7A4251] transition-colors shadow-sm min-h-[44px] flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.book")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
