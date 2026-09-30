import { useRef, useState } from 'react';
import { db, exportBackup, importBackup, setSetting, type Backup } from '../lib/db';
import { plan } from '../data/plan';
import { IconDownload, IconTrash, IconUpload } from '../components/icons';
import { AlertButton } from '../components/AlertButton';

export function SettingsPage({ startDate, onStartDate }: { startDate: string; onStartDate: (d: string) => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function doExport() {
    const b = await exportBackup();
    const blob = new Blob([JSON.stringify(b, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `treino12-backup-${b.exportedAt.slice(0, 10)}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    setMsg(`Backup exportado: ${b.setLogs.length} séries, ${b.weights.length} pesagens.`);
  }
  async function doImport(f: File, mode: 'replace' | 'merge') {
    try {
      const b = JSON.parse(await f.text()) as Backup;
      await importBackup(b, mode);
      const sd = b.settings.find((s) => s.key === 'startDate')?.value;
      if (sd) onStartDate(sd);
      setMsg(`Importado (${mode === 'replace' ? 'substituindo' : 'mesclando'}): ${b.setLogs?.length ?? 0} séries, ${b.weights?.length ?? 0} pesagens.`);
    } catch (e) { setMsg(`Erro ao importar: ${(e as Error).message}`); }
  }

  return (
    <div className="pb-40 px-4">
      <header className="pt-4 pb-3"><h1 className="text-[28px] leading-tight font-bold">Mais</h1></header>
      <section className="card p-4">
        <h2 className="font-bold text-lg mb-1"><label htmlFor="start-date">Data de início do plano</label></h2>
        <p id="start-hint" className="text-sm muted mb-3">A semana e a fase são calculadas a partir da segunda-feira desta data.</p>
        <input id="start-date" aria-describedby="start-hint" type="date" className="tap field w-full px-3 text-lg" value={startDate} onChange={async (e) => { if (e.target.value) { await setSetting('startDate', e.target.value); onStartDate(e.target.value); } }} />
      </section>

      <AlertButton />

      <section className="card p-4 mt-3">
        <h2 className="font-bold text-lg mb-1">Backup</h2>
        <p className="text-sm muted mb-3">Os dados ficam só neste aparelho (IndexedDB). Exporte de vez em quando.</p>
        <button onClick={doExport} className="tap press w-full flex items-center justify-center gap-2 rounded-xl font-bold mb-2" style={{ background: 'var(--accent)', color: 'var(--on-color)' }}><IconDownload size={20} />Exportar JSON</button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f, (fileRef.current?.dataset.mode as 'replace' | 'merge') ?? 'merge'); e.target.value = ''; }} />
        <div className="flex gap-2">
          <button onClick={() => { fileRef.current!.dataset.mode = 'merge'; fileRef.current?.click(); }} className="tap press flex-1 flex items-center justify-center gap-1.5 px-2 rounded-xl font-semibold card2"><IconUpload size={18} />Importar (mesclar)</button>
          <button onClick={() => { fileRef.current!.dataset.mode = 'replace'; fileRef.current?.click(); }} className="tap press flex-1 flex items-center justify-center gap-1.5 px-2 rounded-xl font-semibold card2"><IconUpload size={18} />Importar (substituir)</button>
        </div>
        <div role="status" aria-live="polite">{msg && <p className="text-sm mt-3" style={{ color: msg.startsWith('Erro') ? 'var(--danger)' : 'var(--accent2)' }}>{msg}</p>}</div>
      </section>

      <section className="card p-4 mt-3">
        <h2 className="font-bold text-lg mb-1">Instalar no iPhone</h2>
        <ol className="list-decimal pl-5 text-[15px] space-y-1.5 mt-2">
          <li>Abra este endereço no Safari.</li>
          <li>Toque em Compartilhar (quadrado com seta).</li>
          <li>Toque em "Adicionar à Tela de Início" e confirme.</li>
        </ol>
        <p className="text-sm muted mt-2">O som do cronômetro só toca depois do primeiro toque na tela. O iPhone não vibra em apps web; o som avisa. No Android vibra e toca.</p>
      </section>

      <section className="card p-4 mt-3">
        <h2 className="font-bold text-lg mb-1">Sobre</h2>
        <p className="text-sm muted">{plan.meta.title}. Fonte única dos dados: plano.md → src/data. Pesquisa: {plan.meta.researchFile}.</p>
      </section>

      <section className="card p-4 mt-3" style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--danger) 40%, transparent)' }}>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: 'var(--danger)' }}><IconTrash size={20} />Apagar tudo</h2>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="tap press w-full rounded-xl font-semibold card2" style={{ color: 'var(--danger)' }}>Apagar todos os dados…</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setConfirmReset(false)} className="tap press flex-1 rounded-xl font-semibold card2" autoFocus>Cancelar</button>
            <button onClick={async () => { await db.delete(); location.reload(); }} className="tap press flex-1 rounded-xl font-bold" style={{ background: 'var(--danger)', color: 'var(--on-color)' }}>Apagar de verdade</button>
          </div>
        )}
      </section>
    </div>
  );
}
