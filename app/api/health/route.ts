import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check backend connectivity
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    const backendHealth = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }).catch(() => null);

    const backendStatus = backendHealth?.ok ? 'OK' : 'ERROR';
    const backendData = backendHealth ? await backendHealth.json().catch(() => null) : null;

    return NextResponse.json({
      status: 'OK',
      service: 'Asterias Homes Frontend',
      framework: 'Next.js',
      environment: process.env.NODE_ENV || 'development',
      backend_connected: backendStatus === 'OK',
      backend_status: backendStatus,
      backend_details: backendData,
      timestamp: new Date().toISOString(),
      uptime: process.uptime?.() || 0,
      memory: process.memoryUsage?.() || {},
      version: '1.0.0'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      service: 'Asterias Homes Frontend',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
