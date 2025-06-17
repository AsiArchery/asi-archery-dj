
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BleDevice } from '@capacitor-community/bluetooth-le';

interface StatusInfoProps {
  targetDistance: string;
  minVolume: number[];
  maxVolume: number[];
  isAutoMode: boolean;
  isConnected: boolean;
  connectedDevice: { deviceId: string; name: string; rssi: number } | null;
  calculateVolume: (rssi: number) => number;
  rssi: number;
}

export const StatusInfo: React.FC<StatusInfoProps> = ({
  targetDistance,
  minVolume,
  maxVolume,
  isAutoMode,
  isConnected,
  connectedDevice,
  calculateVolume,
  rssi
}) => {
  return (
    <Card className="shadow-lg border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="text-left">מידע נוסף</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-right">
            <span className="text-gray-600">מרחק יעד:</span>
            <span className="font-medium mr-2">{targetDistance}m</span>
          </div>
          <div className="text-right">
            <span className="text-gray-600">עוצמה מחושבת:</span>
            <span className="font-medium mr-2">{calculateVolume(rssi)}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-600">טווח עוצמה:</span>
            <span className="font-medium mr-2">{minVolume[0]}-{maxVolume[0]}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-600">מצב:</span>
            <span className="font-medium mr-2">
              {isAutoMode ? 'אוטומטי' : 'ידני'}
            </span>
          </div>
          <div className="col-span-2 text-right">
            <span className="text-gray-600">סטטוס חיבור:</span>
            <span className={`font-medium mr-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? `מחובר ל-${connectedDevice?.name}` : 'לא מחובר'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
