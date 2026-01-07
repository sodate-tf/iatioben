// app/og/route.tsx
import { ImageResponse } from "next/og";

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

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // Ajuste fino: menos clamp no título evita corte “agressivo”,
  // e o layout garante 2 linhas no máximo.
  const title = clamp(searchParams.get("title") ?? "IA Tio Ben", 80);

  const description = clamp(
    searchParams.get("description") ??
      "Liturgia diária, evangelho e leituras para viver a fé todos os dias.",
    150
  );

  // Background (você já validou que funciona assim)
  const imageResponse = await fetch(`${origin}/og/base.png`, { cache: "force-cache" });
  let backgroundImage: string | null = null;

  if (imageResponse.ok) {
    const buffer = await imageResponse.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buffer)}`;
  }

  // Fontes embutidas (ESSENCIAL para ficar igual em produção)
  const [playfairBold, poppinsMedium] = await Promise.all([
    fetch(new URL("./PlayfairDisplay-Bold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("./Poppins-Medium.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          backgroundColor: "#FFF6E8",
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
            maxWidth: 660,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* TÍTULO: mais destaque + 2 linhas sem cortar errado */}
          <div
            style={{
              fontFamily: "Playfair",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.02,
              color: "#465572",
              letterSpacing: -0.6,
              marginBottom: 20,

              // 2 linhas no máx, sem “cortar” cedo
              maxHeight: 160, // 72 * 1.02 * 2 = ~147; sobra para anti-aliasing
              overflow: "hidden",
            }}
          >
            {title}
          </div>

          {/* DESCRIÇÃO: estilizada + 3 linhas no máx */}
          <div
            style={{
              fontFamily: "Poppins",
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.35,
              color: "#465572",

              maxHeight: 125, // ~3 linhas: 30 * 1.35 * 3 = 121.5
              overflow: "hidden",
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair", data: playfairBold, weight: 700, style: "normal" },
        { name: "Poppins", data: poppinsMedium, weight: 500, style: "normal" },
      ],
    }
  );
}
