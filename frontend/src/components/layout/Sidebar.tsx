import React from 'react';
import { HeartPulse } from 'lucide-react';
import SidebarItem from './SidebarItem';
import type { NavItem } from '@/lib/types';

export interface SidebarProps {
  navItems: NavItem[];
  activeTab: string;
  onSelect: (id: string) => void;
}

const GROUPS: NavItem['group'][] = ['Main', 'Tools', 'Urgent'];

export default function Sidebar({ navItems, activeTab, onSelect }: SidebarProps) {
  return (
    <nav
      className="w-[220px] bg-[#0A1628] flex flex-col flex-shrink-0"
      aria-label="Primary navigation"
    >
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold rounded-lg shadow-lg shadow-blue-900/40">
          <HeartPulse size={18} aria-hidden="true" />
        </div>
        <div>
          <div className="text-white text-sm font-bold tracking-tight leading-tight">MedMind</div>
          <div className="text-slate-400 text-[10px]">AI Health Platform</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {GROUPS.map(group => (
          <div key={group} className="mb-4">
            <div className="px-4 py-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">{group}</div>
            {navItems.filter(item => item.group === group).map(item => (
              <SidebarItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeTab === item.id}
                onClick={() => onSelect(item.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
