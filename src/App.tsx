import { useMemo, useState } from 'react';
import { Compare, ActualTracker, GoalPage, Overview, Section, YearProjection, navItems, titleFor } from './components';
import { initialExpenses, initialGoals, initialIncome, sum } from './data';

export default function App() {
  const [section, setSection] = useState<Section>('overview');
  const [income, setIncome] = useState(initialIncome);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [goals, setGoals] = useState(initialGoals);
  const [savings, setSavings] = useState(17000);
  const [debt, setDebt] = useState(6161);
  const [currentSave, setCurrentSave] = useState(300);
  const [goalSave, setGoalSave] = useState(1200);

  const calc = useMemo(() => {
    const incomeTotal = sum(income);
    const expenseTotal = sum(expenses);
    const goalTotal = sum(goals);
    return {
      income: incomeTotal,
      expenses: expenseTotal,
      leftover: incomeTotal - expenseTotal,
      goalTotal,
      goalProgress: goalTotal ? savings / goalTotal : 0,
      currentFive: savings + currentSave * 60 - debt,
      goalFive: savings + goalSave * 60 - debt,
    };
  }, [income, expenses, goals, savings, debt, currentSave, goalSave]);

  return (
    <div className="layout">
      <aside className="leftRail">
        <div className="brandBlock">
          <div className="mark">FCC</div>
          <div>
            <h1>Finance Command Center</h1>
            <p>Ryan & Raven</p>
          </div>
        </div>
        <nav>
          {navItems.map(([id, Icon, label]) => (
            <button key={id} className={section === id ? 'active' : ''} onClick={() => setSection(id)}>
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <h2>{titleFor(section)}</h2>
            <p>Editable financial tracker, 5-year plan, and goal alignment system.</p>
          </div>
          <span>Live model</span>
        </header>

        <div className="content">
          {section === 'overview' && <Overview calc={calc} savings={savings} debt={debt} />}
          {section === 'actual' && <ActualTracker income={income} setIncome={setIncome} expenses={expenses} setExpenses={setExpenses} savings={savings} setSavings={setSavings} debt={debt} setDebt={setDebt} />}
          {section === 'goals' && <GoalPage goals={goals} setGoals={setGoals} savings={savings} setSavings={setSavings} calc={calc} />}
          {section === 'compare' && <Compare calc={calc} currentSave={currentSave} setCurrentSave={setCurrentSave} goalSave={goalSave} setGoalSave={setGoalSave} />}
          {['2026','2027','2028','2029','2030','2031'].includes(section) && <YearProjection year={section} calc={calc} />}
        </div>
      </main>
    </div>
  );
}
