"use client"
import { useLanguage } from "@/contexts/language-context"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <main className="bg-[#A9AEA2]/30 text-slate-800 pt-20 sm:pt-24 font-alegreya">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto container-mobile text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-cormorant font-bold mb-3 sm:mb-4">{t("contact.heroTitle")}</h1>
          <div className="w-12 sm:w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-sm sm:text-base md:text-lg text-slate-700 max-w-2xl mx-auto">
            {t("contact.heroDescription")}
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto container-mobile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Details */}
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-xl sm:text-2xl font-cormorant font-semibold">{t("contact.contactInfo")}</h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-[#8B4B5C] rounded-lg">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{t("contact.phone")}</h3>
                    <p className="text-sm sm:text-base text-slate-600">+30 2680 123 456</p>
                    <p className="text-sm sm:text-base text-slate-600">+30 6977 123 456</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-[#8B4B5C] rounded-lg">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{t("contact.email")}</h3>
                    <p className="text-sm sm:text-base text-slate-600">info@asteriashome.gr</p>
                    <p className="text-sm sm:text-base text-slate-600">bookings@asteriashome.gr</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-[#8B4B5C] rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{t("contact.address")}</h3>
                    <p className="text-sm sm:text-base text-slate-600">
                      {t("contact.addressDetails")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-[#8B4B5C] rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{t("contact.hours")}</h3>
                    <p className="text-sm sm:text-base text-slate-600">{t("contact.receptionHours")}</p>
                    <p className="text-sm sm:text-base text-slate-600">{t("contact.checkInOut")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-cormorant font-semibold mb-6">{t("contact.sendMessage")}</h2>
              
              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                      {t("contact.firstName")}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#8B4B5C] focus:border-transparent transition-colors text-sm sm:text-base"
                      placeholder={t("contact.firstNamePlaceholder")}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                      {t("contact.lastName")}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#8B4B5C] focus:border-transparent transition-colors text-sm sm:text-base"
                      placeholder={t("contact.lastNamePlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    {t("contact.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#8B4B5C] focus:border-transparent transition-colors text-sm sm:text-base"
                    placeholder={t("contact.emailPlaceholder")}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    {t("contact.subject")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#8B4B5C] focus:border-transparent transition-colors text-sm sm:text-base"
                    placeholder={t("contact.subjectPlaceholder")}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    {t("contact.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#8B4B5C] focus:border-transparent transition-colors text-sm sm:text-base resize-vertical"
                    placeholder={t("contact.messagePlaceholder")}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8B4B5C] text-white font-medium py-3 px-6 rounded-md hover:bg-[#7A4251] transition-colors flex items-center justify-center space-x-2 min-h-[44px] text-sm sm:text-base"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{t("contact.sendButton")}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white/80">
        <div className="container mx-auto container-mobile">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-cormorant font-semibold mb-3 sm:mb-4">{t("contact.findUs")}</h2>
            <div className="w-12 sm:w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              {t("contact.mapDescription")}
            </p>
          </div>
          
          <div className="bg-slate-200 rounded-lg h-64 sm:h-80 md:h-96 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-sm sm:text-base">{t("contact.mapPlaceholder")}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 