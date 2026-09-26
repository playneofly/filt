import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChartColumn,
  Check,
  Globe2,
  House,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { HomeScreen } from "./screens/Home";
import { ServersScreen } from "./screens/Servers";
import { StatsScreen } from "./screens/Stats";
import { SettingsScreen } from "./screens/Settings";
import { Logo, StatusBar } from "./components/ui";
import { SERVERS, type ConnState, type Server } from "./lib/core";

type Tab = "home" | "servers" | "stats" | "settings";

interface Toast {
  id: number;
  text: string;
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [conn, setConn] = useState<ConnState>("off");
  const [serverId, setServerId] = useState(SERVERS[0].id);
  const [seconds, setSeconds] = useState(0);
  const [down, setDown] = useState(0);
  const [up, setUp] = useState(0);
  const [history, setHistory] = useState<number[]>(Array(24).fill(0));
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | null>(null);
  const connRef = useRef(conn);
  connRef.current = conn;

  const server = SERVERS.find((s) => s.id === serverId) ?? SERVERS[0];

  const showToast = useCallback((text: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  /* ------- connection handshake ------- */
  useEffect(() => {
    if (conn !== "connecting") return;
    const t = window.setTimeout(() => {
      setConn("on");
      setSeconds(0);
      showToast(`اتصال امن برقرار شد · ${server.country}`);
    }, 2100);
    return () => window.clearTimeout(t);
  }, [conn, server.country, showToast]);

  /* ------- session timer ------- */
  useEffect(() => {
    if (conn !== "on") return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [conn]);

  /* ------- live speeds ------- */
  useEffect(() => {
    if (conn !== "on") return;
    setHistory(Array(24).fill(0));
    setDown(42);
    setUp(12);
    const t = window.setInterval(() => {
      setDown((d) => {
        const next = Math.min(96, Math.max(18, d + (Math.random() * 18 - 9)));
        setHistory((h) => [...h.slice(-23), next]);
        return next;
      });
      setUp((u) => Math.min(26, Math.max(4, u + (Math.random() * 8 - 4))));
    }, 900);
    return () => window.clearInterval(t);
  }, [conn]);

  const toggleConnect = () => {
    if (conn === "on") {
      setConn("off");
      setDown(0);
      setUp(0);
      setHistory(Array(24).fill(0));
      showToast("اتصال قطع شد");
    } else if (conn === "off") {
      setConn("connecting");
    }
  };

  const pickServer = (s: Server) => {
    setServerId(s.id);
    if (connRef.current !== "off") {
      setConn("off");
      window.setTimeout(() => setConn("connecting"), 250);
    } else {
      showToast(`سرور «${s.country} — ${s.city}» انتخاب شد`);
    }
  };

  const autoSelectServer = (best: Server) => {
    setServerId(best.id);
    showToast(`✨ بهترین سرور: ${best.country} · پینگ ${best.ping} ms`);
  };

  return (
    <div className="relative grid min-h-dvh w-full place-items-center overflow-hidden bg-[#0a0c12] py-0 font-sans sm:py-8">
      <Backdrop />

      {/* floating feature chips — desktop only */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <FloatChip className="left-[12%] top-[22%]" delay="0s">طراحی سبک و مینیمال</FloatChip>
        <FloatChip className="left-[9%] bottom-[28%]" delay="1.4s">راست‌به‌چپ و فارسی</FloatChip>
        <FloatChip className="right-[11%] top-[30%]" delay="0.7s">تم روشن و تیره</FloatChip>
        <FloatChip className="right-[13%] bottom-[24%]" delay="2s">بدون شلوغی نئونی</FloatChip>
      </div>

      {/* ================= PHONE ================= */}
      <div className="relative z-10 w-full sm:w-auto">
        <div className="relative mx-auto h-dvh w-full transition-all sm:h-[min(844px,94vh)] sm:w-[396px] sm:rounded-[54px] sm:bg-gradient-to-b sm:from-[#2a2e3c] sm:via-[#12141d] sm:to-[#1b1e2a] sm:p-[11px] sm:shadow-[0_50px_140px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.09)]">
          {/* hardware buttons */}
          <div className="absolute -left-[2.5px] top-28 hidden h-16 w-[3px] rounded-full bg-[#2c303e] sm:block" />
          <div className="absolute -left-[2.5px] top-48 hidden h-10 w-[3px] rounded-full bg-[#2c303e] sm:block" />
          <div className="absolute -right-[2.5px] top-36 hidden h-20 w-[3px] rounded-full bg-[#2c303e] sm:block" />

          {/* screen */}
          <div
            className={`relative flex h-full w-full flex-col overflow-hidden sm:rounded-[44px] ${dark ? "dark bg-night" : "bg-snow"}`}
          >
            {/* dynamic island */}
            <div className="pointer-events-none absolute left-1/2 top-2.5 z-40 hidden h-[26px] w-28 -translate-x-1/2 rounded-full bg-black sm:block" />

            {/* ambient screen glow behind content */}
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-72 transition-opacity duration-700 ${
                conn === "on"
                  ? "opacity-100 bg-[radial-gradient(70%_60%_at_50%_-10%,rgba(99,102,241,0.20),transparent_70%)]"
                  : "opacity-0"
              }`}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_50%_at_50%_0%,rgba(120,135,180,0.07),transparent_60%)] dark:bg-none" />

            <StatusBar dark={dark} />

            {/* header */}
            <div className="relative z-10 flex items-center justify-between px-5 pb-1 pt-2">
              <div className="flex items-center gap-2.5">
                <Logo size={32} />
                <div>
                  <p className="font-latin text-[14.5px] font-extrabold leading-none tracking-tight text-ink dark:text-white">
                    <span className="text-ink dark:text-white">FILTER</span>
                    <span className="bg-gradient-to-r from-[#18d9db] to-[#4a6cf7] bg-clip-text text-transparent">NET</span>
                  </p>
                  <p className="mt-1 text-[9px] font-bold tracking-wide text-faint">فیلترشکن امن</p>
                </div>
              </div>
              <button
                onClick={() => setDark(!dark)}
                aria-label="تغییر تم"
                className="pressable grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-sub shadow-sm transition-colors hover:text-accent dark:border-night-line dark:bg-night-card dark:text-night-sub"
              >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            {/* content */}
            <div className="relative z-10 mt-1 min-h-0 flex-1" key={tab}>
              {tab === "home" && (
                <HomeScreen
                  state={conn}
                  server={server}
                  seconds={seconds}
                  down={down}
                  up={up}
                  history={history}
                  onToggle={toggleConnect}
                  onPickServer={() => setTab("servers")}
                  onAutoSelect={autoSelectServer}
                />
              )}
              {tab === "servers" && (
                <ServersScreen selectedId={serverId} connected={conn === "on"} onSelect={pickServer} />
              )}
              {tab === "stats" && <StatsScreen connected={conn === "on"} seconds={seconds} down={down} />}
              {tab === "settings" && <SettingsScreen dark={dark} onToggleTheme={() => setDark(!dark)} />}
            </div>

            {/* toast */}
            {toast && (
              <div key={toast.id} className="anim-toast absolute inset-x-0 top-16 z-50 flex justify-center px-6">
                <div className="flex items-center gap-2 rounded-full bg-ink/92 px-4 py-2.5 text-white shadow-2xl backdrop-blur dark:bg-white/95 dark:text-ink">
                  <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-mint text-white dark:text-white">
                    <Check size={11} strokeWidth={3.5} />
                  </span>
                  <span className="text-[11px] font-bold">{toast.text}</span>
                </div>
              </div>
            )}

            {/* bottom nav */}
            <BottomNav tab={tab} onChange={setTab} />
          </div>
        </div>
      </div>

      {/* caption under phone */}
      <div className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 sm:flex">
        <span className="h-px w-10 glass-line" />
        <p className="whitespace-nowrap text-[10.5px] font-bold tracking-wide text-white/40">
          پیش‌نمایش زنده‌ی طراحی جدید · FILTERNET
        </p>
        <span className="h-px w-10 glass-line" />
      </div>
    </div>
  );
}

/* ================= bottom nav ================= */
function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "خانه", icon: <House size={19} strokeWidth={2.2} /> },
    { id: "servers", label: "سرورها", icon: <Globe2 size={19} strokeWidth={2.2} /> },
    { id: "stats", label: "آمار", icon: <ChartColumn size={19} strokeWidth={2.2} /> },
    { id: "settings", label: "تنظیمات", icon: <Settings size={19} strokeWidth={2.2} /> },
  ];

  return (
    <div className="absolute inset-x-4 bottom-3.5 z-30">
      <div className="flex items-center justify-between rounded-[26px] border border-line/80 bg-white/82 p-1.5 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-night-line dark:bg-night-card/85 dark:shadow-[0_16px_40px_-14px_rgba(0,0,0,0.7)]">
        {items.map((it) => {
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={`pressable relative flex flex-1 flex-col items-center gap-0.5 rounded-[20px] py-2 transition-colors duration-300 ${
                active ? "text-accent dark:text-white" : "text-faint hover:text-sub dark:hover:text-night-sub"
              }`}
            >
              {active && (
                <span
                  key={it.id}
                  className="anim-pop absolute inset-0 rounded-[20px] bg-accent/10 ring-1 ring-accent/15 dark:bg-accent/25 dark:ring-accent/25"
                />
              )}
              <span className="relative">{it.icon}</span>
              <span className={`relative text-[9.5px] ${active ? "font-extrabold" : "font-bold"}`}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================= backdrop ================= */
function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* mesh blobs */}
      <div className="anim-floaty absolute -top-32 left-[8%] h-[420px] w-[420px] rounded-full bg-accent/22 blur-[130px]" style={{ animationDelay: "0.5s" }} />
      <div className="anim-floaty absolute -bottom-40 right-[6%] h-[460px] w-[460px] rounded-full bg-accent-2/18 blur-[140px]" />
      <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-mint/8 blur-[120px]" />

      {/* grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(60% 60% at 50% 45%, black, transparent)",
          WebkitMaskImage: "radial-gradient(60% 60% at 50% 45%, black, transparent)",
        }}
      />

      {/* giant wordmark */}
      <div className="absolute inset-0 hidden items-center justify-center sm:flex">
        <span
          dir="ltr"
          className="select-none whitespace-nowrap font-latin text-[15vw] font-extrabold uppercase leading-none tracking-tighter text-transparent"
          style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.055)" }}
        >
          FILTERNET
        </span>
      </div>
    </div>
  );
}

/* ================= floating chips ================= */
function FloatChip({ children, className, delay }: { children: string; className: string; delay: string }) {
  return (
    <div
      className={`anim-floaty absolute ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-2 text-[10.5px] font-bold text-white/55 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent to-accent-2" />
        {children}
      </div>
    </div>
  );
}
