// global.d.ts
export {};

declare global {
  interface Window {
    // Fila de comandos do AdSense (é um array normal)
    adsbygoogle?: unknown[];
  }
}