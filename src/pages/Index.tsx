
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bluetooth, Play, Pause, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [rssi, setRssi] = useState(-60);
  const [currentVolume, setCurrentVolume] = useState(5);
  const [targetDistance, setTargetDistance] = useState('50');
  const [initialVolume, setInitialVolume] = useState([3]);
  const [minVolume, setMinVolume] = useState([1]);
  const [maxVolume, setMaxVolume] = useState([10]);
  const [deviceName, setDeviceName] = useState('');
  const { toast } = useToast();

  // Calculate normalized RSSI and volume
  const calculateVolume = (rssiValue: number) => {
    const normalized = Math.max(0, Math.min(1, (rssiValue + 100) / 70));
    const volume = minVolume[0] + normalized * (maxVolume[0] - minVolume[0]);
    return Math.round(volume);
  };

  // Simulate RSSI changes (in real app, this would come from Bluetooth API)
  useEffect(() => {
    if (isConnected && isAutoMode) {
      const interval = setInterval(() => {
        const newRssi = -30 + Math.random() * -60; // Random RSSI between -30 and -90
        setRssi(newRssi);
        const newVolume = calculateVolume(newRssi);
        setCurrentVolume(newVolume);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected, isAutoMode, minVolume, maxVolume]);

  const handleBluetoothConnect = async () => {
    try {
      // In a real app, this would use the Web Bluetooth API
      // For demo purposes, we'll simulate the connection
      setIsConnected(true);
      setDeviceName('קול בלוטוס');
      setRssi(-45);
      toast({
        title: "התחבר בהצלחה!",
        description: "הרמקול מחובר ומוכן לשימוש",
      });
    } catch (error) {
      toast({
        title: "שגיאת חיבור",
        description: "לא הצלחנו להתחבר לרמקול",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setDeviceName('');
    setIsAutoMode(false);
    toast({
      title: "החיבור נותק",
      description: "הרמקול נותק מהאפליקציה",
    });
  };

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
          </div>
          <p className="text-gray-600">שליטה אוטומטית על עוצמת הקול לפי המרחק מהמטרה</p>
        </div>

        {/* Bluetooth Connection */}
        <Card className="shadow-lg border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bluetooth className="w-5 h-5 text-blue-600" />
              חיבור בלוטוס
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">סטטוס חיבור</p>
                <p className="font-medium">
                  {isConnected ? `מחובר ל-${deviceName}` : 'לא מחובר'}
                </p>
              </div>
              <Button 
                onClick={isConnected ? handleDisconnect : handleBluetoothConnect}
                variant={isConnected ? "destructive" : "default"}
                className="min-w-[120px]"
              >
                {isConnected ? 'נתק' : 'התחבר לרמקול'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Signal Strength and Volume Display */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">עוצמת קליטה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(getSignalStrength(rssi))}%
                </div>
                <div className="text-sm text-gray-600">
                  RSSI: {rssi} dBm
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
