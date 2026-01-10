// app/en/liturgy/daily-mass-readings-vs-gospel-of-the-day/page.tsx
//
// Static SEO page (EN) using the same visual language you use in BlogPostDetail + the exact article Tailwind pattern.
// - Server Component (keeps generateMetadata for SEO)
// - Uses LiturgiaAsideEN on the right (desktop)
// - Content is hardcoded HTML with your "post-santo" classes + TOC pattern
// - No Liturgia/Terço blocks (as requested)

import LiturgiaAsideEN from "@/components/liturgia/LiturgiaAsideEN";
import type { Metadata } from "next";


const SITE_URL = "https://www.iatioben.com.br";

const SLUG = "daily-mass-readings-vs-gospel-of-the-day";
const CANONICAL = `${SITE_URL}/en/liturgy/${SLUG}`;

const TITLE =
  "Daily Mass Readings vs. Gospel of the Day: Differences, Benefits, and When to Use Each";
const DESCRIPTION =
  "Catholic guide to Daily Mass Readings vs. Gospel of the Day: what each includes, why they differ, key benefits, and when to choose one—or use both for prayer and Mass prep.";

const PUBLISH_DATE_ISO = "2026-01-10";

// Optional: replace with your preferred OG route/pattern for EN pages.
const OG_IMAGE = `${SITE_URL}/og?title=${encodeURIComponent(
  "Daily Mass Readings vs. Gospel of the Day"
)}&description=${encodeURIComponent(
  "Differences, benefits, and when to use each for prayer and Mass prep."
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
      Daily Mass Readings vs. Gospel of the Day
    </h1>

    <p class="mt-3 text-lg text-gray-700 leading-[1.9] break-words" itemprop="description">
      Many Catholics search for “Gospel of the Day” and assume it is the same thing as the “Daily Mass Readings.”
      They are related, but they are not identical.
      In this guide, you will learn the difference, the benefits of each, and the simplest way to choose what to use—especially if you are trying to pray consistently or prepare well for Mass.
    </p>
  </header>

  <nav class="my-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm overflow-hidden">
    <h4 class="text-sm font-semibold text-amber-900 tracking-wide">In this article</h4>
    <ul class="mt-4 grid gap-2 sm:grid-cols-2">
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-1">
          <span class="min-w-0 flex-1 break-words">Quick definitions (so it’s crystal clear)</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-2">
          <span class="min-w-0 flex-1 break-words">What Daily Mass Readings usually include</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-3">
          <span class="min-w-0 flex-1 break-words">What “Gospel of the Day” usually means online</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-4">
          <span class="min-w-0 flex-1 break-words">Benefits: when each option helps most</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-5">
          <span class="min-w-0 flex-1 break-words">When to use which (a simple decision guide)</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-6">
          <span class="min-w-0 flex-1 break-words">How to combine both without adding time</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-7">
          <span class="min-w-0 flex-1 break-words">FAQs: Daily readings vs. Gospel of the Day</span>
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
      Quick definitions (so it’s crystal clear)
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Let’s define terms the way most Catholics experience them:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Daily Mass Readings</strong> usually means the full set of Scripture passages appointed by the Church for Mass on a given date.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Gospel of the Day</strong> usually means just the Gospel passage for that date—often shared with a short reflection or homily-style commentary.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      In other words:
      <strong class="text-gray-900 font-semibold">the Gospel is part of the Daily Mass Readings</strong>.
      But the Daily Mass Readings are usually <em>more than</em> the Gospel.
    </p>

    <h2 id="sec-2" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      What Daily Mass Readings usually include
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The Daily Mass Readings typically mirror the structure of the <strong class="text-gray-900 font-semibold">Liturgy of the Word</strong>.
      Depending on the day (weekday vs. Sunday/solemnity), you will see:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">First Reading</strong> (often Old Testament; during Easter it is commonly from Acts)
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Responsorial Psalm</strong> (Scripture prayed as the Church’s response)
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Second Reading</strong> (usually on Sundays/solemnities, often from the New Testament Letters)
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Gospel</strong> (the high point of the Liturgy of the Word)
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The benefit of reading the full set is that you start to see how Scripture “talks to itself”:
      the First Reading often prepares a theme that the Gospel fulfills, and the Psalm becomes the bridge between listening and responding.
    </p>

    <h2 id="sec-3" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      What “Gospel of the Day” usually means online
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      When people search “Gospel of the Day,” they often want something fast, focused, and devotional.
      In many websites and apps, “Gospel of the Day” includes:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        the <strong class="text-gray-900 font-semibold">Gospel text</strong> (sometimes with the reference only),
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        a brief <strong class="text-gray-900 font-semibold">reflection</strong> (what it means for daily life),
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        and sometimes a <strong class="text-gray-900 font-semibold">prayer</strong> or “takeaway” line.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      This can be excellent for building a daily habit—especially when your time and energy are limited.
      The Gospel is short enough to revisit, memorize, and carry through your day.
    </p>

    <h2 id="sec-4" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Benefits: when each option helps most
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Both approaches are good. They serve different spiritual needs.
      Here is the most practical way to see it:
    </p>

    <h3 class="mt-10 mb-4 text-lg sm:text-xl font-semibold text-gray-900 leading-snug scroll-mt-24 text-amber-900 !mt-0">
      Daily Mass Readings: best for “whole-Church” formation
    </h3>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        You learn Scripture in context and start seeing patterns across the liturgical seasons.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        You prepare more deeply for Mass, especially on Sundays and solemnities.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        You grow in “Catholic instincts”: listening, responding, and living the Word with the Church.
      </li>
    </ul>

    <h3 class="mt-10 mb-4 text-lg sm:text-xl font-semibold text-gray-900 leading-snug scroll-mt-24 text-amber-900">
      Gospel of the Day: best for daily consistency and focus
    </h3>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        It is easy to start and easy to repeat (ideal for busy schedules).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        It gives you one clear word to carry throughout the day.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Reflections can help you apply the Gospel to real life quickly.
      </li>
    </ul>

    <h2 id="sec-5" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      When to use which (a simple decision guide)
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Use this decision guide depending on your goal today:
    </p>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">If you are preparing for Sunday Mass</strong>, choose the <strong class="text-gray-900 font-semibold">Daily Mass Readings</strong> (especially the full Sunday set).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">If you only have a few minutes</strong>, choose the <strong class="text-gray-900 font-semibold">Gospel of the Day</strong> and pray one line.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">If you feel spiritually scattered</strong>, choose the <strong class="text-gray-900 font-semibold">Gospel of the Day</strong> for focus, then add the Psalm if you can.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">If you want deeper biblical formation</strong>, choose the <strong class="text-gray-900 font-semibold">full Daily Mass Readings</strong> consistently over time.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">If you are starting from zero</strong>, begin with the <strong class="text-gray-900 font-semibold">Gospel of the Day</strong>. Consistency first, depth second.
      </li>
    </ol>

    <h2 id="sec-6" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      How to combine both without adding time
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      You do not need to choose forever. Many Catholics use both, with a very simple strategy:
    </p>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Start with the <strong class="text-gray-900 font-semibold">Gospel of the Day</strong> every day (even if it is only 2 minutes).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Add the <strong class="text-gray-900 font-semibold">Psalm</strong> when you have a little more time (it becomes your response).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        On weekends, read the <strong class="text-gray-900 font-semibold">full Sunday set</strong> (Daily Mass Readings) once more to prepare for Mass.
      </li>
    </ol>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      This method keeps your daily prayer light, but your formation deep.
      It is a realistic balance for real schedules.
    </p>

    <h2 id="sec-7" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      FAQs: Daily readings vs. Gospel of the Day
    </h2>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Are the Daily Mass Readings and the Gospel of the Day ever different?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            The Gospel of the Day is normally the same Gospel that appears in the full set of Daily Mass Readings for that date. The difference is usually what is included around it (full set vs. Gospel-only).
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Which one is better for beginners?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            The Gospel of the Day is often best for beginners because it is simple and easy to keep daily. Once you are consistent, add the Psalm and other readings.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Do I need reflections, or is the text enough?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            The text is enough for prayer. Reflections can help, but they should not replace the Gospel itself. Start with the Word, then use reflections as support.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">If I only have time for one thing, what should I do?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Read the Gospel of the Day slowly and choose one line to carry. That single habit can build a strong spiritual foundation.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">How does this relate to the Lectionary?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Both “Daily Mass Readings” and “Gospel of the Day” are drawn from the Lectionary, the Church’s organized set of readings for Mass across the year.
          </li>
        </ul>
      </li>
    </ol>

    <h2 id="sec-8" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Conclusion
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Daily Mass Readings and the Gospel of the Day are not competitors—they are two entry points into the same gift: the Word of God proclaimed by the Church.
      If you want formation and context, use the full Daily Mass Readings.
      If you want daily consistency and focus, begin with the Gospel of the Day.
      And if you want the best of both, keep the Gospel daily and add the full set when you have time—especially on Sundays.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      [SEO]
      {
        &quot;keywords&quot;: [
          &quot;daily mass readings&quot;,
          &quot;gospel of the day&quot;,
          &quot;daily mass readings vs gospel of the day&quot;,
          &quot;catholic daily readings&quot;,
          &quot;liturgy of the word&quot;,
          &quot;lectionary&quot;,
          &quot;how to pray with the gospel&quot;,
          &quot;prepare for mass&quot;
        ],
        &quot;metaDescription&quot;: &quot;Daily Mass Readings vs. Gospel of the Day: learn the differences, benefits, and when to use each—plus a simple way to combine both for prayer and Mass preparation.&quot;
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
