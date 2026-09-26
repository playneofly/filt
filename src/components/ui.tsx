import { Signal, Wifi, BatteryMedium } from "lucide-react";

/* ---------------- phone status bar (mock) ---------------- */
export function StatusBar({ dark }: { dark: boolean }) {
  return (
    <div
      dir="ltr"
      className={`flex items-center justify-between px-7 pt-4 pb-1 text-[11px] font-semibold ${
        dark ? "text-slate-200" : "text-slate-800"
      }`}
    >
      <span className="font-latin tracking-wide">09:41</span>
      <div className="flex items-center gap-1.5 opacity-80">
        <Signal size={13} strokeWidth={2.4} />
        <Wifi size={13} strokeWidth={2.4} />
        <BatteryMedium size={15} strokeWidth={2.2} />
      </div>
    </div>
  );
}

/* ---------------- iOS style switch ---------------- */
export function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
        on ? "bg-gradient-to-l from-accent to-accent-2" : "bg-slate-300/70 dark:bg-white/12"
      }`}
    >
      <span
        className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.28)] transition-all duration-300 ${
          on ? "right-[22px]" : "right-[3px]"
        }`}
      />
    </button>
  );
}

/* ---------------- latency signal bars ---------------- */
export function LatencyBars({ bars, tone }: { bars: number; tone: "good" | "mid" | "bad" }) {
  const color =
    tone === "good" ? "bg-mint" : tone === "mid" ? "bg-amber-soft" : "bg-rose-soft";
  return (
    <div className="flex h-3.5 items-end gap-[2.5px]" dir="ltr">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{ height: `${4 + i * 2.4}px` }}
          className={`w-[3.5px] rounded-full ${i <= bars ? color : "bg-slate-300/60 dark:bg-white/12"}`}
        />
      ))}
    </div>
  );
}

/* ---------------- live sparkline ---------------- */
export function Sparkline({
  points,
  stroke = "#4a6cf7",
  id,
}: {
  points: number[];
  stroke?: string;
  id: string;
}) {
  const w = 100;
  const h = 36;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = Math.max(max - min, 1);
  const stepX = w / Math.max(points.length - 1, 1);
  const xy = points.map((p, i) => [i * stepX, h - 5 - ((p - min) / range) * (h - 10)] as const);

  let d = `M ${xy[0][0]} ${xy[0][1]}`;
  for (let i = 1; i < xy.length; i++) {
    const [x0, y0] = xy[i - 1];
    const [x1, y1] = xy[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${id})`} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {xy.length > 0 && (
        <circle cx={xy[xy.length - 1][0]} cy={xy[xy.length - 1][1]} r="2.6" fill={stroke} />
      )}
    </svg>
  );
}

/* ---------------- brand logo ---------------- */
export function Logo({ size = 34 }: { size?: number }) {
  return (
    <img
      src="/filternet-icon.svg"
      alt="FILTERNET"
      width={size}
      height={size}
      className="rounded-[28%] shadow-[0_10px_22px_-8px_rgba(13,23,40,0.55)] ring-1 ring-white/8"
    />
  );
}

/* ---------------- section heading ---------------- */
export function SectionTitle({ children, hint }: { children: string; hint?: string }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between px-1">
      <h3 className="text-[13px] font-bold text-ink dark:text-slate-100">{children}</h3>
      {hint && <span className="text-[10.5px] font-medium text-faint">{hint}</span>}
    </div>
  );
}
