import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { getSetting, setSetting } from './lib/db';
import { todayISO } from './lib/phase';
import { AlertButton } from './components/AlertButton';
import { Today } from './pages/Today';
import { PlanPage } from './pages/PlanPage';
import { NutritionPage } from './pages/NutritionPage';
const ProgressPage = lazy(() => import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage })));
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [startDate, setStartDate] = useState<string | null | undefined>(undefined);
  useEffect(() => { void getSetting('startDate').then((v) => setStartDate(v ?? null)); }, []);

  if (startDate === undefined) return <div className="h-full flex items-center justify-center muted">Carregando…</div>;
  if (startDate === null) return <Onboarding onDone={(d) => setStartDate(d)} />;

  return (
    <HashRouter>
      <div className="min-h-full safe-top">
        <Routes>
          <Route path="/" element={<Today startDate={startDate} />} />
          <Route path="/plano" element={<PlanPage />} />
          <Route path="/comida" element={<NutritionPage />} />
          <Route path="/progresso" element={<Suspense fallback={<div className="p-6 muted">Carregando…</div>}><ProgressPage startDate={startDate} /></Suspense>} />
          <Route path="/mais" element={<SettingsPage startDate={startDate} onStartDate={setStartDate} />} />
        </Routes>
        <AlertButton />
        <nav className="fixed bottom-0 left-0 right-0 z-30 safe-bottom" style={{ background: 'var(--card)', borderTop: '1px solid #1f2933' }} aria-label="Navegação">
          <div className="grid grid-cols-5">
            {[
              ['/', 'Hoje', '▶'],
              ['/plano', 'Plano', '☰'],
              ['/comida', 'Comida', '◐'],
              ['/progresso', 'Progresso', '↗'],
              ['/mais', 'Mais', '⋯'],
            ].map(([to, label, icon]) => (
              <NavLink key={to} to={to} end className="tap flex flex-col items-center justify-center py-2 text-xs font-semibold" style={({ isActive }) => ({ color: isActive ? 'var(--accent)' : 'var(--muted)', minHeight: 56 })}>
                <span className="text-lg leading-none mb-0.5" aria-hidden>{icon}</span>{label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </HashRouter>
  );
}

function Onboarding({ onDone }: { onDone: (d: string) => void }) {
  const [d, setD] = useState(todayISO());
  return (
    <div className="min-h-full flex flex-col justify-center px-6 safe-top safe-bottom">
      <h1 className="text-3xl font-bold">Treino 12 Semanas</h1>
      <p className="muted mt-2">Plano adaptado ao desfiladeiro torácico. Os dados ficam só neste aparelho.</p>
      <label className="mt-6 block font-semibold">Quando você começa (ou começou)?</label>
      <p className="text-sm muted mb-2">A semana 1 é a semana desta data.</p>
      <input type="date" value={d} onChange={(e) => setD(e.target.value)} className="tap w-full rounded-xl card px-3 text-lg" />
      <button
        onClick={async () => { await setSetting('startDate', d); onDone(d); }}
        className="tap mt-6 w-full rounded-2xl py-4 text-lg font-bold text-black" style={{ background: 'var(--accent)' }}
      >Começar</button>
    </div>
  );
}
