import React from 'react';
import type { StatusTone } from '@/lib/types';

const STROKE_CLASSES: Record<StatusTone, string> = {
  success: 'stroke-emerald-500',
  warning: 'stroke-amber-500',
  critical: 'stroke-rose-500',
  info: 'stroke-blue-500',
  neutral: 'stroke-slate-400',
};

export interface SparklineProps {
  points: number[];
  tone?: StatusTone;
  width?: number;
  height?: number;
}

/** Minimal inline trend line — no external chart library needed for a 4-6 point sparkline. */
export default function Sparkline({ points, tone = 'neutral', width = 64, height = 24 }: SparklineProps) {
  if (!points || points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);

  const path = points
    .map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      role="img"
      aria-label="Trend sparkline"
    >
      <path
        d={path}
        fill="none"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={STROKE_CLASSES[tone]}
      />
    </svg>
  );
}
