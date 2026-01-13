// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.iatioben.com.br"),
};

export const viewport: Viewport = {
  themeColor: "#fbbf24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // IMPORTANT:
  // Root layout must NOT hardcode <html lang="pt-BR"> when you have /en routes.
  // Locale-specific <html> should be in route-group layouts below.
  return children as React.ReactElement;
}
