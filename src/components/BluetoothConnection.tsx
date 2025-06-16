
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bluetooth, Scan } from 'lucide-react';
import { BluetoothDeviceInfo } from '@/services/bluetoothService';

interface BluetoothConnectionProps {
  isInitialized: boolean;
  isConnected: boolean;
  isScanning: boolean;
  discoveredDevices: BluetoothDeviceInfo[];
  connectedDevice: BluetoothDeviceInfo | null;
  startScan: () => void;
  connectToDevice: (deviceId: string, deviceName: string) => void;
  disconnect: () => void;
}

export const BluetoothConnection: React.FC<BluetoothConnectionProps> = ({
  isInitialized,
  isConnected,
  isScanning,
  discoveredDevices,
  connectedDevice,
  startScan,
  connectToDevice,
  disconnect
}) => {
  return (
    <Card className="shadow-lg border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bluetooth className="w-5 h-5 text-purple-600" />
          חיבור Bluetooth נטיבי
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">סטטוס</p>
                <p className="font-medium">
                  {isScanning ? 'סורק...' : 'לא מחובר'}
                </p>
              </div>
              <Button 
                onClick={startScan}
                disabled={!isInitialized || isScanning}
                className="min-w-[120px]"
              >
                <Scan className="w-4 h-4 mr-2" />
                {isScanning ? 'סורק...' : 'סרוק התקנים'}
              </Button>
            </div>

            {/* Discovered Devices */}
            {discoveredDevices.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">התקנים שנמצאו:</p>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {discoveredDevices.map((device: BluetoothDeviceInfo) => (
                    <div key={device.deviceId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-xs text-gray-500">RSSI: {device.rssi} dBm</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => connectToDevice(device.deviceId, device.name)}
                      >
                        התחבר
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {isConnected && connectedDevice && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">מחובר ל</p>
              <p className="font-medium">{connectedDevice.name}</p>
            </div>
            <Button 
              onClick={disconnect}
              variant="destructive"
              className="min-w-[120px]"
            >
              נתק
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
