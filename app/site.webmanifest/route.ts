import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read the manifest file from public directory
    const manifestPath = path.join(process.cwd(), 'public', 'site.webmanifest')
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    // Return with proper headers to prevent indexing
    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    // If file doesn't exist, return 404
    return new NextResponse(null, { status: 404 })
  }
}

