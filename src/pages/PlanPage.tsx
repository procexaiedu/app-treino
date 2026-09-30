import { useState } from 'react';
import { plan } from '../data/plan';
import { VideoDemo } from '../components/VideoDemo';
import { getExercise } from '../lib/phase';

const TABS = ['Leitura', 'Fases', 'Regras', 'Exercícios'] as const;

export function PlanPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Leitura');
  return (
    <div className="pb-32">
      <header className="px-4 pt-3 pb-2"><h1 className="text-2xl font-bold">Plano</h1></header>
      <div className="px-4 flex gap-2 overflow-x-auto pb-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="tap px-4 rounded-xl font-semibold whitespace-nowrap" style={{ background: tab === t ? 'var(--accent)' : 'var(--card)', color: tab === t ? '#000' : 'var(--text)' }}>{t}</button>
        ))}
      </div>
      <div className="px-4 flex flex-col gap-3 mt-2">
        {tab === 'Leitura' && (
          <>
            {plan.reading.map((r) => (
              <section key={r.title} className="card p-4">
                <h2 className="font-bold text-lg mb-1">{r.title}</h2>
                {r.paragraphs.map((p) => <p key={p} className="text-[15px] mb-2 leading-snug">{p}</p>)}
                {r.bullets?.length ? <ul className="list-disc pl-5 text-[15px] space-y-1">{r.bullets.map((b) => <li key={b}>{b}</li>)}</ul> : null}
              </section>
            ))}
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-1">Suposições</h2>
              <ul className="list-disc pl-5 text-[15px] space-y-1">{plan.meta.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
            </section>
          </>
        )}
        {tab === 'Fases' && (
          <>
            {plan.phases.map((p) => (
              <section key={p.id} className="card p-4">
                <h2 className="font-bold text-lg">Fase {p.id}: {p.name} <span className="muted text-sm font-normal">· semanas {p.weeks[0]}{p.weeks[1] !== p.weeks[0] ? `–${p.weeks[1]}` : ''}</span></h2>
                <dl className="text-[15px] mt-2 grid grid-cols-[6rem_1fr] gap-y-1">
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
                    <tr key={s.id} className="border-t" style={{ borderColor: 'var(--card2)' }}>
                      <td className="py-2 font-semibold w-8">{s.id}</td>
                      <td className="py-2">{s.subtitle}</td>
                      <td className="py-2 muted text-right whitespace-nowrap">{s.cardio[1].minutes} min</td>
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
        {tab === 'Regras' && (
          <>
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-1">Quando aumentar a carga</h2>
              <p className="text-sm muted mb-1">Aumente quando as três condições valerem ao mesmo tempo:</p>
              <ol className="list-decimal pl-5 text-[15px] space-y-1">{plan.progression.increaseConditions.map((c) => <li key={c}>{c}</li>)}</ol>
              <ul className="list-disc pl-5 text-[15px] mt-2 space-y-1">{plan.progression.increments.map((c) => <li key={c}>{c}</li>)}</ul>
              <p className="text-[15px] mt-2">{plan.progression.upperBodyMaxOnePer.text}</p>
            </section>
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-1">Assimetria: lado esquerdo</h2>
              <ul className="list-disc pl-5 text-[15px] space-y-1">{plan.progression.asymmetry.map((c) => <li key={c}>{c}</li>)}</ul>
              <p className="text-[15px] mt-2"><span className="font-semibold">Teste a cada {plan.asymmetryTest.everyWeeks} semanas: </span>{plan.asymmetryTest.text} Meta: {plan.asymmetryTest.target}.</p>
              <p className="text-sm muted mt-1">Exercícios: {plan.asymmetryTest.exercises.map((id) => getExercise(id).name).join('; ')}.</p>
            </section>
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-1">Sintomas</h2>
              <p className="text-[15px]">{plan.progression.symptomRegress.text}</p>
              <p className="text-[15px] mt-2">{plan.progression.acceptablePain}</p>
            </section>
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-1">Alongamentos</h2>
              <p className="text-[15px]">{plan.stretchNote}</p>
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
        <section key={g}>
          <h2 className="font-bold text-lg px-1 mb-2">{g} <span className="muted text-sm font-normal">({ids.length})</span></h2>
          <div className="flex flex-col gap-2">
            {ids.map((id) => {
              const ex = getExercise(id);
              const open = openId === id;
              return (
                <div key={id} className="card p-3">
                  <button className="w-full text-left flex justify-between items-center" onClick={() => setOpenId(open ? null : id)}>
                    <span className="font-semibold">{ex.name}</span>
                    <span className="muted">{open ? '▾' : '▸'}</span>
                  </button>
                  {open && (
                    <div className="mt-2">
                      <div className="text-sm muted">{ex.equipment.join(', ')}{ex.unilateral ? ' · unilateral (começa pelo esquerdo)' : ''}</div>
                      <ul className="list-disc pl-5 text-[15px] mt-1 space-y-1">{ex.cues.map((c) => <li key={c}>{c}</li>)}</ul>
                      {ex.cautions?.length ? <ul className="list-disc pl-5 text-[15px] mt-1 space-y-1" style={{ color: 'var(--warn)' }}>{ex.cautions.map((c) => <li key={c}>{c}</li>)}</ul> : null}
                      <table className="w-full text-sm mt-2">
                        <thead><tr className="muted text-left"><th>Fase</th><th>Séries</th><th>Reps</th><th>Desc.</th><th>RIR</th></tr></thead>
                        <tbody>
                          {([1, 2, 3, 4] as const).map((p) => { const pr = ex.prescription[p]; return <tr key={p} className="border-t" style={{ borderColor: 'var(--card2)' }}><td className="py-1">{p}</td><td>{pr.sets}</td><td>{pr.reps}</td><td>{pr.restSec ? `${pr.restSec} s` : '—'}</td><td>{pr.rir}</td></tr>; })}
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
