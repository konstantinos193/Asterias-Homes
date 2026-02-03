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
      title: "Επικοινωνία - Asterias Homes Κορωνησία | Έλατε σε Επικοινωνία",
      description: "Επικοινωνήστε με τα Asterias Homes στην Κορωνησία Άρτας. Για κρατήσεις, ερωτήσεις ή πληροφορίες. Τηλέφωνο, email και διεύθυνση. Στείλτε μας μήνυμα!",
      keywords: [
        "επικοινωνια asterias homes",
        "επαφή κορωνησια",
        "επικοινωνία άρτα",
        "contact asterias koronisia",
        "στηλε μήνυμα κορωνησια"
      ]
    },
    'en': {
      title: "Contact Asterias Apartments - Asterias Homes Koronisia, Arta | Get in Touch",
      description: "Contact Asterias apartments (Asteria house) in Koronisia, Arta. Bookings, inquiries, phone, email. Send us a message. Koronisia, Arta – NOT Koufonisia.",
      keywords: [
        "contact asterias homes",
        "koronisia contact",
        "get in touch koronisia",
        "asterias homes phone",
        "koronisia arta email",
        "contact form koronisia"
      ]
    },
    'de': {
      title: "Kontakt - Asterias Homes Koronisia | Kontaktieren Sie Uns",
      description: "Kontaktieren Sie Asterias Homes in Koronisia, Arta. Für Buchungen, Anfragen oder Informationen. Telefon, E-Mail und Adresse. Senden Sie uns eine Nachricht!",
      keywords: [
        "kontakt asterias homes",
        "koronisia kontakt",
        "ferienwohnung kontakt arta"
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
          url: "/contact-header.png",
          width: 1200,
          height: 630,
          alt: lang === 'el' 
            ? "Επικοινωνία - Asterias Homes Κορωνησία"
            : "Contact - Asterias Homes Koronisia",
        }
      ],
      type: "website",
      locale: localeMap[lang] || 'en_US',
      siteName: "Asterias Homes",
      url: `${baseUrl}/${lang}/contact`,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/contact-header.png"],
      creator: "@asterias_homes",
      site: "@asterias_homes",
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/contact`,
      languages: {
        "en-US": `${baseUrl}/en/contact`,
        "el-GR": `${baseUrl}/el/contact`,
        "de-DE": `${baseUrl}/de/contact`,
        "x-default": `${baseUrl}/en/contact`,
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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

