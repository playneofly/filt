export default function Phone({ children, glow }: { children: React.ReactNode; glow?: boolean }) {
  return (
    <div className="relative">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -inset-16 rounded-full blur-[70px] transition-opacity duration-1000"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--glow) 45%, transparent), transparent 65%)",
          opacity: glow ? 0.75 : 0.28,
        }}
      />
      <div
        className="relative h-[760px] w-[372px] rounded-[54px] p-[11px]"
        style={{
          background: "linear-gradient(160deg, #2a2a36, #0d0d14 45%, #24242f)",
          boxShadow: "0 50px 90px -30px rgba(0,0,0,.9), inset 0 0 0 1px rgba(255,255,255,.06)",
        }}
      >
        {/* side buttons */}
        <span className="absolute -right-[3px] top-[168px] h-14 w-[3px] rounded-l-full bg-[#33333f]" />
        <span className="absolute -right-[3px] top-[238px] h-14 w-[3px] rounded-l-full bg-[#33333f]" />
        <span className="absolute -left-[3px] top-[200px] h-20 w-[3px] rounded-r-full bg-[#33333f]" />

        <div className="relative h-full w-full overflow-hidden rounded-[44px]" style={{ background: "var(--bg)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
