export type AchievementIcon =
  | 'trophy'
  | 'star'
  | 'shield'
  | 'flame'
  | 'zap'
  | 'skull'
  | 'globe'
  | 'rocket'
  | 'heart'
  | 'target'
  | 'crown'
  | 'gem'
  | 'clock'
  | 'bomb';

export interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  icon: AchievementIcon;
  secret?: boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_pop', title: 'Primeiro Estouro', desc: 'Estoure sua primeira Esfera Prisma.', icon: 'target' },
  { id: 'combo_5', title: 'Reação em Cadeia', desc: 'Alcance um combo de x5.', icon: 'flame' },
  { id: 'combo_10', title: 'Maestro do Combo', desc: 'Alcance um combo de x10.', icon: 'zap' },
  { id: 'untouchable', title: 'Intocável', desc: 'Conclua uma fase sem ser atingido nem perder o escudo.', icon: 'shield' },
  { id: 'speed_run', title: 'Relâmpago', desc: 'Conclua uma fase com 70% ou mais do tempo restante.', icon: 'clock' },
  { id: 'collector', title: 'Colecionador', desc: 'Colete os 6 tipos de power-up.', icon: 'gem' },
  { id: 'shield_save', title: 'Salvo pelo Escudo', desc: 'Bloqueie um golpe usando o escudo.', icon: 'shield' },
  { id: 'dynamite', title: 'Pavio Curto', desc: 'Detone uma Dinamite.', icon: 'bomb' },
  { id: 'ice_time', title: 'Tempo Congelado', desc: 'Estoure uma esfera com o Relógio ativo.', icon: 'clock' },
  { id: 'space_tourist', title: 'Turista Espacial', desc: 'Chegue à Lua.', icon: 'rocket' },
  { id: 'world_traveler', title: 'Cidadão do Mundo', desc: 'Conclua 12 fases diferentes.', icon: 'globe' },
  { id: 'score_50k', title: 'Cinquenta Mil', desc: 'Alcance 50.000 pontos em uma partida.', icon: 'star' },
  { id: 'score_100k', title: 'Lenda do Arcade', desc: 'Alcance 100.000 pontos em uma partida.', icon: 'crown' },
  { id: 'boss_1', title: 'Caçador de Chefes', desc: 'Derrote seu primeiro chefe.', icon: 'skull' },
  { id: 'boss_perfect', title: 'Chefe sem Arranhão', desc: 'Derrote um chefe sem perder nenhuma vida.', icon: 'skull' },
  { id: 'sky_master', title: 'Mestre dos Céus', desc: 'Derrote os 5 chefes.', icon: 'crown' },
  { id: 'finish_story', title: 'Volta ao Universo', desc: 'Conclua o Modo História.', icon: 'trophy' },
  { id: 'no_continue', title: 'Sem Continue', desc: 'Zere o Modo História do início ao fim sem usar nenhum continue.', icon: 'trophy' },
  { id: 'perfect_run', title: 'Ás Absoluto', desc: 'Zere o Modo História sem perder uma única vida.', icon: 'heart', secret: true }
];

export interface AchievementRun {
  continues: number;
  livesLost: number;
  valid: boolean;
}

export interface AchievementSave {
  unlocked: Record<string, number>;
  powerupTypes: string[];
  bossesDefeated: string[];
  clearedStages: number[];
  run: AchievementRun;
}

const KEY = 'super_pang_world_tour_achievements_v1';

export function emptyAchievementSave(): AchievementSave {
  return {
    unlocked: {},
    powerupTypes: [],
    bossesDefeated: [],
    clearedStages: [],
    run: { continues: 0, livesLost: 0, valid: true }
  };
}

export function loadAchievements(): AchievementSave {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyAchievementSave();
    const p = JSON.parse(raw) as Partial<AchievementSave>;
    const base = emptyAchievementSave();
    return {
      unlocked: p.unlocked && typeof p.unlocked === 'object' ? p.unlocked : base.unlocked,
      powerupTypes: Array.isArray(p.powerupTypes) ? p.powerupTypes : base.powerupTypes,
      bossesDefeated: Array.isArray(p.bossesDefeated) ? p.bossesDefeated : base.bossesDefeated,
      clearedStages: Array.isArray(p.clearedStages) ? p.clearedStages : base.clearedStages,
      run: {
        continues: Number(p.run?.continues) || 0,
        livesLost: Number(p.run?.livesLost) || 0,
        valid: p.run?.valid !== false
      }
    };
  } catch {
    return emptyAchievementSave();
  }
}

export function saveAchievements(save: AchievementSave): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // ignore storage errors
  }
}
