import { CEILING_Y, GROUND_Y, WORLD_W } from './levels';

// Stage indexes (0-based) that close each act and the stage that opens each act
export const ACT_END_LEVEL_INDEX = [5, 12, 16, 21, 23];
export const ACT_FIRST_LEVEL_INDEX = [0, 6, 13, 17, 22];

export type BossId = 'garuda' | 'zeppelin' | 'ironclad' | 'hydra' | 'matrix';

export type AttackKind =
  | 'spread'
  | 'aimed'
  | 'twin'
  | 'ring'
  | 'spiral'
  | 'rain'
  | 'bomb'
  | 'carpet'
  | 'beam';

export interface AttackDef {
  kind: AttackKind;
  interval: number;
  n?: number;
  speed?: number;
  arc?: number;
  delay?: number;
}

export interface BossStartBubble {
  x: number;
  y: number;
  size: 0 | 1 | 2 | 3;
  dir: 1 | -1;
}

export interface BossDef {
  id: BossId;
  act: number;
  name: string;
  title: string;
  levelIndex: number;
  hp: number;
  w: number;
  h: number;
  baseY: number;
  moveRange: number;
  moveSpeed: number;
  timeLimit: number;
  accent: string;
  accent2: string;
  spawnBubbleEvery: [number, number, number];
  spawnSize: 0 | 1 | 2 | 3;
  startBubbles: BossStartBubble[];
  phases: AttackDef[][];
  bonus: number;
  music: 'boss_battle' | 'boss_final';
}

export interface BossBullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ay: number;
  r: number;
  kind: 'orb' | 'feather' | 'bomb' | 'blast';
  life: number;
  color: string;
  rot: number;
}

export interface BossBeam {
  x: number;
  tele: number;
  teleMax: number;
  active: number;
  activeMax: number;
  width: number;
}

export interface BossState {
  def: BossDef;
  x: number;
  y: number;
  hp: number;
  hpGhost: number;
  phase: 0 | 1 | 2;
  flash: number;
  t: number;
  enter: number;
  warning: number;
  transition: number;
  timers: number[];
  bubbleTimer: number;
  spiralAngle: number;
  aim: number;
  bullets: BossBullet[];
  beams: BossBeam[];
  dying: boolean;
  dyingT: number;
}

export const BOSSES: BossDef[] = [
  {
    id: 'garuda',
    act: 1,
    name: 'GARUDA-01 "ASA DOURADA"',
    title: 'Guardião Mecânico do Templo',
    levelIndex: 5,
    hp: 34,
    w: 270,
    h: 150,
    baseY: 112,
    moveRange: 230,
    moveSpeed: 0.7,
    timeLimit: 150,
    accent: '#fbbf24',
    accent2: '#f43f5e',
    spawnBubbleEvery: [12, 9, 7],
    spawnSize: 1,
    startBubbles: [
      { x: 220, y: 230, size: 1, dir: 1 },
      { x: 740, y: 250, size: 1, dir: -1 }
    ],
    phases: [
      [{ kind: 'spread', interval: 2.0, n: 3, arc: 0.7, speed: 230 }],
      [
        { kind: 'spread', interval: 1.8, n: 5, arc: 1.1, speed: 235 },
        { kind: 'rain', interval: 3.4, n: 4 }
      ],
      [
        { kind: 'ring', interval: 3.0, n: 12, speed: 185 },
        { kind: 'spread', interval: 1.6, n: 5, arc: 1.2, speed: 240 },
        { kind: 'rain', interval: 2.8, n: 6 }
      ]
    ],
    bonus: 5000,
    music: 'boss_battle'
  },
  {
    id: 'zeppelin',
    act: 2,
    name: 'ZEPELIM "ÁS DE ESPADAS"',
    title: 'Bombardeiro Furtivo de Vesper',
    levelIndex: 12,
    hp: 44,
    w: 270,
    h: 120,
    baseY: 100,
    moveRange: 230,
    moveSpeed: 0.55,
    timeLimit: 170,
    accent: '#38bdf8',
    accent2: '#ef4444',
    spawnBubbleEvery: [12, 9, 7],
    spawnSize: 1,
    startBubbles: [
      { x: 200, y: 230, size: 2, dir: 1 },
      { x: 760, y: 230, size: 1, dir: -1 }
    ],
    phases: [
      [{ kind: 'bomb', interval: 1.6 }],
      [
        { kind: 'carpet', interval: 4.4, n: 5 },
        { kind: 'spread', interval: 2.4, n: 3, arc: 0.9, speed: 245 }
      ],
      [
        { kind: 'carpet', interval: 3.8, n: 6 },
        { kind: 'aimed', interval: 1.3, speed: 275 },
        { kind: 'bomb', interval: 1.4 }
      ]
    ],
    bonus: 7500,
    music: 'boss_battle'
  },
  {
    id: 'ironclad',
    act: 3,
    name: 'IRONCLAD "CZAR DE FERRO"',
    title: 'Fortaleza Voadora Blindada',
    levelIndex: 16,
    hp: 54,
    w: 260,
    h: 130,
    baseY: 106,
    moveRange: 230,
    moveSpeed: 0.62,
    timeLimit: 190,
    accent: '#ef4444',
    accent2: '#fbbf24',
    spawnBubbleEvery: [12, 9, 7],
    spawnSize: 2,
    startBubbles: [
      { x: 210, y: 240, size: 2, dir: 1 },
      { x: 750, y: 240, size: 2, dir: -1 }
    ],
    phases: [
      [{ kind: 'twin', interval: 1.6, speed: 265 }],
      [
        { kind: 'twin', interval: 1.4, speed: 285 },
        { kind: 'beam', interval: 4.4, n: 1 }
      ],
      [
        { kind: 'twin', interval: 1.2, speed: 300 },
        { kind: 'beam', interval: 3.6, n: 2 },
        { kind: 'spread', interval: 3.2, n: 7, arc: 1.6, speed: 225 }
      ]
    ],
    bonus: 10000,
    music: 'boss_battle'
  },
  {
    id: 'hydra',
    act: 4,
    name: 'HIDRA-TRÊS "MARÉ NEGRA"',
    title: 'Porta-Aviões Serpentino',
    levelIndex: 21,
    hp: 66,
    w: 290,
    h: 150,
    baseY: 110,
    moveRange: 190,
    moveSpeed: 0.5,
    timeLimit: 210,
    accent: '#2dd4bf',
    accent2: '#a78bfa',
    spawnBubbleEvery: [13, 10, 8],
    spawnSize: 2,
    startBubbles: [
      { x: 200, y: 240, size: 2, dir: 1 },
      { x: 480, y: 220, size: 2, dir: -1 },
      { x: 770, y: 240, size: 2, dir: -1 }
    ],
    phases: [
      [{ kind: 'spiral', interval: 0.3, speed: 185 }],
      [
        { kind: 'spiral', interval: 0.25, speed: 200 },
        { kind: 'aimed', interval: 2.2, speed: 255 }
      ],
      [
        { kind: 'spiral', interval: 0.21, speed: 210 },
        { kind: 'ring', interval: 3.2, n: 14, speed: 180 },
        { kind: 'aimed', interval: 1.7, speed: 275 }
      ]
    ],
    bonus: 12500,
    music: 'boss_battle'
  },
  {
    id: 'matrix',
    act: 5,
    name: 'MATRIZ SUPREMA PRISMA',
    title: 'Coração do Núcleo Olímpico',
    levelIndex: 23,
    hp: 90,
    w: 200,
    h: 220,
    baseY: 130,
    moveRange: 260,
    moveSpeed: 0.6,
    timeLimit: 240,
    accent: '#e879f9',
    accent2: '#22d3ee',
    spawnBubbleEvery: [13, 10, 8],
    spawnSize: 3,
    startBubbles: [
      { x: 200, y: 260, size: 2, dir: 1 },
      { x: 760, y: 260, size: 2, dir: -1 }
    ],
    phases: [
      [
        { kind: 'ring', interval: 2.8, n: 14, speed: 175 },
        { kind: 'aimed', interval: 1.8, speed: 255 }
      ],
      [
        { kind: 'spiral', interval: 0.28, speed: 205 },
        { kind: 'beam', interval: 4.0, n: 2 },
        { kind: 'rain', interval: 3.2, n: 4 }
      ],
      [
        { kind: 'ring', interval: 2.4, n: 18, speed: 185 },
        { kind: 'spiral', interval: 0.22, speed: 215 },
        { kind: 'beam', interval: 3.4, n: 3 },
        { kind: 'aimed', interval: 1.3, speed: 295 }
      ]
    ],
    bonus: 25000,
    music: 'boss_final'
  }
];

export function getBossByAct(act: number): BossDef {
  return BOSSES.find((b) => b.act === act) || BOSSES[0];
}

export function createBoss(id: BossId): BossState {
  const def = BOSSES.find((b) => b.id === id) || BOSSES[0];
  return {
    def,
    x: WORLD_W / 2,
    y: -def.h,
    hp: def.hp,
    hpGhost: def.hp,
    phase: 0,
    flash: 0,
    t: 0,
    enter: 0,
    warning: 2.9,
    transition: 0,
    timers: def.phases[0].map((a) => (a.delay ?? a.interval * 0.8) + 1.1),
    bubbleTimer: def.spawnBubbleEvery[0],
    spiralAngle: 0,
    aim: Math.PI / 2,
    bullets: [],
    beams: [],
    dying: false,
    dyingT: 0
  };
}

export function isBossVulnerable(b: BossState): boolean {
  return !b.dying && b.warning <= 0 && b.enter >= 1;
}

export function bossHitbox(b: BossState): { x0: number; y0: number; x1: number; y1: number } {
  const hw = b.def.w * 0.5 * 0.9;
  const hh = b.def.h * 0.5 * 0.85;
  return { x0: b.x - hw, y0: b.y - hh, x1: b.x + hw, y1: b.y + hh };
}

export function damageBoss(b: BossState, amount: number): boolean {
  if (!isBossVulnerable(b)) return false;
  b.hp = Math.max(0, b.hp - amount);
  b.flash = 0.1;
  if (b.hp <= 0) {
    b.dying = true;
    b.dyingT = 0;
    b.bullets = [];
    b.beams = [];
  }
  return true;
}

// -------------------------------------------------------------------------
// ATTACKS
// -------------------------------------------------------------------------
function orb(b: BossState, x: number, y: number, ang: number, speed: number, r = 7, color?: string): void {
  b.bullets.push({
    x,
    y,
    vx: Math.cos(ang) * speed,
    vy: Math.sin(ang) * speed,
    ay: 0,
    r,
    kind: 'orb',
    life: 9,
    color: color ?? b.def.accent,
    rot: 0
  });
}

function fireAttack(b: BossState, a: AttackDef, px: number, py: number): void {
  const mx = b.x;
  const my = b.y + b.def.h * 0.3;
  const speed = a.speed ?? 220;

  switch (a.kind) {
    case 'spread': {
      const n = a.n ?? 3;
      const arc = a.arc ?? 0.8;
      for (let i = 0; i < n; i++) {
        const ang = Math.PI / 2 - arc / 2 + (n === 1 ? arc / 2 : (arc * i) / (n - 1));
        orb(b, mx, my, ang, speed);
      }
      break;
    }
    case 'aimed': {
      const ang = Math.atan2(py - my, px - mx);
      orb(b, mx, my, ang, speed, 8, b.def.accent2);
      break;
    }
    case 'twin': {
      for (const s of [-1, 1]) {
        const cx = mx + s * b.def.w * 0.27;
        const ang = Math.atan2(py - my, px - cx);
        orb(b, cx, my, ang, speed, 8, b.def.accent2);
      }
      break;
    }
    case 'ring': {
      const n = a.n ?? 12;
      const off = Math.random() * Math.PI;
      for (let i = 0; i < n; i++) {
        orb(b, mx, my, off + (Math.PI * 2 * i) / n, speed, 7);
      }
      break;
    }
    case 'spiral': {
      orb(b, mx, my, b.spiralAngle, speed, 6.5);
      orb(b, mx, my, b.spiralAngle + Math.PI, speed, 6.5, b.def.accent2);
      b.spiralAngle += 0.52;
      break;
    }
    case 'rain': {
      const n = a.n ?? 4;
      for (let i = 0; i < n; i++) {
        b.bullets.push({
          x: 50 + Math.random() * (WORLD_W - 100),
          y: CEILING_Y + 6,
          vx: (Math.random() - 0.5) * 30,
          vy: 150 + Math.random() * 80,
          ay: 40,
          r: 6,
          kind: 'feather',
          life: 6,
          color: b.def.accent,
          rot: 0
        });
      }
      break;
    }
    case 'bomb': {
      b.bullets.push({
        x: mx + (Math.random() - 0.5) * b.def.w * 0.5,
        y: my,
        vx: 0,
        vy: 40,
        ay: 480,
        r: 10,
        kind: 'bomb',
        life: 6,
        color: '#0f172a',
        rot: 0
      });
      break;
    }
    case 'carpet': {
      const n = a.n ?? 5;
      const spacing = 100;
      for (let i = 0; i < n; i++) {
        const x = mx + (i - (n - 1) / 2) * spacing;
        if (x < 30 || x > WORLD_W - 30) continue;
        b.bullets.push({
          x,
          y: my,
          vx: 0,
          vy: 30,
          ay: 470,
          r: 10,
          kind: 'bomb',
          life: 6,
          color: '#0f172a',
          rot: 0
        });
      }
      break;
    }
    case 'beam': {
      const n = a.n ?? 1;
      for (let i = 0; i < n; i++) {
        const offset = i === 0 ? 0 : (i % 2 === 1 ? 1 : -1) * (150 + Math.floor(i / 2) * 120);
        const x = Math.max(40, Math.min(WORLD_W - 40, px + offset));
        b.beams.push({ x, tele: 0.95, teleMax: 0.95, active: 0.5, activeMax: 0.5, width: 46 });
      }
      break;
    }
  }
}

export interface BossUpdateResult {
  phaseChanged: boolean;
  newPhase: number;
  spawnBubble: boolean;
}

export function updateBoss(b: BossState, dt: number, px: number, py: number): BossUpdateResult {
  const res: BossUpdateResult = { phaseChanged: false, newPhase: b.phase, spawnBubble: false };
  b.t += dt;
  if (b.flash > 0) b.flash = Math.max(0, b.flash - dt);
  b.hpGhost += (b.hp - b.hpGhost) * Math.min(1, dt * 2.2);

  if (b.dying) {
    b.dyingT += dt;
    b.y += 22 * dt;
    return res;
  }

  if (b.warning > 0) {
    b.warning = Math.max(0, b.warning - dt);
    return res;
  }

  b.aim = Math.atan2(py - b.y, px - b.x);

  if (b.enter < 1) {
    b.enter = Math.min(1, b.enter + dt / 2.2);
    const k = 1 - Math.pow(1 - b.enter, 3);
    b.x = WORLD_W / 2;
    b.y = -b.def.h + (b.def.baseY + b.def.h) * k;
    return res;
  }

  const speedMult = 1 + b.phase * 0.28;
  b.x = WORLD_W / 2 + Math.sin(b.t * b.def.moveSpeed * speedMult) * b.def.moveRange;
  b.y = b.def.baseY + Math.sin(b.t * 1.4) * 9;

  const ratio = b.hp / b.def.hp;
  const newPhase: 0 | 1 | 2 = ratio > 0.66 ? 0 : ratio > 0.33 ? 1 : 2;
  if (newPhase > b.phase) {
    b.phase = newPhase;
    b.transition = 1.5;
    b.bullets = [];
    b.beams = [];
    b.timers = b.def.phases[newPhase].map((a) => (a.delay ?? a.interval * 0.6) + 1.2);
    res.phaseChanged = true;
    res.newPhase = newPhase;
    return res;
  }

  if (b.transition > 0) {
    b.transition = Math.max(0, b.transition - dt);
    return res;
  }

  const attacks = b.def.phases[b.phase];
  for (let i = 0; i < attacks.length; i++) {
    b.timers[i] -= dt;
    if (b.timers[i] <= 0) {
      fireAttack(b, attacks[i], px, py);
      b.timers[i] = attacks[i].interval;
    }
  }

  b.bubbleTimer -= dt;
  if (b.bubbleTimer <= 0) {
    res.spawnBubble = true;
    b.bubbleTimer = b.def.spawnBubbleEvery[b.phase];
  }
  return res;
}

export function updateBossProjectiles(b: BossState, dt: number): void {
  const spawned: BossBullet[] = [];
  for (let i = b.bullets.length - 1; i >= 0; i--) {
    const bl = b.bullets[i];
    bl.life -= dt;
    if (bl.kind === 'blast') {
      if (bl.life <= 0) b.bullets.splice(i, 1);
      continue;
    }
    bl.vy += bl.ay * dt;
    bl.x += bl.vx * dt;
    bl.y += bl.vy * dt;
    bl.rot += dt * 6;

    if (bl.kind === 'bomb' && bl.y >= GROUND_Y - 10) {
      b.bullets.splice(i, 1);
      spawned.push({
        x: bl.x,
        y: GROUND_Y - 8,
        vx: 0,
        vy: 0,
        ay: 0,
        r: 32,
        kind: 'blast',
        life: 0.38,
        color: '#fb923c',
        rot: 0
      });
      continue;
    }
    if (bl.y > GROUND_Y + 10 || bl.y < -50 || bl.x < -30 || bl.x > WORLD_W + 30 || bl.life <= 0) {
      b.bullets.splice(i, 1);
    }
  }
  for (const s of spawned) b.bullets.push(s);

  for (let i = b.beams.length - 1; i >= 0; i--) {
    const bm = b.beams[i];
    if (bm.tele > 0) bm.tele -= dt;
    else bm.active -= dt;
    if (bm.active <= 0) b.beams.splice(i, 1);
  }
}

export function bossHitsPlayer(b: BossState, px: number, py: number, hw: number, hh: number): boolean {
  if (b.dying || b.warning > 0) return false;
  for (const bl of b.bullets) {
    const cx = Math.max(px - hw, Math.min(bl.x, px + hw));
    const cy = Math.max(py - hh, Math.min(bl.y, py + hh));
    const dx = bl.x - cx;
    const dy = bl.y - cy;
    const r = bl.kind === 'blast' ? bl.r : bl.r * 0.85;
    if (dx * dx + dy * dy < r * r) return true;
  }
  for (const bm of b.beams) {
    if (bm.tele <= 0 && Math.abs(px - bm.x) < bm.width / 2 + hw) return true;
  }
  return false;
}

// -------------------------------------------------------------------------
// RENDERING HELPERS
// -------------------------------------------------------------------------
type Pt = [number, number];

function poly(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  fill: string | CanvasGradient,
  stroke?: string,
  lw = 2
): void {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

function disc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fill: string | CanvasGradient,
  stroke?: string,
  lw = 2
): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// -------------------------------------------------------------------------
// BOSS SPRITES
// -------------------------------------------------------------------------
function drawGaruda(ctx: CanvasRenderingContext2D, b: BossState): void {
  const t = b.t;
  const flap = Math.sin(t * 3.2) * 0.16;

  // Tail feathers
  for (let i = -1; i <= 1; i++) {
    poly(
      ctx,
      [[i * 14 - 8, 38], [i * 26, 82 + Math.abs(i) * -6], [i * 14 + 8, 38]],
      '#b45309',
      '#451a03',
      1.8
    );
  }

  // Wings
  for (const s of [-1, 1]) {
    ctx.save();
    ctx.scale(s, 1);
    ctx.translate(26, -18);
    ctx.rotate(-flap);
    for (let i = 0; i < 8; i++) {
      const a = -0.62 + i * 0.15;
      const len = 118 - i * 5;
      const wid = 15;
      ctx.save();
      ctx.rotate(a);
      const g = ctx.createLinearGradient(0, 0, len, 0);
      g.addColorStop(0, '#92400e');
      g.addColorStop(0.5, '#f59e0b');
      g.addColorStop(1, '#fde047');
      poly(
        ctx,
        [[0, -wid * 0.4], [len * 0.82, -wid], [len, 0], [len * 0.82, wid * 0.5], [0, wid * 0.4]],
        g,
        '#451a03',
        1.6
      );
      ctx.restore();
    }
    poly(ctx, [[-4, -14], [36, -22], [48, 2], [8, 18]], '#b45309', '#451a03', 2);
    ctx.restore();
  }

  // Body
  const bg = ctx.createLinearGradient(0, -48, 0, 50);
  bg.addColorStop(0, '#fbbf24');
  bg.addColorStop(0.5, '#b45309');
  bg.addColorStop(1, '#7c2d12');
  ctx.beginPath();
  ctx.ellipse(0, 0, 36, 48, 0, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Chest plates
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = 'rgba(69,26,3,0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 24 + i * 6 - 18, 24 - i * 3, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  // Prisma core gem
  const pulse = 1 + Math.sin(t * 5) * 0.14;
  glow(ctx, 0, 6, 34 * pulse, 'rgba(244,63,94,0.55)');
  poly(ctx, [[0, -8], [11, 6], [0, 20], [-11, 6]], '#f43f5e', '#fecdd3', 2);

  // Head
  disc(ctx, 0, -50, 20, '#fbbf24', '#451a03', 3);
  poly(ctx, [[-9, -40], [9, -40], [0, -14]], '#7c2d12', '#451a03', 2);
  poly(ctx, [[-6, -44], [6, -44], [0, -26]], '#fde047');
  disc(ctx, -8, -55, 3.6, '#f43f5e');
  disc(ctx, 8, -55, 3.6, '#f43f5e');
  for (const cx of [-10, 0, 10]) {
    poly(ctx, [[cx - 4, -66], [cx, -84 - Math.abs(cx) * -0.4], [cx + 4, -66]], '#f59e0b', '#451a03', 1.5);
  }
}

function drawZeppelin(ctx: CanvasRenderingContext2D, b: BossState): void {
  const t = b.t;

  // Tail fins
  for (const s of [-1, 1]) {
    poly(ctx, [[s * 120, -18], [s * 152, -60], [s * 96, -40]], '#475569', '#0f172a', 2);
    poly(ctx, [[s * 120, 6], [s * 154, 48], [s * 96, 26]], '#475569', '#0f172a', 2);
  }

  // Envelope
  const g = ctx.createLinearGradient(0, -62, 0, 34);
  g.addColorStop(0, '#94a3b8');
  g.addColorStop(0.5, '#64748b');
  g.addColorStop(1, '#334155');
  ctx.beginPath();
  ctx.ellipse(0, -14, 130, 46, 0, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Ribs & rivets
  ctx.strokeStyle = 'rgba(15,23,42,0.4)';
  ctx.lineWidth = 2;
  for (let x = -104; x <= 104; x += 26) {
    const h = 46 * Math.sqrt(1 - (x / 130) * (x / 130));
    ctx.beginPath();
    ctx.moveTo(x, -14 - h);
    ctx.lineTo(x, -14 + h);
    ctx.stroke();
  }

  // Spade emblem
  ctx.fillStyle = '#fef2f2';
  ctx.font = 'bold 40px serif';
  ctx.textAlign = 'center';
  ctx.fillText('♠', 0, -2);
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 40px serif';
  ctx.globalAlpha = 0.35;
  ctx.fillText('♠', 1.5, -0.5);
  ctx.globalAlpha = 1;

  // Struts & gondola
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  for (const x of [-40, 40]) {
    ctx.beginPath();
    ctx.moveTo(x, 26);
    ctx.lineTo(x * 0.8, 32);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.roundRect(-52, 28, 104, 26, 9);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-40 + i * 19, 35, 11, 8);
  }

  // Bomb bay with hanging bombs
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-28, 54, 56, 6);
  for (const x of [-16, 0, 16]) {
    ctx.beginPath();
    ctx.ellipse(x, 66, 5, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#111827';
    ctx.fill();
  }

  // Propellers
  for (const s of [-1, 1]) {
    const px = s * 64;
    disc(ctx, px, 44, 6, '#334155', '#0f172a', 2);
    for (let k = 0; k < 2; k++) {
      const ang = t * 45 + (k * Math.PI) / 2;
      ctx.strokeStyle = 'rgba(226,232,240,0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px + Math.cos(ang) * 16, 44 + Math.sin(ang) * 16);
      ctx.lineTo(px - Math.cos(ang) * 16, 44 - Math.sin(ang) * 16);
      ctx.stroke();
    }
  }

  // Tail beacons
  if (Math.sin(t * 7) > 0) {
    disc(ctx, -146, -52, 3.5, '#ef4444');
    disc(ctx, 146, -52, 3.5, '#ef4444');
  }

  // Damage smoke
  if (b.phase >= 1) {
    for (let i = 0; i < 4; i++) {
      const sy = -62 - ((t * 28 + i * 14) % 56);
      ctx.fillStyle = `rgba(30,41,59,${(0.5 - (sy + 62) * -0.008).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(-70 + i * 12 + Math.sin(t * 2 + i) * 6, sy, 7 + i * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawIronclad(ctx: CanvasRenderingContext2D, b: BossState): void {
  const t = b.t;

  // Hover jets
  for (const sx of [-80, -30, 30, 80]) {
    const fl = 22 + Math.sin(t * 40 + sx) * 6;
    poly(ctx, [[sx - 10, 50], [sx, 50 + fl], [sx + 10, 50]], '#f97316');
    poly(ctx, [[sx - 5, 50], [sx, 50 + fl * 0.6], [sx + 5, 50]], '#fde047');
  }

  // Hull
  const g = ctx.createLinearGradient(0, -40, 0, 54);
  g.addColorStop(0, '#475569');
  g.addColorStop(0.5, '#1f2937');
  g.addColorStop(1, '#0f172a');
  poly(ctx, [[-132, 10], [-96, -34], [96, -34], [132, 10], [104, 52], [-104, 52]], g, '#020617', 3);

  // Armor seams
  ctx.strokeStyle = 'rgba(148,163,184,0.25)';
  ctx.lineWidth = 2;
  for (let x = -90; x <= 90; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, -30);
    ctx.lineTo(x + 6, 48);
    ctx.stroke();
  }
  ctx.fillStyle = '#64748b';
  for (let x = -110; x <= 110; x += 22) {
    disc(ctx, x, 44, 2, '#94a3b8');
  }

  // Superstructure & bridge
  poly(ctx, [[-54, -34], [-36, -64], [36, -64], [54, -34]], '#1f2937', '#020617', 3);
  ctx.fillStyle = Math.sin(t * 4) > -0.5 ? '#ef4444' : '#7f1d1d';
  ctx.fillRect(-24, -56, 48, 10);

  // Red star emblem
  const star: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? 20 : 8;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    star.push([Math.cos(a) * rr, 12 + Math.sin(a) * rr]);
  }
  poly(ctx, star, '#dc2626', '#fecaca', 2);

  // Twin cannons tracking the player
  for (const s of [-1, 1]) {
    const bx = s * 72;
    const by = 38;
    disc(ctx, bx, by, 13, '#334155', '#020617', 3);
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(b.aim);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, -6, 48, 12);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(40, -8, 10, 16);
    ctx.restore();
  }
}

function drawHydra(ctx: CanvasRenderingContext2D, b: BossState): void {
  const t = b.t;

  // Carrier hull
  const hg = ctx.createLinearGradient(0, 14, 0, 70);
  hg.addColorStop(0, '#0f766e');
  hg.addColorStop(1, '#042f2e');
  ctx.beginPath();
  ctx.ellipse(0, 40, 128, 32, 0, 0, Math.PI * 2);
  ctx.fillStyle = hg;
  ctx.fill();
  ctx.strokeStyle = '#022c22';
  ctx.lineWidth = 3;
  ctx.stroke();
  for (let x = -100; x <= 100; x += 25) {
    disc(ctx, x, 44, 3, Math.sin(t * 5 + x) > 0 ? '#a78bfa' : '#312e81');
  }

  // Serpent necks and heads
  for (const k of [-1, 0, 1]) {
    const baseX = k * 62;
    const baseY = 34;
    const sway = Math.sin(t * 2 + k * 1.7) * 16;
    const headX = k * 104 + sway;
    const headY = -44 - (k === 0 ? 22 : 0) + Math.cos(t * 1.7 + k) * 7;
    const ctrlX = baseX * 0.4 + headX * 0.6;
    const ctrlY = (baseY + headY) / 2 + 24;

    ctx.lineCap = 'round';
    ctx.strokeStyle = '#115e59';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, headX, headY);
    ctx.stroke();
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, headX, headY);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(2,44,34,0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, headX, headY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.save();
    ctx.translate(headX, headY);
    ctx.rotate(k * 0.18);
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 16, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#134e4a';
    ctx.fill();
    ctx.strokeStyle = '#022c22';
    ctx.lineWidth = 3;
    ctx.stroke();
    poly(ctx, [[-14, 8], [14, 8], [0, 26]], '#0f766e', '#022c22', 2);
    const mouth = 0.6 + 0.4 * Math.abs(Math.sin(t * 3 + k));
    glow(ctx, 0, 16, 16 * mouth, 'rgba(167,139,250,0.7)');
    disc(ctx, -8, -3, 3.4, '#a78bfa');
    disc(ctx, 8, -3, 3.4, '#a78bfa');
    poly(ctx, [[-6, 10], [-3, 18], [0, 10]], '#f8fafc');
    poly(ctx, [[0, 10], [3, 18], [6, 10]], '#f8fafc');
    ctx.restore();
  }
}

function drawMatrix(ctx: CanvasRenderingContext2D, b: BossState): void {
  const t = b.t;
  const pulse = 0.85 + 0.15 * Math.sin(t * 3);
  glow(ctx, 0, 0, 175 * pulse, 'rgba(232,121,249,0.38)');
  glow(ctx, 0, 0, 110 * pulse, 'rgba(34,211,238,0.28)');

  const plates = (front: boolean) => {
    for (let i = 0; i < 5; i++) {
      const a = t * 0.9 + (i * Math.PI * 2) / 5;
      const depth = Math.sin(a);
      if (front !== depth > 0) continue;
      const px = Math.cos(a) * 138;
      const py = Math.sin(a * 1.0) * 34 - 6;
      const sz = 20 + depth * 6;
      ctx.globalAlpha = front ? 1 : 0.55;
      poly(
        ctx,
        [[px, py - sz], [px + sz * 0.7, py], [px, py + sz], [px - sz * 0.7, py]],
        '#22d3ee',
        '#ecfeff',
        2
      );
      ctx.globalAlpha = 1;
    }
  };
  plates(false);

  // Rotating crystal core
  ctx.save();
  const sx = 0.45 + 0.55 * Math.abs(Math.cos(t * 0.7));
  ctx.scale(sx, 1);
  const cg = ctx.createLinearGradient(-60, -100, 60, 100);
  cg.addColorStop(0, '#f5d0fe');
  cg.addColorStop(0.45, '#c026d3');
  cg.addColorStop(1, '#4a044e');
  poly(ctx, [[0, -106], [66, -28], [46, 72], [0, 106], [-46, 72], [-66, -28]], cg, '#fdf4ff', 3);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -106);
  ctx.lineTo(0, 106);
  ctx.moveTo(-66, -28);
  ctx.lineTo(46, 72);
  ctx.moveTo(66, -28);
  ctx.lineTo(-46, 72);
  ctx.stroke();
  ctx.restore();

  // Halo ring
  ctx.save();
  ctx.rotate(t * 0.3);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 82, 26, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Monocle eye tracking the player
  disc(ctx, 0, -2, 25, '#2e1065', '#fbbf24', 4);
  const ix = Math.cos(b.aim) * 8;
  const iy = Math.sin(b.aim) * 8;
  disc(ctx, ix, iy - 2, 10, '#f43f5e');
  disc(ctx, ix - 3, iy - 6, 3, '#ffffff');

  // Cracks in the last phase
  if (b.phase >= 2) {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-20, -70);
    ctx.lineTo(-6, -38);
    ctx.lineTo(-24, -12);
    ctx.moveTo(26, 26);
    ctx.lineTo(10, 48);
    ctx.lineTo(28, 78);
    ctx.stroke();
  }
  plates(true);
}

export function drawBoss(ctx: CanvasRenderingContext2D, b: BossState, scale = 1): void {
  if (b.warning > 0 && !b.dying) return;
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.scale(scale, scale);
  if (b.dying) {
    const k = Math.min(1, b.dyingT / 3);
    ctx.rotate(Math.sin(b.t * 28) * 0.02 * (1 + k * 3) + k * 0.25);
    ctx.globalAlpha = 0.65 + 0.35 * Math.abs(Math.sin(b.t * 40));
  }
  if (b.flash > 0 && typeof ctx.filter === 'string') {
    ctx.filter = 'brightness(2.4) saturate(0.5)';
  }
  switch (b.def.id) {
    case 'garuda':
      drawGaruda(ctx, b);
      break;
    case 'zeppelin':
      drawZeppelin(ctx, b);
      break;
    case 'ironclad':
      drawIronclad(ctx, b);
      break;
    case 'hydra':
      drawHydra(ctx, b);
      break;
    default:
      drawMatrix(ctx, b);
  }
  ctx.restore();
}

const previewCache = new Map<BossId, BossState>();

export function drawBossPreview(
  ctx: CanvasRenderingContext2D,
  id: BossId,
  x: number,
  y: number,
  t: number,
  scale = 1,
  dying = false
): void {
  let b = previewCache.get(id);
  if (!b) {
    b = createBoss(id);
    previewCache.set(id, b);
  }
  b.warning = 0;
  b.enter = 1;
  b.x = x;
  b.y = y;
  b.t = t;
  b.aim = Math.PI / 2;
  b.phase = dying ? 2 : 0;
  b.dying = dying;
  b.dyingT = dying ? Math.min(3, t % 6) : 0;
  b.flash = 0;
  drawBoss(ctx, b, scale);
}

// -------------------------------------------------------------------------
// PROJECTILES, HUD & WARNING BANNER
// -------------------------------------------------------------------------
export function drawBossProjectiles(ctx: CanvasRenderingContext2D, b: BossState, t: number): void {
  for (const bm of b.beams) {
    ctx.save();
    if (bm.tele > 0) {
      const k = 1 - bm.tele / bm.teleMax;
      ctx.globalAlpha = 0.25 + 0.4 * Math.abs(Math.sin(t * 22));
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(bm.x - 2 - k * 4, CEILING_Y, 4 + k * 8, GROUND_Y - CEILING_Y);
      ctx.globalAlpha = 1;
      poly(ctx, [[bm.x - 12, 54], [bm.x + 12, 54], [bm.x, 30]], '#fde047', '#7f1d1d', 2);
      ctx.fillStyle = '#7f1d1d';
      ctx.font = 'bold 14px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', bm.x, 51);
    } else {
      const a = bm.active / bm.activeMax;
      const w = bm.width * (0.65 + 0.35 * a);
      const g = ctx.createLinearGradient(bm.x - w / 2, 0, bm.x + w / 2, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.3, b.def.accent);
      g.addColorStop(0.5, '#ffffff');
      g.addColorStop(0.7, b.def.accent);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(bm.x - w / 2, CEILING_Y, w, GROUND_Y - CEILING_Y);
      glow(ctx, bm.x, GROUND_Y - 6, 50, 'rgba(255,255,255,0.7)');
    }
    ctx.restore();
  }

  for (const bl of b.bullets) {
    ctx.save();
    if (bl.kind === 'orb') {
      glow(ctx, bl.x, bl.y, bl.r * 2.6, `${bl.color}88`);
      disc(ctx, bl.x, bl.y, bl.r, bl.color, '#ffffff', 1.5);
      disc(ctx, bl.x - bl.r * 0.25, bl.y - bl.r * 0.25, bl.r * 0.35, '#ffffff');
    } else if (bl.kind === 'feather') {
      ctx.translate(bl.x, bl.y);
      ctx.rotate(Math.atan2(bl.vy, bl.vx) - Math.PI / 2);
      poly(ctx, [[0, -12], [5, 0], [0, 12], [-5, 0]], bl.color, '#7c2d12', 1.5);
    } else if (bl.kind === 'bomb') {
      ctx.translate(bl.x, bl.y);
      ctx.beginPath();
      ctx.ellipse(0, 0, bl.r * 0.8, bl.r * 1.15, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#111827';
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();
      poly(ctx, [[-6, -10], [0, -18], [6, -10]], '#475569');
      if (Math.sin(t * 24) > 0) disc(ctx, 0, -18, 2.5, '#ef4444');
    } else {
      const k = 1 - bl.life / 0.38;
      ctx.globalAlpha = Math.max(0, 1 - k);
      glow(ctx, bl.x, bl.y, bl.r * (1.1 + k), 'rgba(251,146,60,0.9)');
      disc(ctx, bl.x, bl.y, bl.r * (0.5 + k * 0.5), '#fde047');
    }
    ctx.restore();
  }
}

export function drawBossHud(ctx: CanvasRenderingContext2D, b: BossState): void {
  if (b.warning > 0) return;
  const x = 150;
  const y = 26;
  const w = 660;
  const h = 14;
  const ratio = Math.max(0, b.hp / b.def.hp);
  const ghost = Math.max(0, b.hpGhost / b.def.hp);

  ctx.save();
  ctx.globalAlpha = Math.min(1, b.enter * 1.5);
  ctx.textAlign = 'left';
  ctx.font = '700 13px "Chakra Petch", sans-serif';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(0,0,0,0.85)';
  ctx.strokeText(b.def.name, x, y - 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(b.def.name, x, y - 6);

  ctx.textAlign = 'right';
  ctx.font = '700 10px "Press Start 2P", monospace';
  const phaseLabel = `FASE ${b.phase + 1}/3`;
  ctx.strokeText(phaseLabel, x + w, y - 6);
  ctx.fillStyle = b.def.accent;
  ctx.fillText(phaseLabel, x + w, y - 6);

  ctx.fillStyle = 'rgba(2,6,23,0.85)';
  ctx.beginPath();
  ctx.roundRect(x - 3, y - 3, w + 6, h + 6, 6);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillRect(x, y, w * ghost, h);

  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, b.def.accent2);
  g.addColorStop(1, b.def.accent);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w * ratio, h);

  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.fillRect(x, y, w * ratio, 4);

  ctx.fillStyle = 'rgba(2,6,23,0.95)';
  ctx.fillRect(x + w * 0.33 - 1, y, 2, h);
  ctx.fillRect(x + w * 0.66 - 1, y, 2, h);
  ctx.restore();
}

function hazardBand(ctx: CanvasRenderingContext2D, y: number, h: number, offset: number): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y, WORLD_W, h);
  ctx.clip();
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, y, WORLD_W, h);
  ctx.fillStyle = '#facc15';
  for (let x = -90 + (offset % 60); x < WORLD_W + 60; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + h, y);
    ctx.lineTo(x + h + 30, y);
    ctx.lineTo(x + 30, y + h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function drawBossWarning(ctx: CanvasRenderingContext2D, b: BossState, t: number): void {
  if (b.warning <= 0) return;
  const blink = Math.sin(t * 12) > 0;
  const fadeIn = Math.min(1, (2.9 - b.warning) * 4);
  const fadeOut = Math.min(1, b.warning * 3);
  const a = Math.min(fadeIn, fadeOut);

  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = `rgba(127,29,29,${(0.18 + 0.12 * Math.abs(Math.sin(t * 6))).toFixed(2)})`;
  ctx.fillRect(0, 0, WORLD_W, GROUND_Y);

  hazardBand(ctx, 168, 26, t * 140);
  hazardBand(ctx, 336, 26, -t * 140);

  ctx.textAlign = 'center';
  ctx.font = '34px "Press Start 2P", monospace';
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#450a0a';
  if (blink) {
    ctx.strokeText('WARNING!', WORLD_W / 2, 262);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('WARNING!', WORLD_W / 2, 262);
  }
  ctx.font = '700 17px "Chakra Petch", sans-serif';
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgba(0,0,0,0.9)';
  ctx.strokeText('ALVO GIGANTE EM APROXIMAÇÃO', WORLD_W / 2, 296);
  ctx.fillStyle = '#fde047';
  ctx.fillText('ALVO GIGANTE EM APROXIMAÇÃO', WORLD_W / 2, 296);
  ctx.font = '700 15px "Chakra Petch", sans-serif';
  ctx.strokeText(b.def.name, WORLD_W / 2, 322);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(b.def.name, WORLD_W / 2, 322);
  ctx.restore();
}
