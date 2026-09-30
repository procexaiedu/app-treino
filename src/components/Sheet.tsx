import { useEffect, useId, useRef, type ReactNode } from 'react';
import { IconX } from './icons';

export function Sheet({ open, onClose, title, children, danger }: { open: boolean; onClose: () => void; title: string; children: ReactNode; danger?: boolean }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      prevFocus?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="sheet-scrim absolute inset-0 bg-black/70" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="sheet-panel relative card rounded-b-none max-h-[92dvh] flex flex-col safe-bottom shadow-[0_-8px_32px_rgba(0,0,0,0.5)]"
        style={{ borderTop: `1px solid ${danger ? 'var(--danger)' : 'var(--border)'}` }}
      >
        <div className="flex justify-center pt-2" aria-hidden="true">
          <span className="block h-1 w-10 rounded-full" style={{ background: 'var(--card3)' }} />
        </div>
        <div className="flex items-center justify-between gap-3 pl-4 pr-2 pt-1 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 id={titleId} className="text-lg font-bold flex items-center gap-2" style={danger ? { color: 'var(--danger)' } : undefined}>{title}</h2>
          <button className="tap press flex items-center gap-1.5 px-3 rounded-xl text-base font-semibold muted" onClick={onClose}>
            <IconX size={20} />
            Fechar
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-4 pt-3 pb-6">{children}</div>
      </div>
    </div>
  );
}
