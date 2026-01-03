"use client";

import React from "react";
import type { RosaryStep } from "./RosaryEngine";

export default function RosaryProgress({
  steps,
  current,
}: {
  steps: RosaryStep[];
  current: number;
}) {
  const step = steps[current];
  const base = `Passo ${current + 1}/${steps.length}`;

  if (step.phase === "opening") return <span>{base} • Abertura</span>;
  if (step.phase === "closing") return <span>{base} • Encerramento</span>;

  const dec = step.decadeIndex ?? 1;
  const bead = step.beadInDecade;

  if (bead) return <span>{base} • Dezena {dec}/5 • Ave-Maria {bead}/10</span>;
  return <span>{base} • Dezena {dec}/5</span>;
}
