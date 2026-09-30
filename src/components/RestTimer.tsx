import { useEffect } from 'react';
import type { useRestTimer } from '../lib/timer';
import { IconPlus, IconStop, IconTimer } from './icons';

type T = ReturnType<typeof useRestTimer>;

export function RestTimerBar({ t }: { t: T }) {
  // avisa o layout (botão de alerta) que a barra está aberta
  useEffect(() => {
    const el = document.documentElement;
    if (t.running) el.dataset.timer = 'on';
    else delete el.dataset.timer;
    return () => { delete el.dataset.timer; };
  }, [t.running]);

  if (!t.running) return null;
  const pct = t.total ? Math.max(0, Math.min(100, (t.remaining / t.total) * 100)) : 0;
  const m = Math.floor(t.remaining / 60);
  const s = String(t.remaining % 60).padStart(2, '0');
  const ending = t.remaining <= 10;
  return (
    <div className="timer-bar fixed left-0 right-0 z-40 px-3" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 70px)' }}>
      <div
        className="card p-3 shadow-[0_8px_28px_rgba(0,0,0,0.55)]"
        style={{ border: `1px solid ${ending ? 'var(--warn)' : 'color-mix(in srgb, var(--accent) 55%, transparent)'}` }}
        role="timer"
        aria-label="Descanso"
      >
        <div className="flex items-center gap-2">
          <IconTimer size={22} className="shrink-0" style={{ color: ending ? 'var(--warn)' : 'var(--accent)' }} />
          <div className="text-3xl font-bold tabular-nums leading-none flex-1" aria-live="off">{m}:{s}</div>
          <button className="tap press flex items-center gap-1 px-3 rounded-xl card2 font-semibold" onClick={() => t.add(15)} aria-label="Mais 15 segundos">
            <IconPlus size={18} />15 s
          </button>
          <button className="tap press flex items-center gap-1.5 px-3 rounded-xl font-semibold" style={{ background: 'var(--danger)', color: 'var(--on-color)' }} onClick={t.stop}>
            <IconStop size={16} />Parar
          </button>
        </div>
        <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--card2)' }} aria-hidden="true">
          <div className="h-full w-full rounded-full origin-left" style={{ transform: `scaleX(${pct / 100})`, background: ending ? 'var(--warn)' : 'var(--accent)', transition: 'transform .25s linear, background-color .3s' }} />
        </div>
      </div>
    </div>
  );
}
