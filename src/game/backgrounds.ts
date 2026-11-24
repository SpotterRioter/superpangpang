import {
  CEILING_Y,
  FLOOR_H,
  GROUND_Y,
  LEFT_WALL,
  RIGHT_WALL,
  WALL_THICKNESS,
  WORLD_H,
  WORLD_W
} from './levels';
import { ThemeId } from './types';
import {
  BLEED_L,
  BLEED_R,
  BLEED_W,
  DUST_PARTICLES,
  PARALLAX_PAD,
  PETALS,
  RAIN_DROPS,
  SHOOTING_STAR,
  SKY_LANTERNS,
  SNOW_FLAKES,
  drawBird,
  drawSwayingPalm,
  drawTwinklingStars,
  drawWaterShimmer,
  fillSky,
  mulberry32,
  paintArchRow,
  paintCloudBank,
  paintDistantSkylineBand,
  paintFoliageCluster,
  paintHazeBand,
  paintLiveAtmosphericFinish,
  paintNebulaWash,
  paintSculptedMountain,
  paintSkyscraper,
  paintSunWithBloom
} from './bgHelpers';

interface ParallaxBundle {
  sky: HTMLCanvasElement;
  far: HTMLCanvasElement;
  mid: HTMLCanvasElement;
}

const parallaxCache = new Map<ThemeId, ParallaxBundle>();
const MAX_CACHED_THEMES = 6;

function createOffscreenLayer(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = BLEED_W;
  c.height = GROUND_Y;
  const ctx = c.getContext('2d')!;
  ctx.translate(PARALLAX_PAD, 0);
  return [c, ctx];
}

function getOrRenderParallaxLayers(theme: ThemeId): ParallaxBundle {
  const existing = parallaxCache.get(theme);
  if (existing) {
    // Refresh LRU order
    parallaxCache.delete(theme);
    parallaxCache.set(theme, existing);
    return existing;
  }

  const [sky, skyCtx] = createOffscreenLayer();
  const [far, farCtx] = createOffscreenLayer();
  const [mid, midCtx] = createOffscreenLayer();

  renderParallaxPlanes(skyCtx, farCtx, midCtx, theme);

  const bundle = { sky, far, mid };
  parallaxCache.set(theme, bundle);
  if (parallaxCache.size > MAX_CACHED_THEMES) {
    const oldest = parallaxCache.keys().next().value;
    if (oldest) parallaxCache.delete(oldest);
  }
  return bundle;
}

// =========================================================================
// PART 1: 3-PLANE PAINTERLY PARALLAX BACKDROP (SKY / FAR / MID)
// =========================================================================
function renderParallaxPlanes(
  skyCtx: CanvasRenderingContext2D,
  farCtx: CanvasRenderingContext2D,
  midCtx: CanvasRenderingContext2D,
  theme: ThemeId
): void {
  const rand = mulberry32(theme.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 11));

  switch (theme) {
    case 'fuji': {
      // SKY: Sunset gradient + radiant sun + nebula glow
      fillSky(skyCtx, [
        [0, '#190836'],
        [0.3, '#6d174c'],
        [0.62, '#ea580c'],
        [0.86, '#fbbf24'],
        [1, '#fef08a']
      ]);
      paintSunWithBloom(skyCtx, 480, 228, 84, '#fffbeb', '#fb7185', 'rgba(253, 224, 71, 0.46)', true);

      // FAR: Clouds + Hakone ridges + Mount Fuji
      paintCloudBank(farCtx, 175, 114, 0.94, '#fed7aa', '#fb923c', '#7c2d12');
      paintCloudBank(farCtx, 795, 102, 0.86, '#fde68a', '#f472b6', '#581c87');
      paintSculptedMountain(farCtx, -70, 155, 370, 275, GROUND_Y - 70, '#3b1c5a', '#220e3a');
      paintSculptedMountain(farCtx, 600, 805, 1030, 282, GROUND_Y - 70, '#3b1c5a', '#220e3a');
      paintHazeBand(farCtx, 260, 390, 'rgba(251, 146, 60, 0.24)');

      // Iconic sculpted Mount Fuji with volcanic gullies
      farCtx.fillStyle = '#251748';
      farCtx.beginPath();
      farCtx.moveTo(135, GROUND_Y - 70);
      farCtx.quadraticCurveTo(342, 290, 434, 168);
      farCtx.lineTo(526, 168);
      farCtx.quadraticCurveTo(618, 290, 825, GROUND_Y - 70);
      farCtx.closePath();
      farCtx.fill();

      // Sunlit western slope blush
      farCtx.fillStyle = 'rgba(219, 82, 128, 0.34)';
      farCtx.beginPath();
      farCtx.moveTo(135, GROUND_Y - 70);
      farCtx.quadraticCurveTo(342, 290, 434, 168);
      farCtx.lineTo(482, 168);
      farCtx.lineTo(448, GROUND_Y - 70);
      farCtx.closePath();
      farCtx.fill();

      // Volcanic snow cap with deep gullies
      farCtx.fillStyle = '#fff7ed';
      farCtx.beginPath();
      farCtx.moveTo(434, 168);
      farCtx.lineTo(526, 168);
      farCtx.lineTo(600, 258);
      farCtx.lineTo(554, 240);
      farCtx.lineTo(524, 272);
      farCtx.lineTo(482, 242);
      farCtx.lineTo(446, 274);
      farCtx.lineTo(410, 242);
      farCtx.lineTo(362, 260);
      farCtx.closePath();
      farCtx.fill();

      // MID: Kawaguchiko Lake + mirror reflection + Chureito Pagoda + Torii + Stone Lanterns
      const lakeG = midCtx.createLinearGradient(0, GROUND_Y - 78, 0, GROUND_Y);
      lakeG.addColorStop(0, '#4c1d57');
      lakeG.addColorStop(0.5, '#2b1647');
      lakeG.addColorStop(1, '#130b28');
      midCtx.fillStyle = lakeG;
      midCtx.fillRect(BLEED_L, GROUND_Y - 78, BLEED_W, 78);

      // Inverted Fuji reflection in calm lake
      midCtx.fillStyle = 'rgba(255, 241, 214, 0.14)';
      midCtx.beginPath();
      midCtx.moveTo(310, GROUND_Y - 78);
      midCtx.lineTo(650, GROUND_Y - 78);
      midCtx.lineTo(516, GROUND_Y - 8);
      midCtx.lineTo(444, GROUND_Y - 8);
      midCtx.closePath();
      midCtx.fill();

      midCtx.fillStyle = '#1b1130';
      midCtx.fillRect(BLEED_L, GROUND_Y - 82, BLEED_W, 7);

      // Traditional Japanese Toro stone lanterns on shore
      [252, 692].forEach((lx) => {
        midCtx.fillStyle = '#64748b';
        midCtx.fillRect(lx - 8, GROUND_Y - 88, 16, 6);
        midCtx.fillRect(lx - 4, GROUND_Y - 106, 8, 18);
        midCtx.fillStyle = '#fde68a';
        midCtx.fillRect(lx - 5, GROUND_Y - 114, 10, 8);
        midCtx.fillStyle = '#475569';
        midCtx.beginPath();
        midCtx.moveTo(lx - 11, GROUND_Y - 114);
        midCtx.lineTo(lx, GROUND_Y - 122);
        midCtx.lineTo(lx + 11, GROUND_Y - 114);
        midCtx.closePath();
        midCtx.fill();
      });

      // Chureito 5-story Pagoda (right)
      const px = 816;
      midCtx.fillStyle = '#5c1420';
      midCtx.fillRect(px - 26, GROUND_Y - 198, 52, 198);
      for (let f = 0; f < 5; f++) {
        const py = GROUND_Y - 38 - f * 35;
        const pw = 98 - f * 10;
        midCtx.fillStyle = '#7f1d1d';
        midCtx.fillRect(px - pw * 0.34, py, pw * 0.68, 24);
        midCtx.fillStyle = '#fde68a';
        midCtx.fillRect(px - 10, py + 6, 8, 12);
        midCtx.fillRect(px + 2, py + 6, 8, 12);
        midCtx.fillStyle = '#1e1b2e';
        midCtx.beginPath();
        midCtx.moveTo(px - pw * 0.64, py + 5);
        midCtx.quadraticCurveTo(px, py - 15, px + pw * 0.64, py + 5);
        midCtx.lineTo(px + pw * 0.45, py + 10);
        midCtx.lineTo(px - pw * 0.45, py + 10);
        midCtx.closePath();
        midCtx.fill();
        midCtx.strokeStyle = '#fbbf24';
        midCtx.lineWidth = 1.2;
        midCtx.stroke();
      }
      midCtx.fillStyle = '#fbbf24';
      midCtx.fillRect(px - 2, GROUND_Y - 234, 4, 34);
      midCtx.beginPath();
      midCtx.arc(px, GROUND_Y - 234, 4.5, 0, Math.PI * 2);
      midCtx.fill();

      // Vermilion Torii Gate (left)
      const tx = 136;
      midCtx.fillStyle = '#991b1b';
      midCtx.fillRect(tx - 34, GROUND_Y - 112, 11, 112);
      midCtx.fillRect(tx + 23, GROUND_Y - 112, 11, 112);
      midCtx.fillStyle = '#dc2626';
      midCtx.fillRect(tx - 54, GROUND_Y - 114, 108, 10);
      midCtx.fillStyle = '#18181b';
      midCtx.beginPath();
      midCtx.moveTo(tx - 62, GROUND_Y - 118);
      midCtx.quadraticCurveTo(tx, GROUND_Y - 110, tx + 62, GROUND_Y - 118);
      midCtx.lineTo(tx + 54, GROUND_Y - 112);
      midCtx.lineTo(tx - 54, GROUND_Y - 112);
      midCtx.closePath();
      midCtx.fill();
      midCtx.fillStyle = '#dc2626';
      midCtx.fillRect(tx - 42, GROUND_Y - 92, 84, 7);
      midCtx.fillStyle = '#fbbf24';
      midCtx.fillRect(tx - 6, GROUND_Y - 108, 12, 18);

      // Corner Sakura canopy
      paintFoliageCluster(midCtx, 42, 56, 76, '#831843', '#db2777', '#fbcfe8', rand);
      paintFoliageCluster(midCtx, 128, 32, 56, '#9d174d', '#f472b6', '#fce7f3', rand);
      paintFoliageCluster(midCtx, 916, 48, 72, '#831843', '#db2777', '#fbcfe8', rand);
      break;
    }

    case 'pyramids': {
      fillSky(skyCtx, [
        [0, '#172554'],
        [0.28, '#9a3412'],
        [0.64, '#d97706'],
        [0.88, '#fbbf24'],
        [1, '#fef3c7']
      ]);
      paintSunWithBloom(skyCtx, 768, 114, 48, '#fffbeb', '#fde047', 'rgba(253, 224, 71, 0.46)', true);

      // FAR: Clouds + rolling Sahara erg dunes + distant step pyramid
      paintCloudBank(farCtx, 245, 94, 0.92, '#fef3c7', '#fdba74', '#b45309');
      paintSculptedMountain(farCtx, 40, 110, 180, GROUND_Y - 128, GROUND_Y - 76, '#d97706', '#92400e');
      farCtx.fillStyle = '#c26d2d';
      farCtx.beginPath();
      farCtx.moveTo(BLEED_L, GROUND_Y - 82);
      farCtx.quadraticCurveTo(220, GROUND_Y - 138, 480, GROUND_Y - 76);
      farCtx.quadraticCurveTo(730, GROUND_Y - 120, BLEED_R, GROUND_Y - 74);
      farCtx.lineTo(BLEED_R, GROUND_Y);
      farCtx.lineTo(BLEED_L, GROUND_Y);
      farCtx.fill();

      // MID: Nile oasis, felucca sail, Giza Pyramids, Obelisk & Great Sphinx
      midCtx.fillStyle = '#0369a1';
      midCtx.fillRect(BLEED_L, GROUND_Y - 68, 225, 11);
      // White triangular Nile felucca sail
      midCtx.fillStyle = '#fffbeb';
      midCtx.beginPath();
      midCtx.moveTo(148, GROUND_Y - 68);
      midCtx.lineTo(156, GROUND_Y - 98);
      midCtx.lineTo(168, GROUND_Y - 68);
      midCtx.closePath();
      midCtx.fill();
      paintFoliageCluster(midCtx, 58, GROUND_Y - 86, 30, '#14532d', '#15803d', '#4ade80', rand);
      paintFoliageCluster(midCtx, 114, GROUND_Y - 82, 24, '#14532d', '#16a34a', '#86efac', rand);

      const drawPyramid = (cx: number, bw: number, h: number, apexCap = false) => {
        const apexY = GROUND_Y - h;
        const ridgeX = cx + bw * 0.1;
        const lg = midCtx.createLinearGradient(cx - bw / 2, apexY, ridgeX, GROUND_Y);
        lg.addColorStop(0, '#fef08a');
        lg.addColorStop(0.5, '#eab308');
        lg.addColorStop(1, '#b45309');
        midCtx.fillStyle = lg;
        midCtx.beginPath();
        midCtx.moveTo(cx, apexY);
        midCtx.lineTo(cx - bw / 2, GROUND_Y);
        midCtx.lineTo(ridgeX, GROUND_Y);
        midCtx.closePath();
        midCtx.fill();

        const sg = midCtx.createLinearGradient(cx, apexY, cx + bw / 2, GROUND_Y);
        sg.addColorStop(0, '#92400e');
        sg.addColorStop(1, '#451a03');
        midCtx.fillStyle = sg;
        midCtx.beginPath();
        midCtx.moveTo(cx, apexY);
        midCtx.lineTo(ridgeX, GROUND_Y);
        midCtx.lineTo(cx + bw / 2, GROUND_Y);
        midCtx.closePath();
        midCtx.fill();

        if (apexCap) {
          midCtx.fillStyle = '#fffbeb';
          midCtx.beginPath();
          midCtx.moveTo(cx, apexY);
          midCtx.lineTo(cx - bw * 0.09, apexY + h * 0.18);
          midCtx.lineTo(cx + bw * 0.09, apexY + h * 0.18);
          midCtx.closePath();
          midCtx.fill();
        }

        midCtx.strokeStyle = 'rgba(69, 26, 3, 0.24)';
        midCtx.lineWidth = 1;
        for (let row = 1; row < 13; row++) {
          const frac = row / 13;
          const ry = apexY + h * frac;
          midCtx.beginPath();
          midCtx.moveTo(cx - (bw / 2) * frac, ry);
          midCtx.lineTo(cx + (bw / 2) * frac, ry);
          midCtx.stroke();
        }
      };

      drawPyramid(205, 250, 172, false);
      drawPyramid(468, 366, 244, true);
      drawPyramid(695, 214, 144, false);

      // Carved Luxor granite Obelisk on left-midground
      midCtx.fillStyle = '#fcd34d';
      midCtx.beginPath();
      midCtx.moveTo(318, GROUND_Y - 18);
      midCtx.lineTo(321, GROUND_Y - 118);
      midCtx.lineTo(325, GROUND_Y - 130);
      midCtx.lineTo(329, GROUND_Y - 118);
      midCtx.lineTo(332, GROUND_Y - 18);
      midCtx.closePath();
      midCtx.fill();

      // Great Sphinx of Giza
      midCtx.fillStyle = '#92400e';
      midCtx.beginPath();
      midCtx.roundRect(752, GROUND_Y - 48, 136, 48, [12, 18, 0, 0]);
      midCtx.fill();
      midCtx.fillStyle = '#b45309';
      midCtx.fillRect(720, GROUND_Y - 18, 58, 18);
      midCtx.fillStyle = '#a16207';
      midCtx.beginPath();
      midCtx.moveTo(758, GROUND_Y - 46);
      midCtx.lineTo(768, GROUND_Y - 84);
      midCtx.lineTo(804, GROUND_Y - 84);
      midCtx.lineTo(816, GROUND_Y - 46);
      midCtx.closePath();
      midCtx.fill();
      midCtx.fillStyle = '#d97706';
      midCtx.beginPath();
      midCtx.ellipse(786, GROUND_Y - 65, 13, 15, 0, 0, Math.PI * 2);
      midCtx.fill();

      const dg = midCtx.createLinearGradient(0, GROUND_Y - 26, 0, GROUND_Y);
      dg.addColorStop(0, '#d97706');
      dg.addColorStop(1, '#78350f');
      midCtx.fillStyle = dg;
      midCtx.beginPath();
      midCtx.moveTo(BLEED_L, GROUND_Y - 14);
      midCtx.quadraticCurveTo(260, GROUND_Y - 30, 520, GROUND_Y - 16);
      midCtx.quadraticCurveTo(760, GROUND_Y - 28, BLEED_R, GROUND_Y - 12);
      midCtx.lineTo(BLEED_R, GROUND_Y);
      midCtx.lineTo(BLEED_L, GROUND_Y);
      midCtx.fill();
      break;
    }

    case 'neon': {
      fillSky(skyCtx, [
        [0, '#03010a'],
        [0.42, '#150533'],
        [0.78, '#4a116b'],
        [1, '#be185d']
      ]);
      paintNebulaWash(skyCtx, 480, 150, 320, 140, -0.1, 'rgba(236, 72, 153, 0.22)', 'rgba(56, 189, 248, 0.08)');

      // Sliced synthwave retro sun
      skyCtx.save();
      skyCtx.beginPath();
      skyCtx.arc(480, 176, 84, 0, Math.PI * 2);
      skyCtx.clip();
      const mg = skyCtx.createLinearGradient(0, 92, 0, 260);
      mg.addColorStop(0, '#fef08a');
      mg.addColorStop(0.5, '#fb7185');
      mg.addColorStop(1, '#c026d3');
      skyCtx.fillStyle = mg;
      skyCtx.fillRect(390, 90, 180, 180);
      skyCtx.fillStyle = '#150533';
      for (let sy = 184; sy < 260; sy += 11) {
        skyCtx.fillRect(390, sy, 180, (sy - 176) * 0.08 + 2);
      }
      skyCtx.restore();

      // FAR: Dense Shinjuku megacity horizon + Tokyo Tower
      paintDistantSkylineBand(farCtx, GROUND_Y, 125, 255, '#1b0936', 'rgba(244, 114, 182, 0.28)', rand);
      farCtx.strokeStyle = '#fb923c';
      farCtx.lineWidth = 3.2;
      farCtx.beginPath();
      farCtx.moveTo(436, GROUND_Y - 32);
      farCtx.quadraticCurveTo(472, GROUND_Y - 165, 477, GROUND_Y - 302);
      farCtx.lineTo(483, GROUND_Y - 302);
      farCtx.quadraticCurveTo(488, GROUND_Y - 165, 524, GROUND_Y - 32);
      farCtx.stroke();
      farCtx.fillStyle = '#fef08a';
      farCtx.fillRect(462, GROUND_Y - 168, 36, 10);
      farCtx.fillRect(470, GROUND_Y - 234, 20, 8);
      farCtx.fillRect(479, GROUND_Y - 340, 2.5, 38);

      // MID: Foreground Neo-Tokyo cyber-towers + Hologram billboards + Monorail viaduct
      const blds: [number, number, number, string][] = [
        [-18, 46, 210, '#a855f7'],
        [24, 82, 242, '#22d3ee'],
        [112, 92, 312, '#f43f5e'],
        [210, 76, 214, '#a855f7'],
        [292, 84, 266, '#22d3ee'],
        [585, 86, 276, '#f43f5e'],
        [678, 76, 218, '#fde047'],
        [760, 94, 316, '#22d3ee'],
        [860, 82, 246, '#f43f5e'],
        [948, 48, 205, '#22d3ee']
      ];
      for (const [bx, bw, bh, accent] of blds) {
        paintSkyscraper(midCtx, bx, bw, bh, '#0b041c', '#04010c', `${accent}66`, accent, rand);
      }

      // Glowing rooftop cyber-billboards
      midCtx.fillStyle = 'rgba(34, 211, 238, 0.22)';
      midCtx.strokeStyle = '#22d3ee';
      midCtx.lineWidth = 1.5;
      midCtx.fillRect(122, GROUND_Y - 342, 68, 24);
      midCtx.strokeRect(122, GROUND_Y - 342, 68, 24);
      midCtx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      midCtx.strokeStyle = '#f43f5e';
      midCtx.fillRect(772, GROUND_Y - 346, 72, 24);
      midCtx.strokeRect(772, GROUND_Y - 346, 72, 24);

      // Monorail guideway bridge
      midCtx.fillStyle = '#1e1b4b';
      midCtx.fillRect(BLEED_L, GROUND_Y - 62, BLEED_W, 12);
      midCtx.fillStyle = '#22d3ee';
      midCtx.fillRect(BLEED_L, GROUND_Y - 62, BLEED_W, 2.2);
      for (let px = 40; px < BLEED_R; px += 140) {
        midCtx.fillStyle = '#0f172a';
        midCtx.fillRect(px, GROUND_Y - 50, 14, 50);
      }

      const wg = midCtx.createLinearGradient(0, GROUND_Y - 28, 0, GROUND_Y);
      wg.addColorStop(0, 'rgba(244, 63, 94, 0.26)');
      wg.addColorStop(1, 'rgba(34, 211, 238, 0.34)');
      midCtx.fillStyle = wg;
      midCtx.fillRect(BLEED_L, GROUND_Y - 28, BLEED_W, 28);
      break;
    }

    case 'alps': {
      fillSky(skyCtx, [
        [0, '#020617'],
        [0.45, '#0b1b3a'],
        [0.8, '#17345e'],
        [1, '#28527a']
      ]);

      // FAR: Alpine range + Hero Matterhorn peak
      paintSculptedMountain(farCtx, -80, 120, 350, 218, GROUND_Y, '#1e3a5f', '#0f213d', '#e0f2fe', 0.34);
      paintSculptedMountain(farCtx, 575, 815, 1060, 182, GROUND_Y, '#1e3a5f', '#0f213d', '#e0f2fe', 0.36);
      paintSculptedMountain(farCtx, 210, 468, 742, 124, GROUND_Y, '#2b4c7e', '#112240', '#f8fafc', 0.42);
      paintHazeBand(farCtx, 295, 420, 'rgba(186, 230, 253, 0.18)');

      // MID: Snowy valley, pine forest, village steeple, Landwasser viaduct & chalets
      midCtx.fillStyle = '#cbd5e1';
      midCtx.beginPath();
      midCtx.moveTo(BLEED_L, GROUND_Y - 78);
      midCtx.quadraticCurveTo(260, GROUND_Y - 122, 520, GROUND_Y - 68);
      midCtx.quadraticCurveTo(750, GROUND_Y - 110, BLEED_R, GROUND_Y - 64);
      midCtx.lineTo(BLEED_R, GROUND_Y);
      midCtx.lineTo(BLEED_L, GROUND_Y);
      midCtx.fill();

      // Distant Swiss village church spire
      midCtx.fillStyle = '#e2e8f0';
      midCtx.fillRect(218, GROUND_Y - 122, 18, 36);
      midCtx.fillStyle = '#dc2626';
      midCtx.beginPath();
      midCtx.moveTo(216, GROUND_Y - 122);
      midCtx.lineTo(227, GROUND_Y - 152);
      midCtx.lineTo(238, GROUND_Y - 122);
      midCtx.closePath();
      midCtx.fill();

      for (let i = 0; i < 28; i++) {
        const tx = -20 + i * 36 + rand() * 14;
        const ty = GROUND_Y - 35 - rand() * 48;
        const th = 26 + rand() * 24;
        midCtx.fillStyle = '#0f2942';
        midCtx.beginPath();
        midCtx.moveTo(tx, ty - th);
        midCtx.lineTo(tx - 11, ty);
        midCtx.lineTo(tx + 11, ty);
        midCtx.closePath();
        midCtx.fill();
        midCtx.fillStyle = '#e0f2fe';
        midCtx.beginPath();
        midCtx.moveTo(tx, ty - th);
        midCtx.lineTo(tx - 5, ty - th * 0.55);
        midCtx.lineTo(tx + 5, ty - th * 0.55);
        midCtx.closePath();
        midCtx.fill();
      }

      // Stone alpine viaduct bridge
      midCtx.fillStyle = '#475569';
      midCtx.fillRect(276, GROUND_Y - 98, 408, 14);
      for (let a = 0; a < 5; a++) {
        const ax = 294 + a * 76;
        midCtx.fillStyle = '#334155';
        midCtx.fillRect(ax, GROUND_Y - 84, 16, 84);
        midCtx.strokeStyle = '#64748b';
        midCtx.lineWidth = 4;
        midCtx.beginPath();
        midCtx.arc(ax + 46, GROUND_Y - 64, 30, Math.PI, 0);
        midCtx.stroke();
      }

      const drawChalet = (cx: number, cw: number, ch: number) => {
        midCtx.fillStyle = '#451a03';
        midCtx.fillRect(cx, GROUND_Y - ch, cw, ch);
        midCtx.fillStyle = '#78350f';
        midCtx.fillRect(cx + 4, GROUND_Y - ch + 6, cw - 8, 12);
        midCtx.fillStyle = '#f8fafc';
        midCtx.beginPath();
        midCtx.moveTo(cx - 14, GROUND_Y - ch + 4);
        midCtx.lineTo(cx + cw / 2, GROUND_Y - ch - 32);
        midCtx.lineTo(cx + cw + 14, GROUND_Y - ch + 4);
        midCtx.closePath();
        midCtx.fill();
        midCtx.fillStyle = '#fde047';
        midCtx.fillRect(cx + 14, GROUND_Y - ch + 22, 16, 15);
        midCtx.fillRect(cx + cw - 30, GROUND_Y - ch + 22, 16, 15);
      };
      drawChalet(92, 84, 58);
      drawChalet(774, 82, 54);
      break;
    }

    case 'caribbean': {
      fillSky(skyCtx, [
        [0, '#2e1065'],
        [0.34, '#db2777'],
        [0.66, '#f97316'],
        [0.9, '#fde047'],
        [1, '#fef9c3']
      ]);
      paintSunWithBloom(skyCtx, 480, 266, 68, '#fffbeb', '#fb923c', 'rgba(253, 224, 71, 0.46)', true);

      // FAR: Clouds + volcanic islands + distant tall schooner silhouette
      paintCloudBank(farCtx, 205, 122, 1.0, '#fef08a', '#f472b6', '#701a75');
      paintCloudBank(farCtx, 765, 108, 0.9, '#fef08a', '#fb923c', '#831843');
      paintSculptedMountain(farCtx, 535, 640, 745, 250, GROUND_Y - 140, '#6b21a8', '#3b0764');
      paintSculptedMountain(farCtx, 115, 215, 315, 282, GROUND_Y - 140, '#7e22ce', '#4c1d95');

      // MID: Turquoise reef lagoon, pier, beach cabana & golden sand
      const sea = midCtx.createLinearGradient(0, GROUND_Y - 142, 0, GROUND_Y - 26);
      sea.addColorStop(0, '#0369a1');
      sea.addColorStop(0.45, '#0891b2');
      sea.addColorStop(1, '#2dd4bf');
      midCtx.fillStyle = sea;
      midCtx.fillRect(BLEED_L, GROUND_Y - 142, BLEED_W, 118);

      // Wooden tropical pier + tiki lantern
      midCtx.fillStyle = '#451a03';
      for (let px = 670; px <= 860; px += 32) {
        midCtx.fillRect(px, GROUND_Y - 102, 7, 52);
      }
      midCtx.fillStyle = '#78350f';
      midCtx.fillRect(656, GROUND_Y - 106, 215, 9);
      // Thatched tiki hut roof on pier end
      midCtx.fillStyle = '#b45309';
      midCtx.beginPath();
      midCtx.moveTo(650, GROUND_Y - 132);
      midCtx.lineTo(682, GROUND_Y - 154);
      midCtx.lineTo(714, GROUND_Y - 132);
      midCtx.closePath();
      midCtx.fill();
      midCtx.fillRect(664, GROUND_Y - 132, 5, 26);
      midCtx.fillRect(695, GROUND_Y - 132, 5, 26);
      midCtx.fillStyle = '#fbbf24';
      midCtx.beginPath();
      midCtx.arc(682, GROUND_Y - 126, 4.5, 0, Math.PI * 2);
      midCtx.fill();

      const sand = midCtx.createLinearGradient(0, GROUND_Y - 30, 0, GROUND_Y);
      sand.addColorStop(0, '#fde68a');
      sand.addColorStop(1, '#d97706');
      midCtx.fillStyle = sand;
      midCtx.fillRect(BLEED_L, GROUND_Y - 28, BLEED_W, 28);
      break;
    }

    case 'temple': {
      fillSky(skyCtx, [
        [0, '#1a0705'],
        [0.35, '#581c87'],
        [0.7, '#b45309'],
        [0.92, '#f59e0b'],
        [1, '#fef08a']
      ]);
      paintSunWithBloom(skyCtx, 480, 194, 72, '#fffbeb', '#f59e0b', 'rgba(251, 191, 36, 0.38)', true);

      // FAR: Clouds + misty karst jungle mountains
      paintCloudBank(farCtx, 180, 108, 0.86, '#fde68a', '#d97706', '#4c1d95');
      paintCloudBank(farCtx, 790, 114, 0.82, '#fde68a', '#c2410c', '#3b0764');
      paintSculptedMountain(farCtx, -30, 165, 340, 240, GROUND_Y, '#3b1548', '#220b2c');
      paintSculptedMountain(farCtx, 620, 810, 990, 232, GROUND_Y, '#3b1548', '#220b2c');

      // MID: Jungle canopy, 5 Angkor golden spires, sanctuary & lotus reflecting pool
      paintFoliageCluster(midCtx, 105, GROUND_Y - 64, 90, '#14261c', '#1e3a2b', '#3f6212', rand);
      paintFoliageCluster(midCtx, 855, GROUND_Y - 64, 90, '#14261c', '#1e3a2b', '#3f6212', rand);

      const drawSpire = (cx: number, baseW: number, h: number, mainCol: string, rimCol: string) => {
        for (let t = 0; t < 6; t++) {
          const frac = t / 6;
          const tw = baseW * (1 - frac * 0.72);
          const th = h / 6;
          const ty = GROUND_Y - 94 - (t + 1) * th;
          midCtx.fillStyle = mainCol;
          midCtx.beginPath();
          midCtx.roundRect(cx - tw / 2, ty, tw, th + 2, 3);
          midCtx.fill();
          midCtx.strokeStyle = rimCol;
          midCtx.lineWidth = 1.5;
          midCtx.stroke();
        }
        midCtx.fillStyle = '#fef08a';
        midCtx.beginPath();
        midCtx.moveTo(cx - 8, GROUND_Y - 94 - h);
        midCtx.lineTo(cx, GROUND_Y - 126 - h);
        midCtx.lineTo(cx + 8, GROUND_Y - 94 - h);
        midCtx.closePath();
        midCtx.fill();
      };

      drawSpire(268, 62, 92, '#78350f', '#f59e0b');
      drawSpire(692, 62, 92, '#78350f', '#f59e0b');
      drawSpire(352, 84, 134, '#92400e', '#fbbf24');
      drawSpire(608, 84, 134, '#92400e', '#fbbf24');
      drawSpire(480, 126, 202, '#b45309', '#fde047');

      midCtx.fillStyle = '#78350f';
      midCtx.fillRect(216, GROUND_Y - 104, 528, 82);
      paintArchRow(midCtx, 258, GROUND_Y - 82, 7, 64, 34, 60, '#291005', '#f59e0b');

      // Sacred reflecting lotus moat at base
      const moat = midCtx.createLinearGradient(0, GROUND_Y - 24, 0, GROUND_Y);
      moat.addColorStop(0, '#4c1d95');
      moat.addColorStop(1, '#1e1b4b');
      midCtx.fillStyle = moat;
      midCtx.fillRect(BLEED_L, GROUND_Y - 24, BLEED_W, 24);
      midCtx.fillStyle = '#fbbf24';
      midCtx.fillRect(204, GROUND_Y - 26, 552, 4);

      [110, 240, 720, 850].forEach((px, idx) => {
        const h = idx === 0 || idx === 3 ? 168 : 126;
        midCtx.fillStyle = '#92400e';
        midCtx.fillRect(px - 15, GROUND_Y - h, 30, h);
        midCtx.fillStyle = '#fbbf24';
        midCtx.fillRect(px - 20, GROUND_Y - h, 40, 10);
        midCtx.fillRect(px - 18, GROUND_Y - 14, 36, 14);
      });
      break;
    }

    case 'rio': {
      fillSky(skyCtx, [
        [0, '#0369a1'],
        [0.38, '#38bdf8'],
        [0.72, '#fde047'],
        [0.92, '#fb923c'],
        [1, '#f472b6']
      ]);
      paintSunWithBloom(skyCtx, 156, 118, 50, '#fffbeb', '#fde047', 'rgba(254, 240, 138, 0.46)', true);

      // FAR: Clouds + Tijuca & Dois Irmãos mountain range
      paintCloudBank(farCtx, 430, 94, 0.92, '#fffbeb', '#fed7aa', '#c084fc');
      paintCloudBank(farCtx, 795, 106, 0.78, '#fffbeb', '#fbcfe8', '#7e22ce');
      paintSculptedMountain(farCtx, 370, 485, 610, 255, GROUND_Y - 76, '#1e5b6e', '#133b4a');
      farCtx.fillStyle = '#1e4d5c';
      farCtx.beginPath();
      farCtx.moveTo(BLEED_L, GROUND_Y - 82);
      farCtx.quadraticCurveTo(180, 260, 420, 310);
      farCtx.quadraticCurveTo(600, 245, BLEED_R, GROUND_Y - 82);
      farCtx.lineTo(BLEED_R, GROUND_Y);
      farCtx.lineTo(BLEED_L, GROUND_Y);
      farCtx.fill();

      // MID: Corcovado + Cristo Redentor + Urca + Pão de Açúcar + Guanabara Bay + Copacabana
      midCtx.fillStyle = '#14532d';
      midCtx.beginPath();
      midCtx.moveTo(35, GROUND_Y - 68);
      midCtx.quadraticCurveTo(220, 172, 295, 166);
      midCtx.quadraticCurveTo(368, 178, 485, GROUND_Y - 68);
      midCtx.closePath();
      midCtx.fill();
      midCtx.fillStyle = '#166534';
      midCtx.beginPath();
      midCtx.moveTo(35, GROUND_Y - 68);
      midCtx.quadraticCurveTo(220, 172, 295, 166);
      midCtx.lineTo(295, GROUND_Y - 68);
      midCtx.closePath();
      midCtx.fill();

      // Cristo Redentor with warm golden aura
      paintSunWithBloom(midCtx, 295, 128, 12, '#ffffff', '#fef9c3', 'rgba(254, 240, 138, 0.25)', false);
      midCtx.fillStyle = '#cbd5e1';
      midCtx.fillRect(286, 156, 18, 14);
      midCtx.fillStyle = '#f8fafc';
      midCtx.fillRect(290, 112, 10, 46);
      midCtx.fillRect(256, 122, 78, 7.5);
      midCtx.beginPath();
      midCtx.arc(295, 106, 5.5, 0, Math.PI * 2);
      midCtx.fill();

      // Morro da Urca & Sugarloaf
      midCtx.fillStyle = '#15803d';
      midCtx.beginPath();
      midCtx.moveTo(535, GROUND_Y - 68);
      midCtx.quadraticCurveTo(615, 224, 690, GROUND_Y - 68);
      midCtx.closePath();
      midCtx.fill();

      const sugarG = midCtx.createLinearGradient(700, 145, 895, GROUND_Y - 68);
      sugarG.addColorStop(0, '#1e5631');
      sugarG.addColorStop(0.6, '#14532d');
      sugarG.addColorStop(1, '#0c2e19');
      midCtx.fillStyle = sugarG;
      midCtx.beginPath();
      midCtx.moveTo(672, GROUND_Y - 68);
      midCtx.quadraticCurveTo(752, 140, 792, 146);
      midCtx.quadraticCurveTo(845, 150, 912, GROUND_Y - 68);
      midCtx.closePath();
      midCtx.fill();

      const bay = midCtx.createLinearGradient(0, GROUND_Y - 82, 0, GROUND_Y - 24);
      bay.addColorStop(0, '#0284c7');
      bay.addColorStop(1, '#0ea5e9');
      midCtx.fillStyle = bay;
      midCtx.fillRect(BLEED_L, GROUND_Y - 82, BLEED_W, 58);

      // Copacabana Portuguese mosaic promenade
      midCtx.fillStyle = '#f8fafc';
      midCtx.fillRect(BLEED_L, GROUND_Y - 24, BLEED_W, 24);
      midCtx.strokeStyle = '#0f172a';
      midCtx.lineWidth = 4.5;
      for (let row = 0; row < 2; row++) {
        midCtx.beginPath();
        for (let x = BLEED_L; x <= BLEED_R; x += 16) {
          midCtx.lineTo(x, GROUND_Y - 17 + row * 10 + Math.sin(x * 0.085) * 4);
        }
        midCtx.stroke();
      }
      break;
    }

    case 'saopaulo': {
      fillSky(skyCtx, [
        [0, '#040817'],
        [0.42, '#0f1e45'],
        [0.78, '#312e81'],
        [1, '#7c2d12']
      ]);

      // FAR: Endless São Paulo high-rise sea + Altino Arantes tower
      paintDistantSkylineBand(farCtx, GROUND_Y - 40, 95, 220, '#131d3d', 'rgba(253, 224, 71, 0.25)', rand);
      farCtx.fillStyle = '#1e293b';
      farCtx.fillRect(566, GROUND_Y - 285, 36, 245);
      farCtx.fillRect(574, GROUND_Y - 315, 20, 30);
      farCtx.fillStyle = '#ef4444';
      farCtx.fillRect(582, GROUND_Y - 332, 4, 17);

      // MID: Av. Paulista towers, MASP red span, Rio Pinheiros & Ponte Estaiada
      const spBlds: [number, number, number][] = [
        [-22, 54, 198],
        [12, 68, 220],
        [86, 78, 288],
        [170, 62, 236],
        [238, 76, 314],
        [635, 82, 280],
        [724, 72, 244],
        [802, 86, 318],
        [894, 68, 228]
      ];
      for (const [bx, bw, bh] of spBlds) {
        paintSkyscraper(midCtx, bx, bw, bh, '#0f172a', '#020617', 'rgba(253, 224, 71, 0.45)', null, rand);
      }

      [125, 276, 845].forEach((tx, i) => {
        const baseH = i === 0 ? 288 : i === 1 ? 314 : 318;
        midCtx.strokeStyle = '#cbd5e1';
        midCtx.lineWidth = 2.2;
        midCtx.beginPath();
        midCtx.moveTo(tx, GROUND_Y - baseH);
        midCtx.lineTo(tx, GROUND_Y - baseH - 42);
        midCtx.stroke();
      });

      // MASP suspended red architecture
      midCtx.fillStyle = '#dc2626';
      midCtx.fillRect(102, GROUND_Y - 106, 14, 106);
      midCtx.fillRect(244, GROUND_Y - 106, 14, 106);
      midCtx.fillStyle = '#1e293b';
      midCtx.fillRect(94, GROUND_Y - 124, 172, 46);
      midCtx.fillStyle = 'rgba(186, 230, 253, 0.35)';
      midCtx.fillRect(102, GROUND_Y - 114, 156, 26);
      midCtx.strokeStyle = '#ef4444';
      midCtx.lineWidth = 4.5;
      midCtx.strokeRect(94, GROUND_Y - 124, 172, 46);

      midCtx.fillStyle = '#0b142b';
      midCtx.fillRect(BLEED_L, GROUND_Y - 46, BLEED_W, 46);

      // Ponte Estaiada X-pylon
      midCtx.strokeStyle = '#e2e8f0';
      midCtx.lineWidth = 11;
      midCtx.lineCap = 'round';
      midCtx.beginPath();
      midCtx.moveTo(436, GROUND_Y);
      midCtx.lineTo(480, 120);
      midCtx.lineTo(524, GROUND_Y);
      midCtx.stroke();
      midCtx.fillStyle = '#334155';
      midCtx.fillRect(264, GROUND_Y - 52, 432, 14);
      break;
    }

    case 'buenosaires': {
      fillSky(skyCtx, [
        [0, '#240b4c'],
        [0.42, '#9d174d'],
        [0.76, '#ea580c'],
        [1, '#fde047']
      ]);

      // FAR: Clouds + Belle Époque domes of Av. de Mayo + Monumental Obelisco
      paintCloudBank(farCtx, 215, 110, 0.88, '#fef08a', '#fb7185', '#581c87');
      paintCloudBank(farCtx, 760, 102, 0.85, '#fef08a', '#fb923c', '#4c1d95');
      paintDistantSkylineBand(farCtx, GROUND_Y, 80, 145, '#3b1254', 'rgba(254, 240, 138, 0.28)', rand);

      farCtx.fillStyle = '#f8fafc';
      farCtx.beginPath();
      farCtx.moveTo(458, GROUND_Y);
      farCtx.lineTo(468, 120);
      farCtx.lineTo(480, 84);
      farCtx.lineTo(492, 120);
      farCtx.lineTo(502, GROUND_Y);
      farCtx.closePath();
      farCtx.fill();
      farCtx.fillStyle = '#cbd5e1';
      farCtx.beginPath();
      farCtx.moveTo(480, 84);
      farCtx.lineTo(492, 120);
      farCtx.lineTo(502, GROUND_Y);
      farCtx.lineTo(480, GROUND_Y);
      farCtx.closePath();
      farCtx.fill();

      // MID: Vibrant Caminito corrugated tin houses + festive string lights + streetlamps
      const houses: [number, number, number, string, string][] = [
        [-24, 142, 52, '#0d9488', '#fbbf24'],
        [24, 156, 98, '#dc2626', '#fbbf24'],
        [122, 130, 92, '#eab308', '#0284c7'],
        [214, 166, 102, '#0284c7', '#f43f5e'],
        [644, 162, 102, '#ea580c', '#2dd4bf'],
        [746, 136, 92, '#0d9488', '#fbbf24'],
        [838, 168, 98, '#4f46e5', '#f43f5e'],
        [936, 144, 52, '#dc2626', '#fde047']
      ];
      for (const [hx, hh, hw, col, trim] of houses) {
        midCtx.fillStyle = col;
        midCtx.fillRect(hx, GROUND_Y - hh, hw, hh);
        midCtx.strokeStyle = 'rgba(0,0,0,0.13)';
        midCtx.lineWidth = 1;
        for (let rx = hx + 6; rx < hx + hw; rx += 7) {
          midCtx.beginPath();
          midCtx.moveTo(rx, GROUND_Y - hh);
          midCtx.lineTo(rx, GROUND_Y);
          midCtx.stroke();
        }
        midCtx.fillStyle = trim;
        midCtx.fillRect(hx - 2, GROUND_Y - hh, hw + 4, 8);
        if (hw >= 80) {
          midCtx.fillStyle = '#1e293b';
          midCtx.fillRect(hx + 16, GROUND_Y - hh + 24, 22, 32);
          midCtx.fillRect(hx + hw - 38, GROUND_Y - hh + 24, 22, 32);
          midCtx.fillStyle = '#fef08a';
          midCtx.fillRect(hx + 19, GROUND_Y - hh + 27, 16, 26);
          midCtx.fillRect(hx + hw - 35, GROUND_Y - hh + 27, 16, 26);
          midCtx.strokeStyle = '#0f172a';
          midCtx.lineWidth = 2;
          midCtx.strokeRect(hx + 10, GROUND_Y - hh + 52, hw - 20, 12);
        }
      }

      // Festive overhead La Boca string lights cable
      midCtx.strokeStyle = '#1e293b';
      midCtx.lineWidth = 1.5;
      midCtx.beginPath();
      midCtx.moveTo(316, GROUND_Y - 150);
      midCtx.quadraticCurveTo(480, GROUND_Y - 108, 644, GROUND_Y - 150);
      midCtx.stroke();

      [346, 614].forEach((lx) => {
        midCtx.fillStyle = '#0f172a';
        midCtx.fillRect(lx - 2.5, GROUND_Y - 98, 5, 98);
        midCtx.fillRect(lx - 8, GROUND_Y - 12, 16, 12);
      });
      break;
    }

    case 'machupicchu': {
      fillSky(skyCtx, [
        [0, '#075985'],
        [0.45, '#38bdf8'],
        [0.8, '#bae6fd'],
        [1, '#fef9c3']
      ]);
      paintSunWithBloom(skyCtx, 185, 116, 48, '#fffbeb', '#fde047', 'rgba(254, 240, 138, 0.42)', true);

      // FAR: Clouds + Cordillera Vilcabamba + Huayna Picchu sharp emerald peak
      paintCloudBank(farCtx, 430, 84, 0.92, '#ffffff', '#e0f2fe', '#94a3b8');
      paintSculptedMountain(farCtx, -60, 175, 420, 162, GROUND_Y, '#15803d', '#0f3d26');
      paintSculptedMountain(farCtx, 430, 688, 995, 96, GROUND_Y, '#166534', '#0b2d1b');
      paintHazeBand(farCtx, 205, 345, 'rgba(224, 242, 254, 0.3)');

      // MID: Stepped Inca terraces + stone sanctuary + Intihuatana sundial + Andean llama
      for (let s = 0; s < 5; s++) {
        const sx = 105 + s * 34;
        const sw = 560 - s * 68;
        const sy = GROUND_Y - 24 - s * 22;
        midCtx.fillStyle = s % 2 === 0 ? '#78716c' : '#57534e';
        midCtx.fillRect(sx, sy, sw, 22);
        midCtx.strokeStyle = 'rgba(28, 25, 23, 0.35)';
        midCtx.lineWidth = 1;
        for (let bx = sx + 18; bx < sx + sw; bx += 22) {
          midCtx.beginPath();
          midCtx.moveTo(bx, sy);
          midCtx.lineTo(bx, sy + 22);
          midCtx.stroke();
        }
        midCtx.fillStyle = '#22c55e';
        midCtx.fillRect(sx, sy, sw, 5);
      }

      const drawStoneHouse = (x: number, y: number, w: number, h: number) => {
        midCtx.fillStyle = '#a8a29e';
        midCtx.beginPath();
        midCtx.moveTo(x, y + h);
        midCtx.lineTo(x, y + 14);
        midCtx.lineTo(x + w / 2, y);
        midCtx.lineTo(x + w, y + 14);
        midCtx.lineTo(x + w, y + h);
        midCtx.closePath();
        midCtx.fill();
        midCtx.strokeStyle = '#44403c';
        midCtx.lineWidth = 1.5;
        midCtx.stroke();
        midCtx.fillStyle = '#1c1917';
        midCtx.beginPath();
        midCtx.moveTo(x + w * 0.38, y + h);
        midCtx.lineTo(x + w * 0.42, y + h - 24);
        midCtx.lineTo(x + w * 0.58, y + h - 24);
        midCtx.lineTo(x + w * 0.62, y + h);
        midCtx.closePath();
        midCtx.fill();
      };
      drawStoneHouse(268, GROUND_Y - 166, 78, 56);
      drawStoneHouse(386, GROUND_Y - 178, 102, 68);

      // Charming white Andean llama on lower terrace
      midCtx.fillStyle = '#f5f5f4';
      midCtx.fillRect(565, GROUND_Y - 62, 18, 10);
      midCtx.fillRect(579, GROUND_Y - 74, 5, 14);
      midCtx.fillRect(578, GROUND_Y - 77, 9, 5);
      midCtx.fillRect(566, GROUND_Y - 52, 3, 8);
      midCtx.fillRect(579, GROUND_Y - 52, 3, 8);
      break;
    }

    case 'habana': {
      fillSky(skyCtx, [
        [0, '#0284c7'],
        [0.42, '#f59e0b'],
        [0.78, '#fbbf24'],
        [1, '#fef3c7']
      ]);
      paintSunWithBloom(skyCtx, 795, 116, 48, '#fffbeb', '#fde047', 'rgba(253, 224, 71, 0.46)', false);

      // FAR: Clouds + El Capitolio dome + El Morro lighthouse across bay
      paintCloudBank(farCtx, 210, 96, 0.86, '#fffbeb', '#fed7aa', '#d97706');
      farCtx.fillStyle = '#fef3c7';
      farCtx.fillRect(415, GROUND_Y - 176, 130, 98);
      farCtx.beginPath();
      farCtx.arc(480, GROUND_Y - 176, 46, Math.PI, 0);
      farCtx.fill();
      farCtx.fillStyle = '#f59e0b';
      farCtx.fillRect(476, GROUND_Y - 244, 8, 26);

      // El Morro Castle & Lighthouse on distant headland
      farCtx.fillStyle = '#78350f';
      farCtx.fillRect(558, GROUND_Y - 102, 46, 22);
      farCtx.fillStyle = '#fde68a';
      farCtx.fillRect(576, GROUND_Y - 134, 10, 32);

      // MID: Caribbean Sea + pastel Spanish-colonial arcades + Malecón seawall
      midCtx.fillStyle = '#0369a1';
      midCtx.fillRect(BLEED_L, GROUND_Y - 82, BLEED_W, 82);

      const colB: [number, number, number, string][] = [
        [-20, 188, 46, '#2dd4bf'],
        [24, 208, 116, '#fb7185'],
        [140, 182, 110, '#fbbf24'],
        [250, 220, 118, '#2dd4bf'],
        [608, 194, 118, '#fb923c'],
        [726, 224, 126, '#f472b6']
      ];
      for (const [bx, bh, bw, col] of colB) {
        midCtx.fillStyle = col;
        midCtx.fillRect(bx, GROUND_Y - bh, bw, bh);
        midCtx.fillStyle = '#fffbeb';
        midCtx.fillRect(bx - 3, GROUND_Y - bh, bw + 6, 8);
        if (bw >= 100) {
          paintArchRow(midCtx, bx + 12, GROUND_Y - bh + 28, 3, 33, 22, 38, '#1e293b', '#ffffff');
          paintArchRow(midCtx, bx + 12, GROUND_Y - bh + 92, 3, 33, 22, 42, '#0f172a', '#ffffff');
        }
      }

      midCtx.fillStyle = '#e7d5be';
      midCtx.fillRect(BLEED_L, GROUND_Y - 36, BLEED_W, 36);
      midCtx.fillStyle = '#cbb393';
      midCtx.fillRect(BLEED_L, GROUND_Y - 36, BLEED_W, 6);
      break;
    }

    case 'vegas': {
      fillSky(skyCtx, [
        [0, '#04010f'],
        [0.48, '#1b0736'],
        [0.82, '#4a124b'],
        [1, '#831843']
      ]);
      paintNebulaWash(skyCtx, 480, 120, 340, 110, 0.08, 'rgba(244, 63, 94, 0.18)', 'rgba(168, 85, 247, 0.08)');

      // FAR: Strip resort towers + Stratosphere needle
      paintDistantSkylineBand(farCtx, GROUND_Y, 115, 255, '#130829', 'rgba(251, 191, 36, 0.34)', rand);
      farCtx.fillStyle = '#cbd5e1';
      farCtx.fillRect(654, GROUND_Y - 290, 8, 150);
      farCtx.beginPath();
      farCtx.ellipse(658, GROUND_Y - 294, 22, 9, 0, 0, Math.PI * 2);
      farCtx.fill();
      farCtx.fillRect(656, GROUND_Y - 332, 4, 38);

      // MID: Obsidian Luxor Pyramid, Eiffel replica, Vegas diamond sign & Bellagio lagoon
      midCtx.fillStyle = '#090d1a';
      midCtx.beginPath();
      midCtx.moveTo(92, GROUND_Y);
      midCtx.lineTo(212, GROUND_Y - 160);
      midCtx.lineTo(332, GROUND_Y);
      midCtx.closePath();
      midCtx.fill();
      midCtx.strokeStyle = '#22d3ee';
      midCtx.lineWidth = 1.8;
      midCtx.stroke();

      midCtx.strokeStyle = '#fbbf24';
      midCtx.lineWidth = 3;
      midCtx.beginPath();
      midCtx.moveTo(732, GROUND_Y);
      midCtx.quadraticCurveTo(784, GROUND_Y - 138, 795, GROUND_Y - 280);
      midCtx.quadraticCurveTo(806, GROUND_Y - 138, 858, GROUND_Y);
      midCtx.stroke();
      midCtx.fillStyle = '#fde047';
      midCtx.fillRect(758, GROUND_Y - 96, 74, 8);
      midCtx.fillRect(774, GROUND_Y - 166, 42, 6);

      midCtx.fillStyle = '#be123c';
      midCtx.beginPath();
      midCtx.moveTo(480, 120);
      midCtx.lineTo(620, 185);
      midCtx.lineTo(480, 250);
      midCtx.lineTo(340, 185);
      midCtx.closePath();
      midCtx.fill();
      midCtx.fillStyle = '#ffffff';
      midCtx.textAlign = 'center';
      midCtx.font = 'bold 11px "Press Start 2P", monospace';
      midCtx.fillText('WELCOME TO', 480, 174);
      midCtx.font = 'bold 17px "Press Start 2P", monospace';
      midCtx.fillStyle = '#fde047';
      midCtx.fillText('LAS VEGAS', 480, 204);

      midCtx.fillStyle = '#0c1d3d';
      midCtx.fillRect(300, GROUND_Y - 20, 360, 20);
      break;
    }

    case 'nyc': {
      fillSky(skyCtx, [
        [0, '#070e20'],
        [0.44, '#1e3a5f'],
        [0.76, '#c2410c'],
        [1, '#fb923c']
      ]);

      // FAR: Lower/Midtown Manhattan + Chrysler Art Deco spire
      paintCloudBank(farCtx, 280, 106, 0.86, '#fed7aa', '#fb923c', '#334155');
      paintDistantSkylineBand(farCtx, GROUND_Y - 28, 120, 235, '#172542', 'rgba(254, 240, 138, 0.28)', rand);
      // Chrysler Building Art Deco terraced crown
      farCtx.fillStyle = '#cbd5e1';
      [26, 20, 14, 8].forEach((r, idx) => {
        farCtx.beginPath();
        farCtx.arc(345, GROUND_Y - 242 - idx * 11, r, Math.PI, 0);
        farCtx.fill();
      });
      farCtx.fillRect(343.5, GROUND_Y - 308, 3, 30);

      // MID: Flankers, Empire State, Brooklyn Bridge, East River & Statue of Liberty
      const nyBlds: [number, number, number][] = [
        [18, 64, 180],
        [228, 66, 214],
        [302, 72, 248],
        [380, 52, 204],
        [530, 64, 234],
        [600, 58, 190],
        [880, 68, 220]
      ];
      for (const [bx, bw, bh] of nyBlds) {
        paintSkyscraper(midCtx, bx, bw, bh, '#1e293b', '#0f172a', 'rgba(254, 240, 138, 0.46)', null, rand);
      }

      // Empire State Building
      midCtx.fillStyle = '#1e293b';
      midCtx.fillRect(435, GROUND_Y - 268, 90, 268);
      midCtx.fillRect(450, GROUND_Y - 320, 60, 52);
      midCtx.fillRect(466, GROUND_Y - 350, 28, 30);
      midCtx.fillStyle = '#e2e8f0';
      midCtx.fillRect(478, GROUND_Y - 402, 4, 52);
      midCtx.fillStyle = 'rgba(254, 240, 138, 0.62)';
      for (let wy = GROUND_Y - 254; wy < GROUND_Y - 26; wy += 14) {
        for (let wx = 444; wx < 516; wx += 12) {
          midCtx.fillRect(wx, wy, 6, 7);
        }
      }

      // Brooklyn Bridge with vertical suspender cables
      midCtx.fillStyle = '#64748b';
      midCtx.fillRect(670, GROUND_Y - 188, 44, 188);
      midCtx.fillRect(822, GROUND_Y - 188, 44, 188);
      paintArchRow(midCtx, 676, GROUND_Y - 168, 2, 17, 13, 44, '#1e293b');
      paintArchRow(midCtx, 828, GROUND_Y - 168, 2, 17, 13, 44, '#1e293b');
      midCtx.strokeStyle = '#cbd5e1';
      midCtx.lineWidth = 2.2;
      midCtx.beginPath();
      midCtx.moveTo(575, GROUND_Y - 58);
      midCtx.quadraticCurveTo(692, GROUND_Y - 180, 768, GROUND_Y - 82);
      midCtx.quadraticCurveTo(844, GROUND_Y - 180, 985, GROUND_Y - 58);
      midCtx.stroke();

      // Statue of Liberty
      midCtx.fillStyle = '#0f766e';
      midCtx.fillRect(132, GROUND_Y - 62, 54, 62);
      midCtx.fillStyle = '#2dd4bf';
      midCtx.beginPath();
      midCtx.moveTo(138, GROUND_Y - 62);
      midCtx.lineTo(146, GROUND_Y - 164);
      midCtx.lineTo(172, GROUND_Y - 164);
      midCtx.lineTo(180, GROUND_Y - 62);
      midCtx.closePath();
      midCtx.fill();
      midCtx.beginPath();
      midCtx.arc(159, GROUND_Y - 176, 12, 0, Math.PI * 2);
      midCtx.fill();
      midCtx.fillRect(168, GROUND_Y - 224, 7, 56);
      break;
    }

    case 'madrid': {
      fillSky(skyCtx, [
        [0, '#3b0764'],
        [0.36, '#be123c'],
        [0.72, '#ea580c'],
        [1, '#fef08a']
      ]);
      paintSunWithBloom(skyCtx, 480, 208, 64, '#fffbeb', '#fb923c', 'rgba(253, 224, 71, 0.42)', true);

      // FAR: Clouds + Gran Vía & Metropolis domes
      paintCloudBank(farCtx, 210, 100, 0.86, '#fef08a', '#fb7185', '#701a75');
      paintCloudBank(farCtx, 765, 98, 0.82, '#fef08a', '#fb923c', '#581c87');
      [112, 848].forEach((dx) => {
        farCtx.fillStyle = '#92400e';
        farCtx.fillRect(dx - 52, GROUND_Y - 160, 104, 160);
        farCtx.fillStyle = '#1e293b';
        farCtx.beginPath();
        farCtx.arc(dx, GROUND_Y - 160, 40, Math.PI, 0);
        farCtx.fill();
        farCtx.strokeStyle = '#fbbf24';
        farCtx.lineWidth = 2.5;
        farCtx.stroke();
        farCtx.fillStyle = '#fbbf24';
        farCtx.fillRect(dx - 3, GROUND_Y - 218, 6, 18);
      });

      // MID: Neoclassical Puerta de Alcalá with columns & Cibeles Fountain
      midCtx.fillStyle = '#efe1cc';
      midCtx.fillRect(230, GROUND_Y - 174, 500, 174);
      midCtx.fillStyle = '#d6c1a5';
      midCtx.fillRect(224, GROUND_Y - 178, 512, 12);
      midCtx.beginPath();
      midCtx.moveTo(380, GROUND_Y - 178);
      midCtx.lineTo(480, GROUND_Y - 232);
      midCtx.lineTo(580, GROUND_Y - 178);
      midCtx.closePath();
      midCtx.fill();
      midCtx.strokeStyle = '#a1886f';
      midCtx.lineWidth = 2;
      midCtx.stroke();

      const arches: [number, number, number][] = [
        [264, 48, 86],
        [346, 52, 92],
        [448, 64, 114],
        [562, 52, 92],
        [648, 48, 86]
      ];
      for (const [ax, aw, ah] of arches) {
        midCtx.fillStyle = '#5c3a21';
        midCtx.beginPath();
        midCtx.arc(ax + aw / 2, GROUND_Y - ah + aw / 2, aw / 2, Math.PI, 0);
        midCtx.lineTo(ax + aw, GROUND_Y);
        midCtx.lineTo(ax, GROUND_Y);
        midCtx.closePath();
        midCtx.fill();
        // Classical engaged stone pilasters flanking arches
        midCtx.fillStyle = '#dfd0b8';
        midCtx.fillRect(ax - 8, GROUND_Y - 164, 6, 164);
      }

      midCtx.fillStyle = '#cbd5e1';
      midCtx.fillRect(402, GROUND_Y - 24, 156, 24);
      midCtx.fillStyle = '#0284c7';
      midCtx.fillRect(408, GROUND_Y - 22, 144, 6);
      break;
    }

    case 'london': {
      fillSky(skyCtx, [
        [0, '#0f172a'],
        [0.46, '#334155'],
        [0.82, '#64748b'],
        [1, '#cbd5e1']
      ]);

      // FAR: Rain clouds + Shard & City of London silhouette
      paintCloudBank(farCtx, 255, 92, 1.02, '#cbd5e1', '#64748b', '#334155');
      paintCloudBank(farCtx, 735, 108, 0.94, '#cbd5e1', '#64748b', '#1e293b');
      // The Shard spire silhouette
      farCtx.fillStyle = '#334155';
      farCtx.beginPath();
      farCtx.moveTo(575, GROUND_Y - 36);
      farCtx.lineTo(602, GROUND_Y - 275);
      farCtx.lineTo(628, GROUND_Y - 36);
      farCtx.closePath();
      farCtx.fill();

      // MID: Westminster, Big Ben, Tower Bridge, red phone box & Thames
      midCtx.fillStyle = '#856546';
      midCtx.fillRect(322, GROUND_Y - 106, 132, 106);
      paintArchRow(midCtx, 334, GROUND_Y - 84, 5, 22, 14, 34, '#fde68a');

      midCtx.fillStyle = '#a37b56';
      midCtx.fillRect(446, GROUND_Y - 288, 68, 288);
      midCtx.fillStyle = '#1e293b';
      midCtx.beginPath();
      midCtx.moveTo(440, GROUND_Y - 288);
      midCtx.lineTo(480, GROUND_Y - 368);
      midCtx.lineTo(520, GROUND_Y - 288);
      midCtx.closePath();
      midCtx.fill();
      midCtx.fillStyle = '#fef9c3';
      midCtx.beginPath();
      midCtx.arc(480, GROUND_Y - 238, 22, 0, Math.PI * 2);
      midCtx.fill();
      midCtx.strokeStyle = '#451a03';
      midCtx.lineWidth = 3;
      midCtx.stroke();

      // Tower Bridge
      midCtx.fillStyle = '#7c5a43';
      midCtx.fillRect(662, GROUND_Y - 188, 42, 188);
      midCtx.fillRect(822, GROUND_Y - 188, 42, 188);
      midCtx.fillStyle = '#1e293b';
      midCtx.beginPath();
      midCtx.moveTo(660, GROUND_Y - 188);
      midCtx.lineTo(683, GROUND_Y - 224);
      midCtx.lineTo(706, GROUND_Y - 188);
      midCtx.moveTo(820, GROUND_Y - 188);
      midCtx.lineTo(843, GROUND_Y - 224);
      midCtx.lineTo(866, GROUND_Y - 188);
      midCtx.fill();
      midCtx.fillStyle = '#38bdf8';
      midCtx.fillRect(704, GROUND_Y - 146, 118, 12);
      midCtx.fillRect(570, GROUND_Y - 48, 420, 12);

      midCtx.fillStyle = '#1e293b';
      midCtx.fillRect(BLEED_L, GROUND_Y - 36, BLEED_W, 36);
      break;
    }

    case 'rome': {
      fillSky(skyCtx, [
        [0, '#2e1065'],
        [0.38, '#9a3412'],
        [0.75, '#f59e0b'],
        [1, '#fef08a']
      ]);
      paintSunWithBloom(skyCtx, 792, 144, 54, '#fffbeb', '#fb923c', 'rgba(253, 224, 71, 0.42)', true);

      // FAR: Clouds + St. Peter's dome + Roman Forum marble columns
      paintCloudBank(farCtx, 220, 106, 0.9, '#fef08a', '#fdba74', '#9a3412');
      farCtx.fillStyle = '#581c45';
      farCtx.beginPath();
      farCtx.arc(132, GROUND_Y - 84, 34, Math.PI, 0);
      farCtx.fill();
      farCtx.fillRect(98, GROUND_Y - 84, 68, 84);

      // Ancient Roman Forum colonnade ruins (right horizon)
      farCtx.fillStyle = '#d6c1a5';
      for (let c = 0; c < 4; c++) {
        farCtx.fillRect(790 + c * 22, GROUND_Y - 98, 8, 98);
      }
      farCtx.fillRect(786, GROUND_Y - 104, 78, 7);

      // MID: Monumental Colosseum + Roman Umbrella Pines
      paintFoliageCluster(midCtx, 52, GROUND_Y - 122, 46, '#14532d', '#166534', '#4ade80', rand);
      midCtx.fillStyle = '#451a03';
      midCtx.fillRect(48, GROUND_Y - 95, 9, 95);

      const cg = midCtx.createLinearGradient(210, GROUND_Y - 208, 750, GROUND_Y);
      cg.addColorStop(0, '#e6be94');
      cg.addColorStop(0.55, '#c99763');
      cg.addColorStop(1, '#8c5a32');
      midCtx.fillStyle = cg;
      midCtx.beginPath();
      midCtx.roundRect(210, GROUND_Y - 206, 540, 206, [20, 20, 0, 0]);
      midCtx.fill();

      midCtx.fillStyle = '#b95114';
      midCtx.beginPath();
      midCtx.moveTo(525, GROUND_Y - 210);
      midCtx.lineTo(754, GROUND_Y - 210);
      midCtx.lineTo(754, GROUND_Y - 130);
      midCtx.lineTo(605, GROUND_Y - 146);
      midCtx.closePath();
      midCtx.fill();

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 10; col++) {
          if (row === 0 && col > 5) continue;
          const ax = 238 + col * 49;
          const ay = GROUND_Y - 168 + row * 54;
          midCtx.fillStyle = row === 2 ? '#fbbf24' : '#4a2a14';
          midCtx.beginPath();
          midCtx.arc(ax + 12, ay + 12, 12, Math.PI, 0);
          midCtx.fill();
          midCtx.fillRect(ax, ay + 12, 24, 26);
        }
      }
      break;
    }

    case 'moscow': {
      fillSky(skyCtx, [
        [0, '#050819'],
        [0.48, '#172554'],
        [0.82, '#3730a3'],
        [1, '#6366f1']
      ]);
      paintNebulaWash(skyCtx, 480, 110, 320, 95, -0.05, 'rgba(99, 102, 241, 0.2)', 'rgba(56, 189, 248, 0.06)');

      // FAR: Snowy Moscow skyline & Historical Museum spires
      paintDistantSkylineBand(farCtx, GROUND_Y - 75, 45, 115, '#1e295e', 'rgba(254, 240, 138, 0.26)', rand);

      // MID: Red Square Kremlin Wall, Spasskaya Tower & St. Basil's Cathedral
      midCtx.fillStyle = '#7f1d1d';
      midCtx.fillRect(BLEED_L, GROUND_Y - 86, BLEED_W, 86);
      for (let mx = BLEED_L + 8; mx < BLEED_R; mx += 26) {
        midCtx.fillRect(mx, GROUND_Y - 98, 14, 12);
      }
      // Snow cap on Kremlin merlons
      midCtx.fillStyle = '#e2e8f0';
      for (let mx = BLEED_L + 8; mx < BLEED_R; mx += 26) {
        midCtx.fillRect(mx, GROUND_Y - 100, 14, 2.5);
      }

      midCtx.fillStyle = '#991b1b';
      midCtx.fillRect(108, GROUND_Y - 198, 52, 198);
      midCtx.fillStyle = '#15803d';
      midCtx.beginPath();
      midCtx.moveTo(104, GROUND_Y - 198);
      midCtx.lineTo(134, GROUND_Y - 266);
      midCtx.lineTo(164, GROUND_Y - 198);
      midCtx.closePath();
      midCtx.fill();
      midCtx.fillStyle = '#fef08a';
      midCtx.beginPath();
      midCtx.arc(134, GROUND_Y - 160, 12, 0, Math.PI * 2);
      midCtx.fill();
      midCtx.fillStyle = '#ef4444';
      midCtx.beginPath();
      midCtx.arc(134, GROUND_Y - 272, 7.5, 0, Math.PI * 2);
      midCtx.fill();

      midCtx.fillStyle = '#b91c1c';
      midCtx.fillRect(280, GROUND_Y - 126, 400, 126);
      const domes: [number, number, number, string, string][] = [
        [330, 188, 28, '#facc15', '#dc2626'],
        [405, 232, 33, '#38bdf8', '#f8fafc'],
        [480, 288, 41, '#f43f5e', '#fde047'],
        [555, 232, 33, '#10b981', '#fef08a'],
        [630, 188, 28, '#a855f7', '#38bdf8']
      ];
      for (const [dx, dh, dr, col, stripe] of domes) {
        midCtx.fillStyle = '#f8fafc';
        midCtx.fillRect(dx - dr * 0.52, GROUND_Y - dh, dr * 1.04, dh - 102);
        midCtx.fillStyle = col;
        midCtx.beginPath();
        midCtx.arc(dx, GROUND_Y - dh, dr, 0, Math.PI * 2);
        midCtx.fill();
        midCtx.strokeStyle = stripe;
        midCtx.lineWidth = 3.2;
        midCtx.beginPath();
        midCtx.arc(dx, GROUND_Y - dh, dr * 0.66, -0.5, 2.5);
        midCtx.stroke();
        midCtx.fillStyle = col;
        midCtx.beginPath();
        midCtx.moveTo(dx - dr * 0.48, GROUND_Y - dh - dr * 0.6);
        midCtx.lineTo(dx, GROUND_Y - dh - dr * 1.65);
        midCtx.lineTo(dx + dr * 0.48, GROUND_Y - dh - dr * 0.6);
        midCtx.closePath();
        midCtx.fill();
        midCtx.fillStyle = '#fde047';
        midCtx.beginPath();
        midCtx.arc(dx, GROUND_Y - dh - dr * 1.65, 3.8, 0, Math.PI * 2);
        midCtx.fill();
      }
      break;
    }

    case 'delhi': {
      fillSky(skyCtx, [
        [0, '#3b0764'],
        [0.36, '#be185d'],
        [0.7, '#f97316'],
        [1, '#fef3c7']
      ]);
      paintSunWithBloom(skyCtx, 480, 198, 76, '#fffbeb', '#fde047', 'rgba(254, 240, 138, 0.42)', true);

      // FAR: Clouds + Red sandstone Kau Ban Mosque & Jawab flankers
      paintCloudBank(farCtx, 190, 96, 0.88, '#fef3c7', '#fdba74', '#9d174d');
      paintCloudBank(farCtx, 775, 104, 0.85, '#fef3c7', '#fb923c', '#701a75');
      [115, 845].forEach((sx) => {
        farCtx.fillStyle = '#9a3412';
        farCtx.fillRect(sx - 56, GROUND_Y - 130, 112, 72);
        farCtx.fillStyle = '#fed7aa';
        farCtx.beginPath();
        farCtx.arc(sx, GROUND_Y - 130, 28, Math.PI, 0);
        farCtx.fill();
      });

      // MID: Ivory Taj Mahal + 4 Minarets + Cypress Charbagh + Reflecting Pool
      midCtx.fillStyle = '#fffbeb';
      midCtx.fillRect(334, GROUND_Y - 180, 292, 120);
      midCtx.fillRect(422, GROUND_Y - 202, 116, 142);
      midCtx.beginPath();
      midCtx.arc(480, GROUND_Y - 204, 58, Math.PI, 0);
      midCtx.fill();
      midCtx.beginPath();
      midCtx.moveTo(466, GROUND_Y - 260);
      midCtx.lineTo(480, GROUND_Y - 294);
      midCtx.lineTo(494, GROUND_Y - 260);
      midCtx.closePath();
      midCtx.fill();

      [374, 586].forEach((fx) => {
        midCtx.beginPath();
        midCtx.arc(fx, GROUND_Y - 180, 24, Math.PI, 0);
        midCtx.fill();
      });
      [235, 302, 658, 725].forEach((mx) => {
        midCtx.fillRect(mx - 8, GROUND_Y - 218, 16, 158);
        midCtx.beginPath();
        midCtx.arc(mx, GROUND_Y - 218, 10, Math.PI, 0);
        midCtx.fill();
      });

      midCtx.fillStyle = '#b45309';
      midCtx.beginPath();
      midCtx.arc(480, GROUND_Y - 114, 34, Math.PI, 0);
      midCtx.fill();
      midCtx.fillRect(446, GROUND_Y - 114, 68, 54);
      paintArchRow(midCtx, 352, GROUND_Y - 146, 2, 34, 18, 32, '#d97706');
      paintArchRow(midCtx, 558, GROUND_Y - 146, 2, 34, 18, 32, '#d97706');

      midCtx.fillStyle = '#14532d';
      midCtx.fillRect(BLEED_L, GROUND_Y - 60, BLEED_W, 60);
      // Garden cypress avenue
      [295, 322, 638, 665].forEach((cx) => {
        midCtx.fillStyle = '#064e3b';
        midCtx.beginPath();
        midCtx.ellipse(cx, GROUND_Y - 46, 7, 26, 0, 0, Math.PI * 2);
        midCtx.fill();
      });

      const pool = midCtx.createLinearGradient(0, GROUND_Y - 60, 0, GROUND_Y);
      pool.addColorStop(0, '#0284c7');
      pool.addColorStop(1, '#1e3a8a');
      midCtx.fillStyle = pool;
      midCtx.fillRect(350, GROUND_Y - 60, 260, 60);
      midCtx.fillStyle = '#f8fafc';
      midCtx.fillRect(344, GROUND_Y - 60, 6, 60);
      midCtx.fillRect(610, GROUND_Y - 60, 6, 60);
      break;
    }

    case 'bangkok': {
      fillSky(skyCtx, [
        [0, '#070016'],
        [0.45, '#3b0764'],
        [0.78, '#c2410c'],
        [1, '#fbbf24']
      ]);
      paintNebulaWash(skyCtx, 480, 110, 310, 100, 0, 'rgba(245, 158, 11, 0.16)', 'rgba(139, 92, 246, 0.08)');

      // FAR: Distant Bangkok riverside skyline & Grand Palace spires
      paintDistantSkylineBand(farCtx, GROUND_Y - 64, 55, 135, '#240b42', 'rgba(253, 224, 71, 0.25)', rand);

      // MID: Wat Arun porcelain-tiered prangs + Chao Phraya River
      const drawPrang = (cx: number, bw: number, h: number) => {
        const g = midCtx.createLinearGradient(cx, GROUND_Y - 64 - h, cx, GROUND_Y - 64);
        g.addColorStop(0, '#fef9c3');
        g.addColorStop(0.55, '#f59e0b');
        g.addColorStop(1, '#78350f');
        midCtx.fillStyle = g;
        midCtx.beginPath();
        midCtx.moveTo(cx - bw / 2, GROUND_Y - 64);
        midCtx.quadraticCurveTo(cx - bw * 0.2, GROUND_Y - 64 - h * 0.72, cx, GROUND_Y - 64 - h);
        midCtx.quadraticCurveTo(cx + bw * 0.2, GROUND_Y - 64 - h * 0.72, cx + bw / 2, GROUND_Y - 64);
        midCtx.closePath();
        midCtx.fill();
        midCtx.strokeStyle = '#fde047';
        midCtx.lineWidth = 1.6;
        midCtx.stroke();
        // Horizontal porcelain mosaic bands
        for (let b = 1; b < 6; b++) {
          const frac = b / 6;
          const ry = GROUND_Y - 64 - h * frac;
          const rw = bw * (1 - frac * 0.78);
          midCtx.fillStyle = b % 2 === 0 ? '#38bdf8' : '#fb7185';
          midCtx.fillRect(cx - rw * 0.45, ry, rw * 0.9, 2.5);
        }
      };
      drawPrang(220, 56, 102);
      drawPrang(335, 78, 150);
      drawPrang(480, 136, 262);
      drawPrang(625, 78, 150);
      drawPrang(740, 56, 102);

      const river = midCtx.createLinearGradient(0, GROUND_Y - 66, 0, GROUND_Y);
      river.addColorStop(0, '#1e1b4b');
      river.addColorStop(1, '#090d24');
      midCtx.fillStyle = river;
      midCtx.fillRect(BLEED_L, GROUND_Y - 66, BLEED_W, 66);
      break;
    }

    case 'beijing': {
      fillSky(skyCtx, [
        [0, '#3b070c'],
        [0.42, '#991b1b'],
        [0.76, '#ea580c'],
        [1, '#fbbf24']
      ]);
      paintSunWithBloom(skyCtx, 480, 188, 70, '#fef08a', '#f97316', 'rgba(251, 191, 36, 0.38)', true);

      // FAR: Yan Mountains + Winding Great Wall + Watchtowers
      paintSculptedMountain(farCtx, -70, 185, 445, 192, GROUND_Y, '#4c0f19', '#2b060d');
      paintSculptedMountain(farCtx, 515, 775, 1040, 178, GROUND_Y, '#4c0f19', '#2b060d');
      paintHazeBand(farCtx, 250, 365, 'rgba(251, 146, 60, 0.2)');

      farCtx.strokeStyle = '#e7e5e4';
      farCtx.lineWidth = 8.5;
      farCtx.beginPath();
      farCtx.moveTo(BLEED_L, 330);
      farCtx.quadraticCurveTo(205, 204, 480, 276);
      farCtx.quadraticCurveTo(755, 190, BLEED_R, 306);
      farCtx.stroke();
      [[192, 222], [756, 204]].forEach(([wx, wy]) => {
        farCtx.fillStyle = '#d6d3d1';
        farCtx.fillRect(wx - 12, wy - 18, 24, 24);
        farCtx.fillStyle = '#78716c';
        farCtx.fillRect(wx - 14, wy - 20, 28, 5);
      });

      // MID: Forbidden City Gate of Supreme Harmony + Marble Balustrades
      midCtx.fillStyle = '#991b1b';
      midCtx.fillRect(260, GROUND_Y - 116, 440, 116);
      midCtx.fillStyle = '#dc2626';
      for (let px = 286; px <= 674; px += 38) {
        midCtx.fillRect(px, GROUND_Y - 106, 8, 106);
      }
      // White marble imperial balustrade & central dragon ramp
      midCtx.fillStyle = '#f5f5f4';
      midCtx.fillRect(252, GROUND_Y - 24, 456, 8);
      midCtx.fillRect(444, GROUND_Y - 24, 72, 24);

      midCtx.fillStyle = '#eab308';
      midCtx.beginPath();
      midCtx.moveTo(218, GROUND_Y - 110);
      midCtx.quadraticCurveTo(480, GROUND_Y - 158, 742, GROUND_Y - 110);
      midCtx.lineTo(714, GROUND_Y - 98);
      midCtx.lineTo(246, GROUND_Y - 98);
      midCtx.closePath();
      midCtx.fill();
      midCtx.beginPath();
      midCtx.moveTo(292, GROUND_Y - 144);
      midCtx.quadraticCurveTo(480, GROUND_Y - 198, 668, GROUND_Y - 144);
      midCtx.closePath();
      midCtx.fill();
      break;
    }

    case 'sydney': {
      fillSky(skyCtx, [
        [0, '#0c4a6e'],
        [0.42, '#0284c7'],
        [0.78, '#7dd3fc'],
        [1, '#e0f2fe']
      ]);

      // FAR: Clouds + Circular Quay CBD Skyline & Sydney Tower Eye
      paintCloudBank(farCtx, 210, 96, 0.9, '#ffffff', '#e0f2fe', '#93c5fd');
      paintCloudBank(farCtx, 780, 92, 0.86, '#ffffff', '#e0f2fe', '#93c5fd');
      paintDistantSkylineBand(farCtx, GROUND_Y - 68, 60, 140, '#1d4ed8', 'rgba(224, 242, 254, 0.35)', rand);
      // Sydney Tower golden turret
      farCtx.fillStyle = '#94a3b8';
      farCtx.fillRect(92, GROUND_Y - 248, 5, 180);
      farCtx.fillStyle = '#fbbf24';
      farCtx.fillRect(82, GROUND_Y - 258, 25, 12);
      farCtx.fillRect(93.5, GROUND_Y - 282, 2, 24);

      // MID: Sydney Harbour Bridge + Harbour Water + Opera House Shells
      midCtx.strokeStyle = '#475569';
      midCtx.lineWidth = 9;
      midCtx.beginPath();
      midCtx.arc(625, GROUND_Y - 62, 202, Math.PI, 0);
      midCtx.stroke();
      midCtx.strokeStyle = '#64748b';
      midCtx.lineWidth = 2;
      for (let bx = 448; bx <= 802; bx += 22) {
        const dy = Math.sqrt(Math.max(0, 202 * 202 - (bx - 625) * (bx - 625)));
        midCtx.beginPath();
        midCtx.moveTo(bx, GROUND_Y - 62);
        midCtx.lineTo(bx, GROUND_Y - 62 - dy);
        midCtx.stroke();
      }
      midCtx.fillStyle = '#64748b';
      midCtx.fillRect(408, GROUND_Y - 188, 26, 126);
      midCtx.fillRect(816, GROUND_Y - 188, 26, 126);

      const harb = midCtx.createLinearGradient(0, GROUND_Y - 70, 0, GROUND_Y);
      harb.addColorStop(0, '#0369a1');
      harb.addColorStop(1, '#1e3a8a');
      midCtx.fillStyle = harb;
      midCtx.fillRect(BLEED_L, GROUND_Y - 70, BLEED_W, 70);

      const sails: [number, number, number][] = [
        [152, 138, 96],
        [224, 178, 116],
        [308, 130, 88],
        [378, 150, 98]
      ];
      midCtx.fillStyle = '#94a3b8';
      midCtx.fillRect(140, GROUND_Y - 62, 348, 16);
      for (const [sx, sh, sw] of sails) {
        const sg = midCtx.createLinearGradient(sx, GROUND_Y - 62 - sh, sx + sw, GROUND_Y - 62);
        sg.addColorStop(0, '#ffffff');
        sg.addColorStop(0.7, '#e2e8f0');
        sg.addColorStop(1, '#94a3b8');
        midCtx.fillStyle = sg;
        midCtx.beginPath();
        midCtx.moveTo(sx, GROUND_Y - 62);
        midCtx.quadraticCurveTo(sx + sw * 0.24, GROUND_Y - 62 - sh, sx + sw, GROUND_Y - 62);
        midCtx.closePath();
        midCtx.fill();
        midCtx.strokeStyle = '#cbd5e1';
        midCtx.lineWidth = 1.6;
        midCtx.stroke();
      }
      break;
    }

    case 'honolulu': {
      fillSky(skyCtx, [
        [0, '#3b0764'],
        [0.35, '#db2777'],
        [0.68, '#f97316'],
        [0.92, '#fde047'],
        [1, '#fef9c3']
      ]);
      paintSunWithBloom(skyCtx, 480, 250, 68, '#fffbeb', '#fb923c', 'rgba(254, 240, 138, 0.46)', true);

      // FAR: Hawaiian Rainbow + Diamond Head crater + Star Launchpad silhouette (Story tie-in!)
      [
        'rgba(239,68,68,0.24)',
        'rgba(251,191,36,0.24)',
        'rgba(34,197,94,0.24)',
        'rgba(56,189,248,0.24)'
      ].forEach((col, i) => {
        farCtx.strokeStyle = col;
        farCtx.lineWidth = 9;
        farCtx.beginPath();
        farCtx.arc(480, GROUND_Y - 40, 348 - i * 9, Math.PI * 1.08, Math.PI * 1.92);
        farCtx.stroke();
      });

      paintSculptedMountain(farCtx, 465, 688, 995, 198, GROUND_Y - 82, '#334155', '#1e293b');
      // Subtle Aegis Space Launch Gantry behind Diamond Head!
      farCtx.strokeStyle = '#94a3b8';
      farCtx.lineWidth = 2;
      farCtx.strokeRect(832, GROUND_Y - 196, 14, 96);
      farCtx.fillStyle = '#f8fafc';
      farCtx.fillRect(852, GROUND_Y - 188, 7, 88);

      // MID: Waikiki Turquoise Ocean & Tiki Torches
      const oc = midCtx.createLinearGradient(0, GROUND_Y - 86, 0, GROUND_Y);
      oc.addColorStop(0, '#0284c7');
      oc.addColorStop(0.55, '#06b6d4');
      oc.addColorStop(1, '#2dd4bf');
      midCtx.fillStyle = oc;
      midCtx.fillRect(BLEED_L, GROUND_Y - 86, BLEED_W, 86);
      break;
    }

    case 'moon': {
      fillSky(skyCtx, [
        [0, '#010308'],
        [0.6, '#060a18'],
        [1, '#121a30']
      ]);
      paintNebulaWash(skyCtx, 310, 150, 340, 120, -0.35, 'rgba(99, 102, 241, 0.2)', 'rgba(56, 189, 248, 0.08)');
      paintNebulaWash(skyCtx, 610, 95, 120, 42, 0.4, 'rgba(232, 121, 249, 0.22)', 'rgba(99, 102, 241, 0.06)');

      // FAR: Jagged Lunar Ring Mountains
      paintSculptedMountain(farCtx, -60, 140, 360, 250, GROUND_Y - 46, '#475569', '#1e293b');
      paintSculptedMountain(farCtx, 420, 610, 820, 268, GROUND_Y - 46, '#475569', '#1e293b');

      // MID: Cratered Mare Tranquillitatis, Apollo Lander & Vesper's Lunar Relay Dish
      const lun = midCtx.createLinearGradient(0, GROUND_Y - 108, 0, GROUND_Y);
      lun.addColorStop(0, '#94a3b8');
      lun.addColorStop(0.5, '#64748b');
      lun.addColorStop(1, '#334155');
      midCtx.fillStyle = lun;
      midCtx.beginPath();
      midCtx.moveTo(BLEED_L, GROUND_Y - 56);
      midCtx.quadraticCurveTo(235, GROUND_Y - 106, 480, GROUND_Y - 52);
      midCtx.quadraticCurveTo(735, GROUND_Y - 114, BLEED_R, GROUND_Y - 58);
      midCtx.lineTo(BLEED_R, GROUND_Y);
      midCtx.lineTo(BLEED_L, GROUND_Y);
      midCtx.fill();

      [
        [155, GROUND_Y - 26, 42, 12],
        [435, GROUND_Y - 22, 56, 15],
        [755, GROUND_Y - 34, 46, 13]
      ].forEach(([cx, cy, rx, ry]) => {
        midCtx.fillStyle = '#334155';
        midCtx.beginPath();
        midCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        midCtx.fill();
        midCtx.strokeStyle = '#cbd5e1';
        midCtx.lineWidth = 1.6;
        midCtx.beginPath();
        midCtx.ellipse(cx, cy, rx, ry, 0, 0.15, Math.PI - 0.15);
        midCtx.stroke();
      });

      // Apollo Lunar Module
      midCtx.strokeStyle = '#cbd5e1';
      midCtx.lineWidth = 3;
      midCtx.beginPath();
      midCtx.moveTo(192, GROUND_Y - 72);
      midCtx.lineTo(170, GROUND_Y - 46);
      midCtx.moveTo(238, GROUND_Y - 72);
      midCtx.lineTo(260, GROUND_Y - 46);
      midCtx.stroke();
      midCtx.fillStyle = '#f59e0b';
      midCtx.fillRect(190, GROUND_Y - 84, 50, 20);
      midCtx.fillStyle = '#e2e8f0';
      midCtx.beginPath();
      midCtx.roundRect(196, GROUND_Y - 108, 38, 26, 6);
      midCtx.fill();
      midCtx.fillStyle = '#0f172a';
      midCtx.fillRect(206, GROUND_Y - 100, 16, 9);

      // Vesper's Crystalline Relay Dish on right ridge
      midCtx.strokeStyle = '#c084fc';
      midCtx.lineWidth = 3;
      midCtx.beginPath();
      midCtx.moveTo(812, GROUND_Y - 78);
      midCtx.lineTo(812, GROUND_Y - 122);
      midCtx.stroke();
      midCtx.beginPath();
      midCtx.arc(812, GROUND_Y - 132, 22, 0.25, Math.PI - 0.25);
      midCtx.stroke();
      break;
    }

    case 'mars':
    default: {
      fillSky(skyCtx, [
        [0, '#0f0308'],
        [0.4, '#4c1115'],
        [0.74, '#9a3412'],
        [1, '#ea580c']
      ]);
      paintNebulaWash(skyCtx, 480, 145, 290, 110, 0, 'rgba(249, 115, 22, 0.26)', 'rgba(244, 63, 94, 0.1)');

      // Phobos & Deimos moons
      skyCtx.fillStyle = '#e7e5e4';
      skyCtx.beginPath();
      skyCtx.arc(204, 108, 22, 0, Math.PI * 2);
      skyCtx.fill();
      skyCtx.fillStyle = '#a8a29e';
      skyCtx.beginPath();
      skyCtx.arc(198, 104, 6, 0, Math.PI * 2);
      skyCtx.arc(212, 114, 4, 0, Math.PI * 2);
      skyCtx.fill();

      skyCtx.fillStyle = '#d6d3d1';
      skyCtx.beginPath();
      skyCtx.arc(796, 86, 11, 0, Math.PI * 2);
      skyCtx.fill();

      // FAR: Colossal Olympus Mons shield volcano + Vesper's Citadel Spire
      paintSculptedMountain(farCtx, 110, 480, 850, 152, GROUND_Y - 52, '#7c2d12', '#431407');
      // Glowing Prisma core fissure on Olympus Mons
      farCtx.strokeStyle = '#fb923c';
      farCtx.lineWidth = 3;
      farCtx.beginPath();
      farCtx.moveTo(480, 154);
      farCtx.lineTo(466, 215);
      farCtx.lineTo(488, 265);
      farCtx.stroke();

      // MID: Valles Marineris red mesas & canyon floor
      midCtx.fillStyle = '#9a3412';
      midCtx.beginPath();
      midCtx.moveTo(BLEED_L, GROUND_Y);
      midCtx.lineTo(BLEED_L, GROUND_Y - 115);
      midCtx.lineTo(145, GROUND_Y - 115);
      midCtx.lineTo(195, GROUND_Y - 58);
      midCtx.lineTo(355, GROUND_Y - 58);
      midCtx.lineTo(420, GROUND_Y - 130);
      midCtx.lineTo(595, GROUND_Y - 130);
      midCtx.lineTo(655, GROUND_Y - 62);
      midCtx.lineTo(818, GROUND_Y - 104);
      midCtx.lineTo(BLEED_R, GROUND_Y - 104);
      midCtx.lineTo(BLEED_R, GROUND_Y);
      midCtx.closePath();
      midCtx.fill();

      midCtx.fillStyle = 'rgba(253, 186, 116, 0.16)';
      midCtx.fillRect(BLEED_L, GROUND_Y - 94, BLEED_W, 5);
      midCtx.fillRect(BLEED_L, GROUND_Y - 72, BLEED_W, 4);

      const mFloor = midCtx.createLinearGradient(0, GROUND_Y - 48, 0, GROUND_Y);
      mFloor.addColorStop(0, '#c2410c');
      mFloor.addColorStop(1, '#7c2d12');
      midCtx.fillStyle = mFloor;
      midCtx.fillRect(BLEED_L, GROUND_Y - 48, BLEED_W, 48);
      break;
    }
  }
}

// =========================================================================
// PART 2: MULTI-PLANE PARALLAX COMPOSITOR & LIVE 60FPS ANIMATIONS
// =========================================================================
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  theme: ThemeId,
  bgTime: number,
  freezeTimer: number,
  cameraNormX = 0
): void {
  const cam = Math.max(-1, Math.min(1, cameraNormX));
  const skyShift = -cam * 6;
  const farShift = -cam * 17;
  const midShift = -cam * 30;
  const foreShift = -cam * 42;

  const layers = getOrRenderParallaxLayers(theme);

  // 1. Blit Sky + Far + Mid cached offscreen canvases with 3D depth parallax
  ctx.drawImage(layers.sky, -PARALLAX_PAD + skyShift, 0);
  ctx.drawImage(layers.far, -PARALLAX_PAD + farShift, 0);
  ctx.drawImage(layers.mid, -PARALLAX_PAD + midShift, 0);

  // 2. Live destination-specific midground animation (locked to midShift)
  const t = bgTime;
  ctx.save();
  ctx.translate(midShift, 0);

  switch (theme) {
    case 'fuji': {
      // Drifting mist collar around Mt. Fuji
      ctx.fillStyle = 'rgba(255, 241, 214, 0.15)';
      const mistX = ((t * 14) % (WORLD_W + 260)) - 130;
      ctx.beginPath();
      ctx.ellipse(mistX, 294, 150, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      drawWaterShimmer(ctx, 480, GROUND_Y - 68, 6, 10, 118, 'rgba(253, 224, 71, 0.48)', t);

      // Gentle wooden fishing skiff bobbing on Lake Kawaguchiko
      const skiffX = 335 + Math.sin(t * 0.7) * 14;
      const skiffY = GROUND_Y - 34 + Math.sin(t * 2.4) * 2;
      ctx.fillStyle = '#291528';
      ctx.beginPath();
      ctx.moveTo(skiffX - 20, skiffY);
      ctx.quadraticCurveTo(skiffX, skiffY + 8, skiffX + 22, skiffY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(skiffX + 14, skiffY - 4, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'pyramids': {
      const carX = ((t * 16) % (WORLD_W + 240)) - 180;
      ctx.fillStyle = '#451a03';
      for (let c = 0; c < 4; c++) {
        const cx = carX + c * 42;
        const cy = GROUND_Y - 22 - Math.abs(Math.sin(t * 4 + c)) * 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 11, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy - 6, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx + 9, cy - 11, 3.5, 11);
        ctx.beginPath();
        ctx.arc(cx + 12, cy - 12, 3.2, 0, Math.PI * 2);
        ctx.fill();
        const stride = Math.sin(t * 5 + c) * 3;
        ctx.fillRect(cx - 7 + stride, cy + 4, 2.2, 11);
        ctx.fillRect(cx + 5 - stride, cy + 4, 2.2, 11);
      }
      break;
    }

    case 'neon': {
      // Hover-car parallax traffic
      for (let i = 0; i < 6; i++) {
        const dir = i % 2 === 0 ? 1 : -1;
        const speed = 78 + (i % 3) * 38;
        const fx =
          dir > 0
            ? ((t * speed + i * 190) % (WORLD_W + 120)) - 60
            : WORLD_W + 60 - ((t * speed + i * 170) % (WORLD_W + 120));
        const fy = 118 + i * 36;
        ctx.fillStyle = dir > 0 ? '#22d3ee' : '#f43f5e';
        ctx.fillRect(fx, fy, 16, 3.5);
        ctx.fillStyle = dir > 0 ? 'rgba(34,211,238,0.28)' : 'rgba(244,63,94,0.28)';
        ctx.fillRect(fx - dir * 34, fy + 0.5, 34, 2.5);
      }

      // Shinkansen Monorail with lit windows
      const mx = ((t * 145) % (WORLD_W + 260)) - 180;
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(mx, GROUND_Y - 75, 136, 14, 5);
      ctx.fill();
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(mx + 10, GROUND_Y - 71, 114, 4.5);

      // Flickering vertical neon signboards
      [
        [178, 224, '#f43f5e'],
        [648, 250, '#fde047'],
        [834, 210, '#22d3ee']
      ].forEach(([sx, sy, col], idx) => {
        if (Math.sin(t * 7 + idx * 2.3) > -0.65) {
          ctx.fillStyle = col as string;
          ctx.fillRect(sx as number, sy as number, 11, 58);
          ctx.fillStyle = '#ffffff';
          for (let k = 0; k < 4; k++) {
            ctx.fillRect((sx as number) + 2, (sy as number) + 6 + k * 13, 7, 5);
          }
        }
      });
      break;
    }

    case 'alps': {
      drawTwinklingStars(ctx, t, GROUND_Y * 0.55);

      // Aurora Borealis ribbons
      for (let band = 0; band < 3; band++) {
        const ag = ctx.createLinearGradient(0, 38 + band * 24, 0, 185 + band * 22);
        ag.addColorStop(0, 'rgba(45, 212, 191, 0)');
        ag.addColorStop(0.5, band === 1 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(45, 212, 191, 0.32)');
        ag.addColorStop(1, 'rgba(45, 212, 191, 0)');
        ctx.fillStyle = ag;
        ctx.beginPath();
        ctx.moveTo(BLEED_L, 190);
        for (let x = BLEED_L; x <= BLEED_R; x += 30) {
          const y = 84 + band * 26 + Math.sin(x * 0.008 + t * (1.1 + band * 0.35) + band) * 24;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(BLEED_R, 215);
        ctx.lineTo(BLEED_L, 215);
        ctx.closePath();
        ctx.fill();
      }

      const trainX = 280 + ((t * 52) % 420) - 40;
      if (trainX > 260 && trainX < 670) {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(trainX, GROUND_Y - 110, 68, 12);
        ctx.fillStyle = '#fef08a';
        for (let w = 0; w < 5; w++) ctx.fillRect(trainX + 6 + w * 12, GROUND_Y - 107, 8, 5);
      }

      ctx.fillStyle = 'rgba(226, 232, 240, 0.35)';
      [154, 832].forEach((cx, idx) => {
        for (let s = 0; s < 3; s++) {
          const sy = GROUND_Y - 90 - ((t * 22 + s * 16 + idx * 9) % 46);
          ctx.beginPath();
          ctx.arc(cx + Math.sin(t * 2 + s) * 6, sy, 4.5 + s * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      break;
    }

    case 'caribbean': {
      drawWaterShimmer(ctx, 480, GROUND_Y - 134, 6, 15, 114, 'rgba(255, 243, 176, 0.5)', t);

      // Gently rocking sailboat anchored in bay
      const boatX = 335 + Math.sin(t * 0.8) * 6;
      const boatY = GROUND_Y - 112 + Math.sin(t * 2.1) * 2.5;
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.moveTo(boatX, boatY);
      ctx.lineTo(boatX, boatY - 36);
      ctx.lineTo(boatX + 18, boatY - 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.fillRect(boatX - 10, boatY, 28, 6);

      const waveShift = Math.sin(t * 2.8) * 6;
      ctx.fillStyle = 'rgba(255,255,255,0.76)';
      ctx.beginPath();
      ctx.moveTo(BLEED_L, GROUND_Y - 24 + waveShift);
      for (let x = BLEED_L; x <= BLEED_R; x += 40) {
        ctx.quadraticCurveTo(x + 20, GROUND_Y - 32 + waveShift, x + 40, GROUND_Y - 24 + waveShift);
      }
      ctx.lineTo(BLEED_R, GROUND_Y - 18 + waveShift);
      ctx.lineTo(BLEED_L, GROUND_Y - 18 + waveShift);
      ctx.closePath();
      ctx.fill();

      for (let b = 0; b < 4; b++) {
        const bx = ((t * (42 + b * 7) + b * 240) % (WORLD_W + 80)) - 40;
        const by = 88 + b * 24 + Math.sin(t * 2.5 + b) * 10;
        drawBird(ctx, bx, by, 10, t * 7 + b * 1.4, '#240046');
      }
      break;
    }

    case 'temple': {
      drawWaterShimmer(ctx, 480, GROUND_Y - 20, 3, 6, 130, 'rgba(253, 224, 71, 0.35)', t);

      [110, 240, 720, 850].forEach((px, idx) => {
        const h = idx === 0 || idx === 3 ? 168 : 126;
        const fy = GROUND_Y - h - 4;
        const fh = 24 + Math.sin(t * 16 + idx * 2.1) * 5;
        ctx.fillStyle = 'rgba(251, 146, 60, 0.26)';
        ctx.beginPath();
        ctx.arc(px, fy - 10, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(px - 10, fy);
        ctx.quadraticCurveTo(px, fy - fh - 6, px + 10, fy);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(px - 5, fy);
        ctx.quadraticCurveTo(px, fy - fh * 0.65, px + 5, fy);
        ctx.closePath();
        ctx.fill();
      });
      break;
    }

    case 'rio': {
      ctx.fillStyle = 'rgba(255,255,255,0.46)';
      for (let i = 0; i < 10; i++) {
        const sx = (i * 104 + Math.sin(t * 2 + i) * 14) % WORLD_W;
        ctx.fillRect(sx, GROUND_Y - 70 + (i % 3) * 14, 24, 2.5);
      }

      // Bondinho cable car between Morro da Urca & Sugarloaf
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(615, 232);
      ctx.lineTo(788, 160);
      ctx.stroke();

      const cableT = (Math.sin(t * 0.65) + 1) * 0.5;
      const bx = 615 + (788 - 615) * cableT;
      const by = 232 + (160 - 232) * cableT;
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.fillRect(bx - 11, by + 4, 22, 13);
      ctx.strokeRect(bx - 11, by + 4, 22, 13);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(bx - 8, by + 6, 16, 5);

      const gx = ((t * 58) % (WORLD_W + 140)) - 70;
      const gy = 104 + Math.sin(t * 1.8) * 14;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(gx + 22, gy);
      ctx.lineTo(gx - 12, gy - 10);
      ctx.lineTo(gx - 6, gy + 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(gx + 22, gy);
      ctx.lineTo(gx - 6, gy + 6);
      ctx.lineTo(gx + 4, gy + 10);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'saopaulo': {
      drawTwinklingStars(ctx, t, 230);

      [125, 276, 845].forEach((tx, idx) => {
        const baseH = idx === 0 ? 288 : idx === 1 ? 314 : 318;
        if (Math.sin(t * 5 + idx) > 0) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(tx, GROUND_Y - baseH - 44, 3.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      const cableGlow = `hsl(${(t * 28) % 360}, 92%, 68%)`;
      ctx.strokeStyle = cableGlow;
      ctx.lineWidth = 2.2;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(480, 144 + i * 16);
        ctx.lineTo(306 + i * 18, GROUND_Y - 50);
        ctx.moveTo(480, 144 + i * 16);
        ctx.lineTo(654 - i * 18, GROUND_Y - 50);
        ctx.stroke();
      }
      drawWaterShimmer(ctx, 480, GROUND_Y - 38, 4, 8, 120, 'rgba(56, 189, 248, 0.25)', t);

      for (let f = 0; f < 5; f++) {
        const fx = ((t * 195 + f * 185) % (WORLD_W + 90)) - 45;
        ctx.fillStyle = f % 2 === 0 ? 'rgba(254, 240, 138, 0.85)' : 'rgba(244, 63, 94, 0.85)';
        ctx.fillRect(fx, GROUND_Y - 14 - (f % 2) * 8, 38, 3);
      }

      const hx = WORLD_W + 60 - ((t * 72) % (WORLD_W + 140));
      const hy = 96 + Math.sin(t * 3) * 6;
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(hx, hy, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(hx + 10, hy - 2, 16, 3);
      ctx.fillRect(hx + 24, hy - 7, 3, 8);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      const rotW = 16 + Math.sin(t * 48) * 10;
      ctx.beginPath();
      ctx.moveTo(hx - rotW, hy - 9);
      ctx.lineTo(hx + rotW, hy - 9);
      ctx.stroke();
      break;
    }

    case 'buenosaires': {
      // Glowing festive string bulbs across La Boca street
      for (let b = 0; b < 9; b++) {
        const frac = (b + 1) / 10;
        const bx = 316 + (644 - 316) * frac;
        const by = GROUND_Y - 150 + Math.sin(frac * Math.PI) * 21;
        ctx.fillStyle = b % 2 === 0 ? '#fde047' : '#fb7185';
        ctx.beginPath();
        ctx.arc(bx, by + 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      [346, 614].forEach((lx) => {
        const r = 24 + Math.sin(t * 6 + lx) * 2;
        ctx.fillStyle = 'rgba(254, 240, 138, 0.28)';
        ctx.beginPath();
        ctx.arc(lx, GROUND_Y - 98, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(lx, GROUND_Y - 98, 6, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'machupicchu': {
      ctx.fillStyle = 'rgba(255,255,255,0.48)';
      for (let c = 0; c < 4; c++) {
        const cx = ((t * (16 + c * 4) + c * 260) % (WORLD_W + 260)) - 130;
        const cy = 192 + (c % 2) * 48;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 118, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 58, cy - 10, 74, 18, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      const cx = ((t * 50) % (WORLD_W + 140)) - 70;
      const cy = 104 + Math.sin(t * 1.4) * 16;
      drawBird(ctx, cx, cy, 22, t * 3.2, '#1c1917');
      break;
    }

    case 'habana': {
      // Rotating El Morro lighthouse beam
      const beamAlpha = Math.max(0, Math.sin(t * 1.8)) * 0.22;
      if (beamAlpha > 0.02) {
        ctx.fillStyle = `rgba(254, 240, 138, ${beamAlpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.moveTo(581, GROUND_Y - 134);
        ctx.lineTo(390, GROUND_Y - 190);
        ctx.lineTo(390, GROUND_Y - 150);
        ctx.closePath();
        ctx.fill();
      }

      (
        [
          [0, '#22d3ee', 78, 1],
          [460, '#fb7185', 64, -1]
        ] as [number, string, number, number][]
      ).forEach(([off, col, spd, dir]) => {
        const x =
          dir > 0
            ? ((t * spd + off) % (WORLD_W + 180)) - 120
            : WORLD_W + 120 - ((t * spd + off) % (WORLD_W + 180));
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.roundRect(x, GROUND_Y - 40, 88, 18, 6);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(x + 20, GROUND_Y - 52, 44, 15, 7);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(x + 20, GROUND_Y - 22, 8, 0, Math.PI * 2);
        ctx.arc(x + 68, GROUND_Y - 22, 8, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'vegas': {
      drawTwinklingStars(ctx, t, 200);

      for (let s = 0; s < 3; s++) {
        const bx = 200 + s * 280;
        const ang = Math.sin(t * (1.2 + s * 0.4) + s * 2) * 0.42;
        ctx.save();
        ctx.translate(bx, GROUND_Y);
        ctx.rotate(ang);
        const sg = ctx.createLinearGradient(0, 0, 0, -440);
        sg.addColorStop(0, 'rgba(254, 240, 138, 0.24)');
        sg.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-56, -440);
        ctx.lineTo(56, -440);
        ctx.lineTo(10, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.fillStyle = 'rgba(34, 211, 238, 0.22)';
      ctx.beginPath();
      ctx.moveTo(206, GROUND_Y - 160);
      ctx.lineTo(182, 0);
      ctx.lineTo(242, 0);
      ctx.lineTo(218, GROUND_Y - 160);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = Math.sin(t * 9) > 0 ? '#fde047' : '#22d3ee';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(480, 120);
      ctx.lineTo(620, 185);
      ctx.lineTo(480, 250);
      ctx.lineTo(340, 185);
      ctx.closePath();
      ctx.stroke();

      // Parabolic choreographed Bellagio fountain arcs
      for (let f = 0; f < 13; f++) {
        const fh = 32 + Math.abs(Math.sin(t * 4.2 + f * 0.55)) * 74;
        const fx = 340 + f * 23;
        const sway = Math.sin(t * 2.5 + f * 0.4) * 14;
        ctx.strokeStyle = f % 2 === 0 ? 'rgba(186, 230, 253, 0.86)' : 'rgba(254, 240, 138, 0.86)';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(fx, GROUND_Y - 12);
        ctx.quadraticCurveTo(fx + sway * 0.5, GROUND_Y - 12 - fh, fx + sway, GROUND_Y - 12 - fh * 0.72);
        ctx.stroke();
      }
      break;
    }

    case 'nyc': {
      drawTwinklingStars(ctx, t, 190);

      const bx = ((t * 28) % (WORLD_W + 160)) - 80;
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.ellipse(bx, 84, 38, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(bx - 18, 82, 36, 4);
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx - 10, 97, 20, 5);

      const flameR = 8 + Math.sin(t * 11) * 2.2;
      ctx.fillStyle = 'rgba(254, 240, 138, 0.34)';
      ctx.beginPath();
      ctx.arc(171.5, GROUND_Y - 230, flameR * 2.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(171.5, GROUND_Y - 230, flameR, 0, Math.PI * 2);
      ctx.fill();

      for (let c = 0; c < 3; c++) {
        const tx = ((t * (88 + c * 22) + c * 310) % (WORLD_W + 120)) - 60;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.roundRect(tx, GROUND_Y - 22, 48, 14, 4);
        ctx.fill();
        ctx.fillRect(tx + 10, GROUND_Y - 30, 26, 10);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(tx + 12, GROUND_Y - 8, 5, 0, Math.PI * 2);
        ctx.arc(tx + 36, GROUND_Y - 8, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'madrid': {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.88)';
      ctx.lineWidth = 3;
      for (let j = -2; j <= 2; j++) {
        const jh = 28 + Math.sin(t * 7 + j) * 8;
        ctx.beginPath();
        ctx.moveTo(480 + j * 22, GROUND_Y - 22);
        ctx.quadraticCurveTo(480 + j * 28, GROUND_Y - 22 - jh, 480 + j * 36, GROUND_Y - 18);
        ctx.stroke();
      }

      for (let b = 0; b < 5; b++) {
        const px = ((t * (54 + b * 8) + b * 210) % (WORLD_W + 90)) - 45;
        const py = 82 + b * 22 + Math.sin(t * 3 + b) * 10;
        drawBird(ctx, px, py, 10, t * 9 + b, '#ffffff');
      }
      break;
    }

    case 'london': {
      // Big Ben live clock hands
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(480, GROUND_Y - 238);
      ctx.lineTo(480, GROUND_Y - 254);
      ctx.moveTo(480, GROUND_Y - 238);
      ctx.lineTo(480 + Math.cos(t * 0.2) * 13, GROUND_Y - 238 + Math.sin(t * 0.2) * 13);
      ctx.stroke();

      // Rotating London Eye
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(216, GROUND_Y - 148, 96, 0, Math.PI * 2);
      ctx.stroke();
      for (let a = 0; a < 12; a++) {
        const ang = (a * Math.PI) / 6 + t * 0.25;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(216, GROUND_Y - 148);
        ctx.lineTo(216 + Math.cos(ang) * 96, GROUND_Y - 148 + Math.sin(ang) * 96);
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(216 + Math.cos(ang) * 96, GROUND_Y - 148 + Math.sin(ang) * 96, 4.2, 0, Math.PI * 2);
        ctx.fill();
      }

      const busX = ((t * 68) % (WORLD_W + 140)) - 90;
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(busX, GROUND_Y - 78, 66, 30, 5);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(busX + 6, GROUND_Y - 73, 52, 8);
      ctx.fillRect(busX + 6, GROUND_Y - 61, 46, 8);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(busX + 14, GROUND_Y - 48, 5, 0, Math.PI * 2);
      ctx.arc(busX + 52, GROUND_Y - 48, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'rome': {
      [88, 142, 824, 878].forEach((cx, i) => {
        const sway = Math.sin(t * 1.9 + i) * 5;
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.ellipse(cx + sway, GROUND_Y - 78, 15, 76, sway * 0.015, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let b = 0; b < 6; b++) {
        const prog = ((t * 0.22 + b * 0.05) % 1.2) - 0.1;
        const bx = prog * WORLD_W;
        const by = 136 - Math.sin(prog * Math.PI) * 75 + (b % 3) * 14;
        drawBird(ctx, bx, by, 8.5, t * 10 + b, '#292524');
      }
      break;
    }

    case 'moscow': {
      drawTwinklingStars(ctx, t, 220);
      // Warm upward cathedral floodlight glow
      const glow = ctx.createRadialGradient(480, GROUND_Y - 60, 20, 480, GROUND_Y - 180, 240);
      glow.addColorStop(0, 'rgba(251, 191, 36, 0.16)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(220, GROUND_Y - 320, 520, 320);
      break;
    }

    case 'delhi': {
      drawWaterShimmer(ctx, 480, GROUND_Y - 54, 5, 10, 170, 'rgba(255, 251, 235, 0.38)', t);
      for (let b = 0; b < 3; b++) {
        drawBird(ctx, ((t * 48 + b * 290) % (WORLD_W + 80)) - 40, 108 + b * 24, 9, t * 7 + b, '#451a03');
      }
      break;
    }

    case 'bangkok': {
      drawTwinklingStars(ctx, t, 220);
      drawWaterShimmer(ctx, 480, GROUND_Y - 58, 5, 11, 138, 'rgba(251, 191, 36, 0.38)', t);

      (
        [
          [0, 44, 1],
          [480, 38, -1]
        ] as [number, number, number][]
      ).forEach(([off, spd, dir]) => {
        const bx =
          dir > 0
            ? ((t * spd + off) % (WORLD_W + 120)) - 60
            : WORLD_W + 60 - ((t * spd + off) % (WORLD_W + 120));
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(bx - 28, GROUND_Y - 28);
        ctx.quadraticCurveTo(bx, GROUND_Y - 14, bx + 28, GROUND_Y - 28);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(bx, GROUND_Y - 34, 4.2, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'beijing': {
      const dx = ((t * 62) % (WORLD_W + 260)) - 130;
      for (let seg = 0; seg < 11; seg++) {
        const sx = dx - seg * 15;
        const sy = 128 + Math.sin(t * 5.5 - seg * 0.65) * 16;
        ctx.fillStyle = seg === 0 ? '#fde047' : seg % 2 === 0 ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(sx, sy, seg === 0 ? 10.5 : 6.8 - seg * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'sydney': {
      const fwCols = ['255, 240, 150', '56, 189, 248', '244, 114, 182'];
      for (let f = 0; f < 3; f++) {
        const pulse = (t * 0.85 + f * 0.33) % 1;
        if (pulse < 0.72) {
          const fx = 160 + f * 310;
          const fy = 92 + (f % 2) * 34;
          const fr = pulse * 40;
          ctx.strokeStyle = `rgba(${fwCols[f]}, ${(0.75 - pulse).toFixed(2)})`;
          ctx.lineWidth = 2;
          for (let a = 0; a < 10; a++) {
            const ang = (a * Math.PI) / 5;
            ctx.beginPath();
            ctx.moveTo(fx + Math.cos(ang) * fr * 0.35, fy + Math.sin(ang) * fr * 0.35);
            ctx.lineTo(fx + Math.cos(ang) * fr, fy + Math.sin(ang) * fr);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = 'rgba(255,255,255,0.44)';
      for (let i = 0; i < 9; i++) {
        ctx.fillRect((i * 110 + t * 18) % WORLD_W, GROUND_Y - 54 + (i % 3) * 14, 24, 2.5);
      }

      (
        [
          [0, 26, 1],
          [420, 20, -1]
        ] as [number, number, number][]
      ).forEach(([off, spd, dir]) => {
        const vx =
          dir > 0
            ? ((t * spd + off) % (WORLD_W + 90)) - 45
            : WORLD_W + 45 - ((t * spd + off) % (WORLD_W + 90));
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(vx, GROUND_Y - 26);
        ctx.lineTo(vx, GROUND_Y - 56);
        ctx.lineTo(vx + dir * 20, GROUND_Y - 26);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(vx - 12, GROUND_Y - 26, 26, 6);
      });
      break;
    }

    case 'honolulu': {
      const wShift = Math.sin(t * 3.2) * 7;
      ctx.fillStyle = 'rgba(255,255,255,0.76)';
      ctx.beginPath();
      ctx.moveTo(BLEED_L, GROUND_Y - 30 + wShift);
      for (let x = BLEED_L; x <= BLEED_R; x += 48) {
        ctx.quadraticCurveTo(x + 24, GROUND_Y - 42 + wShift, x + 48, GROUND_Y - 30 + wShift);
      }
      ctx.lineTo(BLEED_R, GROUND_Y - 22 + wShift);
      ctx.lineTo(BLEED_L, GROUND_Y - 22 + wShift);
      ctx.closePath();
      ctx.fill();

      const sx = ((t * 64) % (WORLD_W + 100)) - 50;
      const sy = GROUND_Y - 42 + Math.sin(sx * 0.04 + t * 3) * 4;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.ellipse(sx, sy + 6, 14, 3, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(sx - 2, sy - 6, 4, 12);
      ctx.beginPath();
      ctx.arc(sx, sy - 9, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'moon': {
      drawTwinklingStars(ctx, t, GROUND_Y - 48);

      if (SHOOTING_STAR.life > 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(SHOOTING_STAR.x, SHOOTING_STAR.y);
        ctx.lineTo(
          SHOOTING_STAR.x - SHOOTING_STAR.vx * 0.14,
          SHOOTING_STAR.y - SHOOTING_STAR.vy * 0.14
        );
        ctx.stroke();
      }

      // Rotating Earthrise
      ctx.save();
      ctx.beginPath();
      ctx.arc(750, 138, 68, 0, Math.PI * 2);
      ctx.clip();
      const eg = ctx.createRadialGradient(730, 118, 12, 750, 138, 70);
      eg.addColorStop(0, '#bae6fd');
      eg.addColorStop(0.55, '#0284c7');
      eg.addColorStop(1, '#082f49');
      ctx.fillStyle = eg;
      ctx.fillRect(680, 68, 140, 140);

      const rotShift = (t * 8) % 160;
      ctx.fillStyle = '#2ec4b6';
      ctx.beginPath();
      ctx.ellipse(690 + rotShift, 128, 25, 16, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(760 + rotShift - 160, 152, 21, 14, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.beginPath();
      ctx.ellipse(720 + ((t * 11) % 150) - 70, 116, 28, 7, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(125, 211, 252, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(750, 138, 68, 0, Math.PI * 2);
      ctx.stroke();

      // Pulsing Vesper relay beacon
      if (Math.sin(t * 7) > -0.2) {
        ctx.fillStyle = 'rgba(192, 132, 252, 0.45)';
        ctx.beginPath();
        ctx.arc(812, GROUND_Y - 140, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'mars':
    default: {
      drawTwinklingStars(ctx, t, 215);

      // Pulsing Olympus Mons Prisma energy column!
      const coreAlpha = 0.14 + Math.abs(Math.sin(t * 3.2)) * 0.14;
      ctx.fillStyle = `rgba(251, 146, 60, ${coreAlpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.moveTo(468, 154);
      ctx.lineTo(446, 0);
      ctx.lineTo(514, 0);
      ctx.lineTo(492, 154);
      ctx.closePath();
      ctx.fill();

      const rx = ((t * 22) % (WORLD_W + 120)) - 60;
      const ry = GROUND_Y - 46;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(rx - 18, ry - 16, 36, 10);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rx + 8, ry - 16);
      ctx.lineTo(rx + 12, ry - 30);
      ctx.stroke();
      ctx.fillStyle = Math.sin(t * 9) > 0 ? '#22d3ee' : '#ef4444';
      ctx.beginPath();
      ctx.arc(rx + 12, ry - 32, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      [-12, 0, 12].forEach((wx) => {
        ctx.beginPath();
        ctx.arc(rx + wx, ry - 4, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
  }
  ctx.restore();

  // 3. Foreground Parallax Layer (Framing Palms, Hanging Silk Lanterns, Sky Lanterns & Weather)
  ctx.save();
  ctx.translate(foreShift, 0);
  if (theme === 'caribbean' || theme === 'honolulu') {
    drawSwayingPalm(ctx, 64, 1, 204, 0.2, t);
    drawSwayingPalm(ctx, 896, -1, 196, 1.7, t);
  } else if (theme === 'habana') {
    drawSwayingPalm(ctx, 912, -1, 174, 0.8, t);
  } else if (theme === 'beijing') {
    for (let i = 0; i < 6; i++) {
      const lx = 110 + i * 148;
      const swing = Math.sin(t * 2.4 + i) * 7;
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx, 14);
      ctx.lineTo(lx + swing, 62);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(lx + swing, 74, 15, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.fillRect(lx + swing - 7, 54, 14, 4);
      ctx.fillRect(lx + swing - 7, 92, 14, 4);
    }
  }
  ctx.restore();

  // 4. Screen-space Ambient Weather Particles (Petals, Rain, Snow, Lanterns, Dust)
  if (theme === 'fuji') {
    ctx.fillStyle = '#fbcfe8';
    for (const p of PETALS) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else if (theme === 'delhi' || theme === 'beijing') {
    ctx.fillStyle = theme === 'delhi' ? '#fda4af' : '#fecdd3';
    PETALS.slice(0, 16).forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.9, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (theme === 'buenosaires') {
    ctx.font = 'bold 16px sans-serif';
    PETALS.slice(0, 12).forEach((p, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(255, 243, 176, 0.85)' : 'rgba(255, 179, 198, 0.82)';
      ctx.fillText(idx % 2 === 0 ? '♪' : '♫', p.x, p.y);
    });
  } else if (theme === 'alps' || theme === 'moscow') {
    for (const f of SNOW_FLAKES) {
      ctx.fillStyle = `rgba(255,255,255,${(0.38 + f.depth * 0.48).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * (theme === 'moscow' ? f.depth : 0.85), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (theme === 'neon' || theme === 'london') {
    if (theme === 'london') {
      ctx.fillStyle = 'rgba(226, 232, 240, 0.13)';
      ctx.fillRect(0, GROUND_Y - 110, WORLD_W, 110);
    }
    ctx.strokeStyle = theme === 'neon' ? 'rgba(56, 189, 248, 0.34)' : 'rgba(226, 232, 240, 0.3)';
    ctx.lineWidth = theme === 'neon' ? 1.2 : 1;
    ctx.beginPath();
    const limit = theme === 'neon' ? RAIN_DROPS.length : 60;
    for (let i = 0; i < limit; i++) {
      const r = RAIN_DROPS[i];
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - (theme === 'neon' ? 3.2 : 2), r.y + r.len);
    }
    ctx.stroke();
  } else if (theme === 'pyramids' || theme === 'mars' || theme === 'temple') {
    for (const d of DUST_PARTICLES) {
      if (theme === 'temple') {
        ctx.fillStyle = 'rgba(254, 240, 138, 0.78)';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 0.9, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle =
          theme === 'mars'
            ? `rgba(253, 186, 116, ${d.alpha.toFixed(2)})`
            : 'rgba(255, 237, 179, 0.48)';
        ctx.fillRect(d.x, d.y, d.r * (theme === 'mars' ? 3.8 : 2.1), 1.5);
      }
    }
  } else if (theme === 'bangkok') {
    for (const l of SKY_LANTERNS) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
      ctx.beginPath();
      ctx.arc(l.x, l.y, 15 * l.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(l.x - 6 * l.scale, l.y - 9 * l.scale, 12 * l.scale, 18 * l.scale, 4);
      ctx.fill();
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(l.x, l.y + 4 * l.scale, 3 * l.scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. Volumetric Sunbeams, Atmospheric Vignette & Floor Contrast Grounding
  paintLiveAtmosphericFinish(ctx, theme, bgTime, 0.21);

  // 6. Time-Freeze crystalline wash
  if (freezeTimer > 0) {
    ctx.fillStyle = 'rgba(125, 211, 252, 0.16)';
    ctx.fillRect(0, 0, WORLD_W, GROUND_Y);
  }
}

// =========================================================================
// PART 3: THEME-MATCHED ARCHITECTURAL ARENA FLOOR & PERIMETER FRAME
// =========================================================================
export function drawArenaFrame(
  ctx: CanvasRenderingContext2D,
  theme: ThemeId,
  cameraNormX = 0
): void {
  const floorGrad = ctx.createLinearGradient(0, GROUND_Y, 0, WORLD_H);
  let accentTrim = '#60a5fa';
  let tileLine = 'rgba(255,255,255,0.12)';

  if (theme === 'moon') {
    floorGrad.addColorStop(0, '#94a3b8');
    floorGrad.addColorStop(0.35, '#64748b');
    floorGrad.addColorStop(1, '#1e293b');
    accentTrim = '#bae6fd';
  } else if (theme === 'mars') {
    floorGrad.addColorStop(0, '#c2410c');
    floorGrad.addColorStop(0.4, '#7c2d12');
    floorGrad.addColorStop(1, '#431407');
    accentTrim = '#fb923c';
  } else if (['pyramids', 'temple', 'rome', 'madrid', 'delhi'].includes(theme)) {
    floorGrad.addColorStop(0, '#b45309');
    floorGrad.addColorStop(0.35, '#78350f');
    floorGrad.addColorStop(1, '#3b1806');
    accentTrim = '#fbbf24';
  } else if (['neon', 'vegas', 'saopaulo'].includes(theme)) {
    floorGrad.addColorStop(0, '#1e1b4b');
    floorGrad.addColorStop(0.35, '#0f172a');
    floorGrad.addColorStop(1, '#020617');
    accentTrim = '#22d3ee';
    tileLine = 'rgba(34, 211, 238, 0.18)';
  } else if (['caribbean', 'honolulu', 'rio'].includes(theme)) {
    floorGrad.addColorStop(0, '#d97706');
    floorGrad.addColorStop(0.35, '#92400e');
    floorGrad.addColorStop(1, '#451a03');
    accentTrim = '#fde047';
  } else if (['alps', 'moscow'].includes(theme)) {
    floorGrad.addColorStop(0, '#475569');
    floorGrad.addColorStop(0.35, '#334155');
    floorGrad.addColorStop(1, '#0f172a');
    accentTrim = '#7dd3fc';
  } else {
    floorGrad.addColorStop(0, '#334155');
    floorGrad.addColorStop(0.35, '#1e293b');
    floorGrad.addColorStop(1, '#0b1120');
    accentTrim = '#38bdf8';
  }

  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, GROUND_Y, WORLD_W, FLOOR_H);

  // Subtle parallax-coupled perspective floor tile seams
  const seamShift = -cameraNormX * 14;
  ctx.strokeStyle = tileLine;
  ctx.lineWidth = 1.6;
  for (let x = LEFT_WALL - 48; x < RIGHT_WALL + 48; x += 48) {
    const sx = x + seamShift;
    ctx.beginPath();
    ctx.moveTo(sx, GROUND_Y);
    ctx.lineTo(sx + (sx - WORLD_W / 2) * 0.1, WORLD_H);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(LEFT_WALL, GROUND_Y + FLOOR_H * 0.45);
  ctx.lineTo(RIGHT_WALL, GROUND_Y + FLOOR_H * 0.45);
  ctx.stroke();

  // Crisp luminous ground line
  ctx.fillStyle = accentTrim;
  ctx.fillRect(0, GROUND_Y, WORLD_W, 3);

  // Structural arcade cabinet frame walls
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, WORLD_W, CEILING_Y);
  ctx.fillRect(0, 0, LEFT_WALL, WORLD_H);
  ctx.fillRect(RIGHT_WALL, 0, WALL_THICKNESS, WORLD_H);

  // Subtle recessed metallic inner rim
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(LEFT_WALL, CEILING_Y, RIGHT_WALL - LEFT_WALL, GROUND_Y - CEILING_Y);
}
