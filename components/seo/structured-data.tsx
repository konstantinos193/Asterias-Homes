export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Asterias Homes",
  "url": "https://asteriashome.gr",
  "logo": "https://asteriashome.gr/logo.png",
  "description": "Luxury vacation apartments in Koronisia, Arta, Greece",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Koronisia",
    "addressRegion": "Arta",
    "addressCountry": "GR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "telephone": "+30 6972705881",
    "email": "asterias.apartmentskoronisia@gmail.com",
    "availableLanguage": ["English", "Greek", "German"]
  },
  "sameAs": [
    "https://www.facebook.com/asteriashomes",
    "https://www.instagram.com/asteriashomes"
  ]
})

export const generatePlaceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Place",
  "name": "Asterias Homes",
  "description": "Luxury vacation apartments in Koronisia, Arta, Greece",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Koronisia",
    "addressRegion": "Arta",
    "addressCountry": "GR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "39.0742",
    "longitude": "20.8244"
  },
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Beach Access",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free WiFi",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Parking",
      "value": true
    }
  ]
})

export const generateHotelSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Asterias Homes",
  "description": "Luxury vacation apartments in Koronisia, Arta, Greece",
  "url": "https://asteriashome.gr",
  "telephone": "+30 6972705881",
  "email": "asterias.apartmentskoronisia@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Koronisia",
    "addressLocality": "Koronisia",
    "addressRegion": "Arta",
    "postalCode": "47100",
    "addressCountry": "GR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "39.0742",
    "longitude": "20.8244"
  },
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Beach Access",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free WiFi",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Parking",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Kitchen",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Air Conditioning",
      "value": true
    }
  ],
  "numberOfRooms": 7,
  "starRating": {
    "@type": "Rating",
    "ratingValue": "4.5"
  },
  "priceRange": "€€",
  "currenciesAccepted": "EUR"
})

export const generateApartmentSchema = (roomData: any) => ({
  "@context": "https://schema.org",
  "@type": "Apartment",
  "name": roomData.name || "Luxury Apartment",
  "description": roomData.description || "Beautifully appointed apartment with modern amenities",
  "numberOfRooms": roomData.rooms || 1,
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": roomData.size || 50,
    "unitCode": "MTK"
  },
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Kitchen",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Air Conditioning",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Balcony",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Sea View",
      "value": true
    }
  ],
  "image": roomData.images || [],
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": roomData.price || 80,
    "availability": "https://schema.org/InStock"
  }
})

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `https://asteriashome.gr${crumb.url}`
  }))
})

export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Asterias Homes",
  "description": "Luxury vacation apartments in Koronisia, Arta, Greece",
  "url": "https://asteriashome.gr",
  "telephone": "+30 6972705881",
  "email": "asterias.apartmentskoronisia@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Koronisia",
    "addressLocality": "Koronisia",
    "addressRegion": "Arta",
    "postalCode": "47100",
    "addressCountry": "GR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "39.0742",
    "longitude": "20.8244"
  },
  "openingHours": "Mo-Su 10:00-21:00",
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Credit Card",
  "areaServed": {
    "@type": "City",
    "name": "Koronisia, Arta, Greece"
  }
})
