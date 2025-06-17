
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bluetooth } from 'lucide-react';

interface BluetoothConnectionProps {
  isInitialized: boolean;
  isConnected: boolean;
  connectedDevice: { deviceId: string; name: string; rssi: number } | null;
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
        <CardTitle className="flex items-center gap-2 text-right">
          <Bluetooth className="w-5 h-5 text-purple-600" />
          חיבור אודיו
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg text-right">
              <strong>הוראות הגדרה:</strong>
              <ol className="mt-2 mr-4 list-decimal space-y-1 text-right">
                <li>חבר את רמקול הבלוטות דרך הגדרות הטלפון</li>
                <li>לחץ על "התחבר לאודיו" למטה</li>
                <li>האפליקציה תשלוט על העוצמה אוטומטית לפי המרחק</li>
              </ol>
            </div>
            
            <div className="flex items-center justify-between">
              <Button 
                onClick={connectToSystemAudio}
                disabled={!isInitialized}
                className="min-w-[140px]"
              >
                <Bluetooth className="w-4 h-4 ml-2" />
                התחבר לאודיו
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-600">סטטוס</p>
                <p className="font-medium">מready להתחברות</p>
              </div>
            </div>
          </div>
        )}

        {isConnected && connectedDevice && (
          <div className="flex items-center justify-between">
            <Button 
              onClick={disconnect}
              variant="destructive"
              className="min-w-[120px]"
            >
              התנתק
            </Button>
            <div className="text-right">
              <p className="text-sm text-gray-600">מחובר ל</p>
              <p className="font-medium">{connectedDevice.name}</p>
              <p className="text-xs text-green-600">✓ בקרת אודיו פעילה</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
