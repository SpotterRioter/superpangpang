import { StoryMusicMood, ThemeId } from './types';

export type OstTrackKey = ThemeId | 'travel' | 'title' | StoryMusicMood;

type InstrumentProfile =
  | 'koto'
  | 'oud'
  | 'synthwave'
  | 'accordion'
  | 'steelpan'
  | 'flute'
  | 'samba'
  | 'funk'
  | 'bandoneon'
  | 'panflute'
  | 'salsa'
  | 'swing'
  | 'jazzhop'
  | 'flamenco'
  | 'britrock'
  | 'mandolin'
  | 'balalaika'
  | 'sitar'
  | 'ranat'
  | 'guzheng'
  | 'surf'
  | 'ukulele'
  | 'spacepad'
  | 'bosssynth'
  | 'arcadebrass';

type DrumStyle =
  | 'taiko'
  | 'darbuka'
  | 'synth'
  | 'polka'
  | 'calypso'
  | 'samba'
  | 'groove'
  | 'tango'
  | 'huayno'
  | 'salsa'
  | 'swing'
  | 'flamenco'
  | 'rock'
  | 'tarantella'
  | 'space'
  | 'boss'
  | 'cinematic';

export interface OstTrackDef {
  title: string;
  bpm: number;
  instrument: InstrumentProfile;
  drumStyle: DrumStyle;
  /** 64 steps (4 bars of 16th notes) — Primary A Theme */
  melody: (string | 0)[];
  /** Optional custom 64-step B-section melody (auto-developed in scale if omitted) */
  melodyB?: (string | 0)[];
  /** 64 steps (4 bars of 16th notes) */
  bass: (string | 0)[];
  /** 16 chord entries (1 per beat across 4 bars) */
  chords: (string[] | 0)[];
  /** Arpeggiate chords on 16th/8th notes vs sustained pad/stabs */
  arpMode: 'arp' | 'stab' | 'pad' | 'offbeat';
}

export interface DynamicMusicState {
  timeRatio: number;
  comboCount: number;
  frozen: boolean;
  bubbleCount: number;
}

export type SongSectionId = 'A' | 'A_VAR' | 'B_BRIDGE' | 'C_BREAK' | 'D_CLIMAX';

const SECTION_ORDER: SongSectionId[] = ['A', 'A_VAR', 'B_BRIDGE', 'C_BREAK', 'D_CLIMAX'];

const SECTION_LABELS: Record<SongSectionId, string> = {
  A: 'Tema I',
  A_VAR: 'Contra-Melodia',
  B_BRIDGE: 'Ponte Harmônica',
  C_BREAK: 'Atmosfera',
  D_CLIMAX: 'Clímax'
};

const CHROMATIC = ['C', 'Cs', 'D', 'Eb', 'E', 'F', 'Fs', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

const NOTE_FREQ: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  for (let oct = 1; oct <= 7; oct++) {
    CHROMATIC.forEach((name, semi) => {
      const midi = (oct + 1) * 12 + semi;
      map[`${name}${oct}`] = 440 * Math.pow(2, (midi - 69) / 12);
    });
  }
  return map;
})();

function shiftOctave(note: string, deltaOct: number): string {
  const match = /^([A-Za-z]+)(\d)$/.exec(note);
  if (!match) return note;
  const oct = Math.max(2, Math.min(6, parseInt(match[2], 10) + deltaOct));
  const candidate = `${match[1]}${oct}`;
  return NOTE_FREQ[candidate] ? candidate : note;
}

/** Extracts ordered unique pitch classes + octave pool used by a track so algorithmic B-sections & ornaments stay 100% in the regional scale (Hijaz, In-Sen, Raga, Phrygian, etc.) */
function extractTrackScalePool(track: OstTrackDef): string[] {
  const seen = new Set<string>();
  for (const n of track.melody) {
    if (n && NOTE_FREQ[n]) seen.add(n);
  }
  for (const c of track.chords) {
    if (c) {
      for (const cn of c) {
        const up = shiftOctave(cn, 1);
        if (NOTE_FREQ[up]) seen.add(up);
      }
    }
  }
  const arr = Array.from(seen);
  arr.sort((a, b) => (NOTE_FREQ[a] || 0) - (NOTE_FREQ[b] || 0));
  return arr;
}

/** Deterministic musical B-section & counter-melody generator locked strictly to each track's authentic regional scale and chord progression */
const derivedBSectionCache = new Map<OstTrackKey, { melodyB: (string | 0)[]; chordsB: (string[] | 0)[]; bassB: (string | 0)[] }>();

function getDerivedBSection(key: OstTrackKey, track: OstTrackDef) {
  const cached = derivedBSectionCache.get(key);
  if (cached) return cached;

  const pool = extractTrackScalePool(track);
  // Re-order chords to create a genuine harmonic bridge (starting on bar 3 subdominant/relative harmony -> turnaround)
  const chordsB: (string[] | 0)[] = [
    track.chords[8] ?? track.chords[2],
    track.chords[9] ?? track.chords[3],
    track.chords[10] ?? track.chords[5],
    track.chords[11] ?? track.chords[6],
    track.chords[4] ?? track.chords[0],
    track.chords[5] ?? track.chords[1],
    track.chords[6] ?? track.chords[2],
    track.chords[7] ?? track.chords[3],
    track.chords[8] ?? track.chords[2],
    track.chords[12] ?? track.chords[4],
    track.chords[13] ?? track.chords[6],
    track.chords[14] ?? track.chords[7],
    track.chords[12] ?? track.chords[2],
    track.chords[13] ?? track.chords[3],
    track.chords[14] ?? track.chords[15],
    track.chords[15] ?? track.chords[0]
  ];

  const melodyB: (string | 0)[] = track.melodyB
    ? track.melodyB
    : Array.from({ length: 64 }, (_, step) => {
        const chord = chordsB[Math.floor(step / 4)] || track.chords[0] || ['C4', 'E4', 'G4'];
        const bar = Math.floor(step / 16);
        const pos = step % 16;

        // Call-and-response lyrical contour distinct from Section A
        if (pos === 14 || pos === 15) return 0;
        if (bar === 1 && pos >= 12) return 0;
        if (bar === 3 && pos >= 13) return 0;

        if (pos === 0) return shiftOctave(chord[chord.length - 1], 1);
        if (pos === 3 || pos === 6 || pos === 10) {
          const target = shiftOctave(chord[(pos + bar) % chord.length], 1);
          return target;
        }
        if (pos === 4 || pos === 8 || pos === 12) {
          if (pool.length === 0) return 0;
          const idx = ( pool.length - 1 - ((bar * 3 + Math.floor(pos / 2)) % pool.length) + pool.length ) % pool.length;
          return pool[idx];
        }
        // Subtle syncopated passing note from original motif retrograde
        const retro = track.melody[63 - step];
        if (retro && (pos === 2 || pos === 7 || pos === 11)) {
          return retro;
        }
        return 0;
      });

  const bassB: (string | 0)[] = Array.from({ length: 64 }, (_, step) => {
    const chord = chordsB[Math.floor(step / 4)];
    if (!chord || chord.length === 0) return 0;
    const root = shiftOctave(chord[0], -1);
    const fifth = shiftOctave(chord[chord.length - 1], -1);
    const sub = step % 4;
    if (sub === 0) return root;
    if (sub === 2 && track.bpm >= 124) return fifth;
    if (step % 8 === 7) return fifth;
    return 0;
  });

  const result = { melodyB, chordsB, bassB };
  derivedBSectionCache.set(key, result);
  return result;
}

/** Helper to expand 4 bar strings into a 64-step sequence */
function seq(...bars: (string | 0)[][]): (string | 0)[] {
  return bars.flat();
}

export const OST_TRACKS: Record<OstTrackKey, OstTrackDef> = {
  title: {
    title: 'Abertura Mundial (Super Pang Overture)',
    bpm: 132,
    instrument: 'arcadebrass',
    drumStyle: 'rock',
    arpMode: 'arp',
    melody: seq(
      ['C5', 0, 'E5', 'G5', 'C6', 0, 'G5', 'E5', 'A5', 0, 'G5', 'F5', 'E5', 0, 'D5', 0],
      ['C5', 0, 'E5', 'G5', 'C6', 0, 'D6', 'C6', 'B5', 0, 'A5', 'G5', 'G5', 0, 0, 0],
      ['A5', 0, 'A5', 'B5', 'C6', 0, 'A5', 'F5', 'G5', 0, 'G5', 'A5', 'B5', 0, 'G5', 'E5'],
      ['F5', 0, 'A5', 'C6', 'B5', 0, 'G5', 'D5', 'E5', 'G5', 'C6', 0, 'C6', 0, 0, 0]
    ),
    bass: seq(
      ['C3', 0, 'C3', 'G2', 'C3', 0, 'E3', 0, 'F2', 0, 'F2', 'C3', 'G2', 0, 'B2', 0],
      ['C3', 0, 'C3', 'G2', 'A2', 0, 'E3', 0, 'G2', 0, 'D3', 'B2', 'G2', 'A2', 'B2', 0],
      ['F2', 0, 'F2', 'C3', 'F2', 0, 'A2', 0, 'E2', 0, 'E2', 'B2', 'E2', 0, 'G2', 0],
      ['D2', 0, 'A2', 'F2', 'G2', 0, 'D3', 'G2', 'C3', 0, 'G2', 0, 'C2', 0, 0, 0]
    ),
    chords: [
      ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5'],
      ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['G3', 'B3', 'D4'], ['G3', 'B3', 'D4'],
      ['F3', 'A3', 'C4'], ['F3', 'A3', 'C4'], ['E3', 'G3', 'B3'], ['E3', 'G3', 'B3'],
      ['D3', 'F3', 'A3'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4']
    ]
  },

  travel: {
    title: 'Voo Panorâmico (World Tour Map)',
    bpm: 136,
    instrument: 'arcadebrass',
    drumStyle: 'swing',
    arpMode: 'arp',
    melody: seq(
      ['G4', 'C5', 'E5', 'G5', 'C6', 0, 'B5', 'A5', 'G5', 0, 'E5', 'D5', 'C5', 0, 'E5', 0],
      ['F5', 0, 'A5', 'C6', 'B5', 0, 'G5', 'D5', 'E5', 'G5', 'B5', 'G5', 'C6', 0, 0, 0],
      ['A5', 0, 'C6', 'A5', 'G5', 0, 'E5', 'C5', 'D5', 'F5', 'A5', 'G5', 'F5', 0, 'D5', 0],
      ['E5', 'G5', 'C6', 'D6', 'E6', 0, 'D6', 'C6', 'B5', 0, 'G5', 'B5', 'C6', 0, 0, 0]
    ),
    bass: seq(
      ['C3', 0, 'G2', 0, 'E2', 0, 'G2', 0, 'C3', 0, 'G2', 0, 'A2', 0, 'G2', 0],
      ['F2', 0, 'C3', 0, 'G2', 0, 'D3', 0, 'E2', 0, 'B2', 0, 'C3', 0, 'G2', 0],
      ['F2', 0, 'C3', 0, 'E2', 0, 'C3', 0, 'D2', 0, 'A2', 0, 'G2', 0, 'D3', 0],
      ['C3', 0, 'E3', 0, 'A2', 0, 'E3', 0, 'G2', 0, 'D3', 0, 'C3', 0, 'G2', 0]
    ),
    chords: [
      ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'],
      ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['E3', 'G3', 'B3'], ['C4', 'E4', 'G4'],
      ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['D3', 'F3', 'A3'], ['G3', 'B3', 'D4'],
      ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4']
    ]
  },

  // =========================================================================
  // DEDICATED STORY MODE CINEMATIC THEMES
  // =========================================================================
  story_heroic: {
    title: 'Asas do Esquadrão Pang — Briefing',
    bpm: 116,
    instrument: 'arcadebrass',
    drumStyle: 'cinematic',
    arpMode: 'arp',
    melody: seq(
      ['G4', 0, 'C5', 'D5', 'E5', 0, 'G5', 0, 'F5', 0, 'E5', 'D5', 'E5', 0, 0, 0],
      ['A4', 0, 'C5', 'E5', 'G5', 0, 'F5', 'E5', 'D5', 0, 'C5', 'B4', 'G4', 0, 0, 0],
      ['F4', 0, 'A4', 'C5', 'F5', 0, 'E5', 'D5', 'E5', 0, 'G5', 'C6', 'B5', 0, 'G5', 0],
      ['A5', 0, 'G5', 'F5', 'E5', 0, 'D5', 'C5', 'D5', 0, 'B4', 0, 'C5', 0, 0, 0]
    ),
    bass: seq(
      ['C2', 0, 0, 0, 'G2', 0, 0, 0, 'F2', 0, 0, 0, 'C3', 0, 'G2', 0],
      ['A2', 0, 0, 0, 'E2', 0, 0, 0, 'G2', 0, 0, 0, 'D2', 0, 'G2', 0],
      ['F2', 0, 0, 0, 'C3', 0, 0, 0, 'E2', 0, 0, 0, 'G2', 0, 0, 0],
      ['F2', 0, 0, 0, 'G2', 0, 0, 0, 'G2', 0, 'D2', 0, 'C2', 0, 0, 0]
    ),
    chords: [
      ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'],
      ['A3', 'C4', 'E4'], ['E3', 'G3', 'B3'], ['G3', 'B3', 'D4'], ['G3', 'B3', 'D4'],
      ['F3', 'A3', 'C4'], ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'],
      ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4']
    ]
  },

  story_mystery: {
    title: 'Ecos dos Monumentos — Mistério Prisma',
    bpm: 102,
    instrument: 'flute',
    drumStyle: 'space',
    arpMode: 'arp',
    melody: seq(
      ['A4', 0, 'E5', 0, 'D5', 0, 'C5', 'B4', 'C5', 0, 0, 'A4', 'E4', 0, 0, 0],
      ['F4', 0, 'C5', 0, 'B4', 0, 'A4', 'G4', 'A4', 0, 0, 0, 'B4', 0, 0, 0],
      ['C5', 0, 'G5', 0, 'F5', 0, 'E5', 'D5', 'E5', 0, 'C5', 0, 'D5', 0, 0, 0],
      ['E5', 0, 'D5', 'C5', 'B4', 0, 'Ab4', 'B4', 'A4', 0, 0, 0, 0, 0, 0, 0]
    ),
    bass: seq(
      ['A2', 0, 0, 0, 'E2', 0, 0, 0, 'F2', 0, 0, 0, 'C2', 0, 0, 0],
      ['D2', 0, 0, 0, 'A2', 0, 0, 0, 'F2', 0, 0, 0, 'E2', 0, 0, 0],
      ['C2', 0, 0, 0, 'G2', 0, 0, 0, 'D2', 0, 0, 0, 'A2', 0, 0, 0],
      ['F2', 0, 0, 0, 'E2', 0, 0, 0, 'A2', 0, 0, 0, 'A2', 0, 0, 0]
    ),
    chords: [
      ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['F3', 'A3', 'C4'],
      ['D3', 'F3', 'A3'], ['D3', 'F3', 'A3'], ['F3', 'A3', 'C4'], ['E3', 'Ab3', 'B3'],
      ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['D3', 'F3', 'A3'], ['A3', 'C4', 'E4'],
      ['F3', 'A3', 'C4'], ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4']
    ]
  },

  story_vesper: {
    title: 'Frequência Omega — Tema de Barão Vesper',
    bpm: 124,
    instrument: 'bosssynth',
    drumStyle: 'cinematic',
    arpMode: 'arp',
    melody: seq(
      ['D5', 0, 'A4', 'D5', 'F5', 0, 'E5', 'D5', 'Cs5', 0, 'A4', 'Cs5', 'E5', 0, 'G5', 'F5'],
      ['D5', 0, 'F5', 'A5', 'Bb5', 0, 'A5', 'G5', 'F5', 0, 'E5', 'D5', 'Cs5', 0, 0, 0],
      ['G5', 0, 'Bb5', 'A5', 'G5', 0, 'F5', 'E5', 'F5', 0, 'A5', 'G5', 'F5', 0, 'E5', 'D5'],
      ['Eb5', 0, 'G5', 'F5', 'E5', 0, 'Cs5', 'A4', 'D5', 0, 0, 0, 'D5', 0, 0, 0]
    ),
    bass: seq(
      ['D2', 0, 'D3', 0, 'Bb2', 0, 'F2', 0, 'A2', 0, 'E2', 0, 'A2', 0, 'Cs3', 0],
      ['D2', 0, 'A2', 0, 'G2', 0, 'D2', 0, 'Bb2', 0, 'F2', 0, 'A2', 0, 'E2', 0],
      ['G2', 0, 'D3', 0, 'C3', 0, 'G2', 0, 'F2', 0, 'C3', 0, 'Bb2', 0, 'F2', 0],
      ['Eb2', 0, 'Bb2', 0, 'A2', 0, 'E2', 0, 'D2', 0, 'A2', 0, 'D2', 0, 0, 0]
    ),
    chords: [
      ['D3', 'F3', 'A3'], ['Bb3', 'D4', 'F4'], ['A3', 'Cs4', 'E4'], ['A3', 'Cs4', 'E4'],
      ['D3', 'F3', 'A3'], ['G3', 'Bb3', 'D4'], ['Bb3', 'D4', 'F4'], ['A3', 'Cs4', 'E4'],
      ['G3', 'Bb3', 'D4'], ['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'], ['Bb3', 'D4', 'F4'],
      ['Eb3', 'G3', 'Bb3'], ['A3', 'Cs4', 'E4'], ['D3', 'F3', 'A3'], ['D3', 'F3', 'A3']
    ]
  },

  story_space: {
    title: 'Estrela Polar — Rumo ao Espaço Profundo',
    bpm: 98,
    instrument: 'spacepad',
    drumStyle: 'space',
    arpMode: 'pad',
    melody: seq(
      ['E5', 0, 0, 'B5', 0, 0, 'A5', 0, 'G5', 0, 0, 'Fs5', 'E5', 0, 0, 0],
      ['C6', 0, 0, 'B5', 0, 0, 'G5', 0, 'A5', 0, 0, 'Fs5', 'B4', 0, 0, 0],
      ['G5', 0, 0, 'A5', 'B5', 0, 0, 'D6', 'C6', 0, 0, 'B5', 'A5', 0, 0, 0],
      ['B5', 0, 'G5', 0, 'Fs5', 0, 'D5', 0, 'E5', 0, 0, 0, 0, 0, 0, 0]
    ),
    bass: seq(
      ['E2', 0, 0, 0, 0, 0, 0, 0, 'C2', 0, 0, 0, 0, 0, 0, 0],
      ['A2', 0, 0, 0, 0, 0, 0, 0, 'B2', 0, 0, 0, 0, 0, 0, 0],
      ['C2', 0, 0, 0, 0, 0, 0, 0, 'D2', 0, 0, 0, 0, 0, 0, 0],
      ['G2', 0, 0, 0, 'B2', 0, 0, 0, 'E2', 0, 0, 0, 0, 0, 0, 0]
    ),
    chords: [
      ['E3', 'G3', 'B3', 'D4'], ['E3', 'G3', 'B3', 'D4'], ['C3', 'E3', 'G3', 'B3'], ['C3', 'E3', 'G3', 'B3'],
      ['A2', 'C3', 'E3', 'G3'], ['A2', 'C3', 'E3', 'G3'], ['B2', 'D3', 'Fs3', 'A3'], ['B2', 'D3', 'Fs3'],
      ['C3', 'E3', 'G3', 'B3'], ['C3', 'E3', 'G3'], ['D3', 'Fs3', 'A3'], ['D3', 'Fs3', 'A3'],
      ['G3', 'B3', 'D4'], ['B2', 'D3', 'Fs3'], ['E3', 'G3', 'B3'], ['E3', 'G3', 'B3']
    ]
  },

  story_epilogue: {
    title: 'Alvorada de Dois Mundos — Epílogo',
    bpm: 112,
    instrument: 'ukulele',
    drumStyle: 'cinematic',
    arpMode: 'arp',
    melody: seq(
      ['C5', 0, 'G5', 0, 'E5', 'F5', 'G5', 'A5', 'G5', 0, 'E5', 0, 'D5', 0, 0, 0],
      ['E5', 0, 'G5', 'C6', 'B5', 0, 'A5', 'G5', 'A5', 0, 'C6', 0, 'G5', 0, 0, 0],
      ['F5', 0, 'A5', 'C6', 'E6', 0, 'D6', 'C6', 'B5', 0, 'G5', 'A5', 'B5', 0, 'G5', 0],
      ['A5', 0, 'C6', 'A5', 'G5', 0, 'E5', 'D5', 'C5', 0, 0, 0, 'C6', 0, 0, 0]
    ),
    bass: seq(
      ['C3', 0, 0, 0, 'E2', 0, 0, 0, 'F2', 0, 0, 0, 'G2', 0, 0, 0],
      ['C3', 0, 0, 0, 'A2', 0, 0, 0, 'F2', 0, 0, 0, 'G2', 0, 0, 0],
      ['F2', 0, 0, 0, 'C3', 0, 0, 0, 'E2', 0, 0, 0, 'G2', 0, 0, 0],
      ['F2', 0, 0, 0, 'G2', 0, 0, 0, 'C3', 0, 'G2', 0, 'C2', 0, 0, 0]
    ),
    chords: [
      ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'],
      ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'],
      ['F3', 'A3', 'C4'], ['A3', 'C4', 'E4'], ['E3', 'G3', 'B3'], ['G3', 'B3', 'D4'],
      ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4']
    ]
  },

  // =========================================================================
  // 24 REGIONAL WORLD & SPACE DESTINATIONS
  // =========================================================================
  fuji: {
    title: 'Koto no Sakura — Monte Fuji',
    bpm: 118,
    instrument: 'koto',
    drumStyle: 'taiko',
    arpMode: 'arp',
    melody: seq(
      ['D5', 0, 'Eb5', 'G5', 'A5', 0, 'G5', 'Eb5', 'D5', 0, 'C5', 'A4', 'G4', 'A4', 'C5', 'D5'],
      ['D5', 0, 'G5', 'A5', 'Bb5', 0, 'A5', 'G5', 'A5', 0, 'G5', 'Eb5', 'D5', 0, 0, 0],
      ['A5', 0, 'Bb5', 'D6', 'C6', 0, 'A5', 'G5', 'Eb5', 0, 'G5', 'A5', 'G5', 'Eb5', 'D5', 0],
      ['C5', 0, 'D5', 'Eb5', 'G5', 0, 'A5', 'G5', 'Eb5', 'D5', 'C5', 'A4', 'D5', 0, 0, 0]
    ),
    bass: seq(
      ['D2', 0, 0, 'A2', 'D2', 0, 'A2', 0, 'G2', 0, 0, 'D2', 'A2', 0, 'D2', 0],
      ['D2', 0, 0, 'A2', 'Bb2', 0, 'F2', 0, 'A2', 0, 'G2', 0, 'D2', 0, 'A2', 0],
      ['G2', 0, 'D3', 0, 'C3', 0, 'G2', 0, 'Eb2', 0, 'Bb2', 0, 'D2', 0, 'A2', 0],
      ['C2', 0, 'G2', 0, 'Eb2', 0, 'Bb2', 0, 'A2', 0, 'G2', 0, 'D2', 0, 0, 0]
    ),
    chords: [
      ['D4', 'G4', 'A4'], ['D4', 'G4', 'A4'], ['G3', 'Bb3', 'D4'], ['A3', 'D4', 'E4'],
      ['D4', 'G4', 'A4'], ['Bb3', 'D4', 'F4'], ['A3', 'C4', 'E4'], ['D4', 'G4', 'A4'],
      ['G3', 'C4', 'D4'], ['C4', 'Eb4', 'G4'], ['Eb3', 'G3', 'Bb3'], ['D4', 'G4', 'A4'],
      ['C4', 'Eb4', 'G4'], ['Eb3', 'G3', 'Bb3'], ['A3', 'C4', 'E4'], ['D4', 'A4', 'D5']
    ]
  },

  pyramids: {
    title: 'Dunas de Gizé — Hijaz do Nilo',
    bpm: 122,
    instrument: 'oud',
    drumStyle: 'darbuka',
    arpMode: 'arp',
    melody: seq(
      ['D5', 'Eb5', 'Fs5', 'G5', 'A5', 0, 'G5', 'Fs5', 'Eb5', 'D5', 'Eb5', 'Fs5', 'G5', 'Fs5', 'Eb5', 'D5'],
      ['A5', 0, 'Bb5', 'A5', 'G5', 'Fs5', 'Eb5', 'D5', 'Fs5', 'G5', 'A5', 'G5', 'Fs5', 0, 0, 0],
      ['D6', 0, 'C6', 'Bb5', 'A5', 0, 'G5', 'Fs5', 'G5', 'A5', 'Bb5', 'A5', 'G5', 'Fs5', 'Eb5', 'D5'],
      ['Eb5', 'Fs5', 'G5', 'A5', 'Fs5', 'Eb5', 'D5', 'C5', 'D5', 'Eb5', 'Fs5', 'G5', 'D5', 0, 0, 0]
    ),
    bass: seq(
      ['D2', 0, 'A2', 0, 'D2', 0, 'A2', 'D2', 'Eb2', 0, 'Bb2', 0, 'D2', 0, 'A2', 0],
      ['D2', 0, 'A2', 0, 'G2', 0, 'D2', 0, 'Eb2', 0, 'D2', 0, 'A2', 0, 'D2', 0],
      ['G2', 0, 'D3', 0, 'D2', 0, 'A2', 0, 'Eb2', 0, 'Bb2', 0, 'D2', 0, 'A2', 0],
      ['Eb2', 0, 'Bb2', 0, 'C2', 0, 'G2', 0, 'A2', 0, 'Eb2', 0, 'D2', 0, 'A2', 0]
    ),
    chords: [
      ['D4', 'Fs4', 'A4'], ['D4', 'Fs4', 'A4'], ['Eb4', 'G4', 'Bb4'], ['D4', 'Fs4', 'A4'],
      ['D4', 'Fs4', 'A4'], ['G3', 'Bb3', 'D4'], ['Eb4', 'G4', 'Bb4'], ['D4', 'Fs4', 'A4'],
      ['G3', 'Bb3', 'D4'], ['D4', 'Fs4', 'A4'], ['Eb4', 'G4', 'Bb4'], ['D4', 'Fs4', 'A4'],
      ['Eb4', 'G4', 'Bb4'], ['C4', 'Eb4', 'G4'], ['D4', 'Fs4', 'A4'], ['D4', 'Fs4', 'A4']
    ]
  },

  neon: {
    title: 'Tokyo Outrun 1989 — Synthwave',
    bpm: 134,
    instrument: 'synthwave',
    drumStyle: 'synth',
    arpMode: 'arp',
    melody: seq(
      ['A4', 0, 'C5', 'E5', 'G5', 0, 'E5', 'D5', 'C5', 0, 'A4', 'G4', 'A4', 'C5', 'E5', 0],
      ['A5', 0, 'G5', 'E5', 'D5', 0, 'C5', 'B4', 'C5', 0, 'E5', 'G5', 'E5', 0, 0, 0],
      ['F5', 0, 'A5', 'C6', 'B5', 0, 'G5', 'E5', 'D5', 0, 'F5', 'A5', 'G5', 0, 'E5', 'D5'],
      ['C5', 0, 'E5', 'G5', 'A5', 0, 'G5', 'E5', 'D5', 'C5', 'B4', 'G4', 'A4', 0, 0, 0]
    ),
    bass: seq(
      ['A2', 'A2', 'A3', 'A2', 'A2', 'A2', 'G2', 'A2', 'F2', 'F2', 'F3', 'F2', 'G2', 'G2', 'G3', 'G2'],
      ['A2', 'A2', 'A3', 'A2', 'E2', 'E2', 'E3', 'E2', 'C2', 'C2', 'C3', 'C2', 'G2', 'G2', 'B2', 'G2'],
      ['F2', 'F2', 'F3', 'F2', 'G2', 'G2', 'G3', 'G2', 'D2', 'D2', 'D3', 'D2', 'E2', 'E2', 'E3', 'E2'],
      ['C2', 'C2', 'C3', 'C2', 'D2', 'D2', 'D3', 'D2', 'E2', 'E2', 'G2', 'E2', 'A2', 'A2', 'E2', 'A2']
    ),
    chords: [
      ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'],
      ['A3', 'C4', 'E4'], ['E3', 'G3', 'B3'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'],
      ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['D3', 'F3', 'A3'], ['E3', 'G3', 'B3'],
      ['C4', 'E4', 'G4'], ['D3', 'F3', 'A3'], ['E3', 'G3', 'B3'], ['A3', 'C4', 'E4']
    ]
  },

  alps: {
    title: 'Valsa dos Alpes — Aurora Suíça',
    bpm: 128,
    instrument: 'accordion',
    drumStyle: 'polka',
    arpMode: 'offbeat',
    melody: seq(
      ['C5', 'E5', 'G5', 'C6', 'A5', 0, 'G5', 'E5', 'D5', 'F5', 'A5', 'G5', 'E5', 0, 'C5', 0],
      ['G5', 'C6', 'E6', 'D6', 'C6', 0, 'A5', 'G5', 'F5', 'E5', 'D5', 'B4', 'C5', 0, 0, 0],
      ['A5', 0, 'C6', 'A5', 'G5', 0, 'E5', 'C5', 'D5', 0, 'F5', 'A5', 'G5', 0, 'D5', 0],
      ['E5', 'G5', 'C6', 'A5', 'G5', 'E5', 'D5', 'F5', 'E5', 'D5', 'C5', 'B4', 'C5', 0, 0, 0]
    ),
    bass: seq(
      ['C3', 0, 'G2', 0, 'C3', 0, 'G2', 0, 'G2', 0, 'D3', 0, 'C3', 0, 'G2', 0],
      ['C3', 0, 'G2', 0, 'F2', 0, 'C3', 0, 'G2', 0, 'D3', 0, 'C3', 0, 'G2', 0],
      ['F2', 0, 'C3', 0, 'C3', 0, 'G2', 0, 'D2', 0, 'A2', 0, 'G2', 0, 'D3', 0],
      ['C3', 0, 'A2', 0, 'F2', 0, 'G2', 0, 'G2', 0, 'D3', 0, 'C3', 0, 'G2', 0]
    ),
    chords: [
      ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'],
      ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'],
      ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['D3', 'F3', 'A3'], ['G3', 'B3', 'D4'],
      ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4']
    ]
  },

  caribbean: {
    title: 'Steelpan Calypso — Baía do Caribe',
    bpm: 124,
    instrument: 'steelpan',
    drumStyle: 'calypso',
    arpMode: 'offbeat',
    melody: seq(
      ['E5', 0, 'G5', 'E5', 0, 'C5', 'D5', 'E5', 'F5', 0, 'A5', 'G5', 0, 'E5', 'D5', 'C5'],
      ['G5', 0, 'A5', 'G5', 0, 'E5', 'G5', 'C6', 'B5', 0, 'A5', 'G5', 'G5', 0, 0, 0],
      ['A5', 0, 'C6', 'A5', 0, 'F5', 'A5', 'G5', 'E5', 0, 'G5', 'E5', 0, 'C5', 'E5', 'G5'],
      ['F5', 0, 'A5', 'G5', 'F5', 'E5', 'D5', 'G5', 'E5', 0, 'D5', 'C5', 'C5', 0, 0, 0]
    ),
    bass: seq(
      ['C3', 0, 0, 'G2', 0, 'C3', 0, 0, 'F2', 0, 0, 'C3', 0, 'G2', 0, 0],
      ['C3', 0, 0, 'E2', 0, 'G2', 0, 0, 'G2', 0, 0, 'D3', 0, 'G2', 0, 0],
      ['F2', 0, 0, 'C3', 0, 'F2', 0, 0, 'C3', 0, 0, 'G2', 0, 'C3', 0, 0],
      ['D2', 0, 0, 'F2', 0, 'G2', 0, 0, 'C3', 0, 0, 'G2', 'C3', 0, 0, 0]
    ),
    chords: [
      ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5'],
      ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['G4', 'B4', 'D5'],
      ['F4', 'A4', 'C5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'],
      ['D4', 'F4', 'A4'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4']
    ]
  },

  temple: {
    title: 'Sinos do Templo Dourado — Ásia',
    bpm: 112,
    instrument: 'flute',
    drumStyle: 'taiko',
    arpMode: 'pad',
    melody: seq(
      ['E5', 0, 'G5', 'A5', 'B5', 0, 'A5', 'G5', 'E5', 'D5', 'E5', 0, 'G5', 'E5', 'D5', 'B4'],
      ['E5', 0, 'A5', 'B5', 'D6', 0, 'B5', 'A5', 'G5', 0, 'A5', 'G5', 'E5', 0, 0, 0],
      ['B5', 0, 'D6', 'E6', 'D6', 0, 'B5', 'A5', 'G5', 'A5', 'B5', 0, 'A5', 'G5', 'E5', 0],
      ['D5', 0, 'E5', 'G5', 'A5', 0, 'G5', 'E5', 'D5', 'B4', 'D5', 'E5', 'E5', 0, 0, 0]
    ),
    bass: seq(
      ['E2', 0, 0, 'B2', 'E2', 0, 0, 0, 'A2', 0, 0, 'E2', 'B2', 0, 'E2', 0],
      ['E2', 0, 0, 'B2', 'G2', 0, 'D2', 0, 'A2', 0, 'B2', 0, 'E2', 0, 0, 0],
      ['G2', 0, 0, 'D3', 'B2', 0, 0, 0, 'C3', 0, 'G2', 0, 'B2', 0, 'E2', 0],
      ['D2', 0, 0, 'A2', 'A2', 0, 'E2', 0, 'B2', 0, 'D2', 0, 'E2', 0, 0, 0]
    ),
    chords: [
      ['E3', 'G3', 'B3'], ['E3', 'G3', 'B3'], ['A3', 'D4', 'E4'], ['B3', 'E4', 'Fs4'],
      ['E3', 'G3', 'B3'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['E3', 'G3', 'B3'],
      ['G3', 'B3', 'D4'], ['B3', 'D4', 'Fs4'], ['C4', 'E4', 'G4'], ['B3', 'D4', 'Fs4'],
      ['D3', 'G3', 'A3'], ['A3', 'C4', 'E4'], ['B3', 'D4', 'Fs4'], ['E3', 'G3', 'B3']
    ]
  },

  rio: {
    title: 'Samba de Copacabana — Rio de Janeiro',
    bpm: 132,
    instrument: 'samba',
    drumStyle: 'samba',
    arpMode: 'offbeat',
    melody: seq(
      ['G5', 'A5', 'B5', 'D6', 0, 'C6', 'B5', 'A5', 'B5', 0, 'G5', 'E5', 'A5', 'B5', 'D6', 0],
      ['E6', 0, 'D6', 'B5', 0, 'A5', 'G5', 'E5', 'Fs5', 'A5', 'D6', 'C6', 'B5', 0, 0, 0],
      ['C6', 0, 'B5', 'A5', 0, 'G5', 'A5', 'B5', 'A5', 0, 'G5', 'Fs5', 'E5', 0, 'G5', 'A5'],
      ['B5', 0, 'D6', 'B5', 'A5', 'G5', 'Fs5', 'A5', 'G5', 0, 'D5', 'G5', 'G5', 0, 0, 0]
    ),
    bass: seq(
      ['G2', 0, 'D2', 0, 'G2', 0, 'D2', 'E2', 'C2', 0, 'G2', 0, 'D2', 0, 'G2', 0],
      ['E2', 0, 'B2', 0, 'A2', 0, 'E2', 0, 'D2', 0, 'A2', 0, 'G2', 0, 'D2', 0],
      ['C2', 0, 'G2', 0, 'B2', 0, 'E2', 0, 'A2', 0, 'E2', 0, 'D2', 0, 'A2', 0],
      ['G2', 0, 'E2', 0, 'A2', 0, 'D2', 0, 'G2', 0, 'D2', 0, 'G2', 0, 0, 0]
    ),
    chords: [
      ['G3', 'B3', 'D4', 'Fs4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['D4', 'Fs4', 'A4'],
      ['E3', 'G3', 'B3'], ['A3', 'C4', 'E4'], ['D4', 'Fs4', 'A4'], ['G3', 'B3', 'D4'],
      ['C4', 'E4', 'G4'], ['E3', 'G3', 'B3'], ['A3', 'C4', 'E4'], ['D4', 'Fs4', 'A4'],
      ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['D4', 'Fs4', 'A4'], ['G3', 'B3', 'D4']
    ]
  },

  saopaulo: {
    title: 'Paulista Night Groove — São Paulo',
    bpm: 126,
    instrument: 'funk',
    drumStyle: 'groove',
    arpMode: 'stab',
    melody: seq(
      ['E5', 0, 'G5', 'A5', 0, 'Bb5', 'A5', 'G5', 'E5', 0, 'D5', 'E5', 'G5', 0, 'B5', 'A5'],
      ['E5', 0, 'G5', 'A5', 'B5', 0, 'D6', 'B5', 'A5', 'G5', 'E5', 'D5', 'E5', 0, 0, 0],
      ['A5', 0, 'C6', 'A5', 'G5', 0, 'E5', 'D5', 'G5', 0, 'B5', 'A5', 'G5', 'E5', 'D5', 0],
      ['E5', 'G5', 'A5', 'Bb5', 'A5', 'G5', 'E5', 'D5', 'B4', 'D5', 'E5', 'G5', 'E5', 0, 0, 0]
    ),
    bass: seq(
      ['E2', 0, 'E2', 'G2', 0, 'A2', 0, 'G2', 'E2', 0, 'D2', 'E2', 'G2', 0, 'B2', 'A2'],
      ['E2', 0, 'E3', 'D3', 'B2', 0, 'A2', 'G2', 'A2', 0, 'B2', 'D3', 'E2', 0, 'B2', 0],
      ['A2', 0, 'A2', 'C3', 'G2', 0, 'G2', 'B2', 'D2', 0, 'D2', 'G2', 'B2', 0, 'A2', 0],
      ['C2', 0, 'C3', 'B2', 'A2', 0, 'G2', 'Fs2', 'E2', 0, 'G2', 'B2', 'E2', 0, 0, 0]
    ),
    chords: [
      ['E3', 'G3', 'B3', 'D4'], ['E3', 'G3', 'B3'], ['E3', 'G3', 'B3'], ['D3', 'G3', 'B3'],
      ['E3', 'G3', 'B3'], ['A3', 'C4', 'E4'], ['G3', 'B3', 'D4'], ['E3', 'G3', 'B3'],
      ['A3', 'C4', 'E4'], ['G3', 'B3', 'D4'], ['D3', 'Fs3', 'A3'], ['B3', 'D4', 'Fs4'],
      ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['B3', 'D4', 'Fs4'], ['E3', 'G3', 'B3']
    ]
  },

  buenosaires: {
    title: 'Tango de La Boca — Buenos Aires',
    bpm: 118,
    instrument: 'bandoneon',
    drumStyle: 'tango',
    arpMode: 'stab',
    melody: seq(
      ['E5', 0, 'C5', 'B4', 'A4', 0, 'Ab4', 'A4', 'F5', 0, 'D5', 'C5', 'B4', 0, 'Ab4', 'E4'],
      ['E5', 0, 'A5', 'G5', 'F5', 0, 'E5', 'D5', 'C5', 'B4', 'A4', 'Ab4', 'A4', 0, 0, 0],
      ['A5', 0, 'G5', 'F5', 'E5', 0, 'D5', 'C5', 'D5', 0, 'F5', 'E5', 'D5', 'C5', 'B4', 0],
      ['E5', 'Ab5', 'B5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5', 0, 'B4', 'Ab4', 'A4', 0, 0, 0]
    ),
    bass: seq(
      ['A2', 0, 0, 'E2', 'A2', 0, 'E2', 0, 'D2', 0, 0, 'A2', 'E2', 0, 'Ab2', 0],
      ['A2', 0, 0, 'E2', 'D2', 0, 'F2', 0, 'E2', 0, 'Ab2', 0, 'A2', 0, 'E2', 0],
      ['F2', 0, 0, 'C3', 'C3', 0, 'G2', 0, 'D2', 0, 0, 'A2', 'E2', 0, 'B2', 0],
      ['E2', 0, 'Ab2', 'B2', 'D2', 0, 'F2', 0, 'E2', 0, 'Ab2', 0, 'A2', 0, 0, 0]
    ),
    chords: [
      ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'], ['D3', 'F3', 'A3'], ['E3', 'Ab3', 'B3'],
      ['A3', 'C4', 'E4'], ['D3', 'F3', 'A3'], ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4'],
      ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['D3', 'F3', 'A3'], ['E3', 'Ab3', 'B3'],
      ['E3', 'Ab3', 'B3'], ['D3', 'F3', 'A3'], ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4']
    ]
  },

  machupicchu: {
    title: 'Flauta dos Andes — Machu Picchu',
    bpm: 118,
    instrument: 'panflute',
    drumStyle: 'huayno',
    arpMode: 'arp',
    melody: seq(
      ['A4', 'C5', 'D5', 'E5', 'G5', 'E5', 'D5', 'C5', 'D5', 'E5', 'C5', 'A4', 'G4', 'A4', 'C5', 0],
      ['E5', 0, 'G5', 'A5', 'C6', 0, 'A5', 'G5', 'E5', 'D5', 'C5', 'D5', 'A4', 0, 0, 0],
      ['C6', 0, 'A5', 'G5', 'A5', 0, 'G5', 'E5', 'D5', 'E5', 'G5', 'E5', 'D5', 'C5', 'A4', 0],
      ['G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'G4', 'A4', 0, 0, 0]
    ),
    bass: seq(
      ['A2', 0, 'E2', 'A2', 'C3', 0, 'G2', 'C3', 'G2', 0, 'D2', 'G2', 'A2', 0, 'E2', 'A2'],
      ['A2', 0, 'E2', 'A2', 'F2', 0, 'C3', 'F2', 'G2', 0, 'D2', 'G2', 'A2', 0, 'E2', 'A2'],
      ['C3', 0, 'G2', 'C3', 'F2', 0, 'C3', 'F2', 'G2', 0, 'D2', 'G2', 'A2', 0, 'E2', 'A2'],
      ['G2', 0, 'D2', 'G2', 'C3', 0, 'G2', 'C3', 'G2', 0, 'E2', 'G2', 'A2', 0, 'E2', 0]
    ),
    chords: [
      ['A3', 'C4', 'E4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'],
      ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'],
      ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'],
      ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4']
    ]
  },

  habana: {
    title: 'Son del Malecón — La Habana',
    bpm: 136,
    instrument: 'salsa',
    drumStyle: 'salsa',
    arpMode: 'offbeat',
    melody: seq(
      ['C5', 0, 'E5', 'G5', 0, 'A5', 'G5', 'E5', 'D5', 0, 'F5', 'A5', 0, 'G5', 'F5', 'D5'],
      ['E5', 0, 'G5', 'C6', 0, 'B5', 'A5', 'G5', 'F5', 0, 'D5', 'G5', 'E5', 0, 0, 0],
      ['A5', 0, 'C6', 'A5', 'G5', 0, 'E5', 'G5', 'F5', 0, 'A5', 'F5', 'D5', 0, 'G5', 0],
      ['E5', 'G5', 'C6', 0, 'A5', 'F5', 'D5', 'G5', 'E5', 0, 'G5', 'B5', 'C6', 0, 0, 0]
    ),
    bass: seq(
      ['C2', 0, 0, 'G2', 0, 0, 'C3', 0, 'F2', 0, 0, 'C3', 0, 0, 'G2', 0],
      ['C2', 0, 0, 'G2', 0, 0, 'A2', 0, 'D2', 0, 0, 'G2', 0, 0, 'C3', 0],
      ['F2', 0, 0, 'C3', 0, 0, 'E2', 0, 'D2', 0, 0, 'A2', 0, 0, 'G2', 0],
      ['C2', 0, 0, 'E2', 0, 0, 'F2', 0, 'G2', 0, 0, 'D3', 'C3', 0, 0, 0]
    ),
    chords: [
      ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5'],
      ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['D4', 'F4', 'A4'], ['G4', 'B4', 'D5'],
      ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['D4', 'F4', 'A4'], ['G4', 'B4', 'D5'],
      ['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4']
    ]
  },

  vegas: {
    title: 'Strip Big Band — Las Vegas',
    bpm: 138,
    instrument: 'swing',
    drumStyle: 'swing',
    arpMode: 'stab',
    melody: seq(
      ['Bb4', 0, 'D5', 'F5', 'G5', 0, 'F5', 'D5', 'Eb5', 0, 'G5', 'Bb5', 'A5', 'G5', 'F5', 'D5'],
      ['Bb5', 0, 'A5', 'G5', 'F5', 0, 'D5', 'C5', 'D5', 'F5', 'Bb5', 'A5', 'G5', 0, 0, 0],
      ['Eb5', 0, 'G5', 'Bb5', 'C6', 0, 'Bb5', 'G5', 'F5', 0, 'A5', 'C6', 'Bb5', 0, 'F5', 'D5'],
      ['C5', 'Eb5', 'G5', 'Bb5', 'A5', 'G5', 'F5', 'Eb5', 'D5', 0, 'F5', 'A5', 'Bb5', 0, 0, 0]
    ),
    bass: seq(
      ['Bb2', 0, 'D3', 0, 'F3', 0, 'G3', 0, 'Eb3', 0, 'G3', 0, 'F3', 0, 'D3', 0],
      ['Bb2', 0, 'D3', 0, 'G2', 0, 'B2', 0, 'C3', 0, 'Eb3', 0, 'F3', 0, 'A2', 0],
      ['Eb3', 0, 'G3', 0, 'C3', 0, 'E3', 0, 'F3', 0, 'A3', 0, 'Bb2', 0, 'D3', 0],
      ['C3', 0, 'Eb3', 0, 'F2', 0, 'A2', 0, 'Bb2', 0, 'F2', 0, 'Bb2', 0, 0, 0]
    ),
    chords: [
      ['Bb3', 'D4', 'F4'], ['G3', 'Bb3', 'D4'], ['Eb4', 'G4', 'Bb4'], ['F3', 'A3', 'C4'],
      ['Bb3', 'D4', 'F4'], ['G3', 'B3', 'D4'], ['C4', 'Eb4', 'G4'], ['F3', 'A3', 'C4'],
      ['Eb4', 'G4', 'Bb4'], ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['Bb3', 'D4', 'F4'],
      ['C4', 'Eb4', 'G4'], ['F3', 'A3', 'C4'], ['Bb3', 'D4', 'F4'], ['Bb3', 'D4', 'F4']
    ]
  },

  nyc: {
    title: 'Manhattan Midnight — Nova Iorque',
    bpm: 116,
    instrument: 'jazzhop',
    drumStyle: 'groove',
    arpMode: 'pad',
    melody: seq(
      ['D5', 0, 'F5', 'A5', 'C6', 0, 'A5', 'G5', 'F5', 0, 'E5', 'D5', 'C5', 'D5', 'F5', 0],
      ['A5', 0, 'C6', 'D6', 'C6', 0, 'A5', 'G5', 'F5', 'G5', 'A5', 'G5', 'E5', 0, 0, 0],
      ['Bb5', 0, 'A5', 'G5', 'F5', 0, 'D5', 'F5', 'G5', 0, 'A5', 'G5', 'E5', 0, 'C5', 'E5'],
      ['F5', 0, 'A5', 'C6', 'Bb5', 0, 'G5', 'E5', 'D5', 0, 'F5', 'E5', 'D5', 0, 0, 0]
    ),
    bass: seq(
      ['D2', 0, 0, 'A2', 'C3', 0, 'A2', 0, 'Bb2', 0, 0, 'F2', 'A2', 0, 'C3', 0],
      ['D2', 0, 0, 'A2', 'G2', 0, 'D3', 0, 'Bb2', 0, 0, 'F2', 'A2', 0, 'E2', 0],
      ['Bb2', 0, 0, 'F2', 'A2', 0, 'E2', 0, 'G2', 0, 0, 'D2', 'A2', 0, 'E2', 0],
      ['Bb2', 0, 'F2', 0, 'G2', 0, 'A2', 0, 'D2', 0, 0, 'A2', 'D2', 0, 0, 0]
    ),
    chords: [
      ['D3', 'F3', 'A3', 'C4'], ['D3', 'F3', 'A3', 'C4'], ['Bb3', 'D4', 'F4'], ['A3', 'C4', 'E4'],
      ['D3', 'F3', 'A3', 'C4'], ['G3', 'Bb3', 'D4'], ['Bb3', 'D4', 'F4'], ['A3', 'Cs4', 'E4'],
      ['Bb3', 'D4', 'F4'], ['A3', 'C4', 'E4'], ['G3', 'Bb3', 'D4'], ['A3', 'Cs4', 'E4'],
      ['Bb3', 'D4', 'F4'], ['G3', 'Bb3', 'D4'], ['A3', 'Cs4', 'E4'], ['D3', 'F3', 'A3']
    ]
  },

  madrid: {
    title: 'Pasodoble de Alcalá — Madri',
    bpm: 136,
    instrument: 'flamenco',
    drumStyle: 'flamenco',
    arpMode: 'arp',
    melody: seq(
      ['E5', 'F5', 'Ab5', 'A5', 'B5', 'A5', 'Ab5', 'F5', 'E5', 'D5', 'C5', 'B4', 'C5', 'D5', 'F5', 'E5'],
      ['B5', 0, 'C6', 'B5', 'A5', 'Ab5', 'F5', 'E5', 'F5', 'Ab5', 'A5', 'F5', 'E5', 0, 0, 0],
      ['A5', 0, 'B5', 'C6', 'B5', 0, 'A5', 'G5', 'F5', 0, 'G5', 'A5', 'G5', 'F5', 'E5', 0],
      ['F5', 'Ab5', 'B5', 'A5', 'Ab5', 'F5', 'E5', 'D5', 'C5', 'B4', 'E5', 'Ab5', 'E5', 0, 0, 0]
    ),
    bass: seq(
      ['E2', 'E2', 'B2', 0, 'F2', 'F2', 'C3', 0, 'G2', 'G2', 'D3', 0, 'F2', 'E2', 'B2', 'E2'],
      ['E2', 'E2', 'B2', 0, 'A2', 'A2', 'E2', 0, 'F2', 'F2', 'C3', 0, 'E2', 0, 'B2', 0],
      ['A2', 'A2', 'E2', 0, 'G2', 'G2', 'D2', 0, 'F2', 'F2', 'C3', 0, 'E2', 'E2', 'B2', 0],
      ['F2', 'F2', 'C3', 0, 'D2', 'D2', 'A2', 0, 'F2', 0, 'E2', 0, 'E2', 0, 0, 0]
    ),
    chords: [
      ['E3', 'Ab3', 'B3'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['E3', 'Ab3', 'B3'],
      ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['E3', 'Ab3', 'B3'],
      ['A3', 'C4', 'E4'], ['G3', 'B3', 'D4'], ['F3', 'A3', 'C4'], ['E3', 'Ab3', 'B3'],
      ['F3', 'A3', 'C4'], ['D3', 'F3', 'A3'], ['F3', 'A3', 'C4'], ['E3', 'Ab3', 'B3']
    ]
  },

  london: {
    title: 'Thames Brit-Rock — Londres',
    bpm: 138,
    instrument: 'britrock',
    drumStyle: 'rock',
    arpMode: 'stab',
    melody: seq(
      ['E5', 'E5', 'G5', 'A5', 'B5', 0, 'A5', 'G5', 'D5', 'D5', 'Fs5', 'A5', 'B5', 'A5', 'G5', 'Fs5'],
      ['E5', 0, 'B5', 'A5', 'G5', 0, 'Fs5', 'E5', 'G5', 'A5', 'B5', 'D6', 'B5', 0, 0, 0],
      ['C6', 0, 'B5', 'A5', 'G5', 0, 'E5', 'G5', 'A5', 0, 'B5', 'A5', 'Fs5', 0, 'D5', 0],
      ['E5', 'G5', 'B5', 'E6', 'D6', 'B5', 'A5', 'G5', 'Fs5', 'G5', 'A5', 'Fs5', 'E5', 0, 0, 0]
    ),
    bass: seq(
      ['E2', 'E2', 'E2', 'E2', 'G2', 'G2', 'G2', 'G2', 'D2', 'D2', 'D2', 'D2', 'A2', 'A2', 'B2', 'B2'],
      ['E2', 'E2', 'E2', 'E2', 'C2', 'C2', 'C2', 'C2', 'G2', 'G2', 'G2', 'G2', 'B2', 'B2', 'A2', 'Fs2'],
      ['C2', 'C2', 'C3', 'C2', 'G2', 'G2', 'G2', 'G2', 'A2', 'A2', 'A2', 'A2', 'D2', 'D2', 'D2', 'D2'],
      ['E2', 'E2', 'G2', 'E2', 'C2', 'C2', 'D2', 'D2', 'B2', 'B2', 'D2', 'B2', 'E2', 0, 0, 0]
    ),
    chords: [
      ['E3', 'G3', 'B3'], ['G3', 'B3', 'D4'], ['D3', 'Fs3', 'A3'], ['A3', 'C4', 'E4'],
      ['E3', 'G3', 'B3'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['B3', 'D4', 'Fs4'],
      ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['D3', 'Fs3', 'A3'],
      ['E3', 'G3', 'B3'], ['C4', 'E4', 'G4'], ['B3', 'D4', 'Fs4'], ['E3', 'G3', 'B3']
    ]
  },

  rome: {
    title: 'Tarantella Romana — Roma',
    bpm: 146,
    instrument: 'mandolin',
    drumStyle: 'tarantella',
    arpMode: 'arp',
    melody: seq(
      ['A4', 'C5', 'E5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'Ab4', 'A4', 'C5', 'E5', 0],
      ['A5', 'B5', 'C6', 'A5', 'G5', 'F5', 'E5', 'D5', 'E5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 0],
      ['F5', 'A5', 'C6', 'A5', 'E5', 'A5', 'C6', 'A5', 'D5', 'F5', 'A5', 'F5', 'E5', 'Ab5', 'B5', 0],
      ['C6', 'B5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'E5', 'Ab5', 'B5', 'A5', 0, 0, 0]
    ),
    bass: seq(
      ['A2', 0, 'E2', 0, 'D2', 0, 'A2', 0, 'E2', 0, 'Ab2', 0, 'A2', 0, 'E2', 0],
      ['A2', 0, 'E2', 0, 'D2', 0, 'A2', 0, 'E2', 0, 'B2', 0, 'A2', 0, 'E2', 0],
      ['F2', 0, 'C3', 0, 'A2', 0, 'E2', 0, 'D2', 0, 'A2', 0, 'E2', 0, 'Ab2', 0],
      ['A2', 0, 'G2', 0, 'F2', 0, 'D2', 0, 'E2', 0, 'Ab2', 0, 'A2', 0, 'E2', 0]
    ),
    chords: [
      ['A3', 'C4', 'E4'], ['D3', 'F3', 'A3'], ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4'],
      ['A3', 'C4', 'E4'], ['D3', 'F3', 'A3'], ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4'],
      ['F3', 'A3', 'C4'], ['A3', 'C4', 'E4'], ['D3', 'F3', 'A3'], ['E3', 'Ab3', 'B3'],
      ['A3', 'C4', 'E4'], ['D3', 'F3', 'A3'], ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4']
    ]
  },

  moscow: {
    title: 'Balalaika na Neve — Moscou',
    bpm: 140,
    instrument: 'balalaika',
    drumStyle: 'polka',
    arpMode: 'offbeat',
    melody: seq(
      ['E5', 0, 'B4', 'C5', 'D5', 0, 'C5', 'B4', 'A4', 0, 'A4', 'C5', 'E5', 0, 'D5', 'C5'],
      ['B4', 0, 'C5', 'D5', 'E5', 0, 'C5', 0, 'A4', 0, 'A4', 0, 'E5', 0, 0, 0],
      ['D5', 0, 'F5', 'A5', 'G5', 0, 'F5', 'E5', 'C5', 0, 'E5', 'D5', 'C5', 0, 'B4', 0],
      ['B4', 'C5', 'D5', 'E5', 'C5', 0, 'A4', 'C5', 'B4', 0, 'Ab4', 'B4', 'A4', 0, 0, 0]
    ),
    bass: seq(
      ['E2', 0, 'B2', 0, 'Ab2', 0, 'E2', 0, 'A2', 0, 'E2', 0, 'A2', 0, 'E2', 0],
      ['E2', 0, 'Ab2', 0, 'A2', 0, 'E2', 0, 'A2', 0, 'E2', 0, 'A2', 0, 'E2', 0],
      ['D2', 0, 'A2', 0, 'D2', 0, 'A2', 0, 'A2', 0, 'E2', 0, 'E2', 0, 'Ab2', 0],
      ['E2', 0, 'Ab2', 0, 'A2', 0, 'E2', 0, 'E2', 0, 'Ab2', 0, 'A2', 0, 'E2', 0]
    ),
    chords: [
      ['E3', 'Ab3', 'B3'], ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'],
      ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'],
      ['D3', 'F3', 'A3'], ['D3', 'F3', 'A3'], ['A3', 'C4', 'E4'], ['E3', 'Ab3', 'B3'],
      ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4'], ['E3', 'Ab3', 'B3'], ['A3', 'C4', 'E4']
    ]
  },

  delhi: {
    title: 'Raga de Nova Délhi — Sitar & Tabla',
    bpm: 126,
    instrument: 'sitar',
    drumStyle: 'darbuka',
    arpMode: 'arp',
    melody: seq(
      ['C5', 'Cs5', 'E5', 'F5', 'G5', 'Ab5', 'G5', 'F5', 'E5', 'Cs5', 'C5', 'E5', 'G5', 'F5', 'E5', 'C5'],
      ['G5', 0, 'Ab5', 'B5', 'C6', 0, 'B5', 'Ab5', 'G5', 'F5', 'E5', 'Cs5', 'C5', 0, 0, 0],
      ['C6', 'B5', 'Ab5', 'G5', 'F5', 'G5', 'Ab5', 'G5', 'F5', 'E5', 'Cs5', 'E5', 'G5', 'F5', 'E5', 0],
      ['Cs5', 'E5', 'G5', 'Ab5', 'G5', 'F5', 'E5', 'Cs5', 'C5', 'E5', 'G5', 'E5', 'C5', 0, 0, 0]
    ),
    bass: seq(
      ['C2', 0, 'G2', 0, 'C2', 0, 'G2', 0, 'C2', 0, 'G2', 0, 'C2', 0, 'G2', 'C2'],
      ['C2', 0, 'G2', 0, 'Ab2', 0, 'G2', 0, 'C2', 0, 'G2', 0, 'C2', 0, 'G2', 0],
      ['F2', 0, 'C3', 0, 'C2', 0, 'G2', 0, 'Cs2', 0, 'G2', 0, 'C2', 0, 'G2', 0],
      ['Cs2', 0, 'Ab2', 0, 'G2', 0, 'C2', 0, 'C2', 0, 'G2', 0, 'C2', 0, 0, 0]
    ),
    chords: [
      ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['Cs4', 'F4', 'Ab4'], ['C4', 'E4', 'G4'],
      ['C4', 'E4', 'G4'], ['Ab3', 'C4', 'E4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'],
      ['F3', 'Ab3', 'C4'], ['C4', 'E4', 'G4'], ['Cs4', 'E4', 'G4'], ['C4', 'E4', 'G4'],
      ['Cs4', 'F4', 'Ab4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4']
    ]
  },

  bangkok: {
    title: 'Lanternas do Chao Phraya — Bangcoc',
    bpm: 122,
    instrument: 'ranat',
    drumStyle: 'calypso',
    arpMode: 'arp',
    melody: seq(
      ['C5', 'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'E5', 'G5', 'A5', 'C6', 'A5', 'G5', 'E5'],
      ['D6', 0, 'C6', 'A5', 'G5', 0, 'A5', 'G5', 'E5', 'D5', 'C5', 'D5', 'E5', 0, 0, 0],
      ['A5', 'C6', 'D6', 'C6', 'A5', 'G5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'D5', 'E5', 'G5'],
      ['C6', 0, 'A5', 'G5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'G4', 'C5', 0, 0, 0]
    ),
    bass: seq(
      ['C3', 0, 'G2', 0, 'A2', 0, 'E2', 0, 'F2', 0, 'C3', 0, 'G2', 0, 'C3', 0],
      ['D2', 0, 'A2', 0, 'G2', 0, 'D3', 0, 'A2', 0, 'E2', 0, 'C3', 0, 'G2', 0],
      ['F2', 0, 'C3', 0, 'C3', 0, 'G2', 0, 'D2', 0, 'A2', 0, 'G2', 0, 'C3', 0],
      ['A2', 0, 'E2', 0, 'F2', 0, 'G2', 0, 'G2', 0, 'D2', 0, 'C3', 0, 0, 0]
    ),
    chords: [
      ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'C4', 'D4'],
      ['D3', 'G3', 'A3'], ['G3', 'C4', 'D4'], ['A3', 'C4', 'E4'], ['C4', 'E4', 'G4'],
      ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['D3', 'G3', 'A3'], ['G3', 'C4', 'D4'],
      ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'C4', 'D4'], ['C4', 'E4', 'G4']
    ]
  },

  beijing: {
    title: 'Dragão Imperial — Beijing',
    bpm: 130,
    instrument: 'guzheng',
    drumStyle: 'taiko',
    arpMode: 'arp',
    melody: seq(
      ['G4', 'A4', 'C5', 'D5', 'E5', 0, 'D5', 'C5', 'A4', 'C5', 'D5', 'E5', 'G5', 'E5', 'D5', 'C5'],
      ['A5', 0, 'G5', 'E5', 'D5', 0, 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 0, 0, 0],
      ['E5', 'G5', 'A5', 'C6', 'A5', 0, 'G5', 'E5', 'D5', 'E5', 'G5', 'E5', 'D5', 'C5', 'A4', 0],
      ['C5', 'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'E5', 'D5', 'C5', 'A4', 'G4', 0, 0, 0]
    ),
    bass: seq(
      ['C2', 0, 'G2', 0, 'A2', 0, 'E2', 0, 'F2', 0, 'C2', 0, 'G2', 0, 'C2', 0],
      ['A2', 0, 'E2', 0, 'G2', 0, 'D2', 0, 'F2', 0, 'G2', 0, 'C2', 0, 'G2', 0],
      ['C2', 0, 'G2', 0, 'A2', 0, 'E2', 0, 'D2', 0, 'A2', 0, 'G2', 0, 'D2', 0],
      ['F2', 0, 'C2', 0, 'G2', 0, 'D2', 0, 'A2', 0, 'E2', 0, 'C2', 0, 0, 0]
    ),
    chords: [
      ['C4', 'D4', 'G4'], ['A3', 'D4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'C4', 'D4'],
      ['A3', 'C4', 'E4'], ['G3', 'B3', 'D4'], ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'],
      ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['D3', 'G3', 'A3'], ['G3', 'C4', 'D4'],
      ['F3', 'A3', 'C4'], ['G3', 'C4', 'D4'], ['A3', 'C4', 'E4'], ['C4', 'E4', 'G4']
    ]
  },

  sydney: {
    title: 'Harbour Surf Rock — Sydney',
    bpm: 144,
    instrument: 'surf',
    drumStyle: 'rock',
    arpMode: 'stab',
    melody: seq(
      ['E5', 'Fs5', 'G5', 'B5', 'E6', 'D6', 'B5', 'G5', 'A5', 'B5', 'C6', 'E6', 'D6', 'B5', 'A5', 'G5'],
      ['E5', 0, 'G5', 'B5', 'A5', 0, 'G5', 'Fs5', 'E5', 'Fs5', 'G5', 'A5', 'B5', 0, 0, 0],
      ['C6', 'C6', 'B5', 'A5', 'G5', 'G5', 'A5', 'B5', 'A5', 'A5', 'G5', 'Fs5', 'E5', 0, 'B4', 0],
      ['B5', 'B5', 'A5', 'G5', 'Fs5', 'G5', 'A5', 'Fs5', 'E5', 'G5', 'B5', 'G5', 'E5', 0, 0, 0]
    ),
    bass: seq(
      ['E2', 'E2', 'G2', 'A2', 'B2', 'A2', 'G2', 'Fs2', 'A2', 'A2', 'C3', 'A2', 'B2', 'B2', 'G2', 'Fs2'],
      ['E2', 'E2', 'G2', 'B2', 'A2', 'A2', 'G2', 'Fs2', 'E2', 'G2', 'A2', 'Bb2', 'B2', 0, 'B2', 0],
      ['C2', 'C2', 'E2', 'G2', 'G2', 'G2', 'B2', 'G2', 'A2', 'A2', 'C3', 'A2', 'E2', 'E2', 'B2', 'E2'],
      ['B2', 'B2', 'A2', 'G2', 'Fs2', 'Fs2', 'A2', 'B2', 'E2', 'G2', 'B2', 'G2', 'E2', 0, 0, 0]
    ),
    chords: [
      ['E3', 'G3', 'B3'], ['E3', 'G3', 'B3'], ['A3', 'C4', 'E4'], ['B3', 'D4', 'Fs4'],
      ['E3', 'G3', 'B3'], ['A3', 'C4', 'E4'], ['E3', 'G3', 'B3'], ['B3', 'D4', 'Fs4'],
      ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['E3', 'G3', 'B3'],
      ['B3', 'D4', 'Fs4'], ['B3', 'D4', 'Fs4'], ['E3', 'G3', 'B3'], ['E3', 'G3', 'B3']
    ]
  },

  honolulu: {
    title: 'Aloha Ukulele Breeze — Honolulu',
    bpm: 114,
    instrument: 'ukulele',
    drumStyle: 'calypso',
    arpMode: 'offbeat',
    melody: seq(
      ['C5', 0, 'E5', 'G5', 'A5', 0, 'G5', 'E5', 'F5', 0, 'A5', 'G5', 'E5', 0, 'D5', 'C5'],
      ['G5', 0, 'A5', 'C6', 'B5', 0, 'A5', 'G5', 'E5', 0, 'G5', 'E5', 'D5', 0, 0, 0],
      ['F5', 0, 'A5', 'C6', 'A5', 0, 'G5', 'E5', 'D5', 0, 'F5', 'A5', 'G5', 0, 'E5', 'D5'],
      ['C5', 0, 'E5', 'G5', 'A5', 0, 'F5', 'D5', 'E5', 0, 'D5', 'B4', 'C5', 0, 0, 0]
    ),
    bass: seq(
      ['C3', 0, 'G2', 0, 'A2', 0, 'E2', 0, 'F2', 0, 'C3', 0, 'G2', 0, 'C3', 0],
      ['C3', 0, 'G2', 0, 'G2', 0, 'D3', 0, 'A2', 0, 'E2', 0, 'G2', 0, 'D3', 0],
      ['F2', 0, 'C3', 0, 'C3', 0, 'G2', 0, 'D2', 0, 'A2', 0, 'G2', 0, 'D3', 0],
      ['C3', 0, 'E2', 0, 'F2', 0, 'D2', 0, 'G2', 0, 'D3', 0, 'C3', 0, 0, 0]
    ),
    chords: [
      ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'],
      ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['G3', 'B3', 'D4'],
      ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['D3', 'F3', 'A3'], ['G3', 'B3', 'D4'],
      ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4']
    ]
  },

  moon: {
    title: 'Órbita Lunar — Baixa Gravidade',
    bpm: 102,
    instrument: 'spacepad',
    drumStyle: 'space',
    arpMode: 'arp',
    melody: seq(
      ['E5', 0, 0, 'B4', 'G5', 0, 0, 'Fs5', 'D5', 0, 0, 'A4', 'E5', 0, 'B4', 0],
      ['B5', 0, 0, 'A5', 'G5', 0, 'Fs5', 'E5', 'Fs5', 0, 0, 'D5', 'E5', 0, 0, 0],
      ['C6', 0, 0, 'B5', 'A5', 0, 'G5', 'Fs5', 'G5', 0, 'B5', 'A5', 'Fs5', 0, 'D5', 0],
      ['E5', 0, 'G5', 'B5', 'A5', 0, 'Fs5', 'D5', 'E5', 0, 0, 'B4', 'E5', 0, 0, 0]
    ),
    bass: seq(
      ['E2', 0, 0, 0, 'C2', 0, 0, 0, 'D2', 0, 0, 0, 'B2', 0, 0, 0],
      ['E2', 0, 0, 0, 'G2', 0, 0, 0, 'D2', 0, 0, 0, 'E2', 0, 0, 0],
      ['C2', 0, 0, 0, 'A2', 0, 0, 0, 'G2', 0, 0, 0, 'D2', 0, 0, 0],
      ['C2', 0, 0, 0, 'D2', 0, 0, 0, 'E2', 0, 0, 0, 'E2', 0, 0, 0]
    ),
    chords: [
      ['E3', 'G3', 'B3', 'D4'], ['C3', 'E3', 'G3', 'B3'], ['D3', 'Fs3', 'A3'], ['B2', 'D3', 'Fs3'],
      ['E3', 'G3', 'B3'], ['G3', 'B3', 'D4'], ['D3', 'Fs3', 'A3'], ['E3', 'G3', 'B3'],
      ['C3', 'E3', 'G3', 'B3'], ['A2', 'C3', 'E3', 'G3'], ['G3', 'B3', 'D4'], ['D3', 'Fs3', 'A3'],
      ['C3', 'E3', 'G3'], ['D3', 'Fs3', 'A3'], ['E3', 'G3', 'B3'], ['E3', 'G3', 'B3']
    ]
  },

  mars: {
    title: 'Tempestade em Marte — Desafio Final',
    bpm: 148,
    instrument: 'bosssynth',
    drumStyle: 'boss',
    arpMode: 'arp',
    melody: seq(
      ['D5', 'D5', 'F5', 'G5', 'A5', 'Bb5', 'A5', 'G5', 'F5', 'E5', 'D5', 'F5', 'A5', 'G5', 'F5', 'E5'],
      ['D5', 'F5', 'A5', 'D6', 'C6', 'Bb5', 'A5', 'G5', 'A5', 0, 'Cs6', 'A5', 'D6', 0, 0, 0],
      ['Bb5', 0, 'A5', 'G5', 'F5', 0, 'G5', 'A5', 'G5', 'F5', 'E5', 'D5', 'Cs5', 'E5', 'A5', 0],
      ['D6', 'C6', 'Bb5', 'A5', 'G5', 'F5', 'E5', 'D5', 'F5', 'A5', 'Cs6', 'A5', 'D6', 0, 0, 0]
    ),
    bass: seq(
      ['D2', 'D2', 'D3', 'D2', 'Bb2', 'Bb2', 'Bb2', 'A2', 'G2', 'G2', 'G2', 'F2', 'A2', 'A2', 'Cs3', 'A2'],
      ['D2', 'D2', 'D3', 'D2', 'C2', 'C2', 'C3', 'C2', 'A2', 'A2', 'Cs3', 'A2', 'D2', 'D2', 'A2', 'D2'],
      ['Bb2', 'Bb2', 'Bb2', 'F2', 'G2', 'G2', 'G2', 'D2', 'E2', 'E2', 'G2', 'E2', 'A2', 'A2', 'Cs3', 'A2'],
      ['Bb2', 'Bb2', 'A2', 'G2', 'G2', 'G2', 'F2', 'E2', 'A2', 'A2', 'Cs3', 'A2', 'D2', 'D2', 'D3', 0]
    ),
    chords: [
      ['D3', 'F3', 'A3'], ['Bb3', 'D4', 'F4'], ['G3', 'Bb3', 'D4'], ['A3', 'Cs4', 'E4'],
      ['D3', 'F3', 'A3'], ['C3', 'E3', 'G3'], ['A3', 'Cs4', 'E4'], ['D3', 'F3', 'A3'],
      ['Bb3', 'D4', 'F4'], ['G3', 'Bb3', 'D4'], ['E3', 'G3', 'Bb3'], ['A3', 'Cs4', 'E4'],
      ['Bb3', 'D4', 'F4'], ['G3', 'Bb3', 'D4'], ['A3', 'Cs4', 'E4'], ['D3', 'F3', 'A3']
    ]
  }
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;
  private sfxBus: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayWet: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  public sfxMuted = false;
  public musicEnabled = true;

  private currentTheme: OstTrackKey | null = null;
  private ducked = false;
  private step = 0;
  private sectionCursor = 0;
  private cycleCount = 0;
  private nextNoteTime = 0;
  private schedulerId: number | null = null;

  private dynamicState: DynamicMusicState = {
    timeRatio: 1,
    comboCount: 0,
    frozen: false,
    bubbleCount: 4
  };

  public init(): void {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.knee.value = 18;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.005;
      compressor.release.value = 0.14;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.85;

      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.62;

      this.musicFilter = this.ctx.createBiquadFilter();
      this.musicFilter.type = 'lowpass';
      this.musicFilter.frequency.value = 16000;
      this.musicFilter.Q.value = 0.7;

      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 0.9;

      // Stereo slapback/ambient echo bus for depth
      this.delayNode = this.ctx.createDelay(0.75);
      this.delayNode.delayTime.value = 0.25;
      const delayFb = this.ctx.createGain();
      delayFb.gain.value = 0.26;
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 2500;
      this.delayWet = this.ctx.createGain();
      this.delayWet.gain.value = 0.24;

      this.musicBus.connect(this.musicFilter);
      this.musicFilter.connect(compressor);
      this.musicFilter.connect(this.delayNode);
      this.delayNode.connect(delayFilter);
      delayFilter.connect(delayFb);
      delayFb.connect(this.delayNode);
      delayFilter.connect(this.delayWet);
      this.delayWet.connect(compressor);

      this.sfxBus.connect(compressor);
      compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      const bufSize = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const ch = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) ch[i] = Math.random() * 2 - 1;
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setDynamicState(next: DynamicMusicState): void {
    const prevFrozen = this.dynamicState.frozen;
    this.dynamicState = next;
    if (prevFrozen !== next.frozen && this.musicFilter && this.ctx) {
      const targetFreq = next.frozen ? 920 : 16000;
      const targetQ = next.frozen ? 3.2 : 0.7;
      this.musicFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
      this.musicFilter.Q.setTargetAtTime(targetQ, this.ctx.currentTime, 0.08);
    }
  }

  public getCurrentSectionLabel(): string {
    if (this.dynamicState.frozen) return 'Tempo Congelado';
    if (this.dynamicState.timeRatio > 0 && this.dynamicState.timeRatio < 0.26) return 'Urgência!';
    const sec = SECTION_ORDER[this.sectionCursor % SECTION_ORDER.length];
    return SECTION_LABELS[sec];
  }

  public getCurrentIntensity(): 'calm' | 'groove' | 'climax' | 'urgent' | 'frozen' {
    if (this.dynamicState.frozen) return 'frozen';
    if (this.dynamicState.timeRatio > 0 && this.dynamicState.timeRatio < 0.26) return 'urgent';
    const sec = SECTION_ORDER[this.sectionCursor % SECTION_ORDER.length];
    if (sec === 'C_BREAK') return 'calm';
    if (sec === 'D_CLIMAX') return 'climax';
    return 'groove';
  }

  public toggleMute(): boolean {
    this.sfxMuted = !this.sfxMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.sfxMuted ? 0 : 0.85, this.ctx.currentTime, 0.02);
    }
    return this.sfxMuted;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled && this.currentTheme) {
      this.startScheduler();
    } else {
      this.stopScheduler();
    }
    return this.musicEnabled;
  }

  public playTheme(themeKey: OstTrackKey): void {
    const changed = this.currentTheme !== themeKey;
    this.currentTheme = themeKey;
    if (changed) {
      this.step = 0;
      this.sectionCursor = 0;
      this.cycleCount = 0;
    }
    this.ducked = false;
    this.updateMusicGain();
    if (this.musicFilter && this.ctx && !this.dynamicState.frozen) {
      this.musicFilter.frequency.setTargetAtTime(16000, this.ctx.currentTime, 0.05);
    }
    if (this.musicEnabled) {
      this.startScheduler();
    }
  }

  public setDucked(isDucked: boolean): void {
    this.ducked = isDucked;
    this.updateMusicGain();
  }

  public stopMusic(): void {
    this.stopScheduler();
  }

  private updateMusicGain(): void {
    if (!this.musicBus || !this.ctx) return;
    const target = this.ducked ? 0.22 : 0.62;
    this.musicBus.gain.setTargetAtTime(target, this.ctx.currentTime, 0.06);
  }

  private startScheduler(): void {
    this.stopScheduler();
    if (!this.musicEnabled || !this.currentTheme) return;
    if (this.ctx) {
      this.nextNoteTime = this.ctx.currentTime + 0.05;
    }
    this.schedulerId = window.setInterval(() => this.scheduleAhead(), 25);
  }

  private stopScheduler(): void {
    if (this.schedulerId !== null) {
      clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
  }

  private createStereoNode(pan: number): AudioNode {
    if (!this.ctx || !this.musicBus) throw new Error('Audio unavailable');
    if (typeof this.ctx.createStereoPanner === 'function') {
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = Math.max(-1, Math.min(1, pan));
      panner.connect(this.musicBus);
      return panner;
    }
    return this.musicBus;
  }

  private scheduleAhead(): void {
    if (!this.ctx || !this.musicEnabled || this.sfxMuted || !this.currentTheme) return;
    if (this.ctx.state !== 'running') return;

    const track = OST_TRACKS[this.currentTheme];
    if (!track) return;

    // Dynamic tempo modulation based on urgency, climax, or clock freeze
    const isStoryOrMenu =
      this.currentTheme === 'title' ||
      this.currentTheme === 'travel' ||
      this.currentTheme.startsWith('story_');

    let tempoMult = 1.0;
    if (!isStoryOrMenu) {
      if (this.dynamicState.frozen) {
        tempoMult = 0.87;
      } else if (this.dynamicState.timeRatio > 0 && this.dynamicState.timeRatio < 0.26) {
        tempoMult = 1.08 + (0.26 - this.dynamicState.timeRatio) * 0.25;
      } else if (SECTION_ORDER[this.sectionCursor % SECTION_ORDER.length] === 'D_CLIMAX') {
        tempoMult = 1.025;
      }
    }

    const effectiveBpm = track.bpm * tempoMult;
    const stepSec = 60 / effectiveBpm / 4;

    if (this.nextNoteTime < this.ctx.currentTime - 0.15) {
      this.nextNoteTime = this.ctx.currentTime + 0.03;
    }

    while (this.nextNoteTime < this.ctx.currentTime + 0.12) {
      const section = SECTION_ORDER[this.sectionCursor % SECTION_ORDER.length];
      this.scheduleStep(this.currentTheme, track, section, this.step, this.nextNoteTime, stepSec, isStoryOrMenu);
      this.nextNoteTime += stepSec;
      this.step += 1;
      if (this.step >= 64) {
        this.step = 0;
        this.sectionCursor += 1;
        if (this.sectionCursor >= SECTION_ORDER.length) {
          this.sectionCursor = 0;
          this.cycleCount += 1;
        }
      }
    }
  }

  private scheduleStep(
    themeKey: OstTrackKey,
    track: OstTrackDef,
    section: SongSectionId,
    step: number,
    time: number,
    stepSec: number,
    isStoryOrMenu: boolean
  ): void {
    if (!this.ctx || !this.musicBus) return;

    const derivedB = getDerivedBSection(themeKey, track);
    const activeChords = section === 'B_BRIDGE' ? derivedB.chordsB : track.chords;
    const activeMelody = section === 'B_BRIDGE' ? derivedB.melodyB : track.melody;
    const activeBass = section === 'B_BRIDGE' ? derivedB.bassB : track.bass;

    const chordIdx = Math.floor(step / 4) % activeChords.length;
    const chord = activeChords[chordIdx];

    // 1. Lead Melody (varies phrasing, register & expression across sections A / A' / B / C / D)
    let melNote = activeMelody[step % activeMelody.length];

    if (section === 'C_BREAK') {
      // Atmospheric breakdown: play sparse lyrical call phrases on beats 0, 4, 8 and riser notes at bar 4
      if (step < 48 && step % 8 !== 0 && step % 8 !== 3) {
        melNote = 0;
      } else if (step >= 56 && chord && chord.length > 0) {
        // Ascending tension scale run into Climax!
        melNote = shiftOctave(chord[(step - 56) % chord.length], step >= 60 ? 2 : 1);
      }
    } else if (section === 'A_VAR' && !melNote && step % 8 === 7 && chord && (this.cycleCount + step) % 2 === 0) {
      // Subtle ornamental passing grace note in A_VAR
      melNote = shiftOctave(chord[1 % chord.length], 1);
    }

    if (melNote && NOTE_FREQ[melNote]) {
      const durMult = section === 'C_BREAK' ? 2.6 : section === 'D_CLIMAX' ? 1.95 : 1.75;
      const vibrato = section === 'C_BREAK' || section === 'D_CLIMAX' || track.instrument === 'flute' || track.instrument === 'panflute' || track.instrument === 'sitar' || track.instrument === 'bandoneon';
      this.playLeadInstrument(track.instrument, NOTE_FREQ[melNote], time, stepSec * durMult, vibrato, 0.05);

      // Climax D: Harmonic octave/fifth lead reinforcement!
      if (section === 'D_CLIMAX' && step % 2 === 0) {
        const hiNote = shiftOctave(melNote, 1);
        if (NOTE_FREQ[hiNote] && hiNote !== melNote) {
          this.playChordTone(NOTE_FREQ[hiNote], time, stepSec * 1.2, 0.028, 'triangle', 3200, -0.25);
        }
      }
    }

    // 2. Counter-Melody Voice (active in A_VAR, B_BRIDGE, and D_CLIMAX)
    if (
      chord &&
      chord.length >= 2 &&
      (section === 'A_VAR' || section === 'B_BRIDGE' || section === 'D_CLIMAX')
    ) {
      const sub = step % 8;
      const patternTrigger =
        section === 'A_VAR'
          ? sub === 2 || sub === 6
          : section === 'B_BRIDGE'
          ? sub === 4 || sub === 7
          : sub === 2 || sub === 5;
      if (patternTrigger) {
        const pickIdx = (chordIdx + sub + this.cycleCount) % chord.length;
        const counterNote = shiftOctave(chord[pickIdx], 1);
        if (NOTE_FREQ[counterNote] && counterNote !== melNote) {
          this.playCounterVoice(NOTE_FREQ[counterNote], time, stepSec * 1.6, -0.38);
        }
      }
    }

    // 3. Bassline (with octave walkups & syncopation in Climax / Urgency)
    let bassNote = activeBass[step % activeBass.length];
    if (section === 'C_BREAK' && step < 56) {
      // Sustained deep sub-root only on bar starts during breakdown
      bassNote = step % 16 === 0 && chord ? shiftOctave(chord[0], -1) : 0;
    } else if ((section === 'D_CLIMAX' || (!isStoryOrMenu && this.dynamicState.timeRatio < 0.26)) && !bassNote && step % 4 === 2 && chord) {
      // Driving octave offbeat bass in climax or low-time urgency
      bassNote = chord[0];
    }

    if (bassNote && NOTE_FREQ[bassNote]) {
      const bassDur = section === 'C_BREAK' ? stepSec * 6.5 : stepSec * 1.55;
      this.playBassNote(track.instrument, NOTE_FREQ[bassNote], time, bassDur);
    }

    // 4. Chords / Harmony / Multi-Direction Arpeggios / Lush Pads
    if (chord && chord.length > 0) {
      const sub = step % 4;
      if (section === 'C_BREAK') {
        // Warm stereo pad wash on beat 0 of every 2 beats
        if (step % 8 === 0) {
          chord.forEach((n, idx) => {
            if (NOTE_FREQ[n]) {
              this.playChordTone(NOTE_FREQ[n], time, stepSec * 7.5, 0.028, 'sine', 1500, idx % 2 === 0 ? -0.4 : 0.4);
            }
          });
        }
      } else {
        // Rotate arpeggio direction across sections & cycles so harmony breathes
        const arpDir = (this.cycleCount + (section === 'D_CLIMAX' ? 1 : 0)) % 3;
        const effectiveMode = section === 'D_CLIMAX' && track.arpMode === 'pad' ? 'arp' : track.arpMode;

        if (effectiveMode === 'arp') {
          let idx = sub % chord.length;
          if (arpDir === 1) idx = (chord.length - 1 - (sub % chord.length) + chord.length) % chord.length;
          else if (arpDir === 2) idx = [0, 1, 2, 1][sub] % chord.length;
          const arpNote = section === 'D_CLIMAX' && sub === 3 ? shiftOctave(chord[idx], 1) : chord[idx];
          if (NOTE_FREQ[arpNote]) {
            this.playChordTone(NOTE_FREQ[arpNote], time, stepSec * 1.18, 0.032, 'triangle', 2100, 0.34);
          }
        } else if (effectiveMode === 'offbeat' && (sub === 2 || (section === 'D_CLIMAX' && sub === 3))) {
          chord.forEach((n) => {
            if (NOTE_FREQ[n]) this.playChordTone(NOTE_FREQ[n], time, stepSec * 1.15, 0.025, 'triangle', 2200, 0.3);
          });
        } else if (effectiveMode === 'stab' && (sub === 0 || step % 8 === 6 || (section === 'A_VAR' && step % 16 === 11))) {
          chord.forEach((n) => {
            if (NOTE_FREQ[n]) this.playChordTone(NOTE_FREQ[n], time, stepSec * 1.45, 0.026, 'sawtooth', 1550, 0.28);
          });
        } else if (effectiveMode === 'pad' && sub === 0) {
          chord.forEach((n, idx) => {
            if (NOTE_FREQ[n]) this.playChordTone(NOTE_FREQ[n], time, stepSec * 3.85, 0.024, 'sine', 1350, idx % 2 === 0 ? -0.3 : 0.3);
          });
        }
      }

      // 5. Real-Time Gameplay Combo Sparkle Layer (Combo >= 2)
      if (!isStoryOrMenu && this.dynamicState.comboCount >= 2 && step % 2 === 1) {
        const spNote = shiftOctave(chord[(step + this.dynamicState.comboCount) % chord.length], 2);
        if (NOTE_FREQ[spNote]) {
          this.playChordTone(NOTE_FREQ[spNote], time, stepSec * 0.9, 0.02, 'sine', 4200, (step % 4 - 1.5) * 0.35);
        }
      }

      // 6. Clock-Freeze Crystalline Bell Shimmer
      if (!isStoryOrMenu && this.dynamicState.frozen && step % 4 === 0) {
        const iceNote = shiftOctave(chord[chordIdx % chord.length], 2);
        if (NOTE_FREQ[iceNote]) {
          this.playChordTone(NOTE_FREQ[iceNote], time, stepSec * 2.5, 0.024, 'sine', 3800, 0);
        }
      }
    }

    // 7. Dynamic Multi-Section Regional Percussion & Turnaround Fills
    const urgent = !isStoryOrMenu && this.dynamicState.timeRatio > 0 && this.dynamicState.timeRatio < 0.26;
    this.playDrumStep(track.drumStyle, section, step % 16, step, time, urgent, this.dynamicState.frozen && !isStoryOrMenu);
  }

  private playLeadInstrument(
    profile: InstrumentProfile,
    freq: number,
    time: number,
    dur: number,
    withVibrato = false,
    pan = 0
  ): void {
    if (!this.ctx || !this.musicBus) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const dest = this.createStereoNode(pan);

    let wave: OscillatorType = 'triangle';
    let filterStart = 2800;
    let filterEnd = 1200;
    let attack = 0.01;
    let vol = 0.085;
    let detuneOsc = false;
    let fmBell = false;

    switch (profile) {
      case 'koto':
      case 'guzheng':
      case 'balalaika':
      case 'mandolin':
      case 'flamenco':
      case 'ukulele':
        wave = profile === 'ukulele' ? 'triangle' : 'sawtooth';
        filterStart = profile === 'ukulele' ? 2300 : 3500;
        filterEnd = 680;
        attack = 0.004;
        vol = 0.074;
        dur *= 0.88;
        break;
      case 'oud':
      case 'sitar':
        wave = 'sawtooth';
        filterStart = 2700;
        filterEnd = 920;
        filter.Q.value = profile === 'sitar' ? 6.5 : 2.5;
        attack = 0.006;
        vol = 0.072;
        detuneOsc = true;
        break;
      case 'synthwave':
      case 'bosssynth':
      case 'britrock':
        wave = profile === 'britrock' ? 'square' : 'sawtooth';
        filterStart = 3400;
        filterEnd = 1150;
        filter.Q.value = 3.2;
        detuneOsc = true;
        vol = 0.07;
        break;
      case 'steelpan':
      case 'ranat':
        wave = 'sine';
        fmBell = true;
        vol = 0.09;
        dur *= 0.92;
        break;
      case 'flute':
      case 'panflute':
      case 'spacepad':
        wave = 'sine';
        attack = profile === 'spacepad' ? 0.07 : 0.028;
        filterStart = 2100;
        filterEnd = 1400;
        vol = 0.096;
        dur *= profile === 'spacepad' ? 1.85 : 1.18;
        break;
      case 'accordion':
      case 'bandoneon':
      case 'salsa':
      case 'swing':
      case 'arcadebrass':
        wave = profile === 'swing' || profile === 'salsa' ? 'square' : 'sawtooth';
        filterStart = 2500;
        filterEnd = 1320;
        detuneOsc = true;
        vol = 0.066;
        break;
      default:
        wave = profile === 'surf' || profile === 'funk' ? 'square' : 'triangle';
        vol = 0.076;
    }

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, time);

    if (withVibrato && dur > 0.16) {
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(5.6, time);
      lfoGain.gain.setValueAtTime(freq * 0.0085, time);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(time + 0.05);
      lfo.stop(time + dur + 0.03);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterStart, time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(200, filterEnd), time + dur);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.03);

    if (detuneOsc) {
      const osc2 = this.ctx.createOscillator();
      osc2.type = wave;
      osc2.frequency.setValueAtTime(freq, time);
      osc2.detune.setValueAtTime(profile === 'sitar' ? 18 : 9, time);
      osc2.connect(filter);
      osc2.start(time);
      osc2.stop(time + dur + 0.03);
    }

    if (fmBell) {
      const over = this.ctx.createOscillator();
      const overGain = this.ctx.createGain();
      over.type = 'sine';
      over.frequency.setValueAtTime(freq * 2.0, time);
      overGain.gain.setValueAtTime(vol * 0.45, time);
      overGain.gain.exponentialRampToValueAtTime(0.0001, time + dur * 0.45);
      over.connect(overGain);
      overGain.connect(dest);
      over.start(time);
      over.stop(time + dur * 0.5);
    }
  }

  private playCounterVoice(freq: number, time: number, dur: number, pan: number): void {
    if (!this.ctx || !this.musicBus) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    const dest = this.createStereoNode(pan);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1950, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.038, time + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  private playBassNote(profile: InstrumentProfile, freq: number, time: number, dur: number): void {
    if (!this.ctx || !this.musicBus) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    const punchy =
      profile === 'synthwave' ||
      profile === 'bosssynth' ||
      profile === 'funk' ||
      profile === 'britrock' ||
      profile === 'surf';
    osc.type = punchy ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(punchy ? 740 : 500, time);
    filter.frequency.exponentialRampToValueAtTime(180, time + dur);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.112, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicBus);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  private playChordTone(
    freq: number,
    time: number,
    dur: number,
    vol: number,
    wave: OscillatorType,
    cutoff: number,
    pan = 0
  ): void {
    if (!this.ctx || !this.musicBus) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    const dest = pan !== 0 ? this.createStereoNode(pan) : this.musicBus;

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  private playDrumStep(
    style: DrumStyle,
    section: SongSectionId,
    s: number,
    totalStep: number,
    time: number,
    urgent: boolean,
    frozen: boolean
  ): void {
    if (!this.ctx || !this.musicBus) return;

    const kick = (f = 135, v = 0.14) => {
      if (!this.ctx || !this.musicBus || frozen) return;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(f, time);
      o.frequency.exponentialRampToValueAtTime(38, time + 0.095);
      g.gain.setValueAtTime(v, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);
      o.connect(g);
      g.connect(this.musicBus);
      o.start(time);
      o.stop(time + 0.12);
    };

    const noiseHit = (dur: number, v: number, freq: number, ftype: BiquadFilterType, pan = 0) => {
      if (!this.ctx || !this.musicBus || !this.noiseBuffer) return;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const f = this.ctx.createBiquadFilter();
      f.type = ftype;
      f.frequency.setValueAtTime(freq, time);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(v, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      const dest = pan !== 0 ? this.createStereoNode(pan) : this.musicBus;
      src.connect(f);
      f.connect(g);
      g.connect(dest);
      src.start(time);
      src.stop(time + dur + 0.01);
    };

    const snare = (v = 0.065) => noiseHit(0.09, v, 1500, 'bandpass', -0.1);
    const hat = (v = 0.032) => noiseHit(0.035, v, 5600, 'highpass', 0.22);
    const openHat = (v = 0.042) => noiseHit(0.14, v, 4800, 'highpass', 0.28);
    const rim = (v = 0.05) => {
      if (!this.ctx || !this.musicBus) return;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(860, time);
      o.frequency.exponentialRampToValueAtTime(420, time + 0.03);
      g.gain.setValueAtTime(v, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);
      o.connect(g);
      g.connect(this.musicBus);
      o.start(time);
      o.stop(time + 0.04);
    };

    // Crash/shimmer on Climax start!
    if (section === 'D_CLIMAX' && totalStep === 0 && !frozen) {
      noiseHit(0.45, 0.068, 4200, 'highpass', -0.25);
    }

    // Breakdown section C: subtle atmospheric pulse + dramatic Bar-4 snare riser into Climax!
    if (section === 'C_BREAK') {
      if (totalStep < 52) {
        if (s === 0) kick(95, 0.085);
        if (s === 6 || s === 12) rim(0.035);
        if (s % 4 === 2) hat(0.02);
      } else {
        // 12-step snare/kick crescendo riser!
        const intensity = (totalStep - 51) / 12;
        snare(0.025 + intensity * 0.065);
        if (totalStep % 2 === 0) kick(120 + intensity * 45, 0.07 + intensity * 0.08);
      }
      return;
    }

    // Varied turnaround fills at end of 4-bar phrases (4 rotating fill styles!)
    if (totalStep >= 58 && style !== 'space') {
      const fillVariant = (this.sectionCursor + this.cycleCount) % 3;
      if (fillVariant === 0) {
        if (totalStep === 60 || totalStep === 62) snare(0.072);
        if (totalStep === 63) kick(168, 0.13);
      } else if (fillVariant === 1) {
        if ([58, 60, 61, 62, 63].includes(totalStep)) rim(0.055);
        if (totalStep === 62) openHat(0.045);
      } else {
        if (totalStep >= 60) snare(0.05 + (totalStep - 60) * 0.012);
      }
    }

    // Extra urgency shaker on 16th notes when time is running low!
    if (urgent && s % 2 === 1) {
      hat(0.026);
    }

    // Climax open-hat lift on offbeats
    if (section === 'D_CLIMAX' && (s === 6 || s === 14) && style !== 'space') {
      openHat(0.034);
    }

    switch (style) {
      case 'samba':
        if (s === 0 || s === 8) kick(102, 0.11);
        if (s === 4 || s === 12) kick(152, 0.16);
        if ([0, 2, 3, 6, 8, 10, 11, 14].includes(s)) hat(0.035);
        if ([0, 3, 6, 10, 12].includes(s)) rim(0.045);
        break;
      case 'tango':
        if ([0, 6, 8, 12].includes(s)) kick(118, 0.14);
        if (s === 4 || s === 12) snare(0.055);
        if (s === 14) rim(0.045);
        break;
      case 'salsa':
        if ([0, 3, 6, 10, 12].includes(s)) rim(0.06);
        if ([0, 6, 14].includes(s)) kick(128, 0.13);
        if (s % 2 === 0) hat(0.024);
        break;
      case 'flamenco':
        if ([0, 3, 6, 8, 10, 12].includes(s)) snare(0.055);
        if (s === 0 || s === 8) kick(125, 0.14);
        break;
      case 'taiko':
        if ([0, 6, 8, 14].includes(s)) kick(96, 0.16);
        if (s === 4 || s === 12) snare(0.06);
        if (s === 2 || s === 10) rim(0.04);
        break;
      case 'darbuka':
        if ([0, 6, 10].includes(s)) kick(140, 0.13);
        if ([2, 4, 8, 12, 14].includes(s)) rim(0.05);
        if (s % 2 === 1) hat(0.02);
        break;
      case 'space':
        if (s === 0 || s === 8) kick(82, 0.11);
        if (s === 4 || s === 12) hat(0.025);
        break;
      case 'cinematic':
        if (s === 0 || s === 10) kick(98, 0.13);
        if (s === 8) rim(0.038);
        if (s % 4 === 0) hat(0.022);
        break;
      case 'boss':
        if (s % 4 === 0 || s === 14) kick(150, 0.16);
        if (s === 4 || s === 12) snare(0.08);
        if (s % 2 === 1) hat(0.036);
        break;
      default:
        if (s === 0 || s === 8 || (style === 'rock' && s === 10)) kick(134, 0.14);
        if (s === 4 || s === 12) snare(0.07);
        if (s % 2 === 0) hat(0.03);
        break;
    }
  }

  // =========================================================================
  // ARCADE & STORY SOUND EFFECTS
  // =========================================================================
  private playSfxTone(opts: {
    freqStart: number;
    freqEnd?: number;
    duration: number;
    type?: OscillatorType;
    volume?: number;
    delay?: number;
  }): void {
    if (this.sfxMuted || !this.ctx || !this.sfxBus) return;
    try {
      const now = this.ctx.currentTime + (opts.delay || 0);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = opts.type || 'square';
      osc.frequency.setValueAtTime(opts.freqStart, now);
      if (opts.freqEnd && opts.freqEnd !== opts.freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.freqEnd), now + opts.duration);
      }
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(opts.volume ?? 0.13, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);
      osc.connect(gain);
      gain.connect(this.sfxBus);
      osc.start(now);
      osc.stop(now + opts.duration + 0.02);
    } catch {
      // Ignore audio errors
    }
  }

  private playSfxNoise(opts: {
    duration?: number;
    volume?: number;
    filterFreq?: number;
    filterType?: BiquadFilterType;
    delay?: number;
  }): void {
    if (this.sfxMuted || !this.ctx || !this.sfxBus || !this.noiseBuffer) return;
    try {
      const dur = opts.duration ?? 0.18;
      const now = this.ctx.currentTime + (opts.delay || 0);
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = opts.filterType || 'lowpass';
      filter.frequency.setValueAtTime(opts.filterFreq ?? 900, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(opts.volume ?? 0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxBus);
      src.start(now);
      src.stop(now + dur + 0.02);
    } catch {
      // Ignore
    }
  }

  public voiceBlip(basePitch = 320, wave: OscillatorType = 'triangle'): void {
    const jitter = 0.94 + Math.random() * 0.14;
    this.playSfxTone({
      freqStart: basePitch * jitter,
      freqEnd: basePitch * jitter * 1.08,
      duration: 0.036,
      type: wave,
      volume: 0.042
    });
  }

  public radioChime(): void {
    this.playSfxTone({ freqStart: 880, freqEnd: 1174.66, duration: 0.065, type: 'sine', volume: 0.07 });
    this.playSfxTone({ freqStart: 1318.5, freqEnd: 1567.98, duration: 0.08, type: 'sine', volume: 0.06, delay: 0.055 });
  }

  public shoot(): void {
    this.playSfxTone({ freqStart: 560, freqEnd: 1320, duration: 0.085, type: 'triangle', volume: 0.13 });
    this.playSfxNoise({ duration: 0.04, volume: 0.05, filterFreq: 2600, filterType: 'highpass' });
  }

  public hookLatch(): void {
    this.playSfxTone({ freqStart: 1040, freqEnd: 680, duration: 0.075, type: 'square', volume: 0.1 });
  }

  public pop(sizeIndex: number, combo = 1): void {
    const base = ([740, 530, 365, 240][sizeIndex] || 400) * Math.min(1.45, 1 + (combo - 1) * 0.08);
    this.playSfxTone({ freqStart: base, freqEnd: base * 1.75, duration: 0.11, type: 'sine', volume: 0.19 });
    this.playSfxNoise({ duration: 0.055, volume: 0.07, filterFreq: 2200 });
    if (combo >= 2) {
      this.playSfxTone({
        freqStart: 523.25 * Math.pow(1.12, Math.min(combo, 8)),
        freqEnd: 659.25 * Math.pow(1.12, Math.min(combo, 8)),
        duration: 0.09,
        type: 'triangle',
        volume: 0.09,
        delay: 0.03
      });
    }
  }

  public blockBreak(): void {
    this.playSfxNoise({ duration: 0.14, volume: 0.14, filterFreq: 1200 });
    this.playSfxTone({ freqStart: 240, freqEnd: 82, duration: 0.12, type: 'square', volume: 0.1 });
  }

  public powerup(): void {
    [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
      this.playSfxTone({ freqStart: n, freqEnd: n, duration: 0.095, type: 'triangle', volume: 0.14, delay: i * 0.048 });
    });
  }

  public extraLife(): void {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((n, i) => {
      this.playSfxTone({ freqStart: n, freqEnd: n, duration: 0.12, type: 'square', volume: 0.11, delay: i * 0.068 });
    });
  }

  public freeze(): void {
    [1320, 990, 1480, 1180].forEach((n, i) => {
      this.playSfxTone({ freqStart: n, freqEnd: n * 0.88, duration: 0.13, type: 'sine', volume: 0.11, delay: i * 0.05 });
    });
  }

  public dynamite(): void {
    this.playSfxNoise({ duration: 0.44, volume: 0.25, filterFreq: 520 });
    this.playSfxTone({ freqStart: 160, freqEnd: 34, duration: 0.4, type: 'sawtooth', volume: 0.18 });
  }

  public shieldBlock(): void {
    this.playSfxTone({ freqStart: 640, freqEnd: 290, duration: 0.2, type: 'triangle', volume: 0.15 });
    this.playSfxTone({ freqStart: 920, freqEnd: 460, duration: 0.18, type: 'sine', volume: 0.12, delay: 0.04 });
  }

  public hit(): void {
    this.playSfxTone({ freqStart: 320, freqEnd: 70, duration: 0.36, type: 'sawtooth', volume: 0.18 });
    this.playSfxNoise({ duration: 0.22, volume: 0.14, filterFreq: 600 });
  }

  public planeFlight(): void {
    this.playSfxTone({ freqStart: 115, freqEnd: 185, duration: 1.5, type: 'sawtooth', volume: 0.05 });
    this.playSfxNoise({ duration: 1.7, volume: 0.05, filterFreq: 420 });
    this.playSfxTone({ freqStart: 440, freqEnd: 554.37, duration: 0.12, type: 'triangle', volume: 0.09, delay: 0.1 });
    this.playSfxTone({ freqStart: 659.25, freqEnd: 880, duration: 0.24, type: 'triangle', volume: 0.09, delay: 0.24 });
  }

  public rocketLaunch(): void {
    this.playSfxNoise({ duration: 2.2, volume: 0.13, filterFreq: 340 });
    this.playSfxTone({ freqStart: 85, freqEnd: 270, duration: 2.0, type: 'sawtooth', volume: 0.065 });
    [523.25, 783.99, 1046.5].forEach((n, i) => {
      this.playSfxTone({ freqStart: n, freqEnd: n * 1.12, duration: 0.16, type: 'sine', volume: 0.1, delay: 0.15 + i * 0.14 });
    });
  }

  public stageClear(): void {
    const melody = [523.25, 659.25, 783.99, 659.25, 1046.5];
    const delays = [0, 0.1, 0.2, 0.3, 0.42];
    melody.forEach((n, i) => {
      this.playSfxTone({
        freqStart: n,
        freqEnd: n,
        duration: i === 4 ? 0.38 : 0.11,
        type: 'square',
        volume: 0.11,
        delay: delays[i]
      });
    });
  }

  public gameOver(): void {
    [392, 369.99, 349.23, 329.63, 261.63].forEach((n, i) => {
      this.playSfxTone({
        freqStart: n,
        freqEnd: n * 0.96,
        duration: i === 4 ? 0.52 : 0.16,
        type: 'sawtooth',
        volume: 0.12,
        delay: i * 0.17
      });
    });
  }

  public victory(): void {
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
    const delays = [0, 0.1, 0.2, 0.32, 0.48, 0.58, 0.72];
    fanfare.forEach((n, i) => {
      this.playSfxTone({
        freqStart: n,
        freqEnd: n,
        duration: i === 6 ? 0.58 : 0.12,
        type: 'triangle',
        volume: 0.15,
        delay: delays[i]
      });
    });
  }
}
