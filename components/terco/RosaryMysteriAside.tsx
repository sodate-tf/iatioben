"use client";

import Link from "next/link";
import Script from "next/script";

const ADS_CLIENT = "ca-pub-8819996017476509";

function AdsenseSidebarDesktop300x250({ slot }: { slot: string }) {
  return (
    <div className="hidden lg:block rounded-2xl border border-border bg-card p-3 shadow-sm">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">
        Publicidade
      </p>
      <div className="flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: 300, height: 250 }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={slot}
        />
      </div>
      <Script
        id={`adsbygoogle-push-sidebar-desktop-${slot}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
}

function AdsenseSidebarMobile({ slot }: { slot: string }) {
  return (
    <div className="lg:hidden rounded-2xl border border-border bg-card p-3 shadow-sm">
      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground">
        Publicidade
      </p>
      <div
        className="w-full overflow-hidden rounded-xl bg-muted/30"
        style={{ minHeight: 160 }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      <Script
        id={`adsbygoogle-push-sidebar-mobile-${slot}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
}

export type AsideBlogLink = { title: string; slug: string };

export function RosaryMysteriesAside({
  currentLabel = "Terça e Sexta",
  quickGuideText = "Terça e sexta. Para rezar a cruz com esperança e fidelidade.",
  blogLinks,
  adsSlotDesktop,
  adsSlotMobile,
}: {
  currentLabel?: string;
  quickGuideText?: string;
  blogLinks: AsideBlogLink[];
  adsSlotDesktop: string;
  adsSlotMobile: string;
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:h-fit">
      {/* Guia rápido */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">Guia rápido</p>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-900">
            {currentLabel}
          </span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">{quickGuideText}</p>

        <div className="mt-3 grid gap-2">
          <a
            href="#o-que-sao"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
          >
            O que são
          </a>
          <a
            href="#como-rezar"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
          >
            Como rezar
          </a>
          <a
            href="#faq"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
          >
            Dúvidas
          </a>
        </div>

        <div className="mt-4 grid gap-2">
          <Link
            href="/santo-terco"
            className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Rezar agora
          </Link>
          <Link
            href="/santo-terco/como-rezar-o-terco"
            className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Aprender o passo a passo
          </Link>
        </div>
      </div>

      {/* Menu dos Terços */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Menu do Terço</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Escolha um mistério para rezar e meditar.
        </p>

        <div className="mt-3 grid gap-2">
          <Link
            href="/santo-terco/misterios-gozosos"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Mistérios Gozosos
          </Link>

          <Link
            href="/santo-terco/misterios-dolorosos"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Mistérios Dolorosos
          </Link>

          <Link
            href="/santo-terco/misterios-gloriosos"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Mistérios Gloriosos
          </Link>

          <Link
            href="/santo-terco/misterios-luminosos"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Mistérios Luminosos
          </Link>
        </div>
      </div>

      {/* Anúncios */}
      <AdsenseSidebarDesktop300x250 slot={adsSlotDesktop} />
      <AdsenseSidebarMobile slot={adsSlotMobile} />

      {/* Blog */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Aprofundar no blog</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Leia conteúdos relacionados e aprofunde sua oração.
        </p>

        <div className="mt-3 grid gap-2">
          {blogLinks.map((x) => (
            <Link
              key={x.slug}
              href={`/blog/${x.slug}`}
              className="rounded-xl border border-border bg-card p-3 text-sm shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <p className="font-semibold text-foreground">{x.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">Abrir</p>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
