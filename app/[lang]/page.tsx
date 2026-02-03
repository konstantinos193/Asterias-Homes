import HomePageClient from "@/app/HomePageClient"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const baseUrl = 'https://asteriashome.gr'
  
  const localeMap: Record<string, string> = {
    'en': 'en_US',
    'el': 'el_GR',
    'de': 'de_DE'
  }

  // Get current month for seasonal optimization
  const currentMonth = new Date().getMonth() + 1 // 1-12
  const isSummer = currentMonth >= 6 && currentMonth <= 8
  const isWinter = currentMonth >= 12 || currentMonth <= 2
  const isAutumn = currentMonth >= 9 && currentMonth <= 11
  const isSpring = currentMonth >= 3 && currentMonth <= 5
  
  // Seasonal messaging
  const seasonalText = isSummer 
    ? lang === 'el' ? 'Καλοκαιρινές διακοπές' : 'Summer vacation'
    : isWinter
    ? lang === 'el' ? 'Χειμερινή απόδραση' : 'Winter escape'
    : isAutumn
    ? lang === 'el' ? 'Φθινοπωρινή ανάπαυση' : 'Autumn retreat'
    : lang === 'el' ? 'Ανοιξιάτικες διακοπές' : 'Spring getaway'

  // Language-specific SEO content based on actual Search Console queries
  const seoContent: Record<string, {
    title: string
    description: string
    keywords: string[]
  }> = {
    'el': {
      title: "Αστεριας Κορωνησία - Asterias Apartments | Διαμερίσματα & Ξενοδοχεία Άρτα | Κράτηση Online",
      description: `${seasonalText} - Αστεριας Κορωνησία (Asterias apartments, Asteria house) – διαμερίσματα διακοπών στη Κορωνησία Άρτας, Αμβρακικό Κόλπο. 7 παραδοσιακά διαμερίσματα, κορωνησια ξενοδοχεία/διαμονή. ΚΟΡΩΝΗΣΙΑ, ΆΡΤΑ – ΟΧΙ Κουφονήσια. Κράτηση online, άμεση επιβεβαίωση. Από €80/νύχτα.`,
      keywords: [
        // Successful query - works!
        "αστεριας κορωνησια",
        "αστεριας κορωνησία",
        // High impressions, need optimization
        "κορωνησια διαμονη",
        "κορωνησια",
        "asterias apartments",
        "asteria house",
        "koronisia apartments",
        "κορωνησια ξενοδοχεια",
        // Misspellings and variations
        "κορονισια",
        "κορωνησια αρτα",
        "αμβρακικού",
        "αμβρακικος κολπος διαμονη",
        // Location combinations
        "άρτα διαμονη",
        "koronisia arta",
        "asterias koronisia",
        // Additional
        "asterias premium holiday apartments",
        "διαμερίσματα κορωνησια",
        "ξενώνες αμβρακικος κολπος",
        "κυνηγότοπο κορωνησια",
        "διακοπές κορωνησια",
        // NOT Koufonisia - clarification
        "asterias koronisia NOT koufonisia",
        "κορωνησια άρτα ΟΧΙ κουφονήσια"
      ]
    },
    'en': {
      title: "Asterias Apartments & Asteria House | Holiday Apartments Koronisia, Arta | Book Online",
      description: `${seasonalText} - Asterias apartments (Asteria house) – traditional holiday apartments in Koronisia, Arta, Greece by the Amvrakikos Gulf. Asterias premium holiday apartments. 7 well-maintained apartments, authentic Greek hospitality. KORONISIA, ARTA – NOT Koufonisia. Online booking, instant confirmation. From €80/night.`,
      keywords: [
        // International appeal keywords
        "holiday apartments greece",
        "greek vacation rentals",
        "greece accommodation",
        "traditional greek apartments",
        "holiday homes greece",
        // High impressions keywords
        "asterias apartments",
        "asteria house",
        "koronisia apartments",
        "koronisia greece",
        "koronisia accommodation",
        "koronisia hotels",
        // Location combinations - emphasize Greece
        "asterias koronisia arta greece",
        "koronisia arta greece",
        "greece koronisia",
        "greek islands accommodation",
        "mainland greece apartments",
        // Amvrakikos Gulf references
        "amvrakikos gulf apartments greece",
        "amvrakikos accommodation",
        // Additional
        "asterias premium holiday apartments greece",
        "traditional apartments koronisia greece",
        "greek holiday apartments arta",
        // NOT Koufonisia - strong disambiguation
        "koronisia NOT koufonisia",
        "asterias koronisia arta NOT koufonisia",
        "greece apartments koronisia",
        "asterias apartments koronisia arta greece"
      ]
    },
    'de': {
      title: "Asterias Homes Koronisia - Ferienwohnungen & Hotels in Arta, Griechenland | Online Buchen",
      description: `${isSummer ? 'Sommerferien' : isWinter ? 'Winterflucht' : isAutumn ? 'Herbsturlaub' : 'Frühlingsausflug'} - Asterias Homes Koronisia Arta - Entdecken Sie 7 traditionelle Ferienwohnungen am Ambrakischen Golf. Authentische griechische Gastfreundschaft. KORONISIA, ARTA - NICHT Koufonisia. Online-Buchung mit sofortiger Bestätigung.`,
      keywords: [
        "koronisia apartements",
        "asterias homes",
        "ferienwohnungen koronisia",
        "koronisia arta",
        "asterias koronisia arta",
        "unterkunft amvrakikos golf",
        "ambrakischer golf ferienwohnungen",
        "griechenland ferienwohnungen",
        "traditionelle wohnungen koronisia",
        "koronisia NICHT koufonisia",
        "online buchung koronisia"
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
      images: [
        {
          url: "/hero-1.png",
          width: 1200,
          height: 630,
          alt: lang === 'el' 
            ? "Asterias Homes - Διαμερίσματα διακοπών στην Κορωνησία, Ελλάδα"
            : "Asterias Homes - Traditional Holiday Apartments in Koronisia, Greece",
        }
      ],
      type: "website",
      locale: localeMap[lang] || 'en_US',
      siteName: "Asterias Homes",
      url: `${baseUrl}/${lang}`,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/hero-1.png"],
      creator: "@asterias_homes",
      site: "@asterias_homes",
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        "en-US": `${baseUrl}/en`,
        "el-GR": `${baseUrl}/el`,
        "de-DE": `${baseUrl}/de`,
        "x-default": `${baseUrl}/en`,
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
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
    },
  }
}

export default function Home() {
  // Page renders immediately - data fetching happens client-side with loading states
  return <HomePageClient />
} 