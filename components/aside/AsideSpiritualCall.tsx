// components/aside/AsideSpiritualCall.tsx
import Link from "next/link";
import { BookOpen, CircleDashed } from "lucide-react";

export default function AsideSpiritualCall() {
  return (
    <aside className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-3">
      <h3 className="text-sm font-bold uppercase text-muted-foreground">
        Caminho de oração
      </h3>

      <p className="text-sm text-gray-700">
        Continue seu momento com Deus através da Palavra e da oração.
      </p>

      <div className="flex flex-col gap-2">
        <Link
          href="/liturgia-diaria"
          className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          <BookOpen size={16} />
          Ler a Liturgia de Hoje
        </Link>

        <Link
          href="/santo-terco/como-rezar-o-terco"
          className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          <CircleDashed size={16} />
          Rezar o Terço
        </Link>
      </div>
    </aside>
  );
}
