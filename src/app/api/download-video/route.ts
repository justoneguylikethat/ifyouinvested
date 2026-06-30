import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  // Safety check: ensure it is downloading from our S3 bucket
  if (!videoUrl.includes('s3.us-east-2.amazonaws.com/remotionlambda-')) {
    return new Response('Invalid video source', { status: 400 });
  }

  try {
    const res = await fetch(videoUrl);
    if (!res.ok) {
      return new Response(`Failed to fetch video from storage: ${res.statusText}`, { status: res.status });
    }

    // Forward the video stream with attachment header to force download
    const headers = new Headers();
    headers.set('Content-Type', 'video/mp4');
    headers.set('Content-Disposition', 'attachment; filename="investment-video.mp4"');
    
    // Copy content-length if available
    const contentLength = res.headers.get('content-length');
    if (contentLength) {
      headers.set('content-length', contentLength);
    }

    return new Response(res.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Video download proxy error:', error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
