// components/terco/rosaryEngine.ts
import type { MysterySetKey, PrayerKey } from "./RosaryDataset";

export type RosaryMode = "full" | "single";

export type RosaryStep = {
  index: number;
  kind: "bead" | "spacer";
  prayer: PrayerKey;
  label: string;

  phase: "opening" | "decade" | "closing";

  decadeIndex?: 1 | 2 | 3 | 4 | 5;
  beadInDecade?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  mysteryIndex?: 1 | 2 | 3 | 4 | 5;

  beadStyle?: "cross" | "knot" | "normal";
};

type BuildArgs = {
  set: MysterySetKey;
  mode: RosaryMode;
  singleMysteryIndex?: 1 | 2 | 3 | 4 | 5;
  includeClosing?: boolean;
};

export function buildRosarySteps(args: BuildArgs): RosaryStep[] {
  const { mode, singleMysteryIndex = 1, includeClosing = true } = args;

  const steps: RosaryStep[] = [];
  let i = 0;

  const push = (s: Omit<RosaryStep, "index">) =>
    steps.push({ index: i++, ...s });

  // ABERTURA - unificada
  push({
    kind: "bead",
    prayer: "openingBundle",
    label: "Oração Inicial (Sinal da Cruz + Credo + Oferecimento)",
    phase: "opening",
    beadStyle: "cross",
  });

  // 3 Ave-Marias (Fé, Esperança, Caridade)
  push({
    kind: "bead",
    prayer: "hailMary",
    label: "Ave-Maria 1/3 (Pedir Fé viva)",
    phase: "opening",
  });
  push({
    kind: "bead",
    prayer: "hailMary",
    label: "Ave-Maria 2/3 (Pedir Esperança firme)",
    phase: "opening",
  });
  push({
    kind: "bead",
    prayer: "hailMary",
    label: "Ave-Maria 3/3 (Pedir Caridade ardente)",
    phase: "opening",
  });

  // Glória + Fátima (Abertura) — fica bonito como “nó”
  push({
    kind: "bead",
    prayer: "gloryFatima",
    label: "Glória + Oração de Fátima (Abertura)",
    phase: "opening",
    beadStyle: "knot",
  });

  // Dezenas (sem Pai-Nosso duplicado!)
  const decades: (1 | 2 | 3 | 4 | 5)[] =
    mode === "single" ? [singleMysteryIndex] : [1, 2, 3, 4, 5];

  for (const dec of decades) {
    // Pai-Nosso da Dezena (este é o “primeiro Pai-Nosso” do terço)
    push({
      kind: "bead",
      prayer: "ourFather",
      label: `Pai-Nosso (Dezena ${dec})`,
      phase: "decade",
      decadeIndex: dec,
      mysteryIndex: dec,
    });

    // 10 Ave-Marias
    for (let b = 1; b <= 10; b++) {
      push({
        kind: "bead",
        prayer: "hailMary",
        label: `Ave-Maria ${b}/10 (Dezena ${dec})`,
        phase: "decade",
        decadeIndex: dec,
        beadInDecade: b as any,
        mysteryIndex: dec,
      });
    }

    // Glória + Fátima (unidos em 1 conta)
    push({
      kind: "bead",
      prayer: "gloryFatima",
      label: `Glória + Oração de Fátima (Dezena ${dec})`,
      phase: "decade",
      decadeIndex: dec,
      mysteryIndex: dec,
      beadStyle: "knot",
    });

    push({
      kind: "spacer",
      prayer: "ourFather",
      label: "Separador",
      phase: "decade",
    });
  }

  // Encerramento
  if (includeClosing) {
    push({
      kind: "bead",
      prayer: "hailHolyQueen",
      label: "Salve Rainha",
      phase: "closing",
    });
    push({
      kind: "bead",
      prayer: "finalPrayer",
      label: "Oração Final",
      phase: "closing",
    });
  }

  return steps;
}
