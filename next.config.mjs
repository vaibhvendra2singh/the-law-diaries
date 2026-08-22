/** @type {import('next').NextConfig} */

// ─────────────────────────────────────────────────────────────────────────────
// next.config.mjs
//
// NOTE: Static export (output: 'export') has been REMOVED.
// The blog now uses API routes + Prisma which require a Node.js server.
//
// Deploy to: Vercel, Railway, Render, or Fly.io.
// Run locally with: npm run dev
// Build for production: npm run build && npm start
// ─────────────────────────────────────────────────────────────────────────────

const nextConfig = {
  // Images: keep unoptimized for simple deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
