// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PT_HOME = "/liturgia-diaria";
const EN_HOME = "/en/daily-mass-readings";

// você pode expandir depois para cobrir outras rotas
export const config = {
  matcher: ["/liturgia-diaria", "/en/daily-mass-readings"],
};

function detectPreferredLang(req: NextRequest): "pt" | "en" {
  // 1) Preferência explícita (cookie)
  const cookieLang = req.cookies.get("site_lang")?.value;
  if (cookieLang === "pt" || cookieLang === "en") return cookieLang;

  // 2) Detecção por header (primeira língua)
  const al = (req.headers.get("accept-language") || "").toLowerCase();
  // ex: "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
  const first = al.split(",")[0]?.trim() || "";
  if (first.startsWith("pt")) return "pt";

  // 3) Default
  return "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const lang = detectPreferredLang(req);

  // Evitar loops: só redireciona quando estiver na "home" do idioma errado
  if (pathname === PT_HOME && lang !== "pt") {
    const url = req.nextUrl.clone();
    url.pathname = EN_HOME;
    return NextResponse.redirect(url);
  }

  if (pathname === EN_HOME && lang === "pt") {
    const url = req.nextUrl.clone();
    url.pathname = PT_HOME;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
