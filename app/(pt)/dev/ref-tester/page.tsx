"use client";

import React, { useMemo, useState } from "react";
import { buildBibleGatewayUrl, normalizeRefForGateway } from "@/lib/liturgia/refValidator";

export default function RefTesterPage() {
  const [input, setInput] = useState(
    "Lc 24, 1-12\nGn 22, 1-2. 9a. 10-13. 15-18\nSl 103\nEx 14, 15–15, 1"
  );

  const refs = useMemo(() => {
    return input
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((ref) => ({
        ref,
        query: normalizeRefForGateway(ref),
        url: buildBibleGatewayUrl(ref, "NRSVCE"),
      }));
  }, [input]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 bg-white text-slate-900 min-h-screen">
      <h1 className="text-2xl font-extrabold">Reference Tester (PT → EN validation)</h1>
      <p className="mt-2 text-sm text-slate-600">
        Cole referências (uma por linha). O sistema normaliza e gera a URL do BibleGateway (NRSVCE).
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mt-4 w-full min-h-[160px] rounded-xl border border-slate-200 p-3 text-sm font-mono"
      />

      <div className="mt-6 space-y-3">
        {refs.map((x) => (
          <div key={x.ref} className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-bold">{x.ref}</div>
            <div className="mt-1 text-xs text-slate-600">
              Query: <span className="font-mono">{x.query || "—"}</span>
            </div>

            {x.url ? (
              <a
                href={x.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                Abrir no BibleGateway
              </a>
            ) : (
              <div className="mt-3 text-xs text-red-600">Não foi possível gerar URL.</div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
