import type { useRestTimer } from '../lib/timer';

type T = ReturnType<typeof useRestTimer>;

export function RestTimerBar({ t }: { t: T }) {
  if (!t.running) return null;
  const pct = t.total ? Math.max(0, Math.min(100, (t.remaining / t.total) * 100)) : 0;
  const m = Math.floor(t.remaining / 60);
  const s = String(t.remaining % 60).padStart(2, '0');
  return (
    <div className="fixed left-0 right-0 z-40 px-3" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 72px)' }}>
      <div className="card shadow-xl p-3 flex items-center gap-3" style={{ border: '1px solid var(--accent)' }}>
        <div className="text-3xl font-bold tabular-nums w-24">{m}:{s}</div>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--card2)' }}>
          <div className="h-full" style={{ width: `${pct}%`, background: 'var(--accent)', transition: 'width .25s linear' }} />
        </div>
        <button className="tap px-3 rounded-xl card2 font-semibold" onClick={() => t.add(15)}>+15 s</button>
        <button className="tap px-3 rounded-xl font-semibold" style={{ background: 'var(--danger)', color: '#000' }} onClick={t.stop}>Parar</button>
      </div>
    </div>
  );
}
