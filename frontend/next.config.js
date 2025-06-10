/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add basePath if your app is not served from the root
  // basePath: '/frontend',
  // Add assetPrefix if your assets are hosted on a CDN
  // assetPrefix: '/frontend/',
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/',
      },
    ]
  },
  // Enable static export for SPA
  output: 'export',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  // Optional: Change the output directory
  distDir: 'build',
}

module.exports = nextConfig
