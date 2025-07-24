/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {}, // Changed from true to empty object
  },
  images: {
    domains: [
      'www.redditstatic.com',
      'ik.imagekit.io',
      'images.pexels.com'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/reddit/:path*',
        destination: 'https://oauth.reddit.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig