import { BleClient } from '@capacitor-community/bluetooth-le';
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

  constructor() {}

  async initialize(): Promise<void> {
    try {
      // Check permissions first
      const hasPermissions = await permissionsService.checkBluetoothPermissions();
      if (!hasPermissions) {
        throw new Error('PERMISSIONS_REQUIRED');
      }

      await BleClient.initialize();
      this.isInitialized = true;
      console.log('Bluetooth initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      
      if (error instanceof Error && error.message === 'PERMISSIONS_REQUIRED') {
        throw new Error('נדרשות הרשאות בלוטות'. אנא אשר את ההרשאות בהגדרות המכשיר.');
      }
      
      throw new Error('אתחול בלוטות' נכשל. אנא ודא שהבלוטות' מופעל במכשיר.');
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      return await permissionsService.requestBluetoothPermissions();
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async connectToSystemAudio(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Bluetooth not initialized');
    }

    try {
      this.startRSSIMonitoring();
      console.log('Connected to system audio');
    } catch (error) {
      console.error('Failed to connect to system audio:', error);
      throw new Error('חיבור לשמע המערכת נכשל. אנא ודא שרמקול בלוטות' מחובר דרך הגדרות המערכת.');
    }
  }

  async disconnect(): Promise<void> {
    this.stopRSSIMonitoring();
    this.rssiHistory = [];
    console.log('Disconnected from system audio');
  }

  private startRSSIMonitoring(): void {
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
    }, 2000); // Changed from 1000ms to 2000ms for slower updates
  }

  private stopRSSIMonitoring(): void {
    if (this.rssiInterval) {
      clearInterval(this.rssiInterval);
      this.rssiInterval = null;
    }
  }

  setRSSICallback(callback: (rssi: number) => void): void {
    this.rssiCallback = callback;
  }

  async setVolume(volume: number): Promise<void> {
    console.log(`Setting system audio volume to ${volume}`);
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export const bluetoothService = new BluetoothService();
