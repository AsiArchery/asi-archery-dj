
import React from 'react';
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface VolumeSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  value,
  onValueChange,
  min,
  max,
  step,
  className
}) => {
  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
    >
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-gray-200">
        {/* Active range with gradient that shows progressively */}
        <SliderPrimitive.Range 
          className="absolute h-full transition-all duration-200"
          style={{
            background: `linear-gradient(90deg, #10b981 0%, ${percentage > 50 ? '#eab308' : '#10b981'} 50%, ${percentage > 75 ? '#ef4444' : percentage > 50 ? '#eab308' : '#10b981'} 100%)`,
            backgroundSize: '100% 100%'
          }}
        />
      </SliderPrimitive.Track>
      
      <SliderPrimitive.Thumb 
        className="block h-6 w-6 rounded-full border-2 border-white shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        style={{
          backgroundColor: percentage <= 25 ? '#10b981' : 
                          percentage <= 50 ? '#22c55e' :
                          percentage <= 75 ? '#eab308' : '#ef4444'
        }}
      />
    </SliderPrimitive.Root>
  );
};
