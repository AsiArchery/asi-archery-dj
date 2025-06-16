
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { permissionsService } from './permissionsService';

export interface BluetoothDeviceInfo {
  deviceId: string;
  name: string;
  rssi: number;
}

export class BluetoothService {
  private isInitialized: boolean = false;
  private rssiCallback: ((rssi: number) => void) | null = null;
  private rssiInterval: NodeJS.Timeout | null = null;
  private rssiHistory: number[] = [];
  private lastSignificantChange: number = 0;
  private connectedDeviceId: string | null = null;

  constructor() {}

  async initialize(): Promise<void> {
    try {
      console.log('Starting Bluetooth initialization...');
      
      // Initialize BleClient
      await BleClient.initialize();
      console.log('BleClient initialized successfully');
      
      // Check if Bluetooth is enabled
      const isEnabled = await BleClient.isEnabled();
      console.log('Bluetooth enabled status:', isEnabled);
      
      if (!isEnabled) {
        console.log('Bluetooth not enabled, requesting...');
        throw new Error('BLUETOOTH_NOT_ENABLED');
      }
      
      this.isInitialized = true;
      console.log('Bluetooth service initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      
      if (error instanceof Error) {
        if (error.message === 'BLUETOOTH_NOT_ENABLED') {
          throw new Error('נדרש להפעיל בלוטות. אנא הפעל בלוטות בהגדרות המכשיר.');
        }
        if (error.message.includes('permission') || error.message.includes('Permission')) {
          throw new Error('נדרשות הרשאות בלוטות. אנא אשר את ההרשאות בהגדרות המכשיר.');
        }
      }
      
      throw new Error('אתחול בלוטות נכשל. אנא ודא שהבלוטות מופעל במכשיר.');
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      console.log('Requesting Bluetooth permissions via service...');
      const granted = await permissionsService.requestBluetoothPermissions();
      console.log('Permissions granted:', granted);
      return granted;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async scanForDevices(): Promise<BleDevice[]> {
    if (!this.isInitialized) {
      throw new Error('Bluetooth not initialized');
    }

    try {
      console.log('Starting device scan...');
      
      const devices: BleDevice[] = [];
      
      await BleClient.requestLEScan({}, (result) => {
        console.log('Device found:', result);
        devices.push(result.device);
      });

      // Scan for 5 seconds
      setTimeout(async () => {
        await BleClient.stopLEScan();
        console.log('Scan completed, found', devices.length, 'devices');
      }, 5000);

      return devices;
    } catch (error) {
      console.error('Failed to scan for devices:', error);
      throw error;
    }
  }

  async connectToSystemAudio(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Bluetooth not initialized');
    }

    try {
      console.log('Attempting to connect to system audio...');
      
      // For now, simulate connection since we're working with system audio
      // In a real implementation, you would scan for and connect to a specific device
      this.startRSSIMonitoring();
      this.connectedDeviceId = 'system-audio';
      
      console.log('Connected to system audio');
    } catch (error) {
      console.error('Failed to connect to system audio:', error);
      throw new Error('חיבור לשמע המערכת נכשל. אנא ודא שרמקול בלוטות מחובר דרך הגדרות המערכת.');
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connectedDeviceId && this.connectedDeviceId !== 'system-audio') {
        await BleClient.disconnect(this.connectedDeviceId);
      }
      
      this.stopRSSIMonitoring();
      this.rssiHistory = [];
      this.connectedDeviceId = null;
      console.log('Disconnected from device');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  }

  private startRSSIMonitoring(): void {
    console.log('Starting RSSI monitoring...');
    
    this.rssiInterval = setInterval(() => {
      try {
        // Generate more stable RSSI values with less fluctuation
        const baseRssi = -50 + Math.sin(Date.now() / 5000) * 20 + Math.random() * 5;
        
        // Add to history for moving average
        this.rssiHistory.push(baseRssi);
        if (this.rssiHistory.length > 5) {
          this.rssiHistory.shift();
        }
        
        // Calculate moving average for smoother values
        const smoothedRssi = this.rssiHistory.reduce((sum, val) => sum + val, 0) / this.rssiHistory.length;
        
        // Only trigger callback if there's a significant change (threshold of 3 dBm)
        if (Math.abs(smoothedRssi - this.lastSignificantChange) > 3) {
          this.lastSignificantChange = smoothedRssi;
          
          if (this.rssiCallback) {
            this.rssiCallback(smoothedRssi);
          }
        }
      } catch (error) {
        console.error('Failed to read RSSI:', error);
      }
    }, 2000);
  }

  private stopRSSIMonitoring(): void {
    if (this.rssiInterval) {
      clearInterval(this.rssiInterval);
      this.rssiInterval = null;
      console.log('RSSI monitoring stopped');
    }
  }

  setRSSICallback(callback: (rssi: number) => void): void {
    this.rssiCallback = callback;
  }

  async setVolume(volume: number): Promise<void> {
    console.log(`Setting system audio volume to ${volume}`);
    // Volume control would need to be implemented with system APIs
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export const bluetoothService = new BluetoothService();
