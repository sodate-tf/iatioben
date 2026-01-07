// app/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

export const size = {
  width: 1200,
  height: 630,
};

function clamp(text: string, max: number) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const title = clamp(
    searchParams.get("title") ?? "IA Tio Ben",
    90
  );

  const description = clamp(
    searchParams.get("description") ??
      "Liturgia diária, evangelho e leituras para viver a fé todos os dias.",
    160
  );

  // 🔹 busca a imagem em /public/og/base.png
  const imageResponse = await fetch(`${origin}/og/base.png`);

  let backgroundImage: string | null = null;

  if (imageResponse.ok) {
    const buffer = await imageResponse.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buffer)}`;
  }

  return new ImageResponse(
  (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        backgroundColor: "#FFF6E8",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto",
      }}
    >
      {/* background */}
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

      {/* texto */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 80,
          maxWidth: 640,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TÍTULO (mais chamativo e travado em 2 linhas) */}
        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            lineHeight: 1.05,
            color: "#465572",
            letterSpacing: -0.8,
            marginBottom: 22,

            // impede sobreposição com a descrição
            maxHeight: 140, // ~2 linhas nesse tamanho
            overflow: "hidden",
          }}
        >
          {title}
        </div>

        {/* DESCRIÇÃO (travada para não “invadir” visualmente) */}
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.35,
            fontWeight: 500,
            color: "#465572",

            maxHeight: 115, // ~3 linhas
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
