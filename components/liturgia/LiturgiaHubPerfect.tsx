// components/liturgia/LiturgiaHubPerfect.tsx
"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

type Props = {
  siteUrl: string;
  hubCanonicalPath: string;
  dateSlug: string; // dd-mm-aaaa

  // Pode ser LiturgiaNormalized (normalizado) OU o JSON raw (fallback/legado)
  data: any;

  prevSlug: string;
  nextSlug: string;

  todaySlug: string;
  todayLabel: string;

  dailyParagraph?: string;
  className?: string;
  
  blogComplement?: {
    title: string;
    paragraph: string;
    slug: string;
  } | null;
};

type UiTab = {
  id: string;
  label: string;
  kind:
    | "pair"
    | "reading"
    | "psalm"
    | "gospel"
    | "extras"
    | "prayers"
    | "antiphons";
  payload: any;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * "Raw" histórico: { data, liturgia, cor, leituras, oracoes, antifonas }
 * ou o miolo vindo direto: { primeiraLeitura, salmo, evangelho, extras, ... }
 */
function isRawLiturgia(data: any) {
  if (!data || typeof data !== "object") return false;
  if (data.leituras) return true;
  return Boolean(
    data.primeiraLeitura ||
      data.segundaLeitura ||
      data.salmo ||
      data.evangelho ||
      data.extras ||
      data.oracoes ||
      data.antifonas
  );
}

/**
 * Novo formato normalizado (fetchLiturgiaByDate retorna sempre esse).
 * Campos relevantes:
 * - dateISO, dateLabel, celebration, color
 * - leiturasFull, oracoesFull, antifonasFull
 */
function isNormalizedLiturgia(data: any) {
  if (!data || typeof data !== "object") return false;
  return Boolean(
    data.dateISO ||
      data.dateLabel ||
      data.celebration ||
      data.color ||
      data.leiturasFull ||
      data.oracoesFull ||
      data.antifonasFull
  );
}

function parsePtDateToISO(pt: string): string {
  // "04/04/2026" -> "2026-04-04"
  const s = String(pt || "").trim();
  const [dd, mm, yyyy] = s.split("/");
  if (!dd || !mm || !yyyy) return "";
  const d = dd.padStart(2, "0");
  const m = mm.padStart(2, "0");
  return `${yyyy}-${m}-${d}`;
}

function slugToISO(ddmmyyyy: string) {
  // dd-mm-aaaa -> aaaa-mm-dd
  const [dd, mm, yyyy] = String(ddmmyyyy || "").split("-");
  if (!dd || !mm || !yyyy) return "";
  return `${yyyy}-${mm}-${dd}`;
}

function isoToSlug(iso: string) {
  // yyyy-mm-dd -> dd-mm-yyyy
  const [yyyy, mm, dd] = String(iso || "").split("-");
  if (!yyyy || !mm || !dd) return "";
  return `${dd}-${mm}-${yyyy}`;
}

function formatDatePtBR(iso: string): string {
  // "2026-04-04" -> "4 de abril de 2026"
  const [yyyy, mm, dd] = String(iso || "").split("-");
  if (!yyyy || !mm || !dd) return "";
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getDateISOFromData(data: any, dateSlug: string): string {
  // raw: { data: "04/04/2026" }
  if (isRawLiturgia(data)) {
    const iso = parsePtDateToISO((data as any).data || (data as any).date);
    if (iso) return iso;
  }
  // normalizado
  if (data?.dateISO) return String(data.dateISO);
  return slugToISO(dateSlug);
}

function getCelebrationFromData(data: any): string {
  if (!data) return "";
  if (isRawLiturgia(data)) return String((data as any).liturgia || "");
  return String(data.celebration || "");
}

function getColorFromData(data: any): string {
  if (!data) return "";
  if (isRawLiturgia(data)) return String((data as any).cor || "");
  return String(data.color || "");
}

function normalizeHtmlOrText(entry: any) {
  if (typeof entry === "string") {
    const t = entry.trim();
    return { html: undefined as string | undefined, text: t || undefined };
  }
  return {
    html: entry?.html || entry?.textoHtml || entry?.textoHTML || undefined,
    text: entry?.text || entry?.texto || entry?.conteudo || undefined,
  };
}

function hasContent(entry: any) {
  const { html, text } = normalizeHtmlOrText(entry);
  return Boolean((html && html.trim()) || (text && text.trim()));
}

function hasAntiphons(antifonas: any) {
  if (!antifonas) return false;
  return hasContent(antifonas?.entrada) || hasContent(antifonas?.comunhao);
}

function hasPrayers(oracoes: any) {
  if (!oracoes) return false;
  const extras: any[] = Array.isArray(oracoes?.extras) ? oracoes.extras : [];
  return (
    hasContent(oracoes?.coleta) ||
    hasContent(oracoes?.oferendas) ||
    hasContent(oracoes?.comunhao) ||
    extras.some((x) => hasContent(x))
  );
}

/**
 * Converte o normalizado (leiturasFull/oracoesFull/antifonasFull) para um bundle
 * com o mesmo shape “raw-like” que a UI já sabe renderizar.
 */
function getNormalizedBundle(data: any): {
  raw: any;
  leituras: any;
  oracoes: any;
  antifonas: any;
} {
  const raw = data && typeof data === "object" ? data : {};

  // leiturasFull já vem em arrays completos
  const leituras = raw?.leiturasFull
    ? raw.leiturasFull
    : {
        // fallback mínimo (compatibilidade)
        primeiraLeitura: [
          {
            referencia: raw?.primeiraRef,
            texto: raw?.primeiraTexto,
            textoHtml: raw?.primeiraHtml,
            titulo: "Leitura",
          },
        ].filter((x: any) => hasContent(x)),
        segundaLeitura: [
          {
            referencia: raw?.segundaRef,
            texto: raw?.segundaTexto,
            textoHtml: raw?.segundaHtml,
            titulo: "Leitura",
          },
        ].filter((x: any) => hasContent(x)),
        salmo: [
          {
            referencia: raw?.salmoRef,
            refrao: raw?.salmoRefrao,
            texto: raw?.salmoTexto,
            textoHtml: raw?.salmoHtml,
          },
        ].filter((x: any) => hasContent(x)),
        evangelho: [
          {
            referencia: raw?.evangelhoRef,
            texto: raw?.evangelhoTexto,
            textoHtml: raw?.evangelhoHtml,
            titulo: "Proclamação do Evangelho",
          },
        ].filter((x: any) => hasContent(x)),
        extras: [],
      };

  // oracoesFull vem como strings + Html; aqui transformamos em objetos para o renderer
  const of = raw?.oracoesFull || {};
  const oracoes = {
    coleta: of?.coleta ? { texto: of.coleta, textoHtml: of.coletaHtml } : undefined,
    oferendas: of?.oferendas
      ? { texto: of.oferendas, textoHtml: of.oferendasHtml }
      : undefined,
    comunhao: of?.comunhao
      ? { texto: of.comunhao, textoHtml: of.comunhaoHtml }
      : undefined,
    extras: Array.isArray(of?.extras) ? of.extras : [],
  };

  // antifonasFull vem como strings + Html; aqui transformamos em objetos
  const af = raw?.antifonasFull || {};
  const antifonas = {
    entrada: af?.entrada ? { texto: af.entrada, textoHtml: af.entradaHtml } : undefined,
    comunhao: af?.comunhao ? { texto: af.comunhao, textoHtml: af.comunhaoHtml } : undefined,
  };

  return { raw, leituras, oracoes, antifonas };
}

/**
 * Bundle raw (legado), mas com tolerância para:
 * - objeto completo (com leituras/oracoes/antifonas)
 * - miolo (leituras vindo direto)
 */
function getRawBundle(data: any): {
  raw: any;
  leituras: any;
  oracoes: any;
  antifonas: any;
} {
  const raw = data && typeof data === "object" ? data : {};
  const leituras = raw.leituras ? raw.leituras : raw;
  const oracoes = raw.oracoes || {};
  const antifonas = raw.antifonas || {};
  return { raw, leituras, oracoes, antifonas };
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 rounded-xl px-3 py-2 text-sm font-semibold border transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        active
          ? "bg-amber-600 text-white border-amber-600"
          : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2",
        "border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        "active:translate-y-[1px] transition",
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function FontFloatingMenu({
  fontStep,
  setFontStep,
  fontPx,
}: {
  fontStep: number;
  setFontStep: React.Dispatch<React.SetStateAction<number>>;
  fontPx: number;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!open) return;
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <IconButton label="Tamanho da fonte" onClick={() => setOpen((v) => !v)}>
        <span className="font-extrabold">Aa</span>
        <span className="hidden sm:inline text-xs font-semibold text-slate-700">
          {fontPx}px
        </span>
      </IconButton>

      {open ? (
        <div
          className={[
            "absolute right-0 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg",
            "animate-in fade-in zoom-in-95",
          ].join(" ")}
          role="menu"
          aria-label="Ajuste de fonte"
        >
          <button
            type="button"
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50"
            onClick={() => setFontStep((s) => clamp(s - 1, -2, 6))}
          >
            Diminuir (A−)
          </button>
          <button
            type="button"
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50"
            onClick={() => setFontStep(0)}
          >
            Padrão
          </button>
          <button
            type="button"
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50"
            onClick={() => setFontStep((s) => clamp(s + 1, -2, 6))}
          >
            Aumentar (A+)
          </button>
        </div>
      ) : null}
    </div>
  );
}

function HtmlBody({
  html,
  fallbackText,
  fontPx,
}: {
  html?: string;
  fallbackText?: string;
  fontPx: number;
}) {
  const hasHtml = Boolean(html && html.trim());
  const hasText = Boolean(fallbackText && fallbackText.trim());

  if (hasHtml) {
    return (
      <div
        className={[
          "leading-7 text-slate-800 break-words",
          "[&>p]:mt-3 [&>p:first-child]:mt-0",
          "[&_a]:text-amber-700 [&_a]:font-semibold [&_a]:underline [&_a]:decoration-amber-300 hover:[&_a]:decoration-amber-500",
        ].join(" ")}
        style={{ fontSize: `${fontPx}px` }}
        dangerouslySetInnerHTML={{ __html: html as string }}
      />
    );
  }

  return (
    <div
      className="whitespace-pre-line leading-7 text-slate-800 break-words"
      style={{ fontSize: `${fontPx}px` }}
    >
      {hasText ? fallbackText : "—"}
    </div>
  );
}

function FooterAcclamation({ kind }: { kind: "reading" | "gospel" }) {
  if (kind === "gospel") {
    return (
      <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <p className="font-semibold text-emerald-900">Palavra da Salvação.</p>
        <p className="text-emerald-900">— Glória a vós, Senhor.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-semibold text-slate-900">Palavra do Senhor.</p>
      <p className="text-slate-900">— Graças a Deus.</p>
    </div>
  );
}

function ReadingCard({
  sectionLabel,
  refText,
  subtitle,
  html,
  text,
  fontPx,
  kind,
}: {
  sectionLabel: string;
  refText?: string;
  subtitle?: string;
  html?: string;
  text?: string;
  fontPx: number;
  kind: "reading" | "gospel";
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
          {sectionLabel}
        </p>
        {refText ? (
          <p className="text-sm sm:text-base font-bold text-slate-900">{refText}</p>
        ) : null}
        {subtitle ? <p className="text-xs sm:text-sm text-slate-600">{subtitle}</p> : null}
      </div>

      <div className="mt-3">
        <HtmlBody html={html} fallbackText={text} fontPx={fontPx} />
      </div>

      <FooterAcclamation kind={kind} />
    </section>
  );
}

function PsalmCard({
  refText,
  refrao,
  html,
  text,
  fontPx,
}: {
  refText?: string;
  refrao?: string;
  html?: string;
  text?: string;
  fontPx: number;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
          Salmo Responsorial
        </p>
        {refText ? (
          <p className="text-sm sm:text-base font-bold text-slate-900">{refText}</p>
        ) : null}
      </div>

      {refrao ? (
        <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
            Refrão
          </p>
          <p className="mt-1 text-base sm:text-lg font-extrabold text-amber-900 leading-snug">
            {refrao}
          </p>
        </div>
      ) : null}

      <div className="mt-4">
        <HtmlBody html={html} fallbackText={text} fontPx={fontPx} />
      </div>
    </section>
  );
}

function VariantSelector({
  activeIndex,
  setActiveIndex,
  items,
}: {
  activeIndex: number;
  setActiveIndex: (n: number) => void;
  items: any[];
}) {
  if (!items || items.length <= 1) return null;

  const labels = items.map((it, idx) => {
    const ref = String(it?.referencia || "");
    if (ref.toLowerCase().includes("forma longa")) return "Forma Longa";
    if (ref.toLowerCase().includes("forma breve")) return "Forma Breve";
    return `Opção ${idx + 1}`;
  });

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {labels.map((lbl, idx) => (
        <button
          key={lbl + idx}
          type="button"
          onClick={() => setActiveIndex(idx)}
          className={[
            "rounded-xl px-3 py-2 text-sm font-semibold border transition",
            idx === activeIndex
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
          ].join(" ")}
        >
          {lbl}
        </button>
      ))}
    </div>
  );
}

function ShareIconButton({
  url,
  title,
  text,
}: {
  url: string;
  title: string;
  text: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function onShare() {
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title, text, url });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
        return;
      }

      window.prompt("Copie e compartilhe a mensagem:", `${text}\n\n${url}`);
    } catch {
      // ignore
    }
  }

  return (
    <IconButton label={copied ? "Link copiado" : "Compartilhar"} onClick={onShare}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
        <path d="M12 16V4" />
        <path d="M7 9l5-5 5 5" />
      </svg>
      <span className="hidden sm:inline">{copied ? "Copiado" : "Compartilhar"}</span>
    </IconButton>
  );
}

function ReadingTabContent({ tab, fontPx }: { tab: UiTab; fontPx: number }) {
  const payload = tab.payload || {};
  const items: any[] = Array.isArray(payload.items) ? payload.items : [];

  const [variantIndex, setVariantIndex] = useState(0);
  React.useEffect(() => setVariantIndex(0), [tab.id]);

  const current = items[variantIndex] || items[0] || {};

  const refText =
    current?.referencia ||
    current?.referenciaBiblica ||
    current?.refText ||
    payload?.referencia;

  const subtitle = current?.titulo || current?.title || current?.cabecalho || undefined;

  const { html, text } = normalizeHtmlOrText(current);

  return (
    <div>
      <VariantSelector activeIndex={variantIndex} setActiveIndex={setVariantIndex} items={items} />

      <ReadingCard
        sectionLabel={String(payload.label || "Leitura")}
        refText={refText ? String(refText) : undefined}
        subtitle={subtitle ? String(subtitle) : undefined}
        html={html}
        text={text}
        fontPx={fontPx}
        kind="reading"
      />
    </div>
  );
}

function PsalmTabContent({ tab, fontPx }: { tab: UiTab; fontPx: number }) {
  const p = tab.payload || {};
  const refText = p?.referencia || p?.refText || p?.salmoRef || undefined;
  const refrao = p?.refrao || p?.refrain || undefined;
  const { html, text } = normalizeHtmlOrText(p);

  return (
    <PsalmCard
      refText={refText ? String(refText) : undefined}
      refrao={refrao ? String(refrao) : undefined}
      html={html}
      text={text}
      fontPx={fontPx}
    />
  );
}

function GospelTabContent({ tab, fontPx }: { tab: UiTab; fontPx: number }) {
  const payload = tab.payload || {};
  const items: any[] = Array.isArray(payload.items) ? payload.items : [];

  const [variantIndex, setVariantIndex] = useState(0);
  React.useEffect(() => setVariantIndex(0), [tab.id]);

  const current = items[variantIndex] || items[0] || {};
  const refText = current?.referencia || current?.refText || undefined;
  const subtitle = current?.titulo || "Proclamação do Evangelho";

  const { html, text } = normalizeHtmlOrText(current);

  return (
    <div>
      <VariantSelector activeIndex={variantIndex} setActiveIndex={setVariantIndex} items={items} />
      <ReadingCard
        sectionLabel="Evangelho"
        refText={refText ? String(refText) : undefined}
        subtitle={subtitle ? String(subtitle) : undefined}
        html={html}
        text={text}
        fontPx={fontPx}
        kind="gospel"
      />
    </div>
  );
}

function ExtrasTabContent({ tab, fontPx }: { tab: UiTab; fontPx: number }) {
  const payload = tab.payload || {};
  const items: any[] = Array.isArray(payload.items) ? payload.items : [];

  return (
    <div className="space-y-4">
      {items.map((x, idx) => {
        const title = String(x?.titulo || x?.tipo || `Extra ${idx + 1}`);
        const ref = x?.referencia ? String(x.referencia) : undefined;
        const { html, text } = normalizeHtmlOrText(x);

        return (
          <section
            key={title + idx}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
          >
            <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
              Extra
            </p>
            <p className="mt-1 text-sm sm:text-base font-bold text-slate-900">{title}</p>
            {ref ? <p className="mt-1 text-xs sm:text-sm text-slate-600">{ref}</p> : null}
            <div className="mt-3">
              <HtmlBody html={html} fallbackText={text} fontPx={fontPx} />
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PrayerCard({
  title,
  subtitle,
  html,
  text,
  fontPx,
}: {
  title: string;
  subtitle?: string;
  html?: string;
  text?: string;
  fontPx: number;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
        Oração
      </p>
      <p className="mt-1 text-sm sm:text-base font-bold text-slate-900">{title}</p>
      {subtitle ? <p className="mt-1 text-xs sm:text-sm text-slate-600">{subtitle}</p> : null}
      <div className="mt-3">
        <HtmlBody html={html} fallbackText={text} fontPx={fontPx} />
      </div>
    </section>
  );
}

function AntiphonsTabContent({ tab, fontPx }: { tab: UiTab; fontPx: number }) {
  const a = tab.payload || {};

  const entradaVal = typeof a?.entrada === "string" ? { texto: a.entrada } : a?.entrada || {};
  const comunhaoVal = typeof a?.comunhao === "string" ? { texto: a.comunhao } : a?.comunhao || {};

  const e = normalizeHtmlOrText(entradaVal);
  const c = normalizeHtmlOrText(comunhaoVal);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
          Antífona
        </p>
        <p className="mt-1 text-sm sm:text-base font-bold text-slate-900">
          Antífona de entrada
        </p>
        <div className="mt-3">
          <HtmlBody html={e.html} fallbackText={e.text} fontPx={fontPx} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
          Antífona
        </p>
        <p className="mt-1 text-sm sm:text-base font-bold text-slate-900">
          Antífona da comunhão
        </p>
        <div className="mt-3">
          <HtmlBody html={c.html} fallbackText={c.text} fontPx={fontPx} />
        </div>
      </section>
    </div>
  );
}

function PrayersTabContent({ tab, fontPx }: { tab: UiTab; fontPx: number }) {
  const o = tab.payload || {};
  const extras: any[] = Array.isArray(o?.extras) ? o.extras : [];

  const coleta = normalizeHtmlOrText(o?.coleta);
  const oferendas = normalizeHtmlOrText(o?.oferendas);
  const comunhao = normalizeHtmlOrText(o?.comunhao);

  return (
    <div className="space-y-4">
      {o?.coleta ? (
        <PrayerCard title="Oração do Dia (Coleta)" html={coleta.html} text={coleta.text} fontPx={fontPx} />
      ) : null}

      {o?.oferendas ? (
        <PrayerCard
          title="Oração sobre as oferendas"
          html={oferendas.html}
          text={oferendas.text}
          fontPx={fontPx}
        />
      ) : null}

      {o?.comunhao ? (
        <PrayerCard
          title="Oração depois da comunhão"
          html={comunhao.html}
          text={comunhao.text}
          fontPx={fontPx}
        />
      ) : null}

      {extras.length ? (
        <div className="space-y-4">
          {extras.map((x, idx) => {
            const title = String(x?.tipo || x?.titulo || `Oração extra ${idx + 1}`);
            const { html, text } = normalizeHtmlOrText(x);
            return <PrayerCard key={title + idx} title={title} html={html} text={text} fontPx={fontPx} />;
          })}
        </div>
      ) : null}
    </div>
  );
}

function PairTabContent({ tab, fontPx }: { tab: UiTab; fontPx: number }) {
  const p = tab.payload || {};
  const readingGroup = p.readingGroup || null; // { label, items[] }
  const psalm = p.psalm || null; // salmo item object

  return (
    <div className="space-y-5">
      {readingGroup ? (
        <ReadingTabContent
          tab={{
            id: `${tab.id}__reading`,
            label: readingGroup.label,
            kind: "reading",
            payload: { label: readingGroup.label, items: readingGroup.items },
          }}
          fontPx={fontPx}
        />
      ) : null}

      {psalm ? (
        <PsalmTabContent
          tab={{
            id: `${tab.id}__psalm`,
            label: "Salmo",
            kind: "psalm",
            payload: psalm,
          }}
          fontPx={fontPx}
        />
      ) : null}

      {!readingGroup && !psalm ? (
        <div className="text-sm text-slate-600">—</div>
      ) : null}
    </div>
  );
}

function buildTabsFromBundle(bundle: {
  raw: any;
  leituras: any;
  oracoes: any;
  antifonas: any;
}): UiTab[] {
  const tabs: UiTab[] = [];
  const { leituras, oracoes, antifonas } = bundle;

  const primeira: any[] = Array.isArray(leituras?.primeiraLeitura) ? leituras.primeiraLeitura : [];
  const segunda: any[] = Array.isArray(leituras?.segundaLeitura) ? leituras.segundaLeitura : [];
  const salmos: any[] = Array.isArray(leituras?.salmo) ? leituras.salmo : [];
  const evangelhos: any[] = Array.isArray(leituras?.evangelho) ? leituras.evangelho : [];
  const extras: any[] = Array.isArray(leituras?.extras) ? leituras.extras : [];

  // Leituras extras (terceira... epístola etc.)
  const leituraExtrasOrdered = extras
    .filter((x) => {
      const tipo = String(x?.tipo || "").toLowerCase();
      return tipo.includes("leitura") || tipo.includes("epístola") || tipo.includes("epistola");
    })
    .sort((a, b) => {
      const ta = String(a?.tipo || "").toLowerCase();
      const tb = String(b?.tipo || "").toLowerCase();

      // mantém compat com variações e não depende de acento
      const order = [
        "3ª leitura",
        "4ª leitura",
        "5ª leitura",
        "6ª leitura",
        "7ª leitura",
        "terceira leitura",
        "quarta leitura",
        "quinta leitura",
        "sexta leitura",
        "sétima leitura",
        "setima leitura",
        "epistola",
        "epístola",
      ];

      const ia = order.findIndex((k) => ta.includes(k));
      const ib = order.findIndex((k) => tb.includes(k));
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });

  // Monta lista de grupos de leitura em ordem
  const readingGroups: Array<{ label: string; items: any[] }> = [];
  if (primeira.length) readingGroups.push({ label: "1ª Leitura", items: primeira });
  if (segunda.length) readingGroups.push({ label: "2ª Leitura", items: segunda });

  leituraExtrasOrdered.forEach((x, idx) => {
    const label = String(x?.tipo || x?.titulo || `Leitura ${idx + 3}`);
    readingGroups.push({ label, items: [x] });
  });

  // ✅ Sincroniza (sequencial): Leitura, Salmo, Leitura, Salmo...
  const maxPairs = Math.max(readingGroups.length, salmos.length);
  for (let i = 0; i < maxPairs; i++) {
    const rg = readingGroups[i] || null;
    const ps = salmos[i] || null;

    if (rg) {
      tabs.push({
        id: `reading-${i + 1}`,
        label: rg.label,
        kind: "reading",
        payload: { label: rg.label, items: rg.items },
      });
    }

    if (ps) {
      const salmoLabel = salmos.length > 1 ? `Salmo ${i + 1}` : "Salmo";
      tabs.push({
        id: `psalm-${i + 1}`,
        label: salmoLabel,
        kind: "psalm",
        payload: ps,
      });
    }
  }

  // Evangelho (pode ter variações)
  if (evangelhos.length) {
    tabs.push({
      id: "evangelho",
      label: "Evangelho",
      kind: "gospel",
      payload: { items: evangelhos },
    });
  }

  // Extras não-leitura
  const outrosExtras = extras.filter((x) => {
    const tipo = String(x?.tipo || "").toLowerCase();
    return !(tipo.includes("leitura") || tipo.includes("epístola") || tipo.includes("epistola"));
  });

  if (outrosExtras.length) {
    tabs.push({
      id: "extras",
      label: "Extras",
      kind: "extras",
      payload: { items: outrosExtras },
    });
  }

  // Antífonas
  if (hasAntiphons(antifonas)) {
    tabs.push({
      id: "antifonas",
      label: "Antífonas",
      kind: "antiphons",
      payload: antifonas,
    });
  }

  // Orações
  if (hasPrayers(oracoes)) {
    tabs.push({
      id: "oracoes",
      label: "Orações",
      kind: "prayers",
      payload: oracoes,
    });
  }

  return tabs;
}

function buildTabsFromData(data: any): UiTab[] {
  if (isRawLiturgia(data)) return buildTabsFromBundle(getRawBundle(data));
  if (isNormalizedLiturgia(data)) return buildTabsFromBundle(getNormalizedBundle(data));

  return buildTabsFromBundle({ raw: data || {}, leituras: {}, oracoes: {}, antifonas: {} });
}

export default function LiturgiaHubPerfect({
  siteUrl,
  hubCanonicalPath,
  dateSlug,
  data,
  prevSlug,
  nextSlug,
  todaySlug,
  todayLabel,
  dailyParagraph,
  blogComplement,
  className,
  
}: Props) {
  const router = useRouter();

  const celebration = getCelebrationFromData(data);
  const color = getColorFromData(data);

  const dateISO = getDateISOFromData(data, dateSlug);
  const dateLabelPt = formatDatePtBR(dateISO);

  const basePath = "/liturgia-diaria";
  const pageUrl = `${siteUrl}${basePath}/${dateSlug}`;

  const [fontStep, setFontStep] = useState(0);
  const fontPx = clamp(16 + fontStep * 1, 14, 22);

  const tabs = useMemo(() => buildTabsFromData(data), [data]);

  // ✅ default: primeira tab existente (já pareada)
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || "");

  React.useEffect(() => {
    const firstId = tabs[0]?.id || "";
    if (!firstId) return;
    if (!tabs.some((t) => t.id === activeTabId)) setActiveTabId(firstId);
  }, [tabs, activeTabId]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

 const shareTitle = `Liturgia diária de ${dateLabelPt}: Evangelho e Leituras da Missa`;

const shareText =
  `Liturgia de ${dateLabelPt} (${celebration || "Missa do dia"}). ` +
  `Leia o Evangelho e as leituras completas aqui e compartilhe com alguém: ` +
  `acesse pelo link abaixo.`;   

  // Calendário (date picker) - controla navegação por data
  const [pickerISO, setPickerISO] = React.useState<string>(dateISO);

  React.useEffect(() => {
    // quando muda a rota/data, sincroniza o input
    setPickerISO(dateISO);
  }, [dateISO]);

  function onPickDate(nextISO: string) {
    const slug = isoToSlug(nextISO);
    if (!slug) return;
    setPickerISO(nextISO);
    router.push(`${basePath}/${slug}`);
  }

  return (
  <article
    className={[
      "relative mx-auto w-full max-w-5xl px-3 sm:px-4 lg:px-6 bg-white text-slate-900 leading-relaxed",
      "overflow-x-hidden",
      className || "",
    ].join(" ")}
    itemScope
    itemType="https://schema.org/Article"
  >
    <header className="relative mb-10 mt-6">
      <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
        IA Tio Ben • Liturgia
      </p>

      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
        Liturgia diária de {dateLabelPt}: Evangelho e Leituras da Missa
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        {celebration || ""}
        {color ? ` • Cor litúrgica: ${color}` : ""}
      </p>

      {dailyParagraph ? (
        <p className="mt-3 text-sm sm:text-[15px] leading-7 text-slate-700">
          {dailyParagraph}
        </p>
      ) : null}

        {blogComplement ? (
  <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
    <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
      Reflexão do Blog IA Tio Ben
    </p>

    <h2 className="mt-1 text-base sm:text-lg font-extrabold text-slate-900">
      {blogComplement.title}
    </h2>

    <p className="mt-2 text-sm sm:text-[15px] leading-7 text-slate-700">
      {blogComplement.paragraph}
    </p>

    <Link
      href={`/blog/${blogComplement.slug}`}
      className="mt-3 inline-flex text-sm font-semibold text-amber-700 hover:text-amber-800"
    >
      Aprofundar a reflexão no blog →
    </Link>
  </section>
) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`${basePath}/${prevSlug}`}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          Ontem
        </Link>

        <Link
          href={`${basePath}/${nextSlug}`}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          Amanhã
        </Link>

        <Link
          href={`${basePath}/${todaySlug}`}
          className="rounded-xl bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          Ir para hoje • {todayLabel}
        </Link>
      </div>
    </header>

    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Controles: calendário, fonte, compartilhar e idioma (todos juntos) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Calendário */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <span className="hidden sm:inline text-xs font-semibold text-slate-600">
            Data
          </span>
          <input
            type="date"
            value={pickerISO}
            onChange={(e) => onPickDate(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
            aria-label="Selecionar data"
          />
        </div>

        {/* Tamanho da fonte */}
        <FontFloatingMenu
          fontStep={fontStep}
          setFontStep={setFontStep}
          fontPx={fontPx}
        />

        {/* Compartilhar */}
        <ShareIconButton url={pageUrl} title={shareTitle} text={shareText} />

        {/* Idioma */}
        <div className="ml-0 sm:ml-1">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Cabeçalho das tabs */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-700">
          Leituras, Salmos e Evangelho
        </p>

        <div className="mt-3 -mx-1 px-1 overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {tabs.map((t) => (
              <TabButton
                key={t.id}
                active={activeTabId === t.id}
                onClick={() => setActiveTabId(t.id)}
              >
                {t.label}
              </TabButton>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mt-5">
        {activeTab?.kind === "pair" ? (
          <PairTabContent tab={activeTab} fontPx={fontPx} />
        ) : null}
        {activeTab?.kind === "reading" ? (
          <ReadingTabContent tab={activeTab} fontPx={fontPx} />
        ) : null}
        {activeTab?.kind === "psalm" ? (
          <PsalmTabContent tab={activeTab} fontPx={fontPx} />
        ) : null}
        {activeTab?.kind === "gospel" ? (
          <GospelTabContent tab={activeTab} fontPx={fontPx} />
        ) : null}
        {activeTab?.kind === "extras" ? (
          <ExtrasTabContent tab={activeTab} fontPx={fontPx} />
        ) : null}
        {activeTab?.kind === "antiphons" ? (
          <AntiphonsTabContent tab={activeTab} fontPx={fontPx} />
        ) : null}
        {activeTab?.kind === "prayers" ? (
          <PrayersTabContent tab={activeTab} fontPx={fontPx} />
        ) : null}
      </div>
    </section>

    <footer className="mt-8 border-t border-slate-200 pt-6">
      <p className="text-xs text-slate-500 break-words">
        URL desta liturgia:{" "}
        <span className="font-semibold">
          {basePath}/{dateSlug}
        </span>
      </p>
    </footer>

    <meta itemProp="datePublished" content={`${dateISO}T06:00:00-03:00`} />
    <meta itemProp="dateModified" content={`${dateISO}T06:00:00-03:00`} />
  </article>
)
}