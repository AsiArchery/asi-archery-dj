
import React from 'react';
import { cn } from '@/lib/utils';

interface ColorfulProgressBarProps {
  value: number;
  type: 'rssi' | 'volume';
  className?: string;
}

export const ColorfulProgressBar: React.FC<ColorfulProgressBarProps> = ({
  value,
  type,
  className
}) => {
  // For RSSI: Green (good signal) to Red (poor signal)
  // For Volume: Green (low) to Red (high)
  const getGradientClass = () => {
    if (type === 'rssi') {
      return 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500';
    } else {
      return 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500';
    }
  };

  return (
    <div className={cn("relative w-full overflow-hidden rounded-full bg-gray-200", className)}>
      <div 
        className={cn("h-full transition-all duration-300 ease-out", getGradientClass())}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};
