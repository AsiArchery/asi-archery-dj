
import { BleClient, BleDevice, numbersToDataView, dataViewToNumbers } from '@capacitor-community/bluetooth-le';
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
  private connectedDevice: BleDevice | null = null;
  private availableDevices: BleDevice[] = [];

  constructor() {}

  async initialize(): Promise<void> {
    try {
      console.log('Starting Bluetooth initialization...');
      
      const hasPermissions = await permissionsService.requestBluetoothPermissions();
      if (!hasPermissions) {
        throw new Error('נדרשות הרשאות בלוטות ומיקום. אנא אשר את ההרשאות.');
      }
      
      this.isInitialized = true;
      console.log('Bluetooth service initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('הרשאות')) {
          throw error;
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
      
      this.availableDevices = [];
      
      await BleClient.requestLEScan({}, (result) => {
        console.log('Device found:', result);
        // Only add devices with names (audio devices usually have names)
        if (result.device.name) {
          this.availableDevices.push(result.device);
        }
      });

      // Scan for 5 seconds
      setTimeout(async () => {
        await BleClient.stopLEScan();
        console.log('Scan completed, found', this.availableDevices.length, 'devices');
      }, 5000);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.availableDevices);
        }, 5500);
      });
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
      console.log('Scanning for audio devices...');
      
      // First scan for available devices
      const devices = await this.scanForDevices();
      console.log('Available devices:', devices);
      
      if (devices.length === 0) {
        // Fallback to simulated connection for testing
        console.log('No devices found, using simulated connection');
        this.startRSSIMonitoring();
        return;
      }
      
      // Try to connect to the first available device (in real app, user would choose)
      const targetDevice = devices[0];
      console.log('Attempting to connect to:', targetDevice.name);
      
      await BleClient.connect(targetDevice.deviceId);
      this.connectedDevice = targetDevice;
      
      console.log('Connected to device:', targetDevice.name);
      this.startRSSIMonitoring();
      
    } catch (error) {
      console.error('Failed to connect to device:', error);
      // Fallback to simulated connection
      console.log('Connection failed, using simulated mode');
      this.startRSSIMonitoring();
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connectedDevice) {
        await BleClient.disconnect(this.connectedDevice.deviceId);
        console.log('Disconnected from device:', this.connectedDevice.name);
      }
      
      this.stopRSSIMonitoring();
      this.rssiHistory = [];
      this.connectedDevice = null;
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  }

  private startRSSIMonitoring(): void {
    console.log('Starting RSSI monitoring...');
    
    this.rssiInterval = setInterval(async () => {
      try {
        let currentRssi: number;
        
        if (this.connectedDevice) {
          // Try to read actual RSSI from connected device
          try {
            const rssiResult = await BleClient.readRssi(this.connectedDevice.deviceId);
            currentRssi = rssiResult;
            console.log('Real RSSI:', currentRssi);
          } catch (error) {
            // Fallback to simulated RSSI if reading fails
            currentRssi = -50 + Math.sin(Date.now() / 5000) * 20 + Math.random() * 5;
          }
        } else {
          // Simulated RSSI for testing
          currentRssi = -50 + Math.sin(Date.now() / 5000) * 20 + Math.random() * 5;
        }
        
        // Add to history for moving average
        this.rssiHistory.push(currentRssi);
        if (this.rssiHistory.length > 5) {
          this.rssiHistory.shift();
        }
        
        // Calculate moving average for smoother values
        const smoothedRssi = this.rssiHistory.reduce((sum, val) => sum + val, 0) / this.rssiHistory.length;
        
        // Only trigger callback if there's a significant change
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
    console.log(`Setting volume to ${volume}`);
    // Note: System volume control requires additional native plugins
    // For now, this is logged for debugging
    if (this.connectedDevice) {
      console.log(`Would set volume to ${volume} on device:`, this.connectedDevice.name);
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  getAvailableDevices(): BleDevice[] {
    return this.availableDevices;
  }

  getConnectedDevice(): BleDevice | null {
    return this.connectedDevice;
  }
}

export const bluetoothService = new BluetoothService();
