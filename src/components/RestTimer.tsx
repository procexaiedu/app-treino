import { useEffect } from 'react';
import type { useRestTimer } from '../lib/timer';
import { IconMinus, IconPlus, IconSkip, IconTimer } from './icons';

type T = ReturnType<typeof useRestTimer>;

/** Barra de descanso na zona do polegar: contagem grande, −15/+15 s e Pular (padrão Hevy/Strong). */
export function RestTimerBar({ t, label }: { t: T; label?: string | null }) {
  // avisa o layout que a barra está aberta (reserva espaço no fim da página)
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
  const tone = ending ? 'var(--warn)' : 'var(--accent)';
  return (
    <div className="timer-bar fixed left-0 right-0 z-40 px-3" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 70px)' }}>
      <div
        className="card p-3 shadow-[0_8px_28px_rgba(0,0,0,0.55)]"
        style={{ border: `1px solid ${ending ? 'var(--warn)' : 'color-mix(in srgb, var(--accent) 55%, transparent)'}` }}
        role="timer"
        aria-label="Descanso"
      >
        <div className="flex items-center gap-1.5 text-sm font-semibold min-w-0" style={{ color: tone }}>
          <IconTimer size={18} className="shrink-0" />
          <span className="shrink-0">Descanso</span>
          {label && <span className="muted font-medium truncate">· {label}</span>}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <button className="tap press flex items-center justify-center gap-0.5 px-2 rounded-xl card2 font-semibold num whitespace-nowrap disabled:opacity-40" onClick={() => t.add(-15)} disabled={t.remaining <= 15} aria-label="Menos 15 segundos">
            <IconMinus size={14} />15s
          </button>
          <div className="text-[38px] font-bold tabular-nums leading-none flex-1 min-w-0 text-center" aria-live="off" style={{ color: ending ? 'var(--warn)' : 'var(--text)' }}>{m}:{s}</div>
          <button className="tap press flex items-center justify-center gap-0.5 px-2 rounded-xl card2 font-semibold num whitespace-nowrap" onClick={() => t.add(15)} aria-label="Mais 15 segundos">
            <IconPlus size={14} />15s
          </button>
          <button className="tap press flex items-center gap-1.5 px-3 rounded-xl font-bold whitespace-nowrap" style={{ background: tone, color: 'var(--on-color)' }} onClick={t.stop}>
            <IconSkip size={16} />Pular
          </button>
        </div>
        <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--card2)' }} aria-hidden="true">
          <div className="h-full w-full rounded-full origin-left" style={{ transform: `scaleX(${pct / 100})`, background: tone, transition: 'transform .25s linear, background-color .3s' }} />
        </div>
      </div>
    </div>
  );
}
