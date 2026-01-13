// app/en/liturgy/liturgical-year/page.tsx
//
// Static SEO page (EN) using the same visual language you use in BlogPostDetail + the exact article Tailwind pattern.
// - Server Component (keeps generateMetadata for SEO)
// - Uses LiturgiaAsideEN on the right (desktop)
// - Content is hardcoded HTML with your "post-santo" classes + TOC pattern
// - No Liturgia/Terço blocks (as requested)

import LiturgiaAsideEN from "@/components/liturgia/LiturgiaAsideEN";
import type { Metadata } from "next";


const SITE_URL = "https://www.iatioben.com.br";

const SLUG = "liturgical-year";
const CANONICAL = `${SITE_URL}/en/liturgy/${SLUG}`;

const TITLE =
  "Liturgical Year: Seasons, Colors, and Calendar—What Changes Across the Year";
const DESCRIPTION =
  "Understand the Catholic Liturgical Year in a clear, practical way: seasons, liturgical colors, the Church calendar, and how they shape the Daily Mass readings and your prayer.";

const PUBLISH_DATE_ISO = "2026-01-10";

// Optional: replace with your preferred OG route/pattern for EN pages.
const OG_IMAGE = `${SITE_URL}/og?title=${encodeURIComponent(
  "Liturgical Year"
)}&description=${encodeURIComponent(
  "Seasons, colors, and the Church calendar explained in a practical way."
)}`;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function slugFromDate(d: Date) {
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function todayContextEN() {
  const now = new Date();
  // normalize to midday to avoid DST edge cases
  const base = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    12,
    0,
    0
  );

  const year = base.getFullYear();
  const month = base.getMonth() + 1;

  const todaySlug = slugFromDate(base);
  const prevSlug = slugFromDate(addDays(base, -1));
  const nextSlug = slugFromDate(addDays(base, 1));

  const todayLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(base);

  return {
    year,
    month,
    todaySlug,
    todayLabel,
    prevSlug,
    nextSlug,
  };
}
const { year, month, todaySlug, todayLabel, prevSlug, nextSlug } = todayContextEN();

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: CANONICAL },
    robots: { index: true, follow: true },

    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: "article",
      url: CANONICAL,
      siteName: "Tio Ben",
      locale: "en_US",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
    },

    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [OG_IMAGE],
    },
  };
}

export default function Page() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    image: [OG_IMAGE],
    author: {
      "@type": "Organization",
      name: "Tio Ben",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Tio Ben",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/ben-transparente.png`,
      },
    },
    mainEntityOfPage: CANONICAL,
    url: CANONICAL,
    datePublished: PUBLISH_DATE_ISO,
    dateModified: PUBLISH_DATE_ISO,
  };

  const articleHtml = `
<article class="post-santo mx-auto w-full max-w-3xl px-3 sm:px-4 lg:max-w-5xl lg:px-6 py-6 bg-white font-sans text-gray-800 leading-relaxed min-h-screen overflow-x-hidden" itemscope itemtype="https://schema.org/Article">
  <header class="mb-10 border-b border-gray-200 pb-6">
    <p class="text-sm text-gray-500">
      <time datetime="${PUBLISH_DATE_ISO}" itemprop="datePublished">${PUBLISH_DATE_ISO}</time>
    </p>

    <p class="mt-1 text-sm text-gray-500" itemprop="author" itemscope itemtype="https://schema.org/Person">
      <span itemprop="name">Tio Ben</span>
    </p>

    <h1 class="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-snug" itemprop="headline">
      Liturgical Year
    </h1>

    <p class="mt-3 text-lg text-gray-700 leading-[1.9] break-words" itemprop="description">
      The Catholic Church does not live time like a simple “January to December” calendar.
      We live time as a journey with Christ: waiting, rejoicing, conversion, mission, and hope—again and again.
      That rhythm is called the <strong class="text-gray-900 font-semibold">Liturgical Year</strong>.
      When you understand its seasons and colors, the Daily Mass readings make more sense, the feasts feel more meaningful,
      and your prayer becomes steadier across the whole year.
    </p>
  </header>

  <nav class="my-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm overflow-hidden">
    <h4 class="text-sm font-semibold text-amber-900 tracking-wide">In this article</h4>
    <ul class="mt-4 grid gap-2 sm:grid-cols-2">
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-1">
          <span class="min-w-0 flex-1 break-words">What the Liturgical Year is (and why it matters)</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-2">
          <span class="min-w-0 flex-1 break-words">The main seasons: Advent, Christmas, Lent, Easter, Ordinary Time</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-3">
          <span class="min-w-0 flex-1 break-words">Liturgical colors: what they mean</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-4">
          <span class="min-w-0 flex-1 break-words">Feasts, solemnities, memorials: what changes on the calendar</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-5">
          <span class="min-w-0 flex-1 break-words">How the liturgical calendar shapes the Daily Mass readings</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-6">
          <span class="min-w-0 flex-1 break-words">A practical way to pray with the seasons (without getting overwhelmed)</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-7">
          <span class="min-w-0 flex-1 break-words">FAQs: Liturgical Year</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-8">
          <span class="min-w-0 flex-1 break-words">Conclusion</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
    </ul>
  </nav>

  <div class="my-8 flex justify-center overflow-hidden">
    <ins class="adsbygoogle"
      style="display:block;"
      data-ad-client="ca-pub-8819996017476509"
      data-ad-slot="3041346283"
      data-ad-format="fluid"
      data-full-width-responsive="true">
    </ins>
  </div>

  <div itemprop="articleBody" class="max-w-none overflow-hidden">

    <h2 id="sec-1" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      What the Liturgical Year is (and why it matters)
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The <strong class="text-gray-900 font-semibold">Liturgical Year</strong> is the Church’s way of walking with Jesus through the mysteries of salvation:
      His Incarnation, His public ministry, His Passion, Death, Resurrection, Ascension, and the gift of the Holy Spirit.
      It is not a devotional “extra.” It is the framework that shapes the Mass, the readings, and the Church’s prayer.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      In practical terms, the Liturgical Year tells you:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">what season we are in</strong> (Advent, Lent, etc.),
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">what is emphasized</strong> (waiting, joy, repentance, mission),
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">what color is used at Mass</strong> (as a visible sign of meaning),
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        and <strong class="text-gray-900 font-semibold">how Scripture is proclaimed</strong> through the Lectionary.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      When you understand this rhythm, your prayer becomes less scattered.
      You stop asking, “What should I read today?” because the Church is already guiding you day by day.
    </p>

    <h2 id="sec-2" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      The main seasons: Advent, Christmas, Lent, Easter, Ordinary Time
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The Catholic Liturgical Year is built around five major seasons. Each season has a spiritual “tone” that shapes the prayers and readings.
      Here is a simple overview:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-3 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Advent</strong>: a season of watchful waiting—hope, preparation, and longing for Christ. It trains your heart to stay awake.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Christmas Season</strong>: the joy of the Incarnation—God truly with us. The Church lingers on the mystery, not just the date.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Lent</strong>: conversion, repentance, and deeper prayer. Lent is not about gloom; it is about freedom and returning to God.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Easter Season</strong>: fifty days of victory—Resurrection life, the new creation, and the gift of the Holy Spirit.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Ordinary Time</strong>: growth in discipleship—learning the Gospel in everyday life. “Ordinary” here means “ordered,” not boring.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Think of it as a school of the heart: the seasons teach you how to live with Jesus in every kind of day—
      joyful days, difficult days, ordinary days, and holy days.
    </p>

    <h2 id="sec-3" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Liturgical colors: what they mean
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Liturgical colors are not decoration. They are a language.
      They help your eyes learn what your heart is being invited to live.
      Here are the colors you will see most often:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Green</strong>: Ordinary Time—steady growth, hope, and daily discipleship.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Violet (Purple)</strong>: Advent and Lent—preparation, repentance, and interior renewal.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">White (or Gold)</strong>: Christmas and Easter, feasts of the Lord, Mary, angels, and many saints—joy, light, and celebration.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Red</strong>: Palm Sunday, Good Friday, Pentecost, apostles and martyrs—love, sacrifice, and the fire of the Holy Spirit.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Rose</strong> (rare): Gaudete Sunday (Advent) and Laetare Sunday (Lent)—a gentle sign of joy breaking through.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Black</strong> (optional/rare): Masses for the Dead in some places—mourning and hope in Christ.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      If you want a simple practice: when you notice the color at Mass, ask,
      “What is the Church inviting me to live right now?”
      That question alone can turn “attendance” into prayer.
    </p>

    <h2 id="sec-4" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Feasts, solemnities, memorials: what changes on the calendar
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Not every day on the Church calendar is the same “rank.” Some celebrations are so central that they change the prayers and readings more strongly.
      You will often see these terms:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Solemnity</strong>: the highest rank (for example: Easter, Christmas, Pentecost). Often includes special readings and a stronger liturgical emphasis.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Feast</strong>: an important celebration (often apostles, major events in salvation history). The Mass texts are clearly shaped by the feast.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Memorial</strong>: a day honoring a saint. Memorials can be “obligatory” or “optional” depending on the calendar and local norms.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      This is why the same date can look different from year to year: the liturgical calendar depends on movable feasts (especially those connected to Easter)
      and on which celebration has priority on a given day.
    </p>

    <h2 id="sec-5" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      How the liturgical calendar shapes the Daily Mass readings
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The readings at Mass are organized by the <strong class="text-gray-900 font-semibold">Lectionary</strong>.
      The liturgical season influences:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">the themes</strong> (for example: watchfulness in Advent, conversion in Lent),
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">the tone</strong> of prayers and Prefaces,
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        and sometimes <strong class="text-gray-900 font-semibold">the reading set</strong> used on a feast or solemnity.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      This is exactly why many Catholics grow in Scripture by simply following the Daily Mass readings:
      you are not reading the Bible in isolation—you are reading it inside the Church’s living worship.
      The calendar becomes a guide for what to listen for and how to respond.
    </p>

    <h2 id="sec-6" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      A practical way to pray with the seasons (without getting overwhelmed)
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      You do not need to memorize the whole calendar to pray well.
      Here is a simple method that works in any season:
    </p>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Name the season</strong>: “We are in Advent,” “It is Lent,” “It is Ordinary Time.”
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Name the invitation</strong>: waiting, joy, repentance, resurrection life, growth.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Choose one daily action</strong>: one concrete step that matches the season (a small fast, a specific act of charity, a daily Psalm, a short examen at night).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Pray with the Gospel</strong>: let the day’s Gospel give you the “word” for today.
      </li>
    </ol>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      This approach keeps the Liturgical Year from feeling like a complicated system.
      Instead, it becomes what it is meant to be: a path of grace that returns you to Jesus again and again.
    </p>

    <h2 id="sec-7" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      FAQs: Liturgical Year
    </h2>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Why does the Liturgical Year not start in January?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Because it follows the mysteries of Christ, not civil time. The year begins with Advent as a season of hope and preparation.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">What does “Ordinary Time” mean?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            “Ordinary” comes from “ordered.” It is the season where we grow steadily as disciples through the Gospel, week by week.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Do liturgical colors have a strict meaning everywhere?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            The meanings are broadly consistent, but some local norms and optional usages exist (for example, black or violet for certain Masses for the Dead).
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Why do readings change on saints’ days?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Because the feast highlights a specific mystery or witness of holiness, and the readings help the Church pray that theme more clearly.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">How can I follow the Liturgical Year daily?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Pray with the Daily Mass readings, notice the season and color, and adopt one small practice that matches the season’s invitation.
          </li>
        </ul>
      </li>
    </ol>

    <h2 id="sec-8" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Conclusion
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The Liturgical Year is the Church teaching you how to live with Christ through time.
      Seasons and colors are not just tradition—they are a pastoral wisdom that keeps your faith grounded, steady, and real.
      If you want a simple next step, start by praying with the Daily Mass readings and asking one question each day:
      “What is the Church inviting me to live right now?”
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      [SEO]
      {
        &quot;keywords&quot;: [
          &quot;liturgical year&quot;,
          &quot;catholic liturgical year explained&quot;,
          &quot;liturgical seasons&quot;,
          &quot;advent christmas lent easter ordinary time&quot;,
          &quot;liturgical colors&quot;,
          &quot;church calendar&quot;,
          &quot;solemnity feast memorial&quot;,
          &quot;daily mass readings&quot;
        ],
        &quot;metaDescription&quot;: &quot;Learn the Catholic Liturgical Year: seasons, liturgical colors, and the Church calendar—what changes across the year and how it shapes the Daily Mass readings and your prayer.&quot;
      }
    </p>

  </div>
</article>
`.trim();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="flex flex-col min-h-screen bg-amber-400 relative w-full overflow-x-hidden">
        <div className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            {/* Main */}
            <div className="min-w-0">
              <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full">
                <div className="flex justify-between items-center mb-6 border-b pb-3 border-amber-200">
                  <div className="text-sm md:text-base text-gray-700 font-medium">
                    English • Liturgy
                  </div>
                  <div className="px-3 py-1 text-xs md:px-4 md:py-2 rounded-full bg-amber-600 text-white md:text-sm font-semibold shadow-md">
                    SEO Page
                  </div>
                </div>

                <div
                  className="
                    mt-6
                    w-full
                    mx-auto
                    bg-[#fffaf1]
                    border border-amber-200
                    shadow-sm
                    rounded-xl
                    px-3 py-5
                    sm:px-5 sm:py-6
                    lg:px-8 lg:py-8
                    max-w-none
                    overflow-hidden
                  "
                  style={{ fontSize: 16, lineHeight: "1.9" }}
                  dangerouslySetInnerHTML={{ __html: articleHtml }}
                />
              </div>
            </div>

            {/* Aside */}
            <div className="hidden lg:block min-w-0">
              <LiturgiaAsideEN
                            year={year}
                            month={month}
                            todaySlug={todaySlug}
                            todayLabel={todayLabel}
                            prevSlug={prevSlug}
                            nextSlug={nextSlug}
                            adsSlotDesktop300x250="8534838745"
                            variant="desktop"
                          />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
