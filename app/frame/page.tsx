// app/frame/page.tsx
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Swap Base Inscriptions',
    openGraph: {
      title: 'Swap Base Inscriptions',
      images: ['https://mini20i.vercel.app/logo.png'],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': 'https://mini20i.vercel.app/logo.png',
      'fc:frame:button:1': 'Open Viewer',
      'fc:frame:post_url': 'https://mini20i.vercel.app/frame/api',
    },
  };
}

export default function FramePage() {
  return <div />; // content doesn't matter — only metadata is parsed
}
