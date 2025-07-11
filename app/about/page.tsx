"use client"

import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

const AboutPage = () => {
  const { t, language } = useLanguage()

  return (
    <div className="bg-white text-slate-700">
      {/* Header Section */}
      <section
        className="relative h-[400px] md:h-[500px] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/about1.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-cormorant font-bold text-white mb-4">{t("about.header.title")}</h1>
          <p className="text-lg md:text-xl text-gray-200 font-alegreya max-w-2xl mx-auto">
            {t("about.header.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto py-12 md:py-20 px-4 mt-12">
        {/* Our Story Section */}
        <section className="mb-12 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-sm font-alegreya uppercase tracking-wider text-[#0A4A4A] mb-2">
                {t("about.story.subtitle")}
              </h2>
              <h3 className="text-3xl md:text-4xl font-cormorant font-light text-slate-800 mb-6">
                {t("about.story.title")}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4 font-alegreya">{t("about.story.paragraph1")}</p>
              <p className="text-slate-600 leading-relaxed mb-4 font-alegreya">{t("about.story.paragraph2")}</p>
              <p className="text-slate-600 leading-relaxed font-alegreya">{t("about.story.paragraph3")}</p>
            </div>
            <div className="relative h-80 md:h-[450px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/about2.png"
                alt={t("about.story.imageAlt1")}
                layout="fill"
                objectFit="cover"
                className="transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </section>

        {/* Our Mission & Vision Section */}
        <section className="mb-12 md:mb-20 bg-slate-50 p-8 md:p-12 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="text-2xl font-cormorant font-semibold text-slate-800 mb-4">{t("about.mission.title")}</h3>
              <p className="text-slate-600 leading-relaxed mb-4 font-alegreya">{t("about.mission.paragraph")}</p>
            </div>
            <div>
              <h3 className="text-2xl font-cormorant font-semibold text-slate-800 mb-4">{t("about.vision.title")}</h3>
              <p className="text-slate-600 leading-relaxed mb-4 font-alegreya">{t("about.vision.paragraph")}</p>
            </div>
          </div>
        </section>

        {/* Our Team Section (Optional - can be expanded) */}
        <section className="mb-12 md:mb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-sm font-alegreya uppercase tracking-wider text-[#0A4A4A] mb-2">
              {t("about.team.subtitle")}
            </h2>
            <h3 className="text-3xl md:text-4xl font-cormorant font-light text-slate-800 mb-6">
              {t("about.team.title")}
            </h3>
            <p className="text-slate-600 leading-relaxed font-alegreya">{t("about.team.paragraph")}</p>
          </div>
          {/* Placeholder for team members if you want to add them later */}
          <div className="relative h-80 md:h-[450px] rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
            <Image
              src="/about3.png"
              alt={t("about.team.imageAlt")}
              layout="fill"
              objectFit="cover"
              className="transform transition-transform duration-500 hover:scale-105"
            />
          </div>
        </section>

        {/* Find Us Section */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-sm font-alegreya uppercase tracking-wider text-[#0A4A4A] mb-2">
              {t("about.findUs.subtitle")}
            </h2>
            <h3 className="text-3xl md:text-4xl font-cormorant font-light text-slate-800 mb-6">
              {t("about.findUs.title")}
            </h3>
          </div>
          <div className="w-full h-[450px] md:h-[550px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={
                language === "de"
                  ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.580106920003!2d22.91887821530096!3d39.013693079500005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135c22c7aecd7b97%3A0xa531da7850f7780a!2z4JKE4JSm4JSU4JSt4JSC4JSh4JSmLCDQmtC-CFGHCF81LCDOmNGA0LXQu9GM0YHQutCwIDQ3MSAwMA!5e0!3m2!1sde!2sgr!4v1621500000000!5m2!1sde!2sgr"
                  : language === "en"
                    ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.580106920003!2d22.91887821530096!3d39.013693079500005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135c22c7aecd7b97%3A0xa531da7850f7780a!2z4JKE4JSm4JSU4JSt4JSC4JSh4JSmLCDQmtC-CFGHCF81LCDOmNGA0LXQu9GM0YHQutCwIDQ3MSAwMA!5e0!3m2!1sen!2sgr!4v1621500000000!5m2!1sen!2sgr"
                    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.580106920003!2d22.91887821530096!3d39.013693079500005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135c22c7aecd7b97%3A0xa531da7850f7780a!2z4JKE4JSm4JSU4JSt4JSC4JSh4JSmLCDQmtC-CFGHCF81LCDOmNGA0LXQu9GM0YHQutCwIDQ3MSAwMA!5e0!3m2!1sel!2sgr!4v1621500000000!5m2!1sel!2sgr"
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title={t("about.findUs.mapTitle")}
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
