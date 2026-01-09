import OffersPageClient from "./OffersPageClient"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const baseUrl = 'https://asteriashome.gr'
  
  return {
    title: "Special Offers & Packages - Asterias Homes",
    description: "Discover our special offers and vacation packages at Asterias Homes. From early bird discounts to seasonal packages, find the perfect deal for your Greek getaway.",
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
      title: "Special Offers & Packages - Asterias Homes",
      description: "Discover our special offers and vacation packages at Asterias Homes.",
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