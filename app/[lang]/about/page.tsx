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
      title: "Σχετικά με την Αστεριας Κορωνησια | Παραδοσιακά Διαμερίσματα Άρτα",
      description: "Μάθετε για την Αστεριας Κορωνησια - 7 παραδοσιακά διαμερίσματα διακοπών στην Κορωνησία Άρτας, Αμβρακικός Κόλπος. Ιστορία, τοποθεσία, παροχές. ΚΟΡΩΝΗΣΙΑ, ΑΡΤΑ – ΟΧΙ Κουφονήσια.",
      keywords: [
        "αστεριας κορωνησια πληροφοριες",
        "αστεριας κορωνησια ιστορια",
        "κορωνησια διαμονη παροχες",
        "koronisia arta about",
        "αμβρακικος κολπος πληροφοριες",
        "παραδοσιακα διαμερισματα αρτα",
        "asterias homes about",
        "κορωνησια ξενοδοχεια πληροφοριες"
      ]
    },
    'en': {
      title: "About Asterias Homes | Traditional Apartments Koronisia Arta Greece",
      description: "Discover Asterias Homes - 7 traditional holiday apartments in Koronisia, Arta, Greece by the Amvrakikos Gulf. Learn about our history, location, and amenities. KORONISIA, ARTA – NOT Koufonisia.",
      keywords: [
        "about asterias homes",
        "asterias koronisia history",
        "koronisia greece information",
        "amvrakikos gulf location",
        "traditional apartments greece",
        "koronisia arta about",
        "asteria house koronisia",
        "greek accommodation information"
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