import { useState } from "react";
import {
  BadgeInfo,
  ChevronLeft,
  FileKey2,
  Globe,
  Moon,
  Route,
  ShieldCheck,
  SplitSquareHorizontal,
  Sun,
  Zap,
} from "lucide-react";
import { SectionTitle, Switch } from "../components/ui";

interface Props {
  dark: boolean;
  onToggleTheme: () => void;
}

export function SettingsScreen({ dark, onToggleTheme }: Props) {
  const [auto, setAuto] = useState(true);
  const [kill, setKill] = useState(true);
  const [lan, setLan] = useState(false);
  const [obfs, setObfs] = useState(true);

  return (
    <div className="nice-scroll h-full overflow-y-auto px-5 pb-24">
      <div className="anim-rise">
        <h1 className="text-[19px] font-extrabold tracking-tight text-ink dark:text-white">تنظیمات</h1>
        <p className="mt-0.5 text-[11px] font-medium text-sub dark:text-night-sub">پیکربندی امنیت و اتصال</p>
      </div>

      {/* appearance */}
      <div className="mt-4">
        <SectionTitle>ظاهر برنامه</SectionTitle>
        <div className="anim-rise rounded-3xl border border-line bg-card p-1.5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] dark:border-night-line dark:bg-night-card" style={{ animationDelay: "0.05s" }}>
          <Row
            icon={dark ? <Moon size={16} className="text-accent-2" /> : <Sun size={16} className="text-amber-soft" />}
            title="حالت تیره"
            desc={dark ? "فعال — برای استفاده شبانه" : "غیرفعال — تم روشن"}
            end={<Switch on={dark} onToggle={onToggleTheme} />}
          />
        </div>
      </div>

      {/* connection */}
      <div className="mt-4">
        <SectionTitle>اتصال</SectionTitle>
        <div className="anim-rise divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card p-1.5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] dark:divide-night-line dark:border-night-line dark:bg-night-card" style={{ animationDelay: "0.09s" }}>
          <Row
            icon={<Zap size={16} className="text-accent" />}
            title="اتصال خودکار"
            desc="اتصال هنگام باز شدن برنامه"
            end={<Switch on={auto} onToggle={() => setAuto(!auto)} />}
          />
          <Row
            icon={<ShieldCheck size={16} className="text-mint" />}
            title="Kill Switch"
            desc="قطع اینترنت هنگام قطع شدن تونل"
            end={<Switch on={kill} onToggle={() => setKill(!kill)} />}
          />
          <Row
            icon={<SplitSquareHorizontal size={16} className="text-rose-soft" />}
            title="تونل تقسیمی (Per-App)"
            desc="انتخاب برنامه‌های عبوری از تونل"
            end={<ChevronLeft size={16} className="text-faint" />}
            clickable
          />
          <Row
            icon={<Route size={16} className="text-amber-soft" />}
            title="عبور LAN از تونل"
            desc="شبکه‌های محلی نیز رمزنگاری شوند"
            end={<Switch on={lan} onToggle={() => setLan(!lan)} />}
          />
        </div>
      </div>

      {/* protocol */}
      <div className="mt-4">
        <SectionTitle hint="پروتکل فعلی: VLESS">شبکه و پروتکل</SectionTitle>
        <div className="anim-rise divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card p-1.5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] dark:divide-night-line dark:border-night-line dark:bg-night-card" style={{ animationDelay: "0.13s" }}>
          <ProtocolChipRow />
          <Row
            icon={<FileKey2 size={16} className="text-accent-2" />}
            title="مخفی‌سازی ترافیک (Obfuscation)"
            desc="ترافیک شبیه HTTPS عادی دیده شود"
            end={<Switch on={obfs} onToggle={() => setObfs(!obfs)} />}
          />
          <Row
            icon={<Globe size={16} className="text-mint" />}
            title="DNS امن"
            desc="1.1.1.1 · DoH فعال"
            end={<ChevronLeft size={16} className="text-faint" />}
            clickable
            ltrDesc
          />
        </div>
      </div>

      {/* about */}
      <div className="mt-4">
        <SectionTitle>درباره</SectionTitle>
        <div className="anim-rise overflow-hidden rounded-3xl border border-line bg-card p-1.5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] dark:border-night-line dark:bg-night-card" style={{ animationDelay: "0.17s" }}>
          <Row
            icon={<BadgeInfo size={16} className="text-sub dark:text-night-sub" />}
            title="نسخه"
            desc="FILTERNET 2.0.0 — طراحی مفهومی"
            end={<span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9.5px] font-bold text-accent">جدید</span>}
            ltrDesc
          />
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  title,
  desc,
  end,
  clickable,
  ltrDesc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  end: React.ReactNode;
  clickable?: boolean;
  ltrDesc?: boolean;
}) {
  const Comp = clickable ? "button" : "div";
  return (
    <Comp className={`flex w-full items-center gap-3 rounded-[20px] p-3 text-right ${clickable ? "pressable" : ""}`}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-snow dark:bg-white/6">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-bold text-ink dark:text-white">{title}</p>
        <p dir={ltrDesc ? "ltr" : undefined} className={`mt-0.5 truncate text-[10px] font-medium text-sub dark:text-night-sub ${ltrDesc ? "text-right" : ""}`}>
          {desc}
        </p>
      </div>
      {end}
    </Comp>
  );
}

function ProtocolChipRow() {
  const [proto, setProto] = useState("VLESS");
  const protos = ["VLESS", "VMess", "Trojan", "SS"];
  return (
    <div className="p-3">
      <p className="text-[12.5px] font-bold text-ink dark:text-white">پروتکل اتصال</p>
      <p className="mt-0.5 text-[10px] font-medium text-sub dark:text-night-sub">بر اساس کانفیگ سرور به‌صورت خودکار انتخاب می‌شود</p>
      <div className="mt-2.5 flex gap-1.5" dir="ltr">
        {protos.map((p) => (
          <button
            key={p}
            onClick={() => setProto(p)}
            className={`pressable rounded-full px-3 py-1.5 font-latin text-[10.5px] font-bold transition-all ${
              proto === p
                ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-[0_6px_14px_-4px_rgba(94,102,241,0.6)]"
                : "bg-snow text-sub hover:text-ink dark:bg-white/6 dark:text-night-sub dark:hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
