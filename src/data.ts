export const money = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});

export const initialIncome = { Ryan: 5833, Raven: 0, Business: 0, Roommates: 1100, 'Side Work': 0 };
export const initialExpenses = { Housing: 2200, Utilities: 350, Food: 700, Transportation: 700, Insurance: 300, Subscriptions: 250, 'Debt Minimums': 265, Other: 900 };
export const initialGoals = { 'Emergency Fund': 30000, 'Move Cushion': 8000, 'Business / House Fund': 50000, 'Debt Payoff': 6161 };
export const years = [2026, 2027, 2028, 2029, 2030, 2031];
export type MoneyMap = Record<string, number>;

export function sum(obj: MoneyMap){ return Object.values(obj).reduce((a,b)=>a+Number(b||0),0); }
export function labelValue(label:string,value:number){ return { label, value: money.format(value) }; }
