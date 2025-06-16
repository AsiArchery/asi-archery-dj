
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
      
      // Set up RSSI callback
      bluetoothService.setRSSICallback((newRssi: number) => {
        setRssi(newRssi);
      });
      
      toast({
        title: "Bluetooth מוכן!",
        description: "המערכת מוכנה לסריקה וחיבור",
      });
    } catch (error) {
      console.error('Bluetooth initialization failed:', error);
      toast({
        title: "שגיאת Bluetooth",
        description: "לא הצלחנו להפעיל את ה-Bluetooth",
        variant: "destructive",
      });
    }
  };

  const startScan = async () => {
    if (!isInitialized) {
      toast({
        title: "Bluetooth לא מוכן",
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
      
      toast({
        title: "סריקה החלה",
        description: "מחפש התקני Bluetooth...",
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
        rssi: -50
      });
      setIsConnected(true);
      setDiscoveredDevices([]);
      
      toast({
        title: "התחבר בהצלחה!",
        description: `מחובר ל-${deviceName}`,
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
    startScan,
    connectToDevice,
    disconnect,
    setVolume
  };
};
