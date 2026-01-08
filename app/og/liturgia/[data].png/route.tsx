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

function buildRefsDescriptionFromData(data: any) {
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

function formatBRDate(dt: Date) {
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export async function GET(
  request: Request,
  { params }: { params: { data: string } }
) {
  const { origin } = new URL(request.url);

  // Em alguns casos o param pode vir com ".png" junto — garantimos limpeza
  const raw = String(params.data || "").trim();
  const slug = raw.replace(/\.png$/i, "");

  const dt = slug ? parseSlugDate(slug) : null;

  // Background base
  const baseRes = await fetch(`${origin}/og/base.png`, { cache: "force-cache" });
  let backgroundImage: string | null = null;
  if (baseRes.ok) {
    const buffer = await baseRes.arrayBuffer();
    backgroundImage = `data:image/png;base64,${arrayBufferToBase64(buffer)}`;
  }

  // Fontes (assumindo que você já colocou estes TTF em app/og/)
  const [playfairBold, poppinsMedium] = await Promise.all([
    fetch(new URL("../../PlayfairDisplay-Bold.ttf", import.meta.url)).then((r) =>
      r.arrayBuffer()
    ),
    fetch(new URL("../../Poppins-Medium.ttf", import.meta.url)).then((r) =>
      r.arrayBuffer()
    ),
  ]);

  // Se slug inválido, devolve OG padrão noindex (aqui só imagem, então fazemos fallback visual)
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
      description = buildRefsDescriptionFromData(data);
    } catch {
      // mantém fallback
    }
  }

  // Limites práticos para caber bem no template
  const t = clamp(title, 80);
  const d = clamp(description, 180);

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

        {/* Área de texto em fluxo (sem sobreposição) */}
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
            {t}
          </div>

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
            {d}
          </div>

          {/* Badge */}
          <div style={{ display: "flex", marginTop: 10 }}>
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
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
      fonts: [
        { name: "Playfair", data: playfairBold, weight: 700, style: "normal" },
        { name: "Poppins", data: poppinsMedium, weight: 500, style: "normal" },
      ],
    }
  );
}
