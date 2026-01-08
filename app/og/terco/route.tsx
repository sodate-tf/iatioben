import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const contentType = "image/png";

const size = { width: 1200, height: 630 };

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

export async function GET(request: NextRequest) {
  const { origin, searchParams } = new URL(request.url);

  // ✅ Você pode permitir override por query se quiser (opcional)
  // /og/terco?title=...&description=...
  const titleRaw =
    searchParams.get("title") ||
    "Aprenda a rezar o Santo Terço";

  const descRaw =
    searchParams.get("description") ||
    "Guia completo e prático: passo a passo, ordem das orações e mistérios para rezar com sentido. Clique e aprenda a devoção do Terço hoje.";

  // ✅ Embute seu mockup padrão (public/og/base.png)
  const baseRes = await fetch(`${origin}/og/base.png`, { cache: "force-cache" });
  let backgroundImage: string | null = null;

  if (baseRes.ok) {
    const buf = await baseRes.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buf)}`;
  }

  const title = clamp(titleRaw, 85);
  const description = clamp(descRaw, 210);

  // Badge: rosa + “SANTO TERÇO”
  const badgeText = "SANTO TERÇO";
  const badgeColor = "#E55DA9"; // rosa (ajuste fino se quiser)

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

        {/* Coluna de texto (description só após terminar o título) */}
        <div
          style={{
            position: "absolute",
            top: 135,
            left: 80,
            width: 710,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 78,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#465572",
              letterSpacing: -0.7,
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
                letterSpacing: 0.7,
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
        // Para WhatsApp, não recomendo immutable em OG dinâmico.
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
