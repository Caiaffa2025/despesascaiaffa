export type ExpenseType = 'casa' | 'pessoal';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: ExpenseType | 'ambas';
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: ExpenseType;
  categoryId: string;
  date: string; // ISO date string YYYY-MM-DD
  notes?: string;
}

export interface FilterState {
  type: 'todos' | 'casa' | 'pessoal';
  categoryId: string;
  search: string;
  month: string; // YYYY-MM or 'todos'
  sortBy: 'date' | 'amount' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface CalculationSummary {
  totalGeneral: number;
  totalCasa: number;
  totalPessoal: number;
  percentCasa: number;
  percentPessoal: number;
  countTotal: number;
  countCasa: number;
  countPessoal: number;
  avgExpense: number;
  maxExpense: Expense | null;
}
