import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   // ... (outras configurações que você possa ter)
  
  images: {
    // ESTA PARTE É OBRIGATÓRIA PARA IMAGENS EXTERNAS
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'lnchkprh92htn3gy.public.blob.vercel-storage.com',
            pathname: '**', // Permite qualquer caminho no Blob
        },
    ],
    // A propriedade 'domains' também funciona, mas 'remotePatterns' é o método moderno.
    // Se você estiver usando uma versão mais antiga do Next.js, use 'domains':
    // domains: ['lnchkprh92htn3gy.public.blob.vercel-storage.com'],
  },
};

export default nextConfig;
