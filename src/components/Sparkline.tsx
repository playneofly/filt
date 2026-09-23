interface Props {
  down: number[];
  up: number[];
  height?: number;
}

function path(vals: number[], w: number, h: number, max: number) {
  if (!vals.length) return "";
  const step = w / (vals.length - 1);
  const pts = vals.map((v, i) => [i * step, h - (Math.min(v, max) / max) * (h - 4) - 2] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

export default function Sparkline({ down, up, height = 62 }: Props) {
  const w = 320;
  const h = height;
  const max = Math.max(600_000, ...down, ...up) * 1.15;
  const dl = path(down, w, h, max);
  const ul = path(up, w, h, max);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full" style={{ direction: "ltr" }}>
      <defs>
        <linearGradient id="gdown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1="0" x2={w} y1={h * p} y2={h * p} stroke="var(--stroke)" strokeWidth="0.6" />
      ))}

      {dl && <path d={`${dl} L ${w} ${h} L 0 ${h} Z`} fill="url(#gdown)" />}
      {ul && <path d={`${ul} L ${w} ${h} L 0 ${h} Z`} fill="url(#gup)" />}
      {ul && <path d={ul} fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />}
      {dl && <path d={dl} fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );
}
