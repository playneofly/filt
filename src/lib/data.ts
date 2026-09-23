export type Protocol = "VLESS" | "VMess" | "Trojan" | "Shadowsocks" | "Hysteria2" | "WireGuard";

export interface Server {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  protocol: Protocol;
  network: string;
  tls: string;
  basePing: number;
  group: string;
  favorite?: boolean;
  load: number; // 0..1
}

export const GROUPS = [
  { id: "all", label: "همه" },
  { id: "fav", label: "برگزیده" },
  { id: "main", label: "ساب اصلی" },
  { id: "backup", label: "ساب پشتیبان" },
  { id: "manual", label: "دستی" },
];

export const SERVERS: Server[] = [
  { id: "s1", name: "Frankfurt Edge 01", city: "فرانکفورت", country: "آلمان", flag: "🇩🇪", protocol: "VLESS", network: "WS", tls: "Reality", basePing: 42, group: "main", favorite: true, load: 0.32 },
  { id: "s2", name: "Amsterdam Core", city: "آمستردام", country: "هلند", flag: "🇳🇱", protocol: "VLESS", network: "gRPC", tls: "TLS", basePing: 58, group: "main", favorite: true, load: 0.51 },
  { id: "s3", name: "Istanbul Relay", city: "استانبول", country: "ترکیه", flag: "🇹🇷", protocol: "Trojan", network: "TCP", tls: "TLS", basePing: 31, group: "main", load: 0.74 },
  { id: "s4", name: "Dubai Gateway", city: "دبی", country: "امارات", flag: "🇦🇪", protocol: "Hysteria2", network: "QUIC", tls: "TLS", basePing: 39, group: "main", load: 0.28 },
  { id: "s5", name: "Paris Node", city: "پاریس", country: "فرانسه", flag: "🇫🇷", protocol: "VMess", network: "WS", tls: "TLS", basePing: 74, group: "main", load: 0.44 },
  { id: "s6", name: "London Bridge", city: "لندن", country: "بریتانیا", flag: "🇬🇧", protocol: "VLESS", network: "WS", tls: "Reality", basePing: 88, group: "backup", load: 0.61 },
  { id: "s7", name: "Stockholm Ice", city: "استکهلم", country: "سوئد", flag: "🇸🇪", protocol: "WireGuard", network: "UDP", tls: "—", basePing: 96, group: "backup", load: 0.19 },
  { id: "s8", name: "Warsaw Fast", city: "ورشو", country: "لهستان", flag: "🇵🇱", protocol: "Shadowsocks", network: "TCP", tls: "—", basePing: 67, group: "backup", load: 0.55 },
  { id: "s9", name: "Zurich Secure", city: "زوریخ", country: "سوئیس", flag: "🇨🇭", protocol: "VLESS", network: "gRPC", tls: "Reality", basePing: 62, group: "main", load: 0.23 },
  { id: "s10", name: "Singapore Asia", city: "سنگاپور", country: "سنگاپور", flag: "🇸🇬", protocol: "VLESS", network: "WS", tls: "TLS", basePing: 186, group: "backup", load: 0.67 },
  { id: "s11", name: "Tokyo Sakura", city: "توکیو", country: "ژاپن", flag: "🇯🇵", protocol: "Hysteria2", network: "QUIC", tls: "TLS", basePing: 212, group: "backup", load: 0.38 },
  { id: "s12", name: "Virginia US-East", city: "ویرجینیا", country: "آمریکا", flag: "🇺🇸", protocol: "VMess", network: "WS", tls: "TLS", basePing: 168, group: "manual", load: 0.72 },
  { id: "s13", name: "Toronto Maple", city: "تورنتو", country: "کانادا", flag: "🇨🇦", protocol: "Trojan", network: "TCP", tls: "TLS", basePing: 154, group: "manual", load: 0.46 },
  { id: "s14", name: "Helsinki Aurora", city: "هلسینکی", country: "فنلاند", flag: "🇫🇮", protocol: "VLESS", network: "gRPC", tls: "Reality", basePing: 79, group: "manual", favorite: true, load: 0.15 },
];

export const PALETTES = [
  { id: "neon", label: "نئون", a: "#8b5cff", b: "#22d3ee" },
  { id: "ocean", label: "اقیانوس", a: "#3b82f6", b: "#22d3ee" },
  { id: "amoled", label: "آمولد", a: "#00e5a0", b: "#00c2ff" },
  { id: "sunset", label: "غروب", a: "#ff5c7c", b: "#ffb347" },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"];

export function pingTone(ms: number | null) {
  if (ms === null) return { color: "var(--muted)", bars: 0, label: "—" };
  if (ms < 70) return { color: "var(--ok)", bars: 4, label: "عالی" };
  if (ms < 140) return { color: "#8fe36b", bars: 3, label: "خوب" };
  if (ms < 260) return { color: "var(--warn)", bars: 2, label: "متوسط" };
  return { color: "var(--bad)", bars: 1, label: "ضعیف" };
}

export function fmtSpeed(bytesPerSec: number) {
  if (bytesPerSec >= 1024 * 1024) return { v: (bytesPerSec / 1048576).toFixed(1), u: "MB/s" };
  if (bytesPerSec >= 1024) return { v: (bytesPerSec / 1024).toFixed(0), u: "KB/s" };
  return { v: String(Math.round(bytesPerSec)), u: "B/s" };
}

export function fmtBytes(b: number) {
  if (b >= 1024 ** 3) return `${(b / 1024 ** 3).toFixed(2)} GB`;
  if (b >= 1024 ** 2) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  if (b >= 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${b} B`;
}

export const WEEK = [
  { d: "شنبه", down: 2.1, up: 0.4 },
  { d: "یکشنبه", down: 3.4, up: 0.7 },
  { d: "دوشنبه", down: 1.2, up: 0.3 },
  { d: "سه‌شنبه", down: 4.8, up: 1.1 },
  { d: "چهارشنبه", down: 3.9, up: 0.9 },
  { d: "پنجشنبه", down: 6.2, up: 1.4 },
  { d: "جمعه", down: 5.1, up: 1.0 },
];
