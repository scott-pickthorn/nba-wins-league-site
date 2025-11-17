import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/nba-wins-league-site', // Use repository name as base path for GitHub Pages
};

export default nextConfig;
