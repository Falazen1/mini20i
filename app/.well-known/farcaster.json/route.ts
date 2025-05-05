export async function GET() {
  return Response.json({
    "accountAssociation": {
      "header": "...",
      "payload": "...",
      "signature": "..."
    },
    frame: {
      "version": "next",
      "name": "mini20i",
      "homeUrl": "https://mini20i.vercel.app",
      "iconUrl": "https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/ERC20i%20ecosystem.jpg",
      "imageUrl": "https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/ERC20i%20ecosystem.jpg",
      "buttonTitle": "Launch Mini20i",
      "splashImageUrl": "https://raw.githubusercontent.com/Falazen1/Inscription_Viewer/refs/heads/main/ERC20i%20ecosystem.jpg",
      "splashBackgroundColor": "#282c34",
      "webhookUrl": "https://mini20i.vercel.app/api/webhook",
      "postUrl": "https://mini20i.vercel.app",
      "buttons": [
        {
          "label": "Launch mini20i",
          "action": "post"
        }
      ]
    }
  });
}
