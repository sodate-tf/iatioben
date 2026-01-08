import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { fetchLiturgiaByDate } from "@/lib/liturgia/api";
import { parseSlugDate } from "@/lib/liturgia/date";

export const runtime = "edge";
export const contentType = "image/png";

const size = { width: 1200, height: 630 };

function clamp(text: string, max: number) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function formatBRDate(dt: Date) {
  return `${String(dt.getDate()).padStart(2, "0")}/${String(
    dt.getMonth() + 1
  ).padStart(2, "0")}/${dt.getFullYear()}`;
}

function buildRefs(data: any) {
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

export async function GET(request: NextRequest, context: any) {
  // ✅ Next 16 validator: context.params é Promise<{}>, então não tipamos.
  const params = (await context?.params) as Record<string, string>;
  const raw = String(params?.data || "").trim();
  const slug = raw.replace(/\.png$/i, "");

  const dt = slug ? parseSlugDate(slug) : null;

  let title = "Liturgia Diária";
  let description =
    "Evangelho, leituras e salmo do dia. Acesse e reze com a Liturgia Diária no IA Tio Ben.";

  if (dt) {
    title = `Liturgia Diária — ${formatBRDate(dt)}`;
    try {
      const data = await fetchLiturgiaByDate(
        dt.getDate(),
        dt.getMonth() + 1,
        dt.getFullYear()
      );
      description = buildRefs(data);
    } catch {
      // mantém fallback
    }
  }

  const t = clamp(title, 80);
  const d = clamp(description, 200);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFF6E8",
          padding: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        <div style={{ fontSize: 74, fontWeight: 900, lineHeight: 1.06, color: "#465572" }}>
          {t}
        </div>

        <div style={{ fontSize: 30, fontWeight: 600, marginTop: 22, lineHeight: 1.45, color: "#465572" }}>
          {d}
        </div>

        <div style={{ marginTop: 28 }}>
          <span
            style={{
              background: "#C8A24A",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 999,
              fontWeight: 800,
              letterSpacing: 0.6,
            }}
          >
            LITURGIA
          </span>
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
