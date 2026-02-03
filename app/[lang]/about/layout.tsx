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
      title: "Σχετικά - Asterias Homes Κορωνησία | Η Ιστορία Μας",
      description: "Ανακάλυψε την ιστορία των Asterias Homes στην Κορωνησία Άρτας. Παραδοσιακά διαμερίσματα διακοπών στον Αμβρακικό Κόλπο. Γνωρίστε μας και το χωριό μας.",
      keywords: [
        "σχετικα asterias homes",
        "ιστορία κορωνησια",
        "γνωρίστε μας",
        "about asterias koronisia",
        "κορωνησια ιστορία",
        "αμβρακικος κολπος διαμονη"
      ]
    },
    'en': {
      title: "About Asterias Apartments - Asterias Homes Koronisia, Arta | Our Story",
      description: "Discover the story of Asterias apartments (Asteria house) in Koronisia, Arta. Traditional holiday apartments by the Amvrakikos Gulf. Learn about us and our village. Koronisia, Arta – NOT Koufonisia.",
      keywords: [
        "about asterias homes",
        "koronisia story",
        "learn about koronisia",
        "amvrakikos gulf accommodation",
        "koronisia arta history",
        "traditional apartments koronisia"
      ]
    },
    'de': {
      title: "Über Uns - Asterias Homes Koronisia | Unsere Geschichte",
      description: "Entdecken Sie die Geschichte von Asterias Homes in Koronisia, Arta. Traditionelle Ferienwohnungen am Ambrakischen Golf. Erfahren Sie mehr über uns und unser Dorf.",
      keywords: [
        "über asterias homes",
        "koronisia geschichte",
        "traditionelle ferienwohnungen koronisia"
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
          url: "/about-header.png",
          width: 1200,
          height: 630,
          alt: lang === 'el' 
            ? "Σχετικά με τα Asterias Homes - Κορωνησία"
            : "About Asterias Homes - Koronisia",
        }
      ],
      type: "website",
      locale: localeMap[lang] || 'en_US',
      siteName: "Asterias Homes",
      url: `${baseUrl}/${lang}/about`,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/about-header.png"],
      creator: "@asterias_homes",
      site: "@asterias_homes",
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/about`,
      languages: {
        "en-US": `${baseUrl}/en/about`,
        "el-GR": `${baseUrl}/el/about`,
        "de-DE": `${baseUrl}/de/about`,
        "x-default": `${baseUrl}/en/about`,
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

