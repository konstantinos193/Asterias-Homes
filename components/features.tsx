import { Wifi, Coffee, Car, Sparkles } from "lucide-react"

const features = [
  {
    name: "Δωρεάν Wi-Fi",
    description: "Υψηλής ταχύτητας σύνδεση σε όλους τους χώρους",
    icon: Wifi,
  },
  {
    name: "Πρωινό",
    description: "Παραδοσιακό πρωινό με τοπικά προϊόντα",
    icon: Coffee,
  },
  {
    name: "Χώρος Στάθμευσης",
    description: "Δωρεάν ιδιωτικός χώρος στάθμευσης",
    icon: Car,
  },
  {
    name: "Καθημερινή Καθαριότητα",
    description: "Καθαρισμός δωματίων καθημερινά",
    icon: Sparkles,
  },
]

export default function Features() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl font-montserrat">
            Βασικά Χαρακτηριστικά
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 font-lora">
            Απολαύστε σύγχρονες ανέσεις σε παραδοσιακό περιβάλλον.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 font-montserrat">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2C6E91]">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 font-lora">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
