interface P {
  className?: string;
  size?: number;
}

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconPower = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3v9" />
    <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
  </svg>
);

export const IconBolt = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
  </svg>
);

export const IconHome = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z" />
    <path d="M9 21v-7h6v7" />
  </svg>
);

export const IconGlobe = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
  </svg>
);

export const IconChart = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

export const IconGear = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.9 19.4l-.1.1A2 2 0 1 1 5 16.7l.1-.1A1.6 1.6 0 0 0 4 13.9H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7.9l-.1-.1A2 2 0 1 1 7.3 5l.1.1A1.6 1.6 0 0 0 10 4V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1A2 2 0 1 1 19.6 7l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1.3Z" />
  </svg>
);

export const IconSearch = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const IconMenu = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const IconShield = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3 5 6v6c0 4.4 3 8.2 7 9 4-.8 7-4.6 7-9V6l-7-3Z" />
    <path d="m9.2 12 2 2 3.6-3.8" />
  </svg>
);

export const IconStar = ({ className, size, filled }: P & { filled?: boolean }) => (
  <svg {...base(size)} className={className} fill={filled ? "currentColor" : "none"}>
    <path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8L12 3.6Z" />
  </svg>
);

export const IconChevron = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m14 6-6 6 6 6" />
  </svg>
);

export const IconDown = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 4v14M6 13l6 6 6-6" />
  </svg>
);

export const IconUp = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 20V6M6 11l6-6 6 6" />
  </svg>
);

export const IconRefresh = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M21 12a9 9 0 1 1-2.6-6.4" />
    <path d="M21 4v5h-5" />
  </svg>
);

export const IconQr = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3v3h-3zM20 14h1M14 20h3M20 18v3" />
  </svg>
);

export const IconPlus = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconTrash = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </svg>
);

export const IconCheck = ({ className, size }: P) => (
  <svg {...base(size)} className={className} strokeWidth={2.4}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const IconClose = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconRadar = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <path d="M12 12 18 6" />
  </svg>
);
