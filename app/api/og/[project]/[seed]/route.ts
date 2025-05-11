import { NextRequest } from "next/server";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const forceBlob = true;

export async function POST(
  req: NextRequest,
  { params }: { params: { project: string; seed: string } }
) {
  const { project, seed } = params;
  const searchParams = new URL(req.url).searchParams;
  const address = searchParams.get("address")?.toLowerCase() ?? "anon";
  const { image } = await req.json();

  if (!image || !image.startsWith("data:image/png")) {
    return new Response("Invalid PNG", { status: 400 });
  }

  const buffer = Buffer.from(image.split(",")[1], "base64");

  if (process.env.NODE_ENV === "development" && !forceBlob) {
    const dirPath = path.join(process.cwd(), "public", "og", project);
    const filePath = path.join(dirPath, `${seed}_${address}.png`);
    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, buffer);

    return Response.json({
      ok: true,
      url: `/og/${project}/${seed}_${address}.png`,
    });
  }

const blob = await put(`og/${project}/${seed}_${address}_${Date.now()}.png`, buffer, {
  access: "public",
  token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
});



  return Response.json({
    ok: true,
    url: blob.url,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { project: string; seed: string } }
) {
  const { project, seed } = params;
  const searchParams = new URL(req.url).searchParams;
  const address = searchParams.get("address")?.toLowerCase() ?? "anon";

  if (process.env.NODE_ENV === "development" && !forceBlob) {
    try {
      const filePath = path.join(
        process.cwd(),
        "public",
        "og",
        project,
        `${seed}_${address}.png`
      );
      const file = await readFile(filePath);
      return new Response(file as unknown as BodyInit, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache",
        },
      });
    } catch {
      return new Response("Image not found", { status: 404 });
    }
  }

  return new Response("Use blob URL", { status: 410 });
}
