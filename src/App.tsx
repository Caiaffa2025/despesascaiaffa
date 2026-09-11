import React, { useState, useEffect } from 'react';
import { Category, Expense, FilterState } from './types';
import { INITIAL_CATEGORIES, INITIAL_EXPENSES } from './data/initialData';
import { calculateSummary, formatCurrency } from './utils/formatters';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { CategoryManager } from './components/CategoryManager';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { DataBackupModal } from './components/DataBackupModal';
import {
  Home,
  User,
  Wallet,
  PieChart,
  Plus,
  FolderPlus,
  Download,
  CheckCircle2,
  Sparkles,
  DollarSign,
  BarChart2,
  LayoutGrid,
  ArrowUpRight,
  Shield,
  Zap,
} from 'lucide-react';

const STORAGE_KEY_EXPENSES = 'gestor_gastos_expenses_v1';
const STORAGE_KEY_CATEGORIES = 'gestor_gastos_categories_v1';

export default function App() {
  // LocalStorage initialization
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  // State for active edit & modals
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tudo' | 'charts'>('tudo');

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    type: 'todos',
    categoryId: '',
    search: '',
    month: 'todos',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Erro ao salvar categorias:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('Erro ao salvar despesas:', e);
    }
  }, [expenses]);

  // Expenses operations
  const handleAddExpense = (newExpData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...newExpData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast('Despesa adicionada com sucesso!');
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
    );
    setEditingExpense(null);
    showToast('Despesa atualizada!');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (editingExpense?.id === id) {
      setEditingExpense(null);
    }
    showToast('Despesa removida!');
  };

  // Category operations
  const handleAddCategory = (newCatData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...newCatData,
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast('Nova categoria criada!');
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
    );
    showToast('Categoria atualizada!');
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showToast('Categoria excluída!');
  };

  // Backup operations
  const handleImportData = (newExpenses: Expense[], newCategories: Category[]) => {
    setExpenses(newExpenses);
    setCategories(newCategories);
    showToast('Dados importados com sucesso!');
  };

  const handleResetToDefaults = () => {
    setExpenses(INITIAL_EXPENSES);
    setCategories(INITIAL_CATEGORIES);
    showToast('Dados restaurados para o padrão.');
  };

  // Calculations
  const summary = calculateSummary(expenses);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar / Branding */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
              <Wallet className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-tight tracking-tight">
                Gestor de Gastos
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Casa & Pessoal • Cálculos Automáticos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-all flex items-center gap-1.5"
            >
              <FolderPlus className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Categorias</span>
            </button>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Backup</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Landing Banner & Dynamic Calculation KPIs */}
      <section className="bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow decorative elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Simples • Rápido • Automático</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Controle de Gastos de Casa e Pessoais
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
                Adicione despesas, personalize categorias e acompanhe o balanço financeiro calculado em tempo real.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingExpense(null);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Novo Gasto</span>
              </button>
            </div>
          </div>

          {/* Automatic Calculations Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Total Geral */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Total Geral
                </span>
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">
                {formatCurrency(summary.totalGeneral)}
              </p>
              <div className="mt-2 text-[11px] text-slate-400 font-medium">
                {summary.countTotal} lançamento(s) no total
              </div>
            </div>

            {/* Gastos de Casa */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-blue-500/30 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" />
                  Gastos de Casa
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full">
                  {summary.percentCasa.toFixed(0)}%
                </span>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">
                {formatCurrency(summary.totalCasa)}
              </p>
              <div className="mt-2 text-[11px] text-slate-400 font-medium">
                {summary.countCasa} item(ns) da residência
              </div>
            </div>

            {/* Gastos Pessoais */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-purple-500/30 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Gastos Pessoais
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                  {summary.percentPessoal.toFixed(0)}%
                </span>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">
                {formatCurrency(summary.totalPessoal)}
              </p>
              <div className="mt-2 text-[11px] text-slate-400 font-medium">
                {summary.countPessoal} item(ns) individuais
              </div>
            </div>

            {/* Média por Gasto */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Média de Lançamento
                </span>
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <BarChart2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-white tracking-tight">
                {formatCurrency(summary.avgExpense)}
              </p>
              <div className="mt-2 text-[11px] text-slate-400 font-medium truncate">
                {summary.maxExpense ? `Maior: ${formatCurrency(summary.maxExpense.amount)}` : 'Nenhum lançamento'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Top Grid: Expense Form + Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-5">
            <ExpenseForm
              categories={categories}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
              onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
            />
          </div>

          {/* Right Column: Visual Calculations & Dynamic Charts */}
          <div className="lg:col-span-7">
            <AnalyticsCharts expenses={expenses} categories={categories} />
          </div>
        </div>

        {/* Bottom Section: Full Filterable Expense List */}
        <div>
          <ExpenseList
            expenses={expenses}
            categories={categories}
            onEditExpense={(expense) => {
              setEditingExpense(expense);
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
            onDeleteExpense={handleDeleteExpense}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </main>

      {/* Category Manager Modal */}
      <CategoryManager
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        expenses={expenses}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Data Backup Modal */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        expenses={expenses}
        categories={categories}
        onImportData={handleImportData}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
}
