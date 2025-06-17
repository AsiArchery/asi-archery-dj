
import { useState, useEffect } from 'react';
import { bluetoothService } from '../services/bluetoothService';
import { BluetoothDeviceInfo } from '../types/bluetooth';
import { useToast } from './use-toast';

export const useBluetoothNative = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [rssi, setRssi] = useState(-60);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!initializationAttempted) {
      initializeBluetooth();
      setInitializationAttempted(true);
    }
    
    return () => {
      if (isConnected) {
        bluetoothService.disconnect();
      }
    };
  }, []);

  const initializeBluetooth = async () => {
    try {
      console.log('Attempting to initialize Bluetooth...');
      await bluetoothService.initialize();
      setIsInitialized(true);
      
      bluetoothService.setRSSICallback((newRssi: number) => {
        setRssi(newRssi);
      });
      
      console.log('Bluetooth initialized successfully');
      toast({
        title: "מערכת מוכנה!",
        description: "המערכת מוכנה להתחבר לרמקול בלוטות. ודא שהרמקול במצב זיווג.",
      });
    } catch (error) {
      console.error('Bluetooth initialization failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('הרשאות')) {
          setShowPermissionsDialog(true);
        } else {
          toast({
            title: "שגיאת אתחול",
            description: error.message || "נכשל באתחול בלוטות. אנא ודא שהבלוטות מופעל וההרשאות מאושרות.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handlePermissionsRequest = async () => {
    try {
      console.log('Handling permissions request...');
      const granted = await bluetoothService.requestPermissions();
      setShowPermissionsDialog(false);
      
      if (granted) {
        console.log('Permissions granted, re-initializing...');
        await initializeBluetooth();
      } else {
        console.log('Permissions denied');
        toast({
          title: "הרשאות נדרשות",
          description: "אנא אשר הרשאות בלוטות ומיקום בהגדרות המכשיר ונסה שוב",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Permission handling failed:', error);
      setShowPermissionsDialog(false);
      toast({
        title: "שגיאה בבקשת הרשאות",
        description: "נכשל בבקשת הרשאות. אנא פתח את הגדרות המכשיר ואשר הרשאות בלוטות ומיקום ידנית.",
        variant: "destructive",
      });
    }
  };

  const connectToSystemAudio = async () => {
    if (!isInitialized) {
      toast({
        title: "המערכת לא מוכנה",
        description: "אנא המתן לאתחול המערכת או בקש הרשאות",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "מחפש מכשירים...",
        description: "סורק אחר רמקולי בלוטות זמינים",
      });

      await bluetoothService.connectToSystemAudio();
      
      const connectedDevice = bluetoothService.getConnectedDevice();
      if (connectedDevice) {
        setConnectedDevice({
          deviceId: connectedDevice.deviceId,
          name: connectedDevice.name || 'מכשיר בלוטות',
          rssi: -50
        });
      } else {
        setConnectedDevice({
          deviceId: 'simulated-device',
          name: 'מכשיר שמע (מדומה)',
          rssi: -50
        });
      }
      
      setIsConnected(true);
      
      toast({
        title: "התחבר בהצלחה!",
        description: "התחבר לרמקול בלוטות. המערכת תתאים את עוצמת הקול בהתאם למרחק.",
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "שגיאת חיבור",
        description: "לא נמצאו רמקולי בלוטות. ודא שהרמקול במצב זיווג ונסה שוב.",
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

  const retryInitialization = () => {
    console.log('Retrying Bluetooth initialization...');
    setInitializationAttempted(false);
    setIsInitialized(false);
    initializeBluetooth();
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
    retryInitialization,
    dismissPermissionsDialog: () => setShowPermissionsDialog(false)
  };
};
