import { useEffect, useState } from "react";
import Phone from "./components/Phone";
import BottomNav, { type Tab } from "./components/BottomNav";
import ScanSheet from "./components/ScanSheet";
import HomeScreen from "./screens/HomeScreen";
import ServersScreen from "./screens/ServersScreen";
import StatsScreen from "./screens/StatsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { IconBolt, IconCheck, IconMenu, IconQr } from "./components/Icons";
import { PALETTES, type PaletteId } from "./lib/data";
import { useApp } from "./lib/useApp";

const TITLES: Record<Tab, string> = {
  home: "FILTERNET",
  servers: "سرورها",
  stats: "آمار مصرف",
  settings: "تنظیمات",
};

export default function App() {
  const app = useApp();
  const [tab, setTab] = useState<Tab>("home");
  const [palette, setPalette] = useState<PaletteId>("neon");
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", palette);
  }, [palette]);

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 1750);
    return () => window.clearTimeout(t);
  }, []);

  const on = app.status === "on";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ background: "#05040a" }}>
      {/* studio backdrop */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% -5%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%), radial-gradient(50% 40% at 100% 100%, color-mix(in srgb, var(--accent-2) 10%, transparent), transparent 70%), #05040a",
          transition: "background 900ms ease",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(70% 60% at 50% 40%, #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 40%, #000, transparent 75%)",
        }}
      />

      <div className="relative mx-auto flex max-w-[1240px] flex-col items-center gap-8 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-16">
        {/* copy panel */}
        <div className="max-w-[440px] text-center lg:text-right">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)" }}
          >
            <IconBolt size={13} /> پروتوتایپ تعاملی — نسخه ۲.۰
          </span>
          <h1 className="mt-4 text-[40px] font-extrabold leading-[1.15] tracking-tight">
            <span className="accent-text">FILTERNET</span>
            <br />
            بازطراحی کامل رابط کاربری
          </h1>
          <p className="mt-3 text-[14px] leading-7" style={{ color: "var(--muted)" }}>
            از یک «مدیریت لیست سرور» به یک «دکمه‌ی اتصال». صفحه‌ی اصلی حالا یک
            <b className="text-[color:var(--text)]"> Power Orb </b>
            مرکزی دارد، زیرش
            <b className="text-[color:var(--text)]"> اتصال هوشمند </b>
            که همه‌ی سرورها را تست می‌کند و بهترین را می‌گیرد، و سرورها به یک
            <b className="text-[color:var(--text)]"> تب مستقل </b>
            در نوار پایین منتقل شده‌اند.
          </p>

          <ul className="mt-5 grid gap-2 text-[12.5px]">
            {[
              "دکمه‌ی مرکزی با حلقه‌های پالس، آرک اتصال و ذرات موفقیت",
              "اتصال هوشمند با رادار اسکن و مسابقه‌ی زنده‌ی پینگ",
              "ناوبری چهارتایی: خانه / سرورها / آمار / تنظیمات",
              "ردیف سرور با پرچم، چیپ پروتکل، میله‌ی سیگنال و Swipe",
              "چهار پالت زنده: نئون، اقیانوس، آمولد، غروب",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2" style={{ color: "var(--muted)" }}>
                <span className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{ background: "var(--accent)", color: "#07050f" }}>
                  <IconCheck size={10} />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>
              پوسته:
            </span>
            {PALETTES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPalette(p.id)}
                className="h-7 w-7 rounded-full transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${p.b}, ${p.a})`,
                  outline: palette === p.id ? "2px solid var(--text)" : "1px solid rgba(255,255,255,.18)",
                  outlineOffset: 2,
                  transform: palette === p.id ? "scale(1.12)" : "scale(1)",
                }}
                title={p.label}
              />
            ))}
          </div>
        </div>

        {/* phone */}
        <Phone glow={on}>
          {/* app mesh backdrop */}
          <div className="mesh mesh-base" />
          <div
            className="mesh"
            style={{
              opacity: on ? 1 : 0,
              background:
                "radial-gradient(65% 45% at 50% 22%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 72%), radial-gradient(60% 40% at 15% 70%, color-mix(in srgb, var(--accent-2) 18%, transparent), transparent 72%)",
            }}
          />
          <div
            className="mesh"
            style={{
              opacity: app.status === "connecting" ? 1 : 0,
              background: "radial-gradient(65% 45% at 50% 22%, rgba(255,194,75,.22), transparent 72%)",
            }}
          />
          <div className="grain" />

          <div className="relative flex h-full flex-col">
            {/* status bar */}
            <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold" style={{ color: "var(--text)" }}>
              <span className="num">۹:۴۱</span>
              <span className="flex items-center gap-1 opacity-70">
                <span className="num text-[10px]">{on ? "VPN" : ""}</span>
                <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
                  <rect x="0" y="7" width="3" height="4" rx="1" />
                  <rect x="4.3" y="5" width="3" height="6" rx="1" />
                  <rect x="8.6" y="2.6" width="3" height="8.4" rx="1" />
                  <rect x="12.9" y="0" width="3" height="11" rx="1" opacity=".4" />
                </svg>
                <svg width="20" height="10" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <rect x="1" y="1" width="19" height="10" rx="3" />
                  <rect x="2.8" y="2.8" width="12" height="6.4" rx="1.6" fill="currentColor" stroke="none" />
                  <path d="M22 4.5v3" strokeLinecap="round" />
                </svg>
              </span>
            </div>

            {/* top bar */}
            <div className="flex items-center justify-between px-4 pb-2 pt-1">
              <button className="glass grid h-9 w-9 place-items-center rounded-full" style={{ color: "var(--muted)" }}>
                <IconMenu size={17} />
              </button>
              <div className="flex flex-col items-center">
                <span className={`text-[14px] font-extrabold ${tab === "home" ? "accent-text" : ""}`}>{TITLES[tab]}</span>
                {tab === "home" && (
                  <span className="text-[9px]" style={{ color: "var(--muted)" }}>
                    {on ? "تونل امن فعال است" : "محافظت نشده"}
                  </span>
                )}
              </div>
              <button className="glass grid h-9 w-9 place-items-center rounded-full" style={{ color: "var(--muted)" }}>
                <IconQr size={17} />
              </button>
            </div>

            {/* screens */}
            <div key={tab} className="anim-fade flex flex-1 flex-col overflow-hidden">
              {tab === "home" && <HomeScreen app={app} goServers={() => setTab("servers")} />}
              {tab === "servers" && <ServersScreen app={app} />}
              {tab === "stats" && <StatsScreen app={app} />}
              {tab === "settings" && <SettingsScreen palette={palette} setPalette={setPalette} notify={app.notify} />}
            </div>

            <BottomNav tab={tab} onTab={setTab} />

            {/* toast */}
            {app.toast && (
              <div className="pointer-events-none absolute bottom-[86px] left-0 right-0 z-30 flex justify-center px-6">
                <div className="glass anim-pop rounded-full px-4 py-2 text-[11px] font-semibold" style={{ boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
                  {app.toast}
                </div>
              </div>
            )}

            {/* scan sheet */}
            {app.scanning && (
              <ScanSheet results={app.scanResults} progress={app.scanProgress} winner={app.winner} onCancel={app.cancelScan} />
            )}

            {/* splash */}
            {booting && <Splash />}
          </div>
        </Phone>
      </div>

      <div className="relative pb-10 text-center text-[11px]" style={{ color: "var(--muted)" }}>
        روی دکمه‌ی وسط بزنید تا وصل شود · «اتصال هوشمند» را امتحان کنید · در تب سرورها، ردیف‌ها قابل کشیدن (Swipe) هستند
      </div>
    </div>
  );
}

function Splash() {
  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center"
      style={{
        background: "linear-gradient(180deg, var(--bg-2), var(--bg))",
        animation: "fade-in .3s ease both, fade-in .5s ease 1.25s reverse forwards",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <svg width="86" height="86" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent-2)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--stroke)" strokeWidth="2" />
          <path
            d="M50 12 A38 38 0 1 1 49.9 12"
            fill="none"
            stroke="url(#lg)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="239"
            strokeDashoffset="239"
            style={{ animation: "dash-draw 1.1s cubic-bezier(.4,0,.2,1) .1s forwards" }}
          />
          <path
            d="M54 26 L36 54 h13 l-3 20 18-28H51z"
            fill="url(#lg)"
            style={{ animation: "pop-in .5s cubic-bezier(.3,1.4,.4,1) .55s both" }}
          />
        </svg>
        <div className="text-[17px] font-extrabold tracking-[0.2em] accent-text">FILTERNET</div>
      </div>
    </div>
  );
}
