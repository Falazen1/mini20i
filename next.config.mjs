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
      "d38ulo0p1ibxtf.cloudfront.net"
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
