import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

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

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);

  // ✅ Seu mockup padrão
  const baseRes = await fetch(`${origin}/og/base.png`, { cache: "force-cache" });

  let backgroundImage: string | null = null;
  if (baseRes.ok) {
    const buf = await baseRes.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buf)}`;
  }

  const title = clamp("Santo Terço: Mistérios Gloriosos", 70);
  const description = clamp(
    "Medite a Ressurreição e a glória do Céu em cada dezena. Clique para rezar com passagens bíblicas e reflexões profundas.",
    170
  );

  // Dias (fora do badge)
  const daysLine = "Quarta e Domingo";

  // Badges
  const badgeTercoText = "SANTO TERÇO";
  const badgeTercoColor = "#E85AA5"; // rosa terço

  const badgeGloriososText = "GLORIOSOS";
  const badgeGloriososColor = "#2D5BFF"; // azul “céu/glória” (harmoniza com o layout)

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
            top: 125,
            left: 80,
            width: 700,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Dias */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#465572",
              opacity: 0.9,
            }}
          >
            {daysLine}
          </div>

          {/* Título */}
          <div
            style={{
              fontSize: 70,
              fontWeight: 900,
              lineHeight: 1.06,
              color: "#465572",
              letterSpacing: -0.6,
              wordBreak: "break-word",
            }}
          >
            {title}
          </div>

          {/* Descrição / CTA */}
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

          {/* Badges */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <div
              style={{
                backgroundColor: badgeTercoColor,
                color: "#fff",
                padding: "10px 14px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              }}
            >
              {badgeTercoText}
            </div>

            <div
              style={{
                backgroundColor: badgeGloriososColor,
                color: "#fff",
                padding: "10px 14px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              }}
            >
              {badgeGloriososText}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
