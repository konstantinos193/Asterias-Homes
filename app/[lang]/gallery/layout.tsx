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
      title: "Φωτογραφίες - Asterias Apartments Κορωνησία | Γκαλερί Άρτα",
      description: "Γκαλερί φωτογραφιών των Asterias apartments (Asteria house) στην Κορωνησία Άρτας. Παραδοσιακά διαμερίσματα και τοπίο Αμβρακικού Κόλπου.",
      keywords: [
        "φωτογραφίες asterias κορωνησια",
        "γκαλερί κορωνησια",
        "asterias apartments photos",
        "κορωνησια φωτογραφίες",
        "αμβρακικος κολπος φωτο"
      ]
    },
    'en': {
      title: "Asterias Apartments Gallery - Photos Koronisia, Arta | Asterias Homes",
      description: "Photo gallery of Asterias apartments (Asteria house) in Koronisia, Arta. Traditional apartments and surroundings of Koronisia and Amvrakikos Gulf.",
      keywords: [
        "asterias apartments gallery",
        "asterias homes photos",
        "koronisia gallery",
        "koronisia photos",
        "amvrakikos gulf images",
        "asteria house koronisia"
      ]
    },
    'de': {
      title: "Fotogalerie - Asterias Apartments Koronisia | Asterias Homes",
      description: "Fotogalerie der Asterias Apartments (Asteria house) in Koronisia, Arta. Traditionelle Apartments und Umgebung des Ambrakischen Golfs.",
      keywords: [
        "asterias apartments fotos",
        "koronisia galerie",
        "amvrakikos golf bilder"
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
          url: "/gallery-landscape-1.jpeg",
          width: 1200,
          height: 630,
          alt: lang === 'el'
            ? "Γκαλερί Asterias Apartments - Κορωνησία"
            : "Asterias Apartments Gallery - Koronisia",
        }
      ],
      type: "website",
      locale: localeMap[lang] || 'en_US',
      siteName: "Asterias Homes",
      url: `${baseUrl}/${lang}/gallery`,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/gallery-landscape-1.jpeg"],
      creator: "@asterias_homes",
      site: "@asterias_homes",
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/gallery`,
      languages: {
        "en-US": `${baseUrl}/en/gallery`,
        "el-GR": `${baseUrl}/el/gallery`,
        "de-DE": `${baseUrl}/de/gallery`,
        "x-default": `${baseUrl}/en/gallery`,
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

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
