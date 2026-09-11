import React, { useState, useEffect } from 'react';
import { Category, Expense, ExpenseType } from '../types';
import { Plus, Check, Home, User, DollarSign, Calendar, Tag, FileText, Settings, X } from 'lucide-react';

interface ExpenseFormProps {
  categories: Category[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  editingExpense: Expense | null;
  onCancelEdit?: () => void;
  onOpenCategoryManager: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  categories,
  onAddExpense,
  onUpdateExpense,
  editingExpense,
  onCancelEdit,
  onOpenCategoryManager,
}) => {
  const todayISO = new Date().toISOString().split('T')[0];

  const [type, setType] = useState<ExpenseType>('casa');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(todayISO);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Auto filter categories by type
  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === 'ambas'
  );

  useEffect(() => {
    if (editingExpense) {
      setType(editingExpense.type);
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCategoryId(editingExpense.categoryId);
      setDate(editingExpense.date || todayISO);
      setNotes(editingExpense.notes || '');
      setError('');
    } else {
      // Default category if available
      if (filteredCategories.length > 0 && !categoryId) {
        setCategoryId(filteredCategories[0].id);
      }
    }
  }, [editingExpense]);

  // When type changes, adjust category if current category isn't valid for new type
  const handleTypeChange = (newType: ExpenseType) => {
    setType(newType);
    const validCats = categories.filter((c) => c.type === newType || c.type === 'ambas');
    if (validCats.length > 0) {
      setCategoryId(validCats[0].id);
    } else {
      setCategoryId('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Por favor, informe a descrição do gasto.');
      return;
    }

    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Por favor, informe um valor maior que zero.');
      return;
    }

    if (!categoryId) {
      setError('Selecione uma categoria para a despesa.');
      return;
    }

    if (editingExpense) {
      onUpdateExpense({
        ...editingExpense,
        title: title.trim(),
        amount: parsedAmount,
        type,
        categoryId,
        date,
        notes: notes.trim(),
      });
      if (onCancelEdit) onCancelEdit();
    } else {
      onAddExpense({
        title: title.trim(),
        amount: parsedAmount,
        type,
        categoryId,
        date,
        notes: notes.trim(),
      });

      // Clear form
      setTitle('');
      setAmount('');
      setNotes('');
    }
  };

  const addQuickAmount = (delta: number) => {
    const current = parseFloat(amount.replace(',', '.')) || 0;
    setAmount((current + delta).toString());
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 md:p-6 transition-all">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            {editingExpense ? (
              <span className="text-indigo-600">Editar Despesa</span>
            ) : (
              <span>Adicionar Nova Despesa</span>
            )}
          </h2>
          <p className="text-xs text-slate-500">
            {editingExpense ? 'Altere os campos abaixo para atualizar' : 'Lançamento rápido e cálculo automático'}
          </p>
        </div>

        {editingExpense && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Casa vs Pessoal */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tipo de Despesa
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('casa')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                type === 'casa'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Gasto de Casa</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('pessoal')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                type === 'pessoal'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Gasto Pessoal</span>
            </button>
          </div>
        </div>

        {/* Title & Amount Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição / Nome do Gasto
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Supermercado, Aluguel, Farmácia..."
                className="w-full pl-3 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Valor (R$)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                R$
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
          <span className="text-[11px] font-medium text-slate-400 mr-1">+ Atalia:</span>
          {[10, 50, 100, 200, 500].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => addQuickAmount(val)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-[11px] transition-colors"
            >
              +R$ {val}
            </button>
          ))}
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Categoria
              </label>
              <button
                type="button"
                onClick={onOpenCategoryManager}
                className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                <span>Gerenciar</span>
              </button>
            </div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 focus:bg-white transition-all text-slate-800"
            >
              {filteredCategories.length === 0 && (
                <option value="">Nenhuma categoria cadastrada</option>
              )}
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Data do Gasto
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Observações <span className="text-slate-400 font-normal">(Opcional)</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Paguei no cartão de crédito, parcelado 2x..."
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 focus:bg-white transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex gap-2">
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-sm flex items-center justify-center gap-2 transition-all ${
              type === 'casa'
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
            }`}
          >
            {editingExpense ? (
              <>
                <Check className="w-4 h-4" />
                <span>Atualizar Gasto</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Adicionar Gasto</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
