/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(
  req: Request,
  { params }: { params: { project: string; seed: string } }
) {
  const { project, seed } = params;
  const searchParams = new URL(req.url).searchParams;
  const address = searchParams.get("address") ?? "anon";

  const imageUrl = `https://mini20i.vercel.app/api/png/${project}/${seed}?address=${address}`;

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#000",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={imageUrl}
          width={600}
          height={600}
          alt="Inscription"
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
