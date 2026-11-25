import { BookOpen, Globe2, Music, Pause, Play, Trophy, Volume2, VolumeX } from 'lucide-react';
import { ACHIEVEMENTS } from '../game/achievements';
import { HudSnapshot } from '../game/types';

interface HudBarProps {
  hud: HudSnapshot;
  onOpenStages: () => void;
  onOpenJournal: () => void;
  onOpenAchievements: () => void;
  onToggleMusic: () => void;
  onToggleMute: () => void;
  onTogglePause: () => void;
}

export function HudBar({
  hud,
  onOpenStages,
  onOpenJournal,
  onOpenAchievements,
  onToggleMusic,
  onToggleMute,
  onTogglePause
}: HudBarProps) {
  const pct = Math.max(0, Math.min(100, (hud.timeRemaining / Math.max(1, hud.timeLimit)) * 100));
  const timerColor =
    pct < 20
      ? 'from-rose-600 to-red-400'
      : pct < 40
      ? 'from-amber-500 to-yellow-300'
      : 'from-teal-400 to-cyan-300';

  const activePowerups: { key: string; label: string; color: string }[] = [];
  if (hud.doubleTimer > 0) {
    activePowerups.push({
      key: 'double',
      label: `⇈ ${Math.ceil(hud.doubleTimer)}s`,
      color: 'text-cyan-300'
    });
  }
  if (hud.stickyTimer > 0) {
    activePowerups.push({
      key: 'sticky',
      label: `⚓ ${Math.ceil(hud.stickyTimer)}s`,
      color: 'text-amber-300'
    });
  }
  if (hud.hasShield) {
    activePowerups.push({ key: 'shield', label: 'ESCUDO', color: 'text-sky-300' });
  }
  if (hud.freezeTimer > 0) {
    activePowerups.push({
      key: 'freeze',
      label: `⏱ ${Math.ceil(hud.freezeTimer)}s`,
      color: 'text-purple-300'
    });
  }

  return (
    <header className="w-full flex items-center justify-between gap-2.5 sm:gap-3 px-3 sm:px-3.5 py-2 rounded-xl bg-[#0d1428] border border-[#2a3b68] shadow-[0_6px_20px_rgba(0,0,0,0.45)] shrink-0">
      {/* Left: Score, Record & Stage */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="flex flex-col leading-tight">
          <span className="font-arcade text-[8px] text-slate-400 tracking-wider">PONTOS</span>
          <span className="font-arcade text-xs sm:text-[13px] text-white tabular-nums mt-0.5">
            {String(hud.score).padStart(6, '0')}
          </span>
        </div>

        <div className="hidden md:flex flex-col leading-tight">
          <span className="font-arcade text-[8px] text-slate-400 tracking-wider">RECORDE</span>
          <span className="font-arcade text-xs sm:text-[13px] text-amber-300 tabular-nums mt-0.5">
            {String(hud.highScore).padStart(6, '0')}
          </span>
        </div>

        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-arcade text-[8px] text-slate-400 tracking-wider flex items-center gap-1.5">
            <span>
              {hud.gameMode === 'STORY' ? 'HISTÓRIA' : 'ARCADE'} ·{' '}
              {String(hud.levelId).padStart(2, '0')}/{hud.totalLevels}
            </span>
            {hud.bossActive && (
              <span className="text-rose-400 font-bold animate-pulse">[CHEFE]</span>
            )}
          </span>
          <span className="text-xs sm:text-sm font-bold text-cyan-200 truncate max-w-[125px] md:max-w-[185px] mt-0.5">
            {hud.stageFlag} {hud.stageName}
          </span>
        </div>
      </div>

      {/* Center: Time Gauge + Active Powerup Status */}
      <div className="flex-1 max-w-[220px] min-w-[84px] flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px] font-bold tracking-wide">
          <span className="font-arcade text-[8px] text-slate-400">TEMPO</span>
          <span
            className={`font-arcade text-[9px] tabular-nums ${
              pct < 20 ? 'text-rose-400' : 'text-slate-100'
            }`}
          >
            {Math.ceil(hud.timeRemaining)}s
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#060a14] border border-slate-700/80 overflow-hidden p-[1px]">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${timerColor} transition-[width] duration-100 linear`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {activePowerups.length > 0 && (
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold tabular-nums leading-none pt-0.5">
            {activePowerups.map((p, idx) => (
              <span key={p.key} className={`whitespace-nowrap ${p.color}`}>
                {idx > 0 && <span className="text-slate-600 mr-2">·</span>}
                {p.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: Lives & Utility Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex flex-col items-end leading-tight">
          <span className="font-arcade text-[8px] text-slate-400 tracking-wider">VIDAS</span>
          <div className="flex items-center gap-1 mt-1" aria-label={`${hud.lives} vidas`}>
            {Array.from({ length: Math.max(0, hud.lives) }).map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 20 20"
                className="w-3.5 h-3.5 text-rose-500 fill-current drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              >
                <path d="M10 17.6l-1.3-1.2C4.1 12.2 1.2 9.6 1.2 6.3 1.2 3.7 3.3 1.7 5.9 1.7c1.5 0 2.9.7 4.1 1.9 1.2-1.2 2.6-1.9 4.1-1.9 2.6 0 4.7 2 4.7 4.6 0 3.3-2.9 5.9-7.5 10.1L10 17.6z" />
              </svg>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenAchievements}
            title={`Conquistas (${hud.unlockedAchievementIds.length}/${ACHIEVEMENTS.length})`}
            aria-label="Abrir conquistas"
            className="h-9 px-2.5 rounded-lg border border-amber-400/50 bg-[#182447] hover:border-amber-300 text-amber-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px] font-bold tabular-nums">
              {hud.unlockedAchievementIds.length}/{ACHIEVEMENTS.length}
            </span>
          </button>
          <button
            type="button"
            onClick={onOpenJournal}
            title="Diário de Bordo, Roteiro & Cinematics"
            aria-label="Abrir roteiro da história"
            className="w-9 h-9 rounded-lg border border-slate-600/80 bg-[#182447] hover:border-amber-300 hover:text-amber-200 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenStages}
            title="Selecionar Fase ou Chefe (24 Destinos)"
            aria-label="Selecionar fase"
            className="w-9 h-9 rounded-lg border border-slate-600/80 bg-[#182447] hover:border-cyan-400 hover:text-white text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Globe2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleMusic}
            title={hud.musicEnabled ? 'Desativar Trilha Sonora (OST)' : 'Ativar Trilha Sonora (OST)'}
            aria-label="Alternar música"
            className={`w-9 h-9 rounded-lg border bg-[#182447] flex items-center justify-center transition-colors cursor-pointer ${
              hud.musicEnabled
                ? 'border-amber-400/70 text-amber-300 hover:border-amber-300'
                : 'border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            title={hud.sfxMuted ? 'Ativar Som' : 'Silenciar Som'}
            aria-label="Alternar som"
            className={`w-9 h-9 rounded-lg border bg-[#182447] flex items-center justify-center transition-colors cursor-pointer ${
              hud.sfxMuted
                ? 'border-rose-500/60 text-rose-400'
                : 'border-slate-600/80 text-slate-200 hover:border-cyan-400 hover:text-white'
            }`}
          >
            {hud.sfxMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onTogglePause}
            disabled={hud.state !== 'PLAYING' && hud.state !== 'PAUSED'}
            title="Pausar (P ou ESC)"
            aria-label="Pausar jogo"
            className="w-9 h-9 rounded-lg border border-slate-600/80 bg-[#182447] hover:border-cyan-400 hover:text-white text-slate-200 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            {hud.state === 'PAUSED' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
