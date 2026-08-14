import { createMDX } from 'fumadocs-mdx/next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/worldbuilder',
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
  turbopack: {
    root: projectRoot,
  },
  // Allow LAN IP access in dev (Next.js 16 blocks cross-origin dev assets by default).
  // Override via ALLOWED_DEV_ORIGINS=192.168.x.x,other-host (comma-separated).
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
    ? process.env.ALLOWED_DEV_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : ['192.168.2.94'],
};

export default withMDX(nextConfig);
