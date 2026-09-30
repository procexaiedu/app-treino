import { useState } from 'react';
import { nutrition } from '../data/nutrition';
import type { FoodOption } from '../data/types';
import { TabChips } from '../components/TabChips';

const TABS = ['Dia útil', 'Prato', 'Opções', 'Fim de semana', 'Suplementos'] as const;

export function NutritionPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Dia útil');
  const n = nutrition;
  return (
    <div className="pb-40">
      <header className="px-4 pt-4 pb-3"><h1 className="text-[28px] leading-tight font-bold">Alimentação</h1>
        <div className="text-sm muted mt-1 num">{n.targets.kcalDay} kcal/dia · {n.targets.proteinG} g de proteína · {n.targets.rate}</div>
      </header>
      <TabChips tabs={TABS} value={tab} onChange={setTab} label="Seções da alimentação" />
      <div className="px-4 flex flex-col gap-3 mt-2">
        {tab === 'Dia útil' && (
          <>
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-2">Refeições</h2>
              <table className="w-full text-[15px]">
                <tbody>
                  {n.weekdayMeals.map((m) => (
                    <tr key={m.time + m.name} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-2 pr-2 font-semibold whitespace-nowrap align-top w-14 num">{m.time}</td>
                      <td className="py-2 align-top">{m.name}{m.note ? <div className="text-sm muted">{m.note}</div> : null}</td>
                      <td className="py-2 pl-2 text-right whitespace-nowrap align-top muted num">{m.kcal}<br /><span className="text-sm">{m.protein}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul className="list-disc pl-5 text-[15px] mt-2 space-y-1">{n.weekdayMealsNote.map((x) => <li key={x}>{x}</li>)}</ul>
            </section>
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-2">Contas</h2>
              <dl className="text-[15px] space-y-2">
                {n.calc.map((c) => <div key={c.label}><dt className="muted text-sm">{c.label}</dt><dd className="font-semibold">{c.value}</dd>{c.detail && <dd className="text-sm">{c.detail}</dd>}</div>)}
              </dl>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Stat v={`${n.targets.kcalDay}`} l="kcal/dia" /><Stat v={`${n.targets.proteinG} g`} l="proteína" /><Stat v={`${n.targets.kcalWeek}`} l="kcal/semana" />
                <Stat v={`${n.targets.fatG} g`} l="gordura" /><Stat v={`${n.targets.carbG} g`} l="carboidrato" /><Stat v={n.targets.rate} l="ritmo" small />
              </div>
            </section>
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-1">Água</h2>
              <ul className="list-disc pl-5 text-[15px] space-y-1">{n.water.map((x) => <li key={x}>{x}</li>)}</ul>
            </section>
          </>
        )}
        {tab === 'Prato' && (
          <>
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-1">Prato em gramas</h2>
              <p className="text-sm muted mb-2">{n.plateNote}</p>
              <table className="w-full text-[15px]">
                <thead><tr className="muted text-left text-sm"><th scope="col" className="font-medium pb-1">Item</th><th scope="col" className="font-medium pb-1">Almoço</th><th scope="col" className="font-medium pb-1">Jantar</th></tr></thead>
                <tbody>{n.plate.map((p) => <tr key={p.item} className="border-t" style={{ borderColor: 'var(--border)' }}><td className="py-2">{p.item}</td><td className="py-2 font-semibold">{p.lunch}</td><td className="py-2 font-semibold">{p.dinner}</td></tr>)}</tbody>
              </table>
            </section>
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-2">Trocas</h2>
              <div className="flex flex-col gap-2">{n.swaps.map((s) => <div key={s.instead} className="card2 p-3 text-[15px]"><div className="muted text-sm">Em vez de {s.instead}</div><div>{s.use}</div></div>)}</div>
            </section>
          </>
        )}
        {tab === 'Opções' && (
          <>
            <Options title="Café da manhã (até 10 min)" list={n.breakfast} />
            <Options title="Lanche da faculdade (sem geladeira)" list={n.collegeSnack} note={n.collegeSnackNote} />
            <Options title="Lanche da tarde" list={n.afternoonSnack} />
          </>
        )}
        {tab === 'Fim de semana' && (
          <>
            {n.weekend.map((w) => (
              <section key={w.title} className="card p-4">
                <h2 className="font-bold text-lg mb-1">{w.title}</h2>
                <ul className="list-disc pl-5 text-[15px] space-y-1">{w.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              </section>
            ))}
            <section className="card p-4">
              <h2 className="font-bold text-lg mb-2">Bebidas</h2>
              <table className="w-full text-[15px]"><tbody>{n.drinks.map((d) => <tr key={d.name} className="border-t" style={{ borderColor: 'var(--border)' }}><td className="py-2">{d.name}</td><td className="py-2 text-right font-semibold whitespace-nowrap">{d.kcal}</td></tr>)}</tbody></table>
            </section>
          </>
        )}
        {tab === 'Suplementos' && (
          <section className="card p-4">
            <div className="flex flex-col gap-2">{n.supplements.map((s) => <div key={s.name} className="card2 p-3"><div className="font-semibold">{s.name} <span className="muted font-normal">· {s.dose}</span></div><div className="text-[15px] mt-0.5">{s.note}</div></div>)}</div>
            <p className="text-[15px] mt-3 muted">{n.supplementsNote}</p>
          </section>
        )}
      </div>
    </div>
  );
}

function Stat({ v, l, small }: { v: string; l: string; small?: boolean }) {
  return <div className="card2 px-2 py-3 flex flex-col justify-center"><div className={`num leading-tight ${small ? 'text-sm font-semibold' : 'text-lg font-bold'}`}>{v}</div><div className="text-sm muted mt-0.5">{l}</div></div>;
}

function Options({ title, list, note }: { title: string; list: FoodOption[]; note?: string }) {
  return (
    <section className="card p-4">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <div className="flex flex-col gap-2">
        {list.map((o) => <div key={o.label} className="card2 p-3"><div className="text-sm muted">{o.label}{o.kcal ? ` · ${o.kcal}` : ''}{o.protein ? ` · ${o.protein}` : ''}</div><div className="text-[15px]">{o.items}</div></div>)}
      </div>
      {note && <p className="text-sm muted mt-2">{note}</p>}
    </section>
  );
}
