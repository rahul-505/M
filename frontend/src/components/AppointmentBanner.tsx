import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Badge from './ui/Badge';

export interface AppointmentBannerProps {
  doctorName: string;
  specialty: string;
  date: string;
  daysAway: number;
  location: string;
  onReschedule: () => void;
}

export default function AppointmentBanner({
  doctorName,
  specialty,
  date,
  daysAway,
  location,
  onReschedule,
}: AppointmentBannerProps) {
  return (
    <section
      aria-label="Upcoming appointment"
      className="rounded-xl border border-blue-800/30 bg-gradient-to-r from-blue-700 to-blue-600 dark:from-slate-900 dark:to-slate-900 dark:border-blue-900/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="hidden sm:flex w-10 h-10 rounded-lg bg-white/15 dark:bg-blue-500/10 items-center justify-center flex-shrink-0">
          <Calendar size={18} className="text-white dark:text-blue-400" aria-hidden="true" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info" className="!bg-white/15 dark:!bg-blue-500/15 !text-white dark:!text-blue-300">
              Upcoming
            </Badge>
            <Badge tone="warning" className="!bg-white/15 dark:!bg-amber-500/15 !text-white dark:!text-amber-300">
              {daysAway} days away
            </Badge>
          </div>
          <div className="text-sm font-bold text-white mt-1.5">
            {doctorName} <span className="font-normal text-blue-100 dark:text-slate-400">· {specialty}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-blue-100 dark:text-slate-400 mt-1">
            <span className="flex items-center gap-1"><Clock size={12} aria-hidden="true" /> {date}</span>
            <span className="flex items-center gap-1"><MapPin size={12} aria-hidden="true" /> {location}</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onReschedule}
        className="bg-white text-blue-700 dark:bg-blue-600 dark:text-white text-[11px] font-bold px-3.5 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500 transition-all duration-200 self-start sm:self-center flex-shrink-0"
      >
        Reschedule
      </button>
    </section>
  );
}
