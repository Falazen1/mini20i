// /app/view/[project]/[seed]/page.tsx

type PageProps = {
  params: { project: string; seed: string };
  searchParams: { address?: string };
};

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { project, seed } = params;
  const address = searchParams?.address?.toLowerCase() ?? "anon";

  return {
    title: "Mini20i Viewer",
    openGraph: {
      images: [`https://mini20i.vercel.app/api/png/${project}/${seed}?address=${address}`],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": `https://mini20i.vercel.app/api/png/${project}/${seed}?address=${address}`,
      "fc:frame:button:1": "Launch Mini20i",
      "fc:frame:button:1:action": "post_redirect",
      "fc:frame:post_url": `https://mini20i.vercel.app/`,
    },
  };
}

export default function ViewPage({ params }: PageProps) {
  const { project, seed } = params;

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Mini20i</h1>
        <p className="text-lg">{`You're viewing ${project} #${seed}`}</p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
