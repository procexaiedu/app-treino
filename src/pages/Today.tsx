import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { plan } from '../data/plan';
import type { Exercise, PhaseId, Prescription, Session, SessionBlock } from '../data/types';
import { db, getExerciseState, type ExerciseState, type SetLog } from '../lib/db';
import { clampPhase, effectivePrescription, getExercise, phaseForWeek, sessionForDate, todayISO, weekNumber, WEEKDAY_PT } from '../lib/phase';
import { applySymptomRegress, checkIncrease, clampRightToLeft, lastLoads, type IncreaseCheck } from '../lib/rules';
import { useRestTimer } from '../lib/timer';
import { RestTimerBar } from '../components/RestTimer';
import { VideoDemo } from '../components/VideoDemo';
import { Sheet } from '../components/Sheet';


const KIND_SHORT: Record<string, string> = { warmup: 'Aquec.', rehab: 'Reab.', main: 'Principal', cardio: 'Cardio', stretch: 'Along.' };

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

  const sessionLog = useLiveQuery(() => (session ? db.sessionLogs.where('[date+sessionId]').equals([iso, session.id]).first() : undefined), [iso, session?.id]);
  const [finishOpen, setFinishOpen] = useState(false);

  const phaseInfo = plan.phases.find((p) => p.id === phase)!;

  return (
    <div className="pb-40">
      <header className="px-4 pt-3 pb-2">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold">Hoje · {WEEKDAY_PT[date.getDay()]}</h1>
          <span className="text-sm muted">{iso.slice(8)}/{iso.slice(5, 7)}</span>
        </div>
        <div className="text-sm muted mt-0.5">
          Semana {week} de {plan.meta.weeks} · Fase {phase}: {phaseInfo.name} · RIR {phaseInfo.rirRule}
        </div>
        {week > plan.meta.weeks && <div className="mt-1 text-sm" style={{ color: 'var(--warn)' }}>O plano de 12 semanas acabou. Semana 12 vale como padrão até você reavaliar.</div>}
      </header>

      <div className="px-4 flex gap-2 overflow-x-auto pb-2">
        {plan.sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => setSessionId(s.id)}
            className="tap px-3 rounded-xl font-semibold whitespace-nowrap shrink-0"
            style={{ background: session?.id === s.id ? 'var(--accent)' : 'var(--card)', color: session?.id === s.id ? '#000' : 'var(--text)' }}
          >
            {s.id} <span className="text-xs font-normal">{WEEKDAY_PT[s.weekday].slice(0, 3)}</span>
          </button>
        ))}
        {dateOverride === null ? (
          <button className="tap px-3 rounded-xl card text-sm muted whitespace-nowrap shrink-0" onClick={() => setDateOverride(new Date())}>Outra data</button>
        ) : (
          <input type="date" className="tap px-3 rounded-xl card text-sm" value={iso} onChange={(e) => e.target.value && setDateOverride(new Date(e.target.value + 'T12:00:00'))} />
        )}
      </div>

      {!session ? (
        <div className="px-4 mt-4 card p-4">
          <div className="text-lg font-semibold">Fim de semana: sem treino.</div>
          <p className="muted mt-1">Meta do dia: caminhada de 30–40 min, primeira refeição com 40–50 g de proteína e água. Escolha um treino acima se quiser adiantar.</p>
        </div>
      ) : (
        <SessionView key={`${session.id}-${iso}`} session={session} phase={phase} week={week} iso={iso} timer={timer} sessionLog={sessionLog ?? null} onFinish={() => setFinishOpen(true)} />
      )}

      <RestTimerBar t={timer} />
      {session && <FinishSheet open={finishOpen} onClose={() => setFinishOpen(false)} session={session} iso={iso} week={week} phase={phase} />}
    </div>
  );
}

function SessionView({ session, phase, week, iso, timer, sessionLog, onFinish }: {
  session: Session; phase: PhaseId; week: number; iso: string; timer: ReturnType<typeof useRestTimer>;
  sessionLog: { completed: boolean } | null; onFinish: () => void;
}) {
  const cardio = session.cardio[phase];
  return (
    <div className="px-4 mt-2 flex flex-col gap-4">
      <div className="card p-4">
        <div className="text-xl font-bold">{session.title}</div>
        <div className="muted">{session.subtitle}</div>
        <ol className="mt-3 text-sm grid grid-cols-5 gap-1 text-center">
          {session.blocks.filter((b, i, arr) => arr.findIndex((x) => x.kind === b.kind) === i).map((b) => (
            <li key={b.kind} className="card2 py-2 px-1 rounded-lg">
              <div className="font-semibold text-[13px] leading-tight">{KIND_SHORT[b.kind]}</div>
              {b.minutes ? <div className="muted text-xs">{b.minutes} min</div> : b.kind === 'cardio' ? <div className="muted text-xs">{cardio.minutes} min</div> : null}
            </li>
          ))}
        </ol>
        {sessionLog?.completed && <div className="mt-3 text-sm font-semibold" style={{ color: 'var(--accent)' }}>✓ Sessão encerrada hoje</div>}
      </div>

      {session.blocks.map((block, bi) => (
        <BlockView key={bi} block={block} session={session} phase={phase} week={week} iso={iso} timer={timer} />
      ))}

      <button onClick={onFinish} className="tap w-full rounded-2xl py-4 text-lg font-bold text-black" style={{ background: 'var(--accent)' }}>
        Encerrar sessão e aplicar regras
      </button>
    </div>
  );
}

function BlockView({ block, session, phase, week, iso, timer }: { block: SessionBlock; session: Session; phase: PhaseId; week: number; iso: string; timer: ReturnType<typeof useRestTimer> }) {
  const cardio = session.cardio[phase];
  return (
    <section>
      <div className="flex items-baseline justify-between px-1 mb-2">
        <h2 className="text-lg font-bold">{block.title}</h2>
        {block.minutes ? <span className="muted text-sm">~{block.minutes} min</span> : null}
      </div>
      {block.kind === 'cardio' && (
        <div className="card p-3 mb-2">
          <div className="font-semibold">{cardio.type} · {cardio.minutes} min</div>
          <p className="text-[15px] mt-1">{cardio.detail}</p>
        </div>
      )}
      {block.note && block.kind !== 'cardio' && <p className="muted text-sm px-1 mb-2">{block.note}</p>}
      <div className="flex flex-col gap-2">
        {block.items.map((id) => {
          const ex = getExercise(id);
          return <ExerciseCard key={`${block.title}-${id}`} ex={ex} block={block} session={session} phase={phase} week={week} iso={iso} timer={timer} />;
        })}
      </div>
    </section>
  );
}

function ExerciseCard({ ex, block, session, phase, week, iso, timer }: { ex: Exercise; block: SessionBlock; session: Session; phase: PhaseId; week: number; iso: string; timer: ReturnType<typeof useRestTimer> }) {
  const [open, setOpen] = useState(false);
  const state = useLiveQuery(() => db.exerciseState.get(ex.id), [ex.id]);
  const effPhase = clampPhase(phase + (state?.phaseOffset ?? 0));
  const presc = effectivePrescription(ex, block, effPhase, week);
  const hidden = presc.sets === 0 || (ex.fromPhase && effPhase < ex.fromPhase);

  const exLog = useLiveQuery(() => db.exerciseLogs.where('[exerciseId+date]').equals([ex.id, iso]).first(), [ex.id, iso]);
  const sets = useLiveQuery(() => db.setLogs.where('[exerciseId+date]').equals([ex.id, iso]).sortBy('setIndex'), [ex.id, iso]) ?? [];
  const doneSets = useMemo(() => new Set(sets.filter((s) => s.reps != null || (!ex.loaded && s.side)).map((s) => `${s.side}${s.setIndex}`)), [sets, ex.loaded]);

  const sides: Array<'L' | 'R' | 'both'> = ex.unilateral ? ['L', 'R'] : ['both'];
  const totalSets = presc.sets * sides.length;
  const completed = doneSets.size >= totalSets && totalSets > 0;

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
      <div className="card p-3 opacity-60">
        <div className="font-semibold">{ex.name}</div>
        <div className="text-sm muted">{presc.note ?? `Só a partir da Fase ${ex.fromPhase}`}</div>
      </div>
    );
  }

  return (
    <div className="card p-3" style={completed || exLog?.done ? { borderLeft: '4px solid var(--accent)' } : undefined}>
      <button className="w-full text-left" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-[17px] leading-tight">{ex.name}</div>
            <div className="text-sm muted mt-0.5">
              {presc.sets > 1 ? `${presc.sets} × ${presc.reps}` : presc.reps}
              {presc.restSec ? ` · desc. ${fmtRest(presc.restSec)}` : ''}
              {presc.rir !== '—' ? ` · RIR ${presc.rir}` : ''}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {ex.unilateral && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--left)', color: '#000' }}>Começa pelo esquerdo</span>}
              {state?.phaseOffset ? <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--warn)', color: '#000' }}>Fase {effPhase} neste exercício (voltou {-state.phaseOffset})</span> : null}
              {state?.flaggedSwap && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--danger)', color: '#000' }}>Trocar exercício</span>}
              {ex.maxLoadKg != null && <span className="text-xs px-2 py-0.5 rounded-full card2">teto {ex.maxLoadKg} kg</span>}
            </div>
          </div>
          <span className="muted text-xl leading-none">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="mt-3">
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

          {presc.sets > 0 && (ex.kind === 'main' || ex.kind === 'rehab') && (
            <SetGrid ex={ex} presc={presc} sets={sets} sides={sides} iso={iso} sessionId={session.id} timer={timer} />
          )}

          <div className="mt-3 flex gap-2">
            <button onClick={() => markDone(!exLog?.done)} className="tap flex-1 rounded-xl font-semibold" style={{ background: exLog?.done ? 'var(--accent)' : 'var(--card2)', color: exLog?.done ? '#000' : 'var(--text)' }}>
              {exLog?.done ? '✓ Feito' : 'Marcar feito'}
            </button>
            <div className="flex-1 card2 rounded-xl flex items-center px-2 gap-2">
              <span className="text-sm flex-1">Teve sintoma?</span>
              <button onClick={() => setSymptom(false)} className="tap px-3 rounded-lg text-sm font-semibold" style={{ background: exLog && !exLog.symptom ? 'var(--accent)' : 'transparent', color: exLog && !exLog.symptom ? '#000' : 'var(--text)' }}>Não</button>
              <button onClick={() => setSymptom(true)} className="tap px-3 rounded-lg text-sm font-semibold" style={{ background: exLog?.symptom ? 'var(--danger)' : 'transparent', color: exLog?.symptom ? '#000' : 'var(--text)' }}>Sim</button>
            </div>
          </div>
          {exLog?.symptom && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>Pare a série. Se voltar com menos carga, ok; se repetir, tire o exercício hoje.</p>}
        </div>
      )}
    </div>
  );
}

function SetGrid({ ex, presc, sets, sides, iso, sessionId, timer }: { ex: Exercise; presc: Prescription; sets: SetLog[]; sides: Array<'L' | 'R' | 'both'>; iso: string; sessionId: string; timer: ReturnType<typeof useRestTimer> }) {
  const [prev, setPrev] = useState<Record<'L' | 'R' | 'both', number | null>>({ L: null, R: null, both: null });
  const [state, setState] = useState<ExerciseState | null>(null);
  const [check, setCheck] = useState<IncreaseCheck | null>(null);
  const [clampMsg, setClampMsg] = useState<string | null>(null);
  useEffect(() => { void lastLoads(ex.id).then(setPrev); void getExerciseState(ex.id).then(setState); }, [ex.id]);

  const symptomToday = useLiveQuery(() => db.exerciseLogs.where('[exerciseId+date]').equals([ex.id, iso]).first().then((r) => !!r?.symptom), [ex.id, iso]) ?? false;
  const painMax = useLiveQuery(() => db.sessionLogs.where('[date+sessionId]').equals([iso, sessionId]).first().then((r) => r?.painMax ?? null), [iso, sessionId]) ?? null;

  useEffect(() => {
    if (!state) return;
    setCheck(checkIncrease(ex.id, presc, sets, symptomToday, painMax, state, iso));
  }, [sets, symptomToday, painMax, state, ex.id, presc, iso]);

  function get(side: 'L' | 'R' | 'both', i: number) {
    return sets.find((s) => s.side === side && s.setIndex === i);
  }

  async function save(side: 'L' | 'R' | 'both', i: number, patch: Partial<SetLog>) {
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

  async function completeSet(side: 'L' | 'R' | 'both', i: number) {
    const cur = get(side, i);
    if (!cur || cur.reps == null) {
      // pré-preenche com o alvo: carga anterior (ou do esquerdo), reps do topo e RIR alvo
      const range = presc.reps.match(/(\d+)(?:\s*[–-]\s*(\d+))?/);
      const reps = range ? Number(range[2] ?? range[1]) : null;
      const rirM = presc.rir.match(/(\d+)/);
      let load = cur?.loadKg ?? (side === 'R' ? get('L', i)?.loadKg ?? prev.L : prev[side]);
      if (!ex.loaded) load = null;
      await save(side, i, { reps, rir: rirM ? Number(rirM[1]) : null, loadKg: load ?? null });
    }
    if (presc.restSec > 0) timer.start(presc.restSec);
  }

  const sideLabel = { L: 'Esquerdo', R: 'Direito', both: '' };
  const sideColor = { L: 'var(--left)', R: 'var(--right)', both: 'var(--accent)' };

  return (
    <div className="mt-3">
      {clampMsg && <div className="text-sm p-2 rounded-lg mb-2" style={{ background: 'var(--warn)', color: '#000' }}>{clampMsg}</div>}
      {sides.map((side) => (
        <div key={side} className="mb-3">
          {side !== 'both' && <div className="text-sm font-semibold mb-1" style={{ color: sideColor[side] }}>{sideLabel[side]}{side === 'L' ? ' — começa aqui' : ' — mesma carga e reps do esquerdo, nunca mais'}</div>}
          <div className="grid gap-1" style={{ gridTemplateColumns: `2rem ${ex.loaded ? '1fr ' : ''}1fr 1fr 3.2rem` }}>
            <div className="text-xs muted">#</div>
            {ex.loaded && <div className="text-xs muted">kg</div>}
            <div className="text-xs muted">reps</div>
            <div className="text-xs muted">RIR</div>
            <div />
            {Array.from({ length: presc.sets }).map((_, i) => {
              const s = get(side, i);
              const done = s?.reps != null;
              return (
                <SetRow key={i} i={i} s={s} loaded={ex.loaded} done={done} color={sideColor[side]} onChange={(p) => save(side, i, p)} onDone={() => completeSet(side, i)} />
              );
            })}
          </div>
        </div>
      ))}
      {prev[sides[0]] != null && <div className="text-xs muted">Última carga: {sides.map((s) => `${sideLabel[s] || 'ambos'} ${prev[s] ?? '—'} kg`).join(' · ')}</div>}

      {check && ex.loaded && sets.some((s) => s.reps != null) && (
        <div className="mt-2 p-3 rounded-xl" style={{ background: check.eligible ? 'var(--accent)' : 'var(--card2)', color: check.eligible ? '#000' : 'var(--text)' }}>
          {check.eligible ? (
            <div>
              <div className="font-bold">Pode subir a carga na próxima sessão{check.suggestedKg != null ? `: ${check.currentKg} → ${check.suggestedKg} kg` : ''}.</div>
              <div className="text-sm">Volte para o começo da faixa de repetições.{ex.upperBody ? ' Membro superior: próximo aumento só daqui a 2 semanas.' : ''}</div>
              <button
                className="tap mt-2 w-full rounded-lg font-semibold"
                style={{ background: '#000', color: 'var(--accent)' }}
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
              <summary className="text-sm font-semibold">Subir carga: {check.reasons.filter((r) => r.ok).length}/3 condições{check.blockedByUpperRule ? ' · bloqueado (2 semanas)' : ''}</summary>
              <ul className="mt-1 text-sm space-y-1">
                {check.reasons.map((r) => <li key={r.text}>{r.ok ? '✓' : '○'} {r.text}</li>)}
                {check.blockedByUpperRule && <li style={{ color: 'var(--warn)' }}>{check.blockedByUpperRule}</li>}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function SetRow({ i, s, loaded, done, color, onChange, onDone }: { i: number; s: SetLog | undefined; loaded: boolean; done: boolean; color: string; onChange: (p: Partial<SetLog>) => void; onDone: () => void }) {
  const num = (v: string) => (v === '' ? null : Number(v.replace(',', '.')));
  const inp = 'tap w-full rounded-lg card2 text-center text-lg px-1';
  return (
    <>
      <div className="flex items-center justify-center text-sm muted">{i + 1}</div>
      {loaded && <input className={inp} type="number" inputMode="decimal" step="0.5" placeholder="kg" value={s?.loadKg ?? ''} onChange={(e) => onChange({ loadKg: num(e.target.value) })} />}
      <input className={inp} type="number" inputMode="numeric" placeholder="reps" value={s?.reps ?? ''} onChange={(e) => onChange({ reps: num(e.target.value) })} />
      <input className={inp} type="number" inputMode="numeric" placeholder="RIR" value={s?.rir ?? ''} onChange={(e) => onChange({ rir: num(e.target.value) })} />
      <button onClick={onDone} aria-label={`Concluir série ${i + 1}`} className="tap rounded-lg font-bold text-black" style={{ background: done ? color : 'var(--card2)', color: done ? '#000' : 'var(--text)' }}>
        {done ? '✓' : '▶'}
      </button>
    </>
  );
}

function FinishSheet({ open, onClose, session, iso, week, phase }: { open: boolean; onClose: () => void; session: Session; iso: string; week: number; phase: PhaseId }) {
  const [pain, setPain] = useState<number | null>(null);
  const [result, setResult] = useState<string[] | null>(null);
  const existing = useLiveQuery(() => db.sessionLogs.where('[date+sessionId]').equals([iso, session.id]).first(), [iso, session.id]);
  useEffect(() => { if (existing?.painMax != null) setPain(existing.painMax); }, [existing]);

  async function finish() {
    const logs = await db.exerciseLogs.where('[date+sessionId]').equals([iso, session.id]).toArray();
    const symptomAny = logs.some((l) => l.symptom);
    await db.sessionLogs.put({
      ...(existing ?? { date: iso, sessionId: session.id, ts: Date.now() }),
      week, phase, painMax: pain, symptomAny, completed: true, ts: Date.now(),
    });
    // marca como feito todo exercício com série registrada
    const setIds = new Set((await db.setLogs.where('[date+sessionId]').equals([iso, session.id]).toArray()).map((s) => s.exerciseId));
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
    setResult(msgs);
  }

  return (
    <Sheet open={open} onClose={() => { onClose(); setResult(null); }} title="Encerrar sessão">
      {!result ? (
        <div>
          <div className="font-semibold mb-1">Dor máxima no ombro hoje (0–10)</div>
          <p className="text-sm muted mb-2">Até 3/10 e voltando ao normal em 24 h é aceitável.</p>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 11 }).map((_, n) => (
              <button key={n} onClick={() => setPain(n)} className="tap rounded-xl font-bold text-lg" style={{ background: pain === n ? (n <= 3 ? 'var(--accent)' : 'var(--danger)') : 'var(--card2)', color: pain === n ? '#000' : 'var(--text)' }}>{n}</button>
            ))}
          </div>
          <button onClick={finish} className="tap mt-4 w-full rounded-2xl py-4 text-lg font-bold text-black" style={{ background: 'var(--accent)' }}>Salvar e aplicar regras</button>
        </div>
      ) : (
        <div>
          <ul className="space-y-2">
            {result.map((m) => <li key={m} className="card2 p-3 text-[15px]">{m}</li>)}
          </ul>
          <button onClick={() => { onClose(); setResult(null); }} className="tap mt-4 w-full rounded-2xl py-3 font-bold card2">Fechar</button>
        </div>
      )}
    </Sheet>
  );
}

function fmtRest(s: number) {
  return s >= 60 && s % 60 === 0 ? `${s / 60} min` : `${s} s`;
}
