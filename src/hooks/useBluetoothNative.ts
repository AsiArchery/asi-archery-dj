
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
        title: "Native Bluetooth Ready!",
        description: "System is ready to scan and connect to Bluetooth devices",
      });
    } catch (error) {
      console.error('Bluetooth initialization failed:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize native Bluetooth",
        variant: "destructive",
      });
    }
  };

  const startScan = async () => {
    if (!isInitialized) {
      toast({
        title: "System Not Ready",
        description: "Please wait for system initialization",
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
        title: "Scan Started",
        description: "Searching for Bluetooth devices...",
      });
      
      // Auto stop scanning after 10 seconds
      setTimeout(() => {
        setIsScanning(false);
      }, 10000);
    } catch (error) {
      console.error('Scan failed:', error);
      setIsScanning(false);
      toast({
        title: "Scan Error",
        description: "Failed to scan for devices",
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
      
      toast({
        title: "Connected Successfully!",
        description: `Connected to ${deviceName}`,
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to device",
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
        title: "Disconnected",
        description: "Device disconnected successfully",
      });
    } catch (error) {
      console.error('Disconnect failed:', error);
      toast({
        title: "Disconnect Error",
        description: "Failed to disconnect device",
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
