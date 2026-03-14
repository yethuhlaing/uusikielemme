import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Static export only when building for production; in dev, dynamic routes work on demand
    ...(process.env.NODE_ENV === "production" && { output: "export" as const }),
};

export default nextConfig;
