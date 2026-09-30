import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { db } from '../lib/db';
import { plan } from '../data/plan';
import { tracking } from '../data/tracking';
import { getExercise, todayISO, weekNumber } from '../lib/phase';
import { evaluateNutritionRules, loadStalled, weeklyAverages } from '../lib/rules';
import { IconAlert, IconCheck, IconTrophy } from '../components/icons';

// Mostra "Salvo" por 1,5 s depois de gravar
function useFlash(): [boolean, () => void] {
  const [on, setOn] = useState(false);
  return [on, () => { setOn(true); setTimeout(() => setOn(false), 1500); }];
}

function SaveButton({ onClick, disabled, flash, color = 'var(--accent)', className = '' }: { onClick: () => void; disabled: boolean; flash: boolean; color?: string; className?: string }) {
  return (
    <button
      className={`tap press px-5 rounded-xl font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{ background: color, color: 'var(--on-color)' }}
      disabled={disabled && !flash}
      onClick={onClick}
    >
      {flash ? <><IconCheck size={20} strokeWidth={2.75} />Salvo</> : 'Salvar'}
    </button>
  );
}

export function ProgressPage({ startDate }: { startDate: string }) {
  const weights = useLiveQuery(() => db.weights.orderBy('date').toArray(), []) ?? [];
  const waist = useLiveQuery(() => db.waist.orderBy('date').toArray(), []) ?? [];
  const today = todayISO();
  const planWeek = weekNumber(startDate);
  const weeks = useMemo(() => weeklyAverages(weights), [weights]);
  const suggestions = useMemo(() => evaluateNutritionRules(weeks, waist, planWeek), [weeks, waist, planWeek]);

  const [w, setW] = useState('');
  const [c, setC] = useState('');
  const [wSaved, flashW] = useFlash();
  const [cSaved, flashC] = useFlash();
  const wNum = Number(w.replace(',', '.'));
  const cNum = Number(c.replace(',', '.'));
  const todayW = weights.find((x) => x.date === today);
  const lastWaist = waist[waist.length - 1];

  return (
    <div className="pb-40 px-4">
      <header className="pt-4 pb-3"><h1 className="text-[28px] leading-tight font-bold">Progresso</h1><div className="text-sm muted mt-1 num">Semana {planWeek} do plano</div></header>

      <TrainingSummary startDate={startDate} />

      <section className="card p-4 mt-3">
        <h2 className="font-bold text-lg mb-3"><label htmlFor="w-today">Peso de hoje</label></h2>
        <div className="flex gap-2">
          <input id="w-today" aria-describedby="w-how" type="number" inputMode="decimal" step="0.1" placeholder={todayW ? String(todayW.kg) : 'kg'} value={w} onChange={(e) => setW(e.target.value)} className="tap field flex-1 min-w-0 text-center text-2xl font-semibold" />
          <SaveButton disabled={!(wNum > 30)} flash={wSaved} onClick={async () => { const v = wNum; if (v > 30) { await db.weights.put({ date: today, kg: v }); setW(''); flashW(); } }} />
        </div>
        <p id="w-how" className="text-sm muted mt-2">{tracking.rows[0]?.how}</p>
        {weeks.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="card2 px-2 py-3"><div className="text-xl font-bold num">{weeks[weeks.length - 1].avg.toFixed(1)}</div><div className="text-sm muted leading-snug mt-0.5">média desta semana ({weeks[weeks.length - 1].n} pes.)</div></div>
            <div className="card2 px-2 py-3"><div className="text-xl font-bold num">{weeks.length > 1 ? (weeks[weeks.length - 1].avg - weeks[weeks.length - 2].avg).toFixed(2) : '—'}</div><div className="text-sm muted leading-snug mt-0.5">Δ vs semana anterior</div></div>
            <div className="card2 px-2 py-3"><div className="text-xl font-bold num">{weights.length ? (weights[weights.length - 1].kg - weights[0].kg).toFixed(1) : '—'}</div><div className="text-sm muted leading-snug mt-0.5">Δ total</div></div>
          </div>
        )}
      </section>

      <section className="card p-4 mt-3">
        <h2 className="font-bold text-lg mb-3"><label htmlFor="waist">Cintura (1×/semana)</label></h2>
        <div className="flex gap-2">
          <input id="waist" aria-describedby="waist-how" type="number" inputMode="decimal" step="0.5" placeholder={lastWaist ? `${lastWaist.cm} cm` : 'cm'} value={c} onChange={(e) => setC(e.target.value)} className="tap field flex-1 min-w-0 text-center text-2xl font-semibold" />
          <SaveButton color="var(--accent2)" disabled={!(cNum > 40)} flash={cSaved} onClick={async () => { const v = cNum; if (v > 40) { await db.waist.put({ date: today, cm: v }); setC(''); flashC(); } }} />
        </div>
        <p id="waist-how" className="text-sm muted mt-2">{tracking.rows[1]?.how}</p>
      </section>

      {suggestions.length > 0 && (
        <section className="card p-4 mt-3" style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--warn) 50%, transparent)' }}>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><IconAlert size={20} style={{ color: 'var(--warn)' }} />Sugestões do plano</h2>
          {suggestions.map((s) => <div key={s.ruleId} className="card2 p-3 mb-2"><div className="font-semibold text-[15px]">{s.title}</div><div className="text-[15px] mt-1">{s.detail}</div></div>)}
        </section>
      )}

      <section className="card p-4 mt-3">
        <h2 className="font-bold text-lg mb-2">Peso</h2>
        {weights.length < 2 ? <EmptyChart text="Registre pelo menos 2 dias para ver o gráfico." /> : (
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={chartData(weights, weeks)} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={{ stroke: 'var(--border)' }} tickFormatter={(d: string) => d.slice(8) + '/' + d.slice(5, 7)} minTickGap={24} />
                <YAxis tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(v: number) => v.toFixed(0)} />
                <Tooltip contentStyle={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }} labelStyle={{ color: 'var(--muted)' }} labelFormatter={(d) => String(d)} />
                <Legend />
                <Line type="monotone" dataKey="kg" name="diário" stroke="var(--muted)" dot={{ r: 2 }} strokeWidth={1} connectNulls />
                <Line type="monotone" dataKey="avg" name="média semanal" stroke="var(--accent)" dot={{ r: 3 }} strokeWidth={2} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <LoadCharts />

      <Records />

      <AsymSection today={today} />

      <section className="card p-4 mt-3">
        <h2 className="font-bold text-lg mb-2">O que acompanhar</h2>
        <div className="flex flex-col gap-2">
          {tracking.rows.map((r) => <div key={r.what} className="card2 p-3 text-[15px]"><div className="font-semibold">{r.what} <span className="muted font-normal text-sm">· {r.when}</span></div><div className="text-sm mt-1">{r.how}</div></div>)}
        </div>
        <h3 className="font-bold mt-6 mb-2">Regras de ajuste</h3>
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
  const tiles = useMemo(() => {
    const maxOf = (r: { L?: number; R?: number; both?: number }) => Math.max(r.L ?? 0, r.R ?? 0, r.both ?? 0);
    if (!data.length) return null;
    const best = Math.max(...data.map(maxOf));
    const last = maxOf(data[data.length - 1]);
    const first = maxOf(data[0]);
    return { best, last, delta: last - first };
  }, [data]);
  return (
    <section className="card p-4 mt-3">
      <h2 className="font-bold text-lg mb-3"><label htmlFor="load-ex">Cargas por exercício</label></h2>
      <select id="load-ex" className="tap field w-full px-3" value={exId} onChange={(e) => setExId(e.target.value)}>
        {loadedIds.map((id) => <option key={id} value={id}>{getExercise(id).name}</option>)}
      </select>
      {tiles && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <StatTile v={`${fmt1(tiles.best)} kg`} l="melhor" accent />
          <StatTile v={`${fmt1(tiles.last)} kg`} l="última sessão" />
          <StatTile v={data.length > 1 ? `${tiles.delta > 0 ? '+' : ''}${fmt1(tiles.delta)} kg` : '—'} l="desde o início" />
        </div>
      )}
      {stalled && <div className="mt-3 p-3 rounded-xl text-sm font-medium" style={{ background: 'var(--warn)', color: 'var(--on-color)' }}>{tracking.rules.find((r) => r.id === 'stalled_load')?.trigger} {tracking.rules.find((r) => r.id === 'stalled_load')?.action}</div>}
      {data.length < 2 ? <div className="mt-3"><EmptyChart text="Registre pelo menos 2 sessões com carga." /></div> : (
        <div style={{ height: 200 }} className="mt-2">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="d" tickLine={false} axisLine={{ stroke: 'var(--border)' }} tickFormatter={(d: string) => d.slice(8) + '/' + d.slice(5, 7)} minTickGap={24} />
              <YAxis unit="" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }} labelStyle={{ color: 'var(--muted)' }} />
              <Legend />
              {ex.unilateral ? (
                <>
                  <Line type="monotone" dataKey="L" name="esquerdo" stroke="var(--left)" strokeWidth={2} connectNulls />
                  <Line type="monotone" dataKey="R" name="direito" stroke="var(--right)" strokeWidth={2} connectNulls />
                </>
              ) : (
                <Line type="monotone" dataKey="both" name="kg" stroke="var(--accent)" strokeWidth={2} connectNulls />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {ex.maxLoadKg != null && <p className="text-sm muted mt-2 num">Teto do plano: {ex.maxLoadKg} kg.</p>}
    </section>
  );
}

function AsymSection({ today }: { today: string }) {
  const tests = useLiveQuery(() => db.asymTests.orderBy('date').reverse().toArray(), []) ?? [];
  const [exId, setExId] = useState(plan.asymmetryTest.exercises[0]);
  const [kg, setKg] = useState(''); const [l, setL] = useState(''); const [r, setR] = useState('');
  const [aSaved, flashA] = useFlash();
  return (
    <section className="card p-4 mt-3">
      <h2 className="font-bold text-lg mb-1">Teste de assimetria</h2>
      <p className="text-sm muted mb-3">{plan.asymmetryTest.text} Meta: {plan.asymmetryTest.target}.</p>
      <select aria-label="Exercício do teste" className="tap field w-full px-3 mb-3" value={exId} onChange={(e) => setExId(e.target.value)}>
        {plan.asymmetryTest.exercises.map((id) => <option key={id} value={id}>{getExercise(id).name}</option>)}
      </select>
      <div className="grid grid-cols-3 gap-2">
        <label className="flex flex-col gap-1 text-sm muted text-center">kg
          <input className="tap field min-w-0 text-center text-lg font-semibold" style={{ color: 'var(--text)' }} type="number" inputMode="decimal" placeholder="kg" value={kg} onChange={(e) => setKg(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-center" style={{ color: 'var(--left)' }}>reps E
          <input className="tap field min-w-0 text-center text-lg font-semibold" type="number" inputMode="numeric" placeholder="reps E" value={l} onChange={(e) => setL(e.target.value)} style={{ color: 'var(--left)' }} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-center" style={{ color: 'var(--right)' }}>reps D
          <input className="tap field min-w-0 text-center text-lg font-semibold" type="number" inputMode="numeric" placeholder="reps D" value={r} onChange={(e) => setR(e.target.value)} style={{ color: 'var(--right)' }} />
        </label>
      </div>
      <SaveButton className="w-full mt-2" disabled={!(kg && l && r)} flash={aSaved} onClick={async () => { if (kg && l && r) { await db.asymTests.add({ date: today, exerciseId: exId, loadKg: Number(kg), repsL: Number(l), repsR: Number(r) }); setKg(''); setL(''); setR(''); flashA(); } }} />
      {tests.length > 0 && (
        <table className="w-full text-sm mt-4">
          <thead><tr className="muted text-left">{['Data', 'Exercício', 'kg', 'E', 'D', 'Dif.'].map((h) => <th key={h} scope="col" className="font-medium pb-1 pr-1">{h}</th>)}</tr></thead>
          <tbody>{tests.slice(0, 12).map((t) => { const diff = t.repsR ? Math.round(((t.repsR - t.repsL) / t.repsR) * 100) : 0; return <tr key={t.id} className="border-t" style={{ borderColor: 'var(--border)' }}><td className="py-1.5 pr-1 whitespace-nowrap">{t.date.slice(5)}</td><td>{getExercise(t.exerciseId).name.split(' ').slice(0, 2).join(' ')}</td><td>{t.loadKg}</td><td>{t.repsL}</td><td>{t.repsR}</td><td style={{ color: Math.abs(diff) > 15 ? 'var(--warn)' : 'var(--accent)' }}>{diff}%</td></tr>; })}</tbody>
        </table>
      )}
    </section>
  );
}

function fmt1(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

function StatTile({ v, l, accent }: { v: string; l: string; accent?: boolean }) {
  return (
    <div className="card2 px-2 py-3">
      <div className="text-xl font-bold num leading-tight" style={accent ? { color: 'var(--accent)' } : undefined}>{v}</div>
      <div className="text-sm muted leading-snug mt-0.5">{l}</div>
    </div>
  );
}

/** Resumo de treinos (padrão Hevy/NTC): sessões concluídas, semana atual e séries. */
function TrainingSummary({ startDate }: { startDate: string }) {
  const sessions = useLiveQuery(() => db.sessionLogs.toArray(), []) ?? [];
  const setCount = useLiveQuery(() => db.setLogs.filter((s) => s.reps != null).count(), []) ?? 0;
  const week = weekNumber(startDate);
  const done = sessions.filter((s) => s.completed);
  const thisWeek = done.filter((s) => s.week === week).length;
  const perWeek = plan.sessions.length;
  return (
    <section className="card p-4">
      <h2 className="font-bold text-lg mb-3">Treinos</h2>
      <div className="grid grid-cols-3 gap-2 text-center">
        <StatTile v={`${thisWeek}/${perWeek}`} l="nesta semana" accent={thisWeek > 0} />
        <StatTile v={String(done.length)} l="sessões concluídas" />
        <StatTile v={String(setCount)} l="séries registradas" />
      </div>
      <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--card2)' }} role="progressbar" aria-label="Sessões desta semana" aria-valuemin={0} aria-valuemax={perWeek} aria-valuenow={thisWeek}>
        <div className="h-full w-full rounded-full origin-left" style={{ transform: `scaleX(${Math.min(1, thisWeek / perWeek)})`, background: 'var(--accent)' }} />
      </div>
    </section>
  );
}

/** Recordes de carga por exercício (melhor carga e data). */
function Records() {
  const all = useLiveQuery(() => db.setLogs.toArray(), []) ?? [];
  const rows = useMemo(() => {
    const best = new Map<string, { kg: number; date: string }>();
    for (const s of all) {
      if (s.loadKg == null || s.reps == null) continue;
      const cur = best.get(s.exerciseId);
      if (!cur || s.loadKg > cur.kg) best.set(s.exerciseId, { kg: s.loadKg, date: s.date });
    }
    return [...best.entries()]
      .filter(([id]) => plan.exercises[id]?.loaded)
      .map(([id, v]) => ({ id, name: getExercise(id).name, ...v }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [all]);
  return (
    <section className="card p-4 mt-3">
      <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><IconTrophy size={20} style={{ color: 'var(--accent)' }} />Recordes de carga</h2>
      {rows.length === 0 ? <EmptyChart text="Os recordes aparecem depois da primeira série com carga." /> : (
        <ul className="flex flex-col">
          {rows.map((r) => (
            <li key={r.id} className="flex items-baseline justify-between gap-3 py-2 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[15px] min-w-0">{r.name}</span>
              <span className="shrink-0 text-right num"><span className="font-bold">{fmt1(r.kg)} kg</span> <span className="text-sm muted">{r.date.slice(8)}/{r.date.slice(5, 7)}</span></span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EmptyChart({ text }: { text: string }) {
  return (
    <div className="card2 flex flex-col items-center justify-center gap-2 text-center px-6 py-8" style={{ minHeight: 140 }}>
      <svg width="56" height="28" viewBox="0 0 56 28" fill="none" aria-hidden="true">
        <path d="M2 24 L14 16 L24 20 L38 8 L54 4" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 5" />
      </svg>
      <p className="muted text-sm max-w-[30ch]">{text}</p>
    </div>
  );
}
