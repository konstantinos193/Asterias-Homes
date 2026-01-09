import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getBackendApiUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'
import { Offer } from '@/types/offers'
import OfferDetailPageClient from "./OfferDetailPageClient"

async function getOffer(offerId: string): Promise<Offer | null> {
  try {
    const backendUrl = getBackendApiUrl(`/api/offers/${offerId}`)
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
      next: { revalidate: 60 },
    })

    // If offer not found, return null (will trigger 404)
    if (response.status === 404) {
      return null
    }

    // If server error, log and return null (will trigger 404)
    if (!response.ok) {
      logger.error(`Backend responded with status ${response.status} for offer ${offerId}`)
      return null
    }

    const text = await response.text()
    if (!text) {
      logger.error(`Empty response from backend for offer ${offerId}`)
      return null
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      logger.error('JSON parse error in offer detail page', parseError as Error, { offerId, responseText: text })
      return null
    }

    // Normalize response structure - backend might return { offer: {...} } or direct object
    let rawOffer: any
    if (data && typeof data === 'object' && 'offer' in data) {
      rawOffer = data.offer
    } else {
      rawOffer = data
    }

    // Ensure id and _id are set
    const offerIdValue = rawOffer._id || rawOffer.id || offerId

    // Map and ensure all required fields are present
    const offer: Offer = {
      _id: offerIdValue,
      id: offerIdValue,
      title: rawOffer.title || '',
      titleKey: rawOffer.titleKey,
      description: rawOffer.description || '',
      descriptionKey: rawOffer.descriptionKey,
      discount: rawOffer.discount ?? 0,
      startDate: rawOffer.startDate ? new Date(rawOffer.startDate).toISOString() : new Date().toISOString(),
      endDate: rawOffer.endDate ? new Date(rawOffer.endDate).toISOString() : new Date().toISOString(),
      active: rawOffer.active ?? true, // Default to true if not provided
      image: rawOffer.image,
      applicableRooms: rawOffer.applicableRooms,
      minStay: rawOffer.minStay,
      maxStay: rawOffer.maxStay,
      conditions: rawOffer.conditions,
      code: rawOffer.code,
      badgeKey: rawOffer.badgeKey,
      roomTypeKey: rawOffer.roomTypeKey,
      includesKeys: rawOffer.includesKeys,
      featured: rawOffer.featured,
      createdAt: rawOffer.createdAt,
      updatedAt: rawOffer.updatedAt,
    }

    return offer
  } catch (error) {
    logger.error('Error fetching offer in server component', error as Error, { offerId })
    // Return null to trigger 404 instead of 500
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, offerId: string }> }): Promise<Metadata> {
  const { lang, offerId } = await params
  const baseUrl = 'https://asteriashome.gr'
  const offer = await getOffer(offerId)

  // If offer not found, return basic metadata
  if (!offer) {
    return {
      title: "Offer Not Found | Asterias Homes",
      description: "The requested offer could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const localeMap: Record<string, string> = {
    'en': 'en_US',
    'el': 'el_GR',
    'de': 'de_DE'
  }

  const offerTitle = offer.title || 'Special Offer'
  const offerDescription = offer.description || `Special offer: ${offer.discount || 0}% discount on traditional holiday apartments in Koronisia, Arta.`
  const offerImage = offer.image || '/hero-1.png'

  return {
    title: `${offerTitle} | Special Offer | Asterias Homes`,
    description: offerDescription,
    keywords: [
      "special offer Koronisia",
      "holiday discount Arta",
      "Koronisia vacation deals",
      "Amvrakikos Gulf special offers",
      `${offer.discount || 0}% discount Koronisia`,
    ],
    openGraph: {
      title: `${offerTitle} | Asterias Homes`,
      description: offerDescription,
      images: [
        {
          url: offerImage.startsWith('http') ? offerImage : `${baseUrl}${offerImage}`,
          width: 1200,
          height: 630,
          alt: `${offerTitle} - Special Offer in Koronisia`,
        }
      ],
      type: "website",
      locale: localeMap[lang] || 'en_US',
      siteName: "Asterias Homes",
      url: `${baseUrl}/${lang}/offers/${offerId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${offerTitle} | Asterias Homes`,
      description: offerDescription,
      images: [offerImage.startsWith('http') ? offerImage : `${baseUrl}${offerImage}`],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/offers/${offerId}`,
      languages: {
        "en-US": `${baseUrl}/en/offers/${offerId}`,
        "el-GR": `${baseUrl}/el/offers/${offerId}`,
        "de-DE": `${baseUrl}/de/offers/${offerId}`,
        "x-default": `${baseUrl}/en/offers/${offerId}`,
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

export default async function OfferDetailPage({ params }: { params: Promise<{ lang: string, offerId: string }> }) {
  const { lang, offerId } = await params
  
  // Fetch offer data server-side
  const offer = await getOffer(offerId)
  
  // If offer not found, return 404 page
  if (!offer) {
    notFound()
  }
  
  // Pass offer data to client component
  return <OfferDetailPageClient offerId={offerId} initialOffer={offer} />
} 