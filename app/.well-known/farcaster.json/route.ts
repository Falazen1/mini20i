export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const project = searchParams.get("project") ?? "froggi";
  const seed = searchParams.get("seed") ?? "0";
  const address = searchParams.get("address") ?? "anon";
    const dynamicImageUrl = `https://mini20i.vercel.app/og/${project}/${seed}-${address}.png`;

  return Response.json({
    "accountAssociation": {
      "header": "eyJmaWQiOjUxMjY4NywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDk2OTg0NDBGZjliMjVFNzkxMThBQzdkMTU3NDdGMEI3RDZBODc1MTQifQ",
      "payload": "eyJkb21haW4iOiJtaW5pMjBpLnZlcmNlbC5hcHAifQ",
      "signature": "MHhjNjNlZjI5NDVjMjJhMzE5OGZmZjIwZWNhNDhlZWI5NWFiZGRiMjViMTUwMWJjM2MzODBiODM5MjlmZjdhZWJjM2Y1OWM3NTI3NTZkMTljYWM4ZDQ0ZDQ0NjU3NTVmYWI0YTllODk1N2IwMDg4ZmVjZGZkY2RkMWYzMDdmNDM5NTFi"
    },
    frame: {
      "version": "next",
      "imageUrl": "https://mini20i.vercel.app/favicon.png",
      "iconUrl": "https://mini20i.vercel.app/favicon.png",
      "logo": "https://mini20i.vercel.app/logo.png",
      "appIcon": "https://mini20i.vercel.app/favicon.png",
      "name": "mini20i",
      "ogImageUrl": dynamicImageUrl,
      "twitterImageUrl": dynamicImageUrl,
      "button": {
        "title": "Launch Mini20i",
        "action": {
          "type": "launch_frame",
          "name": "mini20i",
          "url": "https://mini20i.vercel.app"
        }
      }
    }
  });
}
