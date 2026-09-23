import { SERVERS, pingTone } from "../lib/data";
import type { ScanResult } from "../lib/useApp";
import type { Server } from "../lib/data";
import { Flag, SignalBars } from "./Bits";
import { IconBolt, IconClose } from "./Icons";

interface Props {
  results: ScanResult[];
  progress: number;
  winner: Server | null;
  onCancel: () => void;
}

export default function ScanSheet({ results, progress, winner, onCancel }: Props) {
  const total = SERVERS.length;
  const ranked = [...results]
    .map((r) => ({ ...r, s: SERVERS.find((x) => x.id === r.id)! }))
    .sort((a, b) => {
      if (a.ping === null && b.ping === null) return a.done === b.done ? 0 : a.done ? 1 : -1;
      if (a.ping === null) return 1;
      if (b.ping === null) return -1;
      return a.ping - b.ping;
    });

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 anim-fade" style={{ background: "rgba(3,2,8,.66)", backdropFilter: "blur(6px)" }} onClick={onCancel} />

      <div
        className="anim-sheet relative flex max-h-[86%] flex-col overflow-hidden rounded-t-[30px]"
        style={{
          background: "linear-gradient(180deg, color-mix(in srgb, var(--accent) 12%, var(--bg-2)), var(--bg) 42%)",
          borderTop: "1px solid var(--stroke-strong)",
        }}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full" style={{ background: "var(--stroke-strong)" }} />

        <div className="flex items-center justify-between px-5 pb-1 pt-3">
          <div>
            <div className="flex items-center gap-1.5 text-[15px] font-bold">
              <IconBolt size={16} className="text-[color:var(--accent-2)]" />
              اتصال هوشمند
            </div>
            <div className="mt-0.5 text-[11px]" style={{ color: "var(--muted)" }}>
              {winner ? "بهترین سرور پیدا شد" : `در حال تست ${Math.min(progress + 1, total)} از ${total} سرور…`}
            </div>
          </div>
          <button onClick={onCancel} className="glass-2 grid h-8 w-8 place-items-center rounded-full" style={{ color: "var(--muted)" }}>
            <IconClose size={15} />
          </button>
        </div>

        {/* radar */}
        <div className="relative mx-auto my-1 grid h-[132px] w-[132px] place-items-center">
          {[1, 0.68, 0.36].map((k) => (
            <span key={k} className="absolute rounded-full" style={{ width: 132 * k, height: 132 * k, border: "1px solid var(--stroke)" }} />
          ))}
          <span className="absolute h-px w-[132px]" style={{ background: "var(--stroke)" }} />
          <span className="absolute h-[132px] w-px" style={{ background: "var(--stroke)" }} />

          {!winner && (
            <span
              className="absolute h-[132px] w-[132px] rounded-full"
              style={{
                background: "conic-gradient(from 0deg, color-mix(in srgb, var(--accent) 48%, transparent), transparent 24%)",
                animation: "radar-sweep 1.5s linear infinite",
              }}
            />
          )}

          {results.filter((r) => r.done && r.ping !== null).map((r, i) => {
            const t = pingTone(r.ping);
            const ang = (SERVERS.findIndex((s) => s.id === r.id) / SERVERS.length) * Math.PI * 2;
            const rad = 14 + Math.min(r.ping!, 280) / 280 * 50;
            return (
              <span
                key={r.id}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{
                  background: t.color,
                  boxShadow: `0 0 8px ${t.color}`,
                  transform: `translate(${Math.cos(ang) * rad}px, ${Math.sin(ang) * rad}px)`,
                  animation: `blip .6s ease both`,
                  animationDelay: `${i * 0.02}s`,
                }}
              />
            );
          })}

          {winner && (
            <div className="anim-pop absolute grid place-items-center text-center">
              <div className="text-[30px]">{winner.flag}</div>
              <div className="num text-[15px] font-bold" style={{ color: "var(--ok)" }}>
                {results.find((r) => r.id === winner.id)?.ping} ms
              </div>
            </div>
          )}
        </div>

        {/* progress bar */}
        <div className="mx-5 mb-2 h-[3px] overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(progress / total) * 100}%`, background: "linear-gradient(90deg, var(--accent-2), var(--accent))" }}
          />
        </div>

        {/* live race list */}
        <div className="scroll-thin flex-1 overflow-y-auto px-3 pb-6">
          {ranked.map((r, i) => {
            const t = pingTone(r.ping);
            const isWin = winner?.id === r.id;
            return (
              <div
                key={r.id}
                className="flex items-center gap-2.5 rounded-2xl px-2.5 py-2 transition-all duration-500"
                style={{
                  background: isWin ? "color-mix(in srgb, var(--ok) 14%, transparent)" : "transparent",
                  border: isWin ? "1px solid color-mix(in srgb, var(--ok) 40%, transparent)" : "1px solid transparent",
                  opacity: r.done ? 1 : 0.42,
                }}
              >
                <span className="num w-4 text-[11px]" style={{ color: isWin ? "var(--ok)" : "var(--muted)" }}>
                  {i + 1}
                </span>
                <Flag emoji={r.s.flag} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-semibold">{r.s.name}</div>
                  <div className="text-[9.5px]" style={{ color: "var(--muted)" }}>
                    {r.s.protocol} · {r.s.city}
                  </div>
                </div>
                {!r.done ? (
                  <div className="skeleton h-3 w-10 rounded-full" />
                ) : r.ping === null ? (
                  <span className="text-[10px]" style={{ color: "var(--bad)" }}>
                    ناموفق
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="num text-[12px] font-bold" style={{ color: t.color }}>
                      {r.ping}
                    </span>
                    <span className="text-[9px]" style={{ color: "var(--muted)" }}>
                      ms
                    </span>
                    <SignalBars ping={r.ping} size={0.85} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
