import { useState } from 'react';
import { plan } from '../data/plan';
import { Sheet } from './Sheet';

const LEVEL_STYLE: Record<string, { bg: string; label: string }> = {
  'stop-set': { bg: 'var(--warn)', label: 'Parar a série' },
  'er-today': { bg: 'var(--danger)', label: 'Pronto-socorro hoje' },
  emergency: { bg: '#ff2d2d', label: 'Emergência' },
  physio: { bg: 'var(--accent2)', label: 'Fisioterapia / médico' },
};

export function AlertButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Sinais de alerta"
        className="fixed right-4 z-40 tap rounded-full font-bold text-black shadow-lg px-4"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 84px)', background: 'var(--danger)', minHeight: 56 }}
      >
        ⚠︎ Alerta
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Sinais de alerta" danger>
        <p className="muted text-sm mb-3">{plan.progression.acceptablePain}</p>
        <div className="flex flex-col gap-3">
          {plan.alerts.map((g) => {
            const st = LEVEL_STYLE[g.level];
            return (
              <div key={g.level} className="card2 p-3" style={{ borderLeft: `6px solid ${st.bg}` }}>
                <div className="font-semibold text-base mb-1">{g.title}</div>
                <ul className="list-disc pl-5 text-[15px] leading-snug space-y-1">
                  {g.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <div className="mt-2 text-[15px] font-medium" style={{ color: st.bg }}>{g.action}</div>
                {g.level === 'emergency' && (
                  <a href="tel:192" className="tap mt-2 inline-flex items-center justify-center rounded-xl px-4 font-bold text-black w-full" style={{ background: st.bg }}>Ligar 192 (SAMU)</a>
                )}
              </div>
            );
          })}
        </div>
        <p className="muted text-sm mt-4">{plan.backpackNote}</p>
      </Sheet>
    </>
  );
}
