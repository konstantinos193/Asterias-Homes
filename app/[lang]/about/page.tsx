import { Metadata } from "next"
import AboutPageClient from "./client"

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
      title: "Σχετικά με την Αστεριας Κορωνησία | 7 Διαμερίσματα Αμβρακικός Κόλπος Άρτα",
      description: "Αστεριας Κορωνησία: 7 παραδοσιακά διαμερίσματα διακοπών στην Κορωνησία Άρτας, Αμβρακικός Κόλπος. Ιστορία, τοποθεσία, παροχές. ΚΟΡΩΝΗΣΙΑ, ΑΡΤΑ – ΟΧΙ Κουφονήσια. Από €80/νύχτα.",
      keywords: [
        "αστεριας κορωνησια",
        "αστεριας κορωνησια πληροφοριες",
        "κορωνησια διαμονη",
        "κορωνησια ξενοδοχεια",
        "αμβρακικος κολπος διαμονη",
        "αρτα διαμονη",
        "asterias apartments",
        "asteria house",
        "koronisia apartments",
        "παραδοσιακα διαμερισματα αρτα",
        "κορωνησια παροχες",
        "αμβρακικος κολπος πληροφοριες",
        "koronisia arta",
        "asterias homes about",
        "κορωνησια ΟΧΙ κουφονήσια",
        "κορωνησια αρτα"
      ]
    },
    'en': {
      title: "About Asterias Homes | 7 Traditional Apartments Amvrakikos Gulf Arta Greece",
      description: "Asterias Homes: 7 traditional holiday apartments in Koronisia, Arta, Greece by the Amvrakikos Gulf. History, location, amenities. KORONISIA, ARTA – NOT Koufonisia. From €80/night.",
      keywords: [
        "asterias homes",
        "asterias apartments",
        "asteria house",
        "koronisia apartments",
        "koronisia greece",
        "koronisia accommodation",
        "amvrakikos gulf apartments",
        "arta greece accommodation",
        "traditional greek apartments",
        "holiday apartments greece",
        "koronisia arta greece",
        "about asterias homes",
        "koronisia NOT koufonisia",
        "greek holiday homes arta",
        "amvrakikos gulf location"
      ]
    },
    'de': {
      title: "Über Asterias Homes | Traditionelle Ferienwohnungen Koronisia Arta Griechenland",
      description: "Entdecken Sie Asterias Homes - 7 traditionelle Ferienwohnungen in Koronisia, Arta, Griechenland am Ambrakischen Golf. Unsere Geschichte, Lage und Ausstattung. KORONISIA, ARTA - NICHT Koufonisia.",
      keywords: [
        "über asterias homes",
        "koronisia arta information",
        "ambrakischer golf lage",
        "traditionelle wohnungen griechenland",
        "ferienwohnungen koronisia über uns"
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
      url: `${baseUrl}/${lang}/about`,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/about`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function AboutPage() {
  return <AboutPageClient />
}