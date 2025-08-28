import type { Metadata } from "next"
import type React from "react"
import { Cormorant, Alegreya_Sans as Alegreya } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/hooks/use-auth'

const cormorant = Cormorant({
  subsets: ["latin", "latin-ext"],
  variable: "--font-cormorant",
  display: "swap",
})

const alegreya = Alegreya({
  subsets: ["latin", "greek", "latin-ext"],
  weight: ["400"],
  variable: "--font-alegreya",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Asterias Homes | Luxury Vacation Apartments in Koronisia, Arta",
    template: "%s | Asterias Homes",
  },
  description:
    "Experience luxury vacation apartments in Koronisia, Arta, in the heart of Amvrakikos Gulf. 7 beautifully appointed apartments with modern amenities, surrounded by natural beauty and tranquility.",
  keywords: [
    "Asterias Homes",
    "vacation apartments",
    "Koronisia",
    "Arta",
    "Greece",
    "Amvrakikos Gulf",
    "luxury accommodation",
    "apartment rentals",
    "nature retreat",
    "Greek islands",
    "holiday apartments",
    "7 apartments",
    "beachfront accommodation",
    "Greek vacation rentals",
    "Amvrakikos accommodation",
    "Koronisia hotels",
    "Arta tourism",
    "Greek holiday homes"
  ],
  authors: [{ name: "adinfinity" }],
  creator: "adinfinity",
  publisher: "Asterias Homes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://asteriashome.gr"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "el-GR": "/el",
      "de-DE": "/de",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://asteriashome.gr",
    title: "Asterias Homes | Luxury Vacation Apartments in Koronisia, Arta",
    description:
      "Experience luxury vacation apartments in Koronisia, Arta, in the heart of Amvrakikos Gulf. 7 beautifully appointed apartments with modern amenities.",
    siteName: "Asterias Homes",
    images: [
      {
        url: "/hero-1.png",
        width: 1200,
        height: 630,
        alt: "Asterias Homes - Luxury Vacation Apartments in Greece",
      },
      {
        url: "/hero-2.png",
        width: 1200,
        height: 630,
        alt: "Asterias Homes - Luxury Vacation Apartments in Greece",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asterias Homes | Luxury Vacation Apartments in Koronisia, Arta",
    description:
      "Experience luxury vacation apartments in Koronisia, Arta, in the heart of Amvrakikos Gulf. 7 beautifully appointed apartments with modern amenities.",
    images: ["/hero-1.png"],
    creator: "@asterias_homes",
    site: "@asterias_homes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "https://i.imgur.com/znGgwJY.png", sizes: "16x16", type: "image/png" },
      { url: "https://i.imgur.com/znGgwJY.png", sizes: "32x32", type: "image/png" },
      { url: "https://i.imgur.com/znGgwJY.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "https://i.imgur.com/znGgwJY.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-touch-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-touch-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-touch-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-touch-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-touch-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-touch-icon-57x57.png", sizes: "57x57", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.png",
        color: "#8B4B5C",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#8B4B5C",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#8B4B5C",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  generator: 'Next.js'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${alegreya.variable}`}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
