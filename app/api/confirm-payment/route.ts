import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://asterias-backend.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the backend with headers
    const backendResponse = await fetch(`${BACKEND_URL}/api/payments/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': request.headers.get('accept-language') || 'el'
      },
      body: JSON.stringify(body)
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Payment confirmation failed' },
      { status: 500 }
    );
  }
} 