import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://asteriashome.gr'
  const currentDate = new Date()

  // Only include pages that actually exist - all pages are under [lang] route
  // Root page redirects to language-specific pages
  const languages = ['en', 'el', 'de']
  
  // Main language-specific pages
  const languagePages = languages.flatMap(lang => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/${lang}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${lang}/rooms`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}/gallery`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/${lang}/offers`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${lang}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/${lang}/bookings`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}/success`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ])

  // Room detail pages - only include language-specific routes
  // Note: Room IDs will need to be fetched dynamically in production
  // For now, using placeholder structure
  const languageRoomPages = languages.flatMap(lang =>
    Array.from({ length: 7 }, (_, i) => ({
      url: `${baseUrl}/${lang}/rooms/${i + 1}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  // Offer detail pages - only include language-specific routes
  const offerSlugs = [
    'autumn-retreat',
    'early-bird',
    'family-fun',
    'honeymoon-package',
    'last-minute',
    'romantic-weekend',
    'summer-escape',
    'weekend-getaway',
    'winter-escape'
  ]
  
  const languageOfferPages = languages.flatMap(lang =>
    offerSlugs.map(offerSlug => ({
      url: `${baseUrl}/${lang}/offers/${offerSlug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  return [
    // Root page (will redirect to /en)
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...languagePages,
    ...languageRoomPages,
    ...languageOfferPages,
  ]
}
