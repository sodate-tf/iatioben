import Link from "next/link";
import AdSense from "./Adsense";

export default function Footer() {
  // 📅 Calcular as datas de -2 a +2 dias
  const today = new Date();
  const days = [-2, -1, 0, 1, 2];

  const liturgias = days.map((offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    const slug = `${dd}-${mm}-${yyyy}`;
    const label = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    }).format(date);

    return {
      slug,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      url: `/liturgia-diaria/${slug}`,
    };
  });

  return (
    <>
      <AdSense adSlot="9591116531" />
      <footer className="bg-amber-100 text-center py-6 mt-8 border-t border-amber-200">
        <nav className="mb-3">
          <h3 className="text-gray-800 font-semibold mb-2">
            📖 Liturgias Recentes
          </h3>
          <ul className="flex flex-wrap justify-center gap-3 text-sm text-blue-800">
            {liturgias.map((item) => (
              <li key={item.slug}>
                <Link href={item.url} about={`Liturgia diária de ${item.label}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="my-3">
          <Link
            href="/blog"
            className="text-blue-700 font-medium hover:underline"
            about="Acesse o Blog IA Tio Ben"
          >
            📰 Blog IA Tio Ben
          </Link>
        </div>

        <div className="text-sm text-gray-600 mt-2 space-y-1">
          <Link
            href="https://www.iatioben.com.br/termo-de-responsabilidade"
            target="_blank"
            about="Termo de responsabilidade do site iaTioBen.com.br"
            className="block hover:underline"
          >
            Termo de responsabilidade
          </Link>

          <p>
            Desenvolvido por{" "}
            <Link
              href="https://4udevelops.com.br"
              target="_blank"
              about="Desenvolvido por 4U Develops"
              className="text-blue-700 hover:underline"
            >
              4U Develops
            </Link>{" "}
            — Todos os direitos reservados
          </p>
        </div>

        <div id="ezoic-pub-ad-placeholder-103" className="mt-4" />
      </footer>
    </>
  );
}
