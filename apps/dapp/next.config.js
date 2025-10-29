/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lottie.host',
      },
    ],
  },
  // Add Neon-specific configuration
  serverExternalPackages: ['@neondatabase/serverless']
}

module.exports = nextConfig 