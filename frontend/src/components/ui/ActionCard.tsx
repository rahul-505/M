import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ActionCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

export default function ActionCard({ icon: Icon, iconClassName = 'text-blue-600', title, subtitle, onClick }: ActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-4 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500/60 hover:shadow-md transition-all duration-200"
    >
      <Icon className={`mb-2 ${iconClassName} transition-transform duration-200 group-hover:scale-110`} size={22} aria-hidden="true" />
      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</div>
    </button>
  );
}
