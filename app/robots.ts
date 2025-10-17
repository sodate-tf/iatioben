// app/robots.ts (Exemplo de Next.js App Router)
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    // Aplica a diretiva universal
    rules: [
      {
        userAgent: '*',
        allow: '/', // Permite tudo por padrão
        disallow: '/adminHome/', // Bloqueia sua área administrativa
      },
    ],
    // Adiciona a localização do sitemap
    sitemap: 'https://www.iatioben.com.br/sitemap.xml',
  }
}