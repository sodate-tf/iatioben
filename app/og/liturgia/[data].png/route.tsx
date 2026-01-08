import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { fetchLiturgiaByDate } from "@/lib/liturgia/api";
import { parseSlugDate } from "@/lib/liturgia/date";

export const runtime = "edge";

const size = { width: 1200, height: 630 };

function formatBRDate(dt: Date) {
  return `${String(dt.getDate()).padStart(2, "0")}/${String(
    dt.getMonth() + 1
  ).padStart(2, "0")}/${dt.getFullYear()}`;
}

function buildRefs(data: any) {
  const parts: string[] = [];
  if (data?.primeiraRef) parts.push(`1ª leitura: ${data.primeiraRef}`);
  if (data?.salmoRef) parts.push(`Salmo: ${data.salmoRef}`);
  if (data?.segundaRef) parts.push(`2ª leitura: ${data.segundaRef}`);
  if (data?.evangelhoRef) parts.push(`Evangelho: ${data.evangelhoRef}`);
  parts.push("Acesse e reze com a Liturgia Diária no IA Tio Ben.");
  return parts.join(" • ");
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ data: string }> }
) {
  const params = await context.params;
  const slug = params.data.replace(/\.png$/i, "");
  const dt = parseSlugDate(slug);

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
    } catch {}
  }

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
          fontFamily: "system-ui",
        }}
      >
        <h1 style={{ fontSize: 72, fontWeight: 900, color: "#465572" }}>
          {title}
        </h1>
        <p style={{ fontSize: 30, marginTop: 24, color: "#465572" }}>
          {description}
        </p>
        <span
          style={{
            marginTop: 32,
            background: "#C8A24A",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 999,
            fontWeight: 800,
            width: "fit-content",
          }}
        >
          LITURGIA
        </span>
      </div>
    ),
    size
  );
}
