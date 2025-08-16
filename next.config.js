/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'images.igdb.com',
      'media.rawg.io',
      'cdn2.unrealengine.com',
      'steamcdn-a.akamaihd.net',
      'cdn.cloudflare.steamstatic.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable static optimization for better performance
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  // Optimize for Vercel
  swcMinify: true,
}

module.exports = nextConfig