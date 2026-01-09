export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Asterias Homes",
  "alternateName": ["Asteria House Koronisia", "Αστεριας Κορωνησία", "Asterias Koronisia Arta"],
  "url": "https://asteriashome.gr",
  "logo": "https://asteriashome.gr/logo.png",
  "description": "Asterias Homes (Αστεριας Κορωνησία) - Traditional holiday apartments in Koronisia, Arta, Greece by the Amvrakikos Gulf. Located in KORONISIA, ARTA - NOT Koufonisia, NOT Kefalonia. Book online with instant confirmation.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Koronisia",
    "addressRegion": "Arta",
    "addressCountry": "GR",
    "streetAddress": "Koronisia, Arta"
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
  "alternateName": "Asteria House Koronisia Arta",
  "description": "Holiday apartments in Koronisia, Arta, Greece (NOT Koufonisia). Located by the Amvrakikos Gulf. 7 traditional apartments with authentic Greek hospitality. Book online.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Koronisia Village",
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
    }
  ]
})

export const generateHotelSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Asterias Homes",
  "alternateName": [
    "Asteria House Koronisia", 
    "Asterias Premium Holiday Apartments",
    "Αστεριας Κορωνησία",
    "Asterias Koronisia Arta Greece",
    "Koronisia Apartments Greece",
    "Greek Holiday Apartments Koronisia"
  ],
  "description": "Asterias Homes (Αστεριας Κορωνησία) - Traditional Greek holiday apartments in Koronisia, Arta, Greece by the Amvrakikos Gulf. Perfect for international travelers visiting Greece. KORONISIA, ARTA, GREECE - NOT Koufonisia, NOT Kefalonia. 7 traditional apartments with authentic Greek hospitality. Online booking with instant confirmation. From €80/night.",
  "url": "https://asteriashome.gr",
  "telephone": "+30 6972705881",
  "email": "asterias.apartmentskoronisia@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Koronisia Village",
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
  "name": roomData.name || "Traditional Apartment",
  "description": roomData.description || "Well-maintained traditional apartment with authentic charm",
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
  "alternateName": ["Asteria House Koronisia Arta Greece", "Greek Holiday Apartments Koronisia"],
  "description": "Traditional Greek holiday apartments and accommodation in Koronisia, Arta, Greece. Perfect for international visitors to Greece. Located by the Amvrakikos Gulf. NOT Koufonisia. Book online with instant confirmation. From €80/night.",
  "url": "https://asteriashome.gr",
  "telephone": "+30 6972705881",
  "email": "asterias.apartmentskoronisia@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Koronisia Village",
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
  "areaServed": [
    {
      "@type": "City",
      "name": "Koronisia, Arta, Greece"
    },
    {
      "@type": "Country",
      "name": "Greece"
    }
  ],
  "keywords": "κορωνησια διαμονη, holiday apartments greece, greek vacation rentals, koronisia apartments greece, asterias apartments, koronisia NOT koufonisia"
})
