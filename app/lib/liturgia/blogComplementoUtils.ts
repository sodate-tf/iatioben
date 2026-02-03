// src/lib/liturgia/blogComplementoUtils.ts

import { liturgiaBlogComplementos } from "./liturgiaBlogComplementos";

export function slugifyBlogTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getBlogComplementByDateISO(dateISO: string) {
  return liturgiaBlogComplementos.find(
    (item) => item.dateISO === dateISO
  );
}
