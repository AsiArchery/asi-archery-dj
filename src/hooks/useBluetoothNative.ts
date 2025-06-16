import { useState, useEffect } from 'react';
import { bluetoothService, BluetoothDeviceInfo } from '../services/bluetoothService';
import { useToast } from './use-toast';

export const useBluetoothNative = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [rssi, setRssi] = useState(-60);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeBluetooth();
    
    return () => {
      if (isConnected) {
        bluetoothService.disconnect();
      }
    };
  }, []);

  const initializeBluetooth = async () => {
    try {
      await bluetoothService.initialize();
      setIsInitialized(true);
      
      // Set up RSSI callback
      bluetoothService.setRSSICallback((newRssi: number) => {
        setRssi(newRssi);
      });
      
      toast({
        title: "מערכת מוכנה!",
        description: "המערכת מוכנה להתחבר לרמקול בלוטות'",
      });
    } catch (error) {
      console.error('Bluetooth initialization failed:', error);
      
      if (error instanceof Error && error.message.includes('הרשאות')) {
        setShowPermissionsDialog(true);
      } else {
        toast({
          title: "שגיאת אתחול",
          description: "נכשל באתחול בלוטות'. אנא ודא שהבלוטות' מופעל.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePermissionsRequest = async () => {
    const granted = await bluetoothService.requestPermissions();
    setShowPermissionsDialog(false);
    
    if (granted) {
      initializeBluetooth();
    } else {
      toast({
        title: "הרשאות נדרשות",
        description: "אנא אשר הרשאות בלוטות' בהגדרות המכשיר",
        variant: "destructive",
      });
    }
  };

  const connectToSystemAudio = async () => {
    if (!isInitialized) {
      toast({
        title: "המערכת לא מוכנה",
        description: "אנא המתן לאתחול המערכת",
        variant: "destructive",
      });
      return;
    }

    try {
      await bluetoothService.connectToSystemAudio();
      setConnectedDevice({
        deviceId: 'system-audio',
        name: 'מכשיר שמע מערכת',
        rssi: -50
      });
      setIsConnected(true);
      
      toast({
        title: "התחבר בהצלחה!",
        description: "התחבר לרמקול בלוטות'",
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "שגיאת חיבור",
        description: "אנא חבר רמקול בלוטות' דרך הגדרות המערכת תחילה",
        variant: "destructive",
      });
    }
  };

  const disconnect = async () => {
    try {
      await bluetoothService.disconnect();
      setIsConnected(false);
      setConnectedDevice(null);
      setRssi(-60);
      
      toast({
        title: "התנתק",
        description: "התנתק ממכשיר השמע",
      });
    } catch (error) {
      console.error('Disconnect failed:', error);
      toast({
        title: "שגיאת ניתוק",
        description: "נכשל בניתוק המכשיר",
        variant: "destructive",
      });
    }
  };

  const setVolume = async (volume: number) => {
    try {
      await bluetoothService.setVolume(volume);
    } catch (error) {
      console.error('Volume control failed:', error);
    }
  };

  return {
    isInitialized,
    isConnected,
    connectedDevice,
    rssi,
    showPermissionsDialog,
    connectToSystemAudio,
    disconnect,
    setVolume,
    handlePermissionsRequest,
    dismissPermissionsDialog: () => setShowPermissionsDialog(false)
  };
};
