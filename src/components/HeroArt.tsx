/** Decorative hero illustration: a bid file moving through requirements, evidence, forms and review. */
export function HeroArt() {
  const tabs = ["Requirements", "Evidence", "Forms", "Review"];
  return (
    <div className="hero-art" aria-hidden="true">
      <svg viewBox="0 0 440 400" role="presentation">
        <defs>
          <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f3eee2" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#14233f" floodOpacity="0.14" />
          </filter>
        </defs>
        <ellipse cx="220" cy="372" rx="170" ry="14" fill="#14233f" opacity="0.07" />
        {/* back sheets */}
        <rect x="92" y="58" width="250" height="300" rx="10" fill="#e9e2d2" transform="rotate(-6 217 208)" />
        <rect x="100" y="50" width="250" height="300" rx="10" fill="#efe9dc" transform="rotate(3 225 200)" />
        {/* main sheet */}
        <g filter="url(#shadow)">
          <rect x="86" y="40" width="262" height="316" rx="10" fill="url(#paper)" stroke="#d9d0bd" />
        </g>
        <rect x="110" y="66" width="120" height="10" rx="5" fill="#14233f" />
        <rect x="110" y="86" width="180" height="6" rx="3" fill="#c9c0ad" />
        <rect x="110" y="98" width="150" height="6" rx="3" fill="#c9c0ad" />
        {tabs.map((t, i) => {
          const y = 132 + i * 52;
          const done = i < 3;
          return (
            <g key={t}>
              <rect x="108" y={y} width="218" height="40" rx="8" fill={done ? "#e6f1ef" : "#fbf8f1"} stroke={done ? "#9cc9c2" : "#ddd4c1"} />
              <circle cx="130" cy={y + 20} r="10" fill={done ? "#0f766e" : "none"} stroke={done ? "none" : "#9aa3b2"} strokeWidth="1.6" strokeDasharray={done ? undefined : "3 3"} />
              {done && <path d={`M125 ${y + 20} l3.5 3.5 6.5-7`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
              <text x="150" y={y + 25} fontSize="14" fontFamily="var(--font-body), sans-serif" fill="#14233f">{t}</text>
              <rect x={260} y={y + 16} width={48} height={8} rx={4} fill={done ? "#9cc9c2" : "#e4dccb"} />
            </g>
          );
        })}
        {/* reviewer pen */}
        <g transform="rotate(38 370 120)">
          <rect x="356" y="40" width="16" height="150" rx="5" fill="#14233f" />
          <rect x="356" y="62" width="16" height="10" fill="#0f766e" />
          <path d="M356 190 l8 22 8-22z" fill="#d9b779" />
        </g>
      </svg>
    </div>
  );
}
