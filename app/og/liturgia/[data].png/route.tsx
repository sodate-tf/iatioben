// app/og/liturgia/[data].png/route.tsx
import { ImageResponse } from "next/og";
import { fetchLiturgiaByDate } from "@/lib/liturgia/api";
import { parseSlugDate } from "@/lib/liturgia/date";

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

function formatBRDate(dt: Date) {
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function buildRefsForImage(data: any) {
  const primeira =
    data?.primeiraRef || data?.primeiraLeituraRef || data?.primeiraLeitura || null;

  const salmo =
    data?.salmoRef || data?.salmoResponsorialRef || data?.salmo || null;

  const segunda =
    data?.segundaRef || data?.segundaLeituraRef || data?.segundaLeitura || null;

  const evangelho = data?.evangelhoRef || data?.evangelho || null;

  const parts: string[] = [];
  if (primeira) parts.push(`1ª leitura: ${primeira}`);
  if (salmo) parts.push(`Salmo: ${salmo}`);
  if (segunda) parts.push(`2ª leitura: ${segunda}`);
  if (evangelho) parts.push(`Evangelho: ${evangelho}`);

  parts.push("Acesse e reze com a Liturgia Diária no IA Tio Ben.");

  return parts.join(" • ");
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

export async function GET(
  request: Request,
  { params }: { params: { data: string } }
) {
  const { origin } = new URL(request.url);

  const raw = String(params.data || "").trim();
  const slug = raw.replace(/\.png$/i, "");

  const dt = slug ? parseSlugDate(slug) : null;

  // background /public/og/base.png embutido
  const baseRes = await fetch(`${origin}/og/base.png`, { cache: "force-cache" });
  let backgroundImage: string | null = null;
  if (baseRes.ok) {
    const buf = await baseRes.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buf)}`;
  }

  let title = "Liturgia Diária";
  let description =
    "Evangelho, leituras e salmo do dia. Acesse e reze com a Liturgia Diária no IA Tio Ben.";

  if (dt) {
    const day = dt.getDate();
    const month = dt.getMonth() + 1;
    const year = dt.getFullYear();

    const dateLabel = formatBRDate(dt);
    title = `Liturgia Diária — ${dateLabel}`;

    try {
      const data = await fetchLiturgiaByDate(day, month, year);
      description = buildRefsForImage(data);
    } catch {
      // mantém fallback
    }
  }

  // limites para caber bem
  const t = clamp(title, 80);
  const d = clamp(description, 200);

  const badgeText = "LITURGIA";
  const badgeColor = "#C8A24A"; // dourado

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

        {/* Texto em coluna (description só começa após o title terminar) */}
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
              fontSize: 74,
              fontWeight: 900,
              lineHeight: 1.06,
              color: "#465572",
              letterSpacing: -0.6,
              wordBreak: "break-word",
            }}
          >
            {t}
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              lineHeight: 1.45,
              color: "#465572",
              wordBreak: "break-word",
            }}
          >
            {d}
          </div>

          <div style={{ display: "flex", marginTop: 10 }}>
            <div
              style={{
                backgroundColor: badgeColor,
                color: "#fff",
                padding: "10px 16px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 800,
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
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
