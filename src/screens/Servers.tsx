import { useMemo, useState } from "react";
import { Check, Crown, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { SERVERS, faDigits, pingQuality, type Server } from "../lib/core";
import { LatencyBars, SectionTitle } from "../components/ui";

interface Props {
  selectedId: string;
  connected: boolean;
  onSelect: (s: Server) => void;
}

export function ServersScreen({ selectedId, connected, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim();
    if (!q) return SERVERS;
    return SERVERS.filter((s) => s.country.includes(q) || s.city.includes(q) || s.code.toLowerCase().includes(q.toLowerCase()));
  }, [query]);

  const best = SERVERS.find((s) => s.best)!;

  return (
    <div className="flex h-full flex-col px-5">
      <div className="anim-rise">
        <h1 className="text-[19px] font-extrabold tracking-tight text-ink dark:text-white">سرورها</h1>
        <p className="mt-0.5 text-[11px] font-medium text-sub dark:text-night-sub">
          {faDigits(SERVERS.length)} لوکیشن فعال · انتخاب هوشمند بر اساس پینگ
        </p>
      </div>

      {/* search */}
      <div className="anim-rise mt-3.5 flex items-center gap-2.5 rounded-2xl border border-line bg-card px-3.5 py-3 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.3)] focus-within:border-accent/50 dark:border-night-line dark:bg-night-card" style={{ animationDelay: "0.06s" }}>
        <Search size={15} className="shrink-0 text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی کشور یا شهر…"
          className="w-full bg-transparent text-[12.5px] font-medium text-ink outline-none placeholder:text-faint dark:text-white"
        />
        <SlidersHorizontal size={15} className="shrink-0 text-faint" />
      </div>

      {/* smart pick */}
      <button
        onClick={() => onSelect(best)}
        className="anim-rise pressable relative mt-3.5 flex items-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-l from-accent to-accent-2 p-[1.5px] text-right shadow-[0_14px_34px_-16px_rgba(94,102,241,0.7)]"
        style={{ animationDelay: "0.12s" }}
      >
        <div className="flex w-full items-center gap-3 rounded-[calc(1.5rem-1.5px)] bg-white/95 px-3.5 py-3 backdrop-blur dark:bg-night-card/95">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-md">
            <Sparkles size={17} />
          </div>
          <div className="flex-1">
            <p className="text-[12.5px] font-bold text-ink dark:text-white">اتصال هوشمند — {best.country}</p>
            <p className="mt-0.5 text-[10.5px] font-medium text-sub dark:text-night-sub">بهترین سرعت با پینگ {faDigits(best.ping)} میلی‌ثانیه</p>
          </div>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent">پیشنهاد</span>
        </div>
      </button>

      {/* list */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <SectionTitle hint={connected ? "انتخاب مجدد = اتصال دوباره" : "برای اتصال یکی را انتخاب کنید"}>همه لوکیشن‌ها</SectionTitle>
        <div className="nice-scroll min-h-0 flex-1 space-y-2 overflow-y-auto pb-24 pl-0.5">
          {list.map((s, i) => (
            <ServerRow key={s.id} server={s} index={i} selected={s.id === selectedId} onSelect={() => onSelect(s)} />
          ))}
          {list.length === 0 && (
            <div className="rounded-3xl border border-dashed border-line py-10 text-center text-[12px] font-medium text-faint dark:border-night-line">
              نتیجه‌ای یافت نشد
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServerRow({ server: s, selected, onSelect, index }: { server: Server; selected: boolean; onSelect: () => void; index: number }) {
  const q = pingQuality(s.ping);
  return (
    <button
      onClick={onSelect}
      style={{ animationDelay: `${Math.min(index * 0.045, 0.35)}s` }}
      className={`anim-rise pressable flex w-full items-center gap-3 rounded-2xl border p-3 text-right transition-all duration-300 ${
        selected
          ? "border-accent/50 bg-accent/[0.06] shadow-[0_10px_26px_-16px_rgba(74,108,247,0.5)] dark:border-accent/40"
          : "border-line bg-card hover:border-slate-300 dark:border-night-line dark:bg-night-card dark:hover:border-white/15"
      }`}
    >
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${s.gradient} font-latin text-[11.5px] font-extrabold text-white`}>
        {s.code}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[13px] font-bold text-ink dark:text-white">{s.country}</span>
          {s.premium && <Crown size={11} className="shrink-0 text-amber-soft" />}
        </div>
        <p className="mt-0.5 truncate text-[10.5px] font-medium text-sub dark:text-night-sub">
          {s.city} · بار سرور {faDigits(s.load)}٪
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <LatencyBars bars={q.bars} tone={q.tone} />
        <span className={`text-[10px] font-bold tabular-nums ${q.tone === "good" ? "text-mint" : q.tone === "mid" ? "text-amber-soft" : "text-rose-soft"}`}>
          {faDigits(s.ping)} ms
        </span>
      </div>
      <div
        className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border transition-all ${
          selected ? "border-transparent bg-gradient-to-br from-accent to-accent-2" : "border-slate-300 dark:border-white/20"
        }`}
      >
        {selected && <Check size={12} strokeWidth={3.5} className="text-white" />}
      </div>
    </button>
  );
}
