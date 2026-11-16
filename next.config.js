/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Product photos are local files in /public/images/sarees (served as supplied).
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      { source: '/products', destination: '/sarees', permanent: true },
      { source: '/products/:path*', destination: '/sarees', permanent: false },
      { source: '/checkout', destination: '/cart', permanent: false },
      { source: '/shop', destination: '/sarees', permanent: true },
    ];
  },
};

module.exports = nextConfig;
