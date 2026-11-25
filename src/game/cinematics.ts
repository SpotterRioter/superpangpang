import { drawBackground } from './backgrounds';
import { BossId, drawBossPreview } from './boss';
import { WORLD_H, WORLD_W } from './levels';
import { drawAirplane, drawSpaceship } from './sprites';
import { StoryMusicMood, ThemeId } from './types';

export type CineCamera = 'panR' | 'panL' | 'zoomIn' | 'zoomOut' | 'still';
export type CineActor =
  | 'none'
  | 'plane'
  | 'planeDuo'
  | 'rocket'
  | 'orbs'
  | 'boss'
  | 'bossDown'
  | 'earth'
  | 'fireworks';

export interface CineShot {
  theme: ThemeId;
  dur: number;
  camera: CineCamera;
  actor: CineActor;
  caption: string;
  voice?: string;
  bossId?: BossId;
  title?: string;
  subtitle?: string;
  flash?: boolean;
}

export interface CinematicDef {
  id: string;
  kind: 'act_intro' | 'act_victory' | 'finale';
  act: number;
  heading: string;
  music: StoryMusicMood;
  shots: CineShot[];
}

const S = (
  theme: ThemeId,
  dur: number,
  camera: CineCamera,
  actor: CineActor,
  caption: string,
  extra: Partial<CineShot> = {}
): CineShot => ({ theme, dur, camera, actor, caption, ...extra });

const NARR = 'NARRAÇÃO';
const MAYA = 'DRA. MAYA LIN · PRISMA-LAB';
const HEITOR = 'COMANDANTE HEITOR · AEGIS-HQ';
const ARIA = 'ARIA-7 · ORBITAL-AI';
const DIARY = 'DIÁRIO DE AURÉLIO VANCE';

export const CINEMATICS: CinematicDef[] = [
  // ------------------------------------------------------------------ ATO I
  {
    id: 'act1_intro',
    kind: 'act_intro',
    act: 1,
    heading: 'ATO I — O CÉU FRAGMENTADO',
    music: 'story_heroic',
    shots: [
      S('fuji', 5.2, 'zoomOut', 'none', 'Há seis anos, o mundo parou de olhar para o céu. Ninguém queria lembrar do que o Projeto Olimpo havia despertado.', {
        voice: NARR,
        title: 'ATO I',
        subtitle: 'O Céu Fragmentado'
      }),
      S('fuji', 4.8, 'panR', 'plane', 'Mas um piloto herdou do avô um biplano vermelho, óculos de latão e um arpão pneumático chamado Vento Norte.', { voice: NARR }),
      S('fuji', 4.8, 'zoomIn', 'orbs', 'Ao pôr do sol sobre o Monte Fuji, a primeira Esfera Prisma rasgou o horizonte — e o vento simplesmente parou.', { voice: NARR, flash: true }),
      S('neon', 4.8, 'panL', 'orbs', 'Em poucas horas, vinte e duas âncoras de plasma brilhavam sobre monumentos de todos os continentes.', { voice: HEITOR }),
      S('temple', 5.2, 'zoomIn', 'plane', '“Se o vento calar, vá até onde ele nasceu.” Leo decolou. O Esquadrão Pang começava a volta ao mundo.', { voice: DIARY })
    ]
  },
  {
    id: 'act1_victory',
    kind: 'act_victory',
    act: 1,
    heading: 'ATO I — CONCLUÍDO',
    music: 'story_heroic',
    shots: [
      S('temple', 5, 'zoomOut', 'bossDown', 'O Garuda de ouro desabou em mil faíscas sobre o Templo Dourado, e o silêncio de seis anos se partiu ao meio.', {
        voice: NARR,
        bossId: 'garuda',
        flash: true,
        title: 'VITÓRIA',
        subtitle: 'Fim do Ato I'
      }),
      S('temple', 4.8, 'panR', 'fireworks', 'No altar, um cristal facetado ainda pulsava como uma bússola, apontando para além do oceano.', { voice: MAYA }),
      S('fuji', 4.8, 'panL', 'plane', 'Pela primeira vez desde o Prisma, o vento voltou a soprar sobre o Fuji, levando pétalas de sakura até o mar.', { voice: NARR }),
      S('rio', 5, 'zoomIn', 'plane', 'Mas a coordenada era clara: Rio de Janeiro. O Meridiano das Américas estava em chamas.', { voice: MAYA })
    ]
  },
  // ------------------------------------------------------------------ ATO II
  {
    id: 'act2_intro',
    kind: 'act_intro',
    act: 2,
    heading: 'ATO II — O MERIDIANO DAS AMÉRICAS',
    music: 'story_mystery',
    shots: [
      S('rio', 5, 'panR', 'plane', 'Do Cristo Redentor às luzes de Manhattan, as Américas inteiras aguardavam um sinal de esperança.', {
        voice: NARR,
        title: 'ATO II',
        subtitle: 'O Meridiano das Américas'
      }),
      S('saopaulo', 4.6, 'panL', 'orbs', 'Em São Paulo, os cabos de LED da ponte vibravam em frequências que nenhum engenheiro soube explicar.', { voice: NARR }),
      S('machupicchu', 5, 'zoomIn', 'plane', 'Nos Andes, entre terraços de pedra e nuvens baixas, Leo encontrou um aviso antigo sobre o brilho vermelho de Marte.', { voice: NARR }),
      S('vegas', 4.6, 'panR', 'orbs', 'Cada vitória revelava mais do Barão Vesper — e mais perguntas sobre a mulher cujo nome ele sussurrava no rádio.', { voice: MAYA }),
      S('nyc', 5, 'zoomIn', 'plane', '“Ninguém voa sozinho, Leo. O céu é um trabalho em equipe.”', { voice: DIARY })
    ]
  },
  {
    id: 'act2_victory',
    kind: 'act_victory',
    act: 2,
    heading: 'ATO II — CONCLUÍDO',
    music: 'story_heroic',
    shots: [
      S('nyc', 5, 'zoomOut', 'bossDown', 'O Zepelim Ás de Espadas ardeu sobre o Hudson, e todas as luzes de Manhattan acenderam ao mesmo tempo.', {
        voice: NARR,
        bossId: 'zeppelin',
        flash: true,
        title: 'VITÓRIA',
        subtitle: 'Fim do Ato II'
      }),
      S('nyc', 4.8, 'panR', 'fireworks', 'As Américas estavam livres. Do Rio a Nova Iorque, as sirenes deram lugar a aplausos.', { voice: NARR }),
      S('madrid', 4.8, 'panL', 'plane', 'Mas o rádio crepitou: Vesper agora olhava para o Velho Mundo... e repetia um nome. “Helena.”', { voice: HEITOR }),
      S('london', 5, 'zoomIn', 'plane', 'O Atlântico ficou para trás. Diante do Esquadrão Pang, a Europa — e um inverno que não perdoa.', { voice: NARR })
    ]
  },
  // ------------------------------------------------------------------ ATO III
  {
    id: 'act3_intro',
    kind: 'act_intro',
    act: 3,
    heading: 'ATO III — O CERCO DO VELHO MUNDO',
    music: 'story_vesper',
    shots: [
      S('madrid', 5, 'zoomOut', 'orbs', 'No Velho Mundo, cada monumento era uma nota afinada pelo Barão Vesper numa sinfonia de silêncio.', {
        voice: NARR,
        title: 'ATO III',
        subtitle: 'O Cerco do Velho Mundo'
      }),
      S('london', 4.8, 'panR', 'plane', 'Sob a chuva fina do Tâmisa, o pêndulo do Big Ben marcava o ritmo das esferas.', { voice: NARR }),
      S('rome', 4.8, 'panL', 'orbs', 'No Coliseu, quatro colossos saltavam diante de uma plateia de séculos.', { voice: NARR }),
      S('moscow', 5, 'zoomIn', 'plane', '“Cada nota que ele ataca é uma dor que ele não soube perdoar.”', { voice: MAYA }),
      S('moscow', 5, 'still', 'boss', 'Mas por trás da nevasca, o maior dos guardiões de ferro de Vesper começava a acordar...', {
        voice: NARR,
        bossId: 'ironclad',
        flash: true
      })
    ]
  },
  {
    id: 'act3_victory',
    kind: 'act_victory',
    act: 3,
    heading: 'ATO III — CONCLUÍDO',
    music: 'story_heroic',
    shots: [
      S('moscow', 5, 'zoomOut', 'bossDown', 'O Czar de Ferro tombou sobre a Praça Vermelha, e a nevasca se abriu num clarão dourado.', {
        voice: NARR,
        bossId: 'ironclad',
        flash: true,
        title: 'VITÓRIA',
        subtitle: 'Fim do Ato III'
      }),
      S('moscow', 4.8, 'panR', 'fireworks', 'Pela primeira vez, a Europa respirou sem medo do céu.', { voice: NARR }),
      S('delhi', 4.8, 'panL', 'plane', 'Vesper recuou, concentrando o que restava do seu poder entre a Índia, a China e o Pacífico.', { voice: HEITOR }),
      S('honolulu', 5, 'zoomIn', 'plane', 'E em Honolulu, escondido atrás de uma cratera, um foguete aguardava o piloto que levaria a guerra para além do céu.', { voice: NARR })
    ]
  },
  // ------------------------------------------------------------------ ATO IV
  {
    id: 'act4_intro',
    kind: 'act_intro',
    act: 4,
    heading: 'ATO IV — CORRIDA PELO HORIZONTE ORIENTAL',
    music: 'story_mystery',
    shots: [
      S('delhi', 5, 'zoomOut', 'plane', 'Do mármore do Taj Mahal às lanternas do Chao Phraya, a Ásia acordava sob o brilho das esferas.', {
        voice: NARR,
        title: 'ATO IV',
        subtitle: 'Corrida pelo Horizonte Oriental'
      }),
      S('bangkok', 4.8, 'panR', 'orbs', 'Centenas de lanternas subiam o rio, como se a cidade inteira quisesse guiar o voo de Leo.', { voice: NARR }),
      S('beijing', 4.8, 'panL', 'plane', 'Na Grande Muralha, um dragão de seda vermelha dançava sobre um desfile de blocos dourados.', { voice: NARR }),
      S('sydney', 5, 'zoomIn', 'plane', 'Nos arquivos da Aegis, Maya decifrava uma assinatura que se repetia em todo o Projeto Olimpo: “H.V.”', { voice: MAYA }),
      S('honolulu', 5, 'panR', 'orbs', 'No Havaí, o relógio de lançamento do foguete Estrela Polar já contava as últimas horas.', { voice: HEITOR })
    ]
  },
  {
    id: 'act4_victory',
    kind: 'act_victory',
    act: 4,
    heading: 'ATO IV — CONCLUÍDO',
    music: 'story_space',
    shots: [
      S('honolulu', 5, 'zoomOut', 'bossDown', 'A Hidra Maré Negra mergulhou nas águas turquesa de Waikiki, e a janela de lançamento finalmente se abriu.', {
        voice: NARR,
        bossId: 'hydra',
        flash: true,
        title: 'VITÓRIA',
        subtitle: 'Fim do Ato IV'
      }),
      S('honolulu', 5.2, 'still', 'rocket', 'O Estrela Polar rasgou o céu havaiano, levando um piloto e uma IA com uma canção que ela não sabia de onde vinha.', { voice: NARR }),
      S('moon', 4.8, 'zoomIn', 'earth', 'Atrás deles, a Terra azul diminuía, livre do véu de plasma, brilhando como uma promessa.', { voice: ARIA }),
      S('moon', 5, 'panR', 'rocket', 'Adiante, a Lua. Depois Marte — e o último segredo do Projeto Olimpo.', { voice: ARIA })
    ]
  },
  // ------------------------------------------------------------------ ATO V
  {
    id: 'act5_intro',
    kind: 'act_intro',
    act: 5,
    heading: 'ATO V — ALÉM DA GRAVIDADE',
    music: 'story_space',
    shots: [
      S('moon', 5.2, 'zoomOut', 'earth', 'Além da gravidade não há vento, nem sinos, nem chuva. Só o silêncio onde o Projeto Olimpo nasceu.', {
        voice: NARR,
        title: 'ATO V',
        subtitle: 'Além da Gravidade'
      }),
      S('moon', 4.8, 'panR', 'rocket', 'ARIA-7 calculava cada órbita com precisão milimétrica. E, às vezes, cantarolava uma melodia que não sabia explicar.', { voice: NARR }),
      S('mars', 4.8, 'zoomIn', 'orbs', 'Em Marte, no cume do Monte Olimpo, o Núcleo despertava — e as últimas esferas se fundiam numa só.', { voice: NARR, flash: true }),
      S('mars', 5, 'still', 'plane', '“Quando o céu acabar, Leo, voe mais um pouco.”', { voice: DIARY })
    ]
  },
  {
    id: 'act5_victory',
    kind: 'act_victory',
    act: 5,
    heading: 'ATO V — CONCLUÍDO',
    music: 'story_epilogue',
    shots: [
      S('mars', 5.4, 'zoomOut', 'bossDown', 'A Matriz Suprema Prisma se desfez em mil fragmentos de luz, e a tempestade carmesim de Marte finalmente se abriu.', {
        voice: NARR,
        bossId: 'matrix',
        flash: true,
        title: 'VITÓRIA',
        subtitle: 'Fim do Ato V'
      }),
      S('mars', 5, 'panR', 'fireworks', 'Entre os cânions, uma canção de ninar ecoou nos alto-falantes. Julian Vesper chorou em silêncio pela primeira vez em seis anos.', { voice: NARR }),
      S('moon', 4.8, 'panL', 'rocket', 'Helena não voltou, mas deixou uma voz — ARIA-7 — que escolheu ficar com quem ainda tinha o céu pela frente.', { voice: NARR }),
      S('fuji', 5.2, 'zoomIn', 'plane', 'E na Terra, de Fuji a Manhattan, o vento voltou a soprar como se nunca tivesse parado.', { voice: NARR })
    ]
  },
  // ------------------------------------------------------------------ FINAL
  {
    id: 'finale',
    kind: 'finale',
    act: 5,
    heading: 'FIM DE JOGO',
    music: 'story_epilogue',
    shots: [
      S('fuji', 5, 'zoomOut', 'planeDuo', 'Vinte e quatro destinos. Cinco chefes. Um único céu.', {
        voice: NARR,
        title: 'VOLTA AO UNIVERSO',
        subtitle: 'Operação Esfera Prisma'
      }),
      S('rio', 4.4, 'panR', 'plane', 'Do samba de Copacabana ao silêncio das crateras lunares...', { voice: NARR }),
      S('nyc', 4.4, 'panL', 'plane', '...cada cidade reaprendeu a olhar para cima.', { voice: NARR }),
      S('rome', 4.4, 'zoomIn', 'plane', 'O Esquadrão Pang voltou para casa como lenda.', { voice: HEITOR }),
      S('sydney', 4.6, 'panR', 'fireworks', 'Leo guardou o diário do avô — agora com uma nova página, escrita à mão:', { voice: NARR }),
      S('moon', 5.2, 'still', 'earth', '“O vento fala com quem sabe escutar. E hoje ele disse: obrigado.”', { voice: DIARY }),
      S('mars', 5, 'zoomOut', 'rocket', 'Câmbio final, Esquadrão Pang.', { voice: 'LEO "FALCÃO" VANCE' }),
      S('fuji', 7, 'still', 'fireworks', 'SUPER PANG WORLD TOUR · Obrigado por voar conosco!', {
        title: 'FIM',
        subtitle: 'Leo · Maya · Heitor · ARIA-7'
      })
    ]
  }
];

export function getActIntroCinematic(act: number): CinematicDef | null {
  return CINEMATICS.find((c) => c.kind === 'act_intro' && c.act === act) || null;
}

export function getActVictoryCinematic(act: number): CinematicDef | null {
  return CINEMATICS.find((c) => c.kind === 'act_victory' && c.act === act) || null;
}

export function getFinaleCinematic(): CinematicDef {
  return CINEMATICS[CINEMATICS.length - 1];
}

export function cinematicTotalDuration(def: CinematicDef): number {
  return def.shots.reduce((acc, s) => acc + s.dur, 0);
}

export function cinematicShotStart(def: CinematicDef, idx: number): number {
  let acc = 0;
  for (let i = 0; i < idx && i < def.shots.length; i++) acc += def.shots[i].dur;
  return acc;
}

export function cinematicShotIndex(def: CinematicDef, elapsed: number): number {
  let acc = 0;
  for (let i = 0; i < def.shots.length; i++) {
    acc += def.shots[i].dur;
    if (elapsed < acc) return i;
  }
  return def.shots.length - 1;
}

// =========================================================================
// RENDERER
// =========================================================================
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawOrbs(ctx: CanvasRenderingContext2D, t: number): void {
  const orbs: [number, number, number][] = [
    [170, 130, 38],
    [330, 88, 28],
    [510, 150, 48],
    [690, 98, 32],
    [820, 165, 40]
  ];
  orbs.forEach(([x, y, r], i) => {
    const by = y + Math.sin(t * 1.6 + i * 1.3) * 12;
    const hue = (t * 40 + i * 70) % 360;
    const g = ctx.createRadialGradient(x - r * 0.3, by - r * 0.3, r * 0.1, x, by, r);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.5, `hsla(${hue}, 90%, 62%, 0.55)`);
    g.addColorStop(1, `hsla(${(hue + 80) % 360}, 90%, 50%, 0.85)`);
    const halo = ctx.createRadialGradient(x, by, r * 0.5, x, by, r * 2.4);
    halo.addColorStop(0, `hsla(${hue}, 90%, 65%, 0.35)`);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, by, r * 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, by, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function drawEarth(ctx: CanvasRenderingContext2D, t: number): void {
  const x = 210;
  const y = 400;
  const halo = ctx.createRadialGradient(x, y, 100, x, y, 220);
  halo.addColorStop(0, 'rgba(56,189,248,0.4)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, 150, 0, Math.PI * 2);
  ctx.clip();
  const g = ctx.createRadialGradient(x - 50, y - 50, 20, x, y, 150);
  g.addColorStop(0, '#bae6fd');
  g.addColorStop(0.55, '#0284c7');
  g.addColorStop(1, '#082f49');
  ctx.fillStyle = g;
  ctx.fillRect(x - 150, y - 150, 300, 300);
  const rot = (t * 10) % 300;
  ctx.fillStyle = '#2ec4b6';
  ctx.beginPath();
  ctx.ellipse(x - 150 + rot, y - 20, 55, 34, 0.3, 0, Math.PI * 2);
  ctx.ellipse(x - 450 + rot, y + 40, 48, 30, -0.3, 0, Math.PI * 2);
  ctx.ellipse(x + 150 + rot - 300, y - 70, 40, 24, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFireworks(ctx: CanvasRenderingContext2D, t: number): void {
  const cols = ['255,240,150', '56,189,248', '244,114,182', '167,243,208'];
  for (let f = 0; f < 5; f++) {
    const pulse = (t * 0.6 + f * 0.21) % 1;
    const fx = 120 + f * 180 + Math.sin(f * 3.1) * 40;
    const fy = 100 + (f % 3) * 36;
    const fr = pulse * 70;
    ctx.strokeStyle = `rgba(${cols[f % cols.length]}, ${(1 - pulse).toFixed(2)})`;
    ctx.lineWidth = 2.5;
    for (let a = 0; a < 14; a++) {
      const ang = (a * Math.PI * 2) / 14;
      ctx.beginPath();
      ctx.moveTo(fx + Math.cos(ang) * fr * 0.4, fy + Math.sin(ang) * fr * 0.4);
      ctx.lineTo(fx + Math.cos(ang) * fr, fy + Math.sin(ang) * fr);
      ctx.stroke();
    }
  }
}

function drawExplosions(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number): void {
  for (let i = 0; i < 7; i++) {
    const phase = (t * 1.6 + i * 0.37) % 1;
    const ang = i * 2.4;
    const ex = cx + Math.cos(ang) * (50 + (i % 3) * 30);
    const ey = cy + Math.sin(ang * 1.3) * 46;
    const r = 18 + phase * 44;
    const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, r);
    g.addColorStop(0, `rgba(255,255,255,${(1 - phase).toFixed(2)})`);
    g.addColorStop(0.4, `rgba(251,146,60,${(0.9 - phase * 0.8).toFixed(2)})`);
    g.addColorStop(1, 'rgba(127,29,29,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(ex, ey, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function renderCinematic(
  ctx: CanvasRenderingContext2D,
  def: CinematicDef,
  elapsed: number,
  bgTime: number
): void {
  const total = cinematicTotalDuration(def);
  const e = Math.min(elapsed, total - 0.001);
  const idx = cinematicShotIndex(def, e);
  const shot = def.shots[idx];
  const local = e - cinematicShotStart(def, idx);
  const p = Math.min(1, Math.max(0, local / shot.dur));

  // 1. Camera
  let cam = 0;
  let zoom = 1.02;
  switch (shot.camera) {
    case 'panR':
      cam = -0.8 + 1.6 * p;
      zoom = 1.06;
      break;
    case 'panL':
      cam = 0.8 - 1.6 * p;
      zoom = 1.06;
      break;
    case 'zoomIn':
      zoom = 1 + 0.16 * p;
      break;
    case 'zoomOut':
      zoom = 1.16 - 0.16 * p;
      break;
    default:
      zoom = 1.03;
  }

  ctx.fillStyle = '#02040a';
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  ctx.save();
  ctx.translate(WORLD_W / 2, WORLD_H / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-WORLD_W / 2, -WORLD_H / 2);
  drawBackground(ctx, shot.theme, bgTime, 0, cam);

  // 2. Actors
  const t = bgTime;
  switch (shot.actor) {
    case 'plane': {
      const x = -90 + (WORLD_W + 180) * p;
      const y = 170 + Math.sin(p * 6) * 22;
      drawAirplane(ctx, x, y, Math.cos(p * 6) * 0.08, t);
      break;
    }
    case 'planeDuo': {
      const x = -90 + (WORLD_W + 180) * p;
      drawAirplane(ctx, x, 150 + Math.sin(p * 5) * 18, 0.03, t);
      drawAirplane(ctx, x - 78, 196 + Math.sin(p * 5 + 1) * 18, 0.03, t);
      break;
    }
    case 'rocket': {
      const x = 140 + 680 * p;
      const y = 430 - 320 * p;
      drawSpaceship(ctx, x, y, Math.atan2(-320, 680), t);
      break;
    }
    case 'orbs':
      drawOrbs(ctx, t);
      break;
    case 'earth':
      drawEarth(ctx, t);
      break;
    case 'fireworks':
      drawFireworks(ctx, t);
      break;
    case 'boss':
      if (shot.bossId) drawBossPreview(ctx, shot.bossId, WORLD_W / 2 + Math.sin(t) * 22, 190, t, 1.15);
      break;
    case 'bossDown':
      if (shot.bossId) {
        const by = 150 + p * 130;
        drawBossPreview(ctx, shot.bossId, WORLD_W / 2, by, t, 1.1 - p * 0.15, true);
        drawExplosions(ctx, t, WORLD_W / 2, by);
      }
      break;
    default:
      break;
  }
  ctx.restore();

  // 3. Letterbox bars (animated in)
  const barH = 66 * Math.min(1, elapsed / 0.9);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, WORLD_W, barH);
  ctx.fillRect(0, WORLD_H - barH, WORLD_W, barH);

  // 4. Shot fades & flash
  const fade = Math.max(0, 1 - local / 0.35, 1 - (shot.dur - local) / 0.35);
  if (fade > 0) {
    ctx.fillStyle = `rgba(0,0,0,${Math.min(1, fade).toFixed(2)})`;
    ctx.fillRect(0, barH, WORLD_W, WORLD_H - barH * 2);
  }
  if (shot.flash && local < 0.5) {
    ctx.fillStyle = `rgba(255,255,255,${(0.85 * (1 - local / 0.5)).toFixed(2)})`;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  }

  // 5. Title card
  if (shot.title) {
    const a = Math.min(1, local / 0.7, (shot.dur - local) / 0.6);
    ctx.save();
    ctx.globalAlpha = Math.max(0, a);
    ctx.textAlign = 'center';
    ctx.font = '30px "Press Start 2P", monospace';
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(0,0,0,0.9)';
    ctx.strokeText(shot.title, WORLD_W / 2, 238);
    ctx.fillStyle = '#fde047';
    ctx.fillText(shot.title, WORLD_W / 2, 238);
    if (shot.subtitle) {
      ctx.font = '700 20px "Chakra Petch", sans-serif';
      ctx.lineWidth = 5;
      ctx.strokeText(shot.subtitle, WORLD_W / 2, 274);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(shot.subtitle, WORLD_W / 2, 274);
    }
    ctx.restore();
  }

  // 6. Heading & voice label inside the top bar
  if (barH > 40) {
    ctx.save();
    ctx.textAlign = 'left';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(def.heading, 28, 28);
    if (shot.voice) {
      ctx.font = '700 12px "Chakra Petch", sans-serif';
      ctx.fillStyle = '#67e8f9';
      ctx.fillText(`▶ ${shot.voice}`, 28, 48);
    }
    // Progress pips
    ctx.textAlign = 'right';
    for (let i = 0; i < def.shots.length; i++) {
      ctx.fillStyle = i === idx ? '#fbbf24' : i < idx ? '#38bdf8' : '#334155';
      ctx.fillRect(WORLD_W - 28 - (def.shots.length - i) * 14, 24, 10, 4);
    }
    ctx.restore();
  }

  // 7. Typewriter caption in the bottom bar
  if (barH > 40) {
    const a = Math.min(1, local / 0.5, (shot.dur - local) / 0.35);
    const chars = Math.floor(local * 42);
    const shown = shot.caption.slice(0, Math.max(0, chars));
    ctx.save();
    ctx.globalAlpha = Math.max(0, a);
    ctx.textAlign = 'center';
    ctx.font = '600 17px "Chakra Petch", sans-serif';
    const full = wrapText(ctx, shot.caption, 840);
    const lineH = 22;
    const startY = WORLD_H - barH + 30 - ((full.length - 1) * lineH) / 2 + (full.length > 2 ? -4 : 0);
    // Layout by full wrap so text never jumps while typing
    let remaining = shown.length;
    full.forEach((line, i) => {
      const part = line.slice(0, Math.max(0, remaining));
      remaining -= line.length + 1;
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(part, WORLD_W / 2, startY + i * lineH);
    });
    ctx.restore();
  }
}
