import { GROUND_Y, WORLD_W } from './levels';
import { ThemeId } from './types';

export const PARALLAX_PAD = 44;
export const BLEED_L = -PARALLAX_PAD;
export const BLEED_R = WORLD_W + PARALLAX_PAD;
export const BLEED_W = WORLD_W + PARALLAX_PAD * 2;

// Deterministic pseudo-random generator for consistent painterly brushwork in offscreen caches
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function fillSky(ctx: CanvasRenderingContext2D, stops: [number, string][]): void {
  const g = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  stops.forEach(([pos, col]) => g.addColorStop(pos, col));
  ctx.fillStyle = g;
  ctx.fillRect(BLEED_L, 0, BLEED_W, GROUND_Y);
}

/** Paints subtle astronomical nebula clouds & micro-starfield on night/twilight sky layers */
export function paintNebulaWash(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  angle: number,
  innerCol: string,
  outerCol: string
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(1, ry / Math.max(1, rx));
  const g = ctx.createRadialGradient(0, 0, rx * 0.08, 0, 0, rx);
  g.addColorStop(0, innerCol);
  g.addColorStop(0.55, outerCol);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Paints atmospheric depth haze between background planes */
export function paintHazeBand(
  ctx: CanvasRenderingContext2D,
  yTop: number,
  yBot: number,
  color: string
): void {
  const g = ctx.createLinearGradient(0, yTop, 0, yBot);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.52, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(BLEED_L, yTop, BLEED_W, yBot - yTop);
}

/** Paints a glowing celestial sun/moon with atmospheric bloom and optional diagonal god-rays */
export function paintSunWithBloom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  coreTop: string,
  coreBot: string,
  haloColor: string,
  rays = false
): void {
  const halo = ctx.createRadialGradient(x, y, r * 0.35, x, y, r * 4.2);
  halo.addColorStop(0, haloColor);
  halo.addColorStop(0.45, haloColor.replace(/[\d.]+\)$/, '0.18)'));
  halo.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, r * 4.2, 0, Math.PI * 2);
  ctx.fill();

  if (rays) {
    ctx.save();
    for (let i = 0; i < 9; i++) {
      const ang = -0.42 + i * 0.24;
      const rg = ctx.createLinearGradient(x, y, x + Math.cos(ang) * 500, y + Math.sin(ang) * 500);
      rg.addColorStop(0, haloColor.replace(/[\d.]+\)$/, '0.17)'));
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(ang - 0.055) * 560, y + Math.sin(ang - 0.055) * 560);
      ctx.lineTo(x + Math.cos(ang + 0.055) * 560, y + Math.sin(ang + 0.055) * 560);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  const sg = ctx.createLinearGradient(x, y - r, x, y + r);
  sg.addColorStop(0, coreTop);
  sg.addColorStop(1, coreBot);
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Paints layered volumetric cumulus clouds with sunlit rim, soft belly, and flat atmospheric base */
export function paintCloudBank(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  topCol: string,
  midCol: string,
  shadowCol: string
): void {
  const puffs: [number, number, number][] = [
    [-68, 14, 24],
    [-42, 6, 32],
    [-12, -5, 41],
    [22, -3, 37],
    [52, 6, 30],
    [78, 15, 22]
  ];
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = shadowCol;
  for (const [px, py, pr] of puffs) {
    ctx.beginPath();
    ctx.arc(px, py + 7, pr * 0.96, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = midCol;
  for (const [px, py, pr] of puffs) {
    ctx.beginPath();
    ctx.arc(px, py + 1.5, pr * 0.97, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = topCol;
  for (const [px, py, pr] of puffs) {
    ctx.beginPath();
    ctx.arc(px - 2.5, py - 4.5, pr * 0.78, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Paints a sculpted craggy mountain ridge with irregular geological spine, rock facets, and snow cap */
export function paintSculptedMountain(
  ctx: CanvasRenderingContext2D,
  xLeft: number,
  xPeak: number,
  xRight: number,
  yPeak: number,
  yBase: number,
  litCol: string,
  shadeCol: string,
  snowCol?: string,
  snowDrop = 0.28
): void {
  // Build organic craggy spine from peak down to base
  const spinePts: [number, number][] = [
    [xPeak, yPeak],
    [xPeak - (xRight - xLeft) * 0.03, yPeak + (yBase - yPeak) * 0.26],
    [xPeak + (xRight - xLeft) * 0.04, yPeak + (yBase - yPeak) * 0.54],
    [xPeak - (xRight - xLeft) * 0.015, yPeak + (yBase - yPeak) * 0.8],
    [xPeak + (xRight - xLeft) * 0.03, yBase]
  ];

  // Lit western face with subtle shoulder crag
  ctx.fillStyle = litCol;
  ctx.beginPath();
  ctx.moveTo(xLeft, yBase);
  ctx.lineTo(xLeft + (xPeak - xLeft) * 0.45, yPeak + (yBase - yPeak) * 0.52);
  ctx.lineTo(xPeak, yPeak);
  for (let i = 1; i < spinePts.length; i++) {
    ctx.lineTo(spinePts[i][0], spinePts[i][1]);
  }
  ctx.closePath();
  ctx.fill();

  // Shaded eastern face
  ctx.fillStyle = shadeCol;
  ctx.beginPath();
  ctx.moveTo(xPeak, yPeak);
  ctx.lineTo(xPeak + (xRight - xPeak) * 0.52, yPeak + (yBase - yPeak) * 0.48);
  ctx.lineTo(xRight, yBase);
  for (let i = spinePts.length - 1; i >= 1; i--) {
    ctx.lineTo(spinePts[i][0], spinePts[i][1]);
  }
  ctx.closePath();
  ctx.fill();

  // Subtle rock strata ridges on lit side
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(xPeak, yPeak);
  ctx.lineTo(spinePts[1][0], spinePts[1][1]);
  ctx.lineTo(spinePts[2][0], spinePts[2][1]);
  ctx.stroke();

  if (snowCol) {
    const sy = yPeak + (yBase - yPeak) * snowDrop;
    const lx = xPeak - (xPeak - xLeft) * snowDrop;
    const rx = xPeak + (xRight - xPeak) * snowDrop;
    ctx.fillStyle = snowCol;
    ctx.beginPath();
    ctx.moveTo(xPeak, yPeak);
    ctx.lineTo(lx, sy);
    ctx.lineTo(lx + (xPeak - lx) * 0.38, sy - 9);
    ctx.lineTo(lx + (xPeak - lx) * 0.72, sy + 11);
    ctx.lineTo(xPeak + 2, sy - 6);
    ctx.lineTo(xPeak + (rx - xPeak) * 0.44, sy + 9);
    ctx.lineTo(rx, sy + 1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(30, 58, 138, 0.24)';
    ctx.beginPath();
    ctx.moveTo(xPeak, yPeak);
    ctx.lineTo(xPeak + 2, sy - 6);
    ctx.lineTo(xPeak + (rx - xPeak) * 0.44, sy + 9);
    ctx.lineTo(rx, sy + 1);
    ctx.closePath();
    ctx.fill();
  }
}

/** Paints a distant metropolitan skyline silhouette band for deep urban parallax */
export function paintDistantSkylineBand(
  ctx: CanvasRenderingContext2D,
  yBase: number,
  minH: number,
  maxH: number,
  buildingCol: string,
  windowCol: string | null,
  rand: () => number
): void {
  let x = BLEED_L;
  while (x < BLEED_R) {
    const w = 28 + Math.floor(rand() * 34);
    const h = minH + rand() * (maxH - minH);
    const y = yBase - h;
    ctx.fillStyle = buildingCol;
    ctx.fillRect(x, y, w - 2, h);
    if (rand() > 0.6) {
      ctx.fillRect(x + w * 0.25, y - 8, w * 0.5, 8);
    }
    if (windowCol) {
      ctx.fillStyle = windowCol;
      for (let wy = y + 8; wy < yBase - 14; wy += 10) {
        for (let wx = x + 5; wx < x + w - 8; wx += 8) {
          if (rand() > 0.55) ctx.fillRect(wx, wy, 3.5, 4);
        }
      }
    }
    x += w;
  }
}

/** Paints lush layered tree/foliage tufts */
export function paintFoliageCluster(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  darkCol: string,
  midCol: string,
  lightCol: string,
  rand: () => number
): void {
  const count = 9;
  for (let i = 0; i < count; i++) {
    const ox = (rand() - 0.5) * radius * 1.4;
    const oy = (rand() - 0.5) * radius * 0.85;
    const r = radius * (0.38 + rand() * 0.32);
    ctx.fillStyle = darkCol;
    ctx.beginPath();
    ctx.arc(cx + ox, cy + oy + 4, r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < count; i++) {
    const ox = (rand() - 0.5) * radius * 1.3;
    const oy = (rand() - 0.5) * radius * 0.75;
    const r = radius * (0.32 + rand() * 0.28);
    ctx.fillStyle = midCol;
    ctx.beginPath();
    ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 5; i++) {
    const ox = (rand() - 0.5) * radius * 1.1;
    const oy = -radius * 0.15 + (rand() - 0.5) * radius * 0.45;
    const r = radius * (0.22 + rand() * 0.2);
    ctx.fillStyle = lightCol;
    ctx.beginPath();
    ctx.arc(cx + ox - 2, cy + oy - 3, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Paints detailed arched masonry or classical windows */
export function paintArchRow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  y: number,
  count: number,
  spacing: number,
  w: number,
  h: number,
  fill: string,
  trim?: string
): void {
  for (let i = 0; i < count; i++) {
    const x = startX + i * spacing;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();
    if (trim) {
      ctx.strokeStyle = trim;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }
}

/** Paints a detailed architectural skyscraper with lit windows, rooftop crown, and cornice */
export function paintSkyscraper(
  ctx: CanvasRenderingContext2D,
  x: number,
  w: number,
  h: number,
  baseCol: string,
  shadeCol: string,
  winCol: string,
  accentCol: string | null,
  rand: () => number
): void {
  const y = GROUND_Y - h;
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, baseCol);
  g.addColorStop(0.68, baseCol);
  g.addColorStop(1, shadeCol);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);

  if (w > 48) {
    ctx.fillStyle = shadeCol;
    ctx.fillRect(x + w * 0.16, y - 10, w * 0.68, 10);
    if (w > 72) {
      ctx.fillRect(x + w * 0.34, y - 18, w * 0.32, 8);
    }
  }

  for (let wy = y + 12; wy < GROUND_Y - 18; wy += 12) {
    for (let wx = x + 7; wx < x + w - 11; wx += 10) {
      if (rand() > 0.32) {
        ctx.fillStyle = winCol;
        ctx.fillRect(wx, wy, 5.5, 6.5);
      }
    }
  }

  if (accentCol) {
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h);
  }
}

/** Live post-composite vignette, subtle volumetric light shafts, and bottom contrast grounding */
export function paintLiveAtmosphericFinish(
  ctx: CanvasRenderingContext2D,
  theme: ThemeId,
  bgTime: number,
  darkness = 0.22
): void {
  // Subtle animated diagonal sunbeams / moonlight shafts on scenic outdoor stages
  const warmShaftThemes: ThemeId[] = ['fuji', 'pyramids', 'caribbean', 'temple', 'rio', 'machupicchu', 'madrid', 'rome', 'delhi', 'beijing', 'honolulu'];
  const coolShaftThemes: ThemeId[] = ['alps', 'london', 'sydney', 'moon'];

  if (warmShaftThemes.includes(theme) || coolShaftThemes.includes(theme)) {
    const isWarm = warmShaftThemes.includes(theme);
    ctx.save();
    for (let i = 0; i < 3; i++) {
      const sway = Math.sin(bgTime * 0.45 + i * 1.9) * 28;
      const topX = 160 + i * 290 + sway;
      const botX = topX + 135;
      const lg = ctx.createLinearGradient(topX, 0, botX, GROUND_Y);
      lg.addColorStop(0, isWarm ? 'rgba(254, 240, 138, 0.085)' : 'rgba(186, 230, 253, 0.065)');
      lg.addColorStop(0.65, isWarm ? 'rgba(251, 191, 36, 0.035)' : 'rgba(125, 211, 252, 0.025)');
      lg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(topX - 38, 0);
      ctx.lineTo(topX + 42, 0);
      ctx.lineTo(botX + 78, GROUND_Y);
      ctx.lineTo(botX - 58, GROUND_Y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // Subtle edge vignette so the playfield reads crisply
  const vg = ctx.createRadialGradient(
    WORLD_W / 2,
    GROUND_Y * 0.48,
    240,
    WORLD_W / 2,
    GROUND_Y * 0.5,
    590
  );
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, `rgba(4, 7, 18, ${darkness})`);
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, WORLD_W, GROUND_Y);

  // Bottom grounding gradient so player & small bubbles pop cleanly near the floor
  const fg = ctx.createLinearGradient(0, GROUND_Y - 54, 0, GROUND_Y);
  fg.addColorStop(0, 'rgba(4, 7, 18, 0)');
  fg.addColorStop(1, 'rgba(4, 7, 18, 0.28)');
  ctx.fillStyle = fg;
  ctx.fillRect(0, GROUND_Y - 54, WORLD_W, 54);
}

// Legacy alias kept for compatibility if needed
export function paintBackdropFinishing(ctx: CanvasRenderingContext2D, darkness = 0.2): void {
  const fg = ctx.createLinearGradient(0, GROUND_Y - 46, 0, GROUND_Y);
  fg.addColorStop(0, 'rgba(4, 7, 18, 0)');
  fg.addColorStop(1, `rgba(4, 7, 18, ${darkness})`);
  ctx.fillStyle = fg;
  ctx.fillRect(BLEED_L, GROUND_Y - 46, BLEED_W, 46);
}

// =========================================================================
// LIVE ANIMATED HELPERS & AMBIENT WEATHER STATE
// =========================================================================
export const BG_STARS = Array.from({ length: 160 }, (_, i) => {
  const r = mulberry32(9001 + i * 17);
  return {
    x: BLEED_L + r() * BLEED_W,
    y: r() * GROUND_Y,
    r: r() * 1.85 + 0.45,
    phase: r() * Math.PI * 2,
    tint: i % 5 === 0 ? '#bae6fd' : i % 7 === 0 ? '#fef08a' : '#ffffff'
  };
});

export const SNOW_FLAKES = Array.from({ length: 95 }, () => ({
  x: Math.random() * WORLD_W,
  y: Math.random() * GROUND_Y,
  r: Math.random() * 2.8 + 1.0,
  depth: 0.5 + Math.random() * 0.9,
  speed: 22 + Math.random() * 44,
  drift: Math.random() * Math.PI * 2
}));

export const PETALS = Array.from({ length: 38 }, () => ({
  x: Math.random() * WORLD_W,
  y: Math.random() * GROUND_Y,
  vx: -26 - Math.random() * 28,
  vy: 15 + Math.random() * 22,
  rot: Math.random() * Math.PI * 2,
  size: 3.5 + Math.random() * 2.5
}));

export const RAIN_DROPS = Array.from({ length: 105 }, () => ({
  x: Math.random() * WORLD_W,
  y: Math.random() * GROUND_Y,
  len: 10 + Math.random() * 15,
  speed: 370 + Math.random() * 220
}));

export const DUST_PARTICLES = Array.from({ length: 65 }, () => ({
  x: Math.random() * WORLD_W,
  y: Math.random() * GROUND_Y,
  vx: 95 + Math.random() * 145,
  vy: -8 + Math.random() * 16,
  r: 1.4 + Math.random() * 2.6,
  alpha: 0.25 + Math.random() * 0.45
}));

export const SKY_LANTERNS = Array.from({ length: 20 }, (_, i) => ({
  x: 40 + ((i * 52) % (WORLD_W - 80)),
  y: Math.random() * (GROUND_Y - 90),
  vy: 11 + Math.random() * 15,
  sway: Math.random() * Math.PI * 2,
  scale: 0.65 + Math.random() * 0.55
}));

export const SHOOTING_STAR = { x: 180, y: 60, vx: 360, vy: 120, life: 0, cooldown: 2.2 };

export function updateAmbientWeather(dt: number, bgTime: number, theme: ThemeId): void {
  if (theme === 'moscow' || theme === 'alps') {
    for (const f of SNOW_FLAKES) {
      f.y += f.speed * f.depth * dt;
      f.x += Math.sin(bgTime * 1.9 + f.drift) * (theme === 'moscow' ? 34 : 18) * f.depth * dt;
      if (f.y > GROUND_Y) {
        f.y = -4;
        f.x = Math.random() * WORLD_W;
      }
      if (f.x < 0) f.x = WORLD_W;
      if (f.x > WORLD_W) f.x = 0;
    }
  }
  if (theme === 'fuji' || theme === 'delhi' || theme === 'beijing' || theme === 'buenosaires') {
    for (const p of PETALS) {
      p.x += p.vx * dt;
      p.y += p.vy * dt + Math.sin(bgTime * 3 + p.rot) * 8 * dt;
      p.rot += dt * 2.6;
      if (p.x < -12 || p.y > GROUND_Y) {
        p.x = WORLD_W + Math.random() * 80;
        p.y = Math.random() * (GROUND_Y * 0.65);
      }
    }
  }
  if (theme === 'neon' || theme === 'london') {
    for (const r of RAIN_DROPS) {
      r.y += r.speed * dt;
      r.x -= (theme === 'neon' ? 60 : 35) * dt;
      if (r.y > GROUND_Y) {
        r.y = -r.len;
        r.x = Math.random() * (WORLD_W + 70);
      }
    }
  }
  if (theme === 'mars' || theme === 'pyramids' || theme === 'temple') {
    for (const d of DUST_PARTICLES) {
      if (theme === 'temple') {
        d.y -= 20 * dt;
        d.x += Math.sin(bgTime * 2 + d.r) * 14 * dt;
        if (d.y < 10) {
          d.y = GROUND_Y - 10;
          d.x = Math.random() * WORLD_W;
        }
      } else {
        const mult = theme === 'mars' ? 1.45 : 0.65;
        d.x += d.vx * mult * dt;
        d.y += d.vy * dt;
        if (d.x > WORLD_W + 10) {
          d.x = -10;
          d.y = Math.random() * GROUND_Y;
        }
        if (d.y < 0) d.y = GROUND_Y - 5;
        if (d.y > GROUND_Y) d.y = 5;
      }
    }
  }
  if (theme === 'bangkok') {
    for (const l of SKY_LANTERNS) {
      l.y -= l.vy * dt;
      l.x += Math.sin(bgTime * 1.4 + l.sway) * 11 * dt;
      if (l.y < -30) {
        l.y = GROUND_Y - 60;
        l.x = 50 + Math.random() * (WORLD_W - 100);
      }
    }
  }
  if (theme === 'moon') {
    if (SHOOTING_STAR.life > 0) {
      SHOOTING_STAR.x += SHOOTING_STAR.vx * dt;
      SHOOTING_STAR.y += SHOOTING_STAR.vy * dt;
      SHOOTING_STAR.life -= dt;
    } else {
      SHOOTING_STAR.cooldown -= dt;
      if (SHOOTING_STAR.cooldown <= 0) {
        SHOOTING_STAR.x = 80 + Math.random() * 520;
        SHOOTING_STAR.y = 26 + Math.random() * 110;
        SHOOTING_STAR.vx = 340 + Math.random() * 180;
        SHOOTING_STAR.vy = 95 + Math.random() * 80;
        SHOOTING_STAR.life = 0.65;
        SHOOTING_STAR.cooldown = 2.8 + Math.random() * 3.8;
      }
    }
  }
}

export function drawTwinklingStars(ctx: CanvasRenderingContext2D, bgTime: number, maxY: number): void {
  for (const s of BG_STARS) {
    if (s.y > maxY) continue;
    const alpha = 0.28 + 0.72 * Math.abs(Math.sin(bgTime * 1.9 + s.phase));
    ctx.globalAlpha = alpha;
    ctx.fillStyle = s.tint;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawBird(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  flapPhase: number,
  color = '#1e293b'
): void {
  const flap = Math.sin(flapPhase) * size * 0.55;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.16);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - size, y - flap);
  ctx.quadraticCurveTo(x - size * 0.4, y - size * 0.45, x, y);
  ctx.quadraticCurveTo(x + size * 0.4, y - size * 0.45, x + size, y - flap);
  ctx.stroke();
}

export function drawSwayingPalm(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  dir: 1 | -1,
  height: number,
  swayPhase: number,
  bgTime: number
): void {
  const sway = Math.sin(bgTime * 2.0 + swayPhase) * 9;
  const topX = baseX + dir * (height * 0.27) + sway;
  const topY = GROUND_Y - height;

  ctx.save();
  ctx.strokeStyle = '#3b2110';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(baseX, GROUND_Y);
  ctx.quadraticCurveTo(baseX + dir * 20 + sway * 0.35, GROUND_Y - height * 0.55, topX, topY);
  ctx.stroke();

  ctx.strokeStyle = '#6b3e22';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.arc(topX - 4, topY + 6, 4.5, 0, Math.PI * 2);
  ctx.arc(topX + 4, topY + 7, 4.5, 0, Math.PI * 2);
  ctx.fill();

  for (let a = 0; a < 7; a++) {
    const ang = -Math.PI * 0.96 + a * 0.44 + sway * 0.011;
    const fx = topX + Math.cos(ang) * 44;
    const fy = topY + Math.sin(ang) * 25;
    ctx.fillStyle = a % 2 === 0 ? '#14532d' : '#166534';
    ctx.beginPath();
    ctx.ellipse(fx, fy, 48, 10.5, ang, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(74, 222, 128, 0.28)';
    ctx.beginPath();
    ctx.ellipse(fx, fy - 2, 34, 4.5, ang, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawWaterShimmer(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  yTop: number,
  rows: number,
  rowGap: number,
  baseWidth: number,
  color: string,
  bgTime: number
): void {
  ctx.fillStyle = color;
  for (let i = 0; i < rows; i++) {
    const rw =
      Math.max(18, baseWidth - i * (baseWidth / (rows + 2))) +
      Math.sin(bgTime * 3.8 + i * 1.1) * 14;
    const rx = centerX - rw / 2 + Math.cos(bgTime * 2.4 + i) * 7;
    ctx.beginPath();
    ctx.roundRect(rx, yTop + i * rowGap, rw, 3.8, 2);
    ctx.fill();
  }
}
