import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**", // ← Allow all Firebase/GCS paths
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**", // ← Allow all Firebase/GCS paths
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // ← Allow all Firebase/GCS paths
      },
    ],
  },
};

export default nextConfig;
