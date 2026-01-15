// components/home/HomeHero.tsx
import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="bg-gradient-to-b from-amber-200 to-amber-400">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 text-center">
        {/* IMAGEM LCP: detectável imediatamente + prioridade alta */}
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

        {/* H1 SEO (sem emoji) */}
        <h1 className="mt-6 text-2xl md:text-4xl font-extrabold text-amber-900 tracking-tight">
          IA Tio Ben: Liturgia Diária, Evangelho do Dia e Reflexões Católicas
        </h1>

        <p className="mt-3 text-gray-800 text-base md:text-lg leading-relaxed">
          Faça uma pergunta sobre fé, liturgia, Evangelho, oração e vida espiritual.
          Acompanhe também a Liturgia Diária e conteúdos de formação católica.
        </p>

        {/* Links internos (SEO + UX) */}
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
    </section>
  );
}
