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
}

module.exports = nextConfig