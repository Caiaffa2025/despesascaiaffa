import { Category, Expense } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  // Gastos de Casa
  { id: 'cat-aluguel', name: 'Aluguel / Condomínio', color: '#3B82F6', icon: 'Home', type: 'casa' },
  { id: 'cat-contas', name: 'Luz, Água & Gás', color: '#06B6D4', icon: 'Zap', type: 'casa' },
  { id: 'cat-mercado', name: 'Mercado & Feira', color: '#10B981', icon: 'ShoppingCart', type: 'casa' },
  { id: 'cat-internet', name: 'Internet & Telefone', color: '#6366F1', icon: 'Wifi', type: 'casa' },
  { id: 'cat-manutencao', name: 'Manutenção da Casa', color: '#F59E0B', icon: 'Wrench', type: 'casa' },

  // Gastos Pessoais
  { id: 'cat-alimentacao', name: 'Restaurantes & Delivery', color: '#EF4444', icon: 'Utensils', type: 'pessoal' },
  { id: 'cat-lazer', name: 'Lazer & Cinema', color: '#EC4899', icon: 'Film', type: 'pessoal' },
  { id: 'cat-transporte', name: 'Transporte & Uber', color: '#8B5CF6', icon: 'Car', type: 'pessoal' },
  { id: 'cat-saude', name: 'Saúde & Farmácia', color: '#14B8A6', icon: 'HeartPulse', type: 'pessoal' },
  { id: 'cat-vestuario', name: 'Roupas & Acessórios', color: '#F97316', icon: 'ShoppingBag', type: 'pessoal' },
  { id: 'cat-assinaturas', name: 'Assinaturas & Streaming', color: '#A855F7', icon: 'Tv', type: 'pessoal' },
  { id: 'cat-educacao', name: 'Cursos & Livros', color: '#0284C7', icon: 'BookOpen', type: 'pessoal' },
];

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = String(today.getMonth() + 1).padStart(2, '0');

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Aluguel do Apartamento',
    amount: 1850.00,
    type: 'casa',
    categoryId: 'cat-aluguel',
    date: `${currentYear}-${currentMonth}-05`,
    notes: 'Pago via PIX',
  },
  {
    id: 'exp-2',
    title: 'Supermercado Mensal',
    amount: 780.50,
    type: 'casa',
    categoryId: 'cat-mercado',
    date: `${currentYear}-${currentMonth}-08`,
    notes: 'Compras do mês',
  },
  {
    id: 'exp-3',
    title: 'Conta de Luz & Água',
    amount: 245.80,
    type: 'casa',
    categoryId: 'cat-contas',
    date: `${currentYear}-${currentMonth}-10`,
  },
  {
    id: 'exp-4',
    title: 'Plano de Internet Fibra',
    amount: 119.90,
    type: 'casa',
    categoryId: 'cat-internet',
    date: `${currentYear}-${currentMonth}-12`,
  },
  {
    id: 'exp-5',
    title: 'Jantar no Fim de Semana',
    amount: 142.00,
    type: 'pessoal',
    categoryId: 'cat-alimentacao',
    date: `${currentYear}-${currentMonth}-06`,
    notes: 'Pizzaria com amigos',
  },
  {
    id: 'exp-6',
    title: 'Combustível do Carro',
    amount: 220.00,
    type: 'pessoal',
    categoryId: 'cat-transporte',
    date: `${currentYear}-${currentMonth}-09`,
  },
  {
    id: 'exp-7',
    title: 'Remédios na Farmácia',
    amount: 85.30,
    type: 'pessoal',
    categoryId: 'cat-saude',
    date: `${currentYear}-${currentMonth}-11`,
  },
  {
    id: 'exp-8',
    title: 'Netflix + Spotify',
    amount: 76.80,
    type: 'pessoal',
    categoryId: 'cat-assinaturas',
    date: `${currentYear}-${currentMonth}-02`,
  },
];
