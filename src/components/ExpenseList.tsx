import React, { useState } from 'react';
import { Category, Expense, FilterState } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatDate, formatMonthYear, getAvailableMonths } from '../utils/formatters';
import { Search, Filter, Home, User, Edit2, Trash2, ArrowUpDown, Calendar, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  categories,
  onEditExpense,
  onDeleteExpense,
  filter,
  onFilterChange,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const availableMonths = getAvailableMonths(expenses);

  const categoryMap = new Map<string, Category>();
  categories.forEach((cat) => categoryMap.set(cat.id, cat));

  // Filter logic
  const filtered = expenses.filter((exp) => {
    // Type filter
    if (filter.type !== 'todos' && exp.type !== filter.type) {
      return false;
    }
    // Category filter
    if (filter.categoryId && exp.categoryId !== filter.categoryId) {
      return false;
    }
    // Month filter
    if (filter.month && filter.month !== 'todos') {
      if (!exp.date.startsWith(filter.month)) return false;
    }
    // Search query
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase();
      const titleMatch = exp.title.toLowerCase().includes(q);
      const notesMatch = exp.notes?.toLowerCase().includes(q) || false;
      const cat = categoryMap.get(exp.categoryId);
      const catMatch = cat?.name.toLowerCase().includes(q) || false;
      if (!titleMatch && !notesMatch && !catMatch) return false;
    }
    return true;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    let res = 0;
    if (filter.sortBy === 'date') {
      res = b.date.localeCompare(a.date);
    } else if (filter.sortBy === 'amount') {
      res = b.amount - a.amount;
    } else if (filter.sortBy === 'title') {
      res = a.title.localeCompare(b.title);
    }
    return filter.sortOrder === 'asc' ? -res : res;
  });

  const filteredTotal = sorted.reduce((sum, item) => sum + item.amount, 0);

  const confirmAndDelete = (id: string) => {
    onDeleteExpense(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 md:p-6 space-y-5">
      {/* List Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>Lista de Despesas</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {sorted.length} {sorted.length === 1 ? 'item' : 'itens'}
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Filtre, pesquise, edite ou exclua seus lançamentos
          </p>
        </div>

        {/* Filter by Type Tab */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start lg:self-auto">
          <button
            onClick={() => onFilterChange({ ...filter, type: 'todos' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter.type === 'todos'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => onFilterChange({ ...filter, type: 'casa' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter.type === 'casa'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Casa</span>
          </button>
          <button
            onClick={() => onFilterChange({ ...filter, type: 'pessoal' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter.type === 'pessoal'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Pessoal</span>
          </button>
        </div>
      </div>

      {/* Secondary Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            placeholder="Pesquisar por nome ou obs..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={filter.categoryId}
            onChange={(e) => onFilterChange({ ...filter, categoryId: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 text-slate-700 font-medium"
          >
            <option value="">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.type === 'casa' ? 'Casa' : cat.type === 'pessoal' ? 'Pessoal' : 'Ambas'})
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <select
            value={filter.month}
            onChange={(e) => onFilterChange({ ...filter, month: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 text-slate-700 font-medium"
          >
            <option value="todos">Todos os Meses</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonthYear(m)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={`${filter.sortBy}-${filter.sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-') as [
                'date' | 'amount' | 'title',
                'asc' | 'desc'
              ];
              onFilterChange({ ...filter, sortBy: sb, sortOrder: so });
            }}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 text-slate-700 font-medium"
          >
            <option value="date-desc">Data (Mais recentes)</option>
            <option value="date-asc">Data (Mais antigas)</option>
            <option value="amount-desc">Valor (Maior primeiro)</option>
            <option value="amount-asc">Valor (Menor primeiro)</option>
            <option value="title-asc">Nome (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Summary line of current filtered view */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium">
        <span>Soma dos itens filtrados:</span>
        <span className="font-bold text-slate-900 text-sm">{formatCurrency(filteredTotal)}</span>
      </div>

      {/* Items list */}
      <div className="space-y-2.5">
        {sorted.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Nenhuma despesa encontrada</p>
            <p className="text-xs text-slate-400 mt-1">
              Tente alterar os filtros acima ou cadastre uma nova despesa no formulário.
            </p>
          </div>
        ) : (
          sorted.map((item) => {
            const cat = categoryMap.get(item.categoryId);
            const isDeletingThis = deleteConfirmId === item.id;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDeletingThis
                    ? 'border-red-200 bg-red-50/40'
                    : 'border-slate-100 hover:border-slate-200 bg-white hover:shadow-xs'
                }`}
              >
                {/* Left: Category Icon + Details */}
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div
                    style={{ backgroundColor: cat ? cat.color : '#64748B' }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5 sm:mt-0"
                  >
                    <CategoryIcon name={cat ? cat.icon : 'Tag'} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-800 truncate">
                        {item.title}
                      </span>

                      {/* Type Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                          item.type === 'casa'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-purple-50 text-purple-700 border border-purple-100'
                        }`}
                      >
                        {item.type === 'casa' ? (
                          <>
                            <Home className="w-3 h-3" />
                            Casa
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            Pessoal
                          </>
                        )}
                      </span>

                      {/* Category Badge */}
                      {cat && (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {cat.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDate(item.date)}
                      </span>
                      {item.notes && (
                        <span className="flex items-center gap-1 text-slate-500 italic max-w-xs truncate">
                          <FileText className="w-3 h-3" />
                          {item.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount + Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 block">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>

                  {isDeletingThis ? (
                    <div className="flex items-center gap-1 bg-red-100 p-1 rounded-lg">
                      <span className="text-[11px] font-bold text-red-700 px-1">Excluir?</span>
                      <button
                        onClick={() => confirmAndDelete(item.id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs font-semibold transition-colors"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditExpense(item)}
                        title="Editar Despesa"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        title="Excluir Despesa"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
