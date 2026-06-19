/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Next.js it is safe to load JavaScript when using this IP address
  allowedDevOrigins: ['192.168.0.103', 'localhost'],
};

export default nextConfig;