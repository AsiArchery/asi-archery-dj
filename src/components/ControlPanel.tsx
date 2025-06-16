
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Play, Pause } from 'lucide-react';
import { VolumeSlider } from '@/components/VolumeSlider';

interface ControlPanelProps {
  isAutoMode: boolean;
  isConnected: boolean;
  targetDistance: string;
  initialVolume: number[];
  minVolume: number[];
  maxVolume: number[];
  toggleAutoMode: () => void;
  setTargetDistance: (value: string) => void;
  setInitialVolume: (value: number[]) => void;
  setMinVolume: (value: number[]) => void;
  setMaxVolume: (value: number[]) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isAutoMode,
  isConnected,
  targetDistance,
  initialVolume,
  minVolume,
  maxVolume,
  toggleAutoMode,
  setTargetDistance,
  setInitialVolume,
  setMinVolume,
  setMaxVolume
}) => {
  return (
    <Card className="shadow-lg border-2 border-purple-200">
      <CardHeader>
        <CardTitle>הגדרות בקרה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            {isAutoMode ? (
              <Play className="w-5 h-5 text-green-600" />
            ) : (
              <Pause className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <Label className="text-base font-medium">
                בקרה אוטומטית
              </Label>
              <p className="text-sm text-gray-600">
                {isAutoMode ? 'מופעל - הווליום מתכוונן אוטומטית' : 'כבוי - בקרה ידנית'}
              </p>
            </div>
          </div>
          <Switch
            checked={isAutoMode}
            onCheckedChange={toggleAutoMode}
            disabled={!isConnected}
          />
        </div>

        <Separator />

        {/* Target Distance */}
        <div className="space-y-2">
          <Label>מרחק למטרה (מטר)</Label>
          <Select value={targetDistance} onValueChange={setTargetDistance}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18">18 מטר</SelectItem>
              <SelectItem value="50">50 מטר</SelectItem>
              <SelectItem value="60">60 מטר</SelectItem>
              <SelectItem value="70">70 מטר</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Volume Controls with Colorful Sliders */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>ווליום התחלתי: {initialVolume[0]}</Label>
            <VolumeSlider
              value={initialVolume}
              onValueChange={setInitialVolume}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>ווליום מינימום: {minVolume[0]}</Label>
            <VolumeSlider
              value={minVolume}
              onValueChange={setMinVolume}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>ווליום מקסימום: {maxVolume[0]}</Label>
            <VolumeSlider
              value={maxVolume}
              onValueChange={setMaxVolume}
              min={1}
              max={10}
              step={1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
