"use client"
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export type LanguageCode = "el" | "en" | "de"

// Helper function to get nested values from an object using a dot-separated string
const getNestedValue = (obj: any, path: string): string | undefined => {
  const keys = path.split(".")
  let current = obj
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }
  return typeof current === "string" ? current : undefined
}

interface Translations {
  [key: string]: any // Can be a string or a nested object
}

interface LanguageContextProps {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: string, defaultValue?: string, replacements?: Record<string, string | number>) => string
}

const translationsData: Record<LanguageCode, Translations> = {
  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      confirm: "Confirm",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      save: "Save",
      close: "Close",
      search: "Search",
      reset: "Reset",
      actions: "Actions",
      createdAt: "Created At",
      updatedAt: "Updated At",
      id: "ID",
    },
    nav: {
      home: "Home",
      about: "About",
      rooms: "Apartments",
      bookings: "Bookings",
      contact: "Contact",
      book: "Book Now",
      admin: "Admin",
    },
    languageSelector: {
      titleMobile: "Language",
    },
    logo: {
      alt: "Asterias Homes Logo",
      altPublic: "Asterias Homes Logo",
    },
    header: {
      openMenu: "Open main menu",
      closeMenu: "Close main menu",
    },
    hero: {
      slide1: {
        title: "Koronisia",
        subtitle: "Where Tranquility Has a Voice",
      },
      slide2: {
        title: "Luxury Apartments",
        subtitle: "In the Heart of Amvrakikos Gulf",
      },
      slide3: {
        title: "Unique Experience",
        subtitle: "Between Sea and Sky",
      },
      book: "Book Now",
    },
    welcome: {
      subtitle: "Welcome",
      title: "To luxury vacation apartments",
      paragraph1:
        "Experience authentic Greek hospitality in the serene beauty of Koronisia. Our 7 luxury apartments offer a perfect blend of traditional charm and modern comfort for your perfect getaway.",
      paragraph2:
        "Each apartment is uniquely designed to provide you with a home away from home experience at the Amvrakikos Gulf, where you can discover the unique tranquility our location offers.",
      button: "Explore Our Story",
    },
    rooms: {
      section: {
        subtitle: "Our Accommodations",
        title: "Our Apartments",
        description:
          "Discover our 7 luxury vacation apartments, each uniquely designed for your perfect stay in Koronisia.",
      },
      perNight: "/ night",
      viewAll: "View All Apartments",
      standard: {
        name: "Cozy Studio Apartment",
        description:
          "Comfortable studio apartment with modern amenities, perfect for couples. Features kitchenette, private bathroom, and balcony with garden views.",
      },
      family: {
        name: "Family Apartment",
        description:
          "Spacious two-bedroom apartment ideal for families. Features full kitchen, living area, and balcony with stunning views of the Amvrakikos Gulf.",
      },
      romantic: {
        name: "Sea View Apartment",
        description:
          "Premium apartment with panoramic sea views, perfect for couples. Features luxury amenities, private terrace, and romantic ambiance.",
      },
      twin: {
        name: "Twin Apartment",
        description:
          "Modern apartment with twin beds, perfect for friends or colleagues. Includes full kitchen and comfortable living space.",
      },
      suite: {
        name: "Deluxe Apartment",
        description:
          "Luxurious two-bedroom apartment with separate living area, full kitchen, and premium amenities for an exceptional stay.",
      },
      accessible: {
        name: "Accessible Apartment",
        description:
          "Thoughtfully designed apartment with accessible features, ensuring a comfortable stay for all guests.",
      },
      feature: {
        doubleBed: "Double Bed",
        ac: "Air Conditioning",
        wifi: "Free Wi-Fi",
        tv: "Television",
        upTo4: "Up to 4 guests",
        balcony: "Balcony",
        fridge: "Full Kitchen",
        seaView: "Sea View",
        whirlpool: "Whirlpool Bath",
        kingBed: "King Size Bed",
        breakfast: "Welcome Basket",
        sofaBed: "Sofa Bed",
        twinBeds: "Twin Beds",
        separateLivingArea: "Separate Living Area",
        accessible: "Accessible Features",
        kitchenette: "Kitchenette",
        fullKitchen: "Full Kitchen",
        privateTerrace: "Private Terrace",
      },
    },
    roomCard: {
      bookNow: "Book Apartment",
    },
    specialOffers: {
      title: "Special Offers",
      subtitle: "Take advantage of our exclusive deals",
      allOffers: "View All Offers",
      summerEscape: { title: "Summer Escape" },
      romanticWeekend: { title: "Romantic Weekend" },
      earlyBird: { title: "Early Bird Special" },
    },
    offers: {
      section: {
        subtitle: "Exclusive Deals",
        title: "Our Special Offers",
        description:
          "Discover our handpicked offers designed to make your apartment stay even more memorable. Book directly for the best rates and benefits.",
      },
      summerEscape: {
        title: "Summer Escape",
        description:
          "Enjoy a 20% discount on your summer apartment stay. Includes welcome basket and flexible check-in.",
        badge: "Hot Deal",
        roomType: "Studio Apartment",
        includes: {
          freeBreakfast: "Welcome Basket",
          welcomeWine: "Welcome Bottle of Wine",
          lateCheckout: "Flexible Check-out",
        },
      },
      romanticWeekend: {
        title: "Romantic Weekend",
        description:
          "Surprise your loved one with a romantic getaway. Champagne, dinner reservations, and flexible check-out included.",
        badge: "Couples' Favorite",
        roomType: "Sea View Apartment",
        includes: {
          champagne: "Bottle of Champagne",
          romanticDinner: "Restaurant Recommendations",
          lateCheckout: "Flexible Check-out",
          breakfastInRoom: "Welcome Basket",
        },
      },
      familyFun: {
        title: "Family Fun Package",
        description:
          "Create lasting memories with your family. Special rates for longer stays and family-friendly amenities.",
        roomType: "Family Apartment",
        includes: {
          freeKidsStay: "Special Family Rates",
          kidsActivities: "Local Activity Guide",
          familyBreakfast: "Welcome Family Basket",
        },
      },
      earlyBird: {
        title: "Early Bird Special",
        description: "Book in advance and save up to 25% on your apartment stay. Non-refundable.",
        badge: "Save Big!",
        includes: {
          discountAllRooms: "Discount on all apartments",
          freeUpgrade: "Free Apartment Upgrade (subject to availability)",
        },
      },
      lastMinute: {
        title: "Last Minute Deal",
        description: "Spontaneous trip? Get the best available rate for bookings made within 48 hours of arrival.",
        badge: "Book Now!",
        includes: {
          discount: "Special Discounted Rate",
          instantConfirmation: "Instant Confirmation",
        },
      },
      autumnRetreat: {
        title: "Autumn Retreat",
        description: "Experience the beauty of autumn in Koronisia with our special package.",
        badge: "Seasonal",
        includes: {
          freeTour: "Free Guided Local Tour",
          localWelcomeProducts: "Welcome Basket with Local Products",
        },
      },
      includes: "What's Included:",
      validUntil: "Valid until",
      daysRemaining: "Days remaining:",
      days: "days",
      from: "From",
      perNight: "/night",
      viewOffer: "View Offer",
      moreDetails: "More Details",
      viewAllOffers: "View All Offers",
    },
    featuresSection: {
      title: "Why Choose Asterias Homes?",
      subtitle: "Unforgettable Experiences Await You",
      item1: {
        title: "Prime Location",
        description:
          "Nestled in the heart of Koronisia, offering breathtaking views and easy access to local attractions.",
      },
      item2: {
        title: "Authentic Hospitality",
        description: "Experience genuine Greek warmth and personalized service from our dedicated team.",
      },
      item3: {
        title: "Home Away From Home",
        description:
          "Our apartments blend traditional aesthetics with modern amenities for a unique and comfortable stay.",
      },
      item4: {
        title: "Peaceful Retreat",
        description: "Escape the hustle and bustle and unwind in the tranquil surroundings of the Amvrakikos Gulf.",
      },
    },
    discover: {
      title: "Discover Koronisia",
      description:
        "A hidden gem in the Amvrakikos Gulf, Koronisia invites you to explore its serene landscapes, rich wildlife, and the timeless charm of a traditional fishing village. Your adventure starts at Asterias Homes.",
      button: "Learn More About The Area",
      imageAlt: "Sunset over Koronisia island",
    },
    highlights: {
      title: "Experiences in Koronisia",
      description: "Discover what makes our area unique",
      highlight1: {
        title: "Breathtaking Views",
        description:
          "Waking up to the serene Amvrakikos Gulf from our apartment balcony was unforgettable. The view was simply stunning!",
        author: "Maria K.",
      },
      highlight2: {
        title: "Warm & Welcoming",
        description:
          "The team at Asterias Homes made us feel like family. Their hospitality and attention to detail were exceptional.",
        author: "John & Sarah P.",
      },
      highlight3: {
        title: "Perfect Getaway",
        description:
          "Koronisia is a paradise, and Asterias Homes is the perfect place to experience it. Peaceful, beautiful, and truly relaxing.",
        author: "Nikos G.",
      },
    },
    footer: {
      description:
        "Asterias Homes, your serene getaway in Koronisia, offering 7 luxury vacation apartments with traditional charm and modern comfort by the Amvrakikos Gulf.",
      contact: "Contact Information",
      links: "Quick Links",
      copyright: "All rights reserved.",
      details: {
        address: "Koronisia, Arta, Greece",
        phone: {
          number: "+30 268 102 4047" // <-- put your real number here
        },
        email: {
          address: "asterias.apartmentskoronisia@gmail.com"
        }
      },
      receptionHours: {
        title: "Contact Hours",
        mondayFriday: "Monday - Friday",
        mondayFridayHours: "08:00 - 22:00",
        saturday: "Saturday",
        saturdayHours: "09:00 - 21:00",
        sunday: "Sunday",
        sundayHours: "09:00 - 20:00",
      },
    },
    about: {
      header: {
        title: "About Asterias Homes",
        subtitle: "Discover the story behind our luxury vacation apartments in Koronisia.",
      },
      story: {
        subtitle: "Our Journey",
        title: "Crafting Authentic Experiences",
        paragraph1:
          "Nestled in the heart of the picturesque fishing village of Koronisia, Asterias Homes began with a simple vision: to offer luxury vacation apartments that blend traditional Greek hospitality with modern comforts. Our journey started over a decade ago, driven by a deep love for this unique island and a desire to share its serene beauty with travelers seeking an authentic Greek experience.",
        paragraph2:
          "From a single family property, we've carefully developed a collection of 7 unique luxury apartments, each thoughtfully designed to provide guests with a true 'home away from home' experience. We've preserved the traditional architectural charm while integrating modern amenities that ensure comfort and convenience for every guest.",
        paragraph3:
          "Our commitment is to provide exceptional vacation rental experiences where guests can unwind, reconnect with nature, and experience the timeless allure of the Amvrakikos Gulf. We believe in sustainable tourism and strive to operate in harmony with our pristine environment while supporting the local community.",
        imageAlt1: "View of Asterias Homes apartments with lush greenery",
      },
      mission: {
        title: "Our Mission",
        paragraph:
          "To provide unparalleled vacation rental experiences by offering exceptional service, luxury accommodations, and a deep connection to the local culture and natural beauty of Koronisia, ensuring every guest leaves with cherished memories.",
      },
      vision: {
        title: "Our Vision",
        paragraph:
          "To be recognized as the premier vacation rental destination in Koronisia for authentic, sustainable, and enriching travel experiences, fostering a legacy of warmth, tranquility, and respect for our community and environment.",
      },
      team: {
        subtitle: "Meet Our Family",
        title: "Dedicated to Your Comfort",
        paragraph:
          "At Asterias Homes, our team is more than just staff; we are a family dedicated to making your stay exceptional. With a passion for hospitality and a deep knowledge of Koronisia, we are always here to assist you, share local insights, and ensure your comfort throughout your stay.",
        imageAlt: "A welcoming group photo of the Asterias Homes team",
      },
      findUs: {
        subtitle: "Visit Us",
        title: "How to Find Asterias Homes",
        mapTitle: "Location of Asterias Homes on Google Maps",
      },
    },
    admin: {
      sidebar: {
        dashboard: "Dashboard",
        bookings: "Bookings",
        rooms: "Apartments",
        guests: "Guests",
        settings: "Settings",
        viewSite: "View Site",
        logout: "Logout",
        offers: "Offers",
        reports: "Reports",
        open: "Open sidebar",
        close: "Close sidebar",
      },
      header: {
        title: "Admin Panel",
        notifications: "Notifications",
        user: {
          profile: "Profile",
          settings: "Settings",
          logout: "Logout",
        },
      },
      userAvatar: {
        alt: "User Avatar",
      },
      dashboard: {
        title: "Dashboard",
        subtitle: "Overview of the apartments' status",
        stats: {
          todayArrivals: "Today's Check-ins",
          availableRooms: "Available Apartments",
          totalGuests: "Total Guests",
          occupancy: "Occupancy",
        },
        recentBookings: {
          title: "Recent Bookings",
          guest: "Guest",
          room: "Apartment",
          checkIn: "Check-in",
          checkOut: "Check-out",
          status: "Status",
          total: "Total",
          viewAll: "View all bookings →",
        },
        todayArrivals: {
          title: "Today's Check-ins",
          guest: "Guest",
          room: "Apartment",
          time: "Time",
          status: "Status",
          manage: "Manage check-ins →",
        },
      },
      status: {
        confirmed: "Confirmed",
        pending: "Pending",
        cancelled: "Cancelled",
        checkedIn: "Checked-in",
        checkedOut: "Checked-out",
      },
      offers: {
        title: "Offers",
        subtitle: "Manage special offers and discounts.",
        addNew: "Create New Offer",
        table: {
          name: "Name",
          discount: "Discount",
          validFrom: "Valid From",
          validUntil: "Valid Until",
          status: "Status",
          actions: "Actions",
          edit: "Edit",
        },
        status: {
          active: "Active",
          inactive: "Inactive",
        },
        noOffers: "No offers found. Get started by adding a new offer.",
        new: {
          title: "Create New Offer",
          subtitle: "Fill in the details for the new special offer.",
        },
        form: {
          nameLabel: "Offer Name",
          namePlaceholder: "e.g., Summer Bonanza",
          descriptionLabel: "Description",
          descriptionPlaceholder: "Describe the offer...",
          discountLabel: "Discount",
          discountPlaceholder: "e.g., 20% or 15 EUR",
          validFromLabel: "Valid From",
          validUntilLabel: "Valid Until",
          statusLabel: "Status",
          statusActive: "Active",
          statusInactive: "Inactive",
          imagesLabel: "Offer Images",
          imagesPlaceholder: "Upload up to 3 images",
          imageUploadNote: "Max 3 images. Recommended size: 800x600px.",
          primaryImageLabel: "Set as Primary",
          removeImageLabel: "Remove Image",
          saveButton: "Save Offer",
          cancelButton: "Cancel",
        },
      },
      reports: {
        title: "Property Reports",
        subtitle: "Analyze trends and performance across apartment bookings.",
        comingSoon: "Functionality coming soon.",
        bookingStats: {
          title: "Booking Statistics",
          description: "View trends in bookings, cancellations, lead times, and popular apartment types.",
        },
        revenue: {
          title: "Revenue Reports",
          description: "Track revenue per available apartment, average daily rate (ADR), and total income.",
        },
        occupancy: {
          title: "Occupancy Analysis",
          description: "Monitor occupancy rates, length of stay, and peak seasons.",
        },
        guestDemographics: {
          title: "Guest Demographics",
          description: "Understand your guest origins, preferences, and booking channels.",
        },
        customReport: {
          title: "Custom Report Generator",
          description: "Build and export custom reports based on your specific needs. (Future Implementation)",
          comingSoon: "This feature is planned for future development.",
        },
      },
    },
    roomsPage: {
      title: "Our Luxury Apartments",
      subtitle:
        "Explore our collection of 7 unique vacation apartments, each thoughtfully designed to offer a comfortable and authentic stay in the heart of Koronisia.",
      filter: {
        title: "Filter Apartments",
        comingSoon: "Filtering options coming soon.",
      },
      noRooms: "No apartments available at the moment. Please check back later.",
    },
    bookingsPage: {
      hero: {
        title: "Book Your Apartment Stay",
        subtitle: "Find the perfect vacation apartment for your unforgettable getaway in Koronisia.",
      },
      form: {
        checkInLabel: "Check-in",
        checkOutLabel: "Check-out",
        datePlaceholder: "Select date",
        adultsLabel: "Adults",
        adultsValue: { "1": "1 Adult", "2": "2 Adults", "3": "3 Adults", "4": "4 Adults" },
        childrenLabel: "Children",
        childrenValue: { "0": "0 Children", "1": "1 Child", "2": "2 Children", "3": "3 Children" },
        searchButton: "Search Apartments",
      },
      summary: {
        nights_one: "Night",
        nights_other: "Nights",
        adults_one: "Adult",
        adults_other: "Adults",
        children_one: "Child",
        children_other: "Children",
      },
      comparison: {
        barText: "apartments selected for comparison",
        compareButton: "Compare",
        modalTitle: "Compare Apartments",
        removeTooltip: "Remove from comparison",
        pricePerNight: "per night",
        totalPrice: "Total for {nights} nights: {price}€",
        sizeLabel: "Apartment Size",
        capacityLabel: "Max Capacity",
        capacityText: "{count} guests",
        bedLabel: "Bed Type",
        viewLabel: "View",
        bathroomLabel: "Bathroom",
        amenitiesTitle: "Key Features",
        featureLabel: {
          wifi: "Wi-Fi",
          ac: "Air Conditioning",
          tv: "Television",
          minibar: "Kitchen",
          breakfast: "Welcome Basket",
          parking: "Parking",
          balcony: "Balcony",
        },
        detailsButton: "View Details",
        bookButton: "Book Now",
        unavailableButton: "Unavailable",
        clearButton: "Clear Comparison",
      },
      viewToggle: {
        listTitle: "Available Apartments",
        listSubtitle: "Browse through our available apartments and find your perfect match.",
        calendarTitle: "Apartment Availability Calendar",
        calendarSubtitle: "Check apartment availability by date.",
        listViewTab: "List View",
        calendarViewTab: "Calendar View",
      },
      calendar: {
        title: "Availability for",
        subtitle: "Select dates to check apartment availability.",
        selectRoomPlaceholder: "Select an Apartment Type",
        allRoomsOption: "All Apartments (Overall Availability)",
        legend: {
          available: "Available",
          limited: "Limited Availability",
          unavailable: "Unavailable / Booked",
          selected: "Selected Dates",
        },
        dayHeader: {
          sun: "Sun",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat",
        },
        roomAvailabilityText: "{count} apartments of this type",
        roomPricePerNight: "per night",
        availabilityTooltip: "{availableCount} of {totalRooms} apartments available",
        selectedDatesSummaryTitle: "Selected Dates",
        selectedDatesNights_one: "{nights} night",
        selectedDatesNights_other: "{nights} nights",
        viewAvailableRoomsButton: "View Available Apartments for these Dates",
      },
      filters: {
        title: "Filter Your Results",
        priceRangeLabel: "Price Range (per night)",
        roomTypeLabel: "Apartment Type",
        roomType: {
          all: "All Apartment Types",
          standard: "Studio Apartments",
          family: "Family Apartments",
          romantic: "Sea View Apartments",
          superior: "Deluxe Apartments",
        },
        amenitiesLabel: "Amenities",
        resultsSummary: "Showing {count} of {total} apartments",
        clearButton: "Clear Filters",
      },
      roomList: {
        unavailableOverlay: "Currently Unavailable",
        capacityText: "Up to {count} guests",
        pricePerNight: "per night",
        totalPrice: "Total: {price}€",
        detailsButton: "View Details",
        bookButton: "Book Now",
        unavailableButton: "Unavailable",
        noRoomsFoundTitle: "No Apartments Found",
        noRoomsFoundSubtitle: "Try adjusting your search criteria or filters.",
        clearFiltersButton: "Clear All Filters",
      },
      benefits: {
        title: "Why Book With Us?",
        item1: {
          title: "Best Price Guarantee",
          description: "Get the best rates when you book directly through our website.",
        },
        item2: {
          title: "Flexible Cancellation",
          description: "Enjoy peace of mind with our flexible cancellation policies on most rates.",
        },
        item3: {
          title: "Exclusive Offers",
          description: "Access special packages and deals not available anywhere else.",
        },
      },
      cta: {
        title: "Need Assistance or Have Questions?",
        subtitle: "Our friendly team is here to help you plan your perfect stay. Contact us today!",
        contactButton: "Contact Us",
        callButton: "Call Us Now",
      },
      rooms: {
        // For individual apartment data mapping
        standard: {
          name: "Studio Apartment",
          description: "A cozy studio perfect for couples, offering comfort and essential amenities with kitchenette.",
          bedType: "Double Bed",
          view: "Garden View",
          bathroom: "Private Bathroom",
        },
        family: {
          name: "Family Apartment",
          description: "Spacious and comfortable, ideal for families with children and full kitchen facilities.",
          bedType: "Double Bed & Sofa Bed",
          view: "Sea or Garden View",
          bathroom: "Private Bathroom",
        },
        romantic: {
          name: "Sea View Apartment",
          description:
            "Specially designed for couples, featuring romantic ambiance and premium amenities with sea views.",
          bedType: "King Size Bed",
          view: "Sea View",
          bathroom: "Ensuite with Premium Fixtures",
        },
        superior: {
          name: "Deluxe Apartment",
          description: "Experience luxury with stunning views, separate living area, and enhanced comfort.",
          bedType: "King Size Bed",
          view: "Panoramic Sea View",
          bathroom: "Premium Private Bathroom",
        },
      },
      amenities: {
        // For mapping amenity keys
        wifi: "Free Wi-Fi",
        ac: "Air Conditioning",
        privateBathroom: "Private Bathroom",
        tv: "Flat-screen TV",
        refrigerator: "Full Kitchen",
        balcony: "Balcony/Terrace",
        jacuzzi: "Premium Bath",
        breakfast: "Welcome Basket",
        minibar: "Kitchen Facilities",
        coffeemaker: "Coffee/Tea Facilities",
        seaView: "Sea View",
      },
      features: {
        // For mapping feature keys
        doubleBed: "Double Bed",
        gardenView: "Garden View",
        balcony: "Private Balcony",
        sofaBed: "Sofa Bed",
        seaView: "Direct Sea View",
        kingSizeBed: "King Size Bed",
        privateBalcony: "Exclusive Private Balcony",
        livingArea: "Separate Living Area",
        premiumBathroom: "Premium Bathroom Fittings",
        kitchenette: "Kitchenette",
        fullKitchen: "Full Kitchen",
      },
    },
    contactPage: {
      header: {
        title: "Contact Us",
        subtitle: "Get in touch with Asterias Homes. We're here to help with any questions or booking inquiries.",
      },
      form: {
        title: "Send Us a Message",
        label: {
          name: "Full Name",
          email: "Email Address",
          phone: "Phone Number (Optional)",
          message: "Your Message",
        },
        button: {
          submit: "Send Message",
          submitting: "Sending...",
        },
        successMessage: "Thank you! Your message has been sent successfully. We'll get back to you soon.",
      },
      details: {
        title: "Our Contact Details",
        phone: {
          title: "Call Us",
          number: "+30 2681 023456",
          availability: "Available daily from 08:00 to 22:00",
        },
        email: {
          title: "Email Us",
          address: "asterias.apartmentskoronisia@gmail.com",
          replyTime: "We typically reply within 24 hours",
        },
        address: {
          title: "Visit Us",
          street: "Koronisia Island",
          region: "Amvrakikos Gulf, 47100, Greece",
        },
        social: {
          title: "Follow Us",
          instagramAlt: "Instagram",
          facebookAlt: "Facebook",
          hashtag: "#AsteriasKoronisia",
        },
      },
      location: {
        title: "Find Us on the Map",
      },
    },
  },
  el: {
    common: {
      loading: "Φόρτωση...",
      error: "Σφάλμα",
      success: "Επιτυχία",
      confirm: "Επιβεβαίωση",
      cancel: "Άκυρο",
      edit: "Επεξεργασία",
      delete: "Διαγραφή",
      view: "Προβολή",
      save: "Αποθήκευση",
      close: "Κλείσιμο",
      search: "Αναζήτηση",
      reset: "Επαναφορά",
      actions: "Ενέργειες",
      createdAt: "Δημιουργήθηκε Στις",
      updatedAt: "Ενημερώθηκε Στις",
      id: "ID",
    },
    nav: {
      home: "Αρχική",
      about: "Σχετικά",
      rooms: "Διαμερίσματα",
      bookings: "Κρατήσεις",
      contact: "Επικοινωνία",
      book: "Κράτηση",
      admin: "Διαχείριση",
    },
    languageSelector: {
      titleMobile: "Γλώσσα / Language",
    },
    logo: {
      alt: "Λογότυπο Asterias Homes",
      altPublic: "Λογότυπο Asterias Homes",
    },
    header: {
      openMenu: "Άνοιγμα κυρίως μενού",
      closeMenu: "Κλείσιμο κυρίως μενού",
    },
    hero: {
      slide1: {
        title: "Κορωνησία",
        subtitle: "Εκεί που η Ηρεμία Έχει Φωνή",
      },
      slide2: {
        title: "Πολυτελή Διαμερίσματα",
        subtitle: "Στην Καρδιά του Αμβρακικού",
      },
      slide3: {
        title: "Μοναδική Εμπειρία",
        subtitle: "Ανάμεσα σε Θάλασσα και Ουρανό",
      },
      book: "Κράτηση Τώρα",
    },
    welcome: {
      subtitle: "Καλώς ήρθατε",
      title: "Στα πολυτελή διαμερίσματα διακοπών",
      paragraph1:
        "Ζήστε την αυθεντική ελληνική φιλοξενία στη γαλήνια ομορφιά της Κορωνησίας. Τα 7 πολυτελή διαμερίσματά μας προσφέρουν έναν τέλειο συνδυασμό παραδοσιακής γοητείας και σύγχρονης άνεσης για τις τέλειες διακοπές σας.",
      paragraph2:
        "Κάθε διαμέρισμα είναι μοναδικά σχεδιασμένο για να σας προσφέρει μια εμπειρία 'σπιτιού μακριά από το σπίτι' στον Αμβρακικό Κόλπο, όπου μπορείτε να ανακαλύψετε τη μοναδική ηρεμία που προσφέρει η τοποθεσία μας.",
      button: "Η Ιστορία Μας",
    },
    rooms: {
      section: {
        subtitle: "Η Διαμονή Μας",
        title: "Τα Διαμερίσματά Μας",
        description:
          "Ανακαλύψτε τα 7 πολυτελή διαμερίσματα διακοπών μας, το καθένα μοναδικά σχεδιασμένο για την τέλεια διαμονή σας στην Κορωνησία.",
      },
      perNight: "/ διανυκτέρευση",
      viewAll: "Προβολή Όλων των Διαμερισμάτων",
      standard: {
        name: "Studio Διαμέρισμα",
        description:
          "Άνετο studio διαμέρισμα με σύγχρονες ανέσεις, ιδανικό για ζευγάρια. Διαθέτει μικρή κουζίνα, ιδιωτικό μπάνιο και μπαλκόνι με θέα στον κήπο.",
      },
      family: {
        name: "Οικογενειακό Διαμέρισμα",
        description:
          "Ευρύχωρο διαμέρισμα δύο υπνοδωματίων ιδανικό για οικογένειες. Διαθέτει πλήρη κουζίνα, καθιστικό και μπαλκόνι με εκπληκτική θέα στον Αμβρακικό Κόλπο.",
      },
      romantic: {
        name: "Διαμέρισμα με Θέα Θάλασσα",
        description:
          "Premium διαμέρισμα με πανοραμική θέα στη θάλασσα, ιδανικό για ζευγάρια. Διαθέτει πολυτελείς ανέσεις, ιδιωτική βεράντα και ρομαντική ατμόσφαιρα.",
      },
      twin: {
        name: "Διαμέρισμα με Μονά Κρεβάτια",
        description:
          "Μοντέρνο διαμέρισμα με μονά κρεβάτια, ιδανικό για φίλους ή συναδέλφους. Περιλαμβάνει πλήρη κουζίνα και άνετο χώρο καθιστικού.",
      },
      suite: {
        name: "Deluxe Διαμέρισμα",
        description:
          "Πολυτελές διαμέρισμα δύο υπνοδωματίων με ξεχωριστό καθιστικό, πλήρη κουζίνα και premium ανέσεις για μια εξαιρετική διαμονή.",
      },
      accessible: {
        name: "Προσβάσιμο Διαμέρισμα",
        description:
          "Προσεκτικά σχεδιασμένο διαμέρισμα με προσβάσιμα χαρακτηριστικά, εξασφαλίζοντας άνετη διαμονή για όλους τους επισκέπτες.",
      },
      feature: {
        doubleBed: "Διπλό Κρεβάτι",
        ac: "Κλιματισμός",
        wifi: "Δωρεάν Wi-Fi",
        tv: "Τηλεόραση",
        upTo4: "Έως 4 άτομα",
        balcony: "Μπαλκόνι",
        fridge: "Πλήρης Κουζίνα",
        seaView: "Θέα στη Θάλασσα",
        whirlpool: "Premium Μπάνιο",
        kingBed: "King Size Κρεβάτι",
        breakfast: "Καλάθι Καλωσορίσματος",
        sofaBed: "Καναπές-Κρεβάτι",
        twinBeds: "Δύο Μονά Κρεβάτια",
        separateLivingArea: "Ξεχωριστό Καθιστικό",
        accessible: "Προσβάσιμα Χαρακτηριστικά",
        kitchenette: "Μικρή Κουζίνα",
        fullKitchen: "Πλήρης Κουζίνα",
        privateTerrace: "Ιδιωτική Βεράντα",
      },
    },
    roomCard: {
      bookNow: "Κράτηση Διαμερίσματος",
    },
    specialOffers: {
      title: "Ειδικές Προσφορές",
      subtitle: "Επωφεληθείτε από τις αποκλειστικές μας προσφορές",
      allOffers: "Δείτε Όλες τις Προσφορές",
      summerEscape: { title: "Καλοκαιρινή Απόδραση" },
      romanticWeekend: { title: "Ρομαντικό Σαββατοκύριακο" },
      earlyBird: { title: "Προσφορά Έγκαιρης Κράτησης" },
    },
    offers: {
      section: {
        subtitle: "Αποκλειστικές Προσφορές",
        title: "Οι Ειδικές Μας Προσφορές",
        description:
          "Ανακαλύψτε τις προσεκτικά επιλεγμένες προσφορές μας, σχεδιασμένες για να κάνουν τη διαμονή σας στα διαμερίσματα ακόμα πιο αξέχαστη. Κάντε απευθείας κράτηση για τις καλύτερες τιμές και προνόμια.",
      },
      summerEscape: {
        title: "Καλοκαιρινή Απόδραση",
        description:
          "Απολαύστε έκπτωση 20% στην καλοκαιρινή σας διαμονή. Περιλαμβάνει καλάθι καλωσορίσματος και ευέλικτο check-in.",
        badge: "Hot Προσφορά",
        roomType: "Studio Διαμέρισμα",
        includes: {
          freeBreakfast: "Καλάθι Καλωσορίσματος",
          welcomeWine: "Καλωσόρισμα με Μπουκάλι Κρασί",
          lateCheckout: "Ευέλικτο Check-out",
        },
      },
      romanticWeekend: {
        title: "Ρομαντικό Σαββατοκύριακο",
        description:
          "Εκπλήξτε το αγαπημένο σας πρόσωπο με μια ρομαντική απόδραση. Περιλαμβάνεται σαμπάνια, προτάσεις εστιατορίων και ευέλικτο check-out.",
        badge: "Αγαπημένο Ζευγαριών",
        roomType: "Διαμέρισμα με Θέα Θάλασσα",
        includes: {
          champagne: "Μπουκάλι Σαμπάνια",
          romanticDinner: "Προτάσεις Εστιατορίων",
          lateCheckout: "Ευέλικτο Check-out",
          breakfastInRoom: "Καλάθι Καλωσορίσματος",
        },
      },
      familyFun: {
        title: "Πακέτο Οικογενειακής Διασκέδασης",
        description:
          "Δημιουργήστε αξέχαστες αναμνήσεις με την οικογένειά σας. Ειδικές τιμές για μεγαλύτερες διαμονές και οικογενειακές ανέσεις.",
        roomType: "Οικογενειακό Διαμέρισμα",
        includes: {
          freeKidsStay: "Ειδικές Οικογενειακές Τιμές",
          kidsActivities: "Οδηγός Τοπικών Δραστηριοτήτων",
          familyBreakfast: "Οικογενειακό Καλάθι Καλωσορίσματος",
        },
      },
      earlyBird: {
        title: "Προσφορά Έγκαιρης Κράτησης",
        description: "Κάντε κράτηση εκ των προτέρων και εξοικονομήστε έως και 25% στη διαμονή σας. Μη επιστρέψιμη.",
        badge: "Μεγάλη Εξοικονόμηση!",
        includes: {
          discountAllRooms: "Έκπτωση σε όλα τα διαμερίσματα",
          freeUpgrade: "Δωρεάν Αναβάθμιση Διαμερίσματος (βάσει διαθεσιμότητας)",
        },
      },
      lastMinute: {
        title: "Προσφορά Τελευταίας Στιγμής",
        description:
          "Αυθόρμητο ταξίδι; Εξασφαλίστε την καλύτερη διαθέσιμη τιμή για κρατήσεις εντός 48 ωρών από την άφιξη.",
        badge: "Κλείστε Τώρα!",
        includes: {
          discount: "Ειδική Μειωμένη Τιμή",
          instantConfirmation: "Άμεση Επιβεβαίωση",
        },
      },
      autumnRetreat: {
        title: "Φθινοπωρινή Απόδραση",
        description: "Ζήστε την ομορφιά του φθινοπώρου στην Κορωνησία με το ειδικό μας πακέτο.",
        badge: "Εποχιακό",
        includes: {
          freeTour: "Δωρεάν Ξενάγηση στην Περιοχή",
          localWelcomeProducts: "Καλωσόρισμα με Καλάθι Τοπικών Προϊόντων",
        },
      },
      includes: "Τι Περιλαμβάνεται:",
      validUntil: "Ισχύει έως",
      daysRemaining: "Απομένουν:",
      days: "ημέρες",
      from: "Από",
      perNight: "/διανυκτέρευση",
      viewOffer: "Δείτε την Προσφορά",
      moreDetails: "Περισσότερες Λεπτομέρειες",
      viewAllOffers: "Δείτε Όλες τις Προσφορές",
    },
    featuresSection: {
      title: "Γιατί να επιλέξετε το Asterias Homes;",
      subtitle: "Αξέχαστες Εμπειρίες σας Περιμένουν",
      item1: {
        title: "Εξαιρετική Τοποθεσία",
        description: "Στην καρδιά της Κορωνησίας, με εκπληκτική θέα και εύκολη πρόσβαση στα τοπικά αξιοθέατα.",
      },
      item2: {
        title: "Αυθεντική Φιλοξενία",
        description: "Ζήστε την γνήσια ελληνική ζεστασιά και εξατομικευμένη εξυπηρέτηση από την ομάδα μας.",
      },
      item3: {
        title: "Σπίτι Μακριά από το Σπίτι",
        description:
          "Τα διαμερίσματά μας συνδυάζουν παραδοσιακή αισθητική με σύγχρονες ανέσεις για μια μοναδική και άνετη διαμονή.",
      },
      item4: {
        title: "Γαλήνιο Καταφύγιο",
        description: "Αποδράστε από τη φασαρία και χαλαρώστε στο ήρεμο περιβάλλον του Αμβρακικού Κόλπου.",
      },
    },
    discover: {
      title: "Ανακαλύψτε την Κορωνησία",
      description:
        "Ένα κρυμμένο διαμάντι στον Αμβρακικό Κόλπο, η Κορωνησία σας προσκαλεί να εξερευνήσετε τα γαλήνια τοπία της, την πλούσια άγρια ζωή και την διαχρονική γοητεία ενός παραδοσιακού ψαροχωριού. Η περιπέτειά σας ξεκινά στο Asterias Homes.",
      button: "Μάθετε Περισσότερα για την Περιοχή",
      imageAlt: "Ηλιοβασίλεμα στην Κορωνησία",
    },
    highlights: {
      title: "Εμπειρίες στην Κορωνησία",
      description: "Ανακαλύψτε τι κάνει την περιοχή μας ξεχωριστή",
      highlight1: {
        title: "Εκπληκτική Θέα",
        description:
          "Το να ξυπνάς με τον γαλήνιο Αμβρακικό Κόλπο από το μπαλκόνι του διαμερίσματός μας ήταν αξέχαστο. Η θέα ήταν απλά εκπληκτική!",
        author: "Μαρία Κ.",
      },
      highlight2: {
        title: "Ζεστή & Φιλόξενη",
        description:
          "Η ομάδα στο Asterias Homes μας έκανε να νιώσουμε σαν οικογένεια. Η φιλοξενία και η προσοχή τους στη λεπτομέρεια ήταν εξαιρετικές.",
        author: "Γιάννης & Σάρα Π.",
      },
      highlight3: {
        title: "Τέλεια Απόδραση",
        description:
          "Η Κορωνησία είναι ένας παράδεισος και το Asterias Homes είναι το ιδανικό μέρος για να το ζήσετε. Ειρηνικό, όμορφο και πραγματικά χαλαρωτικό.",
        author: "Νίκος Γ.",
      },
    },
    footer: {
      description:
        "Asterias Homes, το γαλήνιο καταφύγιό σας στην Κορωνησία, προσφέροντας 7 πολυτελή διαμερίσματα διακοπών με παραδοσιακή γοητεία και σύγχρονη άνεση δίπλα στον Αμβρακικό Κόλπο.",
      contact: "Στοιχεία Επικοινωνίας",
      details: {
        address: "Κορωνησία, Άρτα, Ελλάδα",
        phone: {
          number: "+30 268 102 4047" // <-- put your real number here
        },
        email: {
          address: "asterias.apartmentskoronisia@gmail.com"
        }
      },
      links: "Γρήγοροι Σύνδεσμοι",
      copyright: "Με επιφύλαξη παντός δικαιώματος.",
      receptionHours: {
        title: "Ώρες Επικοινωνίας",
        mondayFriday: "Δευτέρα - Παρασκευή",
        mondayFridayHours: "08:00 - 22:00",
        saturday: "Σάββατο",
        saturdayHours: "09:00 - 21:00",
        sunday: "Κυριακή",
        sundayHours: "09:00 - 20:00",
      },
    },
    about: {
      header: {
        title: "Σχετικά με το Asterias Homes",
        subtitle: "Ανακαλύψτε την ιστορία πίσω από τα πολυτελή διαμερίσματα διακοπών μας στην Κορωνησία.",
      },
      story: {
        subtitle: "Η Πορεία Μας",
        title: "Δημιουργώντας Αυθεντικές Εμπειρίες",
        paragraph1:
          "Φωλιασμένο στην καρδιά του γραφικού ψαροχωρίου της Κορωνησίας, το Asterias Homes ξεκίνησε με ένα απλό όραμα: να προσφέρει πολυτελή διαμερίσματα διακοπών που συνδυάζουν την παραδοσιακή ελληνική φιλοξενία με τις σύγχρονες ανέσεις. Η πορεία μας ξεκίνησε πριν από μια δεκαετία, με γνώμονα τη βαθιά αγάπη για αυτό το μοναδικό νησί και την επιθυμία να μοιραστούμε την ήρεμη ομορφιά του με ταξιδιώτες που αναζητούν μια αυθεντική ελληνική εμπειρία.",
        paragraph2:
          "Από μια μοναδική οικογενειακή ιδιοκτησία, αναπτύξαμε προσεκτικά μια συλλογή από 7 μοναδικά πολυτελή διαμερίσματα, το καθένα προσεκτικά σχεδιασμένο για να προσφέρει στους επισκέπτες μια αληθινή εμπειρία 'σπιτιού μακριά από το σπίτι'. Διατηρήσαμε την παραδοσιακή αρχιτεκτονική γοητεία ενσωματώνοντας σύγχρονες ανέσεις που εξασφαλίζουν άνεση και ευκολία για κάθε επισκέπτη.",
        paragraph3:
          "Η δέσμευσή μας είναι να παρέχουμε εξαιρετικές εμπειρίες ενοικίασης διακοπών όπου οι επισκέπτες μπορούν να χαλαρώσουν, να επανασυνδεθούν με τη φύση και να βιώσουν τη διαχρονική γοητεία του Αμβρακικού Κόλπου. Πιστεύουμε στον βιώσιμο τουρισμό και προσπαθούμε να λειτουργούμε σε αρμονία με το παρθένο περιβάλλον μας υποστηρίζοντας παράλληλα την τοπική κοινότητα.",
        imageAlt1: "Άποψη των διαμερισμάτων Asterias Homes με πλούσια βλάστηση",
      },
      mission: {
        title: "Η Αποστολή Μας",
        paragraph:
          "Να παρέχουμε απαράμιλλες εμπειρίες ενοικίασης διακοπών προσφέροντας εξαιρετικές υπηρεσίες, πολυτελή καταλύματα και μια βαθιά σύνδεση με τον τοπικό πολιτισμό και τη φυσική ομορφιά της Κορωνησίας, εξασφαλίζοντας ότι κάθε επισκέπτης φεύγει με πολύτιμες αναμνήσεις.",
      },
      vision: {
        title: "Το Όραμά Μας",
        paragraph:
          "Να αναγνωριστούμε ως ο κορυφαίος προορισμός ενοικίασης διακοπών στην Κορωνησία για αυθεντικές, βιώσιμες και εμπλουτιστικές ταξιδιωτικές εμπειρίες, καλλιεργώντας μια κληρονομιά ζεστασιάς, ηρεμίας και σεβασμού για την κοινότητα και το περιβάλλον μας.",
      },
      team: {
        subtitle: "Γνωρίστε την Οικογένειά Μας",
        title: "Αφοσιωμένοι στην Άνεση Σας",
        paragraph:
          "Στο Asterias Homes, η ομάδα μας είναι κάτι περισσότερο από προσωπικό- είμαστε μια οικογένεια αφοσιωμένη στο να κάνει τη διαμονή σας εξαιρετική. Με πάθος για τη φιλοξενία και βαθιά γνώση της Κορωνησίας, είμαστε πάντα εδώ για να σας βοηθήσουμε, να μοιραστούμε τοπικές πληροφορίες και να εξασφαλίσουμε την άνεσή σας καθ' όλη τη διάρκεια της διαμονής σας.",
        imageAlt: "Μια φιλόξενη ομαδική φωτογραφία της ομάδας του Asterias Homes",
      },
      findUs: {
        subtitle: "Επισκεφθείτε Μας",
        title: "Πώς να Βρείτε το Asterias Homes",
        mapTitle: "Τοποθεσία του Asterias Homes στους Χάρτες Google",
      },
    },
    admin: {
      sidebar: {
        dashboard: "Πίνακας Ελέγχου",
        bookings: "Κρατήσεις",
        rooms: "Διαμερίσματα",
        guests: "Επισκέπτες",
        settings: "Ρυθμίσεις",
        viewSite: "Προβολή Ιστοσελίδας",
        logout: "Αποσύνδεση",
        offers: "Προσφορές",
        reports: "Αναφορές",
        open: "Άνοιγμα πλευρικής στήλης",
        close: "Κλείσιμο πλευρικής στήλης",
      },
      header: {
        title: "Πίνακας Διαχείρισης",
        notifications: "Ειδοποιήσεις",
        user: {
          profile: "Προφίλ",
          settings: "Ρυθμίσεις",
          logout: "Αποσύνδεση",
        },
      },
      userAvatar: {
        alt: "Εικόνα χρήστη",
      },
      dashboard: {
        title: "Πίνακας Ελέγχου",
        subtitle: "Επισκόπηση της κατάστασης των διαμερισμάτων",
        stats: {
          todayArrivals: "Σημερινά Check-ins",
          availableRooms: "Διαθέσιμα Διαμερίσματα",
          totalGuests: "Συνολικοί Επισκέπτες",
          occupancy: "Πληρότητα",
        },
        recentBookings: {
          title: "Πρόσφατες Κρατήσεις",
          guest: "Επισκέπτης",
          room: "Διαμέρισμα",
          checkIn: "Check-in",
          checkOut: "Check-out",
          status: "Κατάσταση",
          total: "Σύνολο",
          viewAll: "Δείτε όλες τις κρατήσεις →",
        },
        todayArrivals: {
          title: "Σημερινά Check-ins",
          guest: "Επισκέπτης",
          room: "Διαμέρισμα",
          time: "Ώρα",
          status: "Κατάσταση",
          manage: "Διαχείριση check-ins →",
        },
      },
      status: {
        confirmed: "Επιβεβαιωμένη",
        pending: "Εκκρεμής",
        cancelled: "Ακυρωμένη",
        checkedIn: "Check-in",
        checkedOut: "Check-out",
      },
      offers: {
        title: "Προσφορές",
        subtitle: "Διαχειριστείτε ειδικές προσφορές και εκπτώσεις.",
        addNew: "Δημιουργία Νέας Προσφοράς",
        table: {
          name: "Όνομα",
          discount: "Έκπτωση",
          validFrom: "Ισχύει Από",
          validUntil: "Ισχύει Έως",
          status: "Κατάσταση",
          actions: "Ενέργειες",
          edit: "Επεξεργασία",
        },
        status: {
          active: "Ενεργή",
          inactive: "Ανενεργή",
        },
        noOffers: "Δεν βρέθηκαν προσφορές. Ξεκινήστε προσθέτοντας μια νέα προσφορά.",
        new: {
          title: "Δημιουργία Νέας Προσφοράς",
          subtitle: "Συμπληρώστε τις λεπτομέρειες για τη νέα ειδική προσφορά.",
        },
        form: {
          nameLabel: "Όνομα Προσφοράς",
          namePlaceholder: "π.χ., Καλοκαιρινή Έκρηξη",
          descriptionLabel: "Περιγραφή",
          descriptionPlaceholder: "Περιγράψτε την προσφορά...",
          discountLabel: "Έκπτωση",
          discountPlaceholder: "π.χ., 20% ή 15 EUR",
          validFromLabel: "Ισχύει Από",
          validUntilLabel: "Ισχύει Έως",
          statusLabel: "Κατάσταση",
          statusActive: "Ενεργή",
          statusInactive: "Ανενεργή",
          imagesLabel: "Εικόνες Προσφοράς",
          imagesPlaceholder: "Ανεβάστε έως 3 εικόνες",
          imageUploadNote: "Μέγιστο 3 εικόνες. Προτεινόμενο μέγεθος: 800x600px.",
          primaryImageLabel: "Ορισμός ως Κύρια",
          removeImageLabel: "Αφαίρεση Εικόνας",
          saveButton: "Αποθήκευση Προσφοράς",
          cancelButton: "Άκυρο",
        },
      },
      reports: {
        title: "Αναφορές Ιδιοκτησίας",
        subtitle: "Αναλύστε τάσεις και απόδοση σε κρατήσεις διαμερισμάτων.",
        comingSoon: "Η λειτουργικότητα θα είναι σύντομα διαθέσιμη.",
        bookingStats: {
          title: "Στατιστικά Κρατήσεων",
          description: "Προβολή τάσεων σε κρατήσεις, ακυρώσεις, χρόνους αναμονής και δημοφιλείς τύπους διαμερισμάτων.",
        },
        revenue: {
          title: "Αναφορές Εσόδων",
          description:
            "Παρακολουθήστε τα έσοδα ανά διαθέσιμο διαμέρισμα, τη μέση ημερήσια τιμή (ADR) και το συνολικό εισόδημα.",
        },
        occupancy: {
          title: "Ανάλυση Πληρότητας",
          description: "Παρακολουθήστε τα ποσοστά πληρότητας, τη διάρκεια διαμονής και τις περιόδους αιχμής.",
        },
        guestDemographics: {
          title: "Δημογραφικά Στοιχεία Επισκεπτών",
          description: "Κατανοήστε την προέλευση, τις προτιμήσεις και τα κανάλια κρατήσεων των επισκεπτών σας.",
        },
        customReport: {
          title: "Γεννήτρια Προσαρμοσμένων Αναφορών",
          description:
            "Δημιουργήστε και εξαγάγετε προσαρμοσμένες αναφορές με βάση τις συγκεκριμένες ανάγκες σας. (Μελλοντική Υλοποίηση)",
          comingSoon: "Αυτή η λειτουργία έχει προγραμματιστεί για μελλοντική ανάπτυξη.",
        },
      },
    },
    roomsPage: {
      title: "Τα Πολυτελή Διαμερίσματά Μας",
      subtitle:
        "Εξερευνήστε τη συλλογή μας από 7 μοναδικά διαμερίσματα διακοπών, το καθένα προσεκτικά σχεδιασμένο για να προσφέρει μια άνετη και αυθεντική διαμονή στην καρδιά της Κορωνησίας.",
      filter: {
        title: "Φιλτράρισμα Διαμερισμάτων",
        comingSoon: "Οι επιλογές φιλτραρίσματος θα είναι σύντομα διαθέσιμες.",
      },
      noRooms: "Δεν υπάρχουν διαθέσιμα διαμερίσματα αυτή τη στιγμή. Ελέγξτε ξανά αργότερα.",
    },
    bookingsPage: {
      hero: {
        title: "Κλείστε τη Διαμονή σας στο Διαμέρισμα",
        subtitle: "Βρείτε το ιδανικό διαμέρισμα διακοπών για την αξέχαστη απόδρασή σας στην Κορωνησία.",
      },
      form: {
        checkInLabel: "Check-in",
        checkOutLabel: "Check-out",
        datePlaceholder: "Επιλέξτε ημερομηνία",
        adultsLabel: "Ενήλικες",
        adultsValue: { "1": "1 Ενήλικας", "2": "2 Ενήλικες", "3": "3 Ενήλικες", "4": "4 Ενήλικες" },
        childrenLabel: "Παιδιά",
        childrenValue: { "0": "0 Παιδιά", "1": "1 Παιδί", "2": "2 Παιδιά", "3": "3 Παιδιά" },
        searchButton: "Αναζήτηση Διαμερισμάτων",
      },
      summary: {
        nights_one: "Νύχτα",
        nights_other: "Νύχτες",
        adults_one: "Ενήλικας",
        adults_other: "Ενήλικες",
        children_one: "Παιδί",
        children_other: "Παιδιά",
      },
      comparison: {
        barText: "διαμερίσματα που επιλέχθηκαν για σύγκριση",
        compareButton: "Σύγκριση",
        modalTitle: "Σύγκριση Διαμερισμάτων",
        removeTooltip: "Αφαίρεση από τη σύγκριση",
        pricePerNight: "ανά διανυκτέρευση",
        totalPrice: "Σύνολο για {nights} νύχτες: {price}€",
        sizeLabel: "Μέγεθος Διαμερίσματος",
        capacityLabel: "Μέγιστη Χωρητικότητα",
        capacityText: "{count} επισκέπτες",
        bedLabel: "Τύπος Κρεβατιού",
        viewLabel: "Θέα",
        bathroomLabel: "Μπάνιο",
        amenitiesTitle: "Βασικά Χαρακτηριστικά",
        featureLabel: {
          wifi: "Wi-Fi",
          ac: "Κλιματισμός",
          tv: "Τηλεόραση",
          minibar: "Κουζίνα",
          breakfast: "Καλάθι Καλωσορίσματος",
          parking: "Χώρος Στάθμευσης",
          balcony: "Μπαλκόνι",
        },
        detailsButton: "Προβολή Λεπτομερειών",
        bookButton: "Κράτηση Τώρα",
        unavailableButton: "Μη Διαθέσιμο",
        clearButton: "Εκκαθάριση Σύγκρισης",
      },
      viewToggle: {
        listTitle: "Διαθέσιμα Διαμερίσματα",
        listSubtitle: "Περιηγηθείτε στα διαθέσιμα διαμερίσματά μας και βρείτε το ιδανικό.",
        calendarTitle: "Ημερολόγιο Διαθεσιμότητας Διαμερισμάτων",
        calendarSubtitle: "Ελέγξτε τη διαθεσιμότητα των διαμερισμάτων ανά ημερομηνία.",
        listViewTab: "Προβολή Λίστας",
        calendarViewTab: "Προβολή Ημερολογίου",
      },
      calendar: {
        title: "Διαθεσιμότητα για",
        subtitle: "Επιλέξτε ημερομηνίες για να ελέγξετε τη διαθεσιμότητα των διαμερισμάτων.",
        selectRoomPlaceholder: "Επιλέξτε έναν Τύπο Διαμερίσματος",
        allRoomsOption: "Όλα τα Διαμερίσματα (Συνολική Διαθεσιμότητα)",
        legend: {
          available: "Διαθέσιμο",
          limited: "Περιορισμένη Διαθεσιμότητα",
          unavailable: "Μη Διαθέσιμο / Κρατημένο",
          selected: "Επιλεγμένες Ημερομηνίες",
        },
        dayHeader: {
          sun: "Κυρ",
          mon: "Δευ",
          tue: "Τρι",
          wed: "Τετ",
          thu: "Πεμ",
          fri: "Παρ",
          sat: "Σαβ",
        },
        roomAvailabilityText: "{count} διαμερίσματα αυτού του τύπου",
        roomPricePerNight: "ανά διανυκτέρευση",
        availabilityTooltip: "{availableCount} από {totalRooms} διαμερίσματα διαθέσιμα",
        selectedDatesSummaryTitle: "Επιλεγμένες Ημερομηνίες",
        selectedDatesNights_one: "{nights} νύχτα",
        selectedDatesNights_other: "{nights} νύχτες",
        viewAvailableRoomsButton: "Προβολή Διαθέσιμων Διαμερισμάτων για αυτές τις Ημερομηνίες",
      },
      filters: {
        title: "Φιλτράρετε τα Αποτελέσματά σας",
        priceRangeLabel: "Εύρος Τιμών (ανά διανυκτέρευση)",
        roomTypeLabel: "Τύπος Διαμερίσματος",
        roomType: {
          all: "Όλοι οι Τύποι Διαμερισμάτων",
          standard: "Studio Διαμερίσματα",
          family: "Οικογενειακά Διαμερίσματα",
          romantic: "Διαμερίσματα με Θέα Θάλασσα",
          superior: "Deluxe Διαμερίσματα",
        },
        amenitiesLabel: "Ανέσεις",
        resultsSummary: "Εμφάνιση {count} από {total} διαμερίσματα",
        clearButton: "Εκκαθάριση Φίλτρων",
      },
      roomList: {
        unavailableOverlay: "Προς το παρόν Μη Διαθέσιμο",
        capacityText: "Έως {count} επισκέπτες",
        pricePerNight: "ανά διανυκτέρευση",
        totalPrice: "Σύνολο: {price}€",
        detailsButton: "Προβολή Λεπτομερειών",
        bookButton: "Κράτηση Τώρα",
        unavailableButton: "Μη Διαθέσιμο",
        noRoomsFoundTitle: "Δεν Βρέθηκαν Διαμερίσματα",
        noRoomsFoundSubtitle: "Προσπαθήστε να προσαρμόσετε τα κριτήρια ή τα φίλτρα αναζήτησής σας.",
        clearFiltersButton: "Εκκαθάριση Όλων των Φίλτρων",
      },
      benefits: {
        title: "Γιατί να Κάνετε Κράτηση Μαζί Μας;",
        item1: {
          title: "Εγγύηση Καλύτερης Τιμής",
          description: "Λάβετε τις καλύτερες τιμές όταν κάνετε κράτηση απευθείας μέσω της ιστοσελίδας μας.",
        },
        item2: {
          title: "Ευέλικτη Ακύρωση",
          description: "Απολαύστε ηρεμία με τις ευέλικτες πολιτικές ακύρωσης στις περισσότερες τιμές.",
        },
        item3: {
          title: "Αποκλειστικές Προσφορές",
          description: "Αποκτήστε πρόσβαση σε ειδικά πακέτα και προσφορές που δεν είναι διαθέσιμα πουθενά αλλού.",
        },
      },
      cta: {
        title: "Χρειάζεστε Βοήθεια ή Έχετε Ερωτήσεις;",
        subtitle:
          "Η φιλική μας ομάδα είναι εδώ για να σας βοηθήσει να σχεδιάσετε την τέλεια διαμονή σας. Επικοινωνήστε μαζί μας σήμερα!",
        contactButton: "Επικοινωνήστε Μαζί Μας",
        callButton: "Καλέστε Μας Τώρα",
      },
      rooms: {
        // For individual apartment data mapping
        standard: {
          name: "Studio Διαμέρισμα",
          description:
            "Ένα άνετο στούντιο ιδανικό για ζευγάρια, που προσφέρει άνεση και βασικές ανέσεις με μικρή κουζίνα.",
          bedType: "Διπλό Κρεβάτι",
          view: "Θέα στον Κήπο",
          bathroom: "Ιδιωτικό Μπάνιο",
        },
        family: {
          name: "Οικογενειακό Διαμέρισμα",
          description: "Ευρύχωρο και άνετο, ιδανικό για οικογένειες με παιδιά και πλήρεις εγκαταστάσεις κουζίνας.",
          bedType: "Διπλό Κρεβάτι & Καναπές-Κρεβάτι",
          view: "Θέα στη Θάλασσα ή στον Κήπο",
          bathroom: "Ιδιωτικό Μπάνιο",
        },
        romantic: {
          name: "Διαμέρισμα με Θέα Θάλασσα",
          description:
            "Ειδικά σχεδιασμένο για ζευγάρια, με ρομαντική ατμόσφαιρα και premium ανέσεις με θέα στη θάλασσα.",
          bedType: "King Size Κρεβάτι",
          view: "Θέα στη Θάλασσα",
          bathroom: "Ιδιωτικό Μπάνιο με Premium Εξοπλισμό",
        },
        superior: {
          name: "Deluxe Διαμέρισμα",
          description: "Ζήστε την πολυτέλεια με εκπληκτική θέα, ξεχωριστό καθιστικό και βελτιωμένη άνεση.",
          bedType: "King Size Κρεβάτι",
          view: "Πανοραμική Θέα στη Θάλασσα",
          bathroom: "Premium Ιδιωτικό Μπάνιο",
        },
      },
      amenities: {
        // For mapping amenity keys
        wifi: "Δωρεάν Wi-Fi",
        ac: "Κλιματισμός",
        privateBathroom: "Ιδιωτικό Μπάνιο",
        tv: "Τηλεόραση Επίπεδης Οθόνης",
        refrigerator: "Πλήρης Κουζίνα",
        balcony: "Μπαλκόνι/Βεράντα",
        jacuzzi: "Premium Μπανιέρα",
        breakfast: "Καλάθι Καλωσορίσματος",
        minibar: "Εγκαταστάσεις Κουζίνας",
        coffeemaker: "Εγκαταστάσεις Καφέ/Τσαγιού",
        seaView: "Θέα στη Θάλασσα",
      },
      features: {
        // For mapping feature keys
        doubleBed: "Διπλό Κρεβάτι",
        gardenView: "Θέα στον Κήπο",
        balcony: "Ιδιωτικό Μπαλκόνι",
        sofaBed: "Καναπές-Κρεβάτι",
        seaView: "Άμεση Θέα στη Θάλασσα",
        kingSizeBed: "King Size Κρεβάτι",
        privateBalcony: "Αποκλειστικό Ιδιωτικό Μπαλκόνι",
        livingArea: "Ξεχωριστό Καθιστικό",
        premiumBathroom: "Premium Εξαρτήματα Μπάνιου",
        kitchenette: "Μικρή Κουζίνα",
        fullKitchen: "Πλήρης Κουζίνα",
      },
    },
    contactPage: {
      header: {
        title: "Επικοινωνήστε Μαζί Μας",
        subtitle:
          "Επικοινωνήστε με το Asterias Homes. Είμαστε εδώ για να σας βοηθήσουμε με οποιεσδήποτε ερωτήσεις ή απορίες σχετικά με την κράτηση.",
      },
      form: {
        title: "Στείλτε Μας ένα Μήνυμα",
        label: {
          name: "Ονοματεπώνυμο",
          email: "Διεύθυνση Email",
          phone: "Αριθμός Τηλεφώνου (Προαιρετικό)",
          message: "Το Μήνυμά Σας",
        },
        button: {
          submit: "Αποστολή Μηνύματος",
          submitting: "Αποστολή...",
        },
        successMessage: "Ευχαριστούμε! Το μήνυμά σας στάλθηκε με επιτυχία. Θα επικοινωνήσουμε μαζί σας σύντομα.",
      },
      details: {
        title: "Τα Στοιχεία Επικοινωνίας Μας",
        phone: {
          title: "Καλέστε Μας",
          number: "+30 2681 023456",
          availability: "Διαθέσιμο καθημερινά από τις 08:00 έως τις 22:00",
        },
        email: {
          title: "Στείλτε Μας Email",
          address: "asterias.apartmentskoronisia@gmail.com",
          replyTime: "Συνήθως απαντάμε εντός 24 ωρών",
        },
        address: {
          title: "Επισκεφθείτε Μας",
          street: "Νησί Κορωνησία",
          region: "Αμβρακικός Κόλπος, 47100, Ελλάδα",
        },
        social: {
          title: "Ακολουθήστε Μας",
          instagramAlt: "Instagram",
          facebookAlt: "Facebook",
          hashtag: "#AsteriasKoronisia",
        },
      },
      location: {
        title: "Βρείτε Μας στον Χάρτη",
      },
    },
  },
  de: {
    common: {
      loading: "Laden...",
      error: "Fehler",
      success: "Erfolg",
      confirm: "Bestätigen",
      cancel: "Abbrechen",
      edit: "Bearbeiten",
      delete: "Löschen",
      view: "Ansehen",
      save: "Speichern",
      close: "Schließen",
      search: "Suchen",
      reset: "Zurücksetzen",
      actions: "Aktionen",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      id: "ID",
    },
    nav: {
      home: "Startseite",
      about: "Über uns",
      rooms: "Apartments",
      bookings: "Buchungen",
      contact: "Kontakt",
      book: "Buchen",
      admin: "Admin",
    },
    languageSelector: {
      titleMobile: "Sprache",
    },
    logo: {
      alt: "Asterias Homes Logo",
      altPublic: "Asterias Homes Logo",
    },
    header: {
      openMenu: "Hauptmenü öffnen",
      closeMenu: "Hauptmenü schließen",
    },
    hero: {
      slide1: {
        title: "Koronisia",
        subtitle: "Wo die Ruhe eine Stimme hat",
      },
      slide2: {
        title: "Luxus Apartments",
        subtitle: "Im Herzen des Amvrakischen Golfs",
      },
      slide3: {
        title: "Einzigartige Erfahrung",
        subtitle: "Zwischen Meer und Himmel",
      },
      book: "Jetzt buchen",
    },
    welcome: {
      subtitle: "Willkommen",
      title: "Zu luxuriösen Ferienwohnungen",
      paragraph1:
        "Erleben Sie authentische griechische Gastfreundschaft in der ruhigen Schönheit von Koronisia. Unsere 7 Luxusapartments bieten eine perfekte Mischung aus traditionellem Charme und modernem Komfort für Ihren perfekten Urlaub.",
      paragraph2:
        "Jedes Apartment ist einzigartig gestaltet, um Ihnen ein Zuhause-Gefühl im Amvrakischen Golf zu bieten, wo Sie die einzigartige Ruhe unserer Lage entdecken können.",
      button: "Entdecken Sie unsere Geschichte",
    },
    rooms: {
      section: {
        subtitle: "Unsere Unterkünfte",
        title: "Unsere Apartments",
        description:
          "Entdecken Sie unsere 7 luxuriösen Ferienwohnungen, jede einzigartig gestaltet für Ihren perfekten Aufenthalt in Koronisia.",
      },
      perNight: "/ Nacht",
      viewAll: "Alle Apartments ansehen",
      standard: {
        name: "Gemütliches Studio-Apartment",
        description:
          "Komfortables Studio-Apartment mit modernen Annehmlichkeiten, ideal für Paare. Mit Küchenzeile, eigenem Bad und Balkon mit Gartenblick.",
      },
      family: {
        name: "Familien-Apartment",
        description:
          "Geräumiges Apartment mit zwei Schlafzimmern, ideal für Familien. Mit voll ausgestatteter Küche, Wohnbereich und Balkon mit herrlichem Blick auf den Amvrakischen Golf.",
      },
      romantic: {
        name: "Apartment mit Meerblick",
        description:
          "Premium-Apartment mit Panoramablick auf das Meer, ideal für Paare. Mit luxuriösen Annehmlichkeiten, privater Terrasse und romantischem Ambiente.",
      },
      twin: {
        name: "Apartment mit Einzelbetten",
        description:
          "Modernes Apartment mit Einzelbetten, ideal für Freunde oder Kollegen. Inklusive voll ausgestatteter Küche und komfortablem Wohnbereich.",
      },
      suite: {
        name: "Deluxe-Apartment",
        description:
          "Luxuriöses Apartment mit zwei Schlafzimmern, separatem Wohnbereich, voll ausgestatteter Küche und Premium-Annehmlichkeiten für einen außergewöhnlichen Aufenthalt.",
      },
      accessible: {
        name: "Barrierefreies Apartment",
        description:
          "Sorgfältig gestaltetes Apartment mit barrierefreien Funktionen, das einen komfortablen Aufenthalt für alle Gäste gewährleistet.",
      },
      feature: {
        doubleBed: "Doppelbett",
        ac: "Klimaanlage",
        wifi: "Kostenloses WLAN",
        tv: "Fernseher",
        upTo4: "Bis zu 4 Gäste",
        balcony: "Balkon",
        fridge: "Voll ausgestattete Küche",
        seaView: "Meerblick",
        whirlpool: "Whirlpool-Badewanne",
        kingBed: "Kingsize-Bett",
        breakfast: "Willkommenskorb",
        sofaBed: "Schlafsofa",
        twinBeds: "Zwei Einzelbetten",
        separateLivingArea: "Separater Wohnbereich",
        accessible: "Barrierefreie Funktionen",
        kitchenette: "Küchenzeile",
        fullKitchen: "Voll ausgestattete Küche",
        privateTerrace: "Private Terrasse",
      },
    },
    roomCard: {
      bookNow: "Apartment buchen",
    },
    specialOffers: {
      title: "Sonderangebote",
      subtitle: "Nutzen Sie unsere exklusiven Angebote",
      allOffers: "Alle Angebote ansehen",
      summerEscape: { title: "Sommerausflug" },
      romanticWeekend: { title: "Romantisches Wochenende" },
      earlyBird: { title: "Frühbucher-Special" },
    },
    offers: {
      section: {
        subtitle: "Exklusive Angebote",
        title: "Unsere Sonderangebote",
        description:
          "Entdecken Sie unsere handverlesenen Angebote, die Ihren Aufenthalt in unseren Apartments noch unvergesslicher machen. Buchen Sie direkt für die besten Preise und Vorteile.",
      },
      summerEscape: {
        title: "Sommerausflug",
        description:
          "Genießen Sie 20% Rabatt auf Ihren Sommeraufenthalt. Inklusive Willkommenskorb und flexiblem Check-in.",
        badge: "Top Angebot",
        roomType: "Studio-Apartment",
        includes: {
          freeBreakfast: "Willkommenskorb",
          welcomeWine: "Willkommensflasche Wein",
          lateCheckout: "Flexibler Check-out",
        },
      },
      romanticWeekend: {
        title: "Romantisches Wochenende",
        description:
          "Überraschen Sie Ihren Liebsten mit einem romantischen Ausflug. Inklusive Champagner, Restaurantempfehlungen und flexiblem Check-out.",
        badge: "Paar-Favorit",
        roomType: "Apartment mit Meerblick",
        includes: {
          champagne: "Flasche Champagner",
          romanticDinner: "Restaurantempfehlungen",
          lateCheckout: "Flexibler Check-out",
          breakfastInRoom: "Willkommenskorb",
        },
      },
      familyFun: {
        title: "Familienspaß-Paket",
        description:
          "Schaffen Sie bleibende Erinnerungen mit Ihrer Familie. Sonderpreise für längere Aufenthalte und familienfreundliche Annehmlichkeiten.",
        roomType: "Familien-Apartment",
        includes: {
          freeKidsStay: "Spezielle Familienpreise",
          kidsActivities: "Lokaler Aktivitätsführer",
          familyBreakfast: "Willkommenskorb für Familien",
        },
      },
      earlyBird: {
        title: "Frühbucher-Special",
        description: "Buchen Sie im Voraus und sparen Sie bis zu 25% auf Ihren Aufenthalt. Nicht erstattungsfähig.",
        badge: "Große Ersparnis!",
        includes: {
          discountAllRooms: "Rabatt auf alle Apartments",
          freeUpgrade: "Kostenloses Apartment-Upgrade (je nach Verfügbarkeit)",
        },
      },
      lastMinute: {
        title: "Last-Minute-Angebot",
        description:
          "Spontaner Ausflug? Sichern Sie sich den besten verfügbaren Preis für Buchungen innerhalb von 48 Stunden vor der Ankunft.",
        badge: "Jetzt buchen!",
        includes: {
          discount: "Spezieller reduzierter Preis",
          instantConfirmation: "Sofortige Bestätigung",
        },
      },
      autumnRetreat: {
        title: "Herbst-Retreat",
        description: "Erleben Sie die Schönheit des Herbstes in Koronisia mit unserem Spezialpaket.",
        badge: "Saisonal",
        includes: {
          freeTour: "Kostenlose geführte lokale Tour",
          localWelcomeProducts: "Willkommenskorb mit lokalen Produkten",
        },
      },
      includes: "Was ist enthalten:",
      validUntil: "Gültig bis",
      daysRemaining: "Verbleibende Tage:",
      days: "Tage",
      from: "Ab",
      perNight: "/Nacht",
      viewOffer: "Angebot ansehen",
      moreDetails: "Mehr Details",
      viewAllOffers: "Alle Angebote ansehen",
    },
    featuresSection: {
      title: "Warum Asterias Homes wählen?",
      subtitle: "Unvergessliche Erlebnisse erwarten Sie",
      item1: {
        title: "Erstklassige Lage",
        description:
          "Eingebettet im Herzen von Koronisia, mit atemberaubender Aussicht und einfachem Zugang zu lokalen Sehenswürdigkeiten.",
      },
      item2: {
        title: "Authentische Gastfreundschaft",
        description: "Erleben Sie echte griechische Wärme und persönlichen Service von unserem engagierten Team.",
      },
      item3: {
        title: "Zuhause fern von Zuhause",
        description:
          "Unsere Apartments verbinden traditionelle Ästhetik mit modernen Annehmlichkeiten für einen einzigartigen und komfortablen Aufenthalt.",
      },
      item4: {
        title: "Friedlicher Rückzugsort",
        description:
          "Entfliehen Sie der Hektik und entspannen Sie sich in der ruhigen Umgebung des Amvrakischen Golfs.",
      },
    },
    discover: {
      title: "Entdecken Sie Koronisia",
      description:
        "Ein verstecktes Juwel im Amvrakischen Golf, Koronisia lädt Sie ein, seine ruhigen Landschaften, die reiche Tierwelt und den zeitlosen Charme eines traditionellen Fischerdorfes zu erkunden. Ihr Abenteuer beginnt im Asterias Homes.",
      button: "Erfahren Sie mehr über die Gegend",
      imageAlt: "Sonnenuntergang über der Insel Koronisia",
    },
    highlights: {
      title: "Erlebnisse in Koronisia",
      description: "Entdecken Sie, was unsere Region besonders macht",
      highlight1: {
        title: "Atemberaubende Aussicht",
        description:
          "Das Aufwachen mit dem ruhigen Amvrakischen Golf vom Balkon unseres Apartments aus war unvergesslich. Die Aussicht war einfach atemberaubend!",
        author: "Maria K.",
      },
      highlight2: {
        title: "Warm & Willkommen",
        description:
          "Das Team von Asterias Homes hat uns wie eine Familie behandelt. Ihre Gastfreundschaft und Liebe zum Detail waren außergewöhnlich.",
        author: "John & Sarah P.",
      },
      highlight3: {
        title: "Perfekter Ausflug",
        description:
          "Koronisia ist ein Paradies, und Asterias Homes ist der perfekte Ort, um es zu erleben. Friedlich, schön und wirklich entspannend.",
        author: "Nikos G.",
      },
    },
    footer: {
      description:
        "Asterias Homes, Ihr ruhiger Rückzugsort in Koronisia, bietet 7 luxuriöse Ferienwohnungen mit traditionellem Charme und modernem Komfort am Amvrakischen Golf.",
      contact: "Kontaktinformationen",
      links: "Schnelllinks",
      details: {
        address: "Koronisia, Arta, Griechenland",
        phone: {
          number: "+30 268 102 4047" // <-- put your real number here
        },
        email: {
          address: "asterias.apartmentskoronisia@gmail.com"
        }
      },
      copyright: "Alle Rechte vorbehalten.",
      receptionHours: {
        title: "Kontaktzeiten",
        mondayFriday: "Montag - Freitag",
        mondayFridayHours: "08:00 - 22:00",
        saturday: "Samstag",
        saturdayHours: "09:00 - 21:00",
        sunday: "Sonntag",
        sundayHours: "09:00 - 20:00",
      },
    },
    about: {
      header: {
        title: "Über Asterias Homes",
        subtitle: "Entdecken Sie die Geschichte hinter unseren luxuriösen Ferienwohnungen in Koronisia.",
      },
      story: {
        subtitle: "Unsere Reise",
        title: "Authentische Erlebnisse schaffen",
        paragraph1:
          "Eingebettet im Herzen des malerischen Fischerdorfes Koronisia begann Asterias Homes mit einer einfachen Vision: luxuriöse Ferienwohnungen anzubieten, die traditionelle griechische Gastfreundschaft mit modernem Komfort verbinden. Unsere Reise begann vor über einem Jahrzehnt, angetrieben von einer tiefen Liebe zu dieser einzigartigen Insel und dem Wunsch, ihre ruhige Schönheit mit Reisenden zu teilen, die ein authentisches griechisches Erlebnis suchen.",
        paragraph2:
          "Von einem einzigen Familienbesitz haben wir sorgfältig eine Sammlung von 7 einzigartigen Luxusapartments entwickelt, die alle sorgfältig entworfen wurden, um den Gästen ein echtes 'Zuhause fern von Zuhause'-Erlebnis zu bieten. Wir haben den traditionellen architektonischen Charme bewahrt und gleichzeitig moderne Annehmlichkeiten integriert, die Komfort und Bequemlichkeit für jeden Gast gewährleisten.",
        paragraph3:
          "Unser Engagement ist es, außergewöhnliche Ferienerlebnisse zu bieten, bei denen die Gäste entspannen, sich wieder mit der Natur verbinden und den zeitlosen Reiz des Amvrakischen Golfs erleben können. Wir glauben an nachhaltigen Tourismus und bemühen uns, im Einklang mit unserer unberührten Umwelt zu agieren und gleichzeitig die lokale Gemeinschaft zu unterstützen.",
        imageAlt1: "Blick auf die Asterias Homes Apartments mit üppigem Grün",
      },
      mission: {
        title: "Unsere Mission",
        paragraph:
          "Unvergleichliche Ferienerlebnisse zu bieten, indem wir außergewöhnlichen Service, luxuriöse Unterkünfte und eine tiefe Verbindung zur lokalen Kultur und natürlichen Schönheit von Koronisia bieten und sicherstellen, dass jeder Gast mit wertvollen Erinnerungen abreist.",
      },
      vision: {
        title: "Unsere Vision",
        paragraph:
          "Als das führende Ferienziel in Koronisia für authentische, nachhaltige und bereichernde Reiseerlebnisse anerkannt zu werden und ein Erbe von Wärme, Ruhe und Respekt für unsere Gemeinschaft und Umwelt zu fördern.",
      },
      team: {
        subtitle: "Lernen Sie unsere Familie kennen",
        title: "Ihrem Komfort verpflichtet",
        paragraph:
          "Bei Asterias Homes ist unser Team mehr als nur Personal - wir sind eine Familie, die sich dafür einsetzt, Ihren Aufenthalt außergewöhnlich zu machen. Mit einer Leidenschaft für Gastfreundschaft und einer tiefen Kenntnis von Koronisia sind wir immer hier, um Ihnen zu helfen, lokale Einblicke zu teilen und Ihren Komfort während Ihres gesamten Aufenthalts zu gewährleisten.",
        imageAlt: "Ein einladendes Gruppenfoto des Asterias Homes Teams",
      },
      findUs: {
        subtitle: "Besuchen Sie uns",
        title: "So finden Sie Asterias Homes",
        mapTitle: "Lage von Asterias Homes auf Google Maps",
      },
    },
    admin: {
      sidebar: {
        dashboard: "Dashboard",
        bookings: "Buchungen",
        rooms: "Apartments",
        guests: "Gäste",
        settings: "Einstellungen",
        viewSite: "Website ansehen",
        logout: "Abmelden",
        offers: "Angebote",
        reports: "Berichte",
        open: "Seitenleiste öffnen",
        close: "Seitenleiste schließen",
      },
      header: {
        title: "Admin-Panel",
        notifications: "Benachrichtigungen",
        user: {
          profile: "Profil",
          settings: "Einstellungen",
          logout: "Abmelden",
        },
      },
      userAvatar: {
        alt: "Benutzer-Avatar",
      },
      dashboard: {
        title: "Dashboard",
        subtitle: "Überblick über den Status der Apartments",
        stats: {
          todayArrivals: "Heutige Ankünfte",
          availableRooms: "Verfügbare Apartments",
          totalGuests: "Gesamtzahl der Gäste",
          occupancy: "Belegung",
        },
        recentBookings: {
          title: "Letzte Buchungen",
          guest: "Gast",
          room: "Apartment",
          checkIn: "Check-in",
          checkOut: "Check-out",
          status: "Status",
          total: "Gesamt",
          viewAll: "Alle Buchungen ansehen →",
        },
        todayArrivals: {
          title: "Heutige Ankünfte",
          guest: "Gast",
          room: "Apartment",
          time: "Zeit",
          status: "Status",
          manage: "Check-ins verwalten →",
        },
      },
      status: {
        confirmed: "Bestätigt",
        pending: "Ausstehend",
        cancelled: "Abgebrochen",
        checkedIn: "Eingecheckt",
        checkedOut: "Ausgecheckt",
      },
      offers: {
        title: "Angebote",
        subtitle: "Verwalten Sie Sonderangebote und Rabatte.",
        addNew: "Neues Angebot erstellen",
        table: {
          name: "Name",
          discount: "Rabatt",
          validFrom: "Gültig ab",
          validUntil: "Gültig bis",
          status: "Status",
          actions: "Aktionen",
          edit: "Bearbeiten",
        },
        status: {
          active: "Aktiv",
          inactive: "Inaktiv",
        },
        noOffers: "Keine Angebote gefunden. Beginnen Sie mit dem Hinzufügen eines neuen Angebots.",
        new: {
          title: "Neues Angebot erstellen",
          subtitle: "Füllen Sie die Details für das neue Sonderangebot aus.",
        },
        form: {
          nameLabel: "Angebotsname",
          namePlaceholder: "z.B. Sommer-Bonanza",
          descriptionLabel: "Beschreibung",
          descriptionPlaceholder: "Beschreiben Sie das Angebot...",
          discountLabel: "Rabatt",
          discountPlaceholder: "z.B. 20% oder 15 EUR",
          validFromLabel: "Gültig ab",
          validUntilLabel: "Gültig bis",
          statusLabel: "Status",
          statusActive: "Aktiv",
          statusInactive: "Inaktiv",
          imagesLabel: "Angebotsbilder",
          imagesPlaceholder: "Laden Sie bis zu 3 Bilder hoch",
          imageUploadNote: "Max. 3 Bilder. Empfohlene Größe: 800x600px.",
          primaryImageLabel: "Als primär festlegen",
          removeImageLabel: "Bild entfernen",
          saveButton: "Angebot speichern",
          cancelButton: "Abbrechen",
        },
      },
      reports: {
        title: "Immobilienberichte",
        subtitle: "Analysieren Sie Trends und Leistung bei Apartmentbuchungen.",
        comingSoon: "Funktionalität folgt in Kürze.",
        bookingStats: {
          title: "Buchungsstatistiken",
          description: "Zeigen Sie Trends bei Buchungen, Stornierungen, Vorlaufzeiten und beliebten Apartmenttypen an.",
        },
        revenue: {
          title: "Umsatzberichte",
          description:
            "Verfolgen Sie den Umsatz pro verfügbarem Apartment, den durchschnittlichen Tagespreis (ADR) und das Gesamteinkommen.",
        },
        occupancy: {
          title: "Belegungsanalyse",
          description: "Überwachen Sie die Belegungsraten, die Aufenthaltsdauer und die Hauptsaisonen.",
        },
        guestDemographics: {
          title: "Gästedemografie",
          description: "Verstehen Sie die Herkunft, Vorlieben und Buchungskanäle Ihrer Gäste.",
        },
        customReport: {
          title: "Benutzerdefinierter Berichtsgenerator",
          description:
            "Erstellen und exportieren Sie benutzerdefinierte Berichte basierend auf Ihren spezifischen Anforderungen. (Zukünftige Implementierung)",
          comingSoon: "Diese Funktion ist für die zukünftige Entwicklung geplant.",
        },
      },
    },
    roomsPage: {
      title: "Unsere Luxusapartments",
      subtitle:
        "Entdecken Sie unsere Sammlung von 7 einzigartigen Ferienwohnungen, die alle sorgfältig entworfen wurden, um einen komfortablen und authentischen Aufenthalt im Herzen von Koronisia zu bieten.",
      filter: {
        title: "Apartments filtern",
        comingSoon: "Filteroptionen folgen in Kürze.",
      },
      noRooms: "Im Moment sind keine Apartments verfügbar. Bitte schauen Sie später noch einmal vorbei.",
    },
    bookingsPage: {
      hero: {
        title: "Buchen Sie Ihren Apartmentaufenthalt",
        subtitle: "Finden Sie das perfekte Ferienapartment für Ihren unvergesslichen Urlaub in Koronisia.",
      },
      form: {
        checkInLabel: "Check-in",
        checkOutLabel: "Check-out",
        datePlaceholder: "Datum auswählen",
        adultsLabel: "Erwachsene",
        adultsValue: { "1": "1 Erwachsener", "2": "2 Erwachsene", "3": "3 Erwachsene", "4": "4 Erwachsene" },
        childrenLabel: "Kinder",
        childrenValue: { "0": "0 Kinder", "1": "1 Kind", "2": "2 Kinder", "3": "3 Kinder" },
        searchButton: "Apartments suchen",
      },
      summary: {
        nights_one: "Nacht",
        nights_other: "Nächte",
        adults_one: "Erwachsener",
        adults_other: "Erwachsene",
        children_one: "Kind",
        children_other: "Kinder",
      },
      comparison: {
        barText: "Apartments zur Vergleich ausgewählt",
        compareButton: "Vergleichen",
        modalTitle: "Apartments vergleichen",
        removeTooltip: "Aus dem Vergleich entfernen",
        pricePerNight: "pro Nacht",
        totalPrice: "Gesamt für {nights} Nächte: {price}€",
        sizeLabel: "Apartmentgröße",
        capacityLabel: "Maximale Kapazität",
        capacityText: "{count} Gäste",
        bedLabel: "Betttyp",
        viewLabel: "Aussicht",
        bathroomLabel: "Badezimmer",
        amenitiesTitle: "Hauptmerkmale",
        featureLabel: {
          wifi: "WLAN",
          ac: "Klimaanlage",
          tv: "Fernseher",
          minibar: "Küche",
          breakfast: "Willkommenskorb",
          parking: "Parkplatz",
          balcony: "Balkon",
        },
        detailsButton: "Details ansehen",
        bookButton: "Jetzt buchen",
        unavailableButton: "Nicht verfügbar",
        clearButton: "Vergleich löschen",
      },
      viewToggle: {
        listTitle: "Verfügbare Apartments",
        listSubtitle: "Durchsuchen Sie unsere verfügbaren Apartments und finden Sie das perfekte Apartment.",
        calendarTitle: "Apartment-Verfügbarkeitskalender",
        calendarSubtitle: "Überprüfen Sie die Apartmentverfügbarkeit nach Datum.",
        listViewTab: "Listenansicht",
        calendarViewTab: "Kalenderansicht",
      },
      calendar: {
        title: "Verfügbarkeit für",
        subtitle: "Wählen Sie Daten aus, um die Apartmentverfügbarkeit zu überprüfen.",
        selectRoomPlaceholder: "Wählen Sie einen Apartmenttyp aus",
        allRoomsOption: "Alle Apartments (Gesamtverfügbarkeit)",
        legend: {
          available: "Verfügbar",
          limited: "Begrenzte Verfügbarkeit",
          unavailable: "Nicht verfügbar / Gebucht",
          selected: "Ausgewählte Daten",
        },
        dayHeader: {
          sun: "So",
          mon: "Mo",
          tue: "Di",
          wed: "Mi",
          thu: "Do",
          fri: "Fr",
          sat: "Sa",
        },
        roomAvailabilityText: "{count} Apartments dieses Typs",
        roomPricePerNight: "pro Nacht",
        availabilityTooltip: "{availableCount} von {totalRooms} Apartments verfügbar",
        selectedDatesSummaryTitle: "Ausgewählte Daten",
        selectedDatesNights_one: "{nights} Nacht",
        selectedDatesNights_other: "{nights} Nächte",
        viewAvailableRoomsButton: "Verfügbare Apartments für diese Daten anzeigen",
      },
      filters: {
        title: "Filtern Sie Ihre Ergebnisse",
        priceRangeLabel: "Preisspanne (pro Nacht)",
        roomTypeLabel: "Apartmenttyp",
        roomType: {
          all: "Alle Apartmenttypen",
          standard: "Studio-Apartments",
          family: "Familien-Apartments",
          romantic: "Apartments mit Meerblick",
          superior: "Deluxe-Apartments",
        },
        amenitiesLabel: "Annehmlichkeiten",
        resultsSummary: "Zeige {count} von {total} Apartments",
        clearButton: "Filter löschen",
      },
      roomList: {
        unavailableOverlay: "Derzeit nicht verfügbar",
        capacityText: "Bis zu {count} Gäste",
        pricePerNight: "pro Nacht",
        totalPrice: "Gesamt: {price}€",
        detailsButton: "Details ansehen",
        bookButton: "Jetzt buchen",
        unavailableButton: "Nicht verfügbar",
        noRoomsFoundTitle: "Keine Apartments gefunden",
        noRoomsFoundSubtitle: "Versuchen Sie, Ihre Suchkriterien oder Filter anzupassen.",
        clearFiltersButton: "Alle Filter löschen",
      },
      benefits: {
        title: "Warum bei uns buchen?",
        item1: {
          title: "Bestpreisgarantie",
          description: "Erhalten Sie die besten Preise, wenn Sie direkt über unsere Website buchen.",
        },
        item2: {
          title: "Flexible Stornierung",
          description: "Genießen Sie Sicherheit mit unseren flexiblen Stornierungsbedingungen für die meisten Preise.",
        },
        item3: {
          title: "Exklusive Angebote",
          description: "Greifen Sie auf spezielle Pakete und Angebote zu, die sonst nirgendwo erhältlich sind.",
        },
      },
      cta: {
        title: "Benötigen Sie Hilfe oder haben Sie Fragen?",
        subtitle:
          "Unser freundliches Team hilft Ihnen gerne bei der Planung Ihres perfekten Aufenthalts. Kontaktieren Sie uns noch heute!",
        contactButton: "Kontaktieren Sie uns",
        callButton: "Rufen Sie uns jetzt an",
      },
      rooms: {
        // For individual apartment data mapping
        standard: {
          name: "Studio Apartment",
          description: "A cozy studio perfect for couples, offering comfort and essential amenities with kitchenette.",
          bedType: "Double Bed",
          view: "Garden View",
          bathroom: "Private Bathroom",
        },
        family: {
          name: "Family Apartment",
          description: "Spacious and comfortable, ideal for families with children and full kitchen facilities.",
          bedType: "Double Bed & Sofa Bed",
          view: "Sea or Garden View",
          bathroom: "Private Bathroom",
        },
        romantic: {
          name: "Sea View Apartment",
          description:
            "Specially designed for couples, featuring romantic ambiance and premium amenities with sea views.",
          bedType: "King Size Bed",
          view: "Sea View",
          bathroom: "Ensuite with Premium Fixtures",
        },
        superior: {
          name: "Deluxe Apartment",
          description: "Experience luxury with stunning views, separate living area, and enhanced comfort.",
          bedType: "King Size Bed",
          view: "Panoramic Sea View",
          bathroom: "Premium Private Bathroom",
        },
      },
      amenities: {
        // For mapping amenity keys
        wifi: "Free Wi-Fi",
        ac: "Air Conditioning",
        privateBathroom: "Private Bathroom",
        tv: "Flat-screen TV",
        refrigerator: "Full Kitchen",
        balcony: "Balcony/Terrace",
        jacuzzi: "Premium Bath",
        breakfast: "Welcome Basket",
        minibar: "Kitchen Facilities",
        coffeemaker: "Coffee/Tea Facilities",
        seaView: "Sea View",
      },
      features: {
        // For mapping feature keys
        doubleBed: "Double Bed",
        gardenView: "Garden View",
        balcony: "Private Balcony",
        sofaBed: "Sofa Bed",
        seaView: "Direct Sea View",
        kingSizeBed: "King Size Bed",
        privateBalcony: "Exclusive Private Balcony",
        livingArea: "Separate Living Area",
        premiumBathroom: "Premium Bathroom Fittings",
        kitchenette: "Kitchenette",
        fullKitchen: "Full Kitchen",
      },
    },
    contactPage: {
      header: {
        title: "Contact Us",
        subtitle: "Get in touch with Asterias Homes. We're here to help with any questions or booking inquiries.",
      },
      form: {
        title: "Send Us a Message",
        label: {
          name: "Full Name",
          email: "Email Address",
          phone: "Phone Number (Optional)",
          message: "Your Message",
        },
        button: {
          submit: "Send Message",
          submitting: "Sending...",
        },
        successMessage: "Thank you! Your message has been sent successfully. We'll get back to you soon.",
      },
      details: {
        title: "Our Contact Details",
        phone: {
          title: "Call Us",
          number: "+30 2681 023456",
          availability: "Available daily from 08:00 to 22:00",
        },
        email: {
          title: "Email Us",
          address: "asterias.apartmentskoronisia@gmail.com",
          replyTime: "We typically reply within 24 hours",
        },
        address: {
          title: "Visit Us",
          street: "Koronisia Island",
          region: "Amvrakikos Gulf, 47100, Greece",
        },
        social: {
          title: "Follow Us",
          instagramAlt: "Instagram",
          facebookAlt: "Facebook",
          hashtag: "#AsteriasKoronisia",
        },
      },
      location: {
        title: "Find Us on the Map",
      },
    },
  },
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>("el") // Default language

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as LanguageCode
    if (savedLanguage && ["el", "en", "de"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }, [])

  const t = useCallback(
    (key: string, defaultValue?: string, replacements?: Record<string, string | number>): string => {
      const currentLangTranslations = translationsData[language]
      const fallbackLangTranslations = translationsData["en"] // English as fallback

      let translatedString = getNestedValue(currentLangTranslations, key)

      if (translatedString === undefined) {
        translatedString = getNestedValue(fallbackLangTranslations, key)
      }

      if (translatedString === undefined) {
        // console.warn(`Translation key "${key}" not found for language "${language}" or fallback "en". Using default or key.`);
        return defaultValue !== undefined ? defaultValue : key
      }

      if (replacements) {
        Object.keys(replacements).forEach((placeholder) => {
          translatedString = (translatedString as string).replace(`{${placeholder}}`, String(replacements[placeholder]))
        })
      }
      return translatedString as string
    },
    [language],
  )

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
