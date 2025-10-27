import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 🔹 Limpa automaticamente os arquivos estáticos antigos (evita ChunkLoadError)
  webpack: (config) => {
    config.output.clean = true;
    return config;
  },

  // 🔹 Otimiza cache no Vercel (estáveis para chunks e estilos)
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-cache" },
        ],
      },
    ];
  },

  images: {
    // 🔹 Libera seu domínio do Vercel Blob Storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lnchkprh92htn3gy.public.blob.vercel-storage.com",
        pathname: "**",
      },
    ],
  },

  compiler: {
    reactRemoveProperties: false,
  },
};

export default nextConfig;
