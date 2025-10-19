/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Allow builds to complete even with lint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
