// components/ads/AdsenseLoadScript.tsx
import Script from "next/script";

const ADS_CLIENT = "ca-pub-8819996017476509";

export default function AdsenseLoadScript() {
  return (
    <Script
      id="adsense-loader"
      strategy="afterInteractive"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
