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

function sanitizeColor(input: string | null, fallback: string) {
  const v = String(input || "").trim();
  // aceita apenas HEX (#RGB / #RRGGBB / #RRGGBBAA)
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)) return v;
  return fallback;
}

function defaultsByType(type: string | null) {
  const t = String(type || "").toLowerCase();
  if (t === "liturgia") return { badgeText: "LITURGIA", badgeColor: "#C8A24A" }; // dourado
  if (t === "terco" || t === "terço") return { badgeText: "TERÇO", badgeColor: "#E56BA8" }; // rosa
  return { badgeText: "BLOG", badgeColor: "#2FBF71" }; // verde (padrão)
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const title = clamp(searchParams.get("title") ?? "IA Tio Ben", 90);
  const description = clamp(
    searchParams.get("description") ??
      "Liturgia diária, evangelho e leituras para viver a fé todos os dias.",
    200
  );

  // Badge: por type (automático) + override manual
  const type = searchParams.get("type"); // blog | liturgia | terco
  const typeDefaults = defaultsByType(type);

  const badgeText =
    (searchParams.get("badgeText") || "").trim() || typeDefaults.badgeText;

  const badgeColor = sanitizeColor(
    searchParams.get("badgeColor"),
    typeDefaults.badgeColor
  );

  // background
  const imageResponse = await fetch(`${origin}/og/base.png`, { cache: "force-cache" });
  let backgroundImage: string | null = null;

  if (imageResponse.ok) {
    const buffer = await imageResponse.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buffer)}`;
  }

  // Fontes (mantém o que você já estava usando)
  // Se você já colocou os TTF no app/og, deixe assim:
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

        {/* ÁREA DE TEXTO EM FLUXO (SEM OVERLAP) */}
        <div
          style={{
            position: "absolute",
            top: 135,
            left: 80,
            width: 650,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* TÍTULO */}
          <div
            style={{
              fontFamily: "Playfair",
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.03,
              color: "#465572",
              letterSpacing: -0.6,
              wordBreak: "break-word",
              margin: 0,
            }}
          >
            {title}
          </div>

          {/* DESCRIÇÃO: começa APÓS o título, sempre */}
          <div
            style={{
              fontFamily: "Poppins",
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.45,
              color: "#465572",
              wordBreak: "break-word",
              margin: 0,
            }}
          >
            {description}
          </div>

          {/* BADGE NO FINAL */}
          <div
            style={{
              display: "flex",
              marginTop: 10,
            }}
          >
            <div
              style={{
                backgroundColor: badgeColor,
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: 999,
                fontFamily: "Poppins",
                fontSize: 18,
                fontWeight: 700,
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
      fonts: [
        { name: "Playfair", data: playfairBold, weight: 700, style: "normal" },
        { name: "Poppins", data: poppinsMedium, weight: 500, style: "normal" },
      ],
    }
  );
}
