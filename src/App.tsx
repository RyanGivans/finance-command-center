import { useMemo, useState } from 'react';
import { BarChart3, BriefcaseBusiness, CreditCard, Home, LineChart, PiggyBank, Target, Wallet } from 'lucide-react';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

type Section = 'dashboard' | 'income' | 'expenses' | 'goals' | 'plan';

export default function App() {
  const [section, setSection] = useState<Section>('dashboard');
  const [income, setIncome] = useState({ ryan: 5833, raven: 0, business: 0, roommates: 1100, sideWork: 0 });
  const [expenses, setExpenses] = useState({ housing: 2200, utilities: 350, food: 700, transportation: 700, subscriptions: 250, insurance: 300, debtMinimums: 265, misc: 900 });
  const [goals, setGoals] = useState({ emergencyFund: 30000, moveCushion: 8000, businessFund: 50000, debtFreeTarget: 0 });
  const [savings, setSavings] = useState(17000);
  const [debt, setDebt] = useState(6161);
  const [goalSavingsMonthly, setGoalSavingsMonthly] = useState(1200);
  const [currentSavingsMonthly, setCurrentSavingsMonthly] = useState(300);

  const calc = useMemo(() => {
    const monthlyIncome = Object.values(income).reduce((a, b) => a + b, 0);
    const monthlyExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
    const leftover = monthlyIncome - monthlyExpenses;
    const totalGoals = Object.values(goals).reduce((a, b) => a + b, 0);
    const progress = totalGoals ? savings / totalGoals : 0;
    const currentFive = savings + currentSavingsMonthly * 60 - debt;
    const goalFive = savings + goalSavingsMonthly * 60 - debt;
    return { monthlyIncome, monthlyExpenses, leftover, totalGoals, progress, currentFive, goalFive };
  }, [income, expenses, goals, savings, debt, currentSavingsMonthly, goalSavingsMonthly]);

  const nav = [
    ['dashboard', Home, 'Dashboard'], ['income', BriefcaseBusiness, 'Income'], ['expenses', CreditCard, 'Expenses'], ['goals', Target, 'Goals'], ['plan', LineChart, '5-Year Plan']
  ] as const;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">F</div><div><h1>Finance Command Center</h1><p>Ryan & Raven</p></div></div>
        <nav>{nav.map(([id, Icon, label]) => <button key={id} className={section === id ? 'active' : ''} onClick={() => setSection(id)}><Icon size={18}/><span>{label}</span></button>)}</nav>
      </aside>

      <main className="main-content">
        <header className="hero">
          <p className="eyebrow">Current financial position</p>
          <h2>Where are we right now?</h2>
          <p className="subtitle">A cleaner finance tracker for income, expenses, goals, and whether the current path lines up with the 5-year plan.</p>
        </header>

        {section === 'dashboard' && <Dashboard calc={calc} debt={debt} savings={savings} />}
        {section === 'income' && <Editor title="Income" description="Adjust Ryan, Raven, business, roommate, and side income as life changes." values={income} setValues={setIncome} />}
        {section === 'expenses' && <Editor title="Expenses" description="Put in every major monthly expense. This drives your real cash-flow picture." values={expenses} setValues={setExpenses} />}
        {section === 'goals' && <Goals goals={goals} setGoals={setGoals} savings={savings} setSavings={setSavings} total={calc.totalGoals} progress={calc.progress} />}
        {section === 'plan' && <Plan calc={calc} debt={debt} setDebt={setDebt} currentSavingsMonthly={currentSavingsMonthly} setCurrentSavingsMonthly={setCurrentSavingsMonthly} goalSavingsMonthly={goalSavingsMonthly} setGoalSavingsMonthly={setGoalSavingsMonthly} />}
      </main>
    </div>
  );
}

function Dashboard({ calc, debt, savings }: any) {
  const nextMove = calc.leftover < 0 ? 'You are negative this month. Reduce expenses or increase income before adding new goals.' : debt > 0 ? 'Focus on staying positive monthly while paying down debt and protecting savings.' : 'You are in a strong position. Push extra cash toward your biggest goal.';
  return <>
    <section className="stats-grid">
      <Stat icon={<Wallet size={20}/>} label="Monthly Income" value={usd.format(calc.monthlyIncome)} />
      <Stat icon={<BarChart3 size={20}/>} label="Monthly Leftover" value={usd.format(calc.leftover)} warning={calc.leftover < 0} />
      <Stat icon={<CreditCard size={20}/>} label="Total Debt" value={usd.format(debt)} />
      <Stat icon={<PiggyBank size={20}/>} label="Savings" value={usd.format(savings)} />
    </section>
    <section className="focus-card"><p>Best next move</p><h3>{nextMove}</h3></section>
    <section className="content-grid"><div className="panel large"><h3>Goal Alignment</h3><div className="progress"><div style={{width:`${Math.min(calc.progress*100,100)}%`}} /></div><p>{Math.round(calc.progress*100)}% of total goals funded.</p></div><div className="panel"><h3>5-Year Difference</h3><div className="big-number">{usd.format(calc.goalFive - calc.currentFive)}</div><p>Difference between current savings pace and goal savings pace.</p></div></section>
  </>;
}

function Stat({ icon, label, value, warning=false }: any) { return <div className={`stat-card ${warning ? 'warning' : ''}`}><div className="stat-icon">{icon}</div><p>{label}</p><strong>{value}</strong></div>; }

function Editor({ title, description, values, setValues }: any) {
  return <section className="panel full"><h3>{title}</h3><p className="muted">{description}</p><div className="edit-list">{Object.entries(values).map(([key, value]: any) => <label key={key}><span>{labelize(key)}</span><input type="number" value={value} onChange={e => setValues({ ...values, [key]: Number(e.target.value) })}/></label>)}</div></section>;
}

function Goals({ goals, setGoals, savings, setSavings, total, progress }: any) {
  return <section className="panel full"><h3>Goals</h3><p className="muted">Set the goals and track whether savings are lining up.</p><label><span>Current Savings</span><input type="number" value={savings} onChange={e => setSavings(Number(e.target.value))}/></label><div className="progress"><div style={{width:`${Math.min(progress*100,100)}%`}} /></div><p>{usd.format(savings)} saved toward {usd.format(total)} in goals.</p><div className="edit-list">{Object.entries(goals).map(([key, value]: any) => <label key={key}><span>{labelize(key)}</span><input type="number" value={value} onChange={e => setGoals({ ...goals, [key]: Number(e.target.value) })}/></label>)}</div></section>;
}

function Plan({ calc, debt, setDebt, currentSavingsMonthly, setCurrentSavingsMonthly, goalSavingsMonthly, setGoalSavingsMonthly }: any) {
  return <section className="content-grid"><div className="panel"><h3>Current Path</h3><div className="big-number">{usd.format(calc.currentFive)}</div><label><span>Current savings/month</span><input type="number" value={currentSavingsMonthly} onChange={e => setCurrentSavingsMonthly(Number(e.target.value))}/></label></div><div className="panel"><h3>Goal Path</h3><div className="big-number good">{usd.format(calc.goalFive)}</div><label><span>Goal savings/month</span><input type="number" value={goalSavingsMonthly} onChange={e => setGoalSavingsMonthly(Number(e.target.value))}/></label><label><span>Total debt</span><input type="number" value={debt} onChange={e => setDebt(Number(e.target.value))}/></label></div></section>;
}

function labelize(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()); }
