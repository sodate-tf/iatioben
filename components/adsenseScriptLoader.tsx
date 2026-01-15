"use client";

import Script from "next/script";

export default function AdsenseScriptLoader() {
  return (
    <Script
      id="adsense-loader"
      strategy="afterInteractive"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
      crossOrigin="anonymous"
    />
  );
}
