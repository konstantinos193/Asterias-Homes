import { Metadata } from 'next'
import { getDictionary } from '@/contexts/language-context'
import SuccessPageClient from './SuccessPageClient'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const baseUrl = 'https://asteriashome.gr'
  const translations = await getDictionary(lang as any)

  const getNestedValue = (obj: any, path: string): string => {
    const keys = path.split(".")
    let current = obj
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key]
      } else {
        return ""
      }
    }
    return typeof current === "string" ? current : ""
  }

  const localeMap: Record<string, string> = {
    'en': 'en_US',
    'el': 'el_GR',
    'de': 'de_DE'
  }

  return {
    title: "Booking Confirmation | Asterias Homes",
    description: "Your booking has been confirmed! View your booking details and confirmation information for your stay at Asterias Homes in Koronisia, Arta.",
    keywords: [
      "booking confirmation Koronisia",
      "reservation details Arta",
      "Asterias Homes booking",
      "holiday apartment confirmation",
      "Amvrakikos Gulf reservation",
    ],
    openGraph: {
      title: "Booking Confirmation | Asterias Homes",
      description: "Your booking has been confirmed! View your booking details and confirmation information.",
      images: [
        {
          url: `${baseUrl}/hero-1.png`,
          width: 1200,
          height: 630,
          alt: "Booking Confirmation - Asterias Homes",
        }
      ],
      type: "website",
      locale: localeMap[lang] || 'en_US',
      siteName: "Asterias Homes",
      url: `${baseUrl}/${lang}/success`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Booking Confirmation | Asterias Homes",
      description: "Your booking has been confirmed! View your booking details.",
      images: [`${baseUrl}/hero-1.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/success`,
      languages: {
        "en-US": `${baseUrl}/en/success`,
        "el-GR": `${baseUrl}/el/success`,
        "de-DE": `${baseUrl}/de/success`,
        "x-default": `${baseUrl}/en/success`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

export default function SuccessPage({ params }: { params: Promise<{ lang: string }> }) {
  return <SuccessPageClient params={params} />
}
