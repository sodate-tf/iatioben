import { useEffect } from "react";

interface AdSenseProps {
  adSlot: string; // ID do slot (fornecido pelo AdSense)
  adFormat?: string; // opcional: padrão "auto"
  fullWidthResponsive?: boolean; // opcional: padrão true
  style?: React.CSSProperties; // opcional: customizar estilo
}

export default function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
}: AdSenseProps) {
  useEffect(() => {
    try {
      // Inicializa o bloco de anúncio
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [adSlot]); // reinicializa caso o slot mude

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-8819996017476509" // fixo: sua conta
      data-ad-slot={adSlot} // dinâmico
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}
