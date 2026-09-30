import { plan } from '../data/plan';
import type { Exercise, PhaseId, Prescription, Session, SessionBlock } from '../data/types';

export function todayISO(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Segunda-feira da semana da data. */
export function mondayOf(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (x.getDay() + 6) % 7; // 0 = segunda
  x.setDate(x.getDate() - dow);
  return x;
}

/** Número da semana do plano (1..12; pode passar de 12). */
export function weekNumber(startDate: string, date = new Date()): number {
  const start = mondayOf(parseISO(startDate));
  const cur = mondayOf(date);
  const diff = Math.round((cur.getTime() - start.getTime()) / (7 * 24 * 3600 * 1000));
  return Math.max(1, diff + 1);
}

export function phaseForWeek(week: number): PhaseId {
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  if (week <= 11) return 3;
  return 4;
}

export function clampPhase(p: number): PhaseId {
  return Math.min(4, Math.max(1, p)) as PhaseId;
}

/** Sessão do dia da semana (1=seg..5=sex). Fim de semana => null. */
export function sessionForDate(date = new Date()): Session | null {
  const dow = date.getDay(); // 0 dom
  return plan.sessions.find((s) => s.weekday === dow) ?? null;
}

export function getExercise(id: string): Exercise {
  const ex = plan.exercises[id];
  if (!ex) throw new Error(`Exercício desconhecido: ${id}`);
  return ex;
}

/** Prescrição efetiva do item num bloco, na fase, com override do bloco e semana 1. */
export function effectivePrescription(
  ex: Exercise,
  block: SessionBlock | undefined,
  phase: PhaseId,
  week: number,
): Prescription {
  const base = ex.prescription[phase];
  const ov = block?.overrides?.[ex.id]?.[phase];
  let p: Prescription = { ...base, ...(ov ?? {}) };
  // Semana 1: 2 séries (regra da Fase 1)
  if (phase === 1 && week === 1 && p.sets > 2 && ex.kind === 'main') p = { ...p, sets: 2 };
  return p;
}

/** "10–12" -> {min:10,max:12}; "8 por lado" -> 8; "20–40 s" -> {min:20,max:40, unit:'s'} */
export function parseRange(reps: string): { min: number; max: number; unit: 'reps' | 's' | 'min' | 'other' } | null {
  const m = reps.match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*(s|seg|min)?/i);
  if (!m) return null;
  const min = Number(m[1]);
  const max = m[2] ? Number(m[2]) : min;
  const unitRaw = (m[3] ?? '').toLowerCase();
  const unit = unitRaw === 's' || unitRaw === 'seg' ? 's' : unitRaw === 'min' ? 'min' : 'reps';
  return { min, max, unit };
}

/** "3–4" -> {min:3,max:4}; "2" -> {min:2,max:2}; "—" -> null */
export function parseRir(rir: string): { min: number; max: number } | null {
  const m = rir.match(/(\d+)(?:\s*[–-]\s*(\d+))?/);
  if (!m) return null;
  return { min: Number(m[1]), max: m[2] ? Number(m[2]) : Number(m[1]) };
}

export const WEEKDAY_PT = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
