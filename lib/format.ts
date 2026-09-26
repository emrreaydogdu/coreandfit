const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

const parse = (value: string) => new Date(value.length === 10 ? `${value}T12:00:00` : value);

// "2026-09-12" → "12.09.2026"
export const formatDateShort = (value: string) => {
  if (!value) return "";
  const d = parse(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

// "2026-09-26" → "26 Eylül Cumartesi"
export const formatDateLong = (value: string) => {
  if (!value) return "";
  const d = parse(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${DAYS[d.getDay()]}`;
};

// "2026-09-26" → "26 Eylül 2026"
export const formatDateMedium = (value: string) => {
  if (!value) return "";
  const d = parse(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};
