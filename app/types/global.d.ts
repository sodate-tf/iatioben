// global.d.ts
export {};

declare global {
  interface Window {
    adsbygoogle?: Array<{
      push: (obj: Record<string, unknown>) => void;
    }>;
  }
}
