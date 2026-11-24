import { AudioEngine, OST_TRACKS } from './audio';
import { drawArenaFrame, drawBackground } from './backgrounds';
import { updateAmbientWeather } from './bgHelpers';
import {
  BASE_GRAVITY,
  BUBBLE_SPECS,
  CEILING_Y,
  GROUND_Y,
  LEFT_WALL,
  LEVELS,
  POWERUP_DEFS,
  RIGHT_WALL,
  WORLD_H,
  WORLD_W
} from './levels';
import {
  STAGE_STORY_SCRIPT,
  StorySaveState,
  buildStoryCutscene,
  loadStoryProgress,
  saveStoryProgress
} from './story';
import {
  drawBlocks,
  drawBubbles,
  drawEffects,
  drawHarpoons,
  drawPlayer,
  drawPowerups,
  drawStageIntroBanner,
  getBlockThemeStyle,
  renderMapTravel
} from './sprites';
import {
  Block,
  Bubble,
  GameMode,
  GameState,
  Harpoon,
  HudSnapshot,
  Particle,
  Player,
  PowerupItem,
  PowerupType,
  RadioCommDef,
  ScorePopup,
  Shard,
  ShockRing,
  StoryCutsceneDef,
  TravelState
} from './types';

const HIGHSCORE_KEY = 'super_pang_world_tour_highscore_v3';
const SHOWCASE_INDICES = [0, 6, 2, 9, 3, 20, 22, 23];

type PostCutsceneAction = 'START_STAGE' | 'START_TRAVEL' | 'SHOW_VICTORY' | 'RETURN_PREVIOUS';

export class SuperPangEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private onHudUpdate: (snapshot: HudSnapshot) => void;
  public audio: AudioEngine;

  private rafId: number | null = null;
  private lastTimestamp = 0;
  private hudSyncAccum = 0;

  private state: GameState = 'START';
  private gameMode: GameMode = 'STORY';
  private levelIndex = 0;
  private showcaseCursor = 0;
  private showcaseTimer = 0;

  private storyProgress: StorySaveState;
  private activeCutscene: StoryCutsceneDef | null = null;
  private postCutsceneAction: PostCutsceneAction = 'START_STAGE';
  private previousStateBeforeReplay: GameState = 'START';

  private activeRadioComm: RadioCommDef | null = null;
  private radioCommTimer = 0;
  private midCommTriggered = false;
  private stagePlayElapsed = 0;

  private score = 0;
  private highScore = 0;
  private newRecordReached = false;
  private lives = 3;
  private timeRemaining = 75;
  private timeLimit = 75;
  private stageTimeBonus = 0;
  private victoryLivesBonus = 0;
  private gameOverReason = 'Suas vidas acabaram!';

  private freezeTimer = 0;
  private hitstopTimer = 0;
  private shakeTimer = 0;
  private shakeIntensity = 0;
  private flashAlpha = 0;
  private stageIntroTimer = 0;
  private bgTime = 0;
  private cameraNormX = 0;

  private comboCount = 0;
  private comboTimer = 0;

  private input = {
    left: false,
    right: false,
    fireBufferTimer: 0
  };

  private player: Player;
  private bubbles: Bubble[] = [];
  private harpoons: Harpoon[] = [];
  private blocks: Block[] = [];
  private powerups: PowerupItem[] = [];
  private particles: Particle[] = [];
  private shards: Shard[] = [];
  private rings: ShockRing[] = [];
  private popups: ScorePopup[] = [];
  private travel: TravelState = {
    fromIndex: 0,
    toIndex: 1,
    progress: 0,
    duration: 4.1,
    isSpace: false,
    exhaust: []
  };

  constructor(canvas: HTMLCanvasElement, onHudUpdate: (snapshot: HudSnapshot) => void) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context unavailable');
    this.ctx = context;
    this.onHudUpdate = onHudUpdate;
    this.audio = new AudioEngine();
    this.storyProgress = loadStoryProgress();

    try {
      this.highScore = parseInt(localStorage.getItem(HIGHSCORE_KEY) || '0', 10) || 0;
    } catch {
      this.highScore = 0;
    }

    this.player = this.createPlayer();
    this.loadLevel(0, false, false);
    this.state = 'START';
    this.resize();
    this.emitHud();
  }

  public startLoop(): void {
    if (this.rafId !== null) return;
    this.lastTimestamp = 0;
    const tick = (ts: number) => {
      if (!this.lastTimestamp) this.lastTimestamp = ts;
      const rawDt = (ts - this.lastTimestamp) / 1000;
      this.lastTimestamp = ts;
      const dt = Math.min(Math.max(rawDt, 0), 0.05);

      this.update(dt);
      this.render();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.audio.stopMusic();
  }

  public resize(): void {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const pw = parent.clientWidth;
    const ph = parent.clientHeight;
    if (pw <= 0 || ph <= 0) return;

    const targetRatio = WORLD_W / WORLD_H;
    let cw = pw;
    let ch = pw / targetRatio;
    if (ch > ph) {
      ch = ph;
      cw = ph * targetRatio;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.style.width = `${Math.floor(cw)}px`;
    this.canvas.style.height = `${Math.floor(ch)}px`;
    this.canvas.width = Math.floor(WORLD_W * dpr);
    this.canvas.height = Math.floor(WORLD_H * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  public getState(): GameState {
    return this.state;
  }

  public getLevelIndex(): number {
    return this.levelIndex;
  }

  // =========================================================================
  // INPUT CONTROLS
  // =========================================================================
  public setLeft(held: boolean): void {
    this.input.left = held;
  }

  public setRight(held: boolean): void {
    this.input.right = held;
  }

  public triggerFire(): void {
    this.audio.init();
    if (this.state === 'MAP_TRAVEL') {
      this.finishMapTravel();
      return;
    }
    if (this.state === 'STAGE_CLEAR') {
      this.advanceToNextStage();
      return;
    }
    if (this.state === 'PLAYING') {
      this.input.fireBufferTimer = 0.09;
    }
  }

  public clearInputs(): void {
    this.input.left = false;
    this.input.right = false;
    this.input.fireBufferTimer = 0;
  }

  // =========================================================================
  // STORY MODE & ARCADE FLOW CONTROLS
  // =========================================================================
  public startStoryAtLevel(index: number, resetScore = index === 0): void {
    this.audio.init();
    this.gameMode = 'STORY';
    if (resetScore) {
      this.score = 0;
      this.newRecordReached = false;
    } else if (this.storyProgress.storyScore > 0 && this.score === 0) {
      this.score = this.storyProgress.storyScore;
    }
    this.lives = 3;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.activeRadioComm = null;
    this.radioCommTimer = 0;

    this.storyProgress.currentStageIndex = index;
    if (index > this.storyProgress.unlockedStageIndex) {
      this.storyProgress.unlockedStageIndex = index;
    }
    saveStoryProgress(this.storyProgress);

    this.loadLevel(index, false, false);
    this.beginStageOrIntroCutscene();
  }

  public continueStory(): void {
    const target = this.storyProgress.currentStageIndex || 0;
    this.startStoryAtLevel(target, false);
  }

  public startAtLevel(index: number): void {
    this.audio.init();
    this.gameMode = 'ARCADE';
    this.score = 0;
    this.lives = 3;
    this.newRecordReached = false;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.activeCutscene = null;
    this.activeRadioComm = null;
    this.state = 'PLAYING';
    this.loadLevel(index, false, true);
    this.emitHud();
  }

  private beginStageOrIntroCutscene(): void {
    const lvl = LEVELS[this.levelIndex] || LEVELS[0];
    if (this.gameMode === 'STORY') {
      const intro = buildStoryCutscene(this.levelIndex, 'intro', lvl.name, lvl.country, lvl.flag);
      if (intro) {
        this.activeCutscene = intro;
        this.postCutsceneAction = 'START_STAGE';
        this.state = 'STORY_CUTSCENE';
        this.clearInputs();
        this.audio.setDynamicState({ timeRatio: 1, comboCount: 0, frozen: false, bubbleCount: this.bubbles.length });
        this.audio.playTheme(intro.musicMood);
        this.emitHud();
        return;
      }
    }
    this.state = 'PLAYING';
    this.audio.playTheme(lvl.theme);
    this.emitHud();
  }

  public replayCutscene(cutscene: StoryCutsceneDef): void {
    this.audio.init();
    this.previousStateBeforeReplay = this.state === 'STORY_CUTSCENE' ? 'START' : this.state;
    this.activeCutscene = cutscene;
    this.postCutsceneAction = 'RETURN_PREVIOUS';
    this.state = 'STORY_CUTSCENE';
    this.clearInputs();
    this.audio.playTheme(cutscene.musicMood);
    this.emitHud();
  }

  public completeCutscene(): void {
    if (this.state !== 'STORY_CUTSCENE') return;
    const action = this.postCutsceneAction;
    this.activeCutscene = null;

    if (action === 'START_STAGE') {
      const lvl = LEVELS[this.levelIndex] || LEVELS[0];
      this.state = 'PLAYING';
      this.stageIntroTimer = 2.6;
      this.audio.playTheme(lvl.theme);
      this.emitHud();
    } else if (action === 'START_TRAVEL') {
      this.startMapTravel(this.levelIndex, this.levelIndex + 1);
    } else if (action === 'SHOW_VICTORY') {
      this.state = 'VICTORY';
      this.audio.stopMusic();
      this.audio.victory();
      this.emitHud();
    } else {
      this.state = this.previousStateBeforeReplay;
      if (this.state === 'PAUSED') {
        const lvl = LEVELS[this.levelIndex] || LEVELS[0];
        this.audio.playTheme(lvl.theme);
        this.audio.setDucked(true);
      } else {
        this.audio.stopMusic();
      }
      this.emitHud();
    }
  }

  public retryCurrentStage(): void {
    this.audio.init();
    this.lives = 3;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.activeRadioComm = null;
    this.state = 'PLAYING';
    this.loadLevel(this.levelIndex, false, true);
    this.emitHud();
  }

  public returnToTitle(): void {
    this.state = 'START';
    this.activeCutscene = null;
    this.activeRadioComm = null;
    this.clearInputs();
    this.audio.stopMusic();
    this.emitHud();
  }

  public togglePause(): void {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.clearInputs();
      this.audio.setDucked(true);
      this.emitHud();
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.audio.setDucked(false);
      this.emitHud();
    }
  }

  public pauseForModal(): void {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.clearInputs();
      this.audio.setDucked(true);
      this.emitHud();
    }
  }

  public toggleMusic(): void {
    this.audio.init();
    this.audio.toggleMusic();
    if (this.audio.musicEnabled) {
      if (this.state === 'PLAYING') {
        this.audio.playTheme(LEVELS[this.levelIndex].theme);
      } else if (this.state === 'STORY_CUTSCENE' && this.activeCutscene) {
        this.audio.playTheme(this.activeCutscene.musicMood);
      }
    }
    this.emitHud();
  }

  public toggleMute(): void {
    this.audio.init();
    this.audio.toggleMute();
    this.emitHud();
  }

  public previewStageTheme(index: number): void {
    this.audio.init();
    const lvl = LEVELS[index];
    if (lvl) {
      this.audio.setDynamicState({ timeRatio: 1, comboCount: 0, frozen: false, bubbleCount: 3 });
      this.audio.playTheme(lvl.theme);
    }
  }

  public advanceToNextStage(): void {
    if (this.levelIndex >= LEVELS.length - 1) return;
    this.audio.init();

    // Check if current stage has a Story Mode Act-Finale Outro Cutscene before traveling!
    if (this.gameMode === 'STORY') {
      const lvl = LEVELS[this.levelIndex];
      const outro = buildStoryCutscene(this.levelIndex, 'outro', lvl.name, lvl.country, lvl.flag);
      if (outro) {
        this.activeCutscene = outro;
        this.postCutsceneAction = 'START_TRAVEL';
        this.state = 'STORY_CUTSCENE';
        this.clearInputs();
        this.audio.playTheme(outro.musicMood);
        this.emitHud();
        return;
      }
    }

    this.startMapTravel(this.levelIndex, this.levelIndex + 1);
  }

  public skipMapTravel(): void {
    this.finishMapTravel();
  }

  private startMapTravel(fromIdx: number, toIdx: number): void {
    this.state = 'MAP_TRAVEL';
    this.activeRadioComm = null;
    this.clearInputs();
    const isSpace = Boolean(LEVELS[toIdx].spaceStage);
    this.travel = {
      fromIndex: fromIdx,
      toIndex: toIdx,
      progress: 0,
      duration: 4.1,
      isSpace,
      exhaust: []
    };
    this.audio.setDynamicState({ timeRatio: 1, comboCount: 0, frozen: false, bubbleCount: 0 });
    this.audio.playTheme('travel');
    if (isSpace) this.audio.rocketLaunch();
    else this.audio.planeFlight();
    this.emitHud();
  }

  private finishMapTravel(): void {
    if (this.state !== 'MAP_TRAVEL') return;
    this.loadLevel(this.travel.toIndex, true, false);
    this.beginStageOrIntroCutscene();
  }

  // =========================================================================
  // ENTITY CREATION & LEVEL LOADING
  // =========================================================================
  private createPlayer(): Player {
    const startX = WORLD_W / 2;
    return {
      x: startX,
      y: GROUND_Y,
      w: 38,
      h: 54,
      speed: 332,
      facing: 1,
      prevMoveDir: 0,
      vx: 0,
      tilt: 0,
      walkCycle: 0,
      shootAnim: 0,
      recoil: 0,
      muzzleFlash: 0,
      blinkTimer: 2.6,
      isBlinking: false,
      goggleGlint: 0,
      invulnTimer: 0,
      hasShield: false,
      doubleTimer: 0,
      stickyTimer: 0,
      scarfNodes: Array.from({ length: 6 }, (_, i) => ({
        x: startX - i * 5,
        y: GROUND_Y - 37 + i * 1.2
      }))
    };
  }

  private createBubble(x: number, y: number, size: 0 | 1 | 2 | 3, dir: 1 | -1, vy = -100): Bubble {
    const spec = BUBBLE_SPECS[size];
    return {
      x,
      y,
      size,
      r: spec.radius,
      vx: spec.speedX * (dir >= 0 ? 1 : -1),
      vy,
      scaleX: 1,
      scaleY: 1,
      rotAngle: Math.random() * Math.PI * 2,
      wobble: Math.random() * Math.PI * 2,
      flashTimer: 0
    };
  }

  private loadLevel(index: number, keepPowerups: boolean, playMusic: boolean): void {
    const lvl = LEVELS[index] || LEVELS[0];
    this.levelIndex = index;
    this.timeLimit = lvl.timeLimit;
    this.timeRemaining = lvl.timeLimit;
    this.freezeTimer = 0;
    this.stageIntroTimer = 2.6;
    this.hitstopTimer = 0;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.midCommTriggered = false;
    this.stagePlayElapsed = 0;
    this.activeRadioComm = null;
    this.radioCommTimer = 0;

    const prevPlayer = this.player;
    this.player = this.createPlayer();
    if (keepPowerups && prevPlayer) {
      this.player.hasShield = prevPlayer.hasShield;
      this.player.doubleTimer = prevPlayer.doubleTimer;
      this.player.stickyTimer = prevPlayer.stickyTimer;
    }
    this.player.invulnTimer = 1.4;

    this.bubbles = lvl.bubbles.map((b) => this.createBubble(b.x, b.y, b.size, b.dir, -80));
    this.blocks = lvl.blocks.map((bl) => ({ ...bl }));
    this.harpoons = [];
    this.powerups = [];
    this.particles = [];
    this.shards = [];
    this.rings = [];
    this.popups = [];

    this.audio.setDynamicState({
      timeRatio: 1,
      comboCount: 0,
      frozen: false,
      bubbleCount: this.bubbles.length
    });

    if (playMusic && this.state === 'PLAYING') {
      this.audio.playTheme(lvl.theme);
    }
  }

  private triggerMidStageRadioComm(): void {
    if (this.midCommTriggered || this.gameMode !== 'STORY') return;
    const script = STAGE_STORY_SCRIPT[this.levelIndex];
    if (!script?.midComm) return;
    this.midCommTriggered = true;
    this.activeRadioComm = script.midComm;
    this.radioCommTimer = 5.4;
    this.audio.radioChime();
    this.emitHud();
  }

  // =========================================================================
  // GAMEPLAY ACTIONS
  // =========================================================================
  private tryFireHarpoon(): boolean {
    if (this.state !== 'PLAYING') return false;
    const maxHarpoons = this.player.doubleTimer > 0 ? 2 : 1;
    if (this.harpoons.length >= maxHarpoons) return false;

    this.harpoons.push({
      x: this.player.x,
      topY: this.player.y - this.player.h,
      bottomY: GROUND_Y,
      speed: 660,
      sticky: this.player.stickyTimer > 0,
      latched: false,
      latchTimer: 4.5,
      waveOffset: 0,
      sparksTimer: 0
    });
    this.player.shootAnim = 0.24;
    this.player.recoil = 1.0;
    this.player.muzzleFlash = 0.12;
    this.audio.shoot();
    return true;
  }

  private addScore(points: number, x?: number, y?: number, text?: string, color = '#fef08a', scale = 1): void {
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.newRecordReached = true;
      try {
        localStorage.setItem(HIGHSCORE_KEY, String(this.highScore));
      } catch {
        // Ignore storage errors
      }
    }
    if (x !== undefined && y !== undefined) {
      this.popups.push({
        x,
        y,
        text: text || `+${points}`,
        color,
        scale,
        life: 0.95,
        maxLife: 0.95
      });
    }
  }

  private spawnFootDust(x: number, dir: number): void {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: GROUND_Y - 3,
        vx: -dir * (30 + Math.random() * 68) + (Math.random() - 0.5) * 20,
        vy: -25 - Math.random() * 48,
        r: 2.4 + Math.random() * 3.2,
        color: 'rgba(226, 232, 240, 0.85)',
        life: 0.26 + Math.random() * 0.18,
        maxLife: 0.44
      });
    }
  }

  private spawnBlockShards(bl: Block): void {
    const style = getBlockThemeStyle(LEVELS[this.levelIndex].theme);
    for (let i = 0; i < 14; i++) {
      this.shards.push({
        x: bl.x + Math.random() * bl.w,
        y: bl.y + Math.random() * bl.h,
        vx: (Math.random() - 0.5) * 270,
        vy: -130 - Math.random() * 195,
        w: 5 + Math.random() * 7,
        h: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 15,
        color: i % 2 === 0 ? style.destTop : style.destBot,
        border: style.destBorder,
        life: 0.78 + Math.random() * 0.35,
        maxLife: 1.13
      });
    }
  }

  private spawnParticles(x: number, y: number, color: string, count = 14, speedScale = 1): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = (75 + Math.random() * 205) * speedScale;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 48,
        r: 2.5 + Math.random() * 4.5,
        color,
        life: 0.44 + Math.random() * 0.35,
        maxLife: 0.79
      });
    }
  }

  private spawnRing(x: number, y: number, maxR: number, color: string): void {
    this.rings.push({ x, y, r: 8, maxR, color, life: 0.32, maxLife: 0.32 });
  }

  private maybeSpawnPowerup(x: number, y: number, chance = 0.2): void {
    if (Math.random() > chance) return;
    let type: PowerupType;
    if (this.lives < 5 && Math.random() < 0.06) {
      type = 'extralife';
    } else {
      const standard: PowerupType[] = ['double', 'sticky', 'shield', 'freeze', 'dynamite'];
      type = standard[Math.floor(Math.random() * standard.length)];
    }
    this.powerups.push({
      x: Math.max(LEFT_WALL + 22, Math.min(RIGHT_WALL - 22, x)),
      y,
      vy: -120,
      r: 17,
      type,
      life: 8.5,
      spin: 0
    });
  }

  private popBubble(bubbleIndex: number, fromDynamite = false): void {
    const b = this.bubbles[bubbleIndex];
    if (!b) return;
    const spec = BUBBLE_SPECS[b.size];
    const lvl = LEVELS[this.levelIndex];
    const mainColor = lvl.palette[b.size] || spec.defaultColors[0];

    this.bubbles.splice(bubbleIndex, 1);
    this.spawnParticles(b.x, b.y, mainColor, 15 + b.size * 5, 1.05);
    this.spawnParticles(b.x, b.y, '#ffffff', 7, 0.75);
    this.spawnRing(b.x, b.y, b.r * 1.85, mainColor);

    if (!fromDynamite) {
      this.comboCount = this.comboTimer > 0 ? this.comboCount + 1 : 1;
      this.comboTimer = 2.1;

      const comboBonus = this.comboCount >= 2 ? (this.comboCount - 1) * 100 : 0;
      const totalPts = spec.points + comboBonus;
      this.audio.pop(b.size, this.comboCount);
      this.addScore(totalPts, b.x, b.y - 10, `+${totalPts}`, '#fef08a');

      if (this.comboCount >= 2) {
        this.addScore(0, b.x, b.y - 30, `COMBO x${this.comboCount}!`, '#38bdf8', 1.05);
      }

      if (b.size >= 2) {
        this.hitstopTimer = Math.max(this.hitstopTimer, 0.036);
        this.shakeTimer = Math.max(this.shakeTimer, 0.12);
        this.shakeIntensity = Math.max(this.shakeIntensity, b.size === 3 ? 4.5 : 2.8);
      }
      this.maybeSpawnPowerup(b.x, b.y, 0.2);

      // Trigger mid-stage tactical radio comm after stage intro banner clears
      if (!this.midCommTriggered && this.stageIntroTimer <= 0.2) {
        this.triggerMidStageRadioComm();
      }
    } else {
      this.addScore(Math.floor(spec.points / 2), b.x, b.y - 8, `+${Math.floor(spec.points / 2)}`, '#fbbf24');
    }

    if (b.size > 0) {
      const nextSize = (b.size - 1) as 0 | 1 | 2;
      const nextR = BUBBLE_SPECS[nextSize].radius;
      const offset = nextR * 0.68;
      const splitVy = Math.min(-255, -180 - nextSize * 44);
      const leftB = this.createBubble(Math.max(LEFT_WALL + nextR, b.x - offset), b.y, nextSize, -1, splitVy);
      const rightB = this.createBubble(Math.min(RIGHT_WALL - nextR, b.x + offset), b.y, nextSize, 1, splitVy);
      leftB.flashTimer = 0.07;
      rightB.flashTimer = 0.07;
      this.bubbles.push(leftB, rightB);
    }
  }

  private triggerDynamite(): void {
    this.audio.dynamite();
    this.hitstopTimer = 0.055;
    this.shakeTimer = 0.42;
    this.shakeIntensity = 9.5;
    this.flashAlpha = 0.68;

    const toSplit: number[] = [];
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      if (this.bubbles[i].size > 0) toSplit.push(i);
    }
    if (toSplit.length > 0) {
      toSplit.forEach((idx) => this.popBubble(idx, true));
    } else {
      for (let i = this.bubbles.length - 1; i >= 0; i--) this.popBubble(i, true);
    }
  }

  private collectPowerup(p: PowerupItem): void {
    const def = POWERUP_DEFS[p.type];
    this.addScore(250, p.x, p.y - 18, def.label, def.color, 1.05);
    this.spawnRing(p.x, p.y, 38, def.color);

    if (p.type === 'double') {
      this.player.doubleTimer = def.duration;
      this.audio.powerup();
    } else if (p.type === 'sticky') {
      this.player.stickyTimer = def.duration;
      this.audio.powerup();
    } else if (p.type === 'shield') {
      this.player.hasShield = true;
      this.audio.powerup();
    } else if (p.type === 'freeze') {
      this.freezeTimer = def.duration;
      this.audio.freeze();
    } else if (p.type === 'dynamite') {
      this.triggerDynamite();
    } else if (p.type === 'extralife') {
      this.lives = Math.min(5, this.lives + 1);
      this.audio.extraLife();
    }
    this.emitHud();
  }

  private damagePlayer(reason = 'Você foi atingido!'): void {
    if (this.player.invulnTimer > 0) return;

    if (this.player.hasShield) {
      this.player.hasShield = false;
      this.player.invulnTimer = 2.0;
      this.hitstopTimer = 0.04;
      this.shakeTimer = 0.26;
      this.shakeIntensity = 6;
      this.spawnParticles(this.player.x, this.player.y - this.player.h / 2, '#38bdf8', 24, 1.15);
      this.spawnRing(this.player.x, this.player.y - this.player.h / 2, 54, '#38bdf8');
      this.popups.push({
        x: this.player.x,
        y: this.player.y - this.player.h - 10,
        text: 'ESCUDO PROTEGEU!',
        color: '#7dd3fc',
        life: 1.2,
        maxLife: 1.2
      });
      this.audio.shieldBlock();
      this.emitHud();
      return;
    }

    this.lives -= 1;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.audio.hit();
    this.hitstopTimer = 0.05;
    this.shakeTimer = 0.36;
    this.shakeIntensity = 8.5;
    this.spawnParticles(this.player.x, this.player.y - this.player.h / 2, '#f43f5e', 28, 1.25);

    if (this.lives <= 0) {
      this.state = 'GAME_OVER';
      this.gameOverReason = reason;
      this.activeRadioComm = null;
      this.clearInputs();
      this.audio.stopMusic();
      this.audio.gameOver();
    } else {
      this.loadLevel(this.levelIndex, false, false);
    }
    this.emitHud();
  }

  private handleStageClear(): void {
    const timeBonus = Math.ceil(this.timeRemaining) * 50;
    this.stageTimeBonus = timeBonus;
    this.addScore(timeBonus);
    this.activeRadioComm = null;
    this.clearInputs();

    if (this.gameMode === 'STORY') {
      const nextIdx = Math.min(LEVELS.length - 1, this.levelIndex + 1);
      if (nextIdx > this.storyProgress.unlockedStageIndex) {
        this.storyProgress.unlockedStageIndex = nextIdx;
      }
      this.storyProgress.currentStageIndex = nextIdx;
      this.storyProgress.storyScore = this.score;
      if (this.levelIndex >= LEVELS.length - 1) {
        this.storyProgress.completed = true;
      }
      saveStoryProgress(this.storyProgress);
    }

    if (this.levelIndex >= LEVELS.length - 1) {
      this.victoryLivesBonus = this.lives * 2000;
      this.addScore(this.victoryLivesBonus);

      // In Story Mode, play the cinematic Epilogue before showing Victory trophy modal!
      if (this.gameMode === 'STORY') {
        const lvl = LEVELS[this.levelIndex];
        const epilogue = buildStoryCutscene(this.levelIndex, 'outro', lvl.name, lvl.country, lvl.flag);
        if (epilogue) {
          this.activeCutscene = epilogue;
          this.postCutsceneAction = 'SHOW_VICTORY';
          this.state = 'STORY_CUTSCENE';
          this.audio.playTheme(epilogue.musicMood);
          this.emitHud();
          return;
        }
      }

      this.state = 'VICTORY';
      this.audio.stopMusic();
      this.audio.victory();
      this.emitHud();
      return;
    }

    this.state = 'STAGE_CLEAR';
    this.audio.stopMusic();
    this.audio.stageClear();
    this.emitHud();
  }

  // =========================================================================
  // COLLISIONS & SIMULATION LOOP
  // =========================================================================
  private resolveBubbleBlockCollision(b: Bubble, block: Block): void {
    const closestX = Math.max(block.x, Math.min(b.x, block.x + block.w));
    const closestY = Math.max(block.y, Math.min(b.y, block.y + block.h));
    const dx = b.x - closestX;
    const dy = b.y - closestY;

    if (dx * dx + dy * dy < b.r * b.r) {
      const overlapLeft = b.x + b.r - block.x;
      const overlapRight = block.x + block.w - (b.x - b.r);
      const overlapTop = b.y + b.r - block.y;
      const overlapBottom = block.y + block.h - (b.y - b.r);
      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      if (minOverlap === overlapTop) {
        b.y = block.y - b.r;
        b.vy = -Math.max(Math.abs(b.vy) * 0.92, Math.abs(BUBBLE_SPECS[b.size].bounceVy) * 0.72);
        b.scaleX = 1.22;
        b.scaleY = 0.8;
      } else if (minOverlap === overlapBottom) {
        b.y = block.y + block.h + b.r;
        b.vy = Math.abs(b.vy) * 0.8 + 40;
      } else if (minOverlap === overlapLeft) {
        b.x = block.x - b.r;
        b.vx = -Math.abs(b.vx);
        b.scaleX = 0.84;
        b.scaleY = 1.16;
      } else {
        b.x = block.x + block.w + b.r;
        b.vx = Math.abs(b.vx);
        b.scaleX = 0.84;
        b.scaleY = 1.16;
      }
    }
  }

  private circleIntersectsVerticalLine(
    cx: number,
    cy: number,
    r: number,
    lineX: number,
    topY: number,
    bottomY: number
  ): boolean {
    const clampedY = Math.max(topY, Math.min(cy, bottomY));
    const dx = cx - lineX;
    const dy = cy - clampedY;
    return dx * dx + dy * dy <= (r + 5) * (r + 5);
  }

  private updateScarfPhysics(dt: number): void {
    const pl = this.player;
    const isMoving = Math.abs(pl.vx) > 5;
    const anchorX = pl.x - pl.facing * 2;
    const anchorY =
      pl.y - 37 - (isMoving ? Math.abs(Math.cos(pl.walkCycle)) * 2.6 : Math.sin(this.bgTime * 3.5));
    pl.scarfNodes[0].x = anchorX;
    pl.scarfNodes[0].y = anchorY;

    const windX = isMoving ? -Math.sign(pl.vx) * 215 : -pl.facing * 56;
    const segLen = 5.5;

    for (let i = 1; i < pl.scarfNodes.length; i++) {
      const prev = pl.scarfNodes[i - 1];
      const curr = pl.scarfNodes[i];
      const flutter = Math.sin(this.bgTime * (isMoving ? 19 : 7.5) - i * 0.9) * (isMoving ? 56 : 22);
      curr.x += windX * dt;
      curr.y += (32 + flutter) * dt;

      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      curr.x = prev.x + (dx / dist) * segLen;
      curr.y = prev.y + (dy / dist) * segLen;
    }
  }

  private update(dt: number): void {
    this.bgTime += dt;

    // Live-world scenic tour cycling on the Title Screen!
    if (this.state === 'START') {
      this.cameraNormX = Math.sin(this.bgTime * 0.45) * 0.65;
      this.showcaseTimer += dt;
      if (this.showcaseTimer >= 7.5) {
        this.showcaseTimer = 0;
        this.showcaseCursor = (this.showcaseCursor + 1) % SHOWCASE_INDICES.length;
        this.levelIndex = SHOWCASE_INDICES[this.showcaseCursor];
        const lvl = LEVELS[this.levelIndex];
        this.bubbles = lvl.bubbles.map((b) => this.createBubble(b.x, b.y, b.size, b.dir, -80));
        this.blocks = lvl.blocks.map((bl) => ({ ...bl }));
        this.emitHud();
      }
      const theme = LEVELS[this.levelIndex].theme;
      updateAmbientWeather(dt, this.bgTime, theme);
      this.updateScarfPhysics(dt);
      const gravity = BASE_GRAVITY * (LEVELS[this.levelIndex].gravityScale || 1.0);
      for (const b of this.bubbles) {
        const spec = BUBBLE_SPECS[b.size];
        b.scaleX += (1 - b.scaleX) * Math.min(1, dt * 14);
        b.scaleY += (1 - b.scaleY) * Math.min(1, dt * 14);
        b.vy += gravity * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.rotAngle += (b.vx / b.r) * dt * 0.55;
        if (b.x - b.r < LEFT_WALL) {
          b.x = LEFT_WALL + b.r;
          b.vx = Math.abs(b.vx);
        }
        if (b.x + b.r > RIGHT_WALL) {
          b.x = RIGHT_WALL - b.r;
          b.vx = -Math.abs(b.vx);
        }
        if (b.y - b.r < CEILING_Y) {
          b.y = CEILING_Y + b.r;
          b.vy = Math.abs(b.vy) * 0.55;
        }
        if (b.y + b.r >= GROUND_Y) {
          b.y = GROUND_Y - b.r;
          b.vy = spec.bounceVy;
          b.scaleX = 1.22;
          b.scaleY = 0.8;
        }
        for (const bl of this.blocks) this.resolveBubbleBlockCollision(b, bl);
      }
      return;
    }

    const currentTheme = LEVELS[this.levelIndex].theme;
    updateAmbientWeather(dt, this.bgTime, currentTheme);

    if (this.state === 'STORY_CUTSCENE') {
      // Gentle cinematic camera drift while dialogue plays over the live destination!
      this.cameraNormX = Math.sin(this.bgTime * 0.38) * 0.45;
      this.updateScarfPhysics(dt);
      this.updateEffects(dt);
      return;
    }

    if (this.state === 'MAP_TRAVEL') {
      this.travel.progress += dt / this.travel.duration;
      for (let i = this.travel.exhaust.length - 1; i >= 0; i--) {
        const ex = this.travel.exhaust[i];
        ex.x += ex.vx * dt;
        ex.y += ex.vy * dt;
        ex.life -= dt;
        if (ex.life <= 0) this.travel.exhaust.splice(i, 1);
      }
      if (this.travel.progress >= 1) {
        this.finishMapTravel();
      }
      return;
    }

    if (this.state !== 'PLAYING') {
      this.updateScarfPhysics(dt);
      this.updateEffects(dt);
      return;
    }

    // Tactile hitstop freeze frame on heavy impacts
    if (this.hitstopTimer > 0) {
      this.hitstopTimer = Math.max(0, this.hitstopTimer - dt);
      if (this.shakeTimer > 0) this.shakeTimer = Math.max(0, this.shakeTimer - dt);
      return;
    }

    const lvl = LEVELS[this.levelIndex];
    const gravity = BASE_GRAVITY * (lvl.gravityScale || 1.0);

    this.stagePlayElapsed += dt;
    if (this.stageIntroTimer > 0) this.stageIntroTimer = Math.max(0, this.stageIntroTimer - dt);
    if (this.shakeTimer > 0) this.shakeTimer = Math.max(0, this.shakeTimer - dt);
    if (this.flashAlpha > 0) this.flashAlpha = Math.max(0, this.flashAlpha - dt * 2.2);
    if (this.comboTimer > 0) {
      this.comboTimer = Math.max(0, this.comboTimer - dt);
      if (this.comboTimer === 0) this.comboCount = 0;
    }

    // Radio comm toast timer & fallback trigger
    if (this.radioCommTimer > 0) {
      this.radioCommTimer = Math.max(0, this.radioCommTimer - dt);
      if (this.radioCommTimer === 0) {
        this.activeRadioComm = null;
        this.emitHud();
      }
    } else if (!this.midCommTriggered && this.stagePlayElapsed > 6.2) {
      this.triggerMidStageRadioComm();
    }

    // 1. Timer
    if (this.freezeTimer > 0) {
      this.freezeTimer = Math.max(0, this.freezeTimer - dt);
    } else {
      this.timeRemaining -= dt;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.damagePlayer('O tempo da fase acabou!');
        return;
      }
    }

    // Feed live gameplay state into Dynamic OST Engine!
    this.audio.setDynamicState({
      timeRatio: this.timeRemaining / Math.max(1, this.timeLimit),
      comboCount: this.comboCount,
      frozen: this.freezeTimer > 0,
      bubbleCount: this.bubbles.length
    });

    // 2. Player movement, animations & smooth parallax camera tracking
    const pl = this.player;
    let moveDir = 0;
    if (this.input.left) moveDir -= 1;
    if (this.input.right) moveDir += 1;

    if (moveDir !== 0 && moveDir !== pl.prevMoveDir) {
      this.spawnFootDust(pl.x, moveDir);
    }
    pl.prevMoveDir = moveDir;

    pl.vx = moveDir * pl.speed;
    if (moveDir !== 0) {
      pl.facing = moveDir > 0 ? 1 : -1;
      pl.x += pl.vx * dt;
      pl.walkCycle += dt * 15.5;
    } else {
      pl.walkCycle = 0;
    }
    pl.x = Math.max(LEFT_WALL + pl.w / 2, Math.min(RIGHT_WALL - pl.w / 2, pl.x));

    // Smooth parallax camera norm (-1 left wall .. +1 right wall)
    const targetCam = (pl.x - WORLD_W / 2) / (WORLD_W / 2 - LEFT_WALL);
    this.cameraNormX += (targetCam - this.cameraNormX) * Math.min(1, dt * 6.5);

    const targetTilt = moveDir * 0.095;
    pl.tilt += (targetTilt - pl.tilt) * Math.min(1, dt * 14);

    if (pl.shootAnim > 0) pl.shootAnim = Math.max(0, pl.shootAnim - dt);
    if (pl.recoil > 0) pl.recoil = Math.max(0, pl.recoil - dt * 6.5);
    if (pl.muzzleFlash > 0) pl.muzzleFlash = Math.max(0, pl.muzzleFlash - dt);
    if (pl.invulnTimer > 0) pl.invulnTimer = Math.max(0, pl.invulnTimer - dt);
    if (pl.doubleTimer > 0) pl.doubleTimer = Math.max(0, pl.doubleTimer - dt);
    if (pl.stickyTimer > 0) pl.stickyTimer = Math.max(0, pl.stickyTimer - dt);

    pl.blinkTimer -= dt;
    if (pl.blinkTimer <= 0) {
      pl.isBlinking = !pl.isBlinking;
      pl.blinkTimer = pl.isBlinking ? 0.13 : 2.2 + Math.random() * 2.8;
      if (!pl.isBlinking && Math.random() < 0.6) pl.goggleGlint = 1.0;
    }
    if (pl.goggleGlint > 0) pl.goggleGlint = Math.max(0, pl.goggleGlint - dt * 2.4);

    this.updateScarfPhysics(dt);

    // Buffered edge-triggered fire
    if (this.input.fireBufferTimer > 0) {
      this.input.fireBufferTimer = Math.max(0, this.input.fireBufferTimer - dt);
      if (this.tryFireHarpoon()) {
        this.input.fireBufferTimer = 0;
      }
    }

    // 3. Harpoons
    for (let i = this.harpoons.length - 1; i >= 0; i--) {
      const h = this.harpoons[i];
      h.waveOffset += dt * 25;

      if (!h.latched) {
        h.topY -= h.speed * dt;
        let hitBlock = false;
        for (let bi = this.blocks.length - 1; bi >= 0; bi--) {
          const bl = this.blocks[bi];
          if (
            h.x >= bl.x - 4 &&
            h.x <= bl.x + bl.w + 4 &&
            h.topY <= bl.y + bl.h &&
            h.bottomY >= bl.y
          ) {
            h.topY = bl.y + bl.h;
            hitBlock = true;
            if (bl.destructible) {
              this.blocks.splice(bi, 1);
              this.audio.blockBreak();
              this.spawnBlockShards(bl);
              this.spawnParticles(bl.x + bl.w / 2, bl.y + bl.h / 2, '#fde047', 10, 0.9);
              this.addScore(150, bl.x + bl.w / 2, bl.y, '+150', '#fde047');
              this.maybeSpawnPowerup(bl.x + bl.w / 2, bl.y + bl.h / 2, 0.28);
              this.harpoons.splice(i, 1);
            } else if (h.sticky) {
              h.latched = true;
              this.spawnParticles(h.x, h.topY, '#fde047', 8, 0.65);
              this.audio.hookLatch();
            } else {
              this.harpoons.splice(i, 1);
            }
            break;
          }
        }
        if (hitBlock) continue;

        if (h.topY <= CEILING_Y) {
          h.topY = CEILING_Y;
          if (h.sticky) {
            h.latched = true;
            this.spawnParticles(h.x, h.topY, '#fde047', 8, 0.65);
            this.audio.hookLatch();
          } else {
            this.harpoons.splice(i, 1);
            continue;
          }
        }
      } else {
        h.latchTimer -= dt;
        if (h.latchTimer <= 0) {
          this.harpoons.splice(i, 1);
        }
      }
    }

    // 4. Bubbles
    const isFrozen = this.freezeTimer > 0;
    const bounceFactor = lvl.spaceStage ? 0.88 : 1.0;

    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      const spec = BUBBLE_SPECS[b.size];

      b.scaleX += (1 - b.scaleX) * Math.min(1, dt * 14);
      b.scaleY += (1 - b.scaleY) * Math.min(1, dt * 14);
      if (b.flashTimer > 0) b.flashTimer = Math.max(0, b.flashTimer - dt);

      if (!isFrozen) {
        b.vy += gravity * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.rotAngle += (b.vx / b.r) * dt * 0.55;
        b.wobble += dt * 5;

        if (b.x - b.r < LEFT_WALL) {
          b.x = LEFT_WALL + b.r;
          b.vx = Math.abs(b.vx);
          b.scaleX = 0.84;
          b.scaleY = 1.16;
        } else if (b.x + b.r > RIGHT_WALL) {
          b.x = RIGHT_WALL - b.r;
          b.vx = -Math.abs(b.vx);
          b.scaleX = 0.84;
          b.scaleY = 1.16;
        }

        if (b.y - b.r < CEILING_Y) {
          b.y = CEILING_Y + b.r;
          b.vy = Math.abs(b.vy) * 0.55;
          b.scaleX = 1.16;
          b.scaleY = 0.84;
        }

        if (b.y + b.r >= GROUND_Y) {
          b.y = GROUND_Y - b.r;
          b.vy = spec.bounceVy * bounceFactor;
          b.scaleX = 1.24;
          b.scaleY = 0.78;
        }

        for (const bl of this.blocks) {
          this.resolveBubbleBlockCollision(b, bl);
        }
      }

      // Harpoon vs Bubble collision
      let popped = false;
      for (let hi = this.harpoons.length - 1; hi >= 0; hi--) {
        const h = this.harpoons[hi];
        if (this.circleIntersectsVerticalLine(b.x, b.y, b.r, h.x, h.topY, h.bottomY)) {
          this.harpoons.splice(hi, 1);
          this.popBubble(i, false);
          popped = true;
          break;
        }
      }
      if (popped) continue;

      // Player vs Bubble collision
      const px = pl.x;
      const py = pl.y - pl.h * 0.48;
      const hitHalfW = pl.w * 0.34;
      const hitHalfH = pl.h * 0.43;
      const closestX = Math.max(px - hitHalfW, Math.min(b.x, px + hitHalfW));
      const closestY = Math.max(py - hitHalfH, Math.min(b.y, py + hitHalfH));
      const dx = b.x - closestX;
      const dy = b.y - closestY;
      if (dx * dx + dy * dy < b.r * 0.86 * (b.r * 0.86)) {
        this.damagePlayer('Uma Esfera Prisma atingiu você!');
        return;
      }
    }

    // 5. Power-ups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.vy += 460 * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.spin += dt * 4;

      if (p.y + p.r >= GROUND_Y) {
        p.y = GROUND_Y - p.r;
        p.vy = Math.abs(p.vy) > 65 ? -p.vy * 0.38 : 0;
      }

      if (Math.hypot(p.x - pl.x, p.y - (pl.y - pl.h * 0.5)) < p.r + 24) {
        this.collectPowerup(p);
        this.powerups.splice(i, 1);
        continue;
      }
      if (p.life <= 0) this.powerups.splice(i, 1);
    }

    // 6. Effects & Stage Clear Check
    this.updateEffects(dt);
    if (this.bubbles.length === 0) {
      this.handleStageClear();
      return;
    }

    // Throttled HUD sync (~12Hz during active play)
    this.hudSyncAccum += dt;
    if (this.hudSyncAccum >= 0.085) {
      this.hudSyncAccum = 0;
      this.emitHud();
    }
  }

  private updateEffects(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.vy += 420 * dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.shards.length - 1; i >= 0; i--) {
      const sh = this.shards[i];
      sh.vy += 580 * dt;
      sh.x += sh.vx * dt;
      sh.y += sh.vy * dt;
      sh.rot += sh.vrot * dt;
      sh.life -= dt;
      if (sh.life <= 0) this.shards.splice(i, 1);
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const rg = this.rings[i];
      rg.life -= dt;
      rg.r = rg.maxR * (1 - rg.life / rg.maxLife);
      if (rg.life <= 0) this.rings.splice(i, 1);
    }
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.y -= 42 * dt;
      pop.life -= dt;
      if (pop.life <= 0) this.popups.splice(i, 1);
    }
  }

  // =========================================================================
  // RENDER PASS
  // =========================================================================
  private render(): void {
    const ctx = this.ctx;
    ctx.save();

    if (this.state === 'MAP_TRAVEL') {
      renderMapTravel(ctx, this.travel, this.bgTime);
      ctx.restore();
      return;
    }

    if (this.shakeTimer > 0) {
      ctx.translate(
        (Math.random() - 0.5) * this.shakeIntensity * 2,
        (Math.random() - 0.5) * this.shakeIntensity * 2
      );
    }

    const lvl = LEVELS[this.levelIndex] || LEVELS[0];
    drawBackground(ctx, lvl.theme, this.bgTime, this.freezeTimer, this.cameraNormX);
    drawArenaFrame(ctx, lvl.theme, this.cameraNormX);
    drawBlocks(ctx, this.blocks, lvl.theme);
    drawHarpoons(ctx, this.harpoons, this.bgTime);
    drawPowerups(ctx, this.powerups, this.bgTime);
    drawBubbles(ctx, this.bubbles, lvl, this.bgTime, this.freezeTimer);
    drawPlayer(ctx, this.player, this.state, this.bgTime, Boolean(lvl.spaceStage));
    drawEffects(ctx, this.rings, this.shards, this.particles, this.popups);

    // Avoid overlapping stage banner while a Radio Comm Toast is visible
    if (!this.activeRadioComm) {
      drawStageIntroBanner(ctx, lvl, this.stageIntroTimer, this.state);
    }

    if (this.flashAlpha > 0) {
      ctx.fillStyle = `rgba(255, 240, 200, ${this.flashAlpha.toFixed(2)})`;
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    }

    ctx.restore();
  }

  private emitHud(): void {
    const lvl = LEVELS[this.levelIndex] || LEVELS[0];
    const ost = OST_TRACKS[lvl.theme];
    this.onHudUpdate({
      state: this.state,
      gameMode: this.gameMode,
      score: this.score,
      highScore: this.highScore,
      newRecordReached: this.newRecordReached,
      levelIndex: this.levelIndex,
      levelId: lvl.id,
      totalLevels: LEVELS.length,
      stageName: lvl.name,
      stageCountry: lvl.country,
      stageFlag: lvl.flag,
      isSpace: Boolean(lvl.spaceStage),
      ostTitle: ost ? ost.title : '',
      ostSectionLabel: this.audio.getCurrentSectionLabel(),
      ostIntensity: this.audio.getCurrentIntensity(),
      lives: this.lives,
      timeRemaining: this.timeRemaining,
      timeLimit: this.timeLimit,
      doubleTimer: this.player.doubleTimer,
      stickyTimer: this.player.stickyTimer,
      hasShield: this.player.hasShield,
      freezeTimer: this.freezeTimer,
      comboCount: this.comboCount,
      stageTimeBonus: this.stageTimeBonus,
      victoryLivesBonus: this.victoryLivesBonus,
      gameOverReason: this.gameOverReason,
      musicEnabled: this.audio.musicEnabled,
      sfxMuted: this.audio.sfxMuted,
      activeCutscene: this.activeCutscene,
      activeRadioComm: this.activeRadioComm,
      storyUnlockedIndex: this.storyProgress.unlockedStageIndex,
      storyCompleted: this.storyProgress.completed
    });
  }
}
