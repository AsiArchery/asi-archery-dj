
import { useState, useEffect } from 'react';
import { bluetoothService, BluetoothDeviceInfo } from '../services/bluetoothService';
import { useToast } from './use-toast';

export const useBluetoothNative = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
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
      setIsInitialized(true);
      
      // Set up RSSI callback
      bluetoothService.setRSSICallback((newRssi: number) => {
        setRssi(newRssi);
      });
      
      toast({
        title: "Bluetooth Ready!",
        description: "System is ready to connect to your Bluetooth speaker",
      });
    } catch (error) {
      console.error('Bluetooth initialization failed:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize Bluetooth. Please ensure Bluetooth is enabled.",
        variant: "destructive",
      });
    }
  };

  const connectToSystemAudio = async () => {
    if (!isInitialized) {
      toast({
        title: "System Not Ready",
        description: "Please wait for system initialization",
        variant: "destructive",
      });
      return;
    }

    try {
      await bluetoothService.connectToSystemAudio();
      setConnectedDevice({
        deviceId: 'system-audio',
        name: 'System Audio Device',
        rssi: -50
      });
      setIsConnected(true);
      
      toast({
        title: "Connected Successfully!",
        description: "Connected to your Bluetooth speaker",
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Error",
        description: "Please connect a Bluetooth speaker via system settings first",
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
        description: "Disconnected from audio device",
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
    connectedDevice,
    rssi,
    connectToSystemAudio,
    disconnect,
    setVolume
  };
};
