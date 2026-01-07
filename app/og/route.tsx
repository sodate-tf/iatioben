import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

export const size = { width: 1200, height: 630 };

function clamp(text: string, max: number) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const title = clamp(searchParams.get("title") ?? "IA Tio Ben", 70);
  const description = clamp(
    searchParams.get("description") ??
      "Liturgia diária, evangelho e leituras para viver a fé todos os dias.",
    140
  );

  // carrega a base do /public/og/base.png
  const baseRes = await fetch(`${origin}/og/base.png`, { cache: "force-cache" });
  const bg =
    baseRes.ok
      ? `data:image/png;base64,${arrayBufferToBase64(await baseRes.arrayBuffer())}`
      : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: "#FFF6E8",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        }}
      >
        {bg && (
          <img
            src={bg}
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
            top: 140,
            left: 80,
            maxWidth: 620,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Título (mais chamativo e com limite para não “invadir” a descrição) */}
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#465572",
              letterSpacing: -0.8,
              marginBottom: 22,
              maxHeight: 130, // impede sobreposição
              overflow: "hidden",
            }}
          >
            {title}
          </div>

          {/* Descrição */}
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              lineHeight: 1.45,
              color: "#465572",
              maxHeight: 110,
              overflow: "hidden",
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    size
  );
}
