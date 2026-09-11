import React, { useState } from 'react';
import { Category, Expense, ExpenseType } from '../types';
import { CategoryIcon, ICON_OPTIONS } from './CategoryIcon';
import { Plus, Trash2, Edit2, X, Check, FolderPlus, AlertCircle } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  expenses: Expense[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PALETTE = [
  '#3B82F6', '#06B6D4', '#10B981', '#14B8A6', '#6366F1',
  '#8B5CF6', '#A855F7', '#EC4899', '#EF4444', '#F97316',
  '#F59E0B', '#10B981', '#64748B', '#0284C7'
];

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  expenses,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  isOpen,
  onClose,
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [type, setType] = useState<ExpenseType | 'ambas'>('casa');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [icon, setIcon] = useState('Tag');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setType('casa');
    setColor(COLOR_PALETTE[0]);
    setIcon('Tag');
    setEditingCategory(null);
    setIsAddingNew(false);
    setErrorMsg('');
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAddingNew(true);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setType(cat.type);
    setColor(cat.color);
    setIcon(cat.icon);
    setIsAddingNew(false);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Digite um nome para a categoria.');
      return;
    }

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        name: name.trim(),
        type,
        color,
        icon,
      });
    } else {
      onAddCategory({
        name: name.trim(),
        type,
        color,
        icon,
      });
    }

    resetForm();
  };

  const handleDelete = (catId: string, catName: string) => {
    const boundExpenses = expenses.filter((e) => e.categoryId === catId);
    if (boundExpenses.length > 0) {
      if (
        !window.confirm(
          `A categoria "${catName}" possui ${boundExpenses.length} gasto(s) cadastrado(s). Se você excluí-la, os gastos mudarão para "Sem Categoria". Deseja continuar?`
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm(`Tem certeza que deseja excluir a categoria "${catName}"?`)) {
        return;
      }
    }
    onDeleteCategory(catId);
    if (editingCategory?.id === catId) {
      resetForm();
    }
  };

  const categoriesCasa = categories.filter((c) => c.type === 'casa' || c.type === 'ambas');
  const categoriesPessoal = categories.filter((c) => c.type === 'pessoal' || c.type === 'ambas');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Gerenciador de Categorias</h2>
              <p className="text-xs text-slate-500">Adicione, edite ou exclua categorias rapidamente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Form section when editing or adding */}
          {(isAddingNew || editingCategory) && (
            <form onSubmit={handleSubmit} className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-indigo-900">
                  {editingCategory ? `Editar Categoria: ${editingCategory.name}` : 'Nova Categoria'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  Cancelar
                </button>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nome da Categoria</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Supermercado, Perfumaria..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Destinado a</label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-white border border-slate-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setType('casa')}
                      className={`py-1 text-xs font-medium rounded-md transition-colors ${
                        type === 'casa'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🏠 Casa
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('pessoal')}
                      className={`py-1 text-xs font-medium rounded-md transition-colors ${
                        type === 'pessoal'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      👤 Pessoal
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('ambas')}
                      className={`py-1 text-xs font-medium rounded-md transition-colors ${
                        type === 'ambas'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🔄 Ambas
                    </button>
                  </div>
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Cor do Card/Badge</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                        color === c ? 'scale-110 ring-2 ring-indigo-600 ring-offset-2' : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ícone</label>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-white rounded-lg border border-slate-200">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = icon === opt.name;
                    return (
                      <button
                        type="button"
                        key={opt.name}
                        onClick={() => setIcon(opt.name)}
                        title={opt.label}
                        className={`p-2 rounded-lg flex items-center gap-1.5 text-xs transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}</span>
                </button>
              </div>
            </form>
          )}

          {!isAddingNew && !editingCategory && (
            <button
              onClick={handleStartAdd}
              className="w-full py-3 px-4 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Incluir Nova Categoria Rapidamente</span>
            </button>
          )}

          {/* List of categories */}
          <div className="space-y-6">
            {/* Casa Categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Gastos de Casa ({categoriesCasa.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categoriesCasa.map((cat) => {
                  const count = expenses.filter((e) => e.categoryId === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          style={{ backgroundColor: cat.color }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                        >
                          <CategoryIcon name={cat.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{cat.name}</p>
                          <p className="text-[10px] text-slate-400">{count} item(ns)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => handleStartEdit(cat)}
                          title="Editar"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          title="Excluir"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pessoal Categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  Gastos Pessoais ({categoriesPessoal.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categoriesPessoal.map((cat) => {
                  const count = expenses.filter((e) => e.categoryId === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          style={{ backgroundColor: cat.color }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                        >
                          <CategoryIcon name={cat.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{cat.name}</p>
                          <p className="text-[10px] text-slate-400">{count} item(ns)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => handleStartEdit(cat)}
                          title="Editar"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          title="Excluir"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};
