/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    // Disable cache in development to prevent corruption issues
    if (dev && isServer) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;