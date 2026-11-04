import React from 'react';
import {
  ShoppingBag,
  BookOpen,
  FileText,
  FlaskConical,
  GraduationCap,
  Printer,
  Cpu,
  Package
} from 'lucide-react';

const iconMap = {
  ShoppingBag,
  BookOpen,
  FileText,
  FlaskConical,
  GraduationCap,
  Printer,
  Cpu,
  Package
};

export default function CategoryIcon({ name, size = 20, className = '' }) {
  const IconComponent = iconMap[name] || Package;
  return <IconComponent size={size} className={className} />;
}
