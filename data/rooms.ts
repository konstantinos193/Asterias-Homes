// This file should provide the data for your rooms, including translation keys.
// Ensure the keys match those in your language-context.tsx

export interface RoomData {
  id: string
  nameKey: string // e.g., "rooms.standard.name"
  descriptionKey: string // e.g., "rooms.standard.description"
  image: string
  price?: string // Price might not be translated or handled differently
  featureKeys?: string[] // e.g., ["rooms.feature.doubleBed", "rooms.feature.ac"]
  bedsKey?: string // e.g., "rooms.beds.double" - translation key for bed type
  capacity?: number // e.g., 2
  size?: string // e.g., "25 sqm" - consider if "sqm" needs translation
  amenitiesKeys?: string[] // More detailed amenities
  // Consider adding keys for view, bathroom type if they are distinct filterable/displayable properties
  // e.g., viewKey: "rooms.view.sea"
  // bathroomKey: "rooms.bathroom.private"
}

export const allRoomsData: RoomData[] = [
  {
    id: "standard-double",
    nameKey: "rooms.standard.name",
    descriptionKey: "rooms.standard.description",
    image: "/room-1.png",
    price: "€90",
    featureKeys: ["rooms.feature.ac", "rooms.feature.wifi", "rooms.feature.tv", "rooms.feature.balcony"],
    bedsKey: "rooms.beds.double",
    capacity: 2,
    size: "25 sqm",
  },
  {
    id: "family-room",
    nameKey: "rooms.family.name",
    descriptionKey: "rooms.family.description",
    image: "/room-2.png",
    price: "€120",
    featureKeys: [
      "rooms.feature.ac",
      "rooms.feature.wifi",
      "rooms.feature.tv",
      "rooms.feature.balcony",
      "rooms.feature.sofaBed",
    ],
    bedsKey: "rooms.beds.doubleAndSofa",
    capacity: 4,
    size: "35 sqm",
  },
  {
    id: "romantic-sea-view",
    nameKey: "rooms.romantic.name",
    descriptionKey: "rooms.romantic.description",
    image: "/room-3.png",
    price: "€150",
    featureKeys: [
      "rooms.feature.ac",
      "rooms.feature.wifi",
      "rooms.feature.tv",
      "rooms.feature.seaView",
      "rooms.feature.whirlpool",
      "rooms.feature.breakfast",
    ],
    bedsKey: "rooms.beds.king",
    capacity: 2,
    size: "30 sqm",
  },
  {
    id: "twin-room",
    nameKey: "rooms.twin.name",
    descriptionKey: "rooms.twin.description",
    image: "/room-4.png",
    price: "€95",
    featureKeys: ["rooms.feature.ac", "rooms.feature.wifi", "rooms.feature.tv"],
    bedsKey: "rooms.beds.twin",
    capacity: 2,
    size: "22 sqm",
  },
  {
    id: "suite-deluxe",
    nameKey: "rooms.suite.name",
    descriptionKey: "rooms.suite.description",
    image: "/room-5.png",
    price: "€200",
    featureKeys: [
      "rooms.feature.ac",
      "rooms.feature.wifi",
      "rooms.feature.tv",
      "rooms.feature.separateLivingArea",
      "rooms.feature.balcony",
      "rooms.feature.seaView",
      "rooms.feature.kitchenette",
    ],
    bedsKey: "rooms.beds.kingAndSofa",
    capacity: 4,
    size: "50 sqm",
  },
  {
    id: "accessible-room",
    nameKey: "rooms.accessible.name",
    descriptionKey: "rooms.accessible.description",
    image: "/room-6.png",
    price: "€100",
    featureKeys: ["rooms.feature.ac", "rooms.feature.wifi", "rooms.feature.tv", "rooms.feature.accessibleBathroom"],
    bedsKey: "rooms.beds.doubleAccessible",
    capacity: 2,
    size: "28 sqm",
  },
]
