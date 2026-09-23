import { useState } from "react";
import { PALETTES, type PaletteId } from "../lib/data";
import { Toggle } from "../components/Bits";
import { IconBolt, IconChevron, IconGlobe, IconQr, IconRefresh, IconShield } from "../components/Icons";

interface Props {
  palette: PaletteId;
  setPalette: (p: PaletteId) => void;
  notify: (m: string) => void;
}

export default function SettingsScreen({ palette, setPalette, notify }: Props) {
  const [autoTest, setAutoTest] = useState(true);
  const [battery, setBattery] = useState(false);
  const [killSwitch, setKillSwitch] = useState(true);
  const [motion, setMotion] = useState(true);

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
      {/* theme picker */}
      <Section title="پوسته و ظاهر" delay={0}>
        <div className="grid grid-cols-4 gap-2">
          {PALETTES.map((p) => {
            const active = p.id === palette;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPalette(p.id);
                  notify(`پوسته «${p.label}» اعمال شد`);
                }}
                className="flex flex-col items-center gap-1.5 rounded-[16px] p-2 transition-all duration-300"
                style={{
                  background: active ? "var(--accent-soft)" : "var(--surface)",
                  border: `1px solid ${active ? "color-mix(in srgb, var(--accent) 50%, transparent)" : "var(--stroke)"}`,
                }}
              >
                <span
                  className="h-8 w-8 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${p.b}, ${p.a})`,
                    boxShadow: active ? `0 0 14px ${p.a}88` : "none",
                    transform: active ? "scale(1.06)" : "scale(1)",
                    transition: "all .3s",
                  }}
                />
                <span className="text-[9.5px] font-semibold" style={{ color: active ? "var(--text)" : "var(--muted)" }}>
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="اتصال" delay={60}>
        <Row icon={<IconBolt size={15} />} title="بررسی خودکار سلامت سرور" sub="در صورت افت کیفیت، خودکار به بهترین سرور سوییچ می‌کند">
          <Toggle on={autoTest} onChange={setAutoTest} />
        </Row>
        <Row icon={<IconShield size={15} />} title="قطع‌کننده اضطراری (Kill Switch)" sub="در صورت قطع تونل، اینترنت مسدود می‌شود">
          <Toggle on={killSwitch} onChange={setKillSwitch} />
        </Row>
        <Row icon={<IconRefresh size={15} />} title="حالت صرفه‌جویی باتری" sub="کندتر کردن به‌روزرسانی پس‌زمینه">
          <Toggle on={battery} onChange={setBattery} />
        </Row>
        <Row icon={<IconBolt size={15} />} title="جلوه‌های حرکتی" sub="پالس، ذرات و انیمیشن‌های صفحه اصلی">
          <Toggle on={motion} onChange={setMotion} />
        </Row>
      </Section>

      <Section title="مدیریت" delay={120}>
        {[
          { i: <IconGlobe size={15} />, t: "سابسکریپشن‌ها", s: "۳ لینک فعال" },
          { i: <IconShield size={15} />, t: "پروکسی بر اساس برنامه", s: "۱۲ اپ انتخاب شده" },
          { i: <IconRefresh size={15} />, t: "قواعد مسیریابی", s: "حالت: دور زدن ایران" },
          { i: <IconQr size={15} />, t: "پشتیبان‌گیری و بازیابی", s: "آخرین نسخه: دیروز" },
        ].map((r) => (
          <button key={r.t} className="flex w-full items-center gap-3 px-3.5 py-3 text-right transition-colors hover:bg-[var(--surface-2)]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
              {r.i}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-semibold">{r.t}</span>
              <span className="block text-[9.5px]" style={{ color: "var(--muted)" }}>
                {r.s}
              </span>
            </span>
            <IconChevron size={15} className="opacity-35" />
          </button>
        ))}
      </Section>

      <div className="mt-4 text-center">
        <div className="text-[11px] font-bold accent-text">FILTERNET</div>
        <div className="mt-0.5 text-[9.5px]" style={{ color: "var(--muted)" }}>
          نسخه ۲.۰.۰ — بازطراحی کامل · هسته Xray 25.x
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) {
  return (
    <div className="anim-rise mt-3 first:mt-1" style={{ animationDelay: `${delay}ms` }}>
      <div className="mb-1.5 px-1 text-[10.5px] font-semibold" style={{ color: "var(--muted)" }}>
        {title}
      </div>
      <div className="glass overflow-hidden rounded-[20px]">{children}</div>
    </div>
  );
}

function Row({
  icon,
  title,
  sub,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-3" style={{ borderBottom: "1px solid var(--stroke)" }}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-semibold">{title}</div>
        <div className="text-[9.5px] leading-tight" style={{ color: "var(--muted)" }}>
          {sub}
        </div>
      </div>
      {children}
    </div>
  );
}
