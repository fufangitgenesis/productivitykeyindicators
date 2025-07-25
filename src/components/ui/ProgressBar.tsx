import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'green';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showValue?: boolean;
}

export function ProgressBar({ 
  value, 
  max, 
  color = 'blue', 
  size = 'md', 
  label, 
  showValue = false 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const isOverTarget = value > max;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && (
            <span className={clsx(
              'text-sm font-medium',
              isOverTarget ? 'text-red-600' : 'text-gray-600'
            )}>
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'bg-gray-200 rounded-full overflow-hidden',
          {
            'h-2': size === 'sm',
            'h-3': size === 'md',
            'h-4': size === 'lg',
          }
        )}
      >
        <div
          className={clsx(
            'transition-all duration-500 ease-out rounded-full',
            {
              'bg-gradient-to-r from-blue-500 to-blue-600': color === 'blue',
              'bg-gradient-to-r from-emerald-500 to-emerald-600': color === 'emerald',
              'bg-gradient-to-r from-amber-500 to-amber-600': color === 'amber',
              'bg-gradient-to-r from-red-500 to-red-600': color === 'red',
              'bg-gradient-to-r from-purple-500 to-purple-600': color === 'purple',
              'bg-gradient-to-r from-green-500 to-green-600': color === 'green',
            }
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}