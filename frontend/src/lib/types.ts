import type { LucideIcon } from 'lucide-react';

export type StatusTone = 'success' | 'warning' | 'critical' | 'info' | 'neutral';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  group: 'Main' | 'Tools' | 'Urgent';
}

export interface Specialty {
  name: string;
  icon: LucideIcon;
  color: string;
  count: number;
}

export interface Doctor {
  name: string;
  spec: string;
  exp: string;
  hosp: string;
  rating: string;
  initial: string;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export interface MedResult {
  name: string;
  info: string;
}

export interface NewsArticle {
  title: string;
  description?: string;
  link?: string;
}

export interface StatCardData {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  tone: StatusTone;
  statusLabel: string;
  trend?: number[];
}

export interface ActivityItem {
  title: string;
  subtitle: string;
  tone: StatusTone;
  statusLabel: string;
  date: string;
}
