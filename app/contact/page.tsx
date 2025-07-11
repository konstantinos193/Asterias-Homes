"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ContactPage() {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    }, 1500)
  }

  const mapEmbedSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.5!2d20.9188782!3d39.013693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135c22c7aecd7b97%3A0xa531da7850f7780a!2z4JKB4JOD4JOX4JOV4JOg4JOV4JKw4JKw!5e0!3m2!1s${language === "el" ? "el" : "en"}!2s${language === "el" ? "GR" : "US"}!4v1717350000000!5m2!1s${language === "el" ? "el" : "en"}!2s${language === "el" ? "GR" : "US"}`

  return (
    <>
      <div className="relative pt-32 pb-20 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact-header.png"
            alt={t("contactPage.header.title")}
            fill
            className="object-cover opacity-30"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl font-cormorant font-light mb-4">{t("contactPage.header.title")}</h1>
            <div className="w-16 h-0.5 bg-[#0A4A4A] mx-auto mb-6"></div>
            <p className="text-lg font-alegreya text-slate-200">{t("contactPage.header.subtitle")}</p>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-cormorant font-light text-slate-800 mb-6">
                  {t("contactPage.form.title")}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                      {t("contactPage.form.label.name")}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-alegreya"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                      {t("contactPage.form.label.email")}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-alegreya"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                      {t("contactPage.form.label.phone")}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-alegreya"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                      {t("contactPage.form.label.message")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-alegreya"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0A4A4A] text-white py-3 px-4 rounded-sm hover:bg-[#083a3a] transition-colors font-alegreya"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("contactPage.form.button.submitting") : t("contactPage.form.button.submit")}
                  </button>

                  {submitSuccess && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-sm font-alegreya">
                      {t("contactPage.form.successMessage")}
                    </div>
                  )}
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-cormorant font-light text-slate-800 mb-6">
                  {t("contactPage.details.title")}
                </h2>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-[#A9AEA2]/20 rounded-sm">
                        <Phone className="h-5 w-5 text-[#0A4A4A]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-1">
                        {t("contactPage.details.phone.title")}
                      </h3>
                      <p className="text-slate-600 font-alegreya">{t("contactPage.details.phone.number")}</p>
                      <p className="text-slate-500 text-sm font-alegreya mt-1">
                        {t("contactPage.details.phone.availability")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-amber-50 rounded-sm">
                        <Mail className="h-5 w-5 text-amber-700" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-1">
                        {t("contactPage.details.email.title")}
                      </h3>
                      <p className="text-slate-600 font-alegreya">{t("contactPage.details.email.address")}</p>
                      <p className="text-slate-500 text-sm font-alegreya mt-1">
                        {t("contactPage.details.email.replyTime")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-amber-50 rounded-sm">
                        <MapPin className="h-5 w-5 text-amber-700" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-1">
                        {t("contactPage.details.address.title")}
                      </h3>
                      <p className="text-slate-600 font-alegreya">{t("contactPage.details.address.street")}</p>
                      <p className="text-slate-500 text-sm font-alegreya mt-1">
                        {t("contactPage.details.address.region")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-amber-50 rounded-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-amber-700"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-cormorant font-semibold text-slate-800 mb-1">
                        {t("contactPage.details.social.title")}
                      </h3>
                      <div className="flex space-x-4 mt-2">
                        <a href="#" className="text-slate-600 hover:text-[#0A4A4A] transition-colors">
                          <Instagram className="h-5 w-5" />
                          <span className="sr-only">{t("contactPage.details.social.instagramAlt")}</span>
                        </a>
                        <a href="#" className="text-slate-600 hover:text-amber-700 transition-colors">
                          <Facebook className="h-5 w-5" />
                          <span className="sr-only">{t("contactPage.details.social.facebookAlt")}</span>
                        </a>
                      </div>
                      <p className="text-slate-500 text-sm font-alegreya mt-2">
                        {t("contactPage.details.social.hashtag")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-cormorant font-light text-slate-800 mb-6">
                {t("contactPage.location.title")}
              </h2>

              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-sm shadow-lg">
                <iframe
                  src={mapEmbedSrc}
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title={t("contactPage.location.title")}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
