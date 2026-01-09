"use client"

import { useEffect, useRef } from "react"

interface ContactMapProps {
  latitude: number
  longitude: number
  zoom?: number
  title?: string
}

export default function ContactMap({ 
  latitude, 
  longitude, 
  zoom = 15,
  title = "Asterias Homes"
}: ContactMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || typeof window === "undefined") return

    // Wait for Leaflet to load
    import("leaflet").then((leafletModule) => {
      const leaflet = leafletModule.default
      
      // Fix for default marker icons
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      // Initialize map
      const map = leaflet.map(mapRef.current!).setView([latitude, longitude], zoom)

      // Add OpenStreetMap tiles
      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Add marker with custom icon
      const customIcon = leaflet.icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      // Add marker
      leaflet.marker([latitude, longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(title)
        .openPopup()

      mapInstanceRef.current = map
    })

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, zoom, title])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-slate-300"
      style={{ zIndex: 0 }}
    />
  )
}

