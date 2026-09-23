import { WEEK, fmtBytes } from "../lib/data";
import { IconDown, IconRefresh, IconUp } from "../components/Icons";
import type { useApp } from "../lib/useApp";

type App = ReturnType<typeof useApp>;

export default function StatsScreen({ app }: { app: App }) {
  const max = Math.max(...WEEK.map((w) => w.down + w.up));
  const totalDown = app.total.down;
  const totalUp = app.total.up;
  const share = totalDown / (totalDown + totalUp);
  const C = 2 * Math.PI * 46;

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: "امروز", v: fmtBytes(1.42 * 1024 ** 3) },
          { l: "۷ روز", v: fmtBytes(26.7 * 1024 ** 3) },
          { l: "کل", v: fmtBytes(totalDown + totalUp) },
        ].map((k, i) => (
          <div key={k.l} className="glass anim-rise rounded-[18px] p-3 text-center" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="text-[10px]" style={{ color: "var(--muted)" }}>
              {k.l}
            </div>
            <div className="num mt-1 text-[13px] font-bold">{k.v}</div>
          </div>
        ))}
      </div>

      {/* donut */}
      <div className="glass anim-rise mt-3 flex items-center gap-4 rounded-[22px] p-4" style={{ animationDelay: "120ms" }}>
        <div className="relative grid h-[108px] w-[108px] shrink-0 place-items-center">
          <svg width="108" height="108" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="54" cy="54" r="46" fill="none" stroke="var(--surface-2)" strokeWidth="11" />
            <circle
              cx="54"
              cy="54"
              r="46"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C}
              style={{ animation: `dash-draw 1.1s cubic-bezier(.3,1,.4,1) .2s forwards` }}
            />
            <circle
              cx="54"
              cy="54"
              r="46"
              fill="none"
              stroke="var(--accent-2)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={`${C * share} ${C}`}
              strokeDashoffset={C}
              style={{ animation: `dash-draw 1.3s cubic-bezier(.3,1,.4,1) .35s forwards` }}
            />
          </svg>
          <div className="absolute text-center">
            <div className="num text-[17px] font-bold">{Math.round(share * 100)}٪</div>
            <div className="text-[9px]" style={{ color: "var(--muted)" }}>
              دانلود
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          <Legend icon={<IconDown size={13} />} color="var(--accent-2)" label="دانلود" value={fmtBytes(totalDown)} />
          <Legend icon={<IconUp size={13} />} color="var(--accent)" label="آپلود" value={fmtBytes(totalUp)} />
          <button
            onClick={() => app.notify("آمار بازنشانی شد")}
            className="glass-2 flex w-full items-center justify-center gap-1.5 rounded-full py-1.5 text-[10.5px] font-semibold"
            style={{ color: "var(--muted)" }}
          >
            <IconRefresh size={12} /> بازنشانی آمار
          </button>
        </div>
      </div>

      {/* weekly bars */}
      <div className="glass anim-rise mt-3 rounded-[22px] p-4" style={{ animationDelay: "180ms" }}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[12.5px] font-bold">۷ روز گذشته</span>
          <div className="flex items-center gap-2.5 text-[9.5px]" style={{ color: "var(--muted)" }}>
            <Dot c="var(--accent-2)" t="دانلود" />
            <Dot c="var(--accent)" t="آپلود" />
          </div>
        </div>
        <div className="flex h-[122px] items-end justify-between gap-1.5">
          {WEEK.map((w, i) => {
            const hd = (w.down / max) * 100;
            const hu = (w.up / max) * 100;
            return (
              <div key={w.d} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-[96px] w-full flex-col justify-end gap-[2px]">
                  <div
                    className="w-full rounded-t-[5px]"
                    style={{
                      height: `${hu}%`,
                      background: "var(--accent)",
                      transformOrigin: "bottom",
                      animation: `bar-grow .6s cubic-bezier(.3,1.2,.4,1) ${0.2 + i * 0.07}s both`,
                    }}
                  />
                  <div
                    className="w-full rounded-b-[5px]"
                    style={{
                      height: `${hd}%`,
                      background: "linear-gradient(180deg, var(--accent-2), color-mix(in srgb, var(--accent-2) 40%, transparent))",
                      transformOrigin: "bottom",
                      animation: `bar-grow .6s cubic-bezier(.3,1.2,.4,1) ${0.15 + i * 0.07}s both`,
                    }}
                  />
                </div>
                <span className="text-[8.5px]" style={{ color: "var(--muted)" }}>
                  {w.d.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* health */}
      <div className="glass anim-rise mt-3 rounded-[22px] p-4" style={{ animationDelay: "240ms" }}>
        <div className="mb-2.5 text-[12.5px] font-bold">سلامت اتصال</div>
        {[
          { l: "پایداری", v: 0.94, c: "var(--ok)" },
          { l: "میانگین پینگ", v: 0.72, c: "var(--accent-2)" },
          { l: "نرخ موفقیت تست", v: 0.88, c: "var(--accent)" },
        ].map((r, i) => (
          <div key={r.l} className="mb-2.5 last:mb-0">
            <div className="mb-1 flex justify-between text-[10.5px]">
              <span style={{ color: "var(--muted)" }}>{r.l}</span>
              <span className="num font-bold">{Math.round(r.v * 100)}٪</span>
            </div>
            <div className="h-[5px] overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${r.v * 100}%`,
                  background: r.c,
                  transformOrigin: "right",
                  animation: `bar-grow .7s ease ${0.3 + i * 0.1}s both`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--muted)" }}>
        <span style={{ color }}>{icon}</span>
        {label}
      </span>
      <span className="num text-[12px] font-bold">{value}</span>
    </div>
  );
}

function Dot({ c, t }: { c: string; t: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="h-2 w-2 rounded-full" style={{ background: c }} /> {t}
    </span>
  );
}
