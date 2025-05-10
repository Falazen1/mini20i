// app/lib/memory.ts
const globalForCache = globalThis as unknown as {
  __imageCache__: Map<string, Buffer> | undefined;
};

export const imageCache =
  globalForCache.__imageCache__ ?? new Map<string, Buffer>();

if (process.env.NODE_ENV !== "production") {
  globalForCache.__imageCache__ = imageCache;
}
