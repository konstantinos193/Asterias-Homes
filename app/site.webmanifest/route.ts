import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read the manifest file from public directory
    const manifestPath = path.join(process.cwd(), 'public', 'site.webmanifest')
    
    // Check if file exists
    if (!fs.existsSync(manifestPath)) {
      return new NextResponse(
        JSON.stringify({ error: 'Manifest file not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    
    // Validate JSON before parsing
    if (!manifestContent.trim()) {
      return new NextResponse(
        JSON.stringify({ error: 'Manifest file is empty' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    let manifest
    try {
      manifest = JSON.parse(manifestContent)
    } catch (parseError) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid JSON in manifest file' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Return with proper headers to prevent indexing
    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    // Log error for debugging
    console.error('Error serving manifest:', error)
    
    // Return a valid JSON error response
    return NextResponse.json(
      { error: 'Failed to load manifest' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

