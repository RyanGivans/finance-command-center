import { BarChart3, CalendarDays, CreditCard, LineChart, PiggyBank, Target, Wallet } from 'lucide-react';
import { money, years, type MoneyMap } from './data';

export type Section = 'overview' | 'actual' | 'goals' | 'compare' | '2026' | '2027' | '2028' | '2029' | '2030' | '2031';

export const navItems: [Section, any, string][] = [
  ['overview', Wallet, 'Overview'],
  ['actual', BarChart3, 'Actual Tracker'],
  ['goals', Target, 'Goal Tracker'],
  ['compare', LineChart, 'What-If / Compare'],
  ...years.map((year) => [String(year) as Section, CalendarDays, String(year)] as [Section, any, string]),
];

export function Kpi({ icon, label, value, warn }: { icon?: React.ReactNode; label: string; value: string; warn?: boolean }) {
  return <div className={`kpi ${warn ? 'warn' : ''}`}><span>{icon}</span><p>{label}</p><b>{value}</b></div>;
}

export function Panel({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return <section className={`panel ${wide ? 'wide' : ''}`}><h3>{title}</h3>{children}</section>;
}

export function Editor({ title, data, setData, note }: { title: string; data: MoneyMap; setData: (v: MoneyMap) => void; note?: string }) {
  return <Panel title={title}>{note && <p className="muted">{note}</p>}<div className="editRows">{Object.entries(data).map(([key, value]) => <label key={key}><span>{key}</span><input type="number" value={value} onChange={(e) => setData({ ...data, [key]: Number(e.target.value) })} /></label>)}</div></Panel>;
}

export function Overview({ calc, savings, debt }: any) {
  return <div className="stack"><div className="kpiGrid"><Kpi icon={<Wallet />} label="Monthly Income" value={money.format(calc.income)} /><Kpi icon={<CreditCard />} label="Monthly Expenses" value={money.format(calc.expenses)} /><Kpi icon={<PiggyBank />} label="Monthly Leftover" value={money.format(calc.leftover)} warn={calc.leftover < 0} /><Kpi icon={<CreditCard />} label="Total Debt" value={money.format(debt)} /></div><section className="notice"><b>Where are we right now?</b><p>{calc.leftover >= 0 ? 'You are positive this month. Keep expenses controlled while funding the highest priority goals.' : 'You are negative this month. Lower expenses or increase income before adding more goal pressure.'}</p></section><div className="grid"><Panel title="Goal Alignment"><div className="bar"><i style={{ width: `${Math.min(calc.goalProgress * 100, 100)}%` }} /></div><p>{money.format(savings)} saved toward {money.format(calc.goalTotal)} total goals.</p></Panel><Panel title="Current vs Goal Path"><div className="table"><p><span>Current 5-year</span><b>{money.format(calc.currentFive)}</b></p><p><span>Goal 5-year</span><b>{money.format(calc.goalFive)}</b></p><p><span>Difference</span><b>{money.format(calc.goalFive - calc.currentFive)}</b></p></div></Panel></div></div>;
}

export function ActualTracker(props: any) {
  return <div className="grid"><Editor title="Income" data={props.income} setData={props.setIncome} note="Ryan, Raven, business, roommates, and side income." /><Editor title="Expenses" data={props.expenses} setData={props.setExpenses} note="Put all major monthly expenses here." /><Panel title="Current Balances"><label><span>Current Savings</span><input type="number" value={props.savings} onChange={(e) => props.setSavings(Number(e.target.value))} /></label><label><span>Total Debt</span><input type="number" value={props.debt} onChange={(e) => props.setDebt(Number(e.target.value))} /></label></Panel><Panel title="Monthly Notes"><textarea placeholder="Notes for this month, bills coming up, changes, wins, problems..." /></Panel></div>;
}

export function GoalPage({ goals, setGoals, savings, setSavings, calc }: any) {
  return <div className="stack"><Panel title="Goal Tracker" wide><label><span>Current Savings</span><input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} /></label><div className="bar"><i style={{ width: `${Math.min(calc.goalProgress * 100, 100)}%` }} /></div><p>{Math.round(calc.goalProgress * 100)}% funded across all goals.</p></Panel><Editor title="Editable Goals" data={goals} setData={setGoals} /></div>;
}

export function Compare({ calc, currentSave, setCurrentSave, goalSave, setGoalSave }: any) {
  return <div className="grid"><Panel title="Current Path"><div className="big">{money.format(calc.currentFive)}</div><label><span>Current savings / month</span><input type="number" value={currentSave} onChange={(e) => setCurrentSave(Number(e.target.value))} /></label></Panel><Panel title="Goal Path"><div className="big good">{money.format(calc.goalFive)}</div><label><span>Goal savings / month</span><input type="number" value={goalSave} onChange={(e) => setGoalSave(Number(e.target.value))} /></label></Panel><Panel title="5-Year Gap"><div className="big">{money.format(calc.goalFive - calc.currentFive)}</div><p>This shows how far the goal path pulls ahead of the current path.</p></Panel></div>;
}

export function YearProjection({ year, calc }: any) {
  const index = Number(year) - 2025;
  return <div className="stack"><section className="yearHero"><h2>{year} Projection</h2><p>Projected from the editable income, expense, savings, and debt model.</p></section><div className="kpiGrid"><Kpi label="Annual Income" value={money.format(calc.income * 12)} /><Kpi label="Annual Expenses" value={money.format(calc.expenses * 12)} /><Kpi label="Annual Net" value={money.format(calc.leftover * 12)} warn={calc.leftover < 0} /><Kpi label="Projected Position" value={money.format((calc.currentFive / 6) * index)} /></div><Panel title="Annual Summary" wide><div className="table"><p><span>Monthly leftover</span><b>{money.format(calc.leftover)}</b></p><p><span>Annual leftover</span><b>{money.format(calc.leftover * 12)}</b></p><p><span>Goal pace</span><b>{calc.leftover >= 1200 ? 'On track' : 'Needs work'}</b></p></div></Panel></div>;
}

export function titleFor(section: Section) {
  if (section === 'overview') return 'Financial Overview';
  if (section === 'actual') return 'Actual Tracker';
  if (section === 'goals') return 'Goal Tracker';
  if (section === 'compare') return 'Current vs Goal Comparison';
  return `${section} Projection`;
}
