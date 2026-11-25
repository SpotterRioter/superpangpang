import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Crosshair,
  Eye,
  FastForward,
  Film,
  Play,
  Radio,
  Skull,
  Users
} from 'lucide-react';
import { getBossByAct } from '../game/boss';
import {
  CinematicDef,
  getActIntroCinematic,
  getActVictoryCinematic,
  getFinaleCinematic
} from '../game/cinematics';
import { LEVELS } from '../game/levels';
import { BOSS_SCRIPT, ENRICHMENTS, buildBossCutscene } from '../game/saga';
import {
  CHARACTERS,
  STAGE_STORY_SCRIPT,
  STORY_ACTS,
  buildStoryCutscene
} from '../game/story';
import { CharacterId, RadioCommDef, StoryCutsceneDef } from '../game/types';
import { CharacterPortrait } from './StoryPortraits';

interface StoryCutsceneOverlayProps {
  cutscene: StoryCutsceneDef;
  onComplete: () => void;
  onVoiceBlip: (pitch: number, wave: OscillatorType) => void;
}

export function StoryCutsceneOverlay({
  cutscene,
  onComplete,
  onVoiceBlip
}: StoryCutsceneOverlayProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const blipCounterRef = useRef(0);

  const lines = cutscene.lines;
  const safeIdx = Math.min(lineIndex, Math.max(0, lines.length - 1));
  const currentLine = lines[safeIdx];
  const speaker = CHARACTERS[currentLine.speaker];
  const fullText = currentLine.text;
  const isDoneTyping = charCount >= fullText.length;

  useEffect(() => {
    setLineIndex(0);
    setCharCount(0);
  }, [cutscene.id]);

  useEffect(() => {
    if (charCount >= fullText.length) return;
    const timer = window.setTimeout(() => {
      const next = charCount + 1;
      setCharCount(next);
      const ch = fullText[charCount];
      if (ch && ch !== ' ' && ch !== '.' && ch !== ',') {
        blipCounterRef.current += 1;
        if (blipCounterRef.current % 3 === 0) {
          onVoiceBlip(speaker.voicePitch, speaker.voiceWave);
        }
      }
    }, 22);
    return () => clearTimeout(timer);
  }, [charCount, fullText, onVoiceBlip, speaker.voicePitch, speaker.voiceWave]);

  const handleAdvance = useCallback(() => {
    if (!isDoneTyping) {
      setCharCount(fullText.length);
      return;
    }
    if (safeIdx < lines.length - 1) {
      setLineIndex((prev) => prev + 1);
      setCharCount(0);
    } else {
      onComplete();
    }
  }, [fullText.length, isDoneTyping, lines.length, onComplete, safeIdx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) handleAdvance();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onComplete();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [handleAdvance, onComplete]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-b from-[#040712]/80 via-transparent to-[#040712]/90 select-none">
      {/* Top Cinematic Chapter Header + Skip Action */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex items-start justify-between gap-3"
      >
        <div className="rounded-xl bg-[#091024]/92 border border-slate-700/80 px-3.5 py-2 shadow-lg">
          <div className="flex items-center gap-2 text-[10px] font-arcade text-amber-300">
            <Radio className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>{cutscene.actTitle}</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
            {cutscene.chapterTitle}
          </div>
          <div className="text-[11px] text-cyan-300/90">{cutscene.locationLabel}</div>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="font-arcade text-[9px] sm:text-[10px] px-3.5 py-2.5 rounded-xl bg-[#0d1428]/92 hover:bg-[#172446] text-slate-200 hover:text-amber-300 border border-slate-600/90 hover:border-amber-300 inline-flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
        >
          PULAR CENA <FastForward className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Bottom Interactive Radio Dialogue Console */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleAdvance}
        role="button"
        tabIndex={0}
        aria-label="Avançar diálogo"
        className="w-full max-w-[880px] mx-auto rounded-2xl bg-[#0b1226]/95 border-2 p-3.5 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] cursor-pointer transition-colors"
        style={{ borderColor: `${speaker.accentColor}aa` }}
      >
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentLine.speaker}_${currentLine.mood}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.16 }}
            >
              <CharacterPortrait
                character={currentLine.speaker}
                mood={currentLine.mood}
                size="lg"
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[96px] sm:min-h-[108px]">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs sm:text-sm font-extrabold tracking-wide"
                    style={{ color: speaker.accentColor }}
                  >
                    {speaker.name}
                  </span>
                  <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700 font-semibold">
                    {speaker.role}
                  </span>
                </div>
                <span className="font-arcade text-[8px] text-slate-400 tabular-nums">
                  {speaker.callsign} · {speaker.frequency}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
                “{fullText.slice(0, charCount)}”
                {!isDoneTyping && (
                  <span className="inline-block w-2 h-4 ml-1 align-middle bg-amber-300 animate-pulse" />
                )}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-800/90">
              <div className="flex items-center gap-1.5">
                {lines.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === safeIdx
                        ? 'w-5 bg-amber-300'
                        : idx < safeIdx
                        ? 'w-2 bg-cyan-400/70'
                        : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <span className="font-arcade text-[9px] text-amber-300 inline-flex items-center gap-1">
                {!isDoneTyping
                  ? 'REVELAR'
                  : safeIdx < lines.length - 1
                  ? 'CONTINUAR'
                  : 'AVANÇAR'}
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// =========================================================================
// NON-BLOCKING IN-STAGE LIVE RADIO COMMS TOAST
// =========================================================================
export function RadioCommToast({ comm }: { comm: RadioCommDef | null }) {
  return (
    <AnimatePresence>
      {comm && (
        <motion.div
          key={`${comm.speaker}_${comm.text.slice(0, 18)}`}
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.24 }}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-3 z-[15] w-[92%] max-w-[560px] rounded-xl bg-[#091024]/90 border px-3 py-2 shadow-[0_10px_28px_rgba(0,0,0,0.65)] flex items-center gap-3"
          style={{ borderColor: `${CHARACTERS[comm.speaker].accentColor}99` }}
        >
          <CharacterPortrait character={comm.speaker} mood={comm.mood} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-extrabold"
                style={{ color: CHARACTERS[comm.speaker].accentColor }}
              >
                {CHARACTERS[comm.speaker].name}
              </span>
              <span className="font-arcade text-[8px] text-slate-400">
                [{CHARACTERS[comm.speaker].callsign}]
              </span>
            </div>
            <p className="text-xs text-slate-100 leading-snug line-clamp-2 mt-0.5">
              “{comm.text}”
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =========================================================================
// STORY SCRIPT, CINEMATICS & BOSS DOSSIER MODAL (DIÁRIO DE BORDO)
// =========================================================================
interface StoryJournalModalProps {
  unlockedStageIndex: number;
  storyCompleted: boolean;
  onClose: () => void;
  onPlayStoryStage: (stageIndex: number) => void;
  onReplayCutscene: (cutscene: StoryCutsceneDef) => void;
  onReplayCinematic: (cinematic: CinematicDef) => void;
  onStartBoss: (actNumber: number) => void;
}

const CHARACTER_ORDER: CharacterId[] = ['leo', 'maya', 'heitor', 'vesper', 'aria'];

export function StoryJournalModal({
  unlockedStageIndex,
  storyCompleted,
  onClose,
  onPlayStoryStage,
  onReplayCutscene,
  onReplayCinematic,
  onStartBoss
}: StoryJournalModalProps) {
  const [tab, setTab] = useState<'script' | 'cast'>('script');
  const [showFullSpoilers, setShowFullSpoilers] = useState(false);
  const [selectedAct, setSelectedAct] = useState<number>(1);

  const actDef = STORY_ACTS.find((a) => a.actNumber === selectedAct) || STORY_ACTS[0];
  const actEntries = STAGE_STORY_SCRIPT.filter((e) => e.actNumber === selectedAct);
  const actBoss = getBossByAct(selectedAct);
  const actBossScript = BOSS_SCRIPT[actBoss.id];

  const actStartIdx = actDef.stageRange[0] - 1;
  const actEndIdx = actDef.stageRange[1] - 1;
  const actIntroUnlocked = storyCompleted || showFullSpoilers || unlockedStageIndex >= actStartIdx;
  const actVictoryUnlocked =
    storyCompleted ||
    showFullSpoilers ||
    unlockedStageIndex > actEndIdx ||
    (selectedAct === 5 && storyCompleted);

  return (
    <div className="absolute inset-0 z-[35] flex items-center justify-center p-3 sm:p-4 bg-[#050814]/90">
      <div className="animate-modal-pop w-full max-w-[880px] max-h-[95%] flex flex-col rounded-2xl bg-[#0f172e] border border-[#34487a] shadow-[0_24px_60px_rgba(0,0,0,0.88)] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-arcade text-xs sm:text-sm text-amber-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-300" />
              OPERAÇÃO ESFERA PRISMA — ROTEIRO, CINEMATICS & CHEFES
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Explore os 5 atos, assista às cinematics de abertura/vitória e desafie os chefes aéreos.
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

        {/* Sub-navigation Tabs */}
        <div className="px-5 py-2.5 bg-[#090f20] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('script')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                tab === 'script'
                  ? 'bg-amber-400/20 text-amber-200 border border-amber-400/60'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Atos, Cinematics & Chefes
            </button>
            <button
              type="button"
              onClick={() => setTab('cast')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                tab === 'cast'
                  ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/60'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Elenco & Dossiês
            </button>
          </div>

          {tab === 'script' && !storyCompleted && (
            <button
              type="button"
              onClick={() => setShowFullSpoilers((s) => !s)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-300" />
              {showFullSpoilers ? 'Ocultar Futuros' : 'Liberar Tudo'}
            </button>
          )}
        </div>

        {tab === 'script' ? (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Act Selector Row */}
            <div className="px-5 py-2.5 border-b border-slate-800/70 flex items-center gap-1.5 overflow-x-auto shrink-0">
              {STORY_ACTS.map((act) => (
                <button
                  key={act.actNumber}
                  type="button"
                  onClick={() => setSelectedAct(act.actNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                    selectedAct === act.actNumber
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  Ato {act.actNumber} ({act.stageRange[0]}–{act.stageRange[1]})
                </button>
              ))}
            </div>

            {/* Act Synopsis, Cinematics Buttons, Chapters & Act Boss */}
            <div className="p-5 overflow-y-auto stage-scroll space-y-3">
              <div className="rounded-xl bg-[#090e1f] border border-cyan-500/30 p-3.5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-[220px]">
                    <div className="font-arcade text-xs text-amber-300">{actDef.title}</div>
                    <div className="text-xs font-bold text-cyan-300 mt-0.5">{actDef.subtitle}</div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                      {actDef.synopsis}
                    </p>
                  </div>

                  {/* Act Intro / Victory / Finale Cinematics Replay Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {actIntroUnlocked && (
                      <button
                        type="button"
                        onClick={() => {
                          const c = getActIntroCinematic(selectedAct);
                          if (c) onReplayCinematic(c);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-xs font-bold text-cyan-200 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Film className="w-3.5 h-3.5" /> Intro do Ato
                      </button>
                    )}
                    {actVictoryUnlocked && (
                      <button
                        type="button"
                        onClick={() => {
                          const c = getActVictoryCinematic(selectedAct);
                          if (c) onReplayCinematic(c);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/60 text-xs font-bold text-emerald-200 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Film className="w-3.5 h-3.5" /> Vitória do Ato
                      </button>
                    )}
                    {selectedAct === 5 && actVictoryUnlocked && (
                      <button
                        type="button"
                        onClick={() => onReplayCinematic(getFinaleCinematic())}
                        className="px-3 py-1.5 rounded-lg bg-amber-400/25 hover:bg-amber-400/35 border border-amber-300 text-xs font-bold text-amber-200 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Film className="w-3.5 h-3.5" /> Cinematic Final
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {actEntries.map((entry) => {
                const idx = entry.levelId - 1;
                const lvl = LEVELS[idx];
                const isUnlocked =
                  storyCompleted || showFullSpoilers || idx <= unlockedStageIndex;
                const extra = ENRICHMENTS[entry.levelId];
                const fullIntroLines = [
                  ...(extra?.before ?? []),
                  ...entry.introLines,
                  ...(extra?.after ?? [])
                ];

                return (
                  <div
                    key={entry.levelId}
                    className={`rounded-xl border p-3.5 transition-colors ${
                      isUnlocked
                        ? 'bg-[#141f3d] border-[#2e4275]'
                        : 'bg-[#0b1122] border-slate-800/80 opacity-65'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-amber-300">
                          {entry.chapterTitle}
                        </span>
                        <span className="mx-2 text-slate-500">·</span>
                        <span className="text-xs text-cyan-200 font-semibold">
                          {lvl.flag} {lvl.name} ({lvl.country})
                        </span>
                      </div>

                      {isUnlocked && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const cut = buildStoryCutscene(
                                idx,
                                'intro',
                                lvl.name,
                                lvl.country,
                                lvl.flag
                              );
                              if (cut) onReplayCutscene(cut);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] font-bold text-slate-200 cursor-pointer"
                          >
                            Ver Diálogo
                          </button>
                          <button
                            type="button"
                            onClick={() => onPlayStoryStage(idx)}
                            className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/60 text-[11px] font-bold text-amber-200 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" /> Jogar
                          </button>
                        </div>
                      )}
                    </div>

                    {isUnlocked ? (
                      <>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {entry.journalSummary}
                        </p>
                        <div className="mt-2.5 pl-3 border-l-2 border-slate-700 space-y-1">
                          {fullIntroLines.map((ln, lIdx) => (
                            <p key={lIdx} className="text-[11px] text-slate-300/90">
                              <strong style={{ color: CHARACTERS[ln.speaker].accentColor }}>
                                {CHARACTERS[ln.speaker].name.split(' ')[0]}:
                              </strong>{' '}
                              “{ln.text}”
                            </p>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-slate-500 mt-1.5 italic">
                        Alcance a Fase {String(entry.levelId).padStart(2, '0')} no Modo História para desbloquear este registro.
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Sonic Wings Act Boss Dossier Card */}
              <div className="rounded-xl bg-gradient-to-r from-[#280d1e] to-[#131836] border border-rose-500/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-arcade text-[10px] text-rose-400 flex items-center gap-1.5">
                      <Skull className="w-3.5 h-3.5" /> CHEFE DO ATO {selectedAct} (ESTILO SONIC WINGS)
                    </div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      {actBoss.name} — <span className="text-amber-300">{actBoss.title}</span>
                    </div>
                  </div>

                  {(actVictoryUnlocked || showFullSpoilers || unlockedStageIndex >= actEndIdx) && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const pre = buildBossCutscene(selectedAct, 'pre');
                          if (pre) onReplayCutscene(pre);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-600 text-[11px] font-bold text-slate-200 cursor-pointer"
                      >
                        Diálogo Chefe
                      </button>
                      <button
                        type="button"
                        onClick={() => onStartBoss(selectedAct)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 border border-rose-300 text-[11px] font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Crosshair className="w-3.5 h-3.5" /> Enfrentar Chefe
                      </button>
                    </div>
                  )}
                </div>

                {(actVictoryUnlocked || showFullSpoilers || unlockedStageIndex >= actEndIdx) &&
                  actBossScript && (
                    <div className="mt-2.5 pl-3 border-l-2 border-rose-500/50 space-y-1">
                      {actBossScript.pre.map((ln, idx) => (
                        <p key={idx} className="text-[11px] text-slate-200/90">
                          <strong style={{ color: CHARACTERS[ln.speaker].accentColor }}>
                            {CHARACTERS[ln.speaker].name.split(' ')[0]}:
                          </strong>{' '}
                          “{ln.text}”
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 overflow-y-auto stage-scroll grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHARACTER_ORDER.map((cid) => {
              const ch = CHARACTERS[cid];
              return (
                <div
                  key={cid}
                  className="rounded-xl bg-[#131e3a] border border-[#2c4070] p-3.5 flex items-start gap-3.5"
                >
                  <CharacterPortrait character={cid} mood="determined" size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-extrabold" style={{ color: ch.accentColor }}>
                        {ch.name}
                      </h3>
                      <span className="font-arcade text-[8px] text-slate-400">{ch.callsign}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-cyan-200/90 mt-0.5">
                      {ch.role} · {ch.frequency}
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{ch.bio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
