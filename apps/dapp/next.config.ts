import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || '',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  }
};

export default nextConfig;
