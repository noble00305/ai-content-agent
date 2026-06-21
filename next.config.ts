import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/": ["./content/**/*"],
    "/posts/[slug]": ["./content/**/*"],
    "/admin": ["./src/memory/**/*", "./logs/**/*"],
    "/admin/approvals": ["./data/**/*"],
    "/admin/logs": ["./logs/**/*"],
    "/admin/shortform": ["./content/shortform/**/*"],
    "/feed.xml": ["./content/**/*"],
    "/sitemap.xml": ["./content/**/*"],
  },
};

export default nextConfig;
