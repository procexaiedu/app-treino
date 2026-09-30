// Linha de abas em chips (rolagem interna quando não cabe). Estado exposto via aria-pressed.
export function TabChips<T extends string>({ tabs, value, onChange, label }: { tabs: readonly T[]; value: T; onChange: (t: T) => void; label: string }) {
  return (
    <div className="chip-row px-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label={label}>
      {tabs.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            aria-pressed={active}
            className="tap press px-4 rounded-xl font-semibold whitespace-nowrap shrink-0"
            style={{ background: active ? 'var(--accent)' : 'var(--card)', color: active ? 'var(--on-color)' : 'var(--text)' }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
