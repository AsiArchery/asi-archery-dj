
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
          <CardTitle className="text-green-700">עוצמת קליטה (RSSI)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {Math.round(getSignalStrength(rssi))}%
            </div>
            <div className="text-sm text-gray-600">
              RSSI: {rssi} dBm
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {isConnected ? "נתונים אמיתיים" : "מצב דמו"}
            </div>
          </div>
          <ColorfulProgressBar 
            value={getSignalStrength(rssi)} 
            type="rssi"
            className="h-6"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>רחוק</span>
            <span>קרוב</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-700">עוצמת ווליום</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">
              {currentVolume}
            </div>
            <div className="text-sm text-gray-600">
              מתוך {maxVolume}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {isConnected ? "נשלח לרמקול" : "מחושב"}
            </div>
          </div>
          <ColorfulProgressBar 
            value={(currentVolume / maxVolume) * 100} 
            type="volume"
            className="h-6"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>שקט</span>
            <span>רם</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
