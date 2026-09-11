import React from 'react';
import { Category, Expense } from '../types';
import { calculateSummary, formatCurrency } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Home, User, PieChart as PieIcon, BarChart3, TrendingUp, Award, Layers } from 'lucide-react';

interface AnalyticsChartsProps {
  expenses: Expense[];
  categories: Category[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ expenses, categories }) => {
  const summary = calculateSummary(expenses);

  const categoryMap = new Map<string, Category>();
  categories.forEach((cat) => categoryMap.set(cat.id, cat));

  // Category breakdown calculation
  const categoryTotals = new Map<string, number>();
  expenses.forEach((exp) => {
    const current = categoryTotals.get(exp.categoryId) || 0;
    categoryTotals.set(exp.categoryId, current + exp.amount);
  });

  const categoryChartData = Array.from(categoryTotals.entries())
    .map(([catId, total]) => {
      const cat = categoryMap.get(catId);
      return {
        name: cat ? cat.name : 'Outros',
        value: total,
        color: cat ? cat.color : '#64748B',
        type: cat ? cat.type : 'ambas',
      };
    })
    .sort((a, b) => b.value - a.value);

  // Type breakdown for Bar Chart
  const typeBarData = [
    { name: 'Casa', valor: summary.totalCasa, fill: '#2563EB' },
    { name: 'Pessoal', valor: summary.totalPessoal, fill: '#9333EA' },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Calculation Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Distribuição Automática de Gastos</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            Total: {formatCurrency(summary.totalGeneral)}
          </span>
        </div>

        {/* Visual Split Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner p-0.5">
            <div
              style={{ width: `${summary.percentCasa}%` }}
              className="bg-blue-600 h-full rounded-l-full transition-all duration-500 relative group"
              title={`Casa: ${summary.percentCasa.toFixed(1)}%`}
            />
            <div
              style={{ width: `${summary.percentPessoal}%` }}
              className="bg-purple-600 h-full rounded-r-full transition-all duration-500 relative group"
              title={`Pessoal: ${summary.percentPessoal.toFixed(1)}%`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1 font-medium">
            <div className="flex items-center gap-2 text-blue-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Gastos de Casa: <strong>{summary.percentCasa.toFixed(1)}%</strong> ({formatCurrency(summary.totalCasa)})</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span>Gastos Pessoais: <strong>{summary.percentPessoal.toFixed(1)}%</strong> ({formatCurrency(summary.totalPessoal)})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 md:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <span>Gastos por Categoria</span>
              </h3>
              <p className="text-xs text-slate-400">Proporção dos maiores lançamentos</p>
            </div>
          </div>

          {categoryChartData.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Nenhum dado para exibir no gráfico
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Valor']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {categoryChartData.map((item, i) => {
                  const percentage = summary.totalGeneral > 0 ? (item.value / summary.totalGeneral) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-700 font-medium truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0 ml-2">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Casa vs Pessoal Bar Comparison Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 md:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Comparativo Casa vs Pessoal</span>
              </h3>
              <p className="text-xs text-slate-400">Total acumulado por grupo</p>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Total']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-around text-xs text-slate-600">
            <div className="text-center">
              <span className="text-[11px] text-slate-400 block">Média por Lançamento</span>
              <span className="font-bold text-slate-800 text-sm">{formatCurrency(summary.avgExpense)}</span>
            </div>
            {summary.maxExpense && (
              <div className="text-center">
                <span className="text-[11px] text-slate-400 block">Maior Despesa</span>
                <span className="font-bold text-slate-800 text-sm" title={summary.maxExpense.title}>
                  {formatCurrency(summary.maxExpense.amount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
