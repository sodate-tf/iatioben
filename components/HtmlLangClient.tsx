"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HtmlLangClient() {
  const pathname = usePathname();

  useEffect(() => {
    const isEn = pathname === "/en" || pathname.startsWith("/en/");
    document.documentElement.lang = isEn ? "en-US" : "pt-BR";
  }, [pathname]);

  return null;
}
