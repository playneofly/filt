import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  Download,
  Globe2,
  MapPin,
  Sparkles,
  Upload,
  Wifi,
} from "lucide-react";
import { ConnectCore } from "../components/ConnectCore";
import { Sparkline } from "../components/ui";
import { SERVERS, faDigits, faTime, pingQuality, type ConnState, type Server } from "../lib/core";

interface Props {
  state: ConnState;
  server: Server;
  seconds: number;
  down: number;
  up: number;
  history: number[];
  onToggle: () => void;
  onPickServer: () => void;
  onAutoSelect: (best: Server) => void;
}

/* ─── scanning animation state ─── */
interface ScanState {
  active: boolean;
  scanned: string[]; // server ids scanned so far
  current: string | null; // currently scanning
  done: boolean;
}

export function HomeScreen({
  state,
  server,
  seconds,
  down,
  up,
  history,
  onToggle,
  onPickServer,
  onAutoSelect,
}: Props) {
  const on = state === "on";
  const busy = state === "connecting";
  const q = pingQuality(server.ping);

  const [scan, setScan] = useState<ScanState>({
    active: false,
    scanned: [],
    current: null,
    done: false,
  });
  const scanTimer = useRef<number | null>(null);
  const scanStep = useRef(0);

  /* ── auto-select: fake ping all servers ── */
  function startAutoScan() {
    if (scan.active) return;
    scanStep.current = 0;
    setScan({ active: true, scanned: [], current: null, done: false });
  }

  useEffect(() => {
    if (!scan.active || scan.done) return;

    const all = [...SERVERS];
    const step = scanStep.current;

    if (step >= all.length) {
      // finished — pick lowest ping
      const best = all.reduce((a, b) => (a.ping < b.ping ? a : b));
      setScan((s) => ({ ...s, current: null, done: true, active: false }));
      window.setTimeout(() => {
        onAutoSelect(best);
        setScan({ active: false, scanned: [], current: null, done: false });
      }, 700);
      return;
    }

    const srv = all[step];
    setScan((s) => ({ ...s, current: srv.id }));

    scanTimer.current = window.setTimeout(() => {
      setScan((s) => ({
        ...s,
        scanned: [...s.scanned, srv.id],
        current: null,
      }));
      scanStep.current = step + 1;
    }, 220 + Math.random() * 160);

    return () => {
      if (scanTimer.current) window.clearTimeout(scanTimer.current);
    };
  }, [scan.active, scan.scanned.length, scan.done, onAutoSelect]);

  return (
    <div className="flex h-full flex-col px-4">

      {/* ── status pill ── */}
      <div className="flex justify-center pt-1">
        <div
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors duration-500 ${
            on
              ? "bg-mint/10 text-mint"
              : busy
                ? "bg-accent/10 text-accent"
                : "bg-slate-500/8 text-sub dark:bg-white/6 dark:text-night-sub"
          }`}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                on ? "bg-mint anim-breathe" : busy ? "bg-accent anim-ping-dot" : "bg-slate-400"
              }`}
            />
          </span>
          {on ? "اتصال امن برقرار است" : busy ? "در حال برقراری اتصال امن…" : "اتصال برقرار نیست"}
        </div>
      </div>

      {/* ── connect core ── */}
      <div className="mt-1 flex flex-1 items-center justify-center" style={{ maxHeight: 200 }}>
        <ConnectCore state={state} onPress={onToggle} />
      </div>

      {/* ── status line ── */}
      <div className="mt-0 text-center">
        <p className="text-[14px] font-extrabold tracking-tight text-ink dark:text-white">
          {on ? "شما محافظت می‌شوید" : busy ? "لطفاً چند لحظه صبر کنید" : "برای اتصال لمس کنید"}
        </p>
        <p className="mt-0.5 h-4 font-latin text-[11px] font-semibold tracking-[0.14em] text-faint" dir="ltr">
          {on ? faTime(seconds) : busy ? "HANDSHAKE…" : "SECURE · PRIVATE · FAST"}
        </p>
      </div>

      {/* ── smart auto-select button ── */}
      <div className="mt-3">
        <AutoSelectButton scan={scan} onPress={startAutoScan} />
      </div>

      {/* ── current server card ── */}
      <div className="mt-2.5">
        <button
          onClick={onPickServer}
          className="pressable group flex w-full items-center gap-3 rounded-3xl border border-line bg-card p-3 text-right shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] transition-colors dark:border-night-line dark:bg-night-card"
        >
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${server.gradient} font-latin text-[12px] font-extrabold text-white shadow-md`}
          >
            {server.code}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <MapPin size={11} className="text-faint" />
              <span className="truncate text-[12.5px] font-bold text-ink dark:text-white">
                {server.country} — {server.city}
              </span>
            </div>
            <p className="mt-0.5 text-[10.5px] font-medium text-sub dark:text-night-sub">
              پینگ{" "}
              <span
                className={
                  q.tone === "good"
                    ? "text-mint"
                    : q.tone === "mid"
                      ? "text-amber-soft"
                      : "text-rose-soft"
                }
              >
                {faDigits(server.ping)}
              </span>{" "}
              ms · بار سرور {faDigits(server.load)}٪
            </p>
          </div>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-snow text-sub transition-colors group-hover:bg-accent/10 group-hover:text-accent dark:bg-white/6 dark:text-night-sub">
            <ChevronLeft size={15} />
          </div>
        </button>
      </div>

      {/* ── speed cards row ── */}
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        <SpeedCard
          label="دانلود"
          value={down}
          tone="#4a6cf7"
          icon={<Download size={13} className="text-accent" />}
          active={on}
          history={history}
          id="down"
        />
        <MiniStatCard
          label="آپلود"
          value={on ? up.toFixed(1) : "0.0"}
          unit="Mbps"
          icon={<Upload size={13} className="text-accent-2" />}
          tone="text-accent-2"
          active={on}
        />
        <MiniStatCard
          label="IP جدید"
          value={on ? "85.17.24" : "—"}
          unit=""
          ltr
          icon={<Globe2 size={13} className="text-mint" />}
          tone="text-mint"
          active={on}
        />
      </div>

      {/* ── add server CTA ── */}
      <div className="mb-3 mt-2.5">
        <button
          onClick={onPickServer}
          className="pressable flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-accent/35 bg-accent/[0.04] py-3 text-[12px] font-bold text-accent transition-colors hover:bg-accent/8 dark:border-accent/25 dark:bg-accent/[0.06]"
        >
          <Wifi size={14} />
          سرور نداری ؟ کلیک کن
        </button>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════
   Auto-select button with scan animation
══════════════════════════════════════════════ */
function AutoSelectButton({
  scan,
  onPress,
}: {
  scan: ScanState;
  onPress: () => void;
}) {
  const isScanning = scan.active;
  const isDone = scan.done;

  // which server is being highlighted right now
  const currentSrv = SERVERS.find((s) => s.id === scan.current);
  const scannedCount = scan.scanned.length;
  const totalCount = SERVERS.length;

  return (
    <button
      onClick={onPress}
      disabled={isScanning}
      className={`pressable relative flex w-full flex-col overflow-hidden rounded-2xl px-4 py-3 text-right transition-all duration-300 ${
        isScanning
          ? "bg-gradient-to-r from-[#1a2550] to-[#1c1a3a] dark:from-[#141c3a] dark:to-[#16122e]"
          : "bg-gradient-to-r from-accent to-accent-2 shadow-[0_8px_20px_-8px_rgba(94,102,241,0.5)] hover:opacity-95"
      }`}
    >
      {/* shimmer strip when scanning */}
      {isScanning && (
        <span className="anim-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      )}

      {!isScanning && !isDone && (
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={16} className="text-white" />
          <span className="text-[13px] font-bold text-white">انتخاب بهترین سرور</span>
        </div>
      )}

      {isDone && (
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={16} className="text-white" />
          <span className="text-[13px] font-bold text-white">بهترین سرور پیدا شد!</span>
        </div>
      )}

      {isScanning && (
        <div className="flex items-center gap-3">
          {/* spinning radar icon */}
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <svg viewBox="0 0 32 32" className="anim-spin-slow absolute inset-0 h-full w-full">
              <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(74,108,247,0.35)" strokeWidth="1.5" strokeDasharray="4 6" strokeLinecap="round" />
            </svg>
            <svg viewBox="0 0 32 32" className="anim-connecting absolute inset-0 h-full w-full">
              <circle cx="16" cy="16" r="9" fill="none" stroke="#4a6cf7" strokeWidth="2" strokeDasharray="12 44" strokeLinecap="round" />
            </svg>
            <Wifi size={13} className="relative text-accent" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-bold text-white">
              {currentSrv
                ? `در حال بررسی ${currentSrv.country}…`
                : `تحلیل سرور ${faDigits(scannedCount)} از ${faDigits(totalCount)}`}
            </p>
            {/* progress bar */}
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-300"
                style={{ width: `${(scannedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          <span className="font-latin text-[10px] font-bold text-white/55" dir="ltr">
            {scannedCount}/{totalCount}
          </span>
        </div>
      )}
    </button>
  );
}

/* ══════════════════════════════════════════════
   Speed sparkline card (wide)
══════════════════════════════════════════════ */
function SpeedCard({
  label,
  value,
  tone,
  icon,
  active,
  history,
  id,
}: {
  label: string;
  value: number;
  tone: string;
  icon: React.ReactNode;
  active: boolean;
  history: number[];
  id: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-card p-3 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] dark:border-night-line dark:bg-night-card">
      <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-sub dark:text-night-sub">
        {icon} {label}
      </span>
      <div className="mt-1 flex items-baseline gap-0.5">
        <span
          className={`font-latin text-[18px] font-extrabold leading-none transition-colors ${active ? "text-ink dark:text-white" : "text-faint"}`}
        >
          {active ? value.toFixed(1) : "0.0"}
        </span>
        <span className="font-latin text-[9px] font-bold text-faint">M</span>
      </div>
      <div className="mt-1 opacity-90">
        <Sparkline points={history} stroke={tone} id={id} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Mini stat card
══════════════════════════════════════════════ */
function MiniStatCard({
  label,
  value,
  unit,
  icon,
  tone,
  active,
  ltr,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  tone: string;
  active: boolean;
  ltr?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-line bg-card p-3 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] dark:border-night-line dark:bg-night-card">
      <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-sub dark:text-night-sub">
        {icon} {label}
      </span>
      <span
        dir={ltr ? "ltr" : undefined}
        className={`mt-1 font-latin text-[15px] font-extrabold leading-none ${active ? tone : "text-faint"}`}
      >
        {value}
        {unit && <span className="ml-0.5 text-[8px] font-bold text-faint"> {unit}</span>}
      </span>
    </div>
  );
}
