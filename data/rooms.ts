// This file should provide the data for your rooms, including translation keys.
// Ensure the keys match those in your language-context.tsx

export interface RoomData {
  id: string
  nameKey: string // e.g., "rooms.standard.name"
  descriptionKey: string // e.g., "rooms.standard.description"
  image: string
  capacity?: number // e.g., 2
  size?: string // e.g., "25 sqm" - consider if "sqm" needs translation
}

export const allRoomsData: RoomData[] = [
  {
    id: "standard-double",
    nameKey: "rooms.standard.name",
    descriptionKey: "rooms.standard.description",
    image: "/room-1.png",
    capacity: 2,
    size: "25 sqm",
  },
  {
    id: "family-room",
    nameKey: "rooms.family.name",
    descriptionKey: "rooms.family.description",
    image: "/room-2.png",
    capacity: 4,
    size: "35 sqm",
  },
  {
    id: "romantic-sea-view",
    nameKey: "rooms.romantic.name",
    descriptionKey: "rooms.romantic.description",
    image: "/room-3.png",
    capacity: 2,
    size: "30 sqm",
  },
  {
    id: "twin-room",
    nameKey: "rooms.twin.name",
    descriptionKey: "rooms.twin.description",
    image: "/room-4.png",
    capacity: 2,
    size: "22 sqm",
  },
  {
    id: "suite-deluxe",
    nameKey: "rooms.suite.name",
    descriptionKey: "rooms.suite.description",
    image: "/room-5.png",
    capacity: 4,
    size: "50 sqm",
  },
  {
    id: "accessible-room",
    nameKey: "rooms.accessible.name",
    descriptionKey: "rooms.accessible.description",
    image: "/room-6.png",
    capacity: 2,
    size: "28 sqm",
  },
  {
    id: "superior-apartment",
    nameKey: "rooms.superior.name",
    descriptionKey: "rooms.superior.description",
    image: "/room-1.png",
    capacity: 3,
    size: "40 sqm",
  },
]
