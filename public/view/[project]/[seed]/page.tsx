import Head from "next/head";

type PageProps = {
  params: { project: string; seed: string };
  searchParams?: { address?: string };
};

export const dynamic = "force-dynamic";

export default function Page({ params, searchParams }: PageProps) {
  const { project, seed } = params;
  const address = searchParams?.address || "anon";
  const imageUrl = `https://mini20i.vercel.app/api/og/${project}/${seed}?address=${address}`;

  return (
    <html>
      <Head>
        <title>{`Check out my ${project} inscription!`}</title>
        <meta property="og:title" content="My Inscription" />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body>
        <p>Redirecting...</p>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.href = "/"`,
          }}
        />
      </body>
    </html>
  );
}
