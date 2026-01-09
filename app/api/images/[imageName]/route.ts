// app/api/images/[imageName]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/lib/backend-url';

export async function GET(request: NextRequest, { params }: { params: Promise<{ imageName: string }> }) {
  try {
    const { imageName } = await params;
    
    // Proxy the request to the backend API
    const backendUrl = getBackendApiUrl(`/api/images/${imageName}`);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      return new NextResponse('Image not found', { status: response.status });
    }

    // Get the image buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Get content type from backend response or guess from extension
    const contentType = response.headers.get('Content-Type') || 
      (imageName.toLowerCase().endsWith('.png') ? 'image/png' :
       imageName.toLowerCase().endsWith('.jpg') || imageName.toLowerCase().endsWith('.jpeg') ? 'image/jpeg' :
       imageName.toLowerCase().endsWith('.gif') ? 'image/gif' :
       imageName.toLowerCase().endsWith('.webp') ? 'image/webp' :
       'application/octet-stream');

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // 1 year cache
      }
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}