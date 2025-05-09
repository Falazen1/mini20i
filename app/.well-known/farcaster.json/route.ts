export async function GET() {
  return Response.json({
    "accountAssociation": {
      "header": "eyJmaWQiOjUxMjY4NywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDk2OTg0NDBGZjliMjVFNzkxMThBQzdkMTU3NDdGMEI3RDZBODc1MTQifQ",
      "payload": "eyJkb21haW4iOiJtaW5pMjBpLnZlcmNlbC5hcHAifQ",
      "signature": "MHhjNjNlZjI5NDVjMjJhMzE5OGZmZjIwZWNhNDhlZWI5NWFiZGRiMjViMTUwMWJjM2MzODBiODM5MjlmZjdhZWJjM2Y1OWM3NTI3NTZkMTljYWM4ZDQ0ZDQ0NjU3NTVmYWI0YTllODk1N2IwMDg4ZmVjZGZkY2RkMWYzMDdmNDM5NTFi"
    },
    frame: {
      "version": "next",
      "name": "mini20i",
      "subtitle": "Manage ERC20i Inscriptions",
      "tagline": "Your ERC20i inscription hub",
      "description": "Mini20i is a Web3 MiniApp for viewing, combining, and swapping onchain ERC20i inscriptions like Froggi, Fungi, and Pepi.",
      "homeUrl": "https://mini20i.vercel.app",
      "iconUrl": "https://mini20i.vercel.app/favicon.png",
      "imageUrl": "https://mini20i.vercel.app/favicon.png",
      "logo": "https://mini20i.vercel.app/logo.png",
      "appIcon": "https://mini20i.vercel.app/favicon.png",
      "screenshotUrls": [
        "https://mini20i.vercel.app/screenshots/1.png",
        "https://mini20i.vercel.app/screenshots/2.png"
      ],
      "heroImageUrl": "https://mini20i.vercel.app/hero.png",
      "primaryCategory": "finance",
      "tags": ["erc20i", "NFT", "swap", "art", "collectible"],
      "ogTitle": "Swap ERC20i Inscriptions",
      "ogDescription": "Explore Froggi, Fungi, and Pepi — Tokens Evolved.",
      "ogImageUrl": "https://mini20i.vercel.app/og/froggi/0-anon.png",
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
