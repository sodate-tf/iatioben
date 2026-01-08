// app/og/terco.png/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

// (opcional, mas ajuda alguns crawlers)
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      // Cache ok para crawlers; se você estiver testando muito, pode reduzir
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

function clamp(text: string, max: number) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  // ✅ usa seu mockup padrão
  const baseRes = await fetch(`${origin}/og/base.png`, { cache: "force-cache" });
  let backgroundImage: string | null = null;

  if (baseRes.ok) {
    const buf = await baseRes.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buf)}`;
  }

  const title = clamp("Aprenda a rezar o Santo Terço", 70);
  const description = clamp(
    "Passo a passo, mistérios e dias certos. Um guia simples para começar hoje e rezar com sentido.",
    160
  );

  const badgeText = "SANTO TERÇO";
  const badgeColor = "#E85AAE"; // rosa

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          backgroundColor: "#FFF6E8",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 135,
            left: 80,
            width: 690,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 1.06,
              color: "#465572",
              letterSpacing: -0.6,
              wordBreak: "break-word",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 650,
              lineHeight: 1.45,
              color: "#465572",
              wordBreak: "break-word",
            }}
          >
            {description}
          </div>

          <div style={{ display: "flex", marginTop: 10 }}>
            <div
              style={{
                backgroundColor: badgeColor,
                color: "#fff",
                padding: "10px 16px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              }}
            >
              {badgeText}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
