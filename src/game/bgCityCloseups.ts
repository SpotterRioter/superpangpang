import { BLEED_L, BLEED_R, paintArchRow } from './bgHelpers';
import { GROUND_Y, WORLD_W } from './levels';
import { ThemeId } from './types';

/** Per-stage monumental zoom [scaleX, scaleY] anchored at (WORLD_W/2, GROUND_Y) so cities & landmarks feel dramatically closer */
export const FAR_ZOOM: Record<ThemeId, [number, number]> = {
  fuji: [1.14, 1.24],
  pyramids: [1.14, 1.24],
  neon: [1.12, 1.22],
  alps: [1.15, 1.26],
  caribbean: [1.14, 1.22],
  temple: [1.15, 1.25],
  rio: [1.15, 1.25],
  saopaulo: [1.12, 1.24],
  buenosaires: [1.16, 1.28],
  machupicchu: [1.14, 1.22],
  habana: [1.18, 1.32],
  vegas: [1.14, 1.24],
  nyc: [1.12, 1.2],
  madrid: [1.18, 1.32],
  london: [1.14, 1.22],
  rome: [1.18, 1.34],
  moscow: [1.16, 1.3],
  delhi: [1.16, 1.3],
  bangkok: [1.16, 1.28],
  beijing: [1.16, 1.3],
  sydney: [1.18, 1.32],
  honolulu: [1.15, 1.25],
  moon: [1.14, 1.22],
  mars: [1.16, 1.28]
};

export const MID_ZOOM: Record<ThemeId, [number, number]> = {
  fuji: [1.16, 1.28],
  pyramids: [1.2, 1.34],
  neon: [1.12, 1.2],
  alps: [1.18, 1.32],
  caribbean: [1.18, 1.28],
  temple: [1.2, 1.34],
  rio: [1.18, 1.3],
  saopaulo: [1.12, 1.2],
  buenosaires: [1.18, 1.36],
  machupicchu: [1.2, 1.34],
  habana: [1.18, 1.34],
  vegas: [1.16, 1.28],
  nyc: [1.12, 1.2],
  madrid: [1.22, 1.38],
  london: [1.12, 1.22],
  rome: [1.22, 1.4],
  moscow: [1.18, 1.3],
  delhi: [1.2, 1.32],
  bangkok: [1.18, 1.3],
  beijing: [1.22, 1.42],
  sydney: [1.2, 1.38],
  honolulu: [1.18, 1.3],
  moon: [1.16, 1.28],
  mars: [1.18, 1.32]
};

function drawStreetFacade(
  ctx: CanvasRenderingContext2D,
  x: number,
  w: number,
  h: number,
  wallCol: string,
  trimCol: string,
  winCol: string,
  balconyCol: string | null,
  awningCol?: [string, string]
): void {
  const y = GROUND_Y - h;
  ctx.fillStyle = wallCol;
  ctx.fillRect(x, y, w, h);

  // Roof cornice & floor ledges
  ctx.fillStyle = trimCol;
  ctx.fillRect(x - 4, y, w + 8, 9);
  for (let fy = y + 72; fy < GROUND_Y - 56; fy += 72) {
    ctx.fillRect(x - 2, fy, w + 4, 4);
  }

  // Tall close-up apartment/hotel windows
  const cols = Math.max(2, Math.floor((w - 18) / 34));
  const gap = (w - 16) / cols;
  for (let fy = y + 20; fy < GROUND_Y - 72; fy += 72) {
    for (let c = 0; c < cols; c++) {
      const wx = x + 10 + c * gap;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx, fy, 20, 40);
      ctx.fillStyle = winCol;
      ctx.fillRect(wx + 2, fy + 2, 16, 36);
      // Window muntin cross
      ctx.fillStyle = trimCol;
      ctx.fillRect(wx + 9, fy + 2, 2, 36);
      ctx.fillRect(wx + 2, fy + 18, 16, 2);

      if (balconyCol) {
        ctx.strokeStyle = balconyCol;
        ctx.lineWidth = 2;
        ctx.strokeRect(wx - 3, fy + 26, 26, 15);
        for (let r = wx + 2; r < wx + 22; r += 5) {
          ctx.beginPath();
          ctx.moveTo(r, fy + 26);
          ctx.lineTo(r, fy + 41);
          ctx.stroke();
        }
      }
    }
  }

  // Ground-floor striped café / shopfront awning
  if (awningCol) {
    const ay = GROUND_Y - 58;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 8, ay + 14, w - 16, 44);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
    ctx.fillRect(x + 12, ay + 20, w - 24, 30);

    const stripes = Math.max(4, Math.floor((w - 8) / 14));
    const sw = (w - 8) / stripes;
    for (let s = 0; s < stripes; s++) {
      ctx.fillStyle = s % 2 === 0 ? awningCol[0] : awningCol[1];
      ctx.beginPath();
      ctx.moveTo(x + 4 + s * sw, ay);
      ctx.lineTo(x + 4 + (s + 1) * sw, ay);
      ctx.lineTo(x + 2 + (s + 1) * sw, ay + 16);
      ctx.lineTo(x + 2 + s * sw, ay + 16);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function drawClassicLamp(
  ctx: CanvasRenderingContext2D,
  x: number,
  h: number,
  poleCol = '#0f172a',
  bulbCol = '#fef08a'
): void {
  ctx.fillStyle = poleCol;
  ctx.fillRect(x - 5, GROUND_Y - 14, 10, 14);
  ctx.fillRect(x - 2.5, GROUND_Y - h, 5, h);
  ctx.fillRect(x - 12, GROUND_Y - h + 8, 24, 3);
  const g = ctx.createRadialGradient(x, GROUND_Y - h, 2, x, GROUND_Y - h, 26);
  g.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
  g.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, GROUND_Y - h, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bulbCol;
  ctx.beginPath();
  ctx.arc(x, GROUND_Y - h, 6.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Renders the 4th close-up city/street plane (nearCtx) so every stage feels right inside
 * the destination's streets, plazas, rooftops, temples, or space outposts.
 */
export function renderCloseCityForeground(
  ctx: CanvasRenderingContext2D,
  theme: ThemeId,
  rand: () => number
): void {
  switch (theme) {
    case 'fuji': {
      // Close-up traditional wooden Machiya teahouses on left & right of Kawaguchiko promenade
      const drawMachiya = (x: number, w: number, h: number, flip: boolean) => {
        const y = GROUND_Y - h;
        ctx.fillStyle = '#2b1810';
        ctx.fillRect(x, y + 28, w, h - 28);
        // Warm glowing shoji sliding screens
        ctx.fillStyle = 'rgba(254, 215, 170, 0.78)';
        ctx.fillRect(x + 12, y + 48, w - 24, 58);
        ctx.fillRect(x + 12, GROUND_Y - 92, w - 24, 72);
        // Wooden lattice grid
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        for (let lx = x + 12; lx <= x + w - 12; lx += 14) {
          ctx.beginPath();
          ctx.moveTo(lx, y + 48);
          ctx.lineTo(lx, y + 106);
          ctx.moveTo(lx, GROUND_Y - 92);
          ctx.lineTo(lx, GROUND_Y - 20);
          ctx.stroke();
        }
        // Sweeping kawara tiled eaves (2 tiers)
        [y + 28, y + 126].forEach((ry, idx) => {
          ctx.fillStyle = '#1e1b2e';
          ctx.beginPath();
          ctx.moveTo(x - 16, ry + 8);
          ctx.quadraticCurveTo(x + w / 2, ry - 18 + idx * 4, x + w + 16, ry + 8);
          ctx.lineTo(x + w + 10, ry + 16);
          ctx.lineTo(x - 10, ry + 16);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        });
        // Glowing red chochin paper lantern
        const lx = flip ? x - 6 : x + w + 6;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(lx, GROUND_Y - 98, 9, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.fillRect(lx - 5, GROUND_Y - 113, 10, 3);
        ctx.fillRect(lx - 5, GROUND_Y - 85, 10, 3);
      };
      drawMachiya(BLEED_L + 4, 128, 286, false);
      drawMachiya(WORLD_W - 76, 128, 272, true);
      // Wooden lakeside railing posts
      ctx.fillStyle = '#3b1d14';
      ctx.fillRect(BLEED_L, GROUND_Y - 14, BLEED_R - BLEED_L, 5);
      for (let px = 80; px < WORLD_W; px += 92) {
        ctx.fillRect(px, GROUND_Y - 24, 6, 24);
      }
      break;
    }

    case 'pyramids': {
      // Close-up monumental Pharaonic sandstone temple columns & bazaar tent
      const drawLotusColumn = (cx: number, h: number) => {
        const y = GROUND_Y - h;
        const g = ctx.createLinearGradient(cx - 22, y, cx + 22, y);
        g.addColorStop(0, '#fde68a');
        g.addColorStop(0.55, '#d97706');
        g.addColorStop(1, '#78350f');
        ctx.fillStyle = g;
        ctx.fillRect(cx - 20, y + 32, 40, h - 48);
        ctx.fillRect(cx - 28, GROUND_Y - 16, 56, 16);
        // Flared lotus capital
        ctx.beginPath();
        ctx.moveTo(cx - 32, y);
        ctx.lineTo(cx + 32, y);
        ctx.lineTo(cx + 20, y + 32);
        ctx.lineTo(cx - 20, y + 32);
        ctx.closePath();
        ctx.fill();
        // Horizontal carved bands
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(cx - 20, y + 54, 40, 6);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cx - 20, y + 64, 40, 5);
      };
      drawLotusColumn(26, 370);
      drawLotusColumn(934, 370);
      // Top stone architrave lintel corners
      ctx.fillStyle = '#b45309';
      ctx.fillRect(BLEED_L, GROUND_Y - 392, 136, 24);
      ctx.fillRect(WORLD_W - 80, GROUND_Y - 392, 136, 24);
      break;
    }

    case 'neon': {
      // Close-up Shibuya / Shinjuku neon canyon buildings towering to top of screen!
      drawStreetFacade(ctx, BLEED_L, 132, 445, '#090418', '#22d3ee', 'rgba(34,211,238,0.42)', null, ['#f43f5e', '#1e1b4b']);
      drawStreetFacade(ctx, WORLD_W - 76, 132, 445, '#090418', '#f43f5e', 'rgba(244,63,94,0.42)', null, ['#22d3ee', '#1e1b4b']);

      // Stacked protruding neon signs on left & right buildings
      const signs: [number, number, number, number, string, string][] = [
        [78, 92, 28, 96, '#f43f5e', '#fff'],
        [78, 206, 26, 84, '#22d3ee', '#082f49'],
        [854, 108, 28, 98, '#fde047', '#451a03'],
        [856, 224, 26, 82, '#a855f7', '#fff']
      ];
      for (const [sx, sy, sw, sh, bg, fg] of signs) {
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(sx, sy, sw, sh, 4);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.fillStyle = fg;
        for (let k = 0; k < 4; k++) {
          ctx.fillRect(sx + 6, sy + 10 + k * 20, sw - 12, 9);
        }
      }
      // Glowing street-side Tokyo vending machines
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(46, GROUND_Y - 46, 26, 46);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(50, GROUND_Y - 41, 18, 22);
      break;
    }

    case 'alps': {
      // Close-up Zermatt timber tavern chalets framing left & right
      drawStreetFacade(ctx, BLEED_L, 126, 305, '#451a03', '#fef3c7', 'rgba(254,240,138,0.75)', '#78350f');
      drawStreetFacade(ctx, WORLD_W - 70, 126, 295, '#3b1806', '#fef3c7', 'rgba(254,240,138,0.75)', '#78350f');
      // Heavy snowy pitched roofs
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(BLEED_L - 10, GROUND_Y - 300);
      ctx.lineTo(35, GROUND_Y - 348);
      ctx.lineTo(92, GROUND_Y - 300);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(WORLD_W - 84, GROUND_Y - 290);
      ctx.lineTo(WORLD_W - 15, GROUND_Y - 338);
      ctx.lineTo(BLEED_R + 10, GROUND_Y - 290);
      ctx.closePath();
      ctx.fill();
      drawClassicLamp(ctx, 98, 108, '#1e293b', '#fde047');
      drawClassicLamp(ctx, 862, 108, '#1e293b', '#fde047');
      break;
    }

    case 'caribbean': {
      // Close-up Nassau / Caribbean pastel harbor shacks + string lights
      drawStreetFacade(ctx, BLEED_L, 118, 265, '#0d9488', '#fef3c7', 'rgba(254,249,195,0.7)', '#fffbeb', ['#f97316', '#fffbeb']);
      drawStreetFacade(ctx, WORLD_W - 62, 118, 250, '#fb7185', '#fef3c7', 'rgba(254,249,195,0.7)', '#fffbeb', ['#0284c7', '#fffbeb']);
      break;
    }

    case 'temple': {
      // Close-up Angkor carved sandstone gateway columns & golden Naga balustrades
      [BLEED_L + 10, WORLD_W - 66].forEach((px) => {
        ctx.fillStyle = '#5c2d0c';
        ctx.fillRect(px, GROUND_Y - 375, 56, 375);
        ctx.fillStyle = '#d97706';
        for (let ty = GROUND_Y - 360; ty < GROUND_Y - 20; ty += 48) {
          ctx.fillRect(px - 4, ty, 64, 9);
        }
        // Golden upturned roof corner
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(px - 18, GROUND_Y - 375);
        ctx.quadraticCurveTo(px + 28, GROUND_Y - 408, px + 74, GROUND_Y - 375);
        ctx.closePath();
        ctx.fill();
      });
      break;
    }

    case 'rio': {
      // Close-up Avenida Atlântica Art Deco hotel facade (left) & Copacabana beach kiosk (right)
      drawStreetFacade(ctx, BLEED_L, 128, 355, '#fffbeb', '#cbd5e1', 'rgba(56,189,248,0.55)', '#334155', ['#0284c7', '#ffffff']);
      // Colorful beach parasols along Copacabana promenade
      [
        [135, '#ef4444'],
        [828, '#f59e0b'],
        [892, '#10b981']
      ].forEach(([ux, col]) => {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ux as number, GROUND_Y - 6);
        ctx.lineTo(ux as number, GROUND_Y - 54);
        ctx.stroke();
        ctx.fillStyle = col as string;
        ctx.beginPath();
        ctx.arc(ux as number, GROUND_Y - 48, 26, Math.PI, 0);
        ctx.fill();
      });
      drawClassicLamp(ctx, 102, 105, '#1e293b', '#fef9c3');
      break;
    }

    case 'saopaulo': {
      // Close-up Avenida Paulista modernist skyscrapers + iconic Paulista clock totem
      drawStreetFacade(ctx, BLEED_L, 134, 440, '#111827', '#38bdf8', 'rgba(253,224,71,0.52)', null);
      drawStreetFacade(ctx, WORLD_W - 78, 134, 430, '#0f172a', '#f59e0b', 'rgba(186,230,253,0.48)', null);
      // Iconic Paulista digital street clock totem
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(104, GROUND_Y - 102, 16, 102);
      ctx.fillStyle = '#020617';
      ctx.fillRect(96, GROUND_Y - 118, 32, 22);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(100, GROUND_Y - 112, 24, 10);
      break;
    }

    case 'buenosaires': {
      // Towering close-up San Telmo / Caminito colorful balconies & El Tango Café
      drawStreetFacade(ctx, BLEED_L, 134, 385, '#b91c1c', '#fbbf24', 'rgba(254,240,138,0.72)', '#0f172a', ['#1d4ed8', '#fef3c7']);
      drawStreetFacade(ctx, WORLD_W - 78, 134, 375, '#1d4ed8', '#f43f5e', 'rgba(254,240,138,0.72)', '#0f172a', ['#dc2626', '#fef3c7']);
      break;
    }

    case 'machupicchu': {
      // Close-up Intipunku Inca stone gateway walls framing left & right
      [BLEED_L, WORLD_W - 68].forEach((wx) => {
        ctx.fillStyle = '#57534e';
        ctx.fillRect(wx, GROUND_Y - 340, 124, 340);
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 2;
        for (let sy = GROUND_Y - 320; sy < GROUND_Y; sy += 28) {
          ctx.beginPath();
          ctx.moveTo(wx, sy);
          ctx.lineTo(wx + 124, sy);
          ctx.stroke();
          for (let sx = wx + ((sy / 28) % 2) * 18; sx < wx + 124; sx += 36) {
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx, sy + 28);
            ctx.stroke();
          }
        }
        // Trapezoidal Inca wall niche
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.moveTo(wx + 42, GROUND_Y - 150);
        ctx.lineTo(wx + 48, GROUND_Y - 196);
        ctx.lineTo(wx + 76, GROUND_Y - 196);
        ctx.lineTo(wx + 82, GROUND_Y - 150);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(wx, GROUND_Y - 344, 124, 7);
      });
      break;
    }

    case 'habana': {
      // Close-up Paseo del Prado / Malecón colonial arched portales
      drawStreetFacade(ctx, BLEED_L, 138, 390, '#fb7185', '#fffbeb', 'rgba(254,243,199,0.75)', '#1e293b');
      drawStreetFacade(ctx, WORLD_W - 82, 138, 380, '#2dd4bf', '#fffbeb', 'rgba(254,243,199,0.75)', '#1e293b');
      paintArchRow(ctx, BLEED_L + 14, GROUND_Y - 78, 3, 38, 26, 78, '#0f172a', '#fffbeb');
      paintArchRow(ctx, WORLD_W - 72, GROUND_Y - 78, 3, 38, 26, 78, '#0f172a', '#fffbeb');
      drawClassicLamp(ctx, 108, 102, '#0f172a', '#fde68a');
      break;
    }

    case 'vegas': {
      // Close-up glitzy Las Vegas Strip casino facades & neon marquees
      drawStreetFacade(ctx, BLEED_L, 136, 430, '#2e1065', '#fbbf24', 'rgba(253,224,71,0.6)', '#f43f5e', ['#be123c', '#fde047']);
      drawStreetFacade(ctx, WORLD_W - 80, 136, 420, '#3b0764', '#22d3ee', 'rgba(34,211,238,0.55)', '#fbbf24', ['#0284c7', '#fde047']);
      // Chasing golden casino crown marquees
      ctx.fillStyle = '#be123c';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.fillRect(72, 130, 34, 128);
      ctx.strokeRect(72, 130, 34, 128);
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#22d3ee';
      ctx.fillRect(854, 140, 34, 124);
      ctx.strokeRect(854, 140, 34, 124);
      break;
    }

    case 'nyc': {
      // Close-up Manhattan Midtown / Times Square buildings + Subway entrance + fire escapes
      drawStreetFacade(ctx, BLEED_L, 136, 450, '#292524', '#78716c', 'rgba(254,240,138,0.62)', '#0f172a', ['#15803d', '#ffffff']);
      drawStreetFacade(ctx, WORLD_W - 80, 136, 445, '#1e293b', '#64748b', 'rgba(254,240,138,0.58)', '#0f172a', ['#b91c1c', '#ffffff']);
      // Iconic NYC Subway green globe post & hydrant
      ctx.fillStyle = '#15803d';
      ctx.fillRect(98, GROUND_Y - 68, 6, 68);
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(101, GROUND_Y - 74, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(862, GROUND_Y - 26, 12, 26);
      ctx.fillRect(859, GROUND_Y - 20, 18, 5);
      break;
    }

    case 'madrid': {
      // Close-up Gran Vía / Alcalá stately cream-and-terracotta facades + Tapas awnings + Farolas
      drawStreetFacade(ctx, BLEED_L, 136, 395, '#c2410c', '#fef3c7', 'rgba(254,240,138,0.68)', '#1e293b', ['#991b1b', '#fbbf24']);
      drawStreetFacade(ctx, WORLD_W - 80, 136, 395, '#d97706', '#fef3c7', 'rgba(254,240,138,0.68)', '#1e293b', ['#991b1b', '#fbbf24']);
      drawClassicLamp(ctx, 108, 114, '#1e293b', '#fef08a');
      drawClassicLamp(ctx, 852, 114, '#1e293b', '#fef08a');
      break;
    }

    case 'london': {
      // Close-up Westminster brick/stone townhouses + iconic Red K6 Telephone Box + Victorian gaslamps
      drawStreetFacade(ctx, BLEED_L, 132, 405, '#573b2c', '#d6d3d1', 'rgba(254,240,138,0.62)', '#0f172a');
      drawStreetFacade(ctx, WORLD_W - 76, 132, 395, '#475569', '#cbd5e1', 'rgba(254,240,138,0.62)', '#0f172a');
      // Iconic Red London Telephone Box (K6)
      const kx = 88;
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(kx, GROUND_Y - 76, 30, 76, [6, 6, 0, 0]);
      ctx.fill();
      ctx.fillStyle = 'rgba(254, 249, 195, 0.72)';
      for (let gy = GROUND_Y - 62; gy < GROUND_Y - 12; gy += 14) {
        ctx.fillRect(kx + 5, gy, 8, 10);
        ctx.fillRect(kx + 17, gy, 8, 10);
      }
      drawClassicLamp(ctx, 858, 116, '#0f172a', '#fef08a');
      break;
    }

    case 'rome': {
      // Close-up Corinthian marble temple colonnade (left) & Roman terracotta palazzo (right)
      [18, 68].forEach((cx) => {
        ctx.fillStyle = '#e7e5e4';
        ctx.fillRect(cx - 12, GROUND_Y - 375, 24, 360);
        ctx.fillStyle = '#d6d3d1';
        ctx.fillRect(cx - 18, GROUND_Y - 16, 36, 16);
        ctx.fillRect(cx - 18, GROUND_Y - 388, 36, 14);
      });
      ctx.fillStyle = '#d6d3d1';
      ctx.fillRect(BLEED_L, GROUND_Y - 412, 112, 24);
      drawStreetFacade(ctx, WORLD_W - 80, 136, 385, '#c26d2d', '#fde68a', 'rgba(254,240,138,0.65)', '#1c1917', ['#15803d', '#fef3c7']);
      break;
    }

    case 'moscow': {
      // Close-up Red Square illuminated GUM Arcade facade (right) & Kremlin brick gatehouse (left)
      drawStreetFacade(ctx, BLEED_L, 130, 385, '#7f1d1d', '#fde68a', 'rgba(254,240,138,0.68)', null);
      drawStreetFacade(ctx, WORLD_W - 82, 138, 390, '#f5e6d3', '#fde047', 'rgba(254,240,138,0.82)', '#92400e');
      // Fairy-light outline on GUM facade
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.strokeRect(WORLD_W - 80, GROUND_Y - 388, 134, 386);
      drawClassicLamp(ctx, 98, 112, '#0f172a', '#fef08a');
      drawClassicLamp(ctx, 858, 112, '#0f172a', '#fef08a');
      break;
    }

    case 'delhi': {
      // Close-up Mughal Red Sandstone Great Gate (Darwaza) arches framing Taj Mahal!
      [BLEED_L, WORLD_W - 76].forEach((gx) => {
        ctx.fillStyle = '#7c2d12';
        ctx.fillRect(gx, GROUND_Y - 405, 132, 405);
        ctx.strokeStyle = '#fffbeb';
        ctx.lineWidth = 3;
        ctx.strokeRect(gx + 10, GROUND_Y - 392, 112, 386);
        paintArchRow(ctx, gx + 24, GROUND_Y - 260, 2, 44, 32, 90, '#431407', '#fde68a');
        paintArchRow(ctx, gx + 24, GROUND_Y - 130, 2, 44, 32, 126, '#290d05', '#fde68a');
        // White marble chhatri dome on top
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.arc(gx + 66, GROUND_Y - 405, 28, Math.PI, 0);
        ctx.fill();
      });
      break;
    }

    case 'bangkok': {
      // Close-up Thai Royal Pavilion pillars & gilded tiered roofs on riverfront
      [BLEED_L + 4, WORLD_W - 78].forEach((px) => {
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(px + 14, GROUND_Y - 350, 20, 350);
        ctx.fillRect(px + 72, GROUND_Y - 350, 20, 350);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(px + 14, GROUND_Y - 350, 20, 14);
        ctx.fillRect(px + 72, GROUND_Y - 350, 20, 14);
        // Sweeping golden chofah roof
        ctx.beginPath();
        ctx.moveTo(px - 12, GROUND_Y - 344);
        ctx.quadraticCurveTo(px + 52, GROUND_Y - 405, px + 116, GROUND_Y - 344);
        ctx.closePath();
        ctx.fill();
      });
      break;
    }

    case 'beijing': {
      // Close-up Forbidden City vermilion courtyard galleries + white marble Huabiao dragon pillar
      [BLEED_L, WORLD_W - 78].forEach((px) => {
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(px, GROUND_Y - 365, 134, 365);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(px, GROUND_Y - 365, 134, 14);
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(px - 16, GROUND_Y - 360);
        ctx.quadraticCurveTo(px + 67, GROUND_Y - 412, px + 150, GROUND_Y - 360);
        ctx.closePath();
        ctx.fill();
        paintArchRow(ctx, px + 18, GROUND_Y - 120, 2, 50, 36, 120, '#450a0a', '#fbbf24');
      });
      // White marble Huabiao ceremonial column
      ctx.fillStyle = '#f5f5f4';
      ctx.fillRect(98, GROUND_Y - 195, 14, 195);
      ctx.fillRect(90, GROUND_Y - 190, 30, 6);
      break;
    }

    case 'sydney': {
      // Close-up Circular Quay waterfront terminal & Rocks sandstone pub
      drawStreetFacade(ctx, BLEED_L, 126, 350, '#b45309', '#fef3c7', 'rgba(224,242,254,0.68)', '#1e293b', ['#0369a1', '#ffffff']);
      drawStreetFacade(ctx, WORLD_W - 70, 126, 365, '#1e293b', '#38bdf8', 'rgba(186,230,253,0.62)', null);
      // Waterfront promenade railing
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(76, GROUND_Y - 22);
      ctx.lineTo(WORLD_W - 76, GROUND_Y - 22);
      ctx.stroke();
      break;
    }

    case 'honolulu': {
      // Close-up Coral-Pink Royal Hawaiian Resort wing & Waikiki surfboard rack + Tiki totems
      drawStreetFacade(ctx, BLEED_L, 124, 335, '#f472b6', '#fff1f2', 'rgba(254,249,195,0.72)', '#831843', ['#db2777', '#fff1f2']);
      // Colorful upright Waikiki surfboards on right beach stand
      [
        [858, '#fde047'],
        [876, '#22d3ee'],
        [894, '#fb7185']
      ].forEach(([sx, col]) => {
        ctx.fillStyle = col as string;
        ctx.beginPath();
        ctx.ellipse(sx as number, GROUND_Y - 48, 7, 46, 0.08, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'moon': {
      // Close-up Lunar Outpost pressurized habitat domes & gantry struts
      ctx.fillStyle = '#334155';
      ctx.fillRect(BLEED_L, GROUND_Y - 340, 96, 340);
      ctx.fillRect(WORLD_W - 40, GROUND_Y - 340, 96, 340);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(BLEED_L + 8, GROUND_Y - 330, 80, 320);
      ctx.strokeRect(WORLD_W - 32, GROUND_Y - 330, 80, 320);
      // Glowing cyan habitat viewport windows
      for (let wy = GROUND_Y - 290; wy < GROUND_Y - 40; wy += 64) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.fillRect(14, wy, 28, 34);
        ctx.fillRect(WORLD_W - 26, wy, 28, 34);
      }
      break;
    }

    case 'mars':
    default: {
      // Close-up Olympus Citadel obsidian pylons & glowing Prisma conduits
      [BLEED_L, WORLD_W - 60].forEach((px) => {
        ctx.fillStyle = '#27090d';
        ctx.fillRect(px, GROUND_Y - 395, 116, 395);
        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(px + 8, GROUND_Y - 385, 100, 380);
        // Glowing Prisma vertical energy core conduit
        const cg = ctx.createLinearGradient(0, GROUND_Y - 360, 0, GROUND_Y);
        cg.addColorStop(0, '#e879f9');
        cg.addColorStop(0.5, '#f43f5e');
        cg.addColorStop(1, '#fb923c');
        ctx.fillStyle = cg;
        ctx.fillRect(px + 50, GROUND_Y - 360, 14, 345);
      });
      void rand;
      break;
    }
  }
}

/** Sonic Wings-style high-speed vertical/angled aerial cloud & wind-streak rush during Boss Battles */
export function drawSonicWingsSkyRush(
  ctx: CanvasRenderingContext2D,
  bgTime: number,
  phase: number
): void {
  ctx.save();
  const speed = 420 + phase * 140;
  ctx.strokeStyle = phase >= 2 ? 'rgba(244, 114, 182, 0.24)' : 'rgba(224, 242, 254, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 22; i++) {
    const x = ((i * 97.3) % (WORLD_W - 40)) + 20;
    const len = 42 + (i % 4) * 24;
    const y = ((bgTime * speed + i * 83) % (GROUND_Y + len)) - len;
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + len);
  }
  ctx.stroke();

  // Fast translucent cloud puffs rushing downward like an arcade vertical shooter
  ctx.fillStyle = 'rgba(255, 255, 255, 0.065)';
  for (let c = 0; c < 5; c++) {
    const cx = 110 + c * 185;
    const cy = ((bgTime * (155 + c * 22) + c * 140) % (GROUND_Y + 140)) - 70;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 86, 26, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
