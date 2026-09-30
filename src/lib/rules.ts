// Motor de regras do plano, aplicado aos dados do usuário.
import { db, getExerciseState, type ExerciseState, type SetLog } from './db';
import { plan } from '../data/plan';
import { getExercise, parseRange, parseRir } from './phase';
import type { Prescription } from '../data/types';

export const UPPER_BODY_MIN_DAYS = plan.progression.upperBodyMaxOnePer.days; // 14
export const SYMPTOM_CONSECUTIVE = plan.progression.symptomRegress.consecutiveSessions; // 2
export const PAIN_MAX_OK = 3;

export interface IncreaseCheck {
  eligible: boolean;
  reasons: { ok: boolean; text: string }[];
  blockedByUpperRule?: string;
  suggestedKg?: number | null;
  currentKg?: number | null;
}

function daysBetween(a: string, b: string): number {
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

/**
 * Avalia as três condições para subir carga num exercício, dada a sessão de hoje.
 * sets: séries registradas hoje para o exercício (todos os lados).
 */
export function checkIncrease(
  exerciseId: string,
  presc: Prescription,
  sets: SetLog[],
  symptomToday: boolean,
  painMax: number | null,
  state: ExerciseState,
  today: string,
): IncreaseCheck {
  const ex = getExercise(exerciseId);
  const range = parseRange(presc.reps);
  const rir = parseRir(presc.rir);
  const filled = sets.filter((s) => s.reps != null);

  // Condição 1: topo da faixa em todas as séries, com o RIR da fase
  const requiredSets = presc.sets * (ex.unilateral ? 2 : 1);
  let cond1 = false;
  if (range && filled.length >= requiredSets && requiredSets > 0) {
    cond1 = filled.every((s) => {
      const repsOk = (s.reps ?? 0) >= range.max;
      const rirOk = !rir || s.rir == null || s.rir >= rir.min;
      return repsOk && rirOk;
    });
  }
  const cond2 = !symptomToday;
  const cond3 = painMax == null || painMax <= PAIN_MAX_OK;

  const reasons = [
    { ok: cond1, text: plan.progression.increaseConditions[0] },
    { ok: cond2, text: plan.progression.increaseConditions[1] },
    { ok: cond3, text: plan.progression.increaseConditions[2] },
  ];

  let blockedByUpperRule: string | undefined;
  if (ex.upperBody && state.lastIncreaseDate) {
    const d = daysBetween(state.lastIncreaseDate, today);
    if (d < UPPER_BODY_MIN_DAYS) {
      blockedByUpperRule = `Membro superior: último aumento há ${d} dia(s). Só sugerir de novo em ${UPPER_BODY_MIN_DAYS - d} dia(s).`;
    }
  }

  const loads = filled.map((s) => s.loadKg).filter((x): x is number => x != null);
  const currentKg = loads.length ? Math.min(...loads) : null;
  const step = ex.loadStepKg ?? 0;
  let suggestedKg: number | null = null;
  if (currentKg != null && step > 0) {
    suggestedKg = currentKg + step;
    if (ex.maxLoadKg != null && suggestedKg > ex.maxLoadKg) suggestedKg = null;
  }

  const eligible = cond1 && cond2 && cond3 && !blockedByUpperRule && ex.loaded && presc.sets > 0;
  return { eligible, reasons, blockedByUpperRule, suggestedKg, currentKg };
}

/** Regra da assimetria: o direito nunca recebe mais carga que o esquerdo. */
export function clampRightToLeft(rightKg: number | null, leftKg: number | null): { kg: number | null; clamped: boolean } {
  if (rightKg == null || leftKg == null) return { kg: rightKg, clamped: false };
  if (rightKg > leftKg) return { kg: leftKg, clamped: true };
  return { kg: rightKg, clamped: false };
}

/**
 * Sintoma em 2 treinos seguidos (no mesmo exercício) => volta uma fase nesse exercício.
 * Retorna true se regrediu agora.
 */
export async function applySymptomRegress(exerciseId: string, today: string): Promise<boolean> {
  const logs = await db.exerciseLogs.where('exerciseId').equals(exerciseId).sortBy('date');
  // Apenas sessões em que o exercício foi feito
  const done = logs.filter((l) => l.done || l.symptom);
  if (done.length < SYMPTOM_CONSECUTIVE) return false;
  const last = done.slice(-SYMPTOM_CONSECUTIVE);
  if (!last.every((l) => l.symptom)) return false;
  const state = await getExerciseState(exerciseId);
  // Não regredir duas vezes pela mesma sequência
  if (state.lastRegressDate && state.lastRegressDate >= last[0].date) return false;
  await db.exerciseState.put({
    ...state,
    phaseOffset: Math.max(-3, state.phaseOffset - 1),
    lastRegressDate: today,
    flaggedSwap: state.lastRegressDate ? true : state.flaggedSwap,
  });
  return true;
}

/** Última carga usada por lado num exercício (para pré-preencher). */
export async function lastLoads(exerciseId: string): Promise<Record<'L' | 'R' | 'both', number | null>> {
  const rows = await db.setLogs.where('exerciseId').equals(exerciseId).reverse().sortBy('ts');
  const out: Record<'L' | 'R' | 'both', number | null> = { L: null, R: null, both: null };
  for (const r of rows) {
    if (out[r.side] == null && r.loadKg != null) out[r.side] = r.loadKg;
    if (out.L != null && out.R != null && out.both != null) break;
  }
  return out;
}

// ---------------- Regras de ajuste de calorias (seção 4) ----------------

export interface WeekAvg {
  weekStart: string; // segunda
  avg: number;
  n: number;
}

export function weeklyAverages(weights: { date: string; kg: number }[]): WeekAvg[] {
  const map = new Map<string, { sum: number; n: number }>();
  for (const w of weights) {
    const [y, m, d] = w.date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const dow = (dt.getDay() + 6) % 7;
    dt.setDate(dt.getDate() - dow);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    const cur = map.get(key) ?? { sum: 0, n: 0 };
    cur.sum += w.kg;
    cur.n += 1;
    map.set(key, cur);
  }
  return [...map.entries()]
    .map(([weekStart, v]) => ({ weekStart, avg: v.sum / v.n, n: v.n }))
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

export interface Suggestion {
  ruleId: string;
  title: string;
  detail: string;
  severity: 'info' | 'warn';
}

export function evaluateNutritionRules(
  weeks: WeekAvg[],
  waist: { date: string; cm: number }[],
  planWeek: number,
): Suggestion[] {
  const out: Suggestion[] = [];
  if (weeks.length >= 3) {
    const [w0, w1, w2] = weeks.slice(-3);
    const d1 = w0.avg - w1.avg;
    const d2 = w1.avg - w2.avg;
    const waistSorted = [...waist].sort((a, b) => a.date.localeCompare(b.date));
    const waistStalled =
      waistSorted.length >= 2 &&
      Math.abs(waistSorted[waistSorted.length - 1].cm - waistSorted[waistSorted.length - 3 < 0 ? 0 : waistSorted.length - 3].cm) < 0.5;
    if (d1 < 0.25 && d2 < 0.25 && (waistStalled || waistSorted.length < 2)) {
      const r = plan_rule('slow_loss');
      out.push({ ruleId: 'slow_loss', title: r.trigger, detail: r.action, severity: 'warn' });
    }
    if (planWeek > 2 && d1 > 1 && d2 > 1) {
      const r = plan_rule('fast_loss');
      out.push({ ruleId: 'fast_loss', title: r.trigger, detail: r.action, severity: 'warn' });
    }
  }
  if (planWeek >= 12) {
    const r = plan_rule('week12');
    out.push({ ruleId: 'week12', title: r.trigger, detail: r.action, severity: 'info' });
  }
  return out;
}

import { tracking } from '../data/tracking';
function plan_rule(id: string) {
  return tracking.rules.find((r) => r.id === id) ?? { id, trigger: id, action: '' };
}

/** Carga parou de subir por 2 semanas num exercício. */
export function loadStalled(sets: SetLog[]): boolean {
  // sets ordenados por data; compara carga máxima por semana nas últimas 3 semanas
  const byWeek = new Map<string, number>();
  for (const s of sets) {
    if (s.loadKg == null) continue;
    const [y, m, d] = s.date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
    const key = dt.toISOString().slice(0, 10);
    byWeek.set(key, Math.max(byWeek.get(key) ?? 0, s.loadKg));
  }
  const arr = [...byWeek.entries()].sort((a, b) => a[0].localeCompare(b[0])).map((e) => e[1]);
  if (arr.length < 3) return false;
  const [a, b, c] = arr.slice(-3);
  return c <= a && b <= a;
}
