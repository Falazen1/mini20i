/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  output: 'standalone',
  images: {
    domains: [
      "www.dextools.io",
      "froggi.app",
      "raw.githubusercontent.com",
      "jelli.blue",
      "pepe-erc20i.vip",
      "truffi.xyz",
      "d38ulo0p1ibxtf.cloudfront.net",
      "mini20i.vercel.app",
      "mini-20i.app"
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  async headers() {
    return [
      {
        source: "/logo.png",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
