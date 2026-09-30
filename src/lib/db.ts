import Dexie, { type Table } from 'dexie';
import type { PhaseId } from '../data/types';

export type SideKey = 'L' | 'R' | 'both';

export interface Setting {
  key: string;
  value: string;
}

/** Uma série registrada. */
export interface SetLog {
  id?: number;
  date: string; // YYYY-MM-DD
  sessionId: string; // A..E
  exerciseId: string;
  side: SideKey;
  setIndex: number; // 0-based
  loadKg: number | null;
  reps: number | null;
  rir: number | null;
  ts: number;
}

/** Estado de um exercício numa sessão (sintoma sim/não). */
export interface ExerciseLog {
  id?: number;
  date: string;
  sessionId: string;
  exerciseId: string;
  symptom: boolean;
  done: boolean;
  ts: number;
}

/** Sessão do dia. */
export interface SessionLog {
  id?: number;
  date: string;
  sessionId: string;
  week: number;
  phase: PhaseId;
  painMax: number | null; // dor no ombro 0–10
  symptomAny: boolean;
  completed: boolean;
  notes?: string;
  ts: number;
}

/** Estado persistente por exercício (regras). */
export interface ExerciseState {
  exerciseId: string;
  /** Deslocamento de fase por sintoma repetido (0, -1, -2). */
  phaseOffset: number;
  /** Data (YYYY-MM-DD) do último aumento de carga aceito pelo usuário. */
  lastIncreaseDate?: string;
  /** Data em que a regra de regressão foi disparada pela última vez. */
  lastRegressDate?: string;
  /** Sugestão pendente de aumento gerada pelo app. */
  pendingIncrease?: { date: string; fromKg: number | null; toKg: number | null };
  /** Exercício marcado para troca (sintoma repetido 2x). */
  flaggedSwap?: boolean;
}

export interface WeightLog {
  date: string; // chave
  kg: number;
}

export interface WaistLog {
  date: string;
  cm: number;
}

export interface Photo {
  id?: number;
  date: string;
  view: 'frente' | 'lado' | 'costas';
  blob: Blob;
}

export interface AsymTest {
  id?: number;
  date: string;
  exerciseId: string;
  loadKg: number;
  repsL: number;
  repsR: number;
}

class TreinoDB extends Dexie {
  settings!: Table<Setting, string>;
  setLogs!: Table<SetLog, number>;
  exerciseLogs!: Table<ExerciseLog, number>;
  sessionLogs!: Table<SessionLog, number>;
  exerciseState!: Table<ExerciseState, string>;
  weights!: Table<WeightLog, string>;
  waist!: Table<WaistLog, string>;
  photos!: Table<Photo, number>;
  asymTests!: Table<AsymTest, number>;

  constructor() {
    super('treino12');
    this.version(1).stores({
      settings: 'key',
      setLogs: '++id, date, exerciseId, [exerciseId+date], [date+sessionId]',
      exerciseLogs: '++id, date, exerciseId, [exerciseId+date], [date+sessionId]',
      sessionLogs: '++id, date, sessionId, [date+sessionId]',
      exerciseState: 'exerciseId',
      weights: 'date',
      waist: 'date',
      photos: '++id, date',
      asymTests: '++id, date, exerciseId',
    });
  }
}

export const db = new TreinoDB();

export async function getSetting(key: string): Promise<string | undefined> {
  return (await db.settings.get(key))?.value;
}
export async function setSetting(key: string, value: string) {
  await db.settings.put({ key, value });
}

export async function getExerciseState(id: string): Promise<ExerciseState> {
  return (await db.exerciseState.get(id)) ?? { exerciseId: id, phaseOffset: 0 };
}

// ---------- backup ----------

export interface Backup {
  app: 'treino12';
  version: 1;
  exportedAt: string;
  settings: Setting[];
  setLogs: SetLog[];
  exerciseLogs: ExerciseLog[];
  sessionLogs: SessionLog[];
  exerciseState: ExerciseState[];
  weights: WeightLog[];
  waist: WaistLog[];
  asymTests: AsymTest[];
}

export async function exportBackup(): Promise<Backup> {
  return {
    app: 'treino12',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: await db.settings.toArray(),
    setLogs: await db.setLogs.toArray(),
    exerciseLogs: await db.exerciseLogs.toArray(),
    sessionLogs: await db.sessionLogs.toArray(),
    exerciseState: await db.exerciseState.toArray(),
    weights: await db.weights.toArray(),
    waist: await db.waist.toArray(),
    asymTests: await db.asymTests.toArray(),
  };
}

export async function importBackup(b: Backup, mode: 'replace' | 'merge') {
  if (b.app !== 'treino12') throw new Error('Arquivo não é um backup deste app.');
  await db.transaction('rw', [db.settings, db.setLogs, db.exerciseLogs, db.sessionLogs, db.exerciseState, db.weights, db.waist, db.asymTests], async () => {
    if (mode === 'replace') {
      await Promise.all([
        db.settings.clear(), db.setLogs.clear(), db.exerciseLogs.clear(), db.sessionLogs.clear(),
        db.exerciseState.clear(), db.weights.clear(), db.waist.clear(), db.asymTests.clear(),
      ]);
    }
    const strip = <T extends { id?: number }>(rows: T[]) => rows.map(({ id: _id, ...r }) => r as T);
    await db.settings.bulkPut(b.settings ?? []);
    await db.setLogs.bulkAdd(strip(b.setLogs ?? []));
    await db.exerciseLogs.bulkAdd(strip(b.exerciseLogs ?? []));
    await db.sessionLogs.bulkAdd(strip(b.sessionLogs ?? []));
    await db.exerciseState.bulkPut(b.exerciseState ?? []);
    await db.weights.bulkPut(b.weights ?? []);
    await db.waist.bulkPut(b.waist ?? []);
    await db.asymTests.bulkAdd(strip(b.asymTests ?? []));
  });
}
