import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { project: string; seed: string } }
) {
  const { project, seed } = params;
  const { image } = await req.json();

  if (!image || !image.startsWith("data:image/png")) {
    return new Response("Invalid PNG", { status: 400 });
  }

  const buffer = Buffer.from(image.split(",")[1], "base64");
  const dirPath = path.join(process.cwd(), "public", "og", project);
const searchParams = new URL(req.url).searchParams;
const address = searchParams.get("address") ?? "anon";
const filename = `${seed}-${address}.png`;
const filePath = path.join(dirPath, filename);


  try {
    await mkdir(dirPath, { recursive: true }); // ✅ Create folder if missing
    await writeFile(filePath, buffer); // ✅ Save PNG file
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to save PNG:", err);
    return new Response("Failed to write file", { status: 500 });
  }
}
export async function GET(
  req: NextRequest,
  { params }: { params: { project: string; seed: string } }
) {
  const { project, seed } = params;
  const searchParams = new URL(req.url).searchParams;
  const address = searchParams.get("address") ?? "anon";
  const imageUrl = `https://mini20i.vercel.app/og/${project}/${seed}-${address}.png`;

  return new Response(
    `
    <html>
      <head>
        <meta property="og:title" content="My ${project} Inscription" />
        <meta property="og:image" content="${imageUrl}" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body></body>
    </html>
  `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
