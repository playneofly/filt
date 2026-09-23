import PowerOrb from "../components/PowerOrb";
import Sparkline from "../components/Sparkline";
import { Chip, Flag, SignalBars } from "../components/Bits";
import { IconBolt, IconChevron, IconDown, IconShield, IconUp } from "../components/Icons";
import { fmtSpeed, pingTone } from "../lib/data";
import type { useApp } from "../lib/useApp";

type App = ReturnType<typeof useApp>;

export default function HomeScreen({ app, goServers }: { app: App; goServers: () => void }) {
  const { status, server, uptime, down, up, pings, scanning } = app;
  const on = status === "on";
  const ping = pings[server.id] ?? null;
  const tone = pingTone(ping);
  const curDown = down[down.length - 1] ?? 0;
  const curUp = up[up.length - 1] ?? 0;
  const dS = fmtSpeed(curDown);
  const uS = fmtSpeed(curUp);
  const intensity = Math.min(1, curDown / 1_600_000);

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-3">
      {/* active server card */}
      <button
        onClick={goServers}
        className="glass anim-rise mt-1 flex w-full items-center gap-3 rounded-[22px] p-3 text-right transition-transform active:scale-[0.985]"
        style={{ animationDelay: "40ms" }}
      >
        <div className="relative">
          <Flag emoji={server.flag} size={44} />
          <span
            className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2"
            style={{
              background: on ? "var(--ok)" : "var(--muted)",
              borderColor: "var(--bg)",
              boxShadow: on ? "0 0 8px var(--ok)" : undefined,
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[14px] font-bold">{server.city}</span>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>
              · {server.country}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Chip tone="accent">{server.protocol}</Chip>
            <Chip>{server.network}</Chip>
            <Chip>{server.tls}</Chip>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <SignalBars ping={ping} />
          <span className="num text-[10px] font-semibold" style={{ color: tone.color }}>
            {ping ? `${ping}ms` : "—"}
          </span>
        </div>
        <IconChevron size={16} className="opacity-40" />
      </button>

      {/* ORB */}
      <div className="anim-rise mt-1 flex justify-center" style={{ animationDelay: "90ms" }}>
        <PowerOrb status={status} uptime={uptime} intensity={intensity} onToggle={app.toggle} />
      </div>

      {/* smart connect pill */}
      <button
        onClick={app.startScan}
        disabled={scanning}
        className="anim-rise relative mx-auto -mt-1 flex h-[54px] w-full items-center justify-center gap-2 overflow-hidden rounded-[18px] font-bold transition-transform active:scale-[0.98]"
        style={{
          animationDelay: "140ms",
          background: "linear-gradient(120deg, color-mix(in srgb, var(--accent) 26%, transparent), color-mix(in srgb, var(--accent-2) 18%, transparent))",
          border: "1px solid color-mix(in srgb, var(--accent) 45%, transparent)",
          boxShadow: "0 8px 26px color-mix(in srgb, var(--glow) 30%, transparent)",
        }}
      >
        {scanning && <span className="shimmer-line" />}
        <IconBolt size={18} className="text-[color:var(--accent-2)]" />
        <span className="text-[14px]">اتصال هوشمند</span>
        <span className="text-[11px] font-normal" style={{ color: "var(--muted)" }}>
          — تست و انتخاب بهترین سرور
        </span>
      </button>

      {/* last best hint */}
      <div className="mt-2 text-center text-[10.5px]" style={{ color: "var(--muted)" }}>
        آخرین بهترین: 🇩🇪 فرانکفورت — ۴۲ms · ۵ دقیقه پیش
      </div>

      {/* live speed card */}
      <div
        className="glass anim-rise mt-3 overflow-hidden rounded-[22px] p-3"
        style={{ animationDelay: "190ms" }}
      >
        <div className="flex items-center justify-between">
          <SpeedStat icon={<IconDown size={13} />} label="دانلود" v={dS.v} u={dS.u} color="var(--accent-2)" active={on} />
          <div className="h-8 w-px" style={{ background: "var(--stroke)" }} />
          <SpeedStat icon={<IconUp size={13} />} label="آپلود" v={uS.v} u={uS.u} color="var(--accent)" active={on} />
          <div className="h-8 w-px" style={{ background: "var(--stroke)" }} />
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 text-[10px]" style={{ color: "var(--muted)" }}>
              <IconShield size={13} />
              وضعیت
            </div>
            <span
              className="rounded-full px-2 py-[2px] text-[10px] font-bold"
              style={{
                background: on ? "color-mix(in srgb, var(--ok) 16%, transparent)" : "var(--surface-2)",
                color: on ? "var(--ok)" : "var(--muted)",
              }}
            >
              {on ? "پایدار" : "غیرفعال"}
            </span>
          </div>
        </div>

        <div className="mt-2 h-[62px] w-full">
          <Sparkline down={down} up={up} />
        </div>
      </div>

      {/* ip card */}
      <div
        className="glass anim-rise mt-2.5 flex items-center justify-between rounded-[18px] px-3.5 py-2.5"
        style={{ animationDelay: "240ms" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
            <IconShield size={14} />
          </span>
          <div>
            <div className="text-[11px] font-semibold">آی‌پی عمومی شما</div>
            <div className="text-[9.5px]" style={{ color: "var(--muted)" }}>
              {on ? `${server.country} · Hetzner Online` : "محافظت نشده"}
            </div>
          </div>
        </div>
        <span className="num text-[12px] font-semibold" style={{ color: on ? "var(--text)" : "var(--bad)" }}>
          {on ? "88.99.14.207" : "2.184.xx.xx"}
        </span>
      </div>
    </div>
  );
}

function SpeedStat({
  icon,
  label,
  v,
  u,
  color,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  v: string;
  u: string;
  color: string;
  active: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1 text-[10px]" style={{ color: "var(--muted)" }}>
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="num text-[17px] font-bold" style={{ color: active ? "var(--text)" : "var(--muted)" }}>
          {active ? v : "0"}
        </span>
        <span className="text-[9px]" style={{ color: "var(--muted)" }}>
          {active ? u : "KB/s"}
        </span>
      </div>
    </div>
  );
}
