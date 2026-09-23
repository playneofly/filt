import { pingTone } from "../lib/data";

export function SignalBars({ ping, size = 1 }: { ping: number | null; size?: number }) {
  const t = pingTone(ping);
  return (
    <div className="flex items-end gap-[2.5px]" style={{ height: 15 * size }}>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="rounded-[1.5px] transition-colors duration-300"
          style={{
            width: 3 * size,
            height: (5 + i * 3.2) * size,
            background: i <= t.bars ? t.color : "var(--stroke-strong)",
            boxShadow: i <= t.bars ? `0 0 6px ${t.color}55` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function Chip({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent";
}) {
  return (
    <span
      className="rounded-full px-1.5 py-[1.5px] text-[9.5px] font-medium leading-[15px]"
      style={
        tone === "accent"
          ? { background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)" }
          : { background: "var(--surface-2)", color: "var(--muted)", border: "1px solid var(--stroke)" }
      }
    >
      {children}
    </span>
  );
}

export function Flag({ emoji, size = 40 }: { emoji: string; size?: number }) {
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: "var(--surface-2)",
        border: "1px solid var(--stroke)",
      }}
    >
      <span style={{ lineHeight: 1 }}>{emoji}</span>
    </div>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors duration-300"
      style={{
        background: on ? "linear-gradient(120deg, var(--accent-2), var(--accent))" : "var(--surface-2)",
        border: "1px solid var(--stroke)",
      }}
      aria-pressed={on}
    >
      <span
        className="absolute top-[2.5px] h-[19px] w-[19px] rounded-full bg-white transition-all duration-300"
        style={{ right: on ? 3 : 23, boxShadow: "0 2px 6px rgba(0,0,0,.4)" }}
      />
    </button>
  );
}
