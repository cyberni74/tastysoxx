import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old URLs from the socks-only version → new SEO structure
  async redirects() {
    return [
      { source: "/shop", destination: "/marktplatz", permanent: true },
      { source: "/faq", destination: "/hilfe", permanent: true },
    ];
  },
};

export default nextConfig;
