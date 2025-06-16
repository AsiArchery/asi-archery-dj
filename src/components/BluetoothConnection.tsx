
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bluetooth } from 'lucide-react';
import { BluetoothDeviceInfo } from '@/services/bluetoothService';

interface BluetoothConnectionProps {
  isInitialized: boolean;
  isConnected: boolean;
  connectedDevice: BluetoothDeviceInfo | null;
  connectToSystemAudio: () => void;
  disconnect: () => void;
}

export const BluetoothConnection: React.FC<BluetoothConnectionProps> = ({
  isInitialized,
  isConnected,
  connectedDevice,
  connectToSystemAudio,
  disconnect
}) => {
  return (
    <Card className="shadow-lg border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bluetooth className="w-5 h-5 text-purple-600" />
          Audio Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <strong>Setup Instructions:</strong>
              <ol className="mt-2 ml-4 list-decimal space-y-1">
                <li>Connect your Bluetooth speaker via phone settings</li>
                <li>Click "Connect to Audio" below</li>
                <li>The app will automatically control volume based on distance</li>
              </ol>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">Ready to Connect</p>
              </div>
              <Button 
                onClick={connectToSystemAudio}
                disabled={!isInitialized}
                className="min-w-[140px]"
              >
                <Bluetooth className="w-4 h-4 mr-2" />
                Connect to Audio
              </Button>
            </div>
          </div>
        )}

        {isConnected && connectedDevice && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected to</p>
              <p className="font-medium">{connectedDevice.name}</p>
              <p className="text-xs text-green-600">✓ Audio control active</p>
            </div>
            <Button 
              onClick={disconnect}
              variant="destructive"
              className="min-w-[120px]"
            >
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
