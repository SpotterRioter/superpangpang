import { LevelDef, PowerupType } from './types';

export const WORLD_W = 960;
export const WORLD_H = 540;
export const WALL_THICKNESS = 14;
export const FLOOR_H = 40;
export const GROUND_Y = WORLD_H - FLOOR_H;
export const CEILING_Y = WALL_THICKNESS;
export const LEFT_WALL = WALL_THICKNESS;
export const RIGHT_WALL = WORLD_W - WALL_THICKNESS;
export const BASE_GRAVITY = 880;

export const BUBBLE_SPECS = [
  { name: 'Pequena', radius: 13, bounceVy: -425, speedX: 176, points: 800, defaultColors: ['#3a86ff', '#90e0ef', '#1d3557'] },
  { name: 'Média',   radius: 22, bounceVy: -518, speedX: 156, points: 400, defaultColors: ['#2ec4b6', '#9bf6ff', '#0f5c55'] },
  { name: 'Grande',  radius: 34, bounceVy: -600, speedX: 138, points: 200, defaultColors: ['#ff9f1c', '#ffe599', '#9c4a00'] },
  { name: 'Gigante', radius: 48, bounceVy: -682, speedX: 122, points: 100, defaultColors: ['#ff3b5c', '#ffb3c1', '#800f2f'] }
] as const;

export const POWERUP_DEFS: Record<
  PowerupType,
  { label: string; shortLabel: string; color: string; bg: string; rim: string; duration: number }
> = {
  double:    { label: 'ARPÃO DUPLO', shortLabel: 'DUPLO',   color: '#22d3ee', bg: '#083344', rim: '#67e8f9', duration: 18 },
  sticky:    { label: 'CABO FIXO',   shortLabel: 'FIXO',    color: '#fbbf24', bg: '#451a03', rim: '#fde68a', duration: 18 },
  shield:    { label: 'ESCUDO',      shortLabel: 'ESCUDO',  color: '#60a5fa', bg: '#172554', rim: '#bfdbfe', duration: 0  },
  freeze:    { label: 'RELÓGIO',     shortLabel: 'CONGELAR', color: '#c084fc', bg: '#2e1065', rim: '#e9d5ff', duration: 5.5 },
  dynamite:  { label: 'DINAMITE',    shortLabel: 'BOMBA',   color: '#fb7185', bg: '#4c0519', rim: '#fecdd3', duration: 0  },
  extralife: { label: 'VIDA EXTRA!', shortLabel: '+1 VIDA', color: '#f43f5e', bg: '#4c0519', rim: '#fda4af', duration: 0  }
};

export const LEVELS: LevelDef[] = [
  {
    id: 1, name: 'Monte Fuji', country: 'Japão', region: 'Ásia & Pacífico', flag: '🇯🇵', theme: 'fuji',
    mapX: 0.87, mapY: 0.37, gravityScale: 1.0, timeLimit: 75,
    palette: ['#38bdf8', '#2ec4b6', '#ff9f1c', '#ff3b5c'],
    swatch: ['#9d174d', '#f97316'],
    bubbles: [{ x: 260, y: 150, size: 3, dir: 1 }],
    blocks: []
  },
  {
    id: 2, name: 'Pirâmides de Gizé', country: 'Egito', region: 'Europa & África', flag: '🇪🇬', theme: 'pyramids',
    mapX: 0.56, mapY: 0.42, gravityScale: 1.0, timeLimit: 85,
    palette: ['#00b4d8', '#2ec4b6', '#f4a261', '#e63946'],
    swatch: ['#b45309', '#fbbf24'],
    bubbles: [
      { x: 220, y: 145, size: 3, dir: 1 },
      { x: 740, y: 165, size: 2, dir: -1 }
    ],
    blocks: [
      { x: 210, y: 270, w: 120, h: 24, destructible: false },
      { x: 630, y: 270, w: 120, h: 24, destructible: false },
      { x: 420, y: 210, w: 120, h: 24, destructible: true }
    ]
  },
  {
    id: 3, name: 'Metrópole Neon', country: 'Tóquio', region: 'Ásia & Pacífico', flag: '🇯🇵', theme: 'neon',
    mapX: 0.88, mapY: 0.36, gravityScale: 1.0, timeLimit: 90,
    palette: ['#00f5d4', '#00bbf9', '#fee440', '#f15bb5'],
    swatch: ['#1e0538', '#ec4899'],
    bubbles: [
      { x: 200, y: 125, size: 2, dir: 1 },
      { x: 760, y: 125, size: 2, dir: -1 },
      { x: 480, y: 110, size: 1, dir: 1 }
    ],
    blocks: [
      { x: 320, y: 255, w: 100, h: 24, destructible: true },
      { x: 430, y: 255, w: 100, h: 24, destructible: false },
      { x: 540, y: 255, w: 100, h: 24, destructible: true },
      { x: 140, y: 185, w: 90, h: 22, destructible: true },
      { x: 730, y: 185, w: 90, h: 22, destructible: true }
    ]
  },
  {
    id: 4, name: 'Alpes Suíços', country: 'Suíça', region: 'Europa & África', flag: '🇨🇭', theme: 'alps',
    mapX: 0.50, mapY: 0.30, gravityScale: 1.0, timeLimit: 95,
    palette: ['#48cae4', '#80ed99', '#ffd166', '#ef476f'],
    swatch: ['#0f172a', '#2dd4bf'],
    bubbles: [
      { x: 240, y: 130, size: 3, dir: 1 },
      { x: 720, y: 130, size: 3, dir: -1 }
    ],
    blocks: [
      { x: 180, y: 295, w: 110, h: 24, destructible: true },
      { x: 670, y: 295, w: 110, h: 24, destructible: true },
      { x: 360, y: 215, w: 240, h: 24, destructible: false },
      { x: 420, y: 135, w: 120, h: 22, destructible: true }
    ]
  },
  {
    id: 5, name: 'Praia Tropical', country: 'Caribe', region: 'Américas', flag: '🏝️', theme: 'caribbean',
    mapX: 0.27, mapY: 0.46, gravityScale: 1.0, timeLimit: 95,
    palette: ['#00e5ff', '#38b000', '#ffb703', '#fb5607'],
    swatch: ['#f72585', '#fb8500'],
    bubbles: [
      { x: 480, y: 120, size: 3, dir: 1 },
      { x: 180, y: 160, size: 2, dir: 1 },
      { x: 780, y: 160, size: 2, dir: -1 }
    ],
    blocks: [
      { x: 120, y: 280, w: 110, h: 24, destructible: false },
      { x: 230, y: 280, w: 90, h: 24, destructible: true },
      { x: 640, y: 280, w: 90, h: 24, destructible: true },
      { x: 730, y: 280, w: 110, h: 24, destructible: false },
      { x: 400, y: 190, w: 160, h: 24, destructible: true }
    ]
  },
  {
    id: 6, name: 'Templo Dourado', country: 'Ásia', region: 'Ásia & Pacífico', flag: '🏯', theme: 'temple',
    mapX: 0.75, mapY: 0.44, gravityScale: 1.0, timeLimit: 100,
    palette: ['#4cc9f0', '#06d6a0', '#ffd166', '#ff4d6d'],
    swatch: ['#5a189a', '#f59e0b'],
    bubbles: [
      { x: 210, y: 125, size: 3, dir: 1 },
      { x: 750, y: 125, size: 3, dir: -1 },
      { x: 480, y: 110, size: 1, dir: 1 }
    ],
    blocks: [
      { x: 250, y: 310, w: 100, h: 24, destructible: true },
      { x: 610, y: 310, w: 100, h: 24, destructible: true },
      { x: 410, y: 245, w: 140, h: 24, destructible: false },
      { x: 150, y: 205, w: 110, h: 24, destructible: false },
      { x: 700, y: 205, w: 110, h: 24, destructible: false }
    ]
  },
  {
    id: 7, name: 'Rio de Janeiro', country: 'Brasil', region: 'Américas', flag: '🇧🇷', theme: 'rio',
    mapX: 0.35, mapY: 0.72, gravityScale: 1.0, timeLimit: 95,
    palette: ['#00bbf9', '#00f5d4', '#ffd166', '#ef4444'],
    swatch: ['#0284c7', '#fb923c'],
    bubbles: [
      { x: 200, y: 135, size: 3, dir: 1 },
      { x: 760, y: 145, size: 2, dir: -1 },
      { x: 480, y: 115, size: 2, dir: 1 }
    ],
    blocks: [
      { x: 280, y: 280, w: 130, h: 24, destructible: false },
      { x: 550, y: 280, w: 130, h: 24, destructible: false },
      { x: 420, y: 195, w: 120, h: 24, destructible: true }
    ]
  },
  {
    id: 8, name: 'São Paulo', country: 'Brasil', region: 'Américas', flag: '🇧🇷', theme: 'saopaulo',
    mapX: 0.33, mapY: 0.74, gravityScale: 1.0, timeLimit: 95,
    palette: ['#4ea8de', '#ffd166', '#ff6b6b', '#9b5de5'],
    swatch: ['#172554', '#f59e0b'],
    bubbles: [
      { x: 190, y: 125, size: 3, dir: 1 },
      { x: 770, y: 125, size: 3, dir: -1 }
    ],
    blocks: [
      { x: 140, y: 295, w: 100, h: 24, destructible: true },
      { x: 310, y: 235, w: 120, h: 24, destructible: false },
      { x: 530, y: 235, w: 120, h: 24, destructible: false },
      { x: 720, y: 295, w: 100, h: 24, destructible: true },
      { x: 430, y: 165, w: 100, h: 22, destructible: true }
    ]
  },
  {
    id: 9, name: 'Buenos Aires', country: 'Argentina', region: 'Américas', flag: '🇦🇷', theme: 'buenosaires',
    mapX: 0.31, mapY: 0.81, gravityScale: 1.0, timeLimit: 95,
    palette: ['#72efdd', '#48bfe3', '#ffb703', '#ff4d6d'],
    swatch: ['#6b21a8', '#fb8500'],
    bubbles: [
      { x: 240, y: 140, size: 2, dir: 1 },
      { x: 480, y: 120, size: 3, dir: -1 },
      { x: 720, y: 140, size: 2, dir: -1 }
    ],
    blocks: [
      { x: 455, y: 210, w: 50, h: 120, destructible: false },
      { x: 200, y: 265, w: 120, h: 24, destructible: true },
      { x: 640, y: 265, w: 120, h: 24, destructible: true }
    ]
  },
  {
    id: 10, name: 'Machu Picchu', country: 'Peru', region: 'Américas', flag: '🇵🇪', theme: 'machupicchu',
    mapX: 0.25, mapY: 0.67, gravityScale: 1.0, timeLimit: 100,
    palette: ['#80ed99', '#57cc99', '#ffd166', '#f77f00'],
    swatch: ['#0369a1', '#15803d'],
    bubbles: [
      { x: 200, y: 130, size: 3, dir: 1 },
      { x: 760, y: 130, size: 3, dir: -1 },
      { x: 480, y: 105, size: 1, dir: 1 }
    ],
    blocks: [
      { x: 160, y: 310, w: 120, h: 24, destructible: false },
      { x: 300, y: 255, w: 110, h: 24, destructible: true },
      { x: 550, y: 255, w: 110, h: 24, destructible: true },
      { x: 680, y: 310, w: 120, h: 24, destructible: false },
      { x: 420, y: 195, w: 120, h: 24, destructible: false }
    ]
  },
  {
    id: 11, name: 'La Habana', country: 'Cuba', region: 'Américas', flag: '🇨🇺', theme: 'habana',
    mapX: 0.24, mapY: 0.45, gravityScale: 1.0, timeLimit: 95,
    palette: ['#00e5ff', '#ff9f1c', '#ff4d6d', '#2ec4b6'],
    swatch: ['#0284c7', '#f59e0b'],
    bubbles: [
      { x: 220, y: 130, size: 2, dir: 1 },
      { x: 420, y: 130, size: 2, dir: -1 },
      { x: 620, y: 130, size: 2, dir: 1 },
      { x: 780, y: 150, size: 1, dir: -1 }
    ],
    blocks: [
      { x: 220, y: 255, w: 110, h: 24, destructible: true },
      { x: 425, y: 255, w: 110, h: 24, destructible: false },
      { x: 630, y: 255, w: 110, h: 24, destructible: true }
    ]
  },
  {
    id: 12, name: 'Las Vegas', country: 'EUA', region: 'Américas', flag: '🇺🇸', theme: 'vegas',
    mapX: 0.16, mapY: 0.36, gravityScale: 1.0, timeLimit: 100,
    palette: ['#ff006e', '#ffbe0b', '#00f5d4', '#8338ec'],
    swatch: ['#1e083b', '#ff006e'],
    bubbles: [
      { x: 210, y: 125, size: 3, dir: 1 },
      { x: 750, y: 125, size: 3, dir: -1 },
      { x: 480, y: 130, size: 2, dir: 1 }
    ],
    blocks: [
      { x: 140, y: 230, w: 110, h: 24, destructible: false },
      { x: 350, y: 295, w: 110, h: 24, destructible: true },
      { x: 500, y: 295, w: 110, h: 24, destructible: true },
      { x: 710, y: 230, w: 110, h: 24, destructible: false }
    ]
  },
  {
    id: 13, name: 'Nova Iorque', country: 'EUA', region: 'Américas', flag: '🇺🇸', theme: 'nyc',
    mapX: 0.27, mapY: 0.34, gravityScale: 1.0, timeLimit: 100,
    palette: ['#00b4d8', '#ffd166', '#ef476f', '#06d6a0'],
    swatch: ['#1e3a5f', '#ea580c'],
    bubbles: [
      { x: 180, y: 125, size: 3, dir: 1 },
      { x: 480, y: 110, size: 2, dir: 1 },
      { x: 780, y: 125, size: 3, dir: -1 }
    ],
    blocks: [
      { x: 220, y: 200, w: 95, h: 24, destructible: true },
      { x: 360, y: 260, w: 240, h: 24, destructible: false },
      { x: 645, y: 200, w: 95, h: 24, destructible: true },
      { x: 430, y: 155, w: 100, h: 22, destructible: true }
    ]
  },
  {
    id: 14, name: 'Madri', country: 'Espanha', region: 'Europa & África', flag: '🇪🇸', theme: 'madrid',
    mapX: 0.46, mapY: 0.34, gravityScale: 1.0, timeLimit: 100,
    palette: ['#ffd166', '#ef233c', '#ff9f1c', '#4cc9f0'],
    swatch: ['#991b1b', '#f59e0b'],
    bubbles: [
      { x: 230, y: 130, size: 3, dir: 1 },
      { x: 730, y: 130, size: 3, dir: -1 },
      { x: 390, y: 115, size: 1, dir: -1 },
      { x: 570, y: 115, size: 1, dir: 1 }
    ],
    blocks: [
      { x: 170, y: 270, w: 120, h: 24, destructible: false },
      { x: 350, y: 215, w: 110, h: 24, destructible: true },
      { x: 500, y: 215, w: 110, h: 24, destructible: true },
      { x: 670, y: 270, w: 120, h: 24, destructible: false }
    ]
  },
  {
    id: 15, name: 'Londres', country: 'Reino Unido', region: 'Europa & África', flag: '🇬🇧', theme: 'london',
    mapX: 0.47, mapY: 0.26, gravityScale: 1.0, timeLimit: 100,
    palette: ['#e63946', '#457b9d', '#a8dadc', '#ffd166'],
    swatch: ['#1e293b', '#64748b'],
    bubbles: [
      { x: 200, y: 120, size: 3, dir: 1 },
      { x: 480, y: 135, size: 2, dir: -1 },
      { x: 760, y: 120, size: 3, dir: -1 }
    ],
    blocks: [
      { x: 250, y: 240, w: 110, h: 24, destructible: false },
      { x: 360, y: 240, w: 80, h: 24, destructible: true },
      { x: 520, y: 240, w: 80, h: 24, destructible: true },
      { x: 600, y: 240, w: 110, h: 24, destructible: false },
      { x: 430, y: 315, w: 100, h: 22, destructible: true }
    ]
  },
  {
    id: 16, name: 'Roma', country: 'Itália', region: 'Europa & África', flag: '🇮🇹', theme: 'rome',
    mapX: 0.52, mapY: 0.34, gravityScale: 1.0, timeLimit: 105,
    palette: ['#2ec4b6', '#ff9f1c', '#e63946', '#ffd166'],
    swatch: ['#7c2d12', '#f59e0b'],
    bubbles: [
      { x: 190, y: 135, size: 2, dir: 1 },
      { x: 360, y: 120, size: 3, dir: 1 },
      { x: 600, y: 120, size: 3, dir: -1 },
      { x: 770, y: 135, size: 2, dir: -1 }
    ],
    blocks: [
      { x: 150, y: 290, w: 110, h: 24, destructible: true },
      { x: 320, y: 220, w: 110, h: 24, destructible: false },
      { x: 530, y: 220, w: 110, h: 24, destructible: false },
      { x: 700, y: 290, w: 110, h: 24, destructible: true }
    ]
  },
  {
    id: 17, name: 'Moscou', country: 'Rússia', region: 'Europa & África', flag: '🇷🇺', theme: 'moscow',
    mapX: 0.60, mapY: 0.24, gravityScale: 1.0, timeLimit: 105,
    palette: ['#48cae4', '#ff4d6d', '#ffd166', '#9b5de5'],
    swatch: ['#1e3a8a', '#dc2626'],
    bubbles: [
      { x: 220, y: 125, size: 3, dir: 1 },
      { x: 480, y: 120, size: 3, dir: 1 },
      { x: 740, y: 125, size: 2, dir: -1 }
    ],
    blocks: [
      { x: 200, y: 240, w: 100, h: 24, destructible: false },
      { x: 340, y: 185, w: 90, h: 24, destructible: true },
      { x: 530, y: 185, w: 90, h: 24, destructible: true },
      { x: 660, y: 240, w: 100, h: 24, destructible: false },
      { x: 420, y: 295, w: 120, h: 24, destructible: false }
    ]
  },
  {
    id: 18, name: 'Nova Délhi', country: 'Índia', region: 'Ásia & Pacífico', flag: '🇮🇳', theme: 'delhi',
    mapX: 0.70, mapY: 0.44, gravityScale: 1.0, timeLimit: 105,
    palette: ['#ff9f1c', '#2ec4b6', '#ff3b5c', '#ffd166'],
    swatch: ['#701a75', '#fb923c'],
    bubbles: [
      { x: 210, y: 120, size: 3, dir: 1 },
      { x: 750, y: 120, size: 3, dir: -1 },
      { x: 480, y: 140, size: 2, dir: -1 }
    ],
    blocks: [
      { x: 140, y: 265, w: 110, h: 24, destructible: true },
      { x: 270, y: 265, w: 110, h: 24, destructible: false },
      { x: 580, y: 265, w: 110, h: 24, destructible: false },
      { x: 710, y: 265, w: 110, h: 24, destructible: true },
      { x: 420, y: 175, w: 120, h: 24, destructible: true }
    ]
  },
  {
    id: 19, name: 'Bangcoc', country: 'Tailândia', region: 'Ásia & Pacífico', flag: '🇹🇭', theme: 'bangkok',
    mapX: 0.78, mapY: 0.51, gravityScale: 1.0, timeLimit: 105,
    palette: ['#ffd166', '#00e5ff', '#ff4d6d', '#06d6a0'],
    swatch: ['#3b0764', '#f59e0b'],
    bubbles: [
      { x: 190, y: 130, size: 3, dir: 1 },
      { x: 410, y: 115, size: 2, dir: -1 },
      { x: 550, y: 115, size: 2, dir: 1 },
      { x: 770, y: 130, size: 3, dir: -1 }
    ],
    blocks: [
      { x: 240, y: 295, w: 110, h: 24, destructible: false },
      { x: 425, y: 220, w: 110, h: 24, destructible: false },
      { x: 610, y: 295, w: 110, h: 24, destructible: false },
      { x: 315, y: 165, w: 80, h: 22, destructible: true },
      { x: 565, y: 165, w: 80, h: 22, destructible: true }
    ]
  },
  {
    id: 20, name: 'Beijing', country: 'China', region: 'Ásia & Pacífico', flag: '🇨🇳', theme: 'beijing',
    mapX: 0.81, mapY: 0.35, gravityScale: 1.0, timeLimit: 110,
    palette: ['#ff2a55', '#ffd166', '#ff9f1c', '#00bbf9'],
    swatch: ['#7f1d1d', '#eab308'],
    bubbles: [
      { x: 200, y: 120, size: 3, dir: 1 },
      { x: 480, y: 115, size: 3, dir: -1 },
      { x: 760, y: 120, size: 3, dir: -1 }
    ],
    blocks: [
      { x: 150, y: 245, w: 110, h: 24, destructible: false },
      { x: 300, y: 245, w: 90, h: 24, destructible: true },
      { x: 435, y: 245, w: 90, h: 24, destructible: false },
      { x: 570, y: 245, w: 90, h: 24, destructible: true },
      { x: 700, y: 245, w: 110, h: 24, destructible: false }
    ]
  },
  {
    id: 21, name: 'Sydney', country: 'Austrália', region: 'Ásia & Pacífico', flag: '🇦🇺', theme: 'sydney',
    mapX: 0.88, mapY: 0.78, gravityScale: 1.0, timeLimit: 110,
    palette: ['#00e5ff', '#3a86ff', '#ffd166', '#ff595e'],
    swatch: ['#0369a1', '#38bdf8'],
    bubbles: [
      { x: 200, y: 125, size: 3, dir: 1 },
      { x: 760, y: 125, size: 3, dir: -1 },
      { x: 380, y: 110, size: 2, dir: -1 },
      { x: 580, y: 110, size: 2, dir: 1 }
    ],
    blocks: [
      { x: 210, y: 280, w: 120, h: 24, destructible: true },
      { x: 400, y: 215, w: 160, h: 24, destructible: false },
      { x: 630, y: 280, w: 120, h: 24, destructible: true },
      { x: 120, y: 185, w: 90, h: 22, destructible: false },
      { x: 750, y: 185, w: 90, h: 22, destructible: false }
    ]
  },
  {
    id: 22, name: 'Honolulu', country: 'Havaí', region: 'Ásia & Pacífico', flag: '🌺', theme: 'honolulu',
    mapX: 0.07, mapY: 0.47, gravityScale: 1.0, timeLimit: 110,
    palette: ['#00f5d4', '#ffbe0b', '#fb5607', '#ff006e'],
    swatch: ['#ec4899', '#06b6d4'],
    bubbles: [
      { x: 190, y: 120, size: 3, dir: 1 },
      { x: 480, y: 115, size: 3, dir: 1 },
      { x: 770, y: 120, size: 3, dir: -1 }
    ],
    blocks: [
      { x: 150, y: 295, w: 100, h: 24, destructible: false },
      { x: 290, y: 235, w: 110, h: 24, destructible: true },
      { x: 560, y: 235, w: 110, h: 24, destructible: true },
      { x: 710, y: 295, w: 100, h: 24, destructible: false },
      { x: 430, y: 175, w: 100, h: 24, destructible: false }
    ]
  },
  {
    id: 23, name: 'Lua', country: 'Baixa Gravidade', region: 'Espaço', flag: '🌙', theme: 'moon',
    mapX: 0.50, mapY: 0.45, spaceStage: true, gravityScale: 0.62, timeLimit: 115,
    palette: ['#caf0f8', '#90e0ef', '#c77dff', '#4cc9f0'],
    swatch: ['#0f172a', '#6366f1'],
    bubbles: [
      { x: 210, y: 120, size: 3, dir: 1 },
      { x: 750, y: 120, size: 3, dir: -1 },
      { x: 480, y: 105, size: 2, dir: 1 }
    ],
    blocks: [
      { x: 180, y: 270, w: 120, h: 24, destructible: false },
      { x: 380, y: 200, w: 200, h: 24, destructible: true },
      { x: 660, y: 270, w: 120, h: 24, destructible: false }
    ]
  },
  {
    id: 24, name: 'Marte', country: 'Desafio Final', region: 'Espaço', flag: '🪐', theme: 'mars',
    mapX: 0.82, mapY: 0.34, spaceStage: true, gravityScale: 0.75, timeLimit: 120,
    palette: ['#ffd166', '#ff9f1c', '#ff4d6d', '#c77dff'],
    swatch: ['#4a1216', '#ea580c'],
    bubbles: [
      { x: 180, y: 115, size: 3, dir: 1 },
      { x: 410, y: 115, size: 3, dir: -1 },
      { x: 550, y: 115, size: 2, dir: 1 },
      { x: 780, y: 115, size: 3, dir: -1 }
    ],
    blocks: [
      { x: 150, y: 290, w: 105, h: 24, destructible: true },
      { x: 310, y: 235, w: 115, h: 24, destructible: false },
      { x: 535, y: 235, w: 115, h: 24, destructible: false },
      { x: 705, y: 290, w: 105, h: 24, destructible: true },
      { x: 430, y: 165, w: 100, h: 24, destructible: true }
    ]
  }
];
