import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { getSetting, setSetting } from './lib/db';
import { todayISO } from './lib/phase';
import { Today } from './pages/Today';
import { PlanPage } from './pages/PlanPage';
import { NutritionPage } from './pages/NutritionPage';
const ProgressPage = lazy(() => import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage })));
import { SettingsPage } from './pages/SettingsPage';
import { IconClipboard, IconDumbbell, IconMore, IconTrend, IconUtensils } from './components/icons';
import type { ComponentType, SVGProps } from 'react';

const NAV: Array<[string, string, ComponentType<SVGProps<SVGSVGElement> & { size?: number }>]> = [
  ['/', 'Hoje', IconDumbbell],
  ['/plano', 'Plano', IconClipboard],
  ['/comida', 'Comida', IconUtensils],
  ['/progresso', 'Progresso', IconTrend],
  ['/mais', 'Mais', IconMore],
];

function Loading() {
  return (
    <div className="h-full min-h-[50dvh] flex items-center justify-center gap-3 muted" role="status">
      <span className="inline-block size-5 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
      Carregando…
    </div>
  );
}

export default function App() {
  const [startDate, setStartDate] = useState<string | null | undefined>(undefined);
  useEffect(() => { void getSetting('startDate').then((v) => setStartDate(v ?? null)); }, []);

  if (startDate === undefined) return <Loading />;
  if (startDate === null) return <Onboarding onDone={(d) => setStartDate(d)} />;

  return (
    <HashRouter>
      <main className="min-h-full safe-top">
        <Routes>
          <Route path="/" element={<Today startDate={startDate} />} />
          <Route path="/plano" element={<PlanPage />} />
          <Route path="/comida" element={<NutritionPage />} />
          <Route path="/progresso" element={<Suspense fallback={<Loading />}><ProgressPage startDate={startDate} /></Suspense>} />
          <Route path="/mais" element={<SettingsPage startDate={startDate} onStartDate={setStartDate} />} />
        </Routes>
      </main>
      <div>
        <nav className="fixed bottom-0 left-0 right-0 z-30 safe-bottom" style={{ background: 'color-mix(in srgb, var(--card) 94%, transparent)', borderTop: '1px solid var(--border)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} aria-label="Navegação">
          <div className="grid grid-cols-5 px-1">
            {NAV.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                end
                className="tap press flex flex-col items-center justify-center gap-1 pt-2 pb-1.5 text-sm font-semibold"
                style={({ isActive }) => ({ color: isActive ? 'var(--accent)' : 'var(--muted)', minHeight: 60 })}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="flex items-center justify-center rounded-full"
                      style={{ width: 52, height: 28, background: isActive ? 'color-mix(in srgb, var(--accent) 16%, transparent)' : 'transparent', transition: 'background-color 200ms var(--ease-out)' }}
                    >
                      <Icon size={22} strokeWidth={isActive ? 2.25 : 2} />
                    </span>
                    <span className="leading-none">{label}</span>
                  </>
                )}
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
      <p className="muted mt-2 max-w-[36ch]">Plano adaptado ao desfiladeiro torácico. Os dados ficam só neste aparelho.</p>
      <label htmlFor="onb-start" className="mt-8 block font-semibold">Quando você começa (ou começou)?</label>
      <p id="onb-hint" className="text-sm muted mt-1 mb-3">A semana 1 é a semana desta data.</p>
      <input id="onb-start" type="date" aria-describedby="onb-hint" value={d} onChange={(e) => setD(e.target.value)} className="tap field w-full px-3 text-lg" />
      <button
        onClick={async () => { await setSetting('startDate', d); onDone(d); }}
        disabled={!d}
        className="tap press mt-6 w-full rounded-2xl py-4 text-lg font-bold disabled:opacity-50" style={{ background: 'var(--accent)', color: 'var(--on-color)' }}
      >Começar</button>
    </div>
  );
}
