export async function GET() {
  return Response.json({
    "name": "mini20i",
    "description": "Base Inscriptions Viewer",
    "url": "https://mini20i.vercel.app",
    "icon": "https://raw.githubusercontent.com/Falazen1/mini20i/247d458041f9aaa57982f1250fbd27074517684d/public/ERC20i%20ecosystem.png?token=GHSAT0AAAAAADDK3QQH4PJT64J6HPSXTOUG2AZBS7A",
    "redirects": [],
    "accountAssociation": {
      "header": "eyJmaWQiOjUxMjY4NywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDk2OTg0NDBGZjliMjVFNzkxMThBQzdkMTU3NDdGMEI3RDZBODc1MTQifQ",
      "payload": "eyJkb21haW4iOiJtaW5pMjBpLnZlcmNlbC5hcHAifQ",
      "signature": "MHhjNjNlZjI5NDVjMjJhMzE5OGZmZjIwZWNhNDhlZWI5NWFiZGRiMjViMTUwMWJjM2MzODBiODM5MjlmZjdhZWJjM2Y1OWM3NTI3NTZkMTljYWM4ZDQ0ZDQ0NjU3NTVmYWI0YTllODk1N2IwMDg4ZmVjZGZkY2RkMWYzMDdmNDM5NTFi",
    },
    "frame": {
      "version": "vNext",
      "imageUrl": "https://raw.githubusercontent.com/Falazen1/mini20i/247d458041f9aaa57982f1250fbd27074517684d/public/ERC20i%20ecosystem.png?token=GHSAT0AAAAAADDK3QQH4PJT64J6HPSXTOUG2AZBS7A",
      "button": {
        "title": "Launch Mini20i",
        "action": {
          "type": "launch_frame",
          "name": "mini20i",
          "url": "https://mini20i.vercel.app",
        }
      }
    }
  });
}

