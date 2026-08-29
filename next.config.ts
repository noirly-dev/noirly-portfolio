import type { NextConfig } from "next";

const r2Host = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined;

const contentApiHost = (() => {
  try {
    const url = process.env.SITE_CONTENT_API_URL;
    return url ? new URL(url).hostname : undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react", "@mdi/js", "@mdi/react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "noirly-calculator.aneesh-pissay.in",
      },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
      ...(contentApiHost
        ? [
            {
              protocol: "http" as const,
              hostname: contentApiHost,
              pathname: "/**",
            },
            {
              protocol: "https" as const,
              hostname: contentApiHost,
              pathname: "/**",
            },
          ]
        : []),
      ...(r2Host
        ? [{ protocol: "https" as const, hostname: r2Host, pathname: "/**" }]
        : []),
    ],
  },
};

export default nextConfig;
