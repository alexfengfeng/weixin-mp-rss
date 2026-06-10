/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "better-sqlite3"],
  poweredByHeader: false
};

export default nextConfig;
