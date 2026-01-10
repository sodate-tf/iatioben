// components/liturgia/LiturgiaAsideEN.tsx
//
// English-only aside for /en/daily-mass-readings/*
// - Does NOT touch the PT component, so it won’t break Portuguese.
// - Uses /en routes for calendars and day navigation.
// - Keeps the same “variant” behavior (desktop vs mobile) to avoid ad duplication.

import Link from "next/link";
import { pad2 } from "@/lib/liturgia/date";
import { AdsenseSidebarDesktop300x250 } from "@/components/ads/AdsenseBlocks";

type BlogLink = {
  href: string;
  title: string;
  desc?: string;
};

type Props = {
  year: number;
  month: number; // 1-12

  todaySlug: string; // dd-mm-yyyy
  todayLabel: string; // your EN label (e.g., 01/10/2026 or “January 10, 2026”)

  prevSlug: string; // dd-mm-yyyy
  nextSlug: string; // dd-mm-yyyy

  adsSlotDesktop300x250?: string;
  blogLinks?: BlogLink[];
  className?: string;

  variant?: "desktop" | "mobile";

  /**
   * Optional: when user is on a historical date page, pass the current page slug
   * so we can clarify that “Today” is the current date.
   */
  pageSlug?: string; // dd-mm-yyyy
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Month label in natural English */
function monthLabelEN(year: number, month: number) {
  const dt = new Date(year, month - 1, 1, 12, 0, 0);
  try {
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(dt);
  } catch {
    return `${year}-${pad2(month)}`;
  }
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
      {children}
    </p>
  );
}

function QuickLink({
  href,
  k,
  v,
  hint,
}: {
  href: string;
  k: string;
  v: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
    >
      <p className="text-xs text-slate-500 font-semibold">{k}</p>
      <p className="text-sm font-bold text-slate-900">{v}</p>
      {hint ? <p className="mt-1 text-[11px] text-slate-600">{hint}</p> : null}
    </Link>
  );
}

export default function LiturgiaAsideEN({
  year,
  month,
  todaySlug,
  todayLabel,
  prevSlug,
  nextSlug,
  adsSlotDesktop300x250,
  blogLinks,
  className,
  variant = "desktop",
  pageSlug,
}: Props) {
  const monthHref = `/en/daily-mass-readings/year/${year}/${pad2(month)}`;
  const yearHref = `/en/daily-mass-readings/year/${year}`;

  // Default “pillar” links (English). Adjust to your real EN blog routes as needed.
  // If you don’t have EN blog pages yet, you can either:
  // 1) keep these pointing to PT content, or
  // 2) remove the section by passing blogLinks={[]} or variant="mobile".
  const defaultBlogLinks: BlogLink[] = [
    {
      href: "/en/how-to-use-the-liturgy",
      title: "How to use the liturgy day by day",
      desc: "A simple way to pray and prepare for Mass.",
    },
    {
      href: "/en/liturgical-year",
      title: "Liturgical Year: seasons, colors and calendar",
      desc: "Understand what changes throughout the year and how to follow it.",
    },
    {
      href: "/en/mass-readings-guide",
      title: "A guide to the Mass readings",
      desc: "First Reading, Psalm, Gospel—and how to follow them.",
    },
    {
      href: "/en/pray-with-the-liturgy-in-5-minutes",
      title: "How to pray with the liturgy in 5 minutes",
      desc: "A practical step-by-step for building consistency.",
    },
    {
      href: "/en/daily-mass-readings-vs-gospel-of-the-day",
      title: "Daily Mass Readings vs. Gospel of the Day",
      desc: "Differences, benefits, and when to use each.",
    },
  ];

  const effectiveBlogLinks = (blogLinks?.length ? blogLinks : defaultBlogLinks).slice(0, 5);

  const isHistoricalContext = Boolean(pageSlug) && pageSlug !== todaySlug;

  const dayHref = (slug: string) => `/en/daily-mass-readings/${slug}`;

  return (
    <aside className={cx("min-w-0", className)}>
      <div className="sticky top-4 space-y-4">
        {/* Ad (desktop only) */}
        {variant === "desktop" && adsSlotDesktop300x250 ? (
          <AdsenseSidebarDesktop300x250 slot={adsSlotDesktop300x250} />
        ) : null}

        {/* Quick access */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CardTitle>Quick access</CardTitle>

          <div className="mt-3 space-y-2">
            <QuickLink
              href={dayHref(todaySlug)}
              k={isHistoricalContext ? "Today (current date)" : "Today"}
              v={todayLabel}
              hint={isHistoricalContext ? `You’re viewing: ${pageSlug?.replaceAll("-", "/")}` : undefined}
            />

            <QuickLink
              href={dayHref(prevSlug)}
              k="Previous day"
              v={prevSlug.replaceAll("-", "/")}
            />

            <QuickLink
              href={dayHref(nextSlug)}
              k="Next day"
              v={nextSlug.replaceAll("-", "/")}
            />

            <QuickLink href={monthHref} k="Monthly calendar" v={monthLabelEN(year, month)} />
            <QuickLink href={yearHref} k="Yearly calendar" v={String(year)} />
          </div>
        </div>

        {/* Explore (internal linking) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CardTitle>Explore</CardTitle>

          <div className="mt-3 space-y-2">
            <Link
              href="/en/how-to-use-the-liturgy"
              className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-bold text-slate-900">How to use the liturgy day by day</p>
              <p className="mt-1 text-xs text-slate-600">
                A simple way to pray and prepare for Mass.
              </p>
            </Link>

            <Link
              href="/en/liturgical-year"
              className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-bold text-slate-900">Liturgical Year</p>
              <p className="mt-1 text-xs text-slate-600">
                Seasons, colors and calendar: what changes across the year.
              </p>
            </Link>

            <Link
              href="/en/mass-readings-guide"
              className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-bold text-slate-900">Mass readings guide</p>
              <p className="mt-1 text-xs text-slate-600">
                First Reading, Psalm, Gospel—and how to follow them.
              </p>
            </Link>

            <Link
              href="/en/pray-with-the-liturgy-in-5-minutes"
              className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-bold text-slate-900">Pray with the liturgy in 5 minutes</p>
              <p className="mt-1 text-xs text-slate-600">
                A practical step-by-step for building consistency.
              </p>
            </Link>

            <Link
              href="/en/daily-mass-readings-vs-gospel-of-the-day"
              className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-bold text-slate-900">
                Daily Mass Readings vs. Gospel of the Day
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Differences, benefits, and when to use each.
              </p>
            </Link>
          </div>
        </div>        
      </div>
    </aside>
  );
}
