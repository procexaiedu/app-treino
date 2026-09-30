import { useEffect, type ReactNode } from 'react';

export function Sheet({ open, onClose, title, children, danger }: { open: boolean; onClose: () => void; title: string; children: ReactNode; danger?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/60" aria-label="Fechar" onClick={onClose} />
      <div className="relative card rounded-b-none max-h-[92dvh] flex flex-col safe-bottom" style={danger ? { borderTop: '4px solid var(--danger)' } : undefined}>
        <div className="flex items-center justify-between px-4 pt-3 pb-2 sticky top-0" style={{ background: 'var(--card)' }}>
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="tap px-3 rounded-xl text-base muted" onClick={onClose}>Fechar</button>
        </div>
        <div className="overflow-y-auto px-4 pb-6">{children}</div>
      </div>
    </div>
  );
}
