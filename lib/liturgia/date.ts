// lib/liturgia/date.ts

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function slugFromDate(d: Date) {
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function parseSlugDate(slug: string) {
  const [dd, mm, yyyy] = slug.split("-").map((x) => parseInt(x, 10));
  if (!dd || !mm || !yyyy) return null;
  const dt = new Date(yyyy, mm - 1, dd);
  if (dt.getFullYear() !== yyyy || dt.getMonth() !== mm - 1 || dt.getDate() !== dd) return null;
  return dt;
}

export function displayBR(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function weekdayPT(d: Date) {
  return d.toLocaleDateString("pt-BR", { weekday: "long" });
}

export function monthLabelPT(year: number, month1to12: number) {
  return new Date(year, month1to12 - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export function daysInMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0).getDate();
}
