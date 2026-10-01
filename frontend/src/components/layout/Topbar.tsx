import React from 'react';
import { Moon, Sun, Bell, AlertTriangle } from 'lucide-react';

export interface TopbarProps {
  title?: string;
  subtitle?: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  alertCount: number;
  onSos: () => void;
}

export default function Topbar({ title, subtitle, darkMode, onToggleDarkMode, alertCount, onSos }: TopbarProps) {
  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h1>
        <div className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          type="button"
          aria-label={`${alertCount} unread alerts`}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
        >
          <Bell size={16} />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={onSos}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg uppercase tracking-wide shadow-sm shadow-rose-600/20 transition-all duration-200"
        >
          <AlertTriangle size={14} aria-hidden="true" /> SOS
        </button>
      </div>
    </header>
  );
}
