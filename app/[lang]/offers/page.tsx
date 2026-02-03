import OffersPageClient from "./OffersPageClient"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const baseUrl = 'https://asteriashome.gr'
  
  return {
    title: "Special Offers - Asterias Apartments Koronisia, Arta | Asterias Homes",
    description: "Special offers and packages at Asterias apartments (Asteria house) in Koronisia, Arta. Early bird discounts, seasonal packages. Book your Greek getaway.",
    keywords: [
      "asterias apartments offers",
      "koronisia special offers",
      "asterias homes packages",
      "koronisia arta deals",
      "holiday packages koronisia"
    ],
    alternates: {
      canonical: `${baseUrl}/${lang}/offers`,
      languages: {
        "en-US": `${baseUrl}/en/offers`,
        "el-GR": `${baseUrl}/el/offers`,
        "de-DE": `${baseUrl}/de/offers`,
        "x-default": `${baseUrl}/en/offers`,
      },
    },
    openGraph: {
      title: "Special Offers - Asterias Apartments Koronisia, Arta | Asterias Homes",
      description: "Special offers and packages at Asterias apartments in Koronisia, Arta. Early bird and seasonal deals.",
      url: `${baseUrl}/${lang}/offers`,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function OffersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <OffersPageClient />
} 