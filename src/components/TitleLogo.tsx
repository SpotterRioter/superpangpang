export function TitleLogo() {
  return (
    <svg
      viewBox="0 0 640 165"
      className="w-full max-w-[540px] h-auto drop-shadow-[0_10px_24px_rgba(0,0,0,0.75)] select-none"
      role="img"
      aria-label="Super Pang World Tour"
    >
      <defs>
        <linearGradient id="goldMain" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="35%" stopColor="#fde047" />
          <stop offset="68%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="cyanWing" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="globeGrad" x1="20%" y1="15%" x2="80%" y2="85%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>

      {/* Aviator Wings Emblem behind title */}
      <g opacity="0.95">
        <path
          d="M175 56 L66 36 L88 54 L52 56 L80 71 L66 80 L175 74 Z"
          fill="url(#cyanWing)"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M465 56 L574 36 L552 54 L588 56 L560 71 L574 80 L465 74 Z"
          fill="url(#cyanWing)"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Central globe crest */}
        <circle cx="320" cy="40" r="24" fill="url(#globeGrad)" stroke="#fde047" strokeWidth="3" />
        <ellipse cx="320" cy="40" rx="11" ry="23" fill="none" stroke="#bae6fd" strokeWidth="1.5" opacity="0.7" />
        <line x1="297" y1="40" x2="343" y2="40" stroke="#bae6fd" strokeWidth="1.5" opacity="0.7" />
        {/* Orbiting Pang bubble accent */}
        <circle cx="352" cy="24" r="8" fill="#fb7185" stroke="#0f172a" strokeWidth="2" />
        <circle cx="349.5" cy="21.5" r="2.2" fill="#ffffff" />
      </g>

      {/* Bold 3D Extruded Arcade Title */}
      <text
        x="320"
        y="112"
        textAnchor="middle"
        fontFamily="'Press Start 2P', monospace"
        fontSize="50"
        fill="#0b1120"
        stroke="#0b1120"
        strokeWidth="14"
        strokeLinejoin="round"
        transform="translate(0, 5)"
      >
        SUPER PANG
      </text>
      <text
        x="320"
        y="112"
        textAnchor="middle"
        fontFamily="'Press Start 2P', monospace"
        fontSize="50"
        fill="url(#goldMain)"
        stroke="#450a0a"
        strokeWidth="3.5"
        strokeLinejoin="round"
      >
        SUPER PANG
      </text>

      {/* World Tour Ribbon Subtitle */}
      <g transform="translate(0, 128)">
        <line x1="126" y1="14" x2="206" y2="14" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
        <line x1="434" y1="14" x2="514" y2="14" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
        <text
          x="320"
          y="20"
          textAnchor="middle"
          fontFamily="'Chakra Petch', sans-serif"
          fontWeight="700"
          fontSize="19"
          letterSpacing="5.5"
          fill="#e0f2fe"
        >
          WORLD TOUR · 24 DESTINOS
        </text>
      </g>
    </svg>
  );
}
