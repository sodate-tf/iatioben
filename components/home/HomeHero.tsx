// components/home/HomeHero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import React, { useEffect, useMemo, useRef, useState } from "react";

type StoryRing = "amber" | "green" | "blue";

type StoryItem = {
  key: string;
  title: string;
  subtitle?: string;
  href: string; // ✅ URL ABSOLUTA do web story (AMP)
  thumbSrc: string; // thumbnail circular
  thumbAlt: string;
  ring?: StoryRing;
};

function ringClass(ring?: StoryRing) {
  switch (ring) {
    case "green":
      return "from-emerald-500 to-lime-400";
    case "blue":
      return "from-sky-500 to-indigo-400";
    case "amber":
    default:
      return "from-amber-500 to-yellow-300";
  }
}

function getTodayParts() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return { dd, mm, yyyy, iso: `${yyyy}-${mm}-${dd}` };
}

const SEEN_KEY = "tio_ben_seen_stories_v1";

function loadSeen(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch {
    return {};
  }
}

function saveSeen(map: Record<string, number>) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export default function HomeHero() {
  const { dd, mm, yyyy } = useMemo(getTodayParts, []);

  // ✅ origin para montar URL absoluta (necessário para amp-story-player não ficar “carregando”)
  const siteOrigin = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin; // http://localhost:3000 ou https://www.iatioben.com.br
  }, []);

  function abs(path: string) {
    if (!path) return path;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (!siteOrigin) return path; // fallback no primeiro render
    return `${siteOrigin}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  const stories: StoryItem[] = useMemo(
    () => [
      {
        key: "liturgia-hoje",
        title: "Liturgia",
        subtitle: `${dd}/${mm}`,
        href: abs(`/web-stories/liturgia-${dd}-${mm}-${yyyy}`),
        thumbSrc: "/images/stories/liturgia-default.jpg",
        thumbAlt: "Web Story — Liturgia de Hoje",
        ring: "amber",
      },
      {
        key: "terco-do-dia",
        title: "Terço",
        subtitle: "Mistérios",
        href: abs(`/web-stories/terco-${dd}-${mm}-${yyyy}`),
        thumbSrc: "/images/stories/terco-default.jpg",
        thumbAlt: "Web Story — Terço do Dia",
        ring: "blue",
      },
    ],
    [dd, mm, yyyy, siteOrigin] // ✅ siteOrigin influencia abs()
  );

  const railRef = useRef<HTMLDivElement | null>(null);

  const [seen, setSeen] = useState<Record<string, number>>({});
  const [playerOpen, setPlayerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setSeen(loadSeen());
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPlayerOpen(false);
      if (!playerOpen) return;

      if (e.key === "ArrowRight") nextStory();
      if (e.key === "ArrowLeft") prevStory();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerOpen, activeIndex]);

  function markSeen(href: string) {
    setSeen((prev) => {
      const next = { ...prev, [href]: Date.now() };
      saveSeen(next);
      return next;
    });
  }

  function openStory(idx: number) {
    setActiveIndex(idx);
    setPlayerOpen(true);
    markSeen(stories[idx]?.href);
  }

  function nextStory() {
    const next = (activeIndex + 1) % stories.length;
    setActiveIndex(next);
    markSeen(stories[next]?.href);
  }

  function prevStory() {
    const prev = (activeIndex - 1 + stories.length) % stories.length;
    setActiveIndex(prev);
    markSeen(stories[prev]?.href);
  }

  function scrollRailBy(px: number) {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: px, behavior: "smooth" });
  }

  const active = stories[activeIndex];

  return (
    <section className="bg-gradient-to-b from-amber-200 to-amber-400">
      {/* AMP Story Player assets */}
      <link rel="stylesheet" href="https://cdn.ampproject.org/amp-story-player-v0.css" />
      <Script src="https://cdn.ampproject.org/amp-story-player-v0.js" strategy="afterInteractive" />

      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        {/* STORIES TOP BAR */}
        <div className="mb-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-amber-950 tracking-tight">Stories de Hoje</p>
              <p className="text-xs text-amber-950/70">Conteúdos rápidos: Liturgia, Terço e Santo do dia</p>
            </div>

            <Link
              href="/web-stories"
              className="text-xs font-semibold text-amber-950/80 hover:text-amber-950 underline underline-offset-4"
              aria-label="Ver todos os Web Stories"
              title="Ver todos os Web Stories"
            >
              Ver todos
            </Link>
          </div>

          <div className="relative mt-4">
            <div
              ref={railRef}
              className="flex gap-4 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory"
              aria-label="Carrossel de Web Stories"
            >
              {stories.map((s, idx) => {
                const isSeen = Boolean(seen[s.href]);
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => openStory(idx)}
                    className="group snap-start text-left"
                    aria-label={`Abrir story: ${s.title}`}
                    title={s.title}
                  >
                    <div className="flex w-[92px] flex-col items-center">
                      <div
                        className={[
                          "rounded-full p-[2px] bg-gradient-to-tr shadow-sm transition",
                          ringClass(s.ring),
                          isSeen ? "opacity-50" : "opacity-100",
                        ].join(" ")}
                      >
                        <div className="rounded-full bg-amber-200 p-[2px]">
                          <div className="relative h-[68px] w-[68px] overflow-hidden rounded-full bg-black/10">
                            <Image
                              src={s.thumbSrc}
                              alt={s.thumbAlt}
                              fill
                              sizes="68px"
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 w-full text-center">
                        <p className="truncate text-[12px] font-extrabold text-amber-950">{s.title}</p>
                        {s.subtitle ? (
                          <p className="truncate text-[11px] text-amber-950/70">{s.subtitle}</p>
                        ) : null}
                      </div>

                      <div className="mt-1 h-1 w-10 rounded-full bg-amber-950/10 overflow-hidden">
                        <div
                          className={[
                            "h-full rounded-full transition-all duration-300",
                            isSeen ? "w-full bg-amber-950/30" : "w-2/5 bg-amber-900/70",
                          ].join(" ")}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* HERO */}
        <div className="text-center">
          <div className="flex justify-center">
            <Image
              src="/images/ben-transparente.png"
              alt="IA Tio Ben"
              width={200}
              height={200}
              priority
              fetchPriority="high"
            />
          </div>

          <h1 className="mt-6 text-2xl md:text-4xl font-extrabold text-amber-900 tracking-tight">
            IA Tio Ben: Liturgia Diária, Evangelho do Dia e Reflexões Católicas
          </h1>

          <p className="mt-3 text-gray-800 text-base md:text-lg leading-relaxed">
            Faça uma pergunta sobre fé, liturgia, Evangelho, oração e vida espiritual. Acompanhe também a Liturgia
            Diária e conteúdos de formação católica.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/liturgia-diaria"
              className="inline-flex items-center justify-center rounded-xl bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900 transition"
              aria-label="Abrir Liturgia Diária"
              title="Liturgia Diária"
            >
              Abrir Liturgia Diária
            </Link>

            <Link
              href="/santo-terco"
              className="inline-flex items-center justify-center rounded-xl border border-amber-900/20 bg-white/80 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-white transition"
              aria-label="Abrir Santo Terço"
              title="Santo Terço"
            >
              Rezar o Santo Terço
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-xl border border-amber-900/20 bg-white/80 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-white transition"
              aria-label="Ir para o Blog"
              title="Blog"
            >
              Ver o Blog
            </Link>
          </div>
        </div>
      </div>

      {/* MODAL PLAYER */}
      {playerOpen && active ? (
        <div
          className="fixed inset-0 z-[9999] bg-black/70"
          role="dialog"
          aria-modal="true"
          aria-label="Player de Web Stories"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPlayerOpen(false);
          }}
        >
          {/* ✅ menor proporcionalmente + centralizado + usa a tela visível */}
          <div className="mx-auto flex h-[100dvh] w-full max-w-[420px] flex-col px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevStory}
                  className="h-9 w-9 rounded-full bg-white/15 text-white hover:bg-white/25 transition"
                  aria-label="Story anterior"
                  title="Anterior (←)"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextStory}
                  className="h-9 w-9 rounded-full bg-white/15 text-white hover:bg-white/25 transition"
                  aria-label="Próximo story"
                  title="Próximo (→)"
                >
                  ›
                </button>
                <button
                  type="button"
                  onClick={() => setPlayerOpen(false)}
                  className="h-9 w-9 rounded-full bg-white/15 text-white hover:bg-white/25 transition"
                  aria-label="Fechar"
                  title="Fechar (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ✅ “telefone” menor com proporção 9:16 (evita ficar gigante e mantém estética) */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-[390px] aspect-[9/16] overflow-hidden rounded-[22px] bg-black shadow-2xl ring-1 ring-white/10">
                <amp-story-player
                  key={active.href}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {/* ✅ href ABSOLUTO evita loading infinito */}
                  <a href={active.href}></a>
                </amp-story-player>
              </div>
            </div>

            {/* CTA opcional para abrir em nova aba/página */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <Link
                href={active.href}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-black hover:bg-white/90 transition"
                onClick={() => setPlayerOpen(false)}
                aria-label="Abrir story em nova página"
                title="Abrir story"
              >
                Abrir story
              </Link>
              <Link
                href="/web-stories"
                className="inline-flex items-center justify-center rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25 transition"
                onClick={() => setPlayerOpen(false)}
              >
                Ver lista
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
