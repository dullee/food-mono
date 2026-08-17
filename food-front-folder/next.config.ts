import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/images/**", // Allows any image inside an /images/ path
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Allows any image from this host
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;
