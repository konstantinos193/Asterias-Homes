import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  structuredData?: object
  canonical?: string
  noindex?: boolean
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  image = '/hero-1.png',
  url,
  type = 'website',
  structuredData,
  canonical,
  noindex = false
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | Asterias Homes` : 'Asterias Homes | Traditional Holiday Apartments in Koronisia, Arta'
  const fullDescription = description || 'Traditional, classic holiday apartments in Koronisia, Arta by the Amvrakikos Gulf. 7 well-maintained apartments with authentic charm. Quiet, clean, and welcoming.'
  const fullUrl = url ? `https://asteriashome.gr${url}` : 'https://asteriashome.gr'
  const fullImage = image.startsWith('http') ? image : `https://asteriashome.gr${image}`

  const defaultKeywords = [
    'Asterias Homes',
    'traditional apartments',
    'Koronisia',
    'Arta',
    'Greece',
    'Amvrakikos Gulf',
    'classic accommodation',
    'authentic Greek apartments',
    'traditional accommodation',
    'apartment rentals',
    'nature retreat',
    'Greek islands',
    'holiday apartments',
    'beachfront accommodation',
    'Greek vacation rentals',
    'family-run accommodation'
  ]

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])]

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="author" content="Asterias Homes" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
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
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  )
}
