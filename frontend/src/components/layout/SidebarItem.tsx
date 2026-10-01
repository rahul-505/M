import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export default function SidebarItem({ label, icon: Icon, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`relative w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-all duration-200 ${
        isActive
          ? 'bg-blue-600/15 text-blue-400'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
      }`}
    >
      <span
        className={`absolute left-0 top-1 bottom-1 w-[2.5px] rounded-full bg-blue-500 transition-opacity duration-200 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
      <Icon size={16} aria-hidden="true" />
      {label}
    </button>
  );
}
