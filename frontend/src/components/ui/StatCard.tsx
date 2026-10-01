import React from 'react';
import Badge from './Badge';
import Sparkline from './Sparkline';
import type { StatCardData } from '@/lib/types';

const ICON_TONE_CLASSES: Record<StatCardData['tone'], string> = {
  success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
  warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
  critical: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10',
  info: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
  neutral: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/40',
};

export default function StatCard({ label, value, unit, icon: Icon, tone, statusLabel, trend }: StatCardData) {
  return (
    <div
      className="group bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-4 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
      role="group"
      aria-label={`${label}: ${value}${unit ?? ''}, status ${statusLabel}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ICON_TONE_CLASSES[tone]}`}>
          <Icon size={16} aria-hidden="true" />
        </div>
        {trend && <Sparkline points={trend} tone={tone} />}
      </div>
      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mt-3">
        {label}
      </div>
      <div className="text-2xl font-black mt-1 text-slate-800 dark:text-white">
        {value} {unit && <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{unit}</span>}
      </div>
      <Badge tone={tone} className="mt-2">{statusLabel}</Badge>
    </div>
  );
}
