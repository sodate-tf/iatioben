// app/en/liturgy/how-to-use-the-liturgy-day-by-day/page.tsx
//
// Static SEO page (EN) using the same visual language you use in BlogPostDetail + the exact article Tailwind pattern.
// - Server Component (keeps generateMetadata for SEO)
// - Uses LiturgiaAsideEN on the right (desktop)
// - Content is hardcoded HTML with your "post-santo" classes + TOC pattern
// - No Liturgia/Terço blocks (as requested)

import type { Metadata } from "next";
import LiturgiaAsideEN from "@/components/liturgia/LiturgiaAsideEN";

const SITE_URL = "https://www.iatioben.com.br";

// Keep this slug aligned with the folder name.
const SLUG = "how-to-use-the-liturgy-day-by-day";
const CANONICAL = `${SITE_URL}/en/liturgy/${SLUG}`;

const TITLE =
  "How to Use the Liturgy Day by Day: A Simple Way to Pray and Prepare for Mass";
const DESCRIPTION =
  "A practical daily routine to pray with the Catholic liturgy: how to read the Daily Mass readings, meditate with the Psalm and Gospel, and arrive at Mass prepared—without feeling overwhelmed.";

const PUBLISH_DATE_ISO = "2026-01-10";

// Optional: if you already have an OG route for EN pages, replace this with your preferred pattern.
const OG_IMAGE = `${SITE_URL}/og?title=${encodeURIComponent(
  "How to Use the Liturgy Day by Day"
)}&description=${encodeURIComponent(
  "A simple routine to pray with the Daily Mass readings and prepare for Mass."
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
  // JSON-LD (Article) – kept lightweight and clean for SEO.
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
      How to Use the Liturgy Day by Day
    </h1>

    <p class="mt-3 text-lg text-gray-700 leading-[1.9] break-words" itemprop="description">
      If you have ever opened the Daily Mass readings and thought, “Where do I even start?”, you are not alone.
      The good news is that praying with the liturgy does not require hours, a theology degree, or a perfect routine.
      What you need is a simple, repeatable way to listen to God’s Word, respond with your heart, and arrive at Mass already prepared.
      This guide will show you a practical daily rhythm—clear, realistic, and deeply Catholic.
    </p>
  </header>

  <nav class="my-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm overflow-hidden">
    <h4 class="text-sm font-semibold text-amber-900 tracking-wide">In this article</h4>
    <ul class="mt-4 grid gap-2 sm:grid-cols-2">
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-1">
          <span class="min-w-0 flex-1 break-words">What “the liturgy” means in daily life</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-2">
          <span class="min-w-0 flex-1 break-words">Why the Daily Mass readings shape your week</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-3">
          <span class="min-w-0 flex-1 break-words">A 10-minute routine to pray with the liturgy</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-4">
          <span class="min-w-0 flex-1 break-words">How to meditate on the Psalm and Gospel</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-5">
          <span class="min-w-0 flex-1 break-words">Preparing for Mass without pressure</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-6">
          <span class="min-w-0 flex-1 break-words">Common mistakes and how to avoid them</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-7">
          <span class="min-w-0 flex-1 break-words">FAQs: praying with the liturgy</span>
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
      What “the liturgy” means in daily life
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      In Catholic life, the <strong class="text-gray-900 font-semibold">liturgy</strong> is not just “a church service.”
      It is the public prayer of the Church—Christ worshiping the Father with His Body, the Church.
      The Mass, the Liturgy of the Word, the prayers, the calendar of seasons (Advent, Lent, Easter, Ordinary Time),
      and the saints’ feasts all belong to this living rhythm.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      When you pray with the liturgy day by day, you are not creating a private spirituality from scratch.
      You are stepping into the Church’s prayer, guided by Scripture and shaped by the Lectionary.
      This is why “Daily Mass readings” are so powerful: they teach your heart to hear God the way the Church hears Him.
    </p>

    <h2 id="sec-2" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Why the Daily Mass readings shape your week
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The Daily Mass readings are not random. They follow a structure that:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Forms your mind with Scripture</strong> (little by little, not all at once).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Trains your attention</strong> to recognize recurring themes across days and seasons.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Prepares you for Sunday</strong>, because the liturgical week has a direction and a build-up.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Unites your prayer with the Church</strong> across parishes, countries, and cultures.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Even if you cannot attend daily Mass, praying with the readings gives your day a spiritual “compass.”
      It is one of the simplest ways to build consistency: the Church already chose the texts for you.
      You only need to show up.
    </p>

    <h2 id="sec-3" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      A 10-minute routine to pray with the liturgy
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Here is a routine you can repeat every day. It is intentionally simple, because the goal is not intensity—
      the goal is <strong class="text-gray-900 font-semibold">fidelity</strong>.
    </p>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Begin with one quiet minute.</strong> Breathe, slow down, and say: “Speak, Lord, your servant is listening.”
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Read the Gospel first (slowly).</strong> If your time is limited, the Gospel is the best “center” for the day.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Read the Psalm as your response.</strong> The Psalm teaches you how to answer God with trust, repentance, praise, and longing.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Choose one phrase to carry.</strong> A single line is enough: a command, a promise, a question, or a comfort.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">End with a short prayer.</strong> Ask for one grace you actually need today (patience, courage, purity of heart, humility).
      </li>
    </ol>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      If you have more time, add the First Reading or the Second Reading.
      But if you have less time, do not quit—reduce the routine to the Gospel + one sentence of prayer.
      Consistency beats complexity.
    </p>

    <h2 id="sec-4" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      How to meditate on the Psalm and Gospel
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Meditation is not “thinking harder.” It is <strong class="text-gray-900 font-semibold">listening longer</strong>.
      Here are three practical prompts that work especially well with Daily Mass readings:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">What is God revealing about His heart?</strong> Look for mercy, truth, invitation, correction, or promise.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">What is this Word asking of me today?</strong> Keep it concrete: one choice, one conversation, one attitude.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Where do I see myself in the text?</strong> A disciple, a crowd, a sinner forgiven, a person in need, a person resisting grace.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      With the Psalm, pay attention to the emotion: joy, fear, thirst, gratitude, sorrow.
      The Psalm is the Church teaching you a mature spiritual language.
      With the Gospel, pay attention to Jesus: His words, His gaze, His authority, His tenderness.
      The goal is not to finish quickly—it is to let one line “follow you” into the day.
    </p>

    <h2 id="sec-5" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Preparing for Mass without pressure
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Preparing for Mass does not mean you must arrive with perfect feelings or perfect focus.
      It means you arrive <strong class="text-gray-900 font-semibold">ready to receive</strong>.
      If you prayed with the readings, even briefly, you will recognize the Word proclaimed at Mass as something you already met.
      That recognition changes everything.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      If you want one practical checklist, use this:
    </p>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Read the Gospel before Mass</strong> (the night before or the morning of).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Ask for one grace</strong>: “Lord, help me hear You,” or “Lord, give me a contrite heart.”
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Offer one intention</strong> for the Mass (your family, your work, someone who suffers, your own conversion).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Arrive a few minutes early</strong> if possible, so your body and mind can “arrive” too.
      </li>
    </ol>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The liturgy is a gift. Preparation is simply the way you unwrap it with attention and love.
    </p>

    <h2 id="sec-6" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Common mistakes and how to avoid them
    </h2>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Trying to read everything perfectly.</strong>
        The Lectionary is a lifelong school. Start small and stay faithful.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Turning prayer into a study session.</strong>
        Understanding matters, but prayer is first a relationship. Ask, listen, respond.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Quitting after a missed day.</strong>
        Missing a day is normal. The victory is returning the next day without drama.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Waiting to “feel spiritual.”</strong>
        Feelings come and go. The liturgy forms you precisely when you feel ordinary.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      If you want a single principle: build a routine that is so simple you can do it on a tired day.
      That is how a spiritual habit becomes a spiritual life.
    </p>

    <h2 id="sec-7" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      FAQs: praying with the liturgy
    </h2>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Do I have to read all the Daily Mass readings every day?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            No. If time is short, read the Gospel and pray one honest response. Consistency matters more than volume.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">What if I do not understand a reading?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Do not panic. Focus on one clear line, ask God for light, and consider using a brief Catholic commentary later. Prayer can begin before full clarity.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Is this the same as Lectio Divina?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            It is closely related. Lectio Divina is a classic method of prayer with Scripture; praying with the liturgy uses the Church’s daily selections and naturally fits that method.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">When is the best time to pray with the readings?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Morning works well, but the best time is the time you will actually keep. Many people choose early morning, lunchtime, or the evening before Mass.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">How does this help me at Mass?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            You listen with recognition, not surprise. The Word lands deeper, and you participate more intentionally in the Liturgy of the Word and the Eucharist.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">What if I miss a week?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Restart today. Do not “catch up” as a punishment. Receive today’s Word as today’s mercy.
          </li>
        </ul>
      </li>
    </ol>

    <h2 id="sec-8" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Conclusion
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Learning how to use the liturgy day by day is one of the most realistic ways to grow in prayer.
      You do not have to invent a path—God already placed a path in the Church’s hands: the Daily Mass readings, the Psalm, the Gospel, the seasons, the saints, and the Mass itself.
      Start small, stay faithful, and let the Word shape your days.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      [SEO]
      {
        &quot;keywords&quot;: [
          &quot;how to use the liturgy&quot;,
          &quot;daily mass readings&quot;,
          &quot;catholic liturgy explained&quot;,
          &quot;pray with the lectionary&quot;,
          &quot;prepare for mass&quot;,
          &quot;liturgy of the word&quot;,
          &quot;psalm response prayer&quot;,
          &quot;catholic daily prayer routine&quot;
        ],
        &quot;metaDescription&quot;: &quot;Learn how to use the liturgy day by day with a simple Catholic prayer routine: pray with the Daily Mass readings, meditate on the Psalm and Gospel, and prepare for Mass with peace.&quot;
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
            {/* Main content */}
            <div className="min-w-0">
              <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full">
                {/* Header strip (visual language similar to BlogPostDetail, without client share button) */}
                <div className="flex justify-between items-center mb-6 border-b pb-3 border-amber-200">
                  <div className="text-sm md:text-base text-gray-700 font-medium">
                    English • Liturgy
                  </div>
                 
                </div>

                {/* Article */}
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

            {/* Aside (desktop) */}
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
