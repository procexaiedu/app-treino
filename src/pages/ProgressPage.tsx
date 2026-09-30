import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { db } from '../lib/db';
import { plan } from '../data/plan';
import { tracking } from '../data/tracking';
import { getExercise, todayISO, weekNumber } from '../lib/phase';
import { evaluateNutritionRules, loadStalled, weeklyAverages } from '../lib/rules';

export function ProgressPage({ startDate }: { startDate: string }) {
  const weights = useLiveQuery(() => db.weights.orderBy('date').toArray(), []) ?? [];
  const waist = useLiveQuery(() => db.waist.orderBy('date').toArray(), []) ?? [];
  const today = todayISO();
  const planWeek = weekNumber(startDate);
  const weeks = useMemo(() => weeklyAverages(weights), [weights]);
  const suggestions = useMemo(() => evaluateNutritionRules(weeks, waist, planWeek), [weeks, waist, planWeek]);

  const [w, setW] = useState('');
  const [c, setC] = useState('');
  const todayW = weights.find((x) => x.date === today);
  const lastWaist = waist[waist.length - 1];

  return (
    <div className="pb-32 px-4">
      <header className="pt-3 pb-2"><h1 className="text-2xl font-bold">Progresso</h1><div className="text-sm muted">Semana {planWeek} do plano</div></header>

      <section className="card p-4">
        <h2 className="font-bold text-lg mb-2">Peso de hoje</h2>
        <div className="flex gap-2">
          <input type="number" inputMode="decimal" step="0.1" placeholder={todayW ? String(todayW.kg) : 'kg'} value={w} onChange={(e) => setW(e.target.value)} className="tap flex-1 rounded-xl card2 text-center text-2xl" />
          <button className="tap px-5 rounded-xl font-bold text-black" style={{ background: 'var(--accent)' }} onClick={async () => { const v = Number(w.replace(',', '.')); if (v > 30) { await db.weights.put({ date: today, kg: v }); setW(''); } }}>Salvar</button>
        </div>
        <p className="text-xs muted mt-1">{tracking.rows[0]?.how}</p>
        {weeks.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="card2 p-2"><div className="text-lg font-bold">{weeks[weeks.length - 1].avg.toFixed(1)}</div><div className="text-xs muted">média desta semana ({weeks[weeks.length - 1].n} pes.)</div></div>
            <div className="card2 p-2"><div className="text-lg font-bold">{weeks.length > 1 ? (weeks[weeks.length - 1].avg - weeks[weeks.length - 2].avg).toFixed(2) : '—'}</div><div className="text-xs muted">Δ vs semana anterior</div></div>
            <div className="card2 p-2"><div className="text-lg font-bold">{weights.length ? (weights[weights.length - 1].kg - weights[0].kg).toFixed(1) : '—'}</div><div className="text-xs muted">Δ total</div></div>
          </div>
        )}
      </section>

      <section className="card p-4 mt-3">
        <h2 className="font-bold text-lg mb-2">Cintura (1×/semana)</h2>
        <div className="flex gap-2">
          <input type="number" inputMode="decimal" step="0.5" placeholder={lastWaist ? `${lastWaist.cm} cm` : 'cm'} value={c} onChange={(e) => setC(e.target.value)} className="tap flex-1 rounded-xl card2 text-center text-2xl" />
          <button className="tap px-5 rounded-xl font-bold text-black" style={{ background: 'var(--accent2)' }} onClick={async () => { const v = Number(c.replace(',', '.')); if (v > 40) { await db.waist.put({ date: today, cm: v }); setC(''); } }}>Salvar</button>
        </div>
        <p className="text-xs muted mt-1">{tracking.rows[1]?.how}</p>
      </section>

      {suggestions.length > 0 && (
        <section className="card p-4 mt-3" style={{ borderLeft: '4px solid var(--warn)' }}>
          <h2 className="font-bold text-lg mb-2">Sugestões do plano</h2>
          {suggestions.map((s) => <div key={s.ruleId} className="card2 p-3 mb-2"><div className="font-semibold text-[15px]">{s.title}</div><div className="text-[15px] mt-1">{s.detail}</div></div>)}
        </section>
      )}

      <section className="card p-4 mt-3">
        <h2 className="font-bold text-lg mb-2">Peso</h2>
        {weights.length < 2 ? <p className="muted text-sm">Registre pelo menos 2 dias para ver o gráfico.</p> : (
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={chartData(weights, weeks)} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid stroke="#222b36" />
                <XAxis dataKey="d" tickFormatter={(d: string) => d.slice(8) + '/' + d.slice(5, 7)} minTickGap={24} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(v: number) => v.toFixed(0)} />
                <Tooltip contentStyle={{ background: '#141a22', border: 'none', borderRadius: 8 }} labelFormatter={(d) => String(d)} />
                <Legend />
                <Line type="monotone" dataKey="kg" name="diário" stroke="#8b98a8" dot={{ r: 2 }} strokeWidth={1} connectNulls />
                <Line type="monotone" dataKey="avg" name="média semanal" stroke="#3ddc97" dot={{ r: 3 }} strokeWidth={2} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <LoadCharts />

      <AsymSection today={today} />

      <section className="card p-4 mt-3">
        <h2 className="font-bold text-lg mb-2">O que acompanhar</h2>
        <div className="flex flex-col gap-2">
          {tracking.rows.map((r) => <div key={r.what} className="card2 p-3 text-[15px]"><div className="font-semibold">{r.what} <span className="muted font-normal text-sm">· {r.when}</span></div><div className="text-sm mt-0.5">{r.how}</div></div>)}
        </div>
        <h3 className="font-bold mt-4 mb-1">Regras de ajuste</h3>
        <ul className="list-disc pl-5 text-[15px] space-y-1">{tracking.rules.map((r) => <li key={r.id}><span className="font-semibold">{r.trigger}</span> {r.action}</li>)}</ul>
        <p className="text-[15px] mt-2">{tracking.week12}</p>
      </section>
    </div>
  );
}

function chartData(weights: { date: string; kg: number }[], weeks: { weekStart: string; avg: number }[]) {
  const avgByWeek = new Map(weeks.map((w) => [w.weekStart, w.avg]));
  return weights.map((w) => {
    const [y, m, d] = w.date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    // média aparece no último dia registrado da semana
    const isLastOfWeek = !weights.some((o) => o.date > w.date && o.date <= addDays(key, 6));
    return { d: w.date, kg: w.kg, avg: isLastOfWeek ? Number(avgByWeek.get(key)?.toFixed(2)) : undefined };
  });
}
function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function LoadCharts() {
  const loadedIds = Object.values(plan.exercises).filter((e) => e.loaded && e.kind === 'main').map((e) => e.id);
  const [exId, setExId] = useState(loadedIds[0]);
  const sets = useLiveQuery(() => db.setLogs.where('exerciseId').equals(exId).sortBy('date'), [exId]) ?? [];
  const ex = getExercise(exId);
  const data = useMemo(() => {
    const byDate = new Map<string, { d: string; L?: number; R?: number; both?: number }>();
    for (const s of sets) {
      if (s.loadKg == null) continue;
      const row = byDate.get(s.date) ?? { d: s.date };
      row[s.side] = Math.max(row[s.side] ?? 0, s.loadKg);
      byDate.set(s.date, row);
    }
    return [...byDate.values()];
  }, [sets]);
  const stalled = useMemo(() => loadStalled(sets), [sets]);
  return (
    <section className="card p-4 mt-3">
      <h2 className="font-bold text-lg mb-2">Cargas por exercício</h2>
      <select className="tap w-full rounded-xl card2 px-3" value={exId} onChange={(e) => setExId(e.target.value)}>
        {loadedIds.map((id) => <option key={id} value={id}>{getExercise(id).name}</option>)}
      </select>
      {stalled && <div className="mt-2 p-2 rounded-lg text-sm" style={{ background: 'var(--warn)', color: '#000' }}>{tracking.rules.find((r) => r.id === 'stalled_load')?.trigger} {tracking.rules.find((r) => r.id === 'stalled_load')?.action}</div>}
      {data.length < 2 ? <p className="muted text-sm mt-2">Registre pelo menos 2 sessões com carga.</p> : (
        <div style={{ height: 200 }} className="mt-2">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
              <CartesianGrid stroke="#222b36" />
              <XAxis dataKey="d" tickFormatter={(d: string) => d.slice(8) + '/' + d.slice(5, 7)} minTickGap={24} />
              <YAxis unit="" />
              <Tooltip contentStyle={{ background: '#141a22', border: 'none', borderRadius: 8 }} />
              <Legend />
              {ex.unilateral ? (
                <>
                  <Line type="monotone" dataKey="L" name="esquerdo" stroke="#c77dff" strokeWidth={2} connectNulls />
                  <Line type="monotone" dataKey="R" name="direito" stroke="#4cc9f0" strokeWidth={2} connectNulls />
                </>
              ) : (
                <Line type="monotone" dataKey="both" name="kg" stroke="#3ddc97" strokeWidth={2} connectNulls />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {ex.maxLoadKg != null && <p className="text-xs muted mt-1">Teto do plano: {ex.maxLoadKg} kg.</p>}
    </section>
  );
}

function AsymSection({ today }: { today: string }) {
  const tests = useLiveQuery(() => db.asymTests.orderBy('date').reverse().toArray(), []) ?? [];
  const [exId, setExId] = useState(plan.asymmetryTest.exercises[0]);
  const [kg, setKg] = useState(''); const [l, setL] = useState(''); const [r, setR] = useState('');
  return (
    <section className="card p-4 mt-3">
      <h2 className="font-bold text-lg mb-1">Teste de assimetria</h2>
      <p className="text-sm muted mb-2">{plan.asymmetryTest.text} Meta: {plan.asymmetryTest.target}.</p>
      <select className="tap w-full rounded-xl card2 px-3 mb-2" value={exId} onChange={(e) => setExId(e.target.value)}>
        {plan.asymmetryTest.exercises.map((id) => <option key={id} value={id}>{getExercise(id).name}</option>)}
      </select>
      <div className="grid grid-cols-4 gap-2">
        <input className="tap rounded-xl card2 text-center" type="number" inputMode="decimal" placeholder="kg" value={kg} onChange={(e) => setKg(e.target.value)} />
        <input className="tap rounded-xl card2 text-center" type="number" inputMode="numeric" placeholder="reps E" value={l} onChange={(e) => setL(e.target.value)} style={{ color: 'var(--left)' }} />
        <input className="tap rounded-xl card2 text-center" type="number" inputMode="numeric" placeholder="reps D" value={r} onChange={(e) => setR(e.target.value)} style={{ color: 'var(--right)' }} />
        <button className="tap rounded-xl font-bold text-black" style={{ background: 'var(--accent)' }} onClick={async () => { if (kg && l && r) { await db.asymTests.add({ date: today, exerciseId: exId, loadKg: Number(kg), repsL: Number(l), repsR: Number(r) }); setKg(''); setL(''); setR(''); } }}>Salvar</button>
      </div>
      {tests.length > 0 && (
        <table className="w-full text-sm mt-3">
          <thead><tr className="muted text-left"><th>Data</th><th>Exercício</th><th>kg</th><th>E</th><th>D</th><th>Dif.</th></tr></thead>
          <tbody>{tests.slice(0, 12).map((t) => { const diff = t.repsR ? Math.round(((t.repsR - t.repsL) / t.repsR) * 100) : 0; return <tr key={t.id} className="border-t" style={{ borderColor: 'var(--card2)' }}><td className="py-1">{t.date.slice(5)}</td><td>{getExercise(t.exerciseId).name.split(' ').slice(0, 2).join(' ')}</td><td>{t.loadKg}</td><td>{t.repsL}</td><td>{t.repsR}</td><td style={{ color: Math.abs(diff) > 15 ? 'var(--warn)' : 'var(--accent)' }}>{diff}%</td></tr>; })}</tbody>
        </table>
      )}
    </section>
  );
}
