
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
  const normalizedValue = Math.max(0, Math.min(100, value));
  
  // Calculate color based on progress
  const getProgressColor = () => {
    if (type === 'rssi') {
      // For RSSI: Red (poor) to Green (good)
      if (normalizedValue <= 25) return '#ef4444'; // Red
      if (normalizedValue <= 50) return '#f59e0b'; // Orange  
      if (normalizedValue <= 75) return '#eab308'; // Yellow
      return '#10b981'; // Green
    } else {
      // For Volume: Green (low) to Red (high)
      if (normalizedValue <= 25) return '#10b981'; // Green
      if (normalizedValue <= 50) return '#22c55e'; // Light Green
      if (normalizedValue <= 75) return '#eab308'; // Yellow
      return '#ef4444'; // Red
    }
  };

  return (
    <div className={cn("relative w-full overflow-hidden rounded-full bg-gray-200", className)}>
      <div 
        className="h-full transition-all duration-300 ease-out"
        style={{ 
          width: `${normalizedValue}%`,
          backgroundColor: getProgressColor()
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};
