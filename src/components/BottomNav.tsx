import { IconChart, IconGear, IconGlobe, IconHome } from "./Icons";

export type Tab = "home" | "servers" | "stats" | "settings";

const TABS: { id: Tab; label: string; Icon: typeof IconHome }[] = [
  { id: "home", label: "خانه", Icon: IconHome },
  { id: "servers", label: "سرورها", Icon: IconGlobe },
  { id: "stats", label: "آمار", Icon: IconChart },
  { id: "settings", label: "تنظیمات", Icon: IconGear },
];

export default function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const idx = TABS.findIndex((t) => t.id === tab);
  return (
    <div className="relative shrink-0 px-3 pb-2 pt-1">
      <div
        className="glass relative flex items-center justify-between overflow-hidden rounded-[24px] px-1.5 py-1.5"
        style={{ boxShadow: "0 -6px 30px rgba(0,0,0,.45)" }}
      >
        {/* animated capsule indicator */}
        <span
          className="absolute top-1.5 bottom-1.5 rounded-[19px] transition-all duration-[420ms]"
          style={{
            width: "calc(25% - 6px)",
            right: `calc(${idx * 25}% + 3px)`,
            background: "linear-gradient(140deg, color-mix(in srgb, var(--accent) 34%, transparent), color-mix(in srgb, var(--accent-2) 20%, transparent))",
            border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
            transitionTimingFunction: "cubic-bezier(.34,1.4,.4,1)",
          }}
        />
        {TABS.map(({ id, label, Icon }) => {
          const active = id === tab;
          return (
            <button
              key={id}
              onClick={() => onTab(id)}
              className="relative z-10 flex flex-1 flex-col items-center gap-[3px] py-1.5 transition-all duration-300"
              style={{ color: active ? "var(--text)" : "var(--muted)" }}
            >
              <Icon size={19} className={active ? "drop-shadow-[0_0_6px_var(--glow)]" : ""} />
              <span className="text-[9.5px] font-medium" style={{ opacity: active ? 1 : 0.75 }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
