import { Metadata } from "next"
import GalleryPageClient from "./client"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const baseUrl = 'https://asteriashome.gr'
  
  const localeMap: Record<string, string> = {
    'en': 'en_US',
    'el': 'el_GR',
    'de': 'de_DE'
  }

  // Language-specific SEO content based on Search Console data
  const seoContent: Record<string, {
    title: string
    description: string
    keywords: string[]
  }> = {
    'el': {
      title: "Φωτογραφίες Αστεριας Κορωνησια | Εικόνες & Βίντεο Άρτα Greece",
      description: "Δείτε φωτογραφίες από την Αστεριας Κορωνησια - ηλιοβασιλέματα, τοπία, την Κορωνησία Άρτας. Αμβρακικός Κόλπος. ΚΟΡΩΝΗΣΙΑ, ΑΡΤΑ – ΟΧΙ Κουφονήσια.",
      keywords: [
        "αστεριας κορωνησια φωτογραφιες",
        "κορωνησια εικονες",
        "αμβρακικος κολπος φωτο",
        "koronisia arta photos",
        "ηλιοβασιλεμα κορωνησια",
        "asteria house gallery",
        "κορωνησια τοπιο",
        "αρτα φωτογραφιες"
      ]
    },
    'en': {
      title: "Asterias Homes Gallery | Photos & Videos Koronisia Arta Greece",
      description: "View photos of Asterias Homes - sunsets, landscapes, Koronisia Arta, Greece. Amvrakikos Gulf. KORONISIA, ARTA – NOT Koufonisia.",
      keywords: [
        "asterias homes photos",
        "koronisia gallery images",
        "amvrakikos gulf pictures",
        "koronisia greece photography",
        "asteria house photos",
        "koronisia sunset images",
        "arta greece landscape photos",
        "greek coastal photography"
      ]
    },
    'de': {
      title: "Asterias Homes Galerie | Fotos & Videos Koronisia Arta Griechenland",
      description: "Fotos von Asterias Homes - Sonnenuntergänge, Landschaften, Koronisia Arta, Griechenland. Ambrakischer Golf. KORONISIA, ARTA - NICHT Koufonisia.",
      keywords: [
        "asterias homes fotos",
        "koronisia galerie bilder",
        "ambrakischer golf fotos",
        "griechenland sonnenuntergang bilder",
        "koronisia landschaftsfotos"
      ]
    }
  }

  const content = seoContent[lang] || seoContent['en']
  
  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    openGraph: {
      title: content.title,
      description: content.description,
      type: "website",
      locale: localeMap[lang] || 'en_US',
      url: `${baseUrl}/${lang}/gallery`,
      images: [
        {
          url: "/gallery-sunset-1.jpeg",
          width: 1200,
          height: 800,
          alt: "Asterias Homes Gallery - Sunset over Koronisia"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/gallery-sunset-1.jpeg"],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/gallery`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function GalleryPage() {
  return <GalleryPageClient />
}