import Link from "next/link";
import AdSensePro from "./adsensePro";

/**
 * Footer (Server Component)
 * - Visual/UX: grid responsivo, hierarquia clara, CTAs úteis
 * - SEO: links internos para hubs importantes + âncoras descritivas + navegação semântica
 * - Datas: calculadas na timezone America/Sao_Paulo para evitar “dia errado” quando o server roda em UTC
 */

function getSaoPauloYMD(): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    y: Number(map.year),
    m: Number(map.month),
    d: Number(map.day),
  };
}

function addDays(y: number, m: number, d: number, offset: number) {
  // Usando Date em UTC para somar dias com estabilidade.
  const base = new Date(Date.UTC(y, m - 1, d));
  base.setUTCDate(base.getUTCDate() + offset);
  return {
    y: base.getUTCFullYear(),
    m: base.getUTCMonth() + 1,
    d: base.getUTCDate(),
  };
}

function toSlug(y: number, m: number, d: number) {
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${dd}-${mm}-${y}`;
}

function prettyPtBr(y: number, m: number, d: number) {
  const dt = new Date(Date.UTC(y, m - 1, d, 12)); // “meio-dia” para evitar virar dia em TZs
  const label = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(dt);

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function Footer() {
  const { y, m, d } = getSaoPauloYMD();

  const yesterday = addDays(y, m, d, -1);
  const tomorrow = addDays(y, m, d, 1);

  const yesterdaySlug = toSlug(yesterday.y, yesterday.m, yesterday.d);
  const tomorrowSlug = toSlug(tomorrow.y, tomorrow.m, tomorrow.d);

  const yearNow = y;

  return (
    <>
      {/* Monetização fora do footer semântico */}
      <div className="mt-8">
         <AdSensePro slot="9591116531" height={140} />
      </div>

      <footer className="mt-10 border-t border-amber-200 bg-amber-50/80">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {/* Top strip (CTA) */}
          <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-white/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-base font-semibold text-gray-900">
                Acompanhe a Liturgia Diária e reze com a Igreja
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Leituras, Salmo, Evangelho e orações — organizados para leitura no celular.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/liturgia-diaria"
                className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="Abrir a Liturgia de Hoje"
                title="Liturgia de Hoje"
              >
                Liturgia de Hoje
              </Link>

              <Link
                href={`/liturgia-diaria/${tomorrowSlug}`}
                className="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="Abrir a Liturgia de Amanhã"
                title={`Amanhã: ${prettyPtBr(tomorrow.y, tomorrow.m, tomorrow.d)}`}
              >
                Amanhã
              </Link>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid gap-8 md:grid-cols-12">
            {/* Brand / About */}
            <section className="md:col-span-5">
              <Link href="/" className="inline-flex items-center gap-3" aria-label="Ir para a página inicial">
                <div className="h-11 w-11 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
                  {/* Se você já tem o logo em /images/ben-transparente.png, mantenha assim */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/ben-transparente.png"
                    alt="IA Tio Ben"
                    className="h-full w-full object-contain p-1"
                    loading="lazy"
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-lg font-extrabold text-amber-900">IA Tio Ben</p>
                  <p className="text-xs text-gray-600">Liturgia, santos e formação católica</p>
                </div>
              </Link>

              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                Conteúdo católico organizado para apoiar sua oração diária: Liturgia, Evangelho do dia,
                Santo Terço e artigos de formação.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/blog"
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-50"
                  aria-label="Acessar o Blog IA Tio Ben"
                >
                  Blog
                </Link>
                <Link
                  href="/santo-terco"
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-50"
                  aria-label="Acessar o Santo Terço"
                >
                  Santo Terço
                </Link>
                <Link
                  href="/liturgia-diaria"
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-50"
                  aria-label="Acessar a Liturgia Diária"
                >
                  Liturgia
                </Link>
              </div>
            </section>

            {/* Liturgia navigation */}
            <nav className="md:col-span-4" aria-label="Navegação da Liturgia">
              <h3 className="text-sm font-extrabold tracking-wide text-gray-900">
                Liturgia Diária
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Acesse rapidamente as datas mais úteis para acompanhar o ciclo.
              </p>

              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    href={`/liturgia-diaria/${yesterdaySlug}`}
                    className="group inline-flex w-full items-center justify-between rounded-xl border border-amber-200 bg-white px-3 py-2 shadow-sm transition hover:bg-amber-50"
                    aria-label="Abrir a Liturgia de Ontem"
                    title={`Ontem: ${prettyPtBr(yesterday.y, yesterday.m, yesterday.d)}`}
                  >
                    <span className="font-semibold text-amber-900">Ontem</span>
                    <span className="text-xs text-gray-600 group-hover:text-gray-700">
                      {prettyPtBr(yesterday.y, yesterday.m, yesterday.d)}
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/liturgia-diaria"
                    className="group inline-flex w-full items-center justify-between rounded-xl border border-amber-300 bg-amber-100/70 px-3 py-2 shadow-sm transition hover:bg-amber-100"
                    aria-label="Abrir a Liturgia de Hoje"
                    title="Liturgia de Hoje"
                  >
                    <span className="font-extrabold text-amber-900">Hoje</span>
                    <span className="text-xs text-gray-700">Abrir agora</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href={`/liturgia-diaria/${tomorrowSlug}`}
                    className="group inline-flex w-full items-center justify-between rounded-xl border border-amber-200 bg-white px-3 py-2 shadow-sm transition hover:bg-amber-50"
                    aria-label="Abrir a Liturgia de Amanhã"
                    title={`Amanhã: ${prettyPtBr(tomorrow.y, tomorrow.m, tomorrow.d)}`}
                  >
                    <span className="font-semibold text-amber-900">Amanhã</span>
                    <span className="text-xs text-gray-600 group-hover:text-gray-700">
                      {prettyPtBr(tomorrow.y, tomorrow.m, tomorrow.d)}
                    </span>
                  </Link>
                </li>
              </ul>

              <div className="mt-4 text-sm">
                <Link
                  href="/liturgia-diaria"
                  className="inline-flex items-center gap-2 font-semibold text-blue-800 hover:underline"
                  aria-label="Ver Liturgia Diária (página principal)"
                >
                  Ver página principal da Liturgia
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </nav>

            {/* Links úteis / SEO hubs */}
            <nav className="md:col-span-3" aria-label="Links úteis">
              <h3 className="text-sm font-extrabold tracking-wide text-gray-900">
                Conteúdo
              </h3>

              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-800 hover:text-amber-900 hover:underline"
                    aria-label="Ir para o Blog IA Tio Ben"
                  >
                    Artigos e Formação (Blog)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/santo-terco"
                    className="text-gray-800 hover:text-amber-900 hover:underline"
                    aria-label="Ir para a página do Santo Terço"
                  >
                    Santo Terço (oração guiada)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-gray-800 hover:text-amber-900 hover:underline"
                    aria-label="Voltar para a página inicial"
                  >
                    Página inicial
                  </Link>
                </li>
                <li>
                  <Link
                    href="/termo-de-responsabilidade"
                    className="text-gray-800 hover:text-amber-900 hover:underline"
                    aria-label="Abrir o Termo de Responsabilidade"
                  >
                    Termo de responsabilidade
                  </Link>
                </li>
              </ul>

              {/* Social (nofollow, abre em nova aba) */}
              <div className="mt-6">
                <h4 className="text-sm font-extrabold tracking-wide text-gray-900">
                  Comunidade
                </h4>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <a
                    href="https://www.instagram.com/acampabento"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center justify-between rounded-xl border border-amber-200 bg-white px-3 py-2 shadow-sm transition hover:bg-amber-50"
                    aria-label="Instagram do AcampaBento"
                  >
                    <span className="font-semibold text-amber-900">AcampaBento</span>
                    <span className="text-xs text-gray-600">@acampabento</span>
                  </a>

                  <a
                    href="https://www.instagram.com/saopedropp.paroquia/"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center justify-between rounded-xl border border-amber-200 bg-white px-3 py-2 shadow-sm transition hover:bg-amber-50"
                    aria-label="Instagram da Paróquia São Pedro"
                  >
                    <span className="font-semibold text-amber-900">Paróquia São Pedro</span>
                    <span className="text-xs text-gray-600">@saopedropp.paroquia</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col gap-3 border-t border-amber-200 pt-6 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {yearNow} <span className="font-semibold text-amber-900">IA Tio Ben</span>. Todos os direitos reservados.
            </p>

            <p className="text-gray-600">
              Desenvolvido por{" "}
              <a
                href="https://4udevelops.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-800 hover:underline"
                aria-label="Abrir o site da 4U Develops em nova aba"
              >
                4U Develops
              </a>
            </p>
          </div>

          {/* Placeholder Ezoic (mantido como você já usa) */}
          <div id="ezoic-pub-ad-placeholder-103" className="mt-4" />
        </div>
      </footer>
    </>
  );
}
