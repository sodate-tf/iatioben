import type { MysterySetKey } from "@/components/terco/RosaryDataset";

export type TipoSlug =
  | "misterios-gozosos"
  | "misterios-dolorosos"
  | "misterios-gloriosos"
  | "misterios-luminosos";

export const TIPOS: TipoSlug[] = [
  "misterios-gozosos",
  "misterios-dolorosos",
  "misterios-gloriosos",
  "misterios-luminosos",
];

export function mapSlugToSetKey(slug: TipoSlug): MysterySetKey {
  switch (slug) {
    case "misterios-gozosos":
      return "gozosos";
    case "misterios-dolorosos":
      return "dolorosos";
    case "misterios-gloriosos":
      return "gloriosos";
    case "misterios-luminosos":
    default:
      return "luminosos";
  }
}

export function labelFromSlug(slug: TipoSlug) {
  switch (slug) {
    case "misterios-gozosos":
      return "Mistérios Gozosos";
    case "misterios-dolorosos":
      return "Mistérios Dolorosos";
    case "misterios-gloriosos":
      return "Mistérios Gloriosos";
    case "misterios-luminosos":
    default:
      return "Mistérios Luminosos";
  }
}
