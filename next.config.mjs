/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets the e2e server build into its own folder so it never clobbers the
  // .next output of a dev server you already have running.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
