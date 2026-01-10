// app/en/liturgy/pray-with-the-liturgy-in-5-minutes/page.tsx
//
// Static SEO page (EN) using the same visual language you use in BlogPostDetail + the exact article Tailwind pattern.
// - Server Component (keeps generateMetadata for SEO)
// - Uses LiturgiaAsideEN on the right (desktop)
// - Content is hardcoded HTML with your "post-santo" classes + TOC pattern
// - No Liturgia/Terço blocks (as requested)

import LiturgiaAsideEN from "@/components/liturgia/LiturgiaAsideEN";
import type { Metadata } from "next";


const SITE_URL = "https://www.iatioben.com.br";

const SLUG = "pray-with-the-liturgy-in-5-minutes";
const CANONICAL = `${SITE_URL}/en/liturgy/${SLUG}`;

const TITLE =
  "Pray with the Liturgy in 5 Minutes: A Practical Step-by-Step for Consistency";
const DESCRIPTION =
  "A simple 5-minute Catholic routine to pray with the Daily Mass readings: Gospel, Psalm, one takeaway line, and a short prayer—built for consistency, not pressure.";

const PUBLISH_DATE_ISO = "2026-01-10";

// Optional: replace with your preferred OG route/pattern for EN pages.
const OG_IMAGE = `${SITE_URL}/og?title=${encodeURIComponent(
  "Pray with the Liturgy in 5 Minutes"
)}&description=${encodeURIComponent(
  "A practical step-by-step to build consistency with Daily Mass readings."
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
      Pray with the Liturgy in 5 Minutes
    </h1>

    <p class="mt-3 text-lg text-gray-700 leading-[1.9] break-words" itemprop="description">
      If you want to pray every day but you keep falling off, the problem is rarely “lack of desire.”
      The problem is usually the plan: too big, too complicated, too fragile for real life.
      This page gives you a <strong class="text-gray-900 font-semibold">5-minute step-by-step</strong> to pray with the Daily Mass readings—built for consistency, not pressure.
      It works on busy mornings, lunch breaks, or the last five minutes before sleep.
    </p>
  </header>

  <nav class="my-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm overflow-hidden">
    <h4 class="text-sm font-semibold text-amber-900 tracking-wide">In this article</h4>
    <ul class="mt-4 grid gap-2 sm:grid-cols-2">
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-1">
          <span class="min-w-0 flex-1 break-words">Why 5 minutes works (and longer plans fail)</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-2">
          <span class="min-w-0 flex-1 break-words">The 5-minute routine: step by step</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-3">
          <span class="min-w-0 flex-1 break-words">How to choose your “one line” for the day</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-4">
          <span class="min-w-0 flex-1 break-words">How to stay consistent when you miss a day</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-5">
          <span class="min-w-0 flex-1 break-words">A weekly upgrade that takes zero willpower</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-6">
          <span class="min-w-0 flex-1 break-words">Common mistakes (and how to avoid them)</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-7">
          <span class="min-w-0 flex-1 break-words">FAQs: 5-minute liturgy prayer</span>
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
      Why 5 minutes works (and longer plans fail)
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Consistency is not built by big promises. It is built by small actions you can repeat when life is normal—and when life is messy.
      A 5-minute routine is powerful because it is:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">easy to start</strong> (low resistance),
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">easy to repeat</strong> (habit-friendly),
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        and <strong class="text-gray-900 font-semibold">easy to keep</strong> (even on tired days).
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      And here is the secret: once prayer becomes consistent, it naturally becomes deeper.
      The goal is not to stay at five minutes forever—the goal is to become faithful.
    </p>

    <h2 id="sec-2" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      The 5-minute routine: step by step
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Use the Daily Mass readings (or the readings for the next Mass you will attend). Then follow this exact order.
      Set a timer if you want. The point is to keep it simple.
    </p>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">0:30 — Begin in silence.</strong> Put the phone down, breathe, and say: “Lord, I am here.”
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">2:00 — Read the Gospel once, slowly.</strong> Not to “study,” but to meet Jesus in His Word.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">1:00 — Pray the Psalm refrain.</strong> Repeat it as your answer. Let it become your prayer for the day.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">1:00 — Choose one line.</strong> A sentence that comforts, corrects, invites, or challenges you.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">0:30 — End with one request.</strong> “Jesus, give me the grace to live this today.”
      </li>
    </ol>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      That is enough. If you have extra time, you can add the First Reading.
      But do not expand the routine so much that you stop doing it.
    </p>

    <h2 id="sec-3" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      How to choose your “one line” for the day
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Your “one line” is not a quote for social media. It is a small anchor for your heart.
      Choose a line that does at least one of these things:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Reveals</strong> something about God (His mercy, His authority, His patience).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Invites</strong> you to a response (trust, repentance, courage, forgiveness).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Names</strong> your real struggle (fear, anger, distraction, pride).
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Gives</strong> a promise you need to remember today.
      </li>
    </ul>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Then do one simple thing: repeat that line once in the morning, once at midday, and once at night.
      That is how a 5-minute prayer starts shaping a whole day.
    </p>

    <h2 id="sec-4" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      How to stay consistent when you miss a day
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Missing a day does not mean you “failed.” It means you are human.
      The real danger is not missing one day—the danger is turning one missed day into a week of guilt.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Use this rule:
      <strong class="text-gray-900 font-semibold">Never “catch up” as punishment. Restart as mercy.</strong>
      Pray today’s readings today. Receive today’s grace today.
    </p>

    <h2 id="sec-5" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      A weekly upgrade that takes zero willpower
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Once you are consistent with five minutes, add one small weekly habit:
    </p>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        On Saturday night (or Sunday morning), read the Sunday Gospel one extra time.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Write one sentence: “This week, Jesus is inviting me to…”
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Bring that intention to Mass.
      </li>
    </ol>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      This connects your daily routine to the heart of Catholic life: the Mass.
      And it makes Sunday feel less like a weekly obligation and more like a weekly encounter.
    </p>

    <h2 id="sec-6" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Common mistakes (and how to avoid them)
    </h2>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Making the routine too big.</strong> If it cannot survive a busy day, it will not survive a real life.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Trying to feel something.</strong> Faithfulness comes first; feelings often follow later.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Turning prayer into research.</strong> A little understanding helps, but prayer is about encounter and response.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Quitting after you miss.</strong> Do not negotiate with guilt. Restart today, simply.
      </li>
    </ul>

    <h2 id="sec-7" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      FAQs: 5-minute liturgy prayer
    </h2>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Is five minutes “real prayer”?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Yes. Real prayer is not measured by length but by honesty, attention, and response. Five faithful minutes can change a life.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">What if I do not understand the Gospel?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Choose one clear line anyway and pray with it. Understanding grows over time with repetition and grace.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">When is the best time to do this routine?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            The best time is the time you can keep. Morning is ideal for many people, but lunchtime or evening also works.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Should I read all the Daily Mass readings too?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            You can, but do not make it the price of consistency. Start with the Gospel + Psalm. Add more only when the habit is stable.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">What if I miss a whole week?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Restart today. Do not punish yourself. Receive today’s Word as today’s mercy.
          </li>
        </ul>
      </li>
    </ol>

    <h2 id="sec-8" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Conclusion
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      Five minutes can become a doorway: a daily encounter with Christ through the Church’s prayer.
      If you want consistency, choose the smallest faithful routine—and do it again tomorrow.
      The liturgy will do what it always does: it will shape you, gently and steadily, into a disciple.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      [SEO]
      {
        &quot;keywords&quot;: [
          &quot;pray with the liturgy&quot;,
          &quot;5 minute prayer&quot;,
          &quot;daily mass readings&quot;,
          &quot;catholic daily prayer routine&quot;,
          &quot;how to build prayer consistency&quot;,
          &quot;pray with the gospel&quot;,
          &quot;responsorial psalm prayer&quot;,
          &quot;prepare for mass&quot;
        ],
        &quot;metaDescription&quot;: &quot;Pray with the liturgy in 5 minutes: a practical step-by-step Catholic routine using the Daily Mass readings (Gospel + Psalm) to build consistency without pressure.&quot;
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
