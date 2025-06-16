
import { useState, useEffect } from 'react';
import { bluetoothService, BluetoothDeviceInfo } from '../services/bluetoothService';
import { useToast } from './use-toast';

export const useBluetoothNative = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [rssi, setRssi] = useState(-60);
  const [isNative, setIsNative] = useState(false);
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
      await bluetoothService.requestPermissions();
      setIsInitialized(true);
      setIsNative(bluetoothService.isNative());
      
      // Set up RSSI callback
      bluetoothService.setRSSICallback((newRssi: number) => {
        setRssi(newRssi);
      });
      
      const mode = bluetoothService.isNative() ? "נטיבי" : "דמו";
      toast({
        title: `מצב ${mode} מוכן!`,
        description: bluetoothService.isNative() 
          ? "המערכת מוכנה לסריקה וחיבור Bluetooth אמיתי"
          : "המערכת פועלת במצב דמו עם נתונים מדומים",
      });
    } catch (error) {
      console.error('Bluetooth initialization failed:', error);
      toast({
        title: "שגיאת אתחול",
        description: bluetoothService.isNative() 
          ? "לא הצלחנו להפעיל את ה-Bluetooth הנטיבי"
          : "לא הצלחנו להפעיל את מצב הדמו",
        variant: "destructive",
      });
    }
  };

  const startScan = async () => {
    if (!isInitialized) {
      toast({
        title: "המערכת לא מוכנה",
        description: "אנא המתן להפעלת המערכת",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsScanning(true);
      setDiscoveredDevices([]);
      
      await bluetoothService.startScan((devices: BluetoothDeviceInfo[]) => {
        setDiscoveredDevices(devices);
      });
      
      const mode = bluetoothService.isNative() ? "Bluetooth" : "דמו";
      toast({
        title: "סריקה החלה",
        description: `מחפש התקני ${mode}...`,
      });
      
      // Auto stop scanning after 10 seconds
      setTimeout(() => {
        setIsScanning(false);
      }, 10000);
    } catch (error) {
      console.error('Scan failed:', error);
      setIsScanning(false);
      toast({
        title: "שגיאת סריקה",
        description: "לא הצלחנו לסרוק התקנים",
        variant: "destructive",
      });
    }
  };

  const connectToDevice = async (deviceId: string, deviceName: string) => {
    try {
      const device = await bluetoothService.connectToDevice(deviceId);
      setConnectedDevice({
        deviceId,
        name: deviceName,
        rssi: device.rssi
      });
      setIsConnected(true);
      setDiscoveredDevices([]);
      
      const mode = bluetoothService.isNative() ? "" : " (דמו)";
      toast({
        title: "התחבר בהצלחה!",
        description: `מחובר ל-${deviceName}${mode}`,
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "שגיאת חיבור",
        description: "לא הצלחנו להתחבר להתקן",
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
        title: "החיבור נותק",
        description: "ההתקן נותק בהצלחה",
      });
    } catch (error) {
      console.error('Disconnect failed:', error);
      toast({
        title: "שגיאת ניתוק",
        description: "לא הצלחנו לנתק את ההתקן",
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
    isScanning,
    discoveredDevices,
    connectedDevice,
    rssi,
    isNative,
    startScan,
    connectToDevice,
    disconnect,
    setVolume
  };
};
