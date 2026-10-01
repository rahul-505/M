import React from 'react';
import Badge from './ui/Badge';
import type { ActivityItem } from '@/lib/types';

export interface RecentActivityProps {
  items: ActivityItem[];
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <ol className="relative bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
      {items.map((item, i) => (
        <li key={i} className="p-3.5 flex justify-between items-center gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-200">
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.subtitle} · {item.date}</div>
          </div>
          <Badge tone={item.tone} className="flex-shrink-0">{item.statusLabel}</Badge>
        </li>
      ))}
    </ol>
  );
}
