/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // Updated defaults for Next.js 16
    minimumCacheTTL: 14400, // 4 hours (new default)
    qualities: [75], // New default quality
    maximumRedirects: 3, // New default max redirects
  },
  // React Compiler (moved from experimental in Next.js 16)
  reactCompiler: true,
  experimental: {
    // Enable Turbopack filesystem caching for faster development
    turbopackFileSystemCacheForDev: true,
  },
}

export default nextConfig
