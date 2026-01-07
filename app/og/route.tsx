// app/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") ?? "IA Tio Ben";
  const description =
    searchParams.get("description") ??
    "Liturgia diária, evangelho e leituras para viver a fé todos os dias.";

  // URL ABSOLUTA do mockup (public/og/base.png)
  const baseUrl = new URL("/og/base.png", request.url);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          backgroundColor: "#FFF6E8",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* mockup */}
        <img
          src={baseUrl.toString()}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* texto */}
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 80,
            maxWidth: 620,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              margin: 0,
              fontSize: 56,
              lineHeight: 1.15,
              fontWeight: 800,
              color: "#465572",
              letterSpacing: -0.5,
              wordBreak: "break-word",
            }}
          >
            {title}
          </div>

          <div
            style={{
              margin: 0,
              fontSize: 26,
              lineHeight: 1.4,
              fontWeight: 400,
              color: "#465572",
              wordBreak: "break-word",
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
