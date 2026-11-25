import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  Award,
  Bomb,
  CheckCircle2,
  Clock,
  Crosshair,
  Crown,
  Flame,
  Gem,
  Globe2,
  Heart,
  Lock,
  Rocket,
  Shield,
  Skull,
  Star,
  Trophy,
  Zap
} from 'lucide-react';
import { ACHIEVEMENTS, AchievementDef, AchievementIcon } from '../game/achievements';

function renderAchIcon(icon: AchievementIcon, className = 'w-5 h-5') {
  switch (icon) {
    case 'trophy':
      return <Trophy className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'skull':
      return <Skull className={className} />;
    case 'globe':
      return <Globe2 className={className} />;
    case 'rocket':
      return <Rocket className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'target':
      return <Crosshair className={className} />;
    case 'crown':
      return <Crown className={className} />;
    case 'gem':
      return <Gem className={className} />;
    case 'clock':
      return <Clock className={className} />;
    case 'bomb':
      return <Bomb className={className} />;
    default:
      return <Award className={className} />;
  }
}

export function AchievementToast({ achievement }: { achievement: AchievementDef | null }) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, x: 40, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 30, scale: 0.95 }}
          transition={{ duration: 0.28 }}
          className="pointer-events-none absolute right-3 top-3 z-[28] max-w-[330px] rounded-xl bg-gradient-to-r from-[#1e1505]/95 via-[#131b36]/95 to-[#0b1022]/95 border-2 border-amber-400 px-3.5 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.8)] flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/70 text-amber-300 flex items-center justify-center shrink-0">
            {renderAchIcon(achievement.icon, 'w-5 h-5')}
          </div>
          <div className="min-w-0">
            <div className="font-arcade text-[8px] text-amber-300 tracking-wider">
              ★ CONQUISTA DESBLOQUEADA!
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-white truncate mt-0.5">
              {achievement.title}
            </div>
            <div className="text-[11px] text-slate-300 leading-tight mt-0.5">
              {achievement.desc}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementsModalProps {
  unlockedIds: string[];
  continuesUsed: number;
  runValid: boolean;
  onClose: () => void;
}

export function AchievementsModal({
  unlockedIds,
  continuesUsed,
  runValid,
  onClose
}: AchievementsModalProps) {
  const unlockedSet = new Set(unlockedIds);
  const count = ACHIEVEMENTS.filter((a) => unlockedSet.has(a.id)).length;
  const total = ACHIEVEMENTS.length;
  const pct = Math.round((count / total) * 100);

  return (
    <div className="absolute inset-0 z-[36] flex items-center justify-center p-3 sm:p-4 bg-[#050814]/92">
      <div className="animate-modal-pop w-full max-w-[840px] max-h-[95%] flex flex-col rounded-2xl bg-[#0f172e] border border-[#384d82] shadow-[0_24px_60px_rgba(0,0,0,0.88)] overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-arcade text-xs sm:text-sm text-amber-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-300" />
              SALA DE CONQUISTAS ({count}/{total})
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Complete desafios de habilidade, derrote os 5 chefes e conquiste o troféu Sem Continue (1CC).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-100 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
          </button>
        </div>

        {/* Progress & Live 1CC Run Status Bar */}
        <div className="px-5 py-3 bg-[#090f20] border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
              <span>Progresso Geral</span>
              <span className="text-amber-300 tabular-nums">{pct}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-700 overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 ${
              runValid && continuesUsed === 0
                ? 'bg-emerald-950/60 border-emerald-400/50 text-emerald-200'
                : 'bg-slate-900/80 border-slate-700 text-slate-300'
            }`}
          >
            {runValid && continuesUsed === 0
              ? '★ Partida Atual: 0 Continues (Elegível p/ Sem Continue!)'
              : !runValid
              ? 'Inicie da Fase 01 para validar a conquista Sem Continue'
              : `Continues usados nesta partida: ${continuesUsed}`}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto stage-scroll grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedSet.has(ach.id);
            const isHiddenSecret = ach.secret && !isUnlocked;
            const isNoContinue = ach.id === 'no_continue';

            return (
              <div
                key={ach.id}
                className={`rounded-xl border p-3 flex items-center gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-[#1a2444] to-[#121b36] border-amber-400/60 shadow-[0_4px_16px_rgba(251,191,36,0.12)]'
                    : isNoContinue
                    ? 'bg-[#121931] border-cyan-500/40'
                    : 'bg-[#0b1122] border-slate-800 opacity-75'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-amber-400/20 border-amber-300 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {isHiddenSecret ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    renderAchIcon(ach.icon, 'w-5 h-5')
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs sm:text-sm font-extrabold truncate ${
                        isUnlocked ? 'text-amber-200' : 'text-slate-200'
                      }`}
                    >
                      {isHiddenSecret ? 'Conquista Secreta' : ach.title}
                    </span>
                    {isUnlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-snug mt-0.5">
                    {isHiddenSecret
                      ? 'Continue jogando o Modo História para revelar este desafio.'
                      : ach.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
