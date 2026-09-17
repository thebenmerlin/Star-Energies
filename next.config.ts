import type { NextConfig } from "next";

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: cloudinaryCloudName
      ? [
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            pathname: `/${cloudinaryCloudName}/image/upload/**`,
          },
        ]
      : [],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
