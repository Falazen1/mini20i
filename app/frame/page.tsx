// app/frame/page.tsx
export const dynamic = 'force-dynamic';

export default function FramePage() {
  return (
    <html>
      <head>
        <meta property="og:title" content="Swap Base Inscriptions" />
        <meta property="og:image" content="https://mini20i.vercel.app/logo.png" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="https://mini20i.vercel.app/logo.png" />
        <meta name="fc:frame:button:1" content="Open Viewer" />
        <meta name="fc:frame:post_url" content="https://mini20i.vercel.app/frame/api" />
      </head>
      <body></body>
    </html>
  );
}
