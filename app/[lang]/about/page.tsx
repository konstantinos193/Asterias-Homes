"use client"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export default function AboutPage() {
  const { t, language } = useLanguage()

  return (
    <main className="bg-[#A9AEA2]/30 text-slate-800 pt-24 font-alegreya">
      {/* Hero Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          {/* Hero Image */}
          <div className="flex-1 flex justify-center">
            {/* IMG_4047.JPG */}
            <Image
              src="https://i.imgur.com/3g12fLV.jpeg"
              alt="Πανοραμική θέα Κορωνησίας"
              className="w-full max-w-md aspect-[4/3] rounded-lg shadow-lg object-cover"
              width={800}
              height={600}
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
          {/* Hero Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-cormorant font-bold mb-4">{t("about.heroTitle")}</h1>
            <div className="w-16 h-0.5 bg-[#0A4A4A] mb-6 mx-auto md:mx-0"></div>
            <p className="text-lg font-alegreya text-slate-700 mb-6">
              {t("about.heroDescription")}
            </p>
            <a
              href={`/${language}/bookings`}
              className="inline-block bg-[#8B4B5C] text-white font-alegreya px-6 py-3 rounded shadow hover:bg-[#A9AEA2] hover:text-[#8B4B5C] transition"
            >
              {t("about.bookNowButton")}
            </a>
          </div>
        </div>
      </section>

      {/* Location & Area */}
      <section className="py-14">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 order-2 md:order-1">
            <h2 className="text-2xl font-cormorant font-semibold mb-2">{t("about.locationTitle")}</h2>
            <div className="w-12 h-0.5 bg-[#0A4A4A] mb-4"></div>
            <p>
              {t("about.locationDescription")}
            </p>
            <p className="mt-2">
              {t("about.locationTime")}
            </p>
          </div>
          <div className="flex-1 order-1 md:order-2 flex justify-center">
            {/* IMG_4045.JPG */}
            <Image
              src="https://i.imgur.com/SerzvD0.jpeg"
              alt="Χάρτης ή τοποθεσία Κορωνησίας"
              className="w-full max-w-md aspect-[4/3] rounded-lg shadow object-cover"
              width={800}
              height={600}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="py-14 bg-white/80">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 flex justify-center">
            {/* IMG_3770.JPG replaced with external URL */}
            <Image
              src="https://i.imgur.com/gdFTHDu.jpeg"
              alt="Εμπειρίες/Ηλιοβασίλεμα/Δραστηριότητες"
              className="w-full max-w-md aspect-[4/3] rounded-lg shadow object-cover"
              width={800}
              height={600}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-cormorant font-semibold mb-2">{t("about.experiencesTitle")}</h2>
            <div className="w-12 h-0.5 bg-[#0A4A4A] mb-4"></div>
            <ul className="list-disc pl-6">
              <li>{t("about.experiences.item1")}</li>
              <li>{t("about.experiences.item2")}</li>
              <li>{t("about.experiences.item3")}</li>
              <li>{t("about.experiences.item4")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* For Whom */}
      <section className="py-14">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 order-2 md:order-1">
            <h2 className="text-2xl font-cormorant font-semibold mb-2">{t("about.forWhomTitle")}</h2>
            <div className="w-12 h-0.5 bg-[#0A4A4A] mb-4"></div>
            <ul className="list-disc pl-6">
              <li>{t("about.forWhom.item1")}</li>
              <li>{t("about.forWhom.item2")}</li>
              <li>{t("about.forWhom.item3")}</li>
              <li>{t("about.forWhom.item4")}</li>
            </ul>
          </div>
          <div className="flex-1 order-1 md:order-2 flex justify-center">
            {/* IMG_3765.JPG */}
            <Image
              src="https://i.imgur.com/TnCq8q1.jpeg"
              alt="Οικογένειες/Ζευγάρια/Τηλεργασία/Φυσιολάτρες"
              className="w-full max-w-md aspect-[4/3] rounded-lg shadow object-cover"
              width={800}
              height={600}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
        </div>
      </section>

      {/* Hotel Amenities */}
      <section className="py-14 bg-white/80">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 flex justify-center">
            {/* IMG_3546.JPG */}
            <Image
              src="https://i.imgur.com/KhgP0yg.jpeg"
              alt="Παροχές/Δωμάτια/Εξωτερικοί χώροι"
              className="w-full max-w-md aspect-[4/3] rounded-lg shadow object-cover"
              width={800}
              height={600}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-cormorant font-semibold mb-2">{t("about.amenitiesTitle")}</h2>
            <div className="w-12 h-0.5 bg-[#0A4A4A] mb-4"></div>
            <ul className="list-disc pl-6">
              <li>{t("about.amenities.item1")}</li>
              <li>{t("about.amenities.item2")}</li>
              <li>{t("about.amenities.item3")}</li>
              <li>{t("about.amenities.item4")}</li>
              <li>{t("about.amenities.item5")}</li>
              <li>{t("about.amenities.item6")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-cormorant font-bold mb-4">{t("gallery.title")}</h2>
          <div className="w-24 h-0.5 bg-[#0A4A4A] mb-6 mx-auto"></div>
          <p className="text-lg font-alegreya text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("gallery.description")}
          </p>
          
          {/* Gallery Preview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <Image
                  src={`https://i.imgur.com/${index === 1 ? '3g12fLV' : index === 2 ? 'SerzvD0' : index === 3 ? 'gdFTHDu' : 'TnCq8q1'}.jpeg`}
                  alt={`Gallery preview ${index}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
            ))}
          </div>
          
          {/* Gallery CTA Button */}
          <a
            href={`/${language}/gallery`}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8B4B5C] to-[#0A4A4A] text-white font-alegreya px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
          >
            <span>📸</span>
            {t("gallery.title")}
            <span>→</span>
          </a>
        </div>
      </section>
    </main>
  )
} 