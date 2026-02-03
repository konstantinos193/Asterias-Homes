import Head from 'next/head'
import { 
  generateOrganizationSchema, 
  generatePlaceSchema, 
  generateHotelSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema 
} from './structured-data'

interface PageSEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  breadcrumbs?: Array<{name: string, url: string}>
  noindex?: boolean
  canonical?: string
  structuredData?: object[]
}

export default function PageSEO({
  title,
  description,
  keywords = [],
  image = '/welcome-new.jpg',
  url,
  type = 'website',
  breadcrumbs,
  noindex = false,
  canonical,
  structuredData = []
}: PageSEOProps) {
  const fullTitle = title ? `${title} | Asterias Homes` : 'Asterias Apartments | Holiday Apartments Koronisia, Arta – Asterias Homes'
  const fullDescription = description || 'Asterias apartments (Asteria house) – traditional holiday apartments in Koronisia, Arta by the Amvrakikos Gulf. Koronisia accommodation. Book online.'
  const fullUrl = url ? `https://asteriashome.gr${url}` : 'https://asteriashome.gr'
  const fullImage = image.startsWith('http') ? image : `https://asteriashome.gr${image}`

  const defaultKeywords = [
    'Asterias Homes',
    'asterias apartments',
    'asteria house',
    'asterias premium holiday apartments',
    'Koronisia',
    'koronisia apartments',
    'Arta',
    'Greece',
    'Amvrakikos Gulf',
    'holiday apartments Koronisia',
    'traditional accommodation',
    'apartment rentals',
    'Greek vacation rentals',
    'Koronisia hotels',
    'Arta tourism',
    'Greek holiday homes'
  ]

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])]

  // Default structured data
  const defaultStructuredData: object[] = [
    generateOrganizationSchema(),
    generatePlaceSchema(),
    generateHotelSchema(),
    generateLocalBusinessSchema()
  ]

  // Add breadcrumbs if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    defaultStructuredData.push(generateBreadcrumbSchema(breadcrumbs))
  }

  // Combine default and custom structured data
  const finalStructuredData = [...defaultStructuredData, ...structuredData]

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="author" content="Asterias Homes" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Asterias Homes" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="el_GR" />
      <meta property="og:locale:alternate" content="de_DE" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@asterias_homes" />
      <meta name="twitter:creator" content="@asterias_homes" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#8B4B5C" />
      <meta name="msapplication-TileColor" content="#8B4B5C" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Asterias Homes" />
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href={`https://asteriashome.gr/en${url || ''}`} />
      <link rel="alternate" hrefLang="el" href={`https://asteriashome.gr/el${url || ''}`} />
      <link rel="alternate" hrefLang="de" href={`https://asteriashome.gr/de${url || ''}`} />
      <link rel="alternate" hrefLang="x-default" href={`https://asteriashome.gr/en${url || ''}`} />
      
      {/* Structured Data */}
      {finalStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    </Head>
  )
}
