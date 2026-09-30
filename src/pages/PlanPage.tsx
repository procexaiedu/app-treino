import { useState } from 'react';
import { plan } from '../data/plan';
import { VideoDemo } from '../components/VideoDemo';
import { getExercise, phaseForWeek, weekNumber } from '../lib/phase';
import { TabChips } from '../components/TabChips';
import { IconChevronDown } from '../components/icons';

const TABS = ['Fases', 'Exercícios'] as const;

export function PlanPage({ startDate }: { startDate: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Fases');
  const week = weekNumber(startDate);
  const curPhase = phaseForWeek(week);
  const total = plan.meta.weeks;
  return (
    <div className="pb-40">
      <header className="px-4 pt-4 pb-3">
        <h1 className="text-[28px] leading-tight font-bold">Plano</h1>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }} role="progressbar" aria-label="Semanas do plano" aria-valuemin={1} aria-valuemax={total} aria-valuenow={Math.min(week, total)}>
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className="h-1.5 rounded-full" style={{ background: i + 1 < week ? 'color-mix(in srgb, var(--accent) 55%, var(--card2))' : i + 1 === week ? 'var(--accent)' : 'var(--card2)' }} />
            ))}
          </div>
          <span className="text-sm muted num shrink-0">semana {Math.min(week, total)}/{total}</span>
        </div>
      </header>
      <TabChips tabs={TABS} value={tab} onChange={setTab} label="Seções do plano" />
      <div className="px-4 flex flex-col gap-3 mt-2">
        {tab === 'Fases' && (
          <>
            {plan.phases.map((p) => (
              <section key={p.id} className="card p-4" style={p.id === curPhase ? { boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--accent) 60%, transparent)' } : p.id < curPhase ? { opacity: 0.75 } : undefined}>
                {p.id === curPhase && <span className="pill mb-2" style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)', color: 'var(--accent)' }}>Você está aqui</span>}
                <h2 className="font-bold text-lg leading-snug">Fase {p.id}: {p.name} <span className="muted text-sm font-normal num whitespace-nowrap">· semanas {p.weeks[0]}{p.weeks[1] !== p.weeks[0] ? `–${p.weeks[1]}` : ''}</span></h2>
                <dl className="text-[15px] mt-3 grid grid-cols-[5.5rem_1fr] gap-x-2 gap-y-2">
                  <dt className="muted">Séries</dt><dd>{p.setsRule}</dd>
                  <dt className="muted">RIR</dt><dd>{p.rirRule}</dd>
                  <dt className="muted">Objetivo</dt><dd>{p.goal}</dd>
                  {p.entryRule && <><dt className="muted">Entrada</dt><dd>{p.entryRule}</dd></>}
                </dl>
              </section>
            ))}
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-2">Semana</h2>
              <table className="w-full text-[15px]">
                <tbody>
                  {plan.sessions.map((s) => (
                    <tr key={s.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-2 font-semibold w-8">{s.id}</td>
                      <td className="py-2">{s.subtitle}</td>
                      <td className="py-2 muted text-right whitespace-nowrap num">{s.cardio[1].minutes} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-2">Cardio</h2>
              <div className="text-[15px]"><span className="muted">Tipos: </span>{plan.cardioGuide.types.join('; ')}</div>
              <div className="text-[15px] mt-1"><span className="muted">Evitar por enquanto: </span>{plan.cardioGuide.avoid.join('; ')}</div>
              <div className="text-[15px] mt-1"><span className="muted">Dose semanal: </span>{plan.cardioGuide.weeklyMinutes}</div>
              <ul className="list-disc pl-5 text-[15px] mt-1">{plan.cardioGuide.offGym.map((o) => <li key={o}>{o}</li>)}</ul>
            </section>
          </>
        )}
        {tab === 'Exercícios' && <ExerciseLibrary />}
      </div>
    </div>
  );
}

function ExerciseLibrary() {
  const [openId, setOpenId] = useState<string | null>(null);
  const groups: Record<string, string[]> = { Aquecimento: [], Reabilitação: [], 'Treino principal': [], Cardio: [], Alongamentos: [] };
  const map: Record<string, string> = { warmup: 'Aquecimento', rehab: 'Reabilitação', main: 'Treino principal', cardio: 'Cardio', stretch: 'Alongamentos' };
  for (const ex of Object.values(plan.exercises)) groups[map[ex.kind]].push(ex.id);
  return (
    <>
      {Object.entries(groups).map(([g, ids]) => (
        <section key={g} className="mt-2 first:mt-0">
          <h2 className="font-bold text-lg px-1 mb-2">{g} <span className="muted text-sm font-normal">({ids.length})</span></h2>
          <div className="flex flex-col gap-2">
            {ids.map((id) => {
              const ex = getExercise(id);
              const open = openId === id;
              return (
                <div key={id} className="card">
                  <button className="tap w-full text-left flex justify-between items-center gap-3 px-4 py-3 rounded-2xl active:bg-[var(--card2)] transition-colors" onClick={() => setOpenId(open ? null : id)} aria-expanded={open}>
                    <span className="font-semibold">{ex.name}</span>
                    <IconChevronDown size={22} className="chevron muted shrink-0" />
                  </button>
                  {open && (
                    <div className="px-4 pb-4">
                      <div className="text-sm muted">{ex.equipment.join(', ')}{ex.unilateral ? ' · unilateral (começa pelo esquerdo)' : ''}</div>
                      <ul className="list-disc pl-5 text-[15px] mt-1 space-y-1">{ex.cues.map((c) => <li key={c}>{c}</li>)}</ul>
                      {ex.cautions?.length ? <ul className="list-disc pl-5 text-[15px] mt-1 space-y-1" style={{ color: 'var(--warn)' }}>{ex.cautions.map((c) => <li key={c}>{c}</li>)}</ul> : null}
                      <table className="w-full text-sm mt-3">
                        <thead><tr className="muted text-left"><th scope="col" className="font-medium pb-1">Fase</th><th scope="col" className="font-medium pb-1">Séries</th><th scope="col" className="font-medium pb-1">Reps</th><th scope="col" className="font-medium pb-1">Desc.</th><th scope="col" className="font-medium pb-1">RIR</th></tr></thead>
                        <tbody>
                          {([1, 2, 3, 4] as const).map((p) => { const pr = ex.prescription[p]; return <tr key={p} className="border-t" style={{ borderColor: 'var(--border)' }}><td className="py-1.5 font-semibold">{p}</td><td>{pr.sets}</td><td>{pr.reps}</td><td>{pr.restSec ? `${pr.restSec} s` : '—'}</td><td>{pr.rir}</td></tr>; })}
                        </tbody>
                      </table>
                      <VideoDemo exerciseId={id} name={ex.name} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
