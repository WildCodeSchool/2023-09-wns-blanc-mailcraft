/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: ["res.cloudinary.com"],
  },
};

export default nextConfig;
