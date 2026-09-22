import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.BACKEND_INTERNAL_URL || "http://localhost:8080/api/v1/:path*",
      },
      {
        source: "/admin/dashboard",
        destination: "/dashboard",
      },
      {
        source: "/admin/orders",
        destination: "/orders",
      },
      {
        source: "/admin/tables",
        destination: "/tables",
      },
      {
        source: "/admin/menu",
        destination: "/menu",
      },
      {
        source: "/admin/staff",
        destination: "/staff",
      },
      {
        source: "/admin/inventory",
        destination: "/inventory",
      },
      {
        source: "/admin",
        destination: "/dashboard",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
