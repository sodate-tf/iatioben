// components/liturgia/LiturgiaDatePickerJump.tsx
"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function slugFromISO(iso: string) {
  const [yyyy, mm, dd] = iso.split("-").map((x) => parseInt(x, 10));
  if (!yyyy || !mm || !dd) return null;
  return `${pad2(dd)}-${pad2(mm)}-${yyyy}`;
}

export default function LiturgiaDatePickerJump({ className }: { className?: string }) {
  const router = useRouter();

  const todayISO = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = pad2(d.getMonth() + 1);
    const dd = pad2(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [value, setValue] = useState(todayISO);

  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
        Escolher uma data
      </label>

      <div className="flex gap-2">
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={() => {
            const slug = slugFromISO(value);
            if (!slug) return;
            router.push(`/liturgia-diaria/${slug}`);
          }}
          className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90"
        >
          Ir
        </button>
      </div>
    </div>
  );
}
