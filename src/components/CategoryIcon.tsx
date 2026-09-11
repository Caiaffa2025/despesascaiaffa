import React from 'react';
import {
  Home,
  Zap,
  ShoppingCart,
  Wifi,
  Wrench,
  Utensils,
  Film,
  Car,
  HeartPulse,
  ShoppingBag,
  Tv,
  BookOpen,
  DollarSign,
  Tag,
  Briefcase,
  Smile,
  Gift,
  Coffee,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const ICON_OPTIONS = [
  { name: 'Home', label: 'Casa', icon: Home },
  { name: 'Zap', label: 'Energia/Contas', icon: Zap },
  { name: 'ShoppingCart', label: 'Mercado', icon: ShoppingCart },
  { name: 'Wifi', label: 'Internet', icon: Wifi },
  { name: 'Wrench', label: 'Manutenção', icon: Wrench },
  { name: 'Utensils', label: 'Alimentação', icon: Utensils },
  { name: 'Film', label: 'Lazer', icon: Film },
  { name: 'Car', label: 'Transporte', icon: Car },
  { name: 'HeartPulse', label: 'Saúde', icon: HeartPulse },
  { name: 'ShoppingBag', label: 'Vestuário', icon: ShoppingBag },
  { name: 'Tv', label: 'Assinaturas', icon: Tv },
  { name: 'BookOpen', label: 'Educação', icon: BookOpen },
  { name: 'Coffee', label: 'Café', icon: Coffee },
  { name: 'Gift', label: 'Presentes', icon: Gift },
  { name: 'Briefcase', label: 'Trabalho', icon: Briefcase },
  { name: 'Smile', label: 'Outros', icon: Smile },
  { name: 'Tag', label: 'Etiqueta', icon: Tag },
  { name: 'DollarSign', label: 'Dinheiro', icon: DollarSign },
];

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  const found = ICON_OPTIONS.find((item) => item.name === name);
  const IconComponent = found ? found.icon : Tag;
  return <IconComponent {...props} />;
};
