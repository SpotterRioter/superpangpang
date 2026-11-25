import { GROUND_Y, LEVELS, POWERUP_DEFS, WORLD_H, WORLD_W } from './levels';
import { OST_TRACKS } from './audio';
import {
  Block,
  Bubble,
  GameState,
  Harpoon,
  LevelDef,
  Particle,
  Player,
  PowerupItem,
  ScorePopup,
  Shard,
  ShockRing,
  ThemeId,
  TravelState
} from './types';

export interface BlockThemeStyle {
  mode: 'crystal' | 'stone' | 'neon' | 'ice' | 'brick';
  destTop: string;
  destBot: string;
  destBorder: string;
  solidTop: string;
  solidBot: string;
  solidBorder: string;
}

export function getBlockThemeStyle(theme: ThemeId): BlockThemeStyle {
  if (theme === 'moon' || theme === 'mars') {
    return {
      mode: 'crystal',
      destTop: '#d8b4fe',
      destBot: '#6b21a8',
      destBorder: '#f3e8ff',
      solidTop: '#94a3b8',
      solidBot: '#1e293b',
      solidBorder: '#38bdf8'
    };
  }
  if (theme === 'neon' || theme === 'vegas' || theme === 'saopaulo') {
    return {
      mode: 'neon',
      destTop: '#fb7185',
      destBot: '#9f1239',
      destBorder: '#fde047',
      solidTop: '#475569',
      solidBot: '#0f172a',
      solidBorder: '#22d3ee'
    };
  }
  if (theme === 'alps' || theme === 'moscow') {
    return {
      mode: 'ice',
      destTop: '#bae6fd',
      destBot: '#0284c7',
      destBorder: '#f0f9ff',
      solidTop: '#94a3b8',
      solidBot: '#334155',
      solidBorder: '#cbd5e1'
    };
  }
  if (['pyramids', 'temple', 'machupicchu', 'rome', 'delhi', 'bangkok'].includes(theme)) {
    return {
      mode: 'stone',
      destTop: '#f6d38b',
      destBot: '#9a5b25',
      destBorder: '#fef3c7',
      solidTop: '#a8a29e',
      solidBot: '#44403c',
      solidBorder: '#e7e5e4'
    };
  }
  return {
    mode: 'brick',
    destTop: '#fb923c',
    destBot: '#9a3412',
    destBorder: '#fed7aa',
    solidTop: '#7c8db5',
    solidBot: '#25304a',
    solidBorder: '#cbd5e1'
  };
}

export function drawBlocks(ctx: CanvasRenderingContext2D, blocks: Block[], theme: ThemeId): void {
  const style = getBlockThemeStyle(theme);

  for (const bl of blocks) {
    ctx.save();

    // Soft cast shadow beneath block
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.roundRect(bl.x + 3, bl.y + 5, bl.w, bl.h, 5);
    ctx.fill();

    if (bl.destructible) {
      const g = ctx.createLinearGradient(bl.x, bl.y, bl.x, bl.y + bl.h);
      g.addColorStop(0, style.destTop);
      g.addColorStop(1, style.destBot);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(bl.x, bl.y, bl.w, bl.h, 4);
      ctx.fill();

      // Top glossy bevel
      ctx.fillStyle = 'rgba(255,255,255,0.34)';
      ctx.fillRect(bl.x + 2, bl.y + 2, bl.w - 4, 3);
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(bl.x + 2, bl.y + bl.h - 4, bl.w - 4, 2.5);

      ctx.strokeStyle = style.mode === 'crystal' || style.mode === 'ice'
        ? 'rgba(255,255,255,0.65)'
        : 'rgba(42, 16, 4, 0.6)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      if (style.mode === 'crystal' || style.mode === 'ice') {
        ctx.moveTo(bl.x + bl.w * 0.22, bl.y + 1);
        ctx.lineTo(bl.x + bl.w * 0.36, bl.y + bl.h - 1);
        ctx.moveTo(bl.x + bl.w * 0.66, bl.y + 1);
        ctx.lineTo(bl.x + bl.w * 0.52, bl.y + bl.h - 1);
      } else {
        ctx.moveTo(bl.x + 2, bl.y + bl.h / 2);
        ctx.lineTo(bl.x + bl.w - 2, bl.y + bl.h / 2);
        for (let bx = bl.x + 30; bx < bl.x + bl.w - 14; bx += 34) {
          ctx.moveTo(bx, bl.y + 1);
          ctx.lineTo(bx, bl.y + bl.h / 2);
          ctx.moveTo(bx + 16, bl.y + bl.h / 2);
          ctx.lineTo(bx + 16, bl.y + bl.h - 1);
        }
      }
      // Crisp destructible crack sigil in center
      ctx.moveTo(bl.x + bl.w * 0.5, bl.y + 2);
      ctx.lineTo(bl.x + bl.w * 0.45, bl.y + bl.h * 0.45);
      ctx.lineTo(bl.x + bl.w * 0.54, bl.y + bl.h * 0.72);
      ctx.lineTo(bl.x + bl.w * 0.48, bl.y + bl.h - 2);
      ctx.stroke();

      ctx.strokeStyle = style.destBorder;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(bl.x, bl.y, bl.w, bl.h, 4);
      ctx.stroke();
    } else {
      const g = ctx.createLinearGradient(bl.x, bl.y, bl.x, bl.y + bl.h);
      g.addColorStop(0, style.solidTop);
      g.addColorStop(0.55, style.solidBot);
      g.addColorStop(1, '#0b1120');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(bl.x, bl.y, bl.w, bl.h, 4);
      ctx.fill();

      // Diagonal brushed steel sheen
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.moveTo(bl.x + 14, bl.y + 1);
      ctx.lineTo(bl.x + 36, bl.y + 1);
      ctx.lineTo(bl.x + 22, bl.y + bl.h - 1);
      ctx.lineTo(bl.x, bl.y + bl.h - 1);
      ctx.closePath();
      ctx.fill();

      // Inner structural rail
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bl.x + 5, bl.y + 5, bl.w - 10, bl.h - 10);

      // Outer metallic trim
      ctx.strokeStyle = style.solidBorder;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(bl.x, bl.y, bl.w, bl.h, 4);
      ctx.stroke();

      // Corner rivets
      const rivets: [number, number][] = [
        [bl.x + 7, bl.y + 7],
        [bl.x + bl.w - 7, bl.y + 7],
        [bl.x + 7, bl.y + bl.h - 7],
        [bl.x + bl.w - 7, bl.y + bl.h - 7]
      ];
      for (const [rx, ry] of rivets) {
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(rx, ry, 2.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(rx + 0.6, ry + 0.6, 1.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

export function drawHarpoons(ctx: CanvasRenderingContext2D, harpoons: Harpoon[], bgTime: number): void {
  for (const h of harpoons) {
    if (h.latched && h.latchTimer < 1.2 && Math.floor(h.latchTimer * 14) % 2 === 0) continue;
    ctx.save();
    const isGolden = h.sticky;

    // Subtle energy glow behind cable
    ctx.strokeStyle = isGolden ? 'rgba(251, 191, 36, 0.3)' : 'rgba(34, 211, 238, 0.28)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(h.x, h.bottomY);
    ctx.lineTo(h.x, h.topY + 8);
    ctx.stroke();

    // Braided metallic wave chain
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    let toggle = 1;
    ctx.moveTo(h.x, h.bottomY);
    for (let y = h.bottomY; y > h.topY + 12; y -= 9) {
      const amp = h.latched ? 1.5 : 4.4;
      ctx.lineTo(h.x + Math.sin(y * 0.27 + h.waveOffset) * amp * toggle, y);
      toggle *= -1;
    }
    ctx.lineTo(h.x, h.topY + 8);
    ctx.stroke();

    ctx.strokeStyle = isGolden ? '#fbbf24' : '#e2e8f0';
    ctx.lineWidth = 3.2;
    ctx.stroke();

    ctx.strokeStyle = isGolden ? '#fef08a' : '#67e8f9';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Spearhead tip
    const glint = 0.5 + 0.5 * Math.sin(bgTime * 24);
    ctx.fillStyle = isGolden ? '#f59e0b' : glint > 0.6 ? '#ffffff' : '#22d3ee';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(h.x, h.topY - 5);
    ctx.lineTo(h.x - 10, h.topY + 14);
    ctx.lineTo(h.x, h.topY + 9);
    ctx.lineTo(h.x + 10, h.topY + 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Specular facet on spearhead
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(h.x, h.topY - 2);
    ctx.lineTo(h.x - 5, h.topY + 10);
    ctx.lineTo(h.x, h.topY + 7);
    ctx.closePath();
    ctx.fill();

    // Grappling claws for sticky cable
    if (isGolden) {
      const clawSpread = h.latched ? 12 : 6.5 + Math.sin(bgTime * 18) * 2;
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(h.x - 2, h.topY + 3);
      ctx.lineTo(h.x - clawSpread, h.topY - 2);
      ctx.lineTo(h.x - clawSpread - 2, h.topY + 3);
      ctx.moveTo(h.x + 2, h.topY + 3);
      ctx.lineTo(h.x + clawSpread, h.topY - 2);
      ctx.lineTo(h.x + clawSpread + 2, h.topY + 3);
      ctx.stroke();
    }

    ctx.restore();
  }
}

export function drawBubbles(
  ctx: CanvasRenderingContext2D,
  bubbles: Bubble[],
  lvl: LevelDef,
  bgTime: number,
  freezeTimer: number
): void {
  const frozen = freezeTimer > 0;
  for (const b of bubbles) {
    const main = lvl.palette[b.size] || '#ff3b5c';
    ctx.save();

    // Dynamic ground contact shadow + subtle colored bounce light
    const distGround = Math.max(0, GROUND_Y - (b.y + b.r));
    const shadowScale = Math.max(0.2, 1 - distGround / 450);
    ctx.fillStyle = `rgba(0, 0, 0, ${(0.34 * shadowScale).toFixed(2)})`;
    ctx.beginPath();
    ctx.ellipse(b.x, GROUND_Y - 1.5, b.r * 0.88 * shadowScale, 5.2 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(b.x, b.y);
    ctx.scale(b.scaleX, b.scaleY);

    // Outer ambient glow
    ctx.fillStyle = frozen ? 'rgba(125, 211, 252, 0.22)' : `${main}33`;
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 1.12, 0, Math.PI * 2);
    ctx.fill();

    // Frozen crystal aura
    if (frozen) {
      const pulse = 1.08 + Math.sin(bgTime * 10 + b.wobble) * 0.05;
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.82)';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, 0, b.r * pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Iridescent glass-energy sphere gradient
    const grad = ctx.createRadialGradient(-b.r * 0.34, -b.r * 0.36, b.r * 0.06, 0, 0, b.r);
    if (b.flashTimer > 0) {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.6, '#fef08a');
      grad.addColorStop(1, '#ffffff');
    } else if (frozen) {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.32, '#e0f2fe');
      grad.addColorStop(0.72, '#38bdf8');
      grad.addColorStop(1, '#1e3a8a');
    } else {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.16, '#fffdf7');
      grad.addColorStop(0.45, main);
      grad.addColorStop(0.8, main);
      grad.addColorStop(1, '#090d1e');
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, b.r, 0, Math.PI * 2);
    ctx.fill();

    // Crisp arcade double rim
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Subsurface floor reflection crescent at bottom
    ctx.beginPath();
    ctx.arc(0, 0, b.r - 2.6, Math.PI * 0.16, Math.PI * 0.84);
    ctx.strokeStyle = 'rgba(255,255,255,0.48)';
    ctx.lineWidth = Math.max(1.2, b.r * 0.055);
    ctx.lineCap = 'round';
    ctx.stroke();

    // Top-left caustic crescent
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 0.8, Math.PI * 1.06, Math.PI * 1.54);
    ctx.strokeStyle = 'rgba(255,255,255,0.72)';
    ctx.lineWidth = Math.max(1.4, b.r * 0.065);
    ctx.stroke();

    // Rotating specular highlights + ice facets when frozen
    ctx.save();
    ctx.rotate(b.rotAngle);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.ellipse(-b.r * 0.3, -b.r * 0.34, b.r * 0.25, b.r * 0.13, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(b.r * 0.28, b.r * 0.32, b.r * 0.085, 0, Math.PI * 2);
    ctx.fill();

    if (frozen) {
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 1.4;
      for (let k = 0; k < 3; k++) {
        const a = (k * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * -b.r * 0.55, Math.sin(a) * -b.r * 0.55);
        ctx.lineTo(Math.cos(a) * b.r * 0.55, Math.sin(a) * b.r * 0.55);
        ctx.stroke();
      }
    }
    ctx.restore();

    ctx.restore();
  }
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  pl: Player,
  state: GameState,
  bgTime: number,
  isSpaceStage: boolean
): void {
  if (pl.invulnTimer > 0 && Math.floor(pl.invulnTimer * 16) % 2 === 0) return;

  const celebrating = state === 'STAGE_CLEAR' || state === 'VICTORY';
  const isMoving = !celebrating && Math.abs(pl.vx) > 5;
  const legSwing = isMoving ? Math.sin(pl.walkCycle) * 8.5 : 0;
  const celebrateHop = celebrating ? Math.abs(Math.sin(bgTime * 9.5)) * 13 : 0;
  const bodyBob = celebrating
    ? celebrateHop
    : isMoving
    ? Math.abs(Math.cos(pl.walkCycle)) * 2.8
    : Math.sin(bgTime * 3.6) * 1.4;
  const recoilY = pl.recoil * 3.8;

  // Flowing multi-segment aviator scarf in world space
  if (pl.scarfNodes.length > 1) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#4c0519';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(pl.scarfNodes[0].x, pl.scarfNodes[0].y - celebrateHop);
    for (let i = 1; i < pl.scarfNodes.length; i++) {
      ctx.lineTo(pl.scarfNodes[i].x, pl.scarfNodes[i].y - celebrateHop);
    }
    ctx.stroke();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 6.5;
    ctx.stroke();

    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(pl.x, pl.y);

  // Energy Shield Dome
  if (pl.hasShield) {
    const pulse = 1 + Math.sin(bgTime * 7.5) * 0.05;
    ctx.save();
    const sg = ctx.createRadialGradient(0, -pl.h * 0.55 - celebrateHop, 8, 0, -pl.h * 0.55 - celebrateHop, 36 * pulse);
    sg.addColorStop(0, 'rgba(34, 211, 238, 0.05)');
    sg.addColorStop(0.75, 'rgba(56, 189, 248, 0.18)');
    sg.addColorStop(1, 'rgba(125, 211, 252, 0.52)');
    ctx.fillStyle = sg;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(0, -pl.h * 0.52 - celebrateHop, 31 * pulse, 37 * pulse, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Orbiting highlight arc
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -pl.h * 0.52 - celebrateHop, 30 * pulse, bgTime * 3, bgTime * 3 + 0.9);
    ctx.stroke();
    ctx.restore();
  }

  // Ground contact shadow
  const shScale = Math.max(0.62, 1 - celebrateHop / 35);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
  ctx.beginPath();
  ctx.ellipse(0, -1, 20 * shScale, 5.2 * shScale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, -celebrateHop + recoilY);
  ctx.rotate(celebrating ? Math.sin(bgTime * 9.5) * 0.06 : pl.tilt);
  ctx.scale(pl.facing < 0 && !celebrating ? -1 : 1, 1);

  const shape = (points: [number, number][], fill: string | CanvasGradient, stroke: string | null = '#1e1629', width = 1.6) => {
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  const box = (x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient, stroke: string | null = '#1e1629') => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  };

  const oval = (x: number, y: number, rx: number, ry: number, fill: string | CanvasGradient, stroke: string | null = null) => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  };

  // Jacket gradient (switches to crisp white/orange space suit torso on Moon & Mars!)
  const torsoGrad = ctx.createLinearGradient(-15, -38, 15, -17);
  if (isSpaceStage) {
    torsoGrad.addColorStop(0, '#f8fafc');
    torsoGrad.addColorStop(0.5, '#cbd5e1');
    torsoGrad.addColorStop(1, '#64748b');
  } else {
    torsoGrad.addColorStop(0, '#f1ac63');
    torsoGrad.addColorStop(0.45, '#ae592c');
    torsoGrad.addColorStop(1, '#5d311f');
  }

  // Legs & laced boots
  for (const side of [-1, 1] as const) {
    const x = side * 6 + side * legSwing * 0.56;
    const kneeLift = isMoving && side * Math.sin(pl.walkCycle) > 0 ? -2.2 : 0;
    box(x - 5, -19 + kneeLift, 10, 15, 3, isSpaceStage ? '#e2e8f0' : '#c9ad70');
    shape([[x - 4, -17 + kneeLift], [x, -17 + kneeLift], [x - 1, -6 + kneeLift], [x - 4, -6 + kneeLift]], isSpaceStage ? '#ffffff' : '#f4dba2', null);
    box(x - 6, -8 + kneeLift, 13, 8, 2, isSpaceStage ? '#f97316' : '#493044');
    box(x - 6, -3 + kneeLift, 13, 3, 1, '#1e1b2b');
    box(x - 3, -7 + kneeLift, 5, 3, 1, '#fde047', null);
  }

  ctx.translate(0, -bodyBob + celebrateHop);

  // Aviator backpack / oxygen pack
  box(-18, -37, 12, 21, 4, isSpaceStage ? '#e2e8f0' : '#334155');
  box(-17, -33, 4.5, 10, 1.5, isSpaceStage ? '#38bdf8' : '#788da0', null);
  if (isSpaceStage) {
    box(-16, -21, 7, 3, 1, '#f97316', null);
  }

  // Bomber jacket / Space torso
  shape([[-12, -40], [11, -40], [15, -32], [13, -18], [-13, -18], [-15, -32]], torsoGrad);
  shape([[-12, -35], [-8, -31], [-8, -22], [-13, -23]], isSpaceStage ? '#ffffff' : '#de8948', null);
  box(-11, -29, 7, 6, 1.5, isSpaceStage ? '#f97316' : '#824126');
  box(5, -29, 7, 6, 1.5, isSpaceStage ? '#f97316' : '#824126');
  box(-1, -36, 2, 16, 1, '#f8e1b8', null);
  box(-13, -21, 26, 4.2, 1, '#2b1e31');
  box(-4.2, -22.2, 8.4, 6.2, 1.5, '#facc15');
  box(-2, -20.2, 4, 2.2, 0, '#44303a', null);

  // Shearling collar + scarf knot
  shape([[-13, -40], [-5, -41], [0, -35], [5, -41], [13, -40], [9, -33], [0, -35], [-9, -33]], isSpaceStage ? '#38bdf8' : '#fff0ce');
  box(-7, -39, 14, 5, 2, '#ef4444');

  // Articulated arms + mechanical harpoon launcher
  const arm = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    box(-4, 0, 8, 15, 3, torsoGrad);
    box(-4, 11, 8, 5, 2, isSpaceStage ? '#f97316' : '#402c3d');
    oval(0, 17, 4, 4, isSpaceStage ? '#f8fafc' : '#ffd09c', '#45252b');
    ctx.restore();
  };

  const barrelAccent = pl.stickyTimer > 0 ? '#fbbf24' : pl.doubleTimer > 0 ? '#22d3ee' : '#38bdf8';
  if (celebrating) {
    arm(-12, -34, 2.65);
    arm(12, -34, -2.65);
  } else if (pl.shootAnim > 0) {
    arm(-9, -34, 2.5);
    arm(9, -34, -2.5);
    box(-5.5, -66, 11, 24, 3, '#334155');
    box(-3.5, -65, 7, 17, 1.5, '#cbd5e1', null);
    box(-4.5, -68, 9, 5.5, 1.5, barrelAccent);

    // Crisp muzzle flash on fire
    if (pl.muzzleFlash > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, pl.muzzleFlash * 5);
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(0, -88);
      ctx.lineTo(-6, -71);
      ctx.lineTo(-14, -75);
      ctx.lineTo(-6, -67);
      ctx.lineTo(6, -67);
      ctx.lineTo(14, -75);
      ctx.lineTo(6, -71);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  } else {
    arm(-12, -34, Math.sin(pl.walkCycle) * 0.26 * (isMoving ? 1 : 0));
    arm(12, -34, -0.35);
    box(10, -43, 8.5, 21, 2.5, '#334155');
    box(11.2, -41.5, 3, 16, 1, '#cbd5e1', null);
    box(9, -45.5, 10.5, 5, 1.5, barrelAccent);
  }

  // Head, aviator leather cap, gleaming goggles, expressive face
  oval(0, -48, 13, 13, '#6c392c', '#1e1629');
  oval(1, -46, 11, 11, '#eaa06d', '#56343b');
  oval(2, -48, 9, 9, '#ffd3a1');
  oval(-10, -46, 3.5, 4.5, '#f1ad7e', '#56343b');

  shape(
    [[-13, -49], [-12, -57], [-6, -62], [4, -63], [11, -59], [13, -52], [7, -53], [0, -56], [-8, -52], [-9, -43], [-13, -44]],
    isSpaceStage ? '#e2e8f0' : torsoGrad
  );
  shape([[-9, -57], [-5, -60], [3, -61], [7, -59], [0, -59], [-6, -55]], isSpaceStage ? '#ffffff' : '#f7c47a', null);
  box(-12, -56, 25, 5, 2, '#31233b');

  // Brass aviator goggles with specular glint
  for (const gx of [-5, 6]) {
    oval(gx, -55, 5.6, 5.1, '#e6be78', '#2a1f33');
    oval(gx, -55, 3.9, 3.6, pl.goggleGlint > 0.3 ? '#e0ffff' : '#0284c7', '#1e3a5f');
    shape([[gx - 2, -57], [gx + 1.2, -58], [gx + 2.2, -57], [gx - 1, -54]], '#ffffff', null);
  }

  // Expressive eyes
  for (const ex of [0, 7]) {
    if (pl.isBlinking) {
      box(ex - 2, -46, 4.2, 1.6, 0, '#38283a', null);
    } else {
      oval(ex, -46, 2.3, 3.2, '#fff7eb');
      oval(ex + 0.7, -46, 1.25, 2.4, '#241c33');
      oval(ex + 0.2, -47.2, 0.55, 0.55, '#ffffff');
    }
  }
  oval(5, -43, 2.2, 1.6, '#e59866');
  ctx.strokeStyle = '#7f2d2d';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  if (celebrating) {
    ctx.arc(3.5, -42.5, 3.4, 0.1, Math.PI - 0.1);
  } else {
    ctx.arc(3, -42, 3, 0.25, Math.PI - 0.25);
  }
  ctx.stroke();
  box(-9, -39, 12, 4, 2, '#ef4444');

  // Transparent Astronaut Glass Bubble Helmet automatically equipped on Moon & Mars!
  if (isSpaceStage) {
    ctx.save();
    const hg = ctx.createRadialGradient(-6, -56, 3, 0, -50, 19);
    hg.addColorStop(0, 'rgba(224, 242, 254, 0.42)');
    hg.addColorStop(0.65, 'rgba(56, 189, 248, 0.12)');
    hg.addColorStop(1, 'rgba(125, 211, 252, 0.48)');
    ctx.fillStyle = hg;
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, -50, 18.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Helmet glass reflection crescent
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -50, 14.5, Math.PI * 1.12, Math.PI * 1.48);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

export function drawPowerups(ctx: CanvasRenderingContext2D, powerups: PowerupItem[], bgTime: number): void {
  for (const p of powerups) {
    if (p.life < 2.2 && Math.floor(p.life * 10) % 2 === 0) continue;
    const def = POWERUP_DEFS[p.type];
    const bob = Math.sin(bgTime * 6.5 + p.x) * 3.5;
    const pulse = 1 + Math.sin(bgTime * 8) * 0.08;

    ctx.save();
    ctx.translate(p.x, p.y + bob);

    // Radiant halo
    const aura = ctx.createRadialGradient(0, 0, p.r * 0.3, 0, 0, p.r * 1.65);
    aura.addColorStop(0, `${def.color}66`);
    aura.addColorStop(1, `${def.color}00`);
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, p.r * 1.65, 0, Math.PI * 2);
    ctx.fill();

    // Pulsing outer ring
    ctx.strokeStyle = def.color;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, (p.r + 3.5) * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Medallion base
    const mg = ctx.createRadialGradient(-4, -5, 2, 0, 0, p.r);
    mg.addColorStop(0, '#334155');
    mg.addColorStop(0.55, def.bg);
    mg.addColorStop(1, '#020617');
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 2.8;
    ctx.strokeStyle = def.color;
    ctx.stroke();

    ctx.strokeStyle = def.rim;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, p.r - 3, 0, Math.PI * 2);
    ctx.stroke();

    // Crisp vector pictograms
    ctx.scale(p.r / 15.5, p.r / 15.5);
    ctx.strokeStyle = '#fff8e7';
    ctx.fillStyle = '#fff8e7';
    ctx.lineWidth = 2.1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const line = (pts: [number, number][], fill = false) => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      if (fill) {
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.stroke();
      }
    };

    if (p.type === 'double') {
      for (const x of [-4, 4]) {
        line([[x, 8], [x, -7]]);
        line([[x - 3, -3], [x, -8], [x + 3, -3]], true);
      }
    } else if (p.type === 'sticky') {
      line([[0, -7], [0, 8]]);
      line([[-5, -3], [5, -3]]);
      ctx.beginPath();
      ctx.arc(0, -8, 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 2, 7, 0, Math.PI);
      ctx.stroke();
      line([[-8, 2], [-7, 5], [-4, 2]], true);
      line([[8, 2], [7, 5], [4, 2]], true);
    } else if (p.type === 'shield') {
      line([[0, -9], [8, -6], [6, 3], [0, 9], [-6, 3], [-8, -6]], true);
      ctx.fillStyle = '#38bdf8';
      line([[0, -6], [5, -4], [4, 2], [0, 6]], true);
    } else if (p.type === 'freeze') {
      ctx.beginPath();
      ctx.arc(0, 1, 8, 0, Math.PI * 2);
      ctx.stroke();
      line([[0, -7], [0, -10]]);
      line([[-3, -10], [3, -10]]);
      line([[0, -4], [0, 1], [4, 3]]);
    } else if (p.type === 'dynamite') {
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.roundRect(-6, -5, 12, 13, 2);
      ctx.fill();
      ctx.stroke();
      line([[-6, 1], [6, 1]]);
      line([[0, -5], [2, -9], [6, -9]]);
      ctx.fillStyle = '#fde047';
      line([[6, -12], [7, -9], [10, -8], [7, -7], [6, -4], [5, -8], [2, -9]], true);
    } else if (p.type === 'extralife') {
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.bezierCurveTo(-18, -3, -6, -13, 0, -5);
      ctx.bezierCurveTo(6, -13, 18, -3, 0, 8);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}

export function drawEffects(
  ctx: CanvasRenderingContext2D,
  rings: ShockRing[],
  shards: Shard[],
  particles: Particle[],
  popups: ScorePopup[]
): void {
  for (const rg of rings) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, rg.life / rg.maxLife);
    ctx.strokeStyle = rg.color;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  for (const sh of shards) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, sh.life / sh.maxLife);
    ctx.translate(sh.x, sh.y);
    ctx.rotate(sh.rot);
    ctx.fillStyle = sh.color;
    ctx.fillRect(-sh.w / 2, -sh.h / 2, sh.w, sh.h);
    ctx.strokeStyle = sh.border;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-sh.w / 2, -sh.h / 2, sh.w, sh.h);
    ctx.restore();
  }

  for (const pt of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (const pop of popups) {
    ctx.save();
    const alpha = Math.max(0, Math.min(1, (pop.life / pop.maxLife) * 1.4));
    ctx.globalAlpha = alpha;
    const sc = pop.scale ?? 1;
    ctx.translate(pop.x, pop.y);
    ctx.scale(sc, sc);
    ctx.font = 'bold 12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.strokeText(pop.text, 0, 0);
    ctx.fillStyle = pop.color;
    ctx.fillText(pop.text, 0, 0);
    ctx.restore();
  }
}

export function drawStageIntroBanner(
  ctx: CanvasRenderingContext2D,
  lvl: LevelDef,
  stageIntroTimer: number,
  state: GameState
): void {
  if (stageIntroTimer <= 0 || state !== 'PLAYING') return;
  const track = OST_TRACKS[lvl.theme];
  const alpha = Math.min(1, stageIntroTimer * 1.3);
  const slideY = (1 - Math.min(1, (2.4 - stageIntroTimer) * 5)) * -18;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(0, slideY);

  const bx = WORLD_W / 2 - 265;
  const by = 46;
  const bw = 530;
  const bh = 88;

  const bg = ctx.createLinearGradient(bx, by, bx, by + bh);
  bg.addColorStop(0, 'rgba(13, 20, 42, 0.92)');
  bg.addColorStop(1, 'rgba(6, 10, 22, 0.92)');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 14);
  ctx.fill();

  ctx.strokeStyle = lvl.spaceStage ? '#c084fc' : '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '11px "Press Start 2P", monospace';
  ctx.fillStyle = lvl.spaceStage ? '#e9d5ff' : '#fde047';
  ctx.fillText(`FASE ${String(lvl.id).padStart(2, '0')} / ${LEVELS.length}`, WORLD_W / 2, by + 26);

  ctx.font = '700 18px "Chakra Petch", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${lvl.flag}  ${lvl.name} — ${lvl.country}`, WORLD_W / 2, by + 54);

  if (track) {
    ctx.font = '600 12px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`♪ OST: ${track.title}`, WORLD_W / 2, by + 76);
  }
  ctx.restore();
}

// =========================================================================
// WORLD MAP & SPACE MAP TRAVEL CUTSCENE RENDERER
// =========================================================================
function drawWorldContinents(ctx: CanvasRenderingContext2D): void {
  const drawPoly = (pts: [number, number][]) => {
    ctx.beginPath();
    pts.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px * WORLD_W, py * WORLD_H);
      else ctx.lineTo(px * WORLD_W, py * WORLD_H);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Shallow continental shelf halo
  ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 10;
  const landPolys: [number, number][][] = [
    [[0.09, 0.18], [0.26, 0.16], [0.32, 0.28], [0.27, 0.40], [0.23, 0.46], [0.21, 0.52], [0.18, 0.44], [0.13, 0.34]],
    [[0.23, 0.54], [0.32, 0.56], [0.38, 0.68], [0.34, 0.83], [0.28, 0.88], [0.24, 0.72], [0.22, 0.60]],
    [[0.44, 0.18], [0.58, 0.16], [0.62, 0.28], [0.55, 0.36], [0.45, 0.35], [0.44, 0.26]],
    [[0.45, 0.39], [0.57, 0.39], [0.62, 0.52], [0.56, 0.75], [0.49, 0.76], [0.45, 0.58], [0.42, 0.48]],
    [[0.58, 0.16], [0.85, 0.18], [0.88, 0.34], [0.81, 0.52], [0.71, 0.52], [0.65, 0.44], [0.58, 0.38]],
    [[0.86, 0.33], [0.89, 0.34], [0.88, 0.40], [0.85, 0.39]],
    [[0.78, 0.68], [0.90, 0.67], [0.92, 0.80], [0.81, 0.82]],
    [[0.055, 0.46], [0.085, 0.46], [0.085, 0.485], [0.055, 0.485]]
  ];
  landPolys.forEach(drawPoly);

  // Rich emerald topographic landmass
  const lg = ctx.createLinearGradient(0, 80, 0, WORLD_H - 40);
  lg.addColorStop(0, '#1e6b52');
  lg.addColorStop(0.5, '#2d7d5f');
  lg.addColorStop(1, '#184e3c');
  ctx.fillStyle = lg;
  ctx.strokeStyle = '#6ee7b7';
  ctx.lineWidth = 2;
  landPolys.forEach(drawPoly);
}

export function drawAirplane(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, bgTime: number): void {
  ctx.save();
  ctx.translate(x + 12, y + 18);
  ctx.rotate(angle);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 19, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Wings
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(-6, -26, 12, 52, 4);
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Fuselage
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(2, 0, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Tailfin
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(-23, -11, 7.5, 22, 2);
  ctx.fill();

  // Cockpit canopy
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(6, 0, 6.5, 3.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spinning propeller
  const propLen = 7.5 + Math.sin(bgTime * 48) * 4.2;
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(26, -propLen);
  ctx.lineTo(26, propLen);
  ctx.stroke();
  ctx.restore();
}

export function drawSpaceship(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, bgTime: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const flameLen = 20 + Math.sin(bgTime * 52) * 8;
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(-20, -7);
  ctx.lineTo(-20 - flameLen, 0);
  ctx.lineTo(-20, 7);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.moveTo(-20, -3.5);
  ctx.lineTo(-20 - flameLen * 0.58, 0);
  ctx.lineTo(-20, 3.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(-18, -7);
  ctx.lineTo(-27, -17);
  ctx.lineTo(-8, -7);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-18, 7);
  ctx.lineTo(-27, 17);
  ctx.lineTo(-8, 7);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(28, 0);
  ctx.quadraticCurveTo(10, -12, -18, -9);
  ctx.lineTo(-20, 9);
  ctx.quadraticCurveTo(10, 12, 28, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(28, 0);
  ctx.lineTo(14, -7);
  ctx.lineTo(14, 7);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(2, 0, 5.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function renderMapTravel(ctx: CanvasRenderingContext2D, tr: TravelState, bgTime: number): void {
  const fromLvl = LEVELS[tr.fromIndex];
  const toLvl = LEVELS[tr.toIndex];
  const rawT = Math.max(0, Math.min(1, tr.progress));
  const t = rawT < 0.5 ? 2 * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 2) / 2;

  let sx: number;
  let sy: number;
  let ex: number;
  let ey: number;
  let cx: number;
  let cy: number;

  if (!tr.isSpace) {
    const bg = ctx.createRadialGradient(WORLD_W * 0.5, WORLD_H * 0.45, 60, WORLD_W * 0.5, WORLD_H * 0.5, WORLD_W * 0.65);
    bg.addColorStop(0, '#0f3460');
    bg.addColorStop(0.6, '#08203e');
    bg.addColorStop(1, '#041024');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // Subtle vintage cartographic grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.11)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= WORLD_W; gx += 60) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, WORLD_H);
      ctx.stroke();
    }
    for (let gy = 0; gy <= WORLD_H; gy += 60) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(WORLD_W, gy);
      ctx.stroke();
    }

    drawWorldContinents(ctx);

    // Drifting map clouds
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let c = 0; c < 6; c++) {
      const mx = ((bgTime * (12 + c * 3) + c * 180) % (WORLD_W + 180)) - 90;
      const my = 100 + (c % 3) * 145;
      ctx.beginPath();
      ctx.ellipse(mx, my, 75, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Destination pins
    LEVELS.slice(0, 22).forEach((l, idx) => {
      const px = l.mapX * WORLD_W;
      const py = l.mapY * WORLD_H;
      const isTarget = idx === tr.toIndex;
      const isVisited = idx <= tr.fromIndex;
      ctx.fillStyle = isTarget ? '#fde047' : isVisited ? '#38bdf8' : 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.arc(px, py, isTarget ? 7.5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      if (isTarget) {
        const pulse = 11 + Math.sin(bgTime * 9) * 5;
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    sx = fromLvl.mapX * WORLD_W;
    sy = fromLvl.mapY * WORLD_H;
    ex = toLvl.mapX * WORLD_W;
    ey = toLvl.mapY * WORLD_H;
    cx = (sx + ex) / 2;
    cy = Math.max(75, Math.min(sy, ey) - Math.max(58, Math.hypot(ex - sx, ey - sy) * 0.25));
  } else {
    const sp = ctx.createRadialGradient(WORLD_W / 2, WORLD_H / 2, 40, WORLD_W / 2, WORLD_H / 2, WORLD_W * 0.72);
    sp.addColorStop(0, '#1e164b');
    sp.addColorStop(0.55, '#0b0e28');
    sp.addColorStop(1, '#02040a');
    ctx.fillStyle = sp;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // Starfield
    for (let i = 0; i < 95; i++) {
      const x = (i * 197.3) % WORLD_W;
      const y = (i * 311.7) % WORLD_H;
      const a = 0.35 + 0.65 * Math.sin(bgTime * 2.5 + i);
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x, y, (i % 3) * 0.6 + 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    const earthPos = { x: 180, y: 345 };
    const moonPos = { x: 495, y: 245 };
    const marsPos = { x: 785, y: 185 };

    // Earth
    ctx.save();
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 28;
    const eg = ctx.createRadialGradient(earthPos.x - 16, earthPos.y - 16, 8, earthPos.x, earthPos.y, 58);
    eg.addColorStop(0, '#bae6fd');
    eg.addColorStop(0.55, '#0284c7');
    eg.addColorStop(1, '#082f49');
    ctx.fillStyle = eg;
    ctx.beginPath();
    ctx.arc(earthPos.x, earthPos.y, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#2ec4b6';
    ctx.beginPath();
    ctx.ellipse(earthPos.x - 12, earthPos.y - 6, 18, 13, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '700 13px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TERRA', earthPos.x, earthPos.y + 76);
    ctx.restore();

    // Moon
    ctx.save();
    ctx.shadowColor = '#e2e8f0';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(moonPos.x, moonPos.y, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(moonPos.x - 9, moonPos.y - 6, 7, 0, Math.PI * 2);
    ctx.arc(moonPos.x + 10, moonPos.y + 8, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '700 13px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LUA', moonPos.x, moonPos.y + 52);
    ctx.restore();

    // Mars
    ctx.save();
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = 24;
    const mg = ctx.createRadialGradient(marsPos.x - 12, marsPos.y - 12, 8, marsPos.x, marsPos.y, 46);
    mg.addColorStop(0, '#fb923c');
    mg.addColorStop(0.6, '#c2410c');
    mg.addColorStop(1, '#431407');
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.arc(marsPos.x, marsPos.y, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = '700 13px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MARTE', marsPos.x, marsPos.y + 64);
    ctx.restore();

    if (toLvl.theme === 'moon') {
      sx = earthPos.x;
      sy = earthPos.y;
      ex = moonPos.x;
      ey = moonPos.y;
    } else {
      sx = moonPos.x;
      sy = moonPos.y;
      ex = marsPos.x;
      ey = marsPos.y;
    }
    cx = (sx + ex) / 2;
    cy = Math.min(sy, ey) - 96;
  }

  // Dotted flight arc
  ctx.save();
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = tr.isSpace ? 'rgba(192, 132, 252, 0.78)' : 'rgba(253, 224, 71, 0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo(cx, cy, ex, ey);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  const u = 1 - t;
  const vx = u * u * sx + 2 * u * t * cx + t * t * ex;
  const vy = u * u * sy + 2 * u * t * cy + t * t * ey;
  const dx = 2 * u * (cx - sx) + 2 * t * (ex - cx);
  const dy = 2 * u * (cy - sy) + 2 * t * (ey - cy);
  const angle = Math.atan2(dy, dx);

  if (Math.random() < 0.75) {
    tr.exhaust.push({
      x: vx - Math.cos(angle) * 20,
      y: vy - Math.sin(angle) * 20,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14,
      r: tr.isSpace ? 4.8 : 3.2,
      color: tr.isSpace ? '#fde047' : 'rgba(255,255,255,0.85)',
      life: 0.75,
      maxLife: 0.75
    });
  }

  for (const p of tr.exhaust) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (tr.isSpace) drawSpaceship(ctx, vx, vy, angle, bgTime);
  else drawAirplane(ctx, vx, vy, angle, bgTime);

  // Top Destination Banner
  ctx.save();
  ctx.fillStyle = 'rgba(8, 13, 28, 0.9)';
  ctx.beginPath();
  ctx.roundRect(WORLD_W / 2 - 285, 18, 570, 74, 14);
  ctx.fill();
  ctx.strokeStyle = tr.isSpace ? '#c084fc' : '#38bdf8';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '10px "Press Start 2P", monospace';
  ctx.fillStyle = tr.isSpace ? '#e9d5ff' : '#fde047';
  ctx.fillText(tr.isSpace ? 'MISSÃO ESPACIAL · PRÓXIMO DESTINO' : 'ROTA DE VOO · PRÓXIMO DESTINO', WORLD_W / 2, 44);

  ctx.font = '700 20px "Chakra Petch", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`FASE ${String(toLvl.id).padStart(2, '0')}: ${toLvl.flag} ${toLvl.name.toUpperCase()} (${toLvl.country})`, WORLD_W / 2, 74);
  ctx.restore();
}
