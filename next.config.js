/** @type {import('next').NextConfig} */
const backendUrl = (
  process.env.BACKEND_INTERNAL_URL ||
  'http://localhost:8000'
).replace(/\/$/, '')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
