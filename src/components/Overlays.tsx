import { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Crosshair,
  Map,
  Music,
  Play,
  Rocket,
  RotateCcw,
  Skull,
  Sparkles,
  Trophy
} from 'lucide-react';
import { ACHIEVEMENTS } from '../game/achievements';
import { OST_TRACKS } from '../game/audio';
import { ACT_END_LEVEL_INDEX, BOSSES } from '../game/boss';
import { CinematicDef } from '../game/cinematics';
import { LEVELS } from '../game/levels';
import { STAGE_STORY_SCRIPT } from '../game/story';
import { HudSnapshot, RegionGroup, StoryCutsceneDef } from '../game/types';
import { AchievementsModal } from './AchievementsModal';
import { StoryCutsceneOverlay, StoryJournalModal } from './StoryCutscene';
import { TitleLogo } from './TitleLogo';

interface OverlaysProps {
  hud: HudSnapshot;
  showStageSelect: boolean;
  showJournal: boolean;
  showAchievements: boolean;
  onStartStoryNew: () => void;
  onContinueStory: () => void;
  onStartStoryStage: (index: number) => void;
  onPlayArcadeStart: () => void;
  onStartBossDirect: (act: number) => void;
  onOpenStages: () => void;
  onCloseStages: () => void;
  onOpenJournal: () => void;
  onCloseJournal: () => void;
  onOpenAchievements: () => void;
  onCloseAchievements: () => void;
  onSelectArcadeStage: (index: number) => void;
  onPreviewOst: (index: number) => void;
  onReplayCutscene: (cutscene: StoryCutsceneDef) => void;
  onReplayCinematic: (cinematic: CinematicDef) => void;
  onCompleteCutscene: () => void;
  onVoiceBlip: (pitch: number, wave: OscillatorType) => void;
  onResume: () => void;
  onUseContinue: () => void;
  onRestartFromBeginning: () => void;
  onNextStage: () => void;
}

const REGION_FILTERS: ('Todos' | 'Chefes' | RegionGroup)[] = [
  'Todos',
  'Chefes',
  'Ásia & Pacífico',
  'Américas',
  'Europa & África',
  'Espaço'
];

export function Overlays({
  hud,
  showStageSelect,
  showJournal,
  showAchievements,
  onStartStoryNew,
  onContinueStory,
  onStartStoryStage,
  onPlayArcadeStart,
  onStartBossDirect,
  onOpenStages,
  onCloseStages,
  onOpenJournal,
  onCloseJournal,
  onOpenAchievements,
  onCloseAchievements,
  onSelectArcadeStage,
  onPreviewOst,
  onReplayCutscene,
  onReplayCinematic,
  onCompleteCutscene,
  onVoiceBlip,
  onResume,
  onUseContinue,
  onRestartFromBeginning,
  onNextStage
}: OverlaysProps) {
  const [regionFilter, setRegionFilter] = useState<'Todos' | 'Chefes' | RegionGroup>('Todos');
  const [stageLaunchMode, setStageLaunchMode] = useState<'STORY' | 'ARCADE'>('STORY');

  // 0. ACHIEVEMENTS MODAL
  if (showAchievements) {
    return (
      <AchievementsModal
        unlockedIds={hud.unlockedAchievementIds}
        continuesUsed={hud.continuesUsed}
        runValid={hud.runValid}
        onClose={onCloseAchievements}
      />
    );
  }

  // 0.5 STORY SCRIPT, CINEMATICS & BOSS DOSSIER MODAL
  if (showJournal) {
    return (
      <StoryJournalModal
        unlockedStageIndex={hud.storyUnlockedIndex}
        storyCompleted={hud.storyCompleted}
        onClose={onCloseJournal}
        onPlayStoryStage={(idx) => {
          onCloseJournal();
          onStartStoryStage(idx);
        }}
        onReplayCutscene={(cut) => {
          onCloseJournal();
          onReplayCutscene(cut);
        }}
        onReplayCinematic={(cin) => {
          onCloseJournal();
          onReplayCinematic(cin);
        }}
        onStartBoss={(act) => {
          onCloseJournal();
          onStartBossDirect(act);
        }}
      />
    );
  }

  // 1. STAGE & BOSS SELECT MODAL
  if (showStageSelect) {
    const filtered = LEVELS.filter((lvl) => {
      if (regionFilter === 'Todos') return true;
      if (regionFilter === 'Chefes') return ACT_END_LEVEL_INDEX.includes(lvl.id - 1);
      return lvl.region === regionFilter;
    });

    return (
      <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-4 bg-[#050814]/90">
        <div className="animate-modal-pop w-full max-w-[860px] max-h-[95%] flex flex-col rounded-2xl bg-[#101830] border border-[#34487a] shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-arcade text-xs sm:text-sm text-amber-300">
                SELECIONAR DESTINO OU CHEFE (24 FASES + 5 CHEFES)
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Fases com marcador de caveira encerram cada Ato com uma batalha aérea de Chefe estilo Sonic Wings!
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex rounded-lg bg-[#090e1f] p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setStageLaunchMode('STORY')}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                    stageLaunchMode === 'STORY'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Com História
                </button>
                <button
                  type="button"
                  onClick={() => setStageLaunchMode('ARCADE')}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                    stageLaunchMode === 'ARCADE'
                      ? 'bg-cyan-400 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Arcade Livre
                </button>
              </div>

              <button
                type="button"
                onClick={onCloseStages}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-100 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>
            </div>
          </div>

          {/* Interactive Region & Boss Filter Tabs */}
          <div className="px-5 py-2 bg-[#0a1022] border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
            {REGION_FILTERS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setRegionFilter(region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors inline-flex items-center gap-1 cursor-pointer ${
                  regionFilter === region
                    ? region === 'Chefes'
                      ? 'bg-rose-500/25 text-rose-200 border border-rose-400/60'
                      : 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {region === 'Chefes' && <Skull className="w-3.5 h-3.5 text-rose-400" />}
                {region}
              </button>
            ))}
          </div>

          {/* Stage Cards Grid */}
          <div className="p-4 sm:p-5 overflow-y-auto stage-scroll grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filtered.map((lvl) => {
              const idx = lvl.id - 1;
              const track = OST_TRACKS[lvl.theme];
              const storyChapter = STAGE_STORY_SCRIPT[idx];
              const bossEntry = BOSSES.find((b) => b.levelIndex === idx);

              return (
                <div
                  key={lvl.id}
                  className={`group relative rounded-xl border transition-all overflow-hidden ${
                    bossEntry
                      ? 'bg-[#22122c] border-rose-500/50 hover:border-amber-300'
                      : lvl.spaceStage
                      ? 'bg-[#191134] border-purple-500/50 hover:border-amber-300'
                      : 'bg-[#162040] border-[#2e4070] hover:border-cyan-400'
                  }`}
                >
                  <div
                    className="h-2.5 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${lvl.swatch[0]}, ${lvl.swatch[1]})`
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      stageLaunchMode === 'STORY'
                        ? onStartStoryStage(idx)
                        : onSelectArcadeStage(idx)
                    }
                    className="w-full text-left p-2.5 pr-9 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 tabular-nums">
                      <span className="font-arcade text-[9px] text-amber-300">
                        {String(lvl.id).padStart(2, '0')}
                      </span>
                      <span>·</span>
                      <span className="truncate">
                        {bossEntry
                          ? `Ato ${bossEntry.act} · Chefe`
                          : stageLaunchMode === 'STORY' && storyChapter
                          ? `Ato ${storyChapter.actNumber}`
                          : lvl.country}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white truncate mt-0.5 group-hover:text-cyan-200 transition-colors">
                      {lvl.flag} {lvl.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {bossEntry ? (
                        <span className="text-rose-300 font-semibold">☠ {bossEntry.name}</span>
                      ) : (
                        <>♪ {track.title.split('—')[0].trim()}</>
                      )}
                    </div>
                  </button>

                  {bossEntry ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseStages();
                        onStartBossDirect(bossEntry.act);
                      }}
                      title={`Lutar direto contra ${bossEntry.name}`}
                      aria-label={`Enfrentar chefe ${bossEntry.name}`}
                      className="absolute right-2 bottom-2.5 w-7 h-7 rounded-lg bg-rose-950/90 border border-rose-500/70 hover:border-amber-300 text-rose-300 hover:text-amber-200 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewOst(idx);
                      }}
                      title={`Ouvir OST Dinâmica: ${track.title}`}
                      aria-label={`Ouvir OST de ${lvl.name}`}
                      className="absolute right-2 bottom-2.5 w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-amber-300 hover:text-amber-300 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Music className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE STORY MODE CUTSCENE OVERLAY
  if (hud.state === 'STORY_CUTSCENE' && hud.activeCutscene) {
    return (
      <StoryCutsceneOverlay
        cutscene={hud.activeCutscene}
        onComplete={onCompleteCutscene}
        onVoiceBlip={onVoiceBlip}
      />
    );
  }

  // 3. TITLE SCREEN
  if (hud.state === 'START') {
    const hasSavedStory = hud.storyUnlockedIndex > 0;
    const nextStoryStage = LEVELS[hud.storyUnlockedIndex] || LEVELS[0];

    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-between py-5 px-4 sm:px-6 bg-gradient-to-b from-[#040712]/74 via-[#040712]/34 to-[#040712]/88">
        {/* Live showcase destination caption */}
        <div className="text-xs sm:text-sm font-semibold text-slate-200/90 tracking-wide">
          <span>
            {hud.stageFlag} {hud.stageName}
          </span>
          <span className="mx-2 text-slate-500">·</span>
          <span className="text-cyan-300">{hud.stageCountry}</span>
        </div>

        {/* Center Hero Lockup */}
        <div className="flex flex-col items-center text-center max-w-[720px]">
          <TitleLogo />

          <p className="text-xs sm:text-sm text-amber-200/95 font-semibold mt-2 max-w-[560px]">
            Operação Esfera Prisma: 5 Atos com Cinematics, 5 Chefes Aéreos Estilo Sonic Wings e 19 Conquistas
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
            {hasSavedStory ? (
              <>
                <button
                  type="button"
                  onClick={onContinueStory}
                  className="font-arcade text-[11px] sm:text-xs px-5 py-3.5 rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-orange-500 text-[#1a0d00] border-2 border-amber-100 shadow-[0_5px_0_#9a3412,0_12px_28px_rgba(249,115,22,0.45)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#9a3412] transition-all inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> CONTINUAR FASE{' '}
                  {String(nextStoryStage.id).padStart(2, '0')}
                </button>
                <button
                  type="button"
                  onClick={onStartStoryNew}
                  className="font-arcade text-[10px] sm:text-[11px] px-4 py-3.5 rounded-xl bg-[#1a1338]/90 hover:bg-[#261c52] text-amber-200 border-2 border-amber-400/60 shadow-[0_5px_0_#1e1b4b] active:translate-y-1 transition-all inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> NOVA (1CC)
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onStartStoryNew}
                className="font-arcade text-xs sm:text-[13px] px-6 py-4 rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-orange-500 text-[#1a0d00] border-2 border-amber-100 shadow-[0_5px_0_#9a3412,0_12px_28px_rgba(249,115,22,0.45)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#9a3412] transition-all inline-flex items-center gap-2.5 whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> MODO HISTÓRIA
              </button>
            )}

            <button
              type="button"
              onClick={onPlayArcadeStart}
              className="font-arcade text-[10px] sm:text-xs px-4 py-3.5 rounded-xl bg-[#101c3a]/90 hover:bg-[#182952] text-cyan-200 border-2 border-cyan-400/70 shadow-[0_5px_0_#082f49] active:translate-y-1 transition-all inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Compass className="w-4 h-4" /> ARCADE
            </button>

            <button
              type="button"
              onClick={onOpenStages}
              className="font-arcade text-[10px] sm:text-xs px-4 py-3.5 rounded-xl bg-[#101c3a]/90 hover:bg-[#182952] text-slate-100 border-2 border-slate-500/70 shadow-[0_5px_0_#0f172a] active:translate-y-1 transition-all inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Map className="w-4 h-4 text-cyan-300" /> 24 FASES
            </button>

            <button
              type="button"
              onClick={onOpenJournal}
              className="font-arcade text-[10px] sm:text-xs px-4 py-3.5 rounded-xl bg-[#171230]/90 hover:bg-[#231b47] text-purple-200 border-2 border-purple-400/60 shadow-[0_5px_0_#1e1038] active:translate-y-1 transition-all inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-300" /> ROTEIRO
            </button>

            <button
              type="button"
              onClick={onOpenAchievements}
              className="font-arcade text-[10px] sm:text-xs px-4 py-3.5 rounded-xl bg-[#241a08]/90 hover:bg-[#38280c] text-amber-200 border-2 border-amber-400/70 shadow-[0_5px_0_#451a03] active:translate-y-1 transition-all inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-300" /> TROFÉUS ({hud.unlockedAchievementIds.length}/
              {ACHIEVEMENTS.length})
            </button>
          </div>
        </div>

        {/* Clean Control-Hint Line */}
        <div className="text-xs sm:text-sm text-slate-300 font-medium text-center">
          <span>A / D ou ← → Mover</span>
          <span className="mx-2.5 text-slate-500">·</span>
          <span>Espaço / ↑ Disparar</span>
          <span className="mx-2.5 text-slate-500">·</span>
          <span>P Pausar</span>
        </div>
      </div>
    );
  }

  // 4. PAUSE MODAL
  if (hud.state === 'PAUSED') {
    const chapter = STAGE_STORY_SCRIPT[hud.levelIndex];
    return (
      <div className="absolute inset-0 z-[25] flex items-center justify-center p-4 bg-[#050814]/82">
        <div className="animate-modal-pop w-full max-w-[490px] rounded-2xl bg-[#101830] border border-[#384d82] p-6 text-center shadow-[0_24px_55px_rgba(0,0,0,0.8)]">
          <h2 className="font-arcade text-lg text-amber-300">PAUSADO</h2>
          <p className="text-sm font-bold text-slate-200 mt-2">
            {hud.stageFlag} {hud.stageName} — {hud.stageCountry}
          </p>
          {hud.bossActive && (
            <p className="text-xs font-bold text-rose-400 mt-1">☠ CHEFE: {hud.bossName}</p>
          )}
          {hud.gameMode === 'STORY' && chapter && !hud.bossActive && (
            <p className="text-xs text-amber-300/90 mt-1">{chapter.chapterTitle}</p>
          )}
          {hud.ostTitle && (
            <p className="text-xs text-cyan-300 mt-1">
              ♪ {hud.ostTitle} [{hud.ostSectionLabel}]
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-2.5 mt-6">
            <button
              type="button"
              onClick={onResume}
              className="font-arcade text-[11px] px-5 py-3 rounded-xl bg-gradient-to-b from-amber-300 to-orange-500 text-[#1a0d00] border border-amber-100 shadow-[0_4px_0_#9a3412] active:translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> CONTINUAR
            </button>
            <button
              type="button"
              onClick={onOpenAchievements}
              className="font-arcade text-[11px] px-4 py-3 rounded-xl bg-[#291d09] hover:bg-[#3b2a0d] text-amber-200 border border-amber-400/60 inline-flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" /> TROFÉUS
            </button>
            <button
              type="button"
              onClick={onOpenJournal}
              className="font-arcade text-[11px] px-4 py-3 rounded-xl bg-[#201844] hover:bg-[#2c215c] text-purple-200 border border-purple-400/60 inline-flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" /> ROTEIRO
            </button>
            <button
              type="button"
              onClick={onOpenStages}
              className="font-arcade text-[11px] px-4 py-3 rounded-xl bg-[#1a2b54] hover:bg-[#223769] text-cyan-200 border border-cyan-400/60 inline-flex items-center gap-2 cursor-pointer"
            >
              <Map className="w-3.5 h-3.5" /> FASES
            </button>
            <button
              type="button"
              onClick={onRestartFromBeginning}
              className="font-arcade text-[11px] px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 inline-flex items-center gap-2 cursor-pointer"
            >
              MENU INICIAL
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. STAGE CLEAR MODAL
  if (hud.state === 'STAGE_CLEAR') {
    const nextLvl = LEVELS[hud.levelIndex + 1];
    const chapter = STAGE_STORY_SCRIPT[hud.levelIndex];
    const isActFinale = ACT_END_LEVEL_INDEX.includes(hud.levelIndex);

    return (
      <div className="absolute inset-0 z-[25] flex items-center justify-center p-4 bg-[#050814]/78">
        <div className="animate-modal-pop w-full max-w-[480px] rounded-2xl bg-[#101830] border border-emerald-400/50 p-6 text-center shadow-[0_24px_55px_rgba(0,0,0,0.8)]">
          <h2 className="font-arcade text-base sm:text-lg text-emerald-300">
            {isActFinale ? `ATO ${chapter?.actNumber} VENCIDO!` : 'MISSÃO CONCLUÍDA!'}
          </h2>
          <p className="text-sm font-bold text-cyan-200 mt-2">
            {hud.stageFlag} {hud.stageName} — {hud.stageCountry}
          </p>
          {hud.gameMode === 'STORY' && chapter && (
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {chapter.journalSummary}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="rounded-xl bg-[#090e1d] border border-slate-700/80 p-3">
              <div className="text-[11px] text-slate-400 uppercase">Bônus de Tempo</div>
              <div className="font-arcade text-sm text-amber-300 tabular-nums mt-1.5">
                +{hud.stageTimeBonus.toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="rounded-xl bg-[#090e1d] border border-slate-700/80 p-3">
              <div className="text-[11px] text-slate-400 uppercase">Pontuação</div>
              <div className="font-arcade text-sm text-white tabular-nums mt-1.5">
                {hud.score.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNextStage}
            className="font-arcade text-[11px] px-6 py-3.5 rounded-xl bg-gradient-to-b from-amber-300 to-orange-500 text-[#1a0d00] border-2 border-amber-100 shadow-[0_4px_0_#9a3412] active:translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
          >
            {hud.gameMode === 'STORY' && isActFinale ? (
              <>
                <Sparkles className="w-4 h-4" /> VER CINEMÁTICA DE VITÓRIA
              </>
            ) : nextLvl?.spaceStage ? (
              <>
                <Rocket className="w-4 h-4" /> DECOLAR PARA {nextLvl.name.toUpperCase()}
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> PRÓXIMO DESTINO
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 6. GAME OVER MODAL (WITH AUTHENTIC ARCADE CONTINUE & 1CC TRACKING!)
  if (hud.state === 'GAME_OVER') {
    return (
      <div className="absolute inset-0 z-[25] flex items-center justify-center p-4 bg-[#050814]/86">
        <div className="animate-modal-pop w-full max-w-[490px] rounded-2xl bg-[#101830] border border-rose-500/60 p-6 text-center shadow-[0_24px_55px_rgba(0,0,0,0.85)]">
          <h2 className="font-arcade text-lg text-rose-400">FIM DE JOGO</h2>
          {hud.newRecordReached && (
            <p className="font-arcade text-[10px] text-amber-300 mt-2">★ NOVO RECORDE MUNDIAL!</p>
          )}
          <p className="text-sm text-slate-200 mt-2">{hud.gameOverReason}</p>
          <p className="text-xs text-amber-200/85 mt-1.5">
            Usar <strong>Continue</strong> recupera 3 vidas aqui mesmo, mas desativa a conquista{' '}
            <em>“Sem Continue”</em> nesta partida.
          </p>

          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="rounded-xl bg-[#090e1d] border border-slate-700/80 p-3">
              <div className="text-[11px] text-slate-400 uppercase">Pontuação</div>
              <div className="font-arcade text-sm text-white tabular-nums mt-1.5">
                {hud.score.toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="rounded-xl bg-[#090e1d] border border-slate-700/80 p-3">
              <div className="text-[11px] text-slate-400 uppercase">Continues Usados</div>
              <div className="font-arcade text-sm text-amber-300 tabular-nums mt-1.5">
                {hud.continuesUsed}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              onClick={onUseContinue}
              className="font-arcade text-[11px] px-5 py-3.5 rounded-xl bg-gradient-to-b from-amber-300 to-orange-500 text-[#1a0d00] border border-amber-100 shadow-[0_4px_0_#9a3412] active:translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> USAR CONTINUE (+3 VIDAS)
            </button>
            <button
              type="button"
              onClick={onStartStoryNew}
              className="font-arcade text-[10px] px-4 py-3.5 rounded-xl bg-[#1a2b54] hover:bg-[#223769] text-cyan-200 border border-cyan-400/60 cursor-pointer"
            >
              DESAFIO SEM CONTINUE (FASE 1)
            </button>
            <button
              type="button"
              onClick={onRestartFromBeginning}
              className="font-arcade text-[10px] px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 cursor-pointer"
            >
              MENU
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 7. FINAL VICTORY MODAL
  if (hud.state === 'VICTORY') {
    const cleared1CC = hud.runValid && hud.continuesUsed === 0;
    return (
      <div className="absolute inset-0 z-[25] flex items-center justify-center p-4 bg-[#050814]/86">
        <div className="animate-modal-pop w-full max-w-[530px] rounded-2xl bg-[#101830] border border-amber-400/70 p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-400/15 text-amber-300 mb-3">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="font-arcade text-sm sm:text-base text-emerald-300 leading-relaxed">
            OPERAÇÃO ESFERA PRISMA CONCLUÍDA!
          </h2>
          {cleared1CC && (
            <p className="font-arcade text-[10px] text-amber-300 mt-2">
              ★ ZERADO SEM CONTINUE (1CC)! LENDA DO ESQUADRÃO!
            </p>
          )}
          <p className="text-sm text-slate-200 mt-2.5 leading-relaxed">
            O Esquadrão Pang derrotou os 5 guardiões aéreos e salvou dois mundos através dos 24 destinos!
          </p>

          <div className="grid grid-cols-3 gap-2.5 my-5">
            <div className="rounded-xl bg-[#090e1d] border border-slate-700/80 p-3">
              <div className="text-[10px] text-slate-400 uppercase">Bônus Vidas</div>
              <div className="font-arcade text-xs text-emerald-300 tabular-nums mt-1.5">
                +{hud.victoryLivesBonus.toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="rounded-xl bg-[#090e1d] border border-slate-700/80 p-3">
              <div className="text-[10px] text-slate-400 uppercase">Continues</div>
              <div className="font-arcade text-xs text-cyan-300 tabular-nums mt-1.5">
                {hud.continuesUsed}
              </div>
            </div>
            <div className="rounded-xl bg-[#090e1d] border border-slate-700/80 p-3">
              <div className="text-[10px] text-slate-400 uppercase">Pontuação</div>
              <div className="font-arcade text-xs text-amber-300 tabular-nums mt-1.5">
                {hud.score.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              onClick={onStartStoryNew}
              className="font-arcade text-[11px] px-5 py-3.5 rounded-xl bg-gradient-to-b from-amber-300 to-orange-500 text-[#1a0d00] border border-amber-100 shadow-[0_4px_0_#9a3412] active:translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> NOVA CAMPANHA
            </button>
            <button
              type="button"
              onClick={onOpenAchievements}
              className="font-arcade text-[11px] px-4 py-3.5 rounded-xl bg-[#291d09] hover:bg-[#3b2a0d] text-amber-200 border border-amber-400/60 inline-flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" /> CONQUISTAS
            </button>
            <button
              type="button"
              onClick={onOpenJournal}
              className="font-arcade text-[11px] px-4 py-3.5 rounded-xl bg-[#201844] hover:bg-[#2c215c] text-purple-200 border border-purple-400/60 inline-flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" /> CINEMATICS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
