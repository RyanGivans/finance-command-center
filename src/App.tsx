import { useMemo, useState } from 'react';
import { TrendingUp, Wallet, CreditCard, Target } from 'lucide-react';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function App() {
  const [income, setIncome] = useState({
    ryan: 5833,
    raven: 0,
    business: 0,
    roommates: 1100,
  });

  const [expenses, setExpenses] = useState({
    housing: 2200,
    utilities: 350,
    food: 700,
    transportation: 700,
    subscriptions: 250,
    misc: 900,
  });

  const [goals, setGoals] = useState({
    emergency: 30000,
    moving: 8000,
    business: 50000,
  });

  const [savings, setSavings] = useState(17000);
  const [debt, setDebt] = useState(6161);

  const calculations = useMemo(() => {
    const monthlyIncome = Object.values(income).reduce((a, b) => a + b, 0);
    const monthlyExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
    const leftover = monthlyIncome - monthlyExpenses;
    const totalGoals = Object.values(goals).reduce((a, b) => a + b, 0);
    const progress = totalGoals ? savings / totalGoals : 0;

    return {
      monthlyIncome,
      monthlyExpenses,
      leftover,
      totalGoals,
      progress,
      fiveYearProjection: savings + leftover * 60 - debt,
    };
  }, [income, expenses, goals, savings, debt]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Finance Command Center</h1>
        <nav>
          <button>Dashboard</button>
          <button>Income</button>
          <button>Expenses</button>
          <button>Goals</button>
          <button>5-Year Plan</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="hero">
          <div>
            <p className="eyebrow">Current financial position</p>
            <h2>Where are we right now?</h2>
            <p className="subtitle">Track your real finances while staying aligned with your long-term goals.</p>
          </div>
        </header>

        <section className="stats-grid">
          <StatCard icon={<Wallet size={18} />} title="Monthly Income" value={usd.format(calculations.monthlyIncome)} />
          <StatCard icon={<TrendingUp size={18} />} title="Monthly Leftover" value={usd.format(calculations.leftover)} />
          <StatCard icon={<CreditCard size={18} />} title="Total Debt" value={usd.format(debt)} />
          <StatCard icon={<Target size={18} />} title="Goal Progress" value={`${Math.round(calculations.progress * 100)}%`} />
        </section>

        <section className="content-grid">
          <div className="panel">
            <h3>Income</h3>
            {Object.entries(income).map(([key, value]) => (
              <label key={key}>
                <span>{key}</span>
                <input type="number" value={value} onChange={(e) => setIncome({ ...income, [key]: Number(e.target.value) })} />
              </label>
            ))}
          </div>

          <div className="panel">
            <h3>Expenses</h3>
            {Object.entries(expenses).map(([key, value]) => (
              <label key={key}>
                <span>{key}</span>
                <input type="number" value={value} onChange={(e) => setExpenses({ ...expenses, [key]: Number(e.target.value) })} />
              </label>
            ))}
          </div>

          <div className="panel">
            <h3>Goals</h3>
            {Object.entries(goals).map(([key, value]) => (
              <label key={key}>
                <span>{key}</span>
                <input type="number" value={value} onChange={(e) => setGoals({ ...goals, [key]: Number(e.target.value) })} />
              </label>
            ))}
          </div>

          <div className="panel">
            <h3>5-Year Outlook</h3>
            <div className="projection">
              <p>Projected Position</p>
              <strong>{usd.format(calculations.fiveYearProjection)}</strong>
            </div>
            <label>
              <span>Current Savings</span>
              <input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} />
            </label>
            <label>
              <span>Total Debt</span>
              <input type="number" value={debt} onChange={(e) => setDebt(Number(e.target.value))} />
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
