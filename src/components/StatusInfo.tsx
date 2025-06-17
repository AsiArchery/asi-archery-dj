
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
        <CardTitle className="text-left">Additional Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-left">
            <span className="text-gray-600">Target Distance:</span>
            <span className="font-medium ml-2">{targetDistance}m</span>
          </div>
          <div className="text-left">
            <span className="text-gray-600">Calculated Volume:</span>
            <span className="font-medium ml-2">{calculateVolume(rssi)}</span>
          </div>
          <div className="text-left">
            <span className="text-gray-600">Volume Range:</span>
            <span className="font-medium ml-2">{minVolume[0]}-{maxVolume[0]}</span>
          </div>
          <div className="text-left">
            <span className="text-gray-600">Mode:</span>
            <span className="font-medium ml-2">
              {isAutoMode ? 'Automatic' : 'Manual'}
            </span>
          </div>
          <div className="col-span-2 text-left">
            <span className="text-gray-600">Connection Status:</span>
            <span className={`font-medium ml-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? `Connected to ${connectedDevice?.name}` : 'Not Connected'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
