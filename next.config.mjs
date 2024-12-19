/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Define domains and paths for optimized remote images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**', // Allow all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allow all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**', // Allow all paths under this domain
      },
    ],
  },
};

export default nextConfig;
