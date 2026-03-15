export function parseDateRange(dateStr) {
  const normalized = String(dateStr).replace(/%/g, "").trim();
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, y, m, d] = match;
  return {
    start: new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0),
    end: new Date(Number(y), Number(m) - 1, Number(d), 23, 59, 59, 999),
  };
}
