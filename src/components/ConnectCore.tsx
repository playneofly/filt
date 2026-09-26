import { Power } from "lucide-react";
import type { ConnState } from "../lib/core";

export function ConnectCore({ state, onPress }: { state: ConnState; onPress: () => void }) {
  const on = state === "on";
  const busy = state === "connecting";

  return (
    <div className="relative grid h-60 w-60 place-items-center">
      {/* halos when connected */}
      {on && (
        <>
          <div className="anim-halo absolute inset-4 rounded-full border-2 border-accent/50" />
          <div className="anim-halo absolute inset-8 rounded-full border border-accent-2/40" style={{ animationDelay: "1.2s" }} />
        </>
      )}

      {/* orbit ring */}
      <svg viewBox="0 0 240 240" className={`absolute inset-0 ${busy ? "anim-connecting" : "anim-spin-slower"}`}>
        <circle
          cx="120"
          cy="120"
          r="112"
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="4 10"
          strokeLinecap="round"
          className={on ? "stroke-accent/40" : busy ? "stroke-accent/55" : "stroke-slate-300/80 dark:stroke-white/12"}
        />
      </svg>

      {/* second orbit */}
      <svg viewBox="0 0 240 240" className={`absolute inset-3 ${busy ? "hidden" : "anim-spin-slow"}`}>
        <circle
          cx="120"
          cy="120"
          r="112"
          fill="none"
          strokeWidth="1"
          strokeDasharray="1 14"
          strokeLinecap="round"
          className={on ? "stroke-accent-2/50" : "stroke-slate-300/50 dark:stroke-white/8"}
        />
      </svg>

      {/* connecting arc */}
      {busy && (
        <svg viewBox="0 0 240 240" className="absolute inset-6">
          <circle
            cx="120"
            cy="120"
            r="108"
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke="url(#connGrad)"
            strokeDasharray="160 520"
            style={{ animation: "dash-flow 1.3s linear infinite" }}
          />
          <defs>
            <linearGradient id="connGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4a6cf7" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* main button */}
      <button
        onClick={onPress}
        disabled={busy}
        aria-label="اتصال"
        className={`group relative grid h-36 w-36 place-items-center rounded-full transition-all duration-500 ${
          on
            ? "bg-gradient-to-br from-accent to-accent-2 shadow-[0_18px_50px_-10px_rgba(99,102,241,0.65)]"
            : "bg-white shadow-[0_14px_40px_-14px_rgba(15,23,42,0.22)] ring-1 ring-line dark:bg-night-card dark:ring-night-line dark:shadow-[0_14px_40px_-10px_rgba(0,0,0,0.6)]"
        } ${busy ? "scale-95" : "hover:scale-[1.045] active:scale-95"}`}
      >
        {/* inner sheen */}
        <span
          className={`pointer-events-none absolute inset-0 rounded-full ${
            on ? "bg-[radial-gradient(120%_120%_at_30%_15%,rgba(255,255,255,0.38),transparent_55%)]" : "bg-[radial-gradient(120%_120%_at_30%_12%,rgba(120,140,255,0.10),transparent_55%)]"
          }`}
        />
        <Power
          size={44}
          strokeWidth={2.4}
          className={`transition-colors duration-500 ${
            on ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]" : "text-slate-400 group-hover:text-accent dark:text-slate-500"
          }`}
        />
      </button>
    </div>
  );
}
