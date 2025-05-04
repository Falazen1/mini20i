// app/page.tsx (server component)
export const metadata = {
    title: "Mini 20i",
    description: "View, manage, and swap Inscriptions",
    openGraph: {
      title: "Mini 20i",
      description: "View, manage, and swap Inscriptions",
      images: [
        {
          url: "https://mini20i.vercel.app/logo.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
  
  import dynamic from "next/dynamic";
  const PageClient = dynamic(() => import("./page-client"), { ssr: false });
  
  export default function Page() {
    return <PageClient />;
  }
  