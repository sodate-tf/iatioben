// app/en/liturgy/mass-readings-guide/page.tsx
//
// Static SEO page (EN) using the same visual language you use in BlogPostDetail + the exact article Tailwind pattern.
// - Server Component (keeps generateMetadata for SEO)
// - Uses LiturgiaAsideEN on the right (desktop)
// - Content is hardcoded HTML with your "post-santo" classes + TOC pattern
// - No Liturgia/Terço blocks (as requested)

import LiturgiaAsideEN from "@/components/liturgia/LiturgiaAsideEN";
import type { Metadata } from "next";


const SITE_URL = "https://www.iatioben.com.br";

const SLUG = "mass-readings-guide";
const CANONICAL = `${SITE_URL}/en/liturgy/${SLUG}`;

const TITLE =
  "Mass Readings Guide: First Reading, Psalm, Gospel—and How to Follow Them";
const DESCRIPTION =
  "A clear Catholic guide to the Mass readings: what the First Reading, Responsorial Psalm, Second Reading, and Gospel mean—and a simple way to follow them day by day.";

const PUBLISH_DATE_ISO = "2026-01-10";

// Optional: replace with your preferred OG route/pattern for EN pages.
const OG_IMAGE = `${SITE_URL}/og?title=${encodeURIComponent(
  "Mass Readings Guide"
)}&description=${encodeURIComponent(
  "First Reading, Psalm, Gospel—and how to follow them day by day."
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
    datePublished: "2026-01-10",
    dateModified: "2026-01-10",
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
      Mass Readings Guide
    </h1>

    <p class="mt-3 text-lg text-gray-700 leading-[1.9] break-words" itemprop="description">
      The Mass readings are not a random selection of Bible passages. They are a carefully ordered proclamation of God’s Word—designed to form the Church, week by week, season by season.
      If you have ever wondered <em>what the First Reading is for</em>, why we sing a Psalm, or how the Gospel fits into everything, this guide will make it simple.
      You will learn what each reading means and a practical way to follow the Daily Mass readings without feeling overwhelmed.
    </p>
  </header>

  <nav class="my-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm overflow-hidden">
    <h4 class="text-sm font-semibold text-amber-900 tracking-wide">In this article</h4>
    <ul class="mt-4 grid gap-2 sm:grid-cols-2">
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-1">
          <span class="min-w-0 flex-1 break-words">Why the Mass readings matter</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-2">
          <span class="min-w-0 flex-1 break-words">First Reading: what it is and how to listen</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-3">
          <span class="min-w-0 flex-1 break-words">Responsorial Psalm: the Church’s response</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-4">
          <span class="min-w-0 flex-1 break-words">Second Reading: why it appears (mostly Sundays)</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-5">
          <span class="min-w-0 flex-1 break-words">Gospel: the summit of the Liturgy of the Word</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-6">
          <span class="min-w-0 flex-1 break-words">A simple method to follow the readings day by day</span>
          <span aria-hidden="true" class="shrink-0">→</span>
        </a>
      </li>
      <li>
        <a class="inline-flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition whitespace-normal break-words" href="#sec-7">
          <span class="min-w-0 flex-1 break-words">FAQs: Mass readings</span>
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
      Why the Mass readings matter
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      At Mass, God does not simply “share inspiring verses.” He speaks to His people.
      The <strong class="text-gray-900 font-semibold">Liturgy of the Word</strong> is a real encounter: Scripture is proclaimed, the Church responds in prayer, and Christ’s Gospel is announced as the high point.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      If you learn to follow the readings, three things happen over time:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        You start to recognize the story of salvation, not just isolated texts.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        You arrive at Mass prepared—listening with attention instead of surprise.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Your daily prayer becomes simpler because the Church already gives you a structure.
      </li>
    </ul>

    <h2 id="sec-2" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      First Reading: what it is and how to listen
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The <strong class="text-gray-900 font-semibold">First Reading</strong> is usually taken from the Old Testament (with exceptions during Easter, when it often comes from Acts).
      It teaches you how God prepared the world for Christ: His promises, His covenant, His commandments, and His patience with His people.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      A simple way to listen:
    </p>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Identify the main movement: promise, warning, deliverance, wisdom, or prophecy.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Ask: <strong class="text-gray-900 font-semibold">What does this reveal about God’s character?</strong>
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Notice connections: very often the First Reading “sets the stage” for the Gospel.
      </li>
    </ol>

    <h2 id="sec-3" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Responsorial Psalm: the Church’s response
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The <strong class="text-gray-900 font-semibold">Responsorial Psalm</strong> is not a “musical break.”
      It is Scripture, prayed out loud. The Church hears God’s Word and responds with God’s Word—praise, repentance, trust, longing, thanksgiving.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      If you struggle to pray spontaneously, the Psalm teaches you a mature spiritual language.
      Here is a practical way to follow it:
    </p>

    <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Repeat the refrain slowly as your personal prayer.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Notice the emotion (joy, fear, sorrow, confidence) and bring that honestly to God.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Choose one line that feels like your “answer” for today.
      </li>
    </ul>

    <h2 id="sec-4" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Second Reading: why it appears (mostly Sundays)
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The <strong class="text-gray-900 font-semibold">Second Reading</strong> appears most often on Sundays and major solemnities.
      It is usually taken from the New Testament Letters (like Romans, Corinthians, Ephesians) or the Book of Revelation.
      While the First Reading often prepares a theme for the Gospel, the Second Reading frequently forms Christian life: faith, charity, moral teaching, perseverance, the life of grace.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      When you listen, ask one question:
      <strong class="text-gray-900 font-semibold">What does this teach the Church to live?</strong>
      It is often very practical: forgiveness, unity, courage, holiness, patience, prayer.
    </p>

    <h2 id="sec-5" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Gospel: the summit of the Liturgy of the Word
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The <strong class="text-gray-900 font-semibold">Gospel</strong> is the high point because it proclaims the words and deeds of Jesus.
      This is why the Church stands, sings an Alleluia (or another acclamation in Lent), and honors the Gospel with special reverence.
      In the Gospel, we meet Christ speaking now.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      If you want a simple way to follow the Gospel:
    </p>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Identify the main action of Jesus: teaching, healing, calling, correcting, forgiving, revealing.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Listen for one sentence that feels like a direct address to you today.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        Ask: <strong class="text-gray-900 font-semibold">What response is Jesus inviting?</strong> Trust, repentance, courage, mercy, obedience.
      </li>
    </ol>

    <h2 id="sec-6" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      A simple method to follow the readings day by day
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      You do not need a complicated plan. You need a small routine that you can keep—even on tired days.
      Here is a method that works for Daily Mass readings and also prepares you for Sunday:
    </p>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Start with the Gospel.</strong> Read it slowly once.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Pray the Psalm.</strong> Use the refrain as your personal response.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Read the First Reading.</strong> Look for how it “echoes” or prepares the Gospel.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">Choose one line to carry.</strong> Write it down or repeat it during the day.
      </li>
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <strong class="text-gray-900 font-semibold">End with one specific request.</strong> Ask for one grace you need today.
      </li>
    </ol>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      If you only have three minutes, do: Gospel + one Psalm refrain + a short prayer.
      The goal is not to do “a lot.” The goal is to keep showing up.
    </p>

    <h2 id="sec-7" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      FAQs: Mass readings
    </h2>

    <ol class="my-5 pl-6 list-decimal space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Why is the First Reading often from the Old Testament?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Because it reveals God’s promises and preparation for Christ. It helps you read the Gospel with deeper understanding.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Is the Psalm really a “reading”?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Yes. The Responsorial Psalm is Scripture and a key part of the Liturgy of the Word—proclaimed and prayed by the whole assembly.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">Why is there sometimes no Second Reading on weekdays?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Weekday Mass usually has a simpler structure (First Reading, Psalm, Gospel). Sundays and solemnities include a fuller set of readings.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">What if I do not understand the readings?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Start with one clear line, ask God for light, and keep going day by day. Understanding grows with repetition and prayer.
          </li>
        </ul>
      </li>

      <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
        <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
          <strong class="text-gray-900 font-semibold">What is the best reading to start with if I have little time?</strong>
        </p>
        <ul class="my-5 pl-6 list-disc space-y-2 text-[17px] leading-[1.95] text-gray-700 break-words">
          <li class="text-[17px] leading-[1.95] text-gray-700 break-words">
            Start with the Gospel. Then pray the Psalm refrain. That alone can anchor your day and prepare you for Mass.
          </li>
        </ul>
      </li>
    </ol>

    <h2 id="sec-8" class="mt-14 mb-6 pl-4 text-xl sm:text-2xl font-bold text-gray-800 border-l-4 border-amber-300 leading-snug scroll-mt-28">
      Conclusion
    </h2>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      The Mass readings are a gift: God speaks, the Church responds, and Christ’s Gospel stands at the center.
      If you learn to follow the First Reading, Psalm, and Gospel with a simple routine, the Liturgy of the Word becomes clearer—and your faith becomes steadier.
      Start small, stay faithful, and let the Word of God shape your days.
    </p>

    <p class="my-5 text-[17px] leading-[1.95] text-gray-700 break-words">
      [SEO]
      {
        &quot;keywords&quot;: [
          &quot;mass readings&quot;,
          &quot;daily mass readings&quot;,
          &quot;first reading responsorial psalm gospel&quot;,
          &quot;liturgy of the word&quot;,
          &quot;catholic mass readings explained&quot;,
          &quot;how to follow mass readings&quot;,
          &quot;lectionary guide&quot;,
          &quot;prepare for mass&quot;
        ],
        &quot;metaDescription&quot;: &quot;Mass Readings Guide: learn what the First Reading, Responsorial Psalm, Second Reading, and Gospel mean—and a simple way to follow the Daily Mass readings day by day.&quot;
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
