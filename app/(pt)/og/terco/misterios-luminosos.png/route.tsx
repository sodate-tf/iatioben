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

  const baseRes = await fetch(`${origin}/og/base.png`, { cache: "force-cache" });

  let backgroundImage: string | null = null;
  if (baseRes.ok) {
    const buf = await baseRes.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buf)}`;
  }

  const title = clamp("Santo Terço: Mistérios Luminosos", 70);
  const description = clamp(
    "Medite a vida pública de Jesus: Batismo, Caná, anúncio do Reino, Transfiguração e Eucaristia. Clique e reze com Bíblia e reflexões.",
    180
  );

  const daysLine = "Quinta-feira";

  const badgeTercoText = "SANTO TERÇO";
  const badgeTercoColor = "#E85AA5"; // rosa terço

  const badgeTipoText = "LUMINOSOS";
  const badgeTipoColor = "#F1B429"; // dourado “luz” (coerente com o tema e UI)

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
                backgroundColor: badgeTipoColor,
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
              {badgeTipoText}
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
