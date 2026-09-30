import { useState } from 'react';
import { plan } from '../data/plan';
import { Sheet } from './Sheet';
import { IconAlert, IconPhone } from './icons';

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
        aria-haspopup="dialog"
        className="alert-fab press fixed right-4 z-40 tap rounded-full font-bold pl-4 pr-5 flex items-center gap-2"
        style={{ background: 'var(--danger)', color: 'var(--on-color)', minHeight: 56, boxShadow: '0 6px 20px rgba(255,92,92,0.28), 0 2px 6px rgba(0,0,0,0.5)' }}
      >
        <IconAlert size={22} strokeWidth={2.25} />
        Alerta
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Sinais de alerta" danger>
        <p className="muted text-[15px] mb-4">{plan.progression.acceptablePain}</p>
        <div className="flex flex-col gap-3">
          {plan.alerts.map((g) => {
            const st = LEVEL_STYLE[g.level];
            return (
              <section
                key={g.level}
                className="card2 p-4"
                style={{ background: `color-mix(in srgb, ${st.bg} 9%, var(--card2))`, border: `1px solid color-mix(in srgb, ${st.bg} 45%, transparent)` }}
              >
                <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                  <span className="inline-block size-2.5 rounded-full shrink-0" style={{ background: st.bg }} aria-hidden="true" />
                  {g.title}
                </h3>
                <ul className="list-disc pl-5 text-[15px] leading-snug space-y-1.5">
                  {g.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <div className="mt-3 text-[15px] font-semibold" style={{ color: st.bg }}>{g.action}</div>
                {g.level === 'emergency' && (
                  <a href="tel:192" className="tap press mt-3 flex items-center justify-center gap-2 rounded-xl px-4 font-bold w-full" style={{ background: st.bg, color: 'var(--on-color)' }}>
                    <IconPhone size={20} />
                    Ligar 192 (SAMU)
                  </a>
                )}
              </section>
            );
          })}
        </div>
        <p className="muted text-sm mt-4">{plan.backpackNote}</p>
      </Sheet>
    </>
  );
}
