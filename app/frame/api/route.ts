import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    frames: {
      image: 'https://mini20i.vercel.app/logo.png',
      buttons: [
        {
          label: 'Visit App',
          action: 'link',
          target: 'https://mini20i.vercel.app',
        },
      ],
    },
  });
}
