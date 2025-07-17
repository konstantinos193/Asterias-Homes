// app/api/images/[imageName]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest, { params }: { params: { imageName: string } }) {
  const imageName = params.imageName;
  // Adjust the path to your backend images
  const imagePath = path.join(process.cwd(), 'backend', imageName);

  if (!fs.existsSync(imagePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const imageBuffer = fs.readFileSync(imagePath);
  // Guess the content type from extension
  const ext = path.extname(imageName).toLowerCase();
  const contentType =
    ext === '.png' ? 'image/png' :
    ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
    'application/octet-stream';

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: { 'Content-Type': contentType }
  });
}