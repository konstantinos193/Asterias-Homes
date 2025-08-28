import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://asteriashome.gr'
  const currentDate = new Date()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rooms`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/bookings`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Language-specific pages
  const languages = ['en', 'el', 'de']
  const languagePages = languages.flatMap(lang => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
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
  ])

  // Room pages (assuming 7 rooms)
  const roomPages = Array.from({ length: 7 }, (_, i) => ({
    url: `${baseUrl}/rooms/${i + 1}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Language-specific room pages
  const languageRoomPages = languages.flatMap(lang =>
    Array.from({ length: 7 }, (_, i) => ({
      url: `${baseUrl}/${lang}/rooms/${i + 1}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  // Offer pages (assuming 8 offers based on the public/offers folder)
  const offerPages = [
    'autumn-retreat',
    'early-bird',
    'family-fun',
    'honeymoon-package',
    'last-minute',
    'romantic-weekend',
    'summer-escape',
    'weekend-getaway',
    'winter-escape'
  ].map(offer => ({
    url: `${baseUrl}/offers/${offer}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Language-specific offer pages
  const languageOfferPages = languages.flatMap(lang =>
    offerPages.map(offer => ({
      url: `${baseUrl}/${lang}/offers/${offer.url.split('/').pop()}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  return [
    ...staticPages,
    ...languagePages,
    ...roomPages,
    ...languageRoomPages,
    ...offerPages,
    ...languageOfferPages,
  ]
}
