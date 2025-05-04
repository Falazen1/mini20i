import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="Swap Inscriptions" />
        <meta property="og:image" content="https://mini20i.vercel.app/logo.png" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="https://mini20i.vercel.app/logo.png" />
        <meta name="fc:frame:button:1" content="Open Viewer" />
        <meta name="fc:frame:post_url" content="https://mini20i.vercel.app/frame/api" />
      </head>
      <body></body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
