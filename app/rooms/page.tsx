import RoomsClientPage from "./RoomsClientPage"

export const metadata = {
  // Metadata needs to be handled differently for client components or moved to a parent layout/server component if dynamic translation is needed here. For now, focusing on client-side translation.
  title: "Δωμάτια | Asterias Hotel Koronisia",
  description:
    "Ανακαλύψτε τα άνετα και παραδοσιακά δωμάτιά μας στην Κορωνησία Άρτας. Ιδανικά για ζευγάρια, οικογένειες και μοναχικούς ταξιδιώτες.",
}

export default function RoomsPage() {
  return <RoomsClientPage />
}
