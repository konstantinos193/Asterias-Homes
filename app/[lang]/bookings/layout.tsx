import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const baseUrl = 'https://asteriashome.gr'

  const localeMap: Record<string, string> = {
    'en': 'en_US',
    'el': 'el_GR',
    'de': 'de_DE'
  }

  const seoContent: Record<string, {
    title: string
    description: string
    keywords: string[]
  }> = {
    'el': {
      title: "Κράτηση Online - Asterias Homes Κορωνησία | Διαμερίσματα Άρτα",
      description: "Κράτηση διαμερισμάτων διακοπών στην Κορωνησία Άρτας. Αστεριας Κορωνησία - Κράτηση online με άμεση επιβεβαίωση. Ελέγξε διαθεσιμότητα και κράτησε άμεσα!",
      keywords: [
        "κρατηση διαμερισμάτων κορωνησια",
        "online booking koronisia",
        "διαθεσιμότητα κορωνησια",
        "κράτηση asterias homes",
        "book koronisia arta",
        "reservation asterias"
      ]
    },
    'en': {
      title: "Book Asterias Apartments - Online Booking Koronisia, Arta | Asterias Homes",
      description: "Book Asterias apartments (Asteria house) in Koronisia, Arta. Online booking with instant confirmation. Check availability and book now. Koronisia, Arta – NOT Koufonisia.",
      keywords: [
        "book koronisia",
        "online booking koronisia arta",
        "asterias homes booking",
        "reserve koronisia apartments",
        "koronisia arta booking",
        "book holiday apartments arta"
      ]
    },
    'de': {
      title: "Online Buchen - Asterias Homes Koronisia | Ferienwohnungen Arta",
      description: "Buchen Sie Ihre Ferienwohnung in Koronisia, Arta. Asterias Homes - Online-Buchung mit sofortiger Bestätigung. Verfügbarkeit prüfen und jetzt buchen!",
      keywords: [
        "buchen koronisia",
        "online buchung koronisia arta",
        "asterias homes buchung",
        "ferienwohnung buchen arta"
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
          url: "/bookings-header.png",
          width: 1200,
          height: 630,
          alt: lang === 'el' 
            ? "Κράτηση διαμερισμάτων - Asterias Homes Κορωνησία"
            : "Book Holiday Apartments - Asterias Homes Koronisia",
        }
      ],
      type: "website",
      locale: localeMap[lang] || 'en_US',
      siteName: "Asterias Homes",
      url: `${baseUrl}/${lang}/bookings`,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/bookings-header.png"],
      creator: "@asterias_homes",
      site: "@asterias_homes",
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/bookings`,
      languages: {
        "en-US": `${baseUrl}/en/bookings`,
        "el-GR": `${baseUrl}/el/bookings`,
        "de-DE": `${baseUrl}/de/bookings`,
        "x-default": `${baseUrl}/en/bookings`,
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

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

