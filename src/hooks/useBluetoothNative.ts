
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
        title: "System Ready!",
        description: "System ready to connect to Bluetooth speaker. Make sure speaker is in pairing mode.",
      });
    } catch (error) {
      console.error('Bluetooth initialization failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('permissions')) {
          setShowPermissionsDialog(true);
        } else {
          toast({
            title: "Initialization Error",
            description: error.message || "Bluetooth initialization failed. Please ensure Bluetooth is enabled and permissions are granted.",
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
          title: "Permissions Required",
          description: "Please grant Bluetooth and location permissions in device settings and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Permission handling failed:', error);
      setShowPermissionsDialog(false);
      toast({
        title: "Permission Request Error",
        description: "Failed to request permissions. Please open device settings and grant Bluetooth and location permissions manually.",
        variant: "destructive",
      });
    }
  };

  const connectToSystemAudio = async () => {
    if (!isInitialized) {
      toast({
        title: "System Not Ready",
        description: "Please wait for system initialization or request permissions",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Searching for devices...",
        description: "Scanning for available Bluetooth speakers",
      });

      await bluetoothService.connectToSystemAudio();
      
      const connectedDevice = bluetoothService.getConnectedDevice();
      if (connectedDevice) {
        setConnectedDevice({
          deviceId: connectedDevice.deviceId,
          name: connectedDevice.name || 'Bluetooth Device',
          rssi: -50
        });
      } else {
        setConnectedDevice({
          deviceId: 'simulated-device',
          name: 'Audio Device (Simulated)',
          rssi: -50
        });
      }
      
      setIsConnected(true);
      
      toast({
        title: "Connected Successfully!",
        description: "Connected to Bluetooth speaker. System will adjust volume based on distance.",
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Error",
        description: "No Bluetooth speakers found. Make sure speaker is in pairing mode and try again.",
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
