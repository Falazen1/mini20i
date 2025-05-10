// /app/api/og/[project]/[seed]/route.ts
import { NextRequest } from "next/server";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { imageCache } from "../../../../../lib/memory"; // make sure this path matches your setup

export async function POST(
  req: NextRequest,
  { params }: { params: { project: string; seed: string } }
) {
  const { project, seed } = params;
  const searchParams = new URL(req.url).searchParams;
  const address = searchParams.get("address")?.toLowerCase() ?? "anon";
  const id = `${project}-${seed}-${address}`;

  const { image } = await req.json();
  if (!image || !image.startsWith("data:image/png")) {
    return new Response("Invalid PNG", { status: 400 });
  }

  const buffer = Buffer.from(image.split(",")[1], "base64");

  // ✅ Save to disk in dev
  if (process.env.NODE_ENV === "development") {
    const dirPath = path.join(process.cwd(), "public", "og", project);
    const filePath = path.join(dirPath, `${seed}_${address}.png`);
    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, buffer);
  }

  // ✅ Also store in memory (for prod fallback)
  imageCache.set(id, buffer);

  return new Response(
    JSON.stringify({
      ok: true,
      url: `/api/og/${project}/${seed}?address=${address}`,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { project: string; seed: string } }
) {
  const { project, seed } = params;
  const searchParams = new URL(req.url).searchParams;
  const address = searchParams.get("address")?.toLowerCase() ?? "anon";
  const id = `${project}-${seed}-${address}`;

  // ✅ Try loading from disk first in dev mode
  if (process.env.NODE_ENV === "development") {
    try {
      const filePath = path.join(
        process.cwd(),
        "public",
        "og",
        project,
        `${seed}_${address}.png`
      );
      const file = await readFile(filePath);
      return new Response(new Uint8Array(file), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache",
        },
      });
    } catch {
      // fall through to in-memory
    }
  }

  // ✅ Fallback to in-memory cache
  const buffer = imageCache.get(id);
  if (!buffer) {
    return new Response("Image not found", { status: 404 });
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=300",
    },
  });
}
