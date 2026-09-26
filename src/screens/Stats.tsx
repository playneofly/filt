import { ArrowDown, ArrowUp, CalendarDays, Flame, Infinity as InfinityIcon } from "lucide-react";
import { WEEK, faDigits, faTime } from "../lib/core";
import { SectionTitle } from "../components/ui";

interface Props {
  connected: boolean;
  seconds: number;
  down: number;
}

export function StatsScreen({ connected, seconds, down }: Props) {
  const total = WEEK.reduce((a, b) => a + b.value, 0);
  const max = Math.max(...WEEK.map((w) => w.value));
  const todayIdx = (new Date().getDay() + 1) % 7; // rough: شنبه-first

  return (
    <div className="nice-scroll h-full overflow-y-auto px-5 pb-24">
      <div className="anim-rise">
        <h1 className="text-[19px] font-extrabold tracking-tight text-ink dark:text-white">آمار مصرف</h1>
        <p className="mt-0.5 text-[11px] font-medium text-sub dark:text-night-sub">مرور داده‌ی مصرفی تونل شما</p>
      </div>

      {/* total hero */}
      <div className="anim-rise relative mt-3.5 overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-[#6366f1] to-accent-2 p-5 text-white shadow-[0_18px_40px_-16px_rgba(94,102,241,0.7)]" style={{ animationDelay: "0.06s" }}>
        <div className="absolute -left-10 -top-14 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-16 -right-6 h-44 w-44 rounded-full bg-black/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/85">
            <CalendarDays size={13} /> مصرف این هفته
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-latin text-[34px] font-extrabold leading-none">{faDigits(total.toFixed(1))}</span>
            <span className="font-latin text-[13px] font-bold text-white/80">GB</span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-[10.5px] font-semibold text-white/85">
            <span className="flex items-center gap-1"><ArrowDown size={12} /> {faDigits(17.4)} گیگ دانلود</span>
            <span className="flex items-center gap-1"><ArrowUp size={12} /> {faDigits(6.3)} گیگ آپلود</span>
          </div>
        </div>
      </div>

      {/* live session strip */}
      <div
        className="anim-rise mt-3 flex items-center gap-3 rounded-3xl border border-line bg-card p-3.5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] dark:border-night-line dark:bg-night-card"
        style={{ animationDelay: "0.12s" }}
      >
        <div className={`grid h-10 w-10 place-items-center rounded-2xl ${connected ? "bg-mint/10 text-mint" : "bg-slate-500/8 text-faint dark:bg-white/6"}`}>
          <Flame size={17} />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold text-ink dark:text-white">{connected ? "نشست فعال" : "نشستی فعال نیست"}</p>
          <p className="mt-0.5 font-latin text-[10.5px] font-semibold tracking-wider text-faint" dir="ltr">
            {connected ? faTime(seconds) : "00:00:00"}
          </p>
        </div>
        <div className="text-left">
          <p className="font-latin text-[13px] font-extrabold text-ink dark:text-white" dir="ltr">{connected ? down.toFixed(1) : "0.0"} Mbps</p>
          <p className="text-[9.5px] font-bold text-faint">سرعت لحظه‌ای</p>
        </div>
      </div>

      {/* weekly chart */}
      <div className="mt-5">
        <SectionTitle hint="گیگابایت در روز">روند هفتگی</SectionTitle>
        <div className="anim-rise rounded-3xl border border-line bg-card p-4 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] dark:border-night-line dark:bg-night-card" style={{ animationDelay: "0.16s" }}>
          <div className="flex h-32 items-end justify-between gap-2.5" dir="ltr">
            {WEEK.map((w, i) => {
              const isToday = i === todayIdx;
              return (
                <div key={i} className="group flex flex-1 flex-col items-center gap-1.5">
                  <span className={`text-[8.5px] font-bold opacity-0 transition-opacity group-hover:opacity-100 ${isToday ? "text-accent opacity-100" : "text-faint"}`}>
                    {faDigits(w.value)}
                  </span>
                  <div className="flex h-20 w-full items-end rounded-lg bg-snow dark:bg-white/[0.045]">
                    <div
                      className={`anim-bar w-full rounded-lg transition-all ${
                        isToday
                          ? "bg-gradient-to-t from-accent to-accent-2 shadow-[0_6px_14px_-4px_rgba(94,102,241,0.6)]"
                          : "bg-slate-300/80 group-hover:bg-accent/40 dark:bg-white/15"
                      }`}
                      style={{ height: `${(w.value / max) * 100}%`, animationDelay: `${0.2 + i * 0.06}s` }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${isToday ? "text-accent" : "text-faint"}`}>{w.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* plan card */}
      <div className="anim-rise mt-3.5 flex items-center gap-3 rounded-3xl border border-amber-soft/25 bg-gradient-to-l from-amber-soft/12 to-transparent p-4 dark:border-amber-soft/20 dark:from-amber-soft/8" style={{ animationDelay: "0.2s" }}>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-soft/15 text-amber-soft">
          <InfinityIcon size={18} />
        </div>
        <div className="flex-1">
          <p className="text-[12.5px] font-bold text-ink dark:text-white">پلن شما: نامحدود</p>
          <p className="mt-0.5 text-[10.5px] font-medium text-sub dark:text-night-sub">تا پایان اشترک ۲۶ روز باقی مانده است</p>
        </div>
        <button className="pressable rounded-full bg-white px-3.5 py-1.5 text-[10.5px] font-bold text-ink shadow-sm ring-1 ring-line dark:bg-white/10 dark:text-white dark:ring-white/10">
          تمدید
        </button>
      </div>
    </div>
  );
}
