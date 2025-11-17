import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProd ? '/nba-wins-league-site' : '', // Conditional basePath for local and production
};

export default nextConfig;
