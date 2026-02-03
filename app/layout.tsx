import type { Metadata, Viewport } from "next"
import type React from "react"
import { Cormorant, Alegreya_Sans as Alegreya } from "next/font/google"
import "./globals.css"
import "leaflet/dist/leaflet.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/hooks/use-auth'
import { MemoryMonitorInit } from "@/components/memory-monitor-init"
import { QueryProvider } from "@/lib/query-client"

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
    default: "Asterias Apartments | Holiday Apartments Koronisia, Arta – Asterias Homes",
    template: "%s | Asterias Homes",
  },
  description:
    "Asterias apartments (Asteria house) – traditional holiday apartments in Koronisia, Arta. 7 cozy apartments with authentic charm by the Amvrakikos Gulf. Asterias premium holiday apartments. Koronisia accommodation. Book online.",
  keywords: [
    "Asterias Homes",
    "asterias apartments",
    "asteria house",
    "asterias premium holiday apartments",
    "Koronisia",
    "koronisia apartments",
    "κορωνησια ξενοδοχεια",
    "Arta",
    "Greece",
    "Amvrakikos Gulf",
    "traditional apartments",
    "holiday apartments Koronisia",
    "classic accommodation",
    "authentic Greek apartments",
    "apartment rentals",
    "nature retreat",
    "7 apartments",
    "beachfront accommodation",
    "Greek vacation rentals",
    "Koronisia hotels",
    "Arta tourism",
    "Greek holiday homes",
    "family-run accommodation"
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
    title: "Asterias Apartments | Holiday Apartments Koronisia, Arta – Asterias Homes",
    description:
      "Asterias apartments (Asteria house) – traditional holiday apartments in Koronisia, Arta. Koronisia accommodation by the Amvrakikos Gulf. Book online.",
    siteName: "Asterias Homes",
    images: [
      {
        url: "/welcome-new.jpg",
        width: 1200,
        height: 630,
        alt: "Asterias Homes - Traditional Apartments in Koronisia",
      },
      {
        url: "/hero-2.png",
        width: 1200,
        height: 630,
        alt: "Asterias Homes - Traditional Apartments in Koronisia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asterias Apartments | Holiday Apartments Koronisia, Arta – Asterias Homes",
    description:
      "Asterias apartments (Asteria house) – traditional holiday apartments in Koronisia, Arta. Koronisia accommodation. Book online.",
    images: ["/welcome-new.jpg"],
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
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.png",
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
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Asterias Homes",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  generator: 'Next.js'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${alegreya.variable}`}>
        <MemoryMonitorInit />
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
              <main>{children}</main>
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
