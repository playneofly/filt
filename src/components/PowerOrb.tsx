import { useEffect, useRef, useState } from "react";
import type { Status } from "../lib/useApp";
import { IconCheck, IconPower } from "./Icons";
import { fmtUptime } from "../lib/useApp";

interface Props {
  status: Status;
  uptime: number;
  intensity: number; // 0..1 live traffic
  onToggle: () => void;
}

const LABEL: Record<Status, string> = {
  off: "قطع",
  connecting: "در حال اتصال…",
  on: "متصل",
  error: "خطا",
};

export default function PowerOrb({ status, uptime, intensity, onToggle }: Props) {
  const on = status === "on";
  const connecting = status === "connecting";
  const [sparks, setSparks] = useState<number[]>([]);
  const [justOn, setJustOn] = useState(false);
  const prev = useRef<Status>(status);

  useEffect(() => {
    if (prev.current !== "on" && status === "on") {
      setSparks(Array.from({ length: 14 }, (_, i) => i));
      setJustOn(true);
      const a = window.setTimeout(() => setSparks([]), 900);
      const b = window.setTimeout(() => setJustOn(false), 1300);
      return () => {
        window.clearTimeout(a);
        window.clearTimeout(b);
      };
    }
    prev.current = status;
  }, [status]);
  useEffect(() => {
    prev.current = status;
  }, [status]);

  const glow = on ? 34 + intensity * 46 : connecting ? 26 : 0;

  return (
    <div className="relative grid h-[266px] w-[266px] place-items-center select-none">
      {/* pulse rings */}
      {on &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            className="pointer-events-none absolute rounded-full"
            style={{
              width: 190,
              height: 190,
              border: "1.5px solid color-mix(in srgb, var(--accent) 60%, transparent)",
              animation: "orb-pulse 3.4s cubic-bezier(.2,.6,.3,1) infinite",
              animationDelay: `${i * 1.13}s`,
            }}
          />
        ))}

      {/* outer faint track */}
      <div
        className="absolute rounded-full"
        style={{ width: 250, height: 250, border: "1px solid var(--stroke)" }}
      />

      {/* rotating conic aura */}
      <div
        className="absolute rounded-full transition-opacity duration-700"
        style={{
          width: 228,
          height: 228,
          opacity: on ? 1 : connecting ? 0.95 : 0.28,
          background: on
            ? "conic-gradient(from 0deg, transparent 0%, color-mix(in srgb, var(--accent-2) 90%, transparent) 18%, var(--accent) 42%, transparent 62%, color-mix(in srgb, var(--accent) 70%, transparent) 84%, transparent 100%)"
            : connecting
              ? "conic-gradient(from 0deg, transparent 0%, var(--warn) 22%, transparent 45%)"
              : "conic-gradient(from 0deg, rgba(255,255,255,.14), rgba(255,255,255,.03) 60%, rgba(255,255,255,.14))",
          animation: `spin-slow ${connecting ? "1.1s" : on ? "6s" : "26s"} linear infinite`,
          filter: "blur(0.4px)",
        }}
      />
      {/* mask */}
      <div
        className="absolute rounded-full"
        style={{
          width: 216,
          height: 216,
          background: "radial-gradient(circle at 50% 42%, var(--bg-2), var(--bg) 78%)",
        }}
      />

      {/* progress arc when connecting */}
      {connecting && (
        <svg className="absolute" width={238} height={238} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={119}
            cy={119}
            r={110}
            fill="none"
            stroke="var(--warn)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="120 570"
            style={{ animation: "spin-slow 1.2s linear infinite", transformOrigin: "119px 119px" }}
          />
        </svg>
      )}

      {/* core button */}
      <button
        onClick={onToggle}
        className="group absolute grid place-items-center rounded-full transition-transform duration-200 active:scale-[0.955]"
        style={{
          width: 196,
          height: 196,
          background:
            "radial-gradient(circle at 50% 28%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 62%), linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.015))",
          border: "1px solid var(--stroke-strong)",
          boxShadow: glow
            ? `0 0 ${glow}px color-mix(in srgb, var(--glow) 80%, transparent), inset 0 1px 0 rgba(255,255,255,.14)`
            : "inset 0 1px 0 rgba(255,255,255,.08)",
          animation: on ? "breathe 4.4s ease-in-out infinite" : undefined,
          transition: "box-shadow 420ms ease",
        }}
        aria-label={on ? "قطع اتصال" : "اتصال"}
      >
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="grid h-14 w-14 place-items-center rounded-full transition-colors duration-500"
            style={{
              background: on
                ? "linear-gradient(140deg, var(--accent-2), var(--accent))"
                : "rgba(255,255,255,.07)",
              color: on ? "#06040f" : "var(--muted)",
              boxShadow: on ? "0 6px 22px color-mix(in srgb, var(--glow) 60%, transparent)" : "none",
            }}
          >
            {justOn ? <IconCheck size={26} /> : <IconPower size={26} />}
          </div>

          <div
            className="mt-1 text-[13px] font-semibold tracking-wide transition-colors duration-500"
            style={{ color: on ? "var(--text)" : connecting ? "var(--warn)" : "var(--muted)" }}
          >
            {LABEL[status]}
          </div>

          <div className="num h-[26px] text-[21px] font-semibold" style={{ color: on ? "var(--text)" : "transparent" }}>
            {on ? <Rolling value={fmtUptime(uptime)} /> : "00:00:00"}
          </div>

          <div className="text-[10.5px]" style={{ color: "var(--muted)" }}>
            {on ? "برای قطع، لمس کنید" : connecting ? "لطفاً صبر کنید" : "برای اتصال، لمس کنید"}
          </div>
        </div>
      </button>

      {/* success sparks */}
      {sparks.map((i) => {
        const ang = (i / 14) * Math.PI * 2;
        return (
          <span
            key={i}
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full"
            style={
              {
                background: i % 2 ? "var(--accent-2)" : "var(--accent)",
                "--dx": `${Math.cos(ang) * 120}px`,
                "--dy": `${Math.sin(ang) * 120}px`,
                animation: "spark .85s cubic-bezier(.2,.7,.3,1) forwards",
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

function Rolling({ value }: { value: string }) {
  return (
    <span className="inline-flex">
      {value.split("").map((ch, i) => (
        <span key={`${i}-${ch}`} className="inline-block" style={{ width: ch === ":" ? 8 : 13 }}>
          <span key={ch} className="inline-block" style={{ animation: "digit-roll .28s ease both" }}>
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}
