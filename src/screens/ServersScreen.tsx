import { useMemo, useRef, useState } from "react";
import { GROUPS, SERVERS, pingTone, type Server } from "../lib/data";
import { Chip, Flag, SignalBars } from "../components/Bits";
import { IconCheck, IconPlus, IconQr, IconRefresh, IconSearch, IconStar, IconTrash } from "../components/Icons";
import type { useApp } from "../lib/useApp";

type App = ReturnType<typeof useApp>;

export default function ServersScreen({ app }: { app: App }) {
  const [group, setGroup] = useState("all");
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<string[]>(SERVERS.filter((s) => s.favorite).map((s) => s.id));
  const [removed, setRemoved] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);

  const list = useMemo(() => {
    let l = SERVERS.filter((s) => !removed.includes(s.id));
    if (group === "fav") l = l.filter((s) => favs.includes(s.id));
    else if (group !== "all") l = l.filter((s) => s.group === group);
    if (q.trim())
      l = l.filter((s) =>
        (s.name + s.city + s.country + s.protocol).toLowerCase().includes(q.trim().toLowerCase())
      );
    return l;
  }, [group, q, favs, removed]);

  const counts = (id: string) =>
    id === "all"
      ? SERVERS.length - removed.length
      : id === "fav"
        ? favs.length
        : SERVERS.filter((s) => s.group === id && !removed.includes(s.id)).length;

  const doRefresh = () => {
    setRefreshing(true);
    app.notify("در حال به‌روزرسانی سابسکریپشن‌ها…");
    window.setTimeout(() => {
      setRefreshing(false);
      app.notify("۳ سرور جدید اضافه شد");
    }, 1800);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* search */}
      <div className="px-4 pb-2">
        <div className="glass flex items-center gap-2 rounded-[16px] px-3 py-2.5">
          <IconSearch size={16} className="opacity-50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جست‌وجوی سرور، کشور یا پروتکل…"
            className="w-full bg-transparent text-[12px] outline-none placeholder:text-[color:var(--muted)]"
          />
          <button onClick={doRefresh} style={{ color: "var(--muted)" }}>
            <IconRefresh size={15} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* group chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2.5">
        {GROUPS.map((g) => {
          const active = g.id === group;
          return (
            <button
              key={g.id}
              onClick={() => setGroup(g.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-all duration-300"
              style={{
                background: active
                  ? "linear-gradient(120deg, color-mix(in srgb, var(--accent) 30%, transparent), color-mix(in srgb, var(--accent-2) 20%, transparent))"
                  : "var(--surface)",
                border: `1px solid ${active ? "color-mix(in srgb, var(--accent) 45%, transparent)" : "var(--stroke)"}`,
                color: active ? "var(--text)" : "var(--muted)",
              }}
            >
              {g.label}
              <span
                className="num rounded-full px-1.5 text-[9.5px]"
                style={{ background: active ? "rgba(255,255,255,.14)" : "var(--surface-2)" }}
              >
                {counts(g.id)}
              </span>
            </button>
          );
        })}
      </div>

      {/* pull to refresh hint */}
      {(refreshing || pull > 10) && (
        <div className="flex items-center justify-center gap-1.5 pb-1 text-[10px]" style={{ color: "var(--accent)" }}>
          <IconRefresh size={12} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "در حال به‌روزرسانی…" : "رها کنید تا به‌روز شود"}
        </div>
      )}

      {/* list */}
      <div
        className="no-scrollbar flex-1 overflow-y-auto px-3 pb-3"
        onTouchStart={(e) => (startY.current = e.touches[0].clientY)}
        onTouchMove={(e) => {
          if (startY.current === null) return;
          const el = e.currentTarget;
          if (el.scrollTop <= 0) setPull(Math.max(0, e.touches[0].clientY - startY.current));
        }}
        onTouchEnd={() => {
          if (pull > 60) doRefresh();
          setPull(0);
          startY.current = null;
        }}
      >
        {refreshing &&
          [0, 1, 2].map((i) => <div key={i} className="skeleton mb-2 h-[68px] rounded-[20px]" />)}

        {!refreshing && list.length === 0 && <Empty />}

        {!refreshing &&
          list.map((s, i) => (
            <Row
              key={s.id}
              s={s}
              i={i}
              app={app}
              fav={favs.includes(s.id)}
              onFav={() =>
                setFavs((f) => (f.includes(s.id) ? f.filter((x) => x !== s.id) : [...f, s.id]))
              }
              onRemove={() => {
                setRemoved((r) => [...r, s.id]);
                app.notify(`«${s.city}» حذف شد`);
              }}
            />
          ))}
      </div>
    </div>
  );
}

function Row({
  s,
  i,
  app,
  fav,
  onFav,
  onRemove,
}: {
  s: Server;
  i: number;
  app: App;
  fav: boolean;
  onFav: () => void;
  onRemove: () => void;
}) {
  const [dx, setDx] = useState(0);
  const start = useRef<number | null>(null);
  const ping = app.pings[s.id] ?? null;
  const tone = pingTone(ping);
  const active = app.selected === s.id;

  const end = () => {
    if (dx < -96) onRemove();
    else if (dx > 96) app.testOne(s.id);
    setDx(0);
    start.current = null;
  };

  return (
    <div className="relative mb-2 overflow-hidden rounded-[20px]">
      {/* swipe backgrounds */}
      <div className="absolute inset-0 flex items-center justify-between px-5">
        <span
          className="flex items-center gap-1.5 text-[11px] font-semibold"
          style={{ color: "var(--bad)", opacity: dx < -20 ? 1 : 0 }}
        >
          <IconTrash size={15} /> حذف
        </span>
        <span
          className="flex items-center gap-1.5 text-[11px] font-semibold"
          style={{ color: "var(--accent-2)", opacity: dx > 20 ? 1 : 0 }}
        >
          <IconRefresh size={15} /> تست پینگ
        </span>
      </div>

      <div
        onTouchStart={(e) => (start.current = e.touches[0].clientX)}
        onTouchMove={(e) => {
          if (start.current === null) return;
          setDx(Math.max(-140, Math.min(140, e.touches[0].clientX - start.current)));
        }}
        onTouchEnd={end}
        onClick={() => {
          app.setSelected(s.id);
          app.notify(`«${s.city}» انتخاب شد`);
        }}
        className="anim-rise relative flex cursor-pointer items-center gap-3 rounded-[20px] p-2.5 transition-[background,border-color] duration-300"
        style={{
          animationDelay: `${Math.min(i, 8) * 45}ms`,
          transform: `translateX(${dx}px)`,
          transition: start.current === null ? "transform .3s cubic-bezier(.2,1,.3,1)" : "none",
          background: active
            ? "linear-gradient(110deg, color-mix(in srgb, var(--accent) 18%, transparent), var(--surface))"
            : "var(--surface)",
          border: `1px solid ${active ? "color-mix(in srgb, var(--accent) 45%, transparent)" : "var(--stroke)"}`,
        }}
      >
        {/* left ping bar */}
        <span
          className="absolute bottom-3 right-0 top-3 w-[3px] rounded-l-full"
          style={{ background: tone.color, opacity: ping ? 0.9 : 0.25 }}
        />

        <Flag emoji={s.flag} size={40} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[12.5px] font-bold">{s.city}</span>
            {active && (
              <span
                className="grid h-[15px] w-[15px] place-items-center rounded-full"
                style={{ background: "var(--accent)", color: "#07050f" }}
              >
                <IconCheck size={10} />
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Chip tone="accent">{s.protocol}</Chip>
            <Chip>{s.network}</Chip>
            <Chip>{s.tls}</Chip>
          </div>
          {/* load bar */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="h-[3px] w-16 overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${s.load * 100}%`,
                  background: s.load > 0.7 ? "var(--bad)" : s.load > 0.45 ? "var(--warn)" : "var(--ok)",
                }}
              />
            </div>
            <span className="text-[9px]" style={{ color: "var(--muted)" }}>
              بار {Math.round(s.load * 100)}٪
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <SignalBars ping={ping} />
          <span className="num text-[10.5px] font-bold" style={{ color: tone.color }}>
            {ping ? `${ping}` : "—"}
            <span className="text-[8px] font-normal" style={{ color: "var(--muted)" }}>
              {ping ? " ms" : ""}
            </span>
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFav();
          }}
          style={{ color: fav ? "var(--warn)" : "var(--muted)" }}
        >
          <IconStar size={16} filled={fav} />
        </button>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div
        className="grid h-24 w-24 place-items-center rounded-full"
        style={{ background: "var(--accent-soft)", animation: "float-y 3.4s ease-in-out infinite" }}
      >
        <IconQr size={40} className="text-[color:var(--accent)]" />
      </div>
      <div className="mt-4 text-[14px] font-bold">هنوز سروری اینجا نیست</div>
      <div className="mt-1 max-w-[220px] text-[11px]" style={{ color: "var(--muted)" }}>
        با اسکن کد QR یا افزودن لینک سابسکریپشن شروع کنید
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[11.5px] font-bold"
          style={{ background: "linear-gradient(120deg, var(--accent-2), var(--accent))", color: "#07050f" }}
        >
          <IconQr size={14} /> اسکن QR
        </button>
        <button className="glass-2 flex items-center gap-1.5 rounded-full px-4 py-2 text-[11.5px] font-bold">
          <IconPlus size={14} /> افزودن لینک
        </button>
      </div>
    </div>
  );
}
