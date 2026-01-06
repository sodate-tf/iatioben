// components/aside/AsideIATioBen.tsx
import Link from "next/link";
import Image from "next/image";

export default function AsideIATioBen() {
  return (
    <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow">
          <Image
            src="/logo-tio-ben.png"
            alt="IA Tio Ben"
            width={32}
            height={32}
          />
        </div>

        <div>
          <h3 className="font-extrabold text-amber-900">
            IA do Tio Ben
          </h3>
          <p className="text-xs text-amber-800">
            Conversa católica com propósito
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-amber-900">
        Tire dúvidas, reflita o Evangelho do dia e receba ajuda para rezar com mais
        constância.
      </p>

      <Link
        href="/ia"
        className="mt-3 block rounded-xl bg-amber-600 px-4 py-2 text-center text-sm font-bold text-white hover:bg-amber-700"
      >
        Conversar com o Tio Ben
      </Link>
    </aside>
  );
}
