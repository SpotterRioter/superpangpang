import { CHARACTERS } from '../game/story';
import { CharacterId, PortraitMood } from '../game/types';

interface CharacterPortraitProps {
  character: CharacterId;
  mood?: PortraitMood;
  size?: 'sm' | 'md' | 'lg';
}

export function CharacterPortrait({
  character,
  mood = 'determined',
  size = 'lg'
}: CharacterPortraitProps) {
  const profile = CHARACTERS[character];
  const dim = size === 'sm' ? 'w-11 h-11' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24 sm:w-28 sm:h-28';

  const browTilt =
    mood === 'urgent' || mood === 'determined' || mood === 'serious'
      ? 2.2
      : mood === 'surprised'
      ? -2.5
      : 0;

  return (
    <div
      className={`relative ${dim} rounded-2xl overflow-hidden shrink-0 border-2 shadow-[0_8px_24px_rgba(0,0,0,0.65)]`}
      style={{
        borderColor: profile.accentColor,
        background: `radial-gradient(circle at 50% 28%, ${profile.accentColor}33 0%, ${profile.badgeBg} 68%, #050814 100%)`
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full block">
        {/* Subtle tactical radar grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {character === 'leo' && (
          <g>
            {/* Bomber jacket & iconic red scarf */}
            <path d="M16 100 C18 76, 82 76, 84 100 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <path d="M28 79 L50 94 L72 79 L64 74 L50 84 L36 74 Z" fill="#fef3c7" />
            <path d="M26 73 Q50 84 74 73 L78 85 Q50 94 22 85 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
            {/* Neck & Face */}
            <rect x="42" y="62" width="16" height="14" rx="5" fill="#eab082" />
            <ellipse cx="50" cy="48" rx="21" ry="23" fill="#f6c297" stroke="#5c3422" strokeWidth="1.8" />
            {/* Leather Aviator Helmet */}
            <path d="M26 46 C25 20, 75 20, 74 46 L76 58 L69 56 L68 42 Q50 34 32 42 L31 56 L24 58 Z" fill="#6b341c" stroke="#2d150b" strokeWidth="2" />
            {/* Hair tuft */}
            <path d="M42 35 L48 29 L53 36 L59 31 L56 39 Z" fill="#451a03" />
            {/* Gleaming Brass Goggles */}
            <rect x="27" y="25" width="46" height="9" rx="4" fill="#291d18" />
            <rect x="30" y="22" width="18" height="13" rx="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.8" />
            <rect x="52" y="22" width="18" height="13" rx="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.8" />
            <rect x="33" y="24.5" width="12" height="8" rx="3" fill="#38bdf8" />
            <rect x="55" y="24.5" width="12" height="8" rx="3" fill="#38bdf8" />
            <line x1="35" y1="26" x2="41" y2="26" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="57" y1="26" x2="63" y2="26" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            {/* Eyes & Brows */}
            <line x1="36" y1={43 - browTilt} x2="45" y2={43 + browTilt} stroke="#451a03" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="64" y1={43 - browTilt} x2="55" y2={43 + browTilt} stroke="#451a03" strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="41" cy="49" rx="3.2" ry={mood === 'surprised' ? 4.4 : 3.5} fill="#1e1b4b" />
            <ellipse cx="59" cy="49" rx="3.2" ry={mood === 'surprised' ? 4.4 : 3.5} fill="#1e1b4b" />
            <circle cx="42" cy="47.8" r="1.1" fill="#ffffff" />
            <circle cx="60" cy="47.8" r="1.1" fill="#ffffff" />
            {/* Mouth */}
            {mood === 'happy' ? (
              <path d="M42 59 Q50 66 58 59 Z" fill="#ffffff" stroke="#7f1d1d" strokeWidth="1.6" />
            ) : mood === 'surprised' ? (
              <circle cx="50" cy="60" r="3.6" fill="#7f1d1d" />
            ) : (
              <path d="M43 60 Q50 63 58 58.5" fill="none" stroke="#7f1d1d" strokeWidth="2.2" strokeLinecap="round" />
            )}
          </g>
        )}

        {character === 'maya' && (
          <g>
            {/* Back sleek dark hair */}
            <path d="M25 46 C23 22, 77 22, 75 46 L79 72 L21 72 Z" fill="#0f172a" />
            {/* Lab coat & cyan tech collar */}
            <path d="M16 100 C20 76, 80 76, 84 100 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <path d="M37 77 L50 96 L63 77 Z" fill="#0891b2" />
            {/* Neck & Face */}
            <rect x="43" y="63" width="14" height="13" rx="5" fill="#ecc4a6" />
            <ellipse cx="50" cy="48" rx="19.5" ry="22" fill="#fde2cc" stroke="#644134" strokeWidth="1.6" />
            {/* Sleek bangs */}
            <path d="M28 45 C30 23, 72 23, 72 45 Q60 33 48 39 Q38 33 28 45 Z" fill="#1e293b" />
            {/* Cyan Telemetry Visor Glasses */}
            <rect x="33" y="44" width="14" height="9" rx="3" fill="rgba(34,211,238,0.22)" stroke="#22d3ee" strokeWidth="1.8" />
            <rect x="53" y="44" width="14" height="9" rx="3" fill="rgba(34,211,238,0.22)" stroke="#22d3ee" strokeWidth="1.8" />
            <line x1="47" y1="48" x2="53" y2="48" stroke="#22d3ee" strokeWidth="1.8" />
            {/* Eyes */}
            <line x1="35" y1={41 - browTilt * 0.7} x2="45" y2={41 + browTilt * 0.7} stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <line x1="65" y1={41 - browTilt * 0.7} x2="55" y2={41 + browTilt * 0.7} stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="40" cy="48.5" r="2.7" fill="#0f172a" />
            <circle cx="60" cy="48.5" r="2.7" fill="#0f172a" />
            <circle cx="41" cy="47.5" r="0.9" fill="#ffffff" />
            <circle cx="61" cy="47.5" r="0.9" fill="#ffffff" />
            {/* Comms Headset & Mic */}
            <circle cx="71" cy="50" r="5" fill="#0e7490" stroke="#67e8f9" strokeWidth="1.6" />
            <path d="M71 53 Q68 63 57 63" fill="none" stroke="#67e8f9" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="56" cy="63" r="2.2" fill="#22d3ee" />
            {/* Mouth */}
            {mood === 'happy' ? (
              <path d="M44 59 Q50 64 56 59" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" />
            ) : mood === 'surprised' || mood === 'urgent' ? (
              <ellipse cx="50" cy="60.5" rx="3.4" ry="2.8" fill="#9f1239" />
            ) : (
              <path d="M45 60 Q50 61.5 55 59.5" fill="none" stroke="#be185d" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>
        )}

        {character === 'heitor' && (
          <g>
            {/* Tactical Aegis Commander Uniform */}
            <path d="M14 100 C17 75, 83 75, 86 100 Z" fill="#065f46" stroke="#064e3b" strokeWidth="2" />
            <rect x="24" y="79" width="12" height="5" rx="1" fill="#fbbf24" />
            <rect x="64" y="79" width="12" height="5" rx="1" fill="#fbbf24" />
            <path d="M40 76 L50 92 L60 76 Z" fill="#d1fae5" />
            {/* Neck & Squared Jaw Face */}
            <rect x="41" y="63" width="18" height="14" rx="4" fill="#b0754f" />
            <rect x="30" y="28" width="40" height="42" rx="15" fill="#c68860" stroke="#4a2c18" strokeWidth="1.8" />
            {/* Silver-templed Hair & Beard */}
            <path d="M30 53 C30 72, 70 72, 70 53 L67 59 Q50 68 33 59 Z" fill="#475569" />
            <path d="M40 57 Q50 54 60 57" fill="none" stroke="#cbd5e1" strokeWidth="3.2" strokeLinecap="round" />
            {/* Commander Visor Cap */}
            <path d="M24 34 L76 34 L72 18 L28 18 Z" fill="#064e3b" stroke="#34d399" strokeWidth="1.6" />
            <path d="M25 34 Q50 40 75 34 L72 38 Q50 44 28 38 Z" fill="#0f172a" />
            <circle cx="50" cy="26" r="4" fill="#fbbf24" />
            {/* Eyes */}
            <line x1="35" y1={43 - browTilt} x2="45" y2={43 + browTilt} stroke="#e2e8f0" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="65" y1={43 - browTilt} x2="55" y2={43 + browTilt} stroke="#e2e8f0" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="40" cy="48" r="2.6" fill="#0f172a" />
            <circle cx="60" cy="48" r="2.6" fill="#0f172a" />
            {/* Mouth */}
            {mood === 'happy' ? (
              <path d="M43 60 Q50 65 57 60" fill="none" stroke="#fef3c7" strokeWidth="2.2" strokeLinecap="round" />
            ) : (
              <line x1="44" y1="61" x2="56" y2="61" stroke="#291811" strokeWidth="2.2" strokeLinecap="round" />
            )}
          </g>
        )}

        {character === 'vesper' && (
          <g>
            {/* High aristocratic crimson cape collar */}
            <path d="M12 72 L30 98 L70 98 L88 72 L72 64 L50 82 L28 64 Z" fill="#881337" stroke="#f43f5e" strokeWidth="1.8" />
            <path d="M16 100 C20 79, 80 79, 84 100 Z" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1.6" />
            {/* Pale angular face */}
            <rect x="43" y="63" width="14" height="14" fill="#cbd5e1" />
            <path d="M31 32 C31 18, 69 18, 69 32 L66 56 L50 70 L34 56 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="1.8" />
            {/* Swept silver-violet hair */}
            <path d="M28 40 C26 15, 74 15, 72 40 Q60 25 50 32 Q40 25 28 40 Z" fill="#c4b5fd" stroke="#4c1d95" strokeWidth="1.6" />
            {/* Cybernetic Prisma Monocle on right side (viewer's left) */}
            <circle cx="40" cy="47" r="7.5" fill="rgba(244, 63, 94, 0.28)" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="40" cy="47" r="3" fill="#f43f5e" />
            <line x1="32.5" y1="47" x2="26" y2="54" stroke="#fbbf24" strokeWidth="1.2" />
            {/* Other eye & sharp brow */}
            <line x1="34" y1="39" x2="46" y2="42" stroke="#312e81" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="66" y1="39" x2="54" y2="42" stroke="#312e81" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="60" cy="47" r="2.7" fill="#4c0519" />
            <circle cx="60.8" cy="46.2" r="0.9" fill="#f43f5e" />
            {/* Sharp goatee & theatrical smirk */}
            <path d="M47 64 L50 71 L53 64 Z" fill="#4c1d95" />
            {mood === 'surprised' || mood === 'urgent' ? (
              <ellipse cx="50" cy="59" rx="4" ry="2.8" fill="#4c0519" />
            ) : (
              <path d="M42 59 Q51 62 59 56" fill="none" stroke="#4c0519" strokeWidth="2.2" strokeLinecap="round" />
            )}
          </g>
        )}

        {character === 'aria' && (
          <g>
            {/* Orbital AI Halo Ring */}
            <ellipse cx="50" cy="48" rx="34" ry="12" fill="none" stroke="#c084fc" strokeWidth="1.6" strokeDasharray="5 3" transform="rotate(-18 50 48)" />
            {/* Sleek Synthetic Chassis */}
            <path d="M20 100 C24 78, 76 78, 80 100 Z" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
            <circle cx="50" cy="88" r="5.5" fill="#22d3ee" />
            {/* Pearlescent Android Helmet Head */}
            <rect x="30" y="22" width="40" height="46" rx="18" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            {/* Dark Visor Faceplate */}
            <rect x="34" y="34" width="32" height="22" rx="9" fill="#090d24" stroke="#c084fc" strokeWidth="1.5" />
            {/* Glowing LED Optics */}
            <ellipse cx="43" cy="44" rx="4.2" ry={mood === 'happy' ? 2 : 3.4} fill="#38bdf8" />
            <ellipse cx="57" cy="44" rx="4.2" ry={mood === 'happy' ? 2 : 3.4} fill="#38bdf8" />
            {/* Audio waveform mouth indicator */}
            <polyline
              points="42,52 46,52 48,49 50,54 52,49 54,52 58,52"
              fill="none"
              stroke={mood === 'urgent' ? '#f43f5e' : '#c084fc'}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Forehead star sensor */}
            <circle cx="50" cy="28" r="2.6" fill="#c084fc" />
          </g>
        )}
      </svg>

      {/* Subtle CRT scanline sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.45) 3px)'
        }}
      />
    </div>
  );
}
