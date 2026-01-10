"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const PT_HOME = "/liturgia-diaria";
const EN_HOME = "/en/daily-mass-readings";

function setLangCookie(value: "pt" | "en") {
  document.cookie = `site_lang=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Returns "today" parts in America/Sao_Paulo to avoid server/client TZ drift.
 */
function getTodayPartsSaoPaulo() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const yyyy = Number(parts.find((p) => p.type === "year")?.value);
  const mm = Number(parts.find((p) => p.type === "month")?.value);
  const dd = Number(parts.find((p) => p.type === "day")?.value);

  // Fallback to local date if Intl fails for any reason
  if (!Number.isFinite(yyyy) || !Number.isFinite(mm) || !Number.isFinite(dd)) {
    const now = new Date();
    return { yyyy: now.getFullYear(), mm: now.getMonth() + 1, dd: now.getDate() };
  }

  return { yyyy, mm, dd };
}

/**
 * PT day slug: DD-MM-YYYY
 */
function todaySlugPT() {
  const { yyyy, mm, dd } = getTodayPartsSaoPaulo();
  return `${pad2(dd)}-${pad2(mm)}-${yyyy}`;
}

/**
 * EN day slug: MM-DD-YYYY
 */
function todaySlugEN() {
  const { yyyy, mm, dd } = getTodayPartsSaoPaulo();
  return `${pad2(mm)}-${pad2(dd)}-${yyyy}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const isEN = pathname?.startsWith("/en/");
  const active: "pt" | "en" = isEN ? "en" : "pt";

  function go(lang: "pt" | "en") {
    setLangCookie(lang);

    const target =
      lang === "pt"
        ? `/liturgia-diaria/${todaySlugPT()}`
        : `/en/daily-mass-readings/${todaySlugEN()}`;

    router.push(target);
  }

  const baseBtn =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-300";

  const activeBtn =
    "bg-amber-400 text-amber-950 border border-amber-500 shadow-md shadow-amber-200/50 scale-[1.02]";

  const inactiveBtn =
    "bg-white/80 text-slate-700 border border-slate-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900";

  return (
    <div
      className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/60 p-2 shadow-sm"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => go("pt")}
        className={[baseBtn, active === "pt" ? activeBtn : inactiveBtn].join(" ")}
        aria-label="Português (Brasil)"
        title="Português (Brasil)"
      >
        <span aria-hidden="true">🇧🇷</span>
        <span className="hidden sm:inline">PT</span>
      </button>

      <button
        type="button"
        onClick={() => go("en")}
        className={[baseBtn, active === "en" ? activeBtn : inactiveBtn].join(" ")}
        aria-label="English"
        title="English"
      >
        <span aria-hidden="true">🇺🇸</span>
        <span className="hidden sm:inline">EN</span>
      </button>

      {/* fallback crawl / no JS */}
      <noscript>
        <span className="sr-only">Language links</span>
        <Link href={PT_HOME}>PT</Link>
        <Link href={EN_HOME}>EN</Link>
      </noscript>
    </div>
  );
}
