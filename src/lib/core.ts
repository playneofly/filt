export type ConnState = "off" | "connecting" | "on";

export interface Server {
  id: string;
  country: string;
  city: string;
  code: string;
  ping: number;
  load: number; // 0..100
  premium?: boolean;
  gradient: string; // avatar gradient
  best?: boolean;
}

export const SERVERS: Server[] = [
  { id: "de-1", country: "آلمان", city: "فرانکفورت", code: "DE", ping: 43, load: 32, best: true, gradient: "from-[#4a6cf7] to-[#8b5cf6]" },
  { id: "nl-1", country: "هلند", city: "آمستردام", code: "NL", ping: 51, load: 44, gradient: "from-[#f77062] to-[#fe5196]" },
  { id: "fr-1", country: "فرانسه", city: "پاریس", code: "FR", ping: 58, load: 27, gradient: "from-[#36d1dc] to-[#5b86e5]" },
  { id: "uk-1", country: "انگلیس", city: "لندن", code: "GB", ping: 66, load: 61, gradient: "from-[#7f7fd5] to-[#91eae4]" },
  { id: "sg-1", country: "سنگاپور", city: "سنگاپور", code: "SG", ping: 89, load: 38, premium: true, gradient: "from-[#43cea2] to-[#185a9d]" },
  { id: "jp-1", country: "ژاپن", city: "توکیو", code: "JP", ping: 104, load: 22, premium: true, gradient: "from-[#ff9a9e] to-[#fad0c4]" },
  { id: "tr-1", country: "ترکیه", city: "استانبول", code: "TR", ping: 72, load: 54, gradient: "from-[#f6d365] to-[#fda085]" },
  { id: "us-1", country: "آمریکا", city: "نیویورک", code: "US", ping: 128, load: 47, premium: true, gradient: "from-[#a18cd1] to-[#fbc2eb]" },
  { id: "ae-1", country: "امارات", city: "دبی", code: "AE", ping: 61, load: 35, gradient: "from-[#84fab0] to-[#8fd3f4]" },
  { id: "fi-1", country: "فنلاند", city: "هلسینکی", code: "FI", ping: 79, load: 18, gradient: "from-[#89f7fe] to-[#66a6ff]" },
];

export const faDigits = (v: string | number): string =>
  String(v).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const faTime = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return faDigits(`${pad(h)}:${pad(m)}:${pad(s)}`);
};

export const pingQuality = (ping: number): { label: string; bars: 2 | 3 | 4; tone: "good" | "mid" | "bad" } => {
  if (ping < 60) return { label: "عالی", bars: 4, tone: "good" };
  if (ping < 100) return { label: "خوب", bars: 3, tone: "mid" };
  return { label: "معمولی", bars: 2, tone: "bad" };
};

export const toneClasses: Record<string, string> = {
  good: "text-mint",
  mid: "text-amber-soft",
  bad: "text-rose-soft",
};

export interface WeekStat {
  day: string;
  value: number; // GB
}

export const WEEK: WeekStat[] = [
  { day: "ش", value: 2.4 },
  { day: "ی", value: 3.8 },
  { day: "د", value: 1.9 },
  { day: "س", value: 4.6 },
  { day: "چ", value: 3.1 },
  { day: "پ", value: 5.2 },
  { day: "ج", value: 2.7 },
];
