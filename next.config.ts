import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ DESLIGA sourceMap de produção (corrige bug de CSS quebrando na 1ª carga)
  productionBrowserSourceMaps: false,

  // ✅ REMOVE turbopack manual (estava te quebrando o CSS)
  // turbopack: {}, ❌ REMOVIDO

  // ✅ Otimização real de CSS e navegação
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // ✅ Cache PERFEITO para produção no Vercel
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache",
          },
        ],
      },
    ];
  },

  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "lnchkprh92htn3gy.public.blob.vercel-storage.com",
      pathname: "**",
    },
    {
      protocol: "https",
      hostname: "www.iatioben.com.br",
      pathname: "/**",
    },
  ],
},

  compiler: {
    reactRemoveProperties: false,
  },
};

export default nextConfig;
