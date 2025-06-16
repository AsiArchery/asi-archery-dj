
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorfulProgressBar } from '@/components/ColorfulProgressBar';

interface SignalDisplayProps {
  rssi: number;
  currentVolume: number;
  maxVolume: number;
  isConnected: boolean;
  getSignalStrength: (rssi: number) => number;
}

export const SignalDisplay: React.FC<SignalDisplayProps> = ({
  rssi,
  currentVolume,
  maxVolume,
  isConnected,
  getSignalStrength
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-lg border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700 text-left">Bluetooth Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {Math.round(getSignalStrength(rssi))}%
            </div>
            <div className="text-sm text-gray-600">
              RSSI: {Math.round(rssi)} dBm
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {isConnected ? "Live Data" : "Simulated"}
            </div>
          </div>
          <ColorfulProgressBar 
            value={getSignalStrength(rssi)} 
            type="rssi"
            className="h-6"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Far</span>
            <span>Close</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-700 text-left">Volume Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">
              {currentVolume}
            </div>
            <div className="text-sm text-gray-600">
              out of {maxVolume}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {isConnected ? "Sent to Speaker" : "Calculated"}
            </div>
          </div>
          <ColorfulProgressBar 
            value={(currentVolume / maxVolume) * 100} 
            type="volume"
            className="h-6"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Quiet</span>
            <span>Loud</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
