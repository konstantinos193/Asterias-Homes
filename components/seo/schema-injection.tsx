'use client'

import React, { useEffect } from 'react'
import { generateOrganizationSchema, generateHotelSchema, generatePlaceSchema, generateLocalBusinessSchema } from './structured-data'

interface SchemaInjectionProps {
  lang: string
}

export default function SchemaInjection({ lang }: SchemaInjectionProps) {
  useEffect(() => {
    // Generate structured data based on language
    const schemas = [
      generateOrganizationSchema(),
      generateHotelSchema(),
      generatePlaceSchema(),
      generateLocalBusinessSchema()
    ]

    // Remove existing schema scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
    existingScripts.forEach(script => script.remove())

    // Add new schema scripts
    schemas.forEach(schema => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    })

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      scripts.forEach(script => script.remove())
    }
  }, [lang])

  return null
}
