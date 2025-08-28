export const SEO_CONFIG = {
  site: {
    name: 'Asterias Homes',
    url: 'https://asteriashome.gr',
    description: 'Experience luxury vacation apartments in Koronisia, Arta, in the heart of Amvrakikos Gulf. 7 beautifully appointed apartments with modern amenities, surrounded by natural beauty and tranquility.',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'el', 'de'],
    contact: {
      phone: '+30 6972705881',
      email: 'asterias.apartmentskoronisia@gmail.com',
      address: {
        street: 'Koronisia',
        city: 'Koronisia',
        region: 'Arta',
        country: 'Greece',
        postalCode: '47100',
        coordinates: {
          latitude: 39.0742,
          longitude: 20.8244
        }
      }
    }
  },
  
  pages: {
    home: {
      title: 'Luxury Vacation Apartments in Koronisia, Arta',
      description: 'Experience luxury vacation apartments in Koronisia, Arta, in the heart of Amvrakikos Gulf. 7 beautifully appointed apartments with modern amenities, surrounded by natural beauty and tranquility.',
      keywords: [
        'vacation apartments Koronisia',
        'luxury accommodation Arta',
        'Greek holiday homes',
        'Amvrakikos Gulf apartments',
        'beachfront accommodation Greece',
        'Koronisia vacation rentals',
        'Arta tourism accommodation',
        'Greek island apartments'
      ],
      image: '/hero-1.png'
    },
    
    about: {
      title: 'About Asterias Homes - Luxury Accommodation in Koronisia',
      description: 'Discover the story behind Asterias Homes, a family-run luxury accommodation in the coastal village of Koronisia, just 20 minutes from Arta city.',
      keywords: [
        'about Asterias Homes',
        'Koronisia accommodation history',
        'family-run hotel Greece',
        'Arta coastal village',
        'Greek hospitality',
        'Amvrakikos Gulf accommodation'
      ],
      image: '/about-header.png'
    },
    
    rooms: {
      title: 'Luxury Apartments & Rooms in Koronisia',
      description: 'Explore our 7 beautifully appointed luxury apartments in Koronisia, Arta. Each apartment features modern amenities, stunning sea views, and comfortable accommodations.',
      keywords: [
        'luxury apartments Koronisia',
        'hotel rooms Arta',
        'Greek accommodation',
        'sea view apartments',
        'modern amenities Greece',
        'comfortable rooms Koronisia'
      ],
      image: '/rooms-header.png'
    },
    
    gallery: {
      title: 'Photo Gallery - Asterias Homes Koronisia',
      description: 'Browse our stunning photo gallery showcasing the beauty of Asterias Homes, our luxury apartments, and the breathtaking surroundings of Koronisia and Amvrakikos Gulf.',
      keywords: [
        'Asterias Homes photos',
        'Koronisia gallery',
        'apartment photos Greece',
        'Amvrakikos Gulf images',
        'Greek accommodation pictures',
        'vacation rental photos'
      ],
      image: '/gallery-header.png'
    },
    
    offers: {
      title: 'Special Offers & Packages - Asterias Homes',
      description: 'Discover our exclusive special offers and vacation packages at Asterias Homes. From early bird discounts to seasonal packages, find the perfect deal for your Greek getaway.',
      keywords: [
        'special offers Koronisia',
        'vacation packages Greece',
        'discount accommodation',
        'seasonal deals Arta',
        'Greek holiday packages',
        'early bird discounts'
      ],
      image: '/offers-header.png'
    },
    
    contact: {
      title: 'Contact Us - Asterias Homes Koronisia',
      description: 'Get in touch with Asterias Homes for bookings, inquiries, or information about our luxury apartments in Koronisia, Arta. We\'re here to help plan your perfect Greek vacation.',
      keywords: [
        'contact Asterias Homes',
        'Koronisia booking',
        'Greek accommodation contact',
        'Arta hotel inquiry',
        'vacation rental contact',
        'Greek holiday booking'
      ],
      image: '/contact-header.png'
    },
    
    bookings: {
      title: 'Book Your Stay - Asterias Homes Koronisia',
      description: 'Reserve your luxury apartment at Asterias Homes in Koronisia, Arta. Easy online booking for our 7 beautiful apartments with instant confirmation.',
      keywords: [
        'book Asterias Homes',
        'Koronisia reservation',
        'Greek accommodation booking',
        'online hotel booking',
        'vacation rental reservation',
        'Greek holiday booking'
      ],
      image: '/bookings-header.png'
    }
  },
  
  social: {
    facebook: 'https://www.facebook.com/asteriashomes',
    instagram: 'https://www.instagram.com/asteriashomes',
    twitter: 'https://twitter.com/asterias_homes'
  },
  
  analytics: {
    googleAnalytics: 'your-ga-tracking-id',
    googleTagManager: 'your-gtm-id',
    facebookPixel: 'your-fb-pixel-id'
  },
  
  performance: {
    preloadImages: [
      '/hero-1.png',
      '/hero-2.png',
      '/about-header.png',
      '/rooms-header.png'
    ],
    preconnectDomains: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://i.imgur.com'
    ],
    dnsPrefetchDomains: [
      '//fonts.googleapis.com',
      '//i.imgur.com'
    ]
  }
}

export const generatePageSEO = (pageKey: keyof typeof SEO_CONFIG.pages, customData?: Partial<typeof SEO_CONFIG.pages[keyof typeof SEO_CONFIG.pages]>) => {
  const pageConfig = SEO_CONFIG.pages[pageKey]
  return {
    ...pageConfig,
    ...customData
  }
}

export const generateCanonicalUrl = (path: string, language?: string) => {
  if (language && language !== 'en') {
    return `${SEO_CONFIG.site.url}/${language}${path}`
  }
  return `${SEO_CONFIG.site.url}${path}`
}

export const generateAlternateUrls = (path: string) => {
  return {
    'en-US': `${SEO_CONFIG.site.url}${path}`,
    'el-GR': `${SEO_CONFIG.site.url}/el${path}`,
    'de-DE': `${SEO_CONFIG.site.url}/de${path}`,
    'x-default': `${SEO_CONFIG.site.url}${path}`
  }
}
