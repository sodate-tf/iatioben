// lib/date/format-en.ts
export function formatEnglishLongFromISO(dateISO: string) {
  // dateISO: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) return null;

  const [y, m, d] = dateISO.split("-").map(Number);

  // meio-dia local evita shift UTC
  const dt = new Date(y, m - 1, d, 12, 0, 0);

  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Sao_Paulo", // garante consistência
  });
}
