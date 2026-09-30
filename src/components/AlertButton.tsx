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

/** Entrada "Sinais de alerta" em forma de card (usada na aba Mais). */
export function AlertButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="press tap card w-full p-4 mt-3 flex items-center gap-3 text-left"
        style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--danger) 40%, transparent)' }}
      >
        <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 40, height: 40, background: 'color-mix(in srgb, var(--danger) 18%, transparent)', color: 'var(--danger)' }}><IconAlert size={22} strokeWidth={2.25} /></span>
        <span>
          <span className="block font-bold text-lg">Sinais de alerta</span>
          <span className="block text-sm muted">Quando parar a série, o treino, ou procurar atendimento</span>
        </span>
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
