
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bluetooth, Play, Pause, Target, Scan, Smartphone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useBluetoothNative } from '@/hooks/useBluetoothNative';
import { BluetoothDeviceInfo } from '@/services/bluetoothService';

const Index = () => {
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(5);
  const [targetDistance, setTargetDistance] = useState('50');
  const [initialVolume, setInitialVolume] = useState([3]);
  const [minVolume, setMinVolume] = useState([1]);
  const [maxVolume, setMaxVolume] = useState([10]);
  const { toast } = useToast();

  const {
    isInitialized,
    isConnected,
    isScanning,
    discoveredDevices,
    connectedDevice,
    rssi,
    startScan,
    connectToDevice,
    disconnect,
    setVolume
  } = useBluetoothNative();

  // Calculate normalized RSSI and volume
  const calculateVolume = (rssiValue: number) => {
    const normalized = Math.max(0, Math.min(1, (rssiValue + 100) / 70));
    const volume = minVolume[0] + normalized * (maxVolume[0] - minVolume[0]);
    return Math.round(volume);
  };

  // Auto volume control based on RSSI
  useEffect(() => {
    if (isConnected && isAutoMode) {
      const newVolume = calculateVolume(rssi);
      if (newVolume !== currentVolume) {
        setCurrentVolume(newVolume);
        setVolume(newVolume); // Send to Bluetooth device
      }
    }
  }, [rssi, isConnected, isAutoMode, minVolume, maxVolume, currentVolume]);

  const toggleAutoMode = () => {
    setIsAutoMode(!isAutoMode);
    if (!isAutoMode) {
      toast({
        title: "מצב אוטומטי הופעל",
        description: "הווליום יתכוונן אוטומטיטט לפי המרחק",
      });
    }
  };

  // Convert RSSI to signal strength percentage
  const getSignalStrength = (rssi: number) => {
    return Math.max(0, Math.min(100, ((rssi + 100) / 70) * 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              בקרת ווליום לקשתים
            </h1>
            <Smartphone className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-gray-600">שליטה אוטומטית על עוצמת הקול לפי המרחק מהמטרה</p>
          <div className="text-sm text-green-600 font-medium">
            {isInitialized ? "✓ מצב נטיבי - Bluetooth אמיתי" : "מפעיל מצב נטיבי..."}
          </div>
        </div>

        {/* Bluetooth Connection */}
        <Card className="shadow-lg border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bluetooth className="w-5 h-5 text-blue-600" />
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

        {/* Signal Strength and Volume Display */}
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
              <Progress 
                value={getSignalStrength(rssi)} 
                className="h-4"
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
                  מתוך {maxVolume[0]}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {isConnected ? "נשלח לרמקול" : "מחושב"}
                </div>
              </div>
              <Progress 
                value={(currentVolume / maxVolume[0]) * 100} 
                className="h-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>שקט</span>
                <span>רם</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="shadow-lg border-2 border-blue-200">
          <CardHeader>
            <CardTitle>הגדרות בקרה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
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

            {/* Volume Controls */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>ווליום התחלתי: {initialVolume[0]}</Label>
                <Slider
                  value={initialVolume}
                  onValueChange={setInitialVolume}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>ווליום מינימום: {minVolume[0]}</Label>
                <Slider
                  value={minVolume}
                  onValueChange={setMinVolume}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>ווליום מקסימום: {maxVolume[0]}</Label>
                <Slider
                  value={maxVolume}
                  onValueChange={setMaxVolume}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card className="shadow-lg border-2 border-gray-200">
          <CardHeader>
            <CardTitle>מידע נוסף</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">מרחק מוגדר:</span>
                <span className="font-medium mr-2">{targetDistance}מ'</span>
              </div>
              <div>
                <span className="text-gray-600">ווליום מחושב:</span>
                <span className="font-medium mr-2">{calculateVolume(rssi)}</span>
              </div>
              <div>
                <span className="text-gray-600">טווח ווליום:</span>
                <span className="font-medium mr-2">{minVolume[0]}-{maxVolume[0]}</span>
              </div>
              <div>
                <span className="text-gray-600">מצב:</span>
                <span className="font-medium mr-2">
                  {isAutoMode ? 'אוטומטי' : 'ידני'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">סטטוס חיבור:</span>
                <span className={`font-medium mr-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? `מחובר ל-${connectedDevice?.name}` : 'לא מחובר'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions for Mobile */}
        <Card className="shadow-lg border-2 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">הוראות להפעלה על מובייל</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>1. ייצא את הפרויקט ל-GitHub דרך הכפתור "Export to Github"</p>
            <p>2. הורד את הפרויקט מ-GitHub למחשב שלך</p>
            <p>3. הרץ: <code className="bg-gray-200 px-1 rounded">npm install</code></p>
            <p>4. הוסף פלטפורמה: <code className="bg-gray-200 px-1 rounded">npx cap add android</code> או <code className="bg-gray-200 px-1 rounded">npx cap add ios</code></p>
            <p>5. בנה את הפרויקט: <code className="bg-gray-200 px-1 rounded">npm run build</code></p>
            <p>6. סנכרן: <code className="bg-gray-200 px-1 rounded">npx cap sync</code></p>
            <p>7. הרץ: <code className="bg-gray-200 px-1 rounded">npx cap run android</code> או <code className="bg-gray-200 px-1 rounded">npx cap run ios</code></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
