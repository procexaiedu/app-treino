import { useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent, type SVGProps } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { plan } from '../data/plan';
import type { Exercise, ItemKind, PhaseId, Prescription, Session, SessionBlock } from '../data/types';
import { db, getExerciseState, type ExerciseLog, type ExerciseState, type SetLog } from '../lib/db';
import { clampPhase, effectivePrescription, getExercise, phaseForWeek, sessionForDate, todayISO, weekNumber, WEEKDAY_PT } from '../lib/phase';
import { applySymptomRegress, checkIncrease, clampRightToLeft, lastLoads, type IncreaseCheck } from '../lib/rules';
import { useRestTimer } from '../lib/timer';
import { RestTimerBar } from '../components/RestTimer';
import { VideoDemo } from '../components/VideoDemo';
import { Sheet } from '../components/Sheet';
import {
  IconActivity, IconCalendar, IconCheck, IconChevronDown, IconChevronRight, IconCircle, IconDumbbell, IconFlame,
  IconHistory, IconMinus, IconPlay, IconPlus, IconShieldPlus, IconStretch, IconTrophy,
} from '../components/icons';

type SideKey = 'L' | 'R' | 'both';
type IconT = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const KIND_SHORT: Record<ItemKind, string> = { warmup: 'Aquec.', rehab: 'Reab.', main: 'Principal', cardio: 'Cardio', stretch: 'Along.' };
const KIND_ICON: Record<ItemKind, IconT> = { warmup: IconFlame, rehab: IconShieldPlus, main: IconDumbbell, cardio: IconActivity, stretch: IconStretch };
const SIDE_LABEL: Record<SideKey, string> = { L: 'Esquerdo', R: 'Direito', both: '' };
const SIDE_SHORT: Record<SideKey, string> = { L: 'E', R: 'D', both: '' };
const SIDE_COLOR: Record<SideKey, string> = { L: 'var(--left)', R: 'var(--right)', both: 'var(--accent)' };

/** Timer de descanso + rótulo do que vem depois (mostrado na barra). */
type Rest = ReturnType<typeof useRestTimer> & { begin: (sec: number, label: string) => void };

export function Today({ startDate }: { startDate: string }) {
  const [dateOverride, setDateOverride] = useState<Date | null>(null);
  const date = dateOverride ?? new Date();
  const iso = todayISO(date);
  const week = weekNumber(startDate, date);
  const phase = phaseForWeek(week);
  const autoSession = sessionForDate(date);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const session: Session | null = sessionId ? plan.sessions.find((s) => s.id === sessionId) ?? null : autoSession;
  const timer = useRestTimer();
  const [restLabel, setRestLabel] = useState<string | null>(null);
  const rest: Rest = { ...timer, begin: (sec, label) => { setRestLabel(label); timer.start(sec); } };

  const sessionLog = useLiveQuery(() => (session ? db.sessionLogs.where('[date+sessionId]').equals([iso, session.id]).first() : undefined), [iso, session?.id]);
  const [finishOpen, setFinishOpen] = useState(false);

  const phaseInfo = plan.phases.find((p) => p.id === phase)!;

  return (
    <div className="pb-40 pb-timer">
      <header className="px-4 pt-4 pb-3">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-[28px] leading-tight font-bold">Hoje · {WEEKDAY_PT[date.getDay()]}</h1>
          <span className="text-base font-semibold muted num">{iso.slice(8)}/{iso.slice(5, 7)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-sm">
          <span className="pill num" style={{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)', color: 'var(--accent)' }}>Semana {week} de {plan.meta.weeks}</span>
          <span className="muted">Fase {phase}: {phaseInfo.name} · RIR {phaseInfo.rirRule}</span>
        </div>
        {week > plan.meta.weeks && <div className="mt-2 text-sm" style={{ color: 'var(--warn)' }}>O plano de 12 semanas acabou. Semana 12 vale como padrão até você reavaliar.</div>}
      </header>

      <div className="chip-row px-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Escolher treino">
        {plan.sessions.map((s) => {
          const active = session?.id === s.id;
          const isAuto = autoSession?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSessionId(s.id)}
              aria-pressed={active}
              className="tap press flex flex-col items-center justify-center min-w-14 px-3 rounded-xl whitespace-nowrap shrink-0 leading-tight"
              style={{
                background: active ? 'var(--accent)' : 'var(--card)',
                color: active ? 'var(--on-color)' : 'var(--text)',
                boxShadow: !active && isAuto ? 'inset 0 0 0 1px color-mix(in srgb, var(--accent) 60%, transparent)' : undefined,
              }}
            >
              <span className="text-base font-bold">{s.id}</span>
              <span className="text-sm" style={{ opacity: active ? 0.8 : 1, color: active ? undefined : 'var(--muted)' }}>{WEEKDAY_PT[s.weekday].slice(0, 3)}</span>
            </button>
          );
        })}
        {dateOverride === null ? (
          <button className="tap press flex items-center gap-1.5 px-3 rounded-xl card text-sm font-semibold muted whitespace-nowrap shrink-0" onClick={() => setDateOverride(new Date())}>
            <IconCalendar size={18} />Outra data
          </button>
        ) : (
          <input type="date" aria-label="Data do treino" className="tap field px-3 text-sm shrink-0" value={iso} onChange={(e) => e.target.value && setDateOverride(new Date(e.target.value + 'T12:00:00'))} />
        )}
      </div>

      {!session ? (
        <div className="mx-4 mt-3 card p-5">
          <div className="text-lg font-bold">Fim de semana: sem treino.</div>
          <p className="muted mt-2">Meta do dia: caminhada de 30–40 min, primeira refeição com 40–50 g de proteína e água. Escolha um treino acima se quiser adiantar.</p>
        </div>
      ) : (
        <SessionView key={`${session.id}-${iso}`} session={session} phase={phase} week={week} iso={iso} rest={rest} sessionLog={sessionLog ?? null} onFinish={() => setFinishOpen(true)} />
      )}

      <RestTimerBar t={timer} label={restLabel} />
      {session && <FinishSheet open={finishOpen} onClose={() => setFinishOpen(false)} session={session} iso={iso} week={week} phase={phase} />}
    </div>
  );
}

// ---------------- Progresso da sessão (derivado do banco) ----------------

interface ItemStatus {
  key: string; // `${blockIndex}-${exerciseId}`
  ex: Exercise;
  blockIndex: number;
  hidden: boolean;
  totalSets: number;
  doneSets: number;
  done: boolean;
  started: boolean;
}

function setIsDone(s: SetLog, ex: Exercise) {
  return s.reps != null || (!ex.loaded && !!s.side);
}

function statusFor(ex: Exercise, presc: Prescription, hidden: boolean, sets: SetLog[], exLog: ExerciseLog | undefined) {
  const sides = ex.unilateral ? 2 : 1;
  const totalSets = presc.sets * sides;
  const doneSets = new Set(sets.filter((s) => setIsDone(s, ex)).map((s) => `${s.side}${s.setIndex}`)).size;
  const done = !hidden && ((doneSets >= totalSets && totalSets > 0) || !!exLog?.done);
  return { totalSets, doneSets, done, started: doneSets > 0 || !!exLog };
}

/** Estado da sessão inteira: feitos/total, séries, volume, início, próximo exercício. */
function useSessionProgress(session: Session, phase: PhaseId, week: number, iso: string) {
  const states = useLiveQuery(() => db.exerciseState.toArray(), []);
  const exLogs = useLiveQuery(() => db.exerciseLogs.where('date').equals(iso).toArray(), [iso]);
  const daySets = useLiveQuery(() => db.setLogs.where('date').equals(iso).toArray(), [iso]);

  return useMemo(() => {
    const stateMap = new Map((states ?? []).map((s) => [s.exerciseId, s]));
    const items: ItemStatus[] = [];
    const seen = new Set<string>();
    session.blocks.forEach((block, bi) => {
      for (const id of block.items) {
        const ex = getExercise(id);
        const effPhase = clampPhase(phase + (stateMap.get(id)?.phaseOffset ?? 0));
        const presc = effectivePrescription(ex, block, effPhase, week);
        const hidden = presc.sets === 0 || (!!ex.fromPhase && effPhase < ex.fromPhase);
        const sets = (daySets ?? []).filter((s) => s.exerciseId === id);
        const st = statusFor(ex, presc, hidden, sets, exLogs?.find((l) => l.exerciseId === id));
        const dup = seen.has(id);
        seen.add(id);
        items.push({ key: `${bi}-${id}`, ex, blockIndex: bi, hidden: hidden || dup, ...st });
      }
    });
    const visible = items.filter((i) => !i.hidden);
    const ids = new Set(visible.map((i) => i.ex.id));
    const sessionSets = (daySets ?? []).filter((s) => ids.has(s.exerciseId) && s.reps != null);
    const volume = sessionSets.reduce((acc, s) => acc + (s.loadKg ?? 0) * (s.reps ?? 0), 0);
    const tsList = sessionSets.map((s) => s.ts);
    const startTs = tsList.length ? Math.min(...tsList) : null;
    const endTs = tsList.length ? Math.max(...tsList) : null;
    const next = visible.find((i) => !i.done) ?? null;
    return {
      items,
      total: visible.length,
      doneCount: visible.filter((i) => i.done).length,
      setCount: sessionSets.length,
      volume,
      startTs,
      endTs,
      next,
      anyStarted: visible.some((i) => i.started),
    };
  }, [states, exLogs, daySets, session, phase, week]);
}

function fmtKg(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}
function fmtDuration(ms: number) {
  const min = Math.max(0, Math.round(ms / 60000));
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`;
}
function fmtSet(s: Pick<SetLog, 'loadKg' | 'reps' | 'rir'>, loaded: boolean, withRir = false) {
  const kg = loaded && s.loadKg != null ? `${fmtKg(s.loadKg)} kg` : null;
  const reps = s.reps != null ? (kg ? `× ${s.reps}` : `${s.reps} reps`) : null;
  const rir = withRir && s.rir != null ? ` · RIR ${s.rir}` : '';
  return [kg, reps].filter(Boolean).join(' ') + rir;
}

function useNow(everyMs: number, active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), everyMs);
    return () => clearInterval(id);
  }, [everyMs, active]);
  return now;
}

// ---------------- Sessão ----------------

function SessionView({ session, phase, week, iso, rest, sessionLog, onFinish }: {
  session: Session; phase: PhaseId; week: number; iso: string; rest: Rest;
  sessionLog: { completed: boolean } | null; onFinish: () => void;
}) {
  const cardio = session.cardio[phase];
  const prog = useSessionProgress(session, phase, week, iso);
  const [openReq, setOpenReq] = useState<{ key: string; n: number } | null>(null);
  const now = useNow(30000, prog.startTs != null);
  const allDone = prog.total > 0 && prog.doneCount >= prog.total;
  const pct = prog.total ? (prog.doneCount / prog.total) * 100 : 0;

  function goNext() {
    if (allDone || !prog.next) { onFinish(); return; }
    setOpenReq((r) => ({ key: prog.next!.key, n: (r?.n ?? 0) + 1 }));
  }

  const stats = [
    prog.setCount ? `${prog.setCount} ${prog.setCount === 1 ? 'série' : 'séries'}` : null,
    prog.volume ? `${fmtKg(prog.volume)} kg` : null,
    prog.startTs ? fmtDuration(now - prog.startTs) : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="px-4 mt-2 flex flex-col gap-6">
      <div className="card p-4">
        <div className="text-xl font-bold leading-tight">{session.title}</div>
        <div className="muted mt-0.5">{session.subtitle}</div>
        <ol className="mt-3 flex flex-wrap gap-1.5 text-sm" aria-label="Blocos da sessão">
          {session.blocks.filter((b, i, arr) => arr.findIndex((x) => x.kind === b.kind) === i).map((b) => {
            const min = b.minutes || (b.kind === 'cardio' ? cardio.minutes : null);
            const Icon = KIND_ICON[b.kind];
            return (
              <li key={b.kind} className="card2 rounded-lg px-2.5 py-1.5 leading-tight flex items-center gap-1.5">
                <Icon size={16} className="muted shrink-0" />
                <span className="font-semibold">{KIND_SHORT[b.kind]}</span>
                {min ? <span className="muted num">· {min} min</span> : null}
              </li>
            );
          })}
        </ol>
        {sessionLog?.completed && <div className="mt-3 text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--accent)' }}><IconCheck size={18} />Sessão encerrada hoje</div>}
      </div>

      {/* Barra fixa de progresso da sessão + próximo exercício */}
      <div className="session-bar sticky z-20 -mx-4 px-4 pt-1 pb-2 -mb-3" style={{ top: 'env(safe-area-inset-top)', background: 'var(--bg)' }}>
        <button
          onClick={goNext}
          className="tap press card w-full flex items-center gap-3 pl-3 pr-2 py-2 text-left"
          style={{ boxShadow: allDone ? 'inset 0 0 0 1px var(--accent)' : 'inset 0 0 0 1px var(--border)' }}
          aria-label={allDone ? 'Tudo feito: encerrar sessão' : `Progresso ${prog.doneCount} de ${prog.total}. Ir para o próximo: ${prog.next?.ex.name ?? ''}`}
        >
          <span className="num font-bold text-2xl leading-none shrink-0" style={{ color: prog.doneCount ? 'var(--accent)' : 'var(--text)' }}>
            {prog.doneCount}<span className="muted text-base font-semibold">/{prog.total}</span>
          </span>
          <span className="flex-1 min-w-0 leading-tight">
            <span className="block text-sm muted truncate num">{stats || 'Nenhuma série ainda'}</span>
            <span className="block font-semibold truncate">
              {allDone ? 'Tudo feito: encerrar sessão' : `${prog.anyStarted ? 'Próximo' : 'Começar'}: ${prog.next?.ex.name ?? ''}`}
            </span>
          </span>
          <IconChevronRight size={22} className="shrink-0" style={{ color: 'var(--accent)' }} />
        </button>
        <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'var(--card2)' }} role="progressbar" aria-label="Exercícios feitos" aria-valuemin={0} aria-valuemax={prog.total} aria-valuenow={prog.doneCount}>
          <div className="h-full w-full rounded-full origin-left" style={{ transform: `scaleX(${pct / 100})`, background: 'var(--accent)', transition: 'transform 300ms var(--ease-out)' }} />
        </div>
      </div>

      {session.blocks.map((block, bi) => (
        <BlockView key={bi} bi={bi} block={block} session={session} phase={phase} week={week} iso={iso} rest={rest} items={prog.items.filter((i) => i.blockIndex === bi)} openReq={openReq} />
      ))}

      <button onClick={onFinish} className="tap press w-full rounded-2xl py-4 text-lg font-bold" style={{ background: 'var(--accent)', color: 'var(--on-color)' }}>
        Encerrar sessão e aplicar regras
      </button>
    </div>
  );
}

function BlockView({ bi, block, session, phase, week, iso, rest, items, openReq }: {
  bi: number; block: SessionBlock; session: Session; phase: PhaseId; week: number; iso: string; rest: Rest; items: ItemStatus[]; openReq: { key: string; n: number } | null;
}) {
  const cardio = session.cardio[phase];
  const Icon = KIND_ICON[block.kind];
  const visible = items.filter((i) => !i.hidden);
  const done = visible.filter((i) => i.done).length;
  const complete = visible.length > 0 && done === visible.length;
  return (
    <section aria-label={block.title}>
      <div className="flex items-center gap-2.5 px-1 mb-2">
        <span
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 32, height: 32, background: complete ? 'var(--accent)' : 'var(--card2)', color: complete ? 'var(--on-color)' : 'var(--muted)' }}
          aria-hidden="true"
        >
          {complete ? <IconCheck size={18} strokeWidth={2.75} /> : <Icon size={18} />}
        </span>
        <h2 className="text-lg font-bold leading-tight flex-1 min-w-0">{block.title}</h2>
        <span className="muted text-sm num shrink-0">
          {visible.length > 0 && <span style={{ color: done ? 'var(--accent)' : undefined }}>{done}/{visible.length}</span>}
          {block.minutes ? <span> · ~{block.minutes} min</span> : null}
        </span>
      </div>
      {block.kind === 'cardio' && (
        <div className="card p-4 mb-2">
          <div className="font-semibold">{cardio.type} · {cardio.minutes} min</div>
          <p className="text-[15px] mt-1">{cardio.detail}</p>
        </div>
      )}
      {block.note && block.kind !== 'cardio' && <p className="muted text-sm px-1 mb-2">{block.note}</p>}
      <div className="flex flex-col gap-2">
        {block.items.map((id) => {
          const ex = getExercise(id);
          const key = `${bi}-${id}`;
          return <ExerciseCard key={key} cardKey={key} ex={ex} block={block} session={session} phase={phase} week={week} iso={iso} rest={rest} openReq={openReq} />;
        })}
      </div>
    </section>
  );
}

/** Última sessão anterior (data < hoje) deste exercício, com as séries dela. */
function usePreviousSession(exerciseId: string, iso: string) {
  return useLiveQuery(async () => {
    const rows = await db.setLogs.where('exerciseId').equals(exerciseId).toArray();
    const past = rows.filter((r) => r.date < iso && (r.reps != null || r.loadKg != null));
    if (!past.length) return null;
    const date = past.reduce((m, r) => (r.date > m ? r.date : m), '');
    return { date, sets: past.filter((r) => r.date === date) };
  }, [exerciseId, iso]);
}

function ExerciseCard({ cardKey, ex, block, session, phase, week, iso, rest, openReq }: {
  cardKey: string; ex: Exercise; block: SessionBlock; session: Session; phase: PhaseId; week: number; iso: string; rest: Rest; openReq: { key: string; n: number } | null;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const state = useLiveQuery(() => db.exerciseState.get(ex.id), [ex.id]);
  const effPhase = clampPhase(phase + (state?.phaseOffset ?? 0));
  const presc = effectivePrescription(ex, block, effPhase, week);
  const hidden = presc.sets === 0 || (ex.fromPhase && effPhase < ex.fromPhase);

  const exLog = useLiveQuery(() => db.exerciseLogs.where('[exerciseId+date]').equals([ex.id, iso]).first(), [ex.id, iso]);
  const sets = useLiveQuery(() => db.setLogs.where('[exerciseId+date]').equals([ex.id, iso]).sortBy('setIndex'), [ex.id, iso]) ?? [];
  const previous = usePreviousSession(ex.id, iso);

  const sides: SideKey[] = ex.unilateral ? ['L', 'R'] : ['both'];
  const st = statusFor(ex, presc, !!hidden, sets, exLog);
  const completed = st.doneSets >= st.totalSets && st.totalSets > 0;
  const isDone = st.done;
  const inProgress = !isDone && st.doneSets > 0;
  const hasGrid = presc.sets > 0 && (ex.kind === 'main' || ex.kind === 'rehab');

  // "Próximo" na barra da sessão abre e rola até este card
  useEffect(() => {
    if (!openReq || openReq.key !== cardKey) return;
    setOpen(true);
    requestAnimationFrame(() => rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [openReq, cardKey]);

  async function setSymptom(v: boolean) {
    const row = exLog ?? { date: iso, sessionId: session.id, exerciseId: ex.id, symptom: false, done: false, ts: Date.now() };
    await db.exerciseLogs.put({ ...row, symptom: v, ts: Date.now() });
  }
  async function markDone(v: boolean) {
    const row = exLog ?? { date: iso, sessionId: session.id, exerciseId: ex.id, symptom: false, done: false, ts: Date.now() };
    await db.exerciseLogs.put({ ...row, done: v, ts: Date.now() });
  }

  if (hidden) {
    return (
      <div className="card p-4 opacity-60">
        <div className="font-semibold">{ex.name}</div>
        <div className="text-sm muted">{presc.note ?? `Só a partir da Fase ${ex.fromPhase}`}</div>
      </div>
    );
  }

  // Resumo "última vez" no card fechado (primeira série de cada lado)
  const lastSummary = previous && hasGrid
    ? sides.map((sd) => {
      const s = previous.sets.find((x) => x.side === sd && x.setIndex === 0) ?? previous.sets.find((x) => x.side === sd);
      return s ? `${SIDE_SHORT[sd] ? SIDE_SHORT[sd] + ' ' : ''}${fmtSet(s, ex.loaded)}` : null;
    }).filter(Boolean).join(' · ')
    : '';

  return (
    <div
      ref={rootRef}
      className="card"
      style={{
        scrollMarginTop: 'calc(env(safe-area-inset-top) + 96px)',
        boxShadow: isDone
          ? 'inset 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent)'
          : inProgress || open ? 'inset 3px 0 0 0 var(--accent)' : undefined,
        transition: 'box-shadow 200ms',
      }}
    >
      <button className="w-full text-left p-4 rounded-2xl active:bg-[var(--card2)] transition-colors" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold text-[17px] leading-snug flex items-center gap-2">
              {isDone && (
                <span className="inline-flex items-center justify-center size-5 rounded-full shrink-0" style={{ background: 'var(--accent)', color: 'var(--on-color)' }}>
                  <IconCheck size={14} strokeWidth={3} />
                  <span className="sr-only">Concluído: </span>
                </span>
              )}
              <span>{ex.name}</span>
            </div>
            <div className="text-sm muted mt-1 num">
              {presc.sets > 1 ? `${presc.sets} × ${presc.reps}` : presc.reps}
              {presc.restSec ? ` · desc. ${fmtRest(presc.restSec)}` : ''}
              {presc.rir !== '—' ? ` · RIR ${presc.rir}` : ''}
            </div>
            {lastSummary && !open && (
              <div className="text-sm mt-1 num flex items-center gap-1.5 min-w-0" style={{ color: 'var(--accent2)' }}>
                <IconHistory size={15} className="shrink-0" />
                <span className="truncate">Última vez: {lastSummary}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2 empty:hidden">
              {inProgress && !completed && <span className="pill num" style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)', color: 'var(--accent)' }}>Em andamento {st.doneSets}/{st.totalSets}</span>}
              {ex.unilateral && <span className="pill" style={{ background: 'color-mix(in srgb, var(--left) 18%, transparent)', color: 'var(--left)' }}>Começa pelo esquerdo</span>}
              {state?.phaseOffset ? <span className="pill" style={{ background: 'var(--warn)', color: 'var(--on-color)' }}>Fase {effPhase} neste exercício (voltou {-state.phaseOffset})</span> : null}
              {state?.flaggedSwap && <span className="pill" style={{ background: 'var(--danger)', color: 'var(--on-color)' }}>Trocar exercício</span>}
              {ex.maxLoadKg != null && <span className="pill card2 font-medium num">teto {ex.maxLoadKg} kg</span>}
            </div>
          </div>
          <span className="muted shrink-0 mt-0.5"><IconChevronDown size={22} className="chevron" /></span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {presc.note && <p className="text-[15px] mb-2" style={{ color: 'var(--warn)' }}>{presc.note}</p>}
          <ul className="list-disc pl-5 text-[15px] space-y-1">
            {ex.cues.map((c) => <li key={c}>{c}</li>)}
          </ul>
          {ex.cautions?.length ? (
            <ul className="mt-2 pl-5 list-disc text-[15px] space-y-1" style={{ color: 'var(--warn)' }}>
              {ex.cautions.map((c) => <li key={c}>{c}</li>)}
            </ul>
          ) : null}
          <VideoDemo exerciseId={ex.id} name={ex.name} />

          {hasGrid && (
            <SetGrid ex={ex} presc={presc} sets={sets} sides={sides} iso={iso} sessionId={session.id} rest={rest} previous={previous ?? null} />
          )}

          <div className="mt-4 flex flex-col gap-2">
            <div className="card2 rounded-xl flex items-center pl-3 pr-1 py-1 gap-1" role="group" aria-label="Teve sintoma?">
              <span className="text-[15px] font-medium flex-1">Teve sintoma?</span>
              <button onClick={() => setSymptom(false)} aria-pressed={!!exLog && !exLog.symptom} className="tap press px-5 rounded-lg font-semibold" style={{ background: exLog && !exLog.symptom ? 'var(--accent)' : 'var(--card3)', color: exLog && !exLog.symptom ? 'var(--on-color)' : 'var(--text)' }}>Não</button>
              <button onClick={() => setSymptom(true)} aria-pressed={!!exLog?.symptom} className="tap press px-5 rounded-lg font-semibold" style={{ background: exLog?.symptom ? 'var(--danger)' : 'var(--card3)', color: exLog?.symptom ? 'var(--on-color)' : 'var(--text)' }}>Sim</button>
            </div>
            <button onClick={() => markDone(!exLog?.done)} aria-pressed={!!exLog?.done} className="tap press w-full flex items-center justify-center gap-2 rounded-xl font-semibold" style={{ background: exLog?.done ? 'var(--accent)' : 'var(--card2)', color: exLog?.done ? 'var(--on-color)' : 'var(--text)' }}>
              {exLog?.done ? <><IconCheck size={20} strokeWidth={2.5} />Feito</> : 'Marcar feito'}
            </button>
          </div>
          {exLog?.symptom && <p className="text-sm mt-2" role="alert" style={{ color: 'var(--danger)' }}>Pare a série. Se voltar com menos carga, ok; se repetir, tire o exercício hoje.</p>}
        </div>
      )}
    </div>
  );
}

function SetGrid({ ex, presc, sets, sides, iso, sessionId, rest, previous }: {
  ex: Exercise; presc: Prescription; sets: SetLog[]; sides: SideKey[]; iso: string; sessionId: string; rest: Rest;
  previous: { date: string; sets: SetLog[] } | null;
}) {
  const [prev, setPrev] = useState<Record<SideKey, number | null>>({ L: null, R: null, both: null });
  const [state, setState] = useState<ExerciseState | null>(null);
  const [check, setCheck] = useState<IncreaseCheck | null>(null);
  const [clampMsg, setClampMsg] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => { void lastLoads(ex.id).then(setPrev); void getExerciseState(ex.id).then(setState); }, [ex.id]);

  const symptomToday = useLiveQuery(() => db.exerciseLogs.where('[exerciseId+date]').equals([ex.id, iso]).first().then((r) => !!r?.symptom), [ex.id, iso]) ?? false;
  const painMax = useLiveQuery(() => db.sessionLogs.where('[date+sessionId]').equals([iso, sessionId]).first().then((r) => r?.painMax ?? null), [iso, sessionId]) ?? null;

  useEffect(() => {
    if (!state) return;
    setCheck(checkIncrease(ex.id, presc, sets, symptomToday, painMax, state, iso));
  }, [sets, symptomToday, painMax, state, ex.id, presc, iso]);

  const range = presc.reps.match(/(\d+)(?:\s*[–-]\s*(\d+))?/);
  const topReps = range ? Number(range[2] ?? range[1]) : null;
  const step = ex.loadStepKg ?? 1;

  function get(side: SideKey, i: number) {
    return sets.find((s) => s.side === side && s.setIndex === i);
  }
  function prevOf(side: SideKey, i: number) {
    return previous?.sets.find((s) => s.side === side && s.setIndex === i) ?? null;
  }
  /** Carga-base para pré-preencher: hoje > mesma série da última vez > esquerdo (p/ direito) > última carga. */
  function baseLoad(side: SideKey, i: number) {
    const cur = get(side, i)?.loadKg;
    if (cur != null) return cur;
    const p = prevOf(side, i)?.loadKg;
    if (p != null) return p;
    if (side === 'R') return get('L', i)?.loadKg ?? prev.L;
    return prev[side];
  }

  const order = sides.flatMap((side) => Array.from({ length: presc.sets }, (_, i) => ({ side, i, key: `${side}${i}` })));
  const firstPending = order.find((o) => get(o.side, o.i)?.reps == null)?.key ?? null;
  const activeKey = focusKey ?? firstPending;

  async function save(side: SideKey, i: number, patch: Partial<SetLog>) {
    const cur = get(side, i);
    let loadKg = patch.loadKg !== undefined ? patch.loadKg : cur?.loadKg ?? null;
    // Regra: o direito nunca recebe mais carga que o esquerdo
    if (side === 'R' && loadKg != null) {
      const left = get('L', i)?.loadKg ?? prev.L;
      const c = clampRightToLeft(loadKg, left);
      if (c.clamped) {
        loadKg = c.kg;
        setClampMsg(`Direito limitado a ${c.kg} kg: o direito nunca recebe mais carga que o esquerdo.`);
        setTimeout(() => setClampMsg(null), 4000);
      }
    }
    const row: SetLog = {
      ...(cur ?? { date: iso, sessionId, exerciseId: ex.id, side, setIndex: i, loadKg: null, reps: null, rir: null, ts: Date.now() }),
      ...patch,
      loadKg,
      ts: Date.now(),
    };
    await db.setLogs.put(row);
  }

  async function completeSet(side: SideKey, i: number) {
    const cur = get(side, i);
    if (!cur || cur.reps == null) {
      // pré-preenche com o alvo: carga da última vez (ou do esquerdo), reps do topo e RIR alvo
      const rirM = presc.rir.match(/(\d+)/);
      const load = ex.loaded ? baseLoad(side, i) : null;
      await save(side, i, { reps: cur?.reps ?? topReps, rir: cur?.rir ?? (rirM ? Number(rirM[1]) : null), loadKg: load ?? null });
    }
    setFocusKey(null); // destaque passa para a próxima série pendente
    const idx = order.findIndex((o) => o.key === `${side}${i}`);
    const nextO = order.slice(idx + 1).find((o) => get(o.side, o.i)?.reps == null);
    const label = nextO ? `depois: série ${nextO.i + 1}${nextO.side !== 'both' ? ` · ${SIDE_LABEL[nextO.side].toLowerCase()}` : ''}` : 'depois: próximo exercício';
    if (presc.restSec > 0) rest.begin(presc.restSec, label);
  }

  async function bump(side: SideKey, i: number, field: 'loadKg' | 'reps', delta: number) {
    setFocusKey(`${side}${i}`);
    const cur = get(side, i);
    if (field === 'loadKg') {
      const base = baseLoad(side, i) ?? 0;
      await save(side, i, { loadKg: Math.max(0, Math.round((base + delta) * 10) / 10) });
    } else {
      const base = cur?.reps ?? prevOf(side, i)?.reps ?? topReps ?? 0;
      await save(side, i, { reps: Math.max(0, base + delta) });
    }
  }

  /** Enter/"próximo" do teclado pula para o campo seguinte. */
  function focusNextField(from: HTMLInputElement) {
    const inputs = Array.from(gridRef.current?.querySelectorAll('input') ?? []);
    const idx = inputs.indexOf(from);
    const next = inputs[idx + 1];
    if (next) next.focus();
    else from.blur();
  }

  const cols = `1.75rem ${ex.loaded ? '1fr ' : ''}1fr 1fr 3.25rem`;

  return (
    <div className="mt-3" ref={gridRef}>
      {previous && (
        <div className="text-sm muted mb-2 flex items-center gap-1.5 num">
          <IconHistory size={15} className="shrink-0" />
          Última vez em {previous.date.slice(8)}/{previous.date.slice(5, 7)}
        </div>
      )}
      {sides.map((side) => (
        <div key={side} className="mb-4">
          {side === sides[sides.length - 1] && (
            <div role="status" aria-live="polite">
              {clampMsg && <div className="text-sm font-medium p-3 rounded-xl mb-3" style={{ background: 'var(--warn)', color: 'var(--on-color)' }}>{clampMsg}</div>}
            </div>
          )}
          {side !== 'both' && (
            <div className="text-sm font-semibold mb-2 flex items-start gap-2" style={{ color: SIDE_COLOR[side] }}>
              <span className="inline-block size-2.5 rounded-full mt-1.5 shrink-0" style={{ background: SIDE_COLOR[side] }} aria-hidden="true" />
              <span>{SIDE_LABEL[side]}{side === 'L' ? ' — começa aqui' : ' — mesma carga e reps do esquerdo, nunca mais'}</span>
            </div>
          )}
          <div className="grid gap-x-1.5 gap-y-2 items-center" style={{ gridTemplateColumns: cols }}>
            <div className="text-sm muted text-center" aria-hidden="true">#</div>
            {ex.loaded && <div className="text-sm muted text-center" aria-hidden="true">kg</div>}
            <div className="text-sm muted text-center" aria-hidden="true">reps</div>
            <div className="text-sm muted text-center" aria-hidden="true">RIR</div>
            <div />
            {Array.from({ length: presc.sets }).map((_, i) => {
              const key = `${side}${i}`;
              const s = get(side, i);
              return (
                <SetRow
                  key={i}
                  i={i}
                  s={s}
                  last={prevOf(side, i)}
                  loaded={ex.loaded}
                  done={s?.reps != null}
                  active={activeKey === key}
                  step={step}
                  color={SIDE_COLOR[side]}
                  sideName={SIDE_LABEL[side]}
                  onFocus={() => setFocusKey(key)}
                  onEnter={focusNextField}
                  onChange={(p) => save(side, i, p)}
                  onDone={() => completeSet(side, i)}
                  onBump={(f, d) => bump(side, i, f, d)}
                />
              );
            })}
          </div>
        </div>
      ))}
      {!previous && prev[sides[0]] != null && <div className="text-sm muted num">Última carga: {sides.map((s) => `${SIDE_LABEL[s] || 'ambos'} ${prev[s] ?? '—'} kg`).join(' · ')}</div>}

      {check && ex.loaded && sets.some((s) => s.reps != null) && (
        <div className="mt-3 p-3 rounded-xl" style={{ background: check.eligible ? 'var(--accent)' : 'var(--card2)', color: check.eligible ? 'var(--on-color)' : 'var(--text)' }}>
          {check.eligible ? (
            <div>
              <div className="font-bold">Pode subir a carga na próxima sessão{check.suggestedKg != null ? `: ${check.currentKg} → ${check.suggestedKg} kg` : ''}.</div>
              <div className="text-sm">Volte para o começo da faixa de repetições.{ex.upperBody ? ' Membro superior: próximo aumento só daqui a 2 semanas.' : ''}</div>
              <button
                className="tap press mt-3 w-full rounded-xl font-semibold"
                style={{ background: 'var(--bg)', color: 'var(--accent)' }}
                onClick={async () => {
                  const st = await getExerciseState(ex.id);
                  await db.exerciseState.put({ ...st, lastIncreaseDate: iso, pendingIncrease: { date: iso, fromKg: check.currentKg ?? null, toKg: check.suggestedKg ?? null } });
                  setState(await getExerciseState(ex.id));
                }}
              >
                Registrar que vou subir
              </button>
            </div>
          ) : (
            <details>
              <summary className="tap -my-2 flex items-center justify-between gap-2 text-sm font-semibold">
                <span>Subir carga: {check.reasons.filter((r) => r.ok).length}/3 condições{check.blockedByUpperRule ? ' · bloqueado (2 semanas)' : ''}</span>
                <IconChevronDown size={20} className="chevron muted shrink-0" />
              </summary>
              <ul className="mt-2 text-sm space-y-1.5">
                {check.reasons.map((r) => (
                  <li key={r.text} className="flex items-start gap-2">
                    {r.ok ? <IconCheck size={18} className="shrink-0 mt-px" style={{ color: 'var(--accent)' }} /> : <IconCircle size={18} className="shrink-0 mt-px muted" />}
                    <span><span className="sr-only">{r.ok ? 'Cumprida: ' : 'Pendente: '}</span>{r.text}</span>
                  </li>
                ))}
                {check.blockedByUpperRule && <li style={{ color: 'var(--warn)' }}>{check.blockedByUpperRule}</li>}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function SetRow({ i, s, last, loaded, done, active, step, color, sideName, onFocus, onEnter, onChange, onDone, onBump }: {
  i: number; s: SetLog | undefined; last: SetLog | null; loaded: boolean; done: boolean; active: boolean; step: number; color: string; sideName: string;
  onFocus: () => void; onEnter: (el: HTMLInputElement) => void; onChange: (p: Partial<SetLog>) => void; onDone: () => void; onBump: (field: 'loadKg' | 'reps', delta: number) => void;
}) {
  const num = (v: string) => (v === '' ? null : Number(v.replace(',', '.')));
  const inp = 'tap field w-full min-w-0 text-center text-lg font-semibold px-1';
  const tint = done
    ? { background: `color-mix(in srgb, ${color} 10%, var(--card2))`, borderColor: `color-mix(in srgb, ${color} 40%, transparent)` }
    : active ? { borderColor: `color-mix(in srgb, ${color} 55%, var(--border))` } : undefined;
  const lbl = `Série ${i + 1}${sideName ? ` ${sideName.toLowerCase()}` : ''}`;
  const common = {
    onFocus,
    enterKeyHint: 'next' as const,
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); onEnter(e.currentTarget); } },
  };
  const lastText = last ? fmtSet(last, loaded, true) : '';
  return (
    <>
      <div className="flex items-center justify-center text-base font-semibold num" style={{ color: done || active ? color : 'var(--muted)' }}>{i + 1}</div>
      {loaded && <input {...common} className={inp} style={tint} aria-label={`${lbl}: carga em kg`} type="number" inputMode="decimal" step="0.5" placeholder={last?.loadKg != null ? fmtKg(last.loadKg) : 'kg'} value={s?.loadKg ?? ''} onChange={(e) => onChange({ loadKg: num(e.target.value) })} />}
      <input {...common} className={inp} style={tint} aria-label={`${lbl}: repetições`} type="number" inputMode="numeric" placeholder={last?.reps != null ? String(last.reps) : 'reps'} value={s?.reps ?? ''} onChange={(e) => onChange({ reps: num(e.target.value) })} />
      <input {...common} className={inp} style={tint} aria-label={`${lbl}: RIR`} type="number" inputMode="numeric" placeholder={last?.rir != null ? String(last.rir) : 'RIR'} value={s?.rir ?? ''} onChange={(e) => onChange({ rir: num(e.target.value) })} />
      <button
        onClick={onDone}
        aria-label={done ? `Série ${i + 1} concluída; iniciar descanso` : `Concluir série ${i + 1}`}
        className="tap press flex items-center justify-center rounded-xl"
        style={{ background: done ? color : active ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 16%, var(--card2))', color: done || active ? 'var(--on-color)' : 'var(--accent)' }}
      >
        {done ? <IconCheck size={22} strokeWidth={3} /> : active ? <IconCheck size={22} strokeWidth={2.5} /> : <IconPlay size={20} />}
      </button>
      {lastText && (
        <div className="text-sm muted num -mt-1 flex items-center gap-1" style={{ gridColumn: '2 / -1' }}>
          <span className="sr-only">{lbl}, </span>última: {lastText}
        </div>
      )}
      {active && (
        <div className="grid gap-1.5 -mt-0.5 mb-1" style={{ gridColumn: '1 / -1', gridTemplateColumns: loaded ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))' }} role="group" aria-label={`Ajuste rápido da ${lbl.toLowerCase()}`}>
          {loaded && <StepBtn onClick={() => onBump('loadKg', -step)} label={`${fmtKg(step)} kg`} minus aria={`Menos ${fmtKg(step)} kg`} />}
          {loaded && <StepBtn onClick={() => onBump('loadKg', step)} label={`${fmtKg(step)} kg`} aria={`Mais ${fmtKg(step)} kg`} />}
          <StepBtn onClick={() => onBump('reps', -1)} label="1 rep" minus aria="Menos 1 repetição" />
          <StepBtn onClick={() => onBump('reps', 1)} label="1 rep" aria="Mais 1 repetição" />
        </div>
      )}
    </>
  );
}

function StepBtn({ onClick, label, minus, aria }: { onClick: () => void; label: string; minus?: boolean; aria: string }) {
  return (
    <button onClick={onClick} aria-label={aria} className="tap press flex items-center justify-center gap-0.5 rounded-xl card2 font-semibold num text-[15px] px-1" style={{ minHeight: 48 }}>
      {minus ? <IconMinus size={16} /> : <IconPlus size={16} />}{label}
    </button>
  );
}

// ---------------- Encerrar sessão ----------------

function FinishSheet({ open, onClose, session, iso, week, phase }: { open: boolean; onClose: () => void; session: Session; iso: string; week: number; phase: PhaseId }) {
  const [pain, setPain] = useState<number | null>(null);
  const [result, setResult] = useState<{ msgs: string[]; records: string[] } | null>(null);
  const existing = useLiveQuery(() => db.sessionLogs.where('[date+sessionId]').equals([iso, session.id]).first(), [iso, session.id]);
  const prog = useSessionProgress(session, phase, week, iso);
  useEffect(() => { if (existing?.painMax != null) setPain(existing.painMax); }, [existing]);

  async function finish() {
    const logs = await db.exerciseLogs.where('[date+sessionId]').equals([iso, session.id]).toArray();
    const symptomAny = logs.some((l) => l.symptom);
    await db.sessionLogs.put({
      ...(existing ?? { date: iso, sessionId: session.id, ts: Date.now() }),
      week, phase, painMax: pain, symptomAny, completed: true, ts: Date.now(),
    });
    // marca como feito todo exercício com série registrada
    const todaySets = await db.setLogs.where('[date+sessionId]').equals([iso, session.id]).toArray();
    const setIds = new Set(todaySets.map((s) => s.exerciseId));
    for (const id of setIds) {
      const row = logs.find((l) => l.exerciseId === id);
      if (!row) await db.exerciseLogs.add({ date: iso, sessionId: session.id, exerciseId: id, symptom: false, done: true, ts: Date.now() });
      else if (!row.done) await db.exerciseLogs.put({ ...row, done: true });
    }
    const msgs: string[] = [];
    const fresh = await db.exerciseLogs.where('[date+sessionId]').equals([iso, session.id]).toArray();
    for (const l of fresh) {
      if (l.symptom) {
        const regressed = await applySymptomRegress(l.exerciseId, iso);
        const ex = getExercise(l.exerciseId);
        if (regressed) msgs.push(`${ex.name}: sintoma em ${plan.progression.symptomRegress.consecutiveSessions} treinos seguidos. Este exercício voltou uma fase. Se repetir, troque o exercício.`);
        else msgs.push(`${ex.name}: sintoma registrado hoje. Se acontecer de novo no próximo treino, ele volta uma fase.`);
      }
    }
    if (pain != null && pain > 3) msgs.push(`Dor ${pain}/10 no ombro: acima do aceitável (3/10). Nenhum aumento de carga vai ser sugerido para esta sessão. Se não voltar ao normal em 24 h, fale com a fisioterapia.`);
    if (!msgs.length) msgs.push('Sessão salva. Sem sintomas. As sugestões de aumento aparecem dentro de cada exercício.');

    // Recordes de carga: maior carga de hoje acima de qualquer sessão anterior
    const records: string[] = [];
    for (const id of setIds) {
      const ex = getExercise(id);
      if (!ex.loaded) continue;
      const todayMax = Math.max(...todaySets.filter((s) => s.exerciseId === id && s.reps != null && s.loadKg != null).map((s) => s.loadKg as number), -Infinity);
      if (!Number.isFinite(todayMax)) continue;
      const before = (await db.setLogs.where('exerciseId').equals(id).toArray()).filter((s) => s.date < iso && s.loadKg != null);
      if (!before.length) continue;
      const prevMax = Math.max(...before.map((s) => s.loadKg as number));
      if (todayMax > prevMax) records.push(`${ex.name}: ${fmtKg(todayMax)} kg (antes ${fmtKg(prevMax)} kg)`);
    }
    setResult({ msgs, records });
  }

  const duration = prog.startTs && prog.endTs ? fmtDuration(prog.endTs - prog.startTs) : '—';
  const summary = (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <SumStat v={`${prog.doneCount}/${prog.total}`} l="exercícios feitos" />
      <SumStat v={String(prog.setCount)} l="séries" />
      <SumStat v={prog.volume ? `${fmtKg(prog.volume)} kg` : '—'} l="volume (kg × reps)" />
      <SumStat v={duration} l="duração" />
    </div>
  );

  return (
    <Sheet open={open} onClose={() => { onClose(); setResult(null); }} title="Encerrar sessão">
      {!result ? (
        <div>
          {summary}
          <div id="pain-label" className="font-semibold mb-1">Dor máxima no ombro hoje (0–10)</div>
          <p className="text-sm muted mb-3">Até 3/10 e voltando ao normal em 24 h é aceitável.</p>
          <div className="grid grid-cols-6 gap-2" role="group" aria-labelledby="pain-label">
            {Array.from({ length: 11 }).map((_, n) => (
              <button
                key={n}
                onClick={() => setPain(n)}
                aria-pressed={pain === n}
                className="tap press rounded-xl font-bold text-lg num"
                style={{
                  background: pain === n ? (n <= 3 ? 'var(--accent)' : 'var(--danger)') : 'var(--card2)',
                  color: pain === n ? 'var(--on-color)' : n > 3 ? 'color-mix(in srgb, var(--danger) 70%, var(--text))' : 'var(--text)',
                }}
              >{n}</button>
            ))}
          </div>
          <button onClick={finish} className="tap press mt-5 w-full rounded-2xl py-4 text-lg font-bold" style={{ background: 'var(--accent)', color: 'var(--on-color)' }}>Salvar e aplicar regras</button>
        </div>
      ) : (
        <div>
          {summary}
          {result.records.length > 0 && (
            <div className="card2 p-3 mb-2" style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent)' }}>
              <div className="font-bold flex items-center gap-2" style={{ color: 'var(--accent)' }}><IconTrophy size={18} />Recorde de carga</div>
              <ul className="mt-1.5 text-[15px] space-y-1 num">{result.records.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
          )}
          <ul className="space-y-2" role="status">
            {result.msgs.map((m) => <li key={m} className="card2 p-3 text-[15px]">{m}</li>)}
          </ul>
          <button onClick={() => { onClose(); setResult(null); }} className="tap press mt-4 w-full rounded-2xl py-3 font-bold card2">Fechar</button>
        </div>
      )}
    </Sheet>
  );
}

function SumStat({ v, l }: { v: string; l: string }) {
  return (
    <div className="card2 px-3 py-2.5">
      <div className="text-xl font-bold num leading-tight">{v}</div>
      <div className="text-sm muted leading-snug">{l}</div>
    </div>
  );
}

function fmtRest(s: number) {
  return s >= 60 && s % 60 === 0 ? `${s / 60} min` : `${s} s`;
}
