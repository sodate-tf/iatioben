import type { Metadata } from "next";

const SITE_URL = "https://www.iatioben.com.br";

export const metadata: Metadata = {
  title: "Teste OG WhatsApp | IA Tio Ben",
  description: "Página de teste para validar preview com imagem no WhatsApp.",
  alternates: { canonical: `${SITE_URL}/og-test` },

  openGraph: {
    type: "website",
    url: `${SITE_URL}/og-test`,
    siteName: "IA Tio Ben",
    locale: "pt_BR",
    title: "Teste OG WhatsApp | IA Tio Ben",
    description: "Se você está vendo esta imagem no WhatsApp, a rota .png funciona.",
    images: [
      {
        url: `${SITE_URL}/og/test.png`,
        width: 1200,
        height: 630,
        alt: "Teste OG WhatsApp",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Teste OG WhatsApp | IA Tio Ben",
    description: "Se aparecer imagem, está OK.",
    images: [`${SITE_URL}/og/test.png`],
  },
};

export default function OgTestPage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Teste de OG para WhatsApp</h1>
      <p>
        Compartilhe este link no WhatsApp:
        <br />
        <a href="/og-test">https://www.iatioben.com.br/og-test</a>
      </p>
      <p>
        A imagem usada é:
        <br />
        <a href="/og/test.png">https://www.iatioben.com.br/og/test.png</a>
      </p>
    </main>
  );
}
