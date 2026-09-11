import { Expense, CalculationSummary } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
};

export const calculateSummary = (expenses: Expense[]): CalculationSummary => {
  let totalCasa = 0;
  let totalPessoal = 0;
  let countCasa = 0;
  let countPessoal = 0;
  let maxExpense: Expense | null = null;

  for (const exp of expenses) {
    if (exp.type === 'casa') {
      totalCasa += exp.amount;
      countCasa++;
    } else {
      totalPessoal += exp.amount;
      countPessoal++;
    }

    if (!maxExpense || exp.amount > maxExpense.amount) {
      maxExpense = exp;
    }
  }

  const totalGeneral = totalCasa + totalPessoal;
  const countTotal = expenses.length;
  const percentCasa = totalGeneral > 0 ? (totalCasa / totalGeneral) * 100 : 0;
  const percentPessoal = totalGeneral > 0 ? (totalPessoal / totalGeneral) * 100 : 0;
  const avgExpense = countTotal > 0 ? totalGeneral / countTotal : 0;

  return {
    totalGeneral,
    totalCasa,
    totalPessoal,
    percentCasa,
    percentPessoal,
    countTotal,
    countCasa,
    countPessoal,
    avgExpense,
    maxExpense,
  };
};

export const getAvailableMonths = (expenses: Expense[]): string[] => {
  const monthsSet = new Set<string>();
  expenses.forEach((exp) => {
    if (exp.date && exp.date.length >= 7) {
      monthsSet.add(exp.date.substring(0, 7)); // YYYY-MM
    }
  });

  const sorted = Array.from(monthsSet).sort().reverse();
  return sorted;
};

export const formatMonthYear = (yearMonth: string): string => {
  if (!yearMonth || yearMonth === 'todos') return 'Todos os meses';
  const [year, month] = yearMonth.split('-');
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const mIndex = parseInt(month, 10) - 1;
  if (mIndex >= 0 && mIndex < 12) {
    return `${monthNames[mIndex]} de ${year}`;
  }
  return yearMonth;
};
