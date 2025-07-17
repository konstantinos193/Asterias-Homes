export type LanguageCode = "el" | "en" | "de"

export interface Translations {
  [key: string]: any // Can be a string or a nested object
}

export const translationsData: Record<LanguageCode, Translations> = {
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
    // ... rest of the translationsData object ...
  },
  el: {
    // ... Greek translations ...
  },
  de: {
    // ... German translations ...
  },
} 