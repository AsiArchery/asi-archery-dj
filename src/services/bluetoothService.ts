
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { permissionsService } from './permissionsService';
import { BluetoothDeviceInfo, BluetoothServiceInterface } from '../types/bluetooth';
import { RSSIMonitor } from './rssiMonitor';

export class BluetoothService implements BluetoothServiceInterface {
  private isInitialized: boolean = false;
  private connectedDevice: BleDevice | null = null;
  private availableDevices: BleDevice[] = [];
  private rssiMonitor: RSSIMonitor = new RSSIMonitor();

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
        if (result.device.name) {
          this.availableDevices.push(result.device);
        }
      });

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
      
      const devices = await this.scanForDevices();
      console.log('Available devices:', devices);
      
      if (devices.length === 0) {
        console.log('No devices found, using simulated connection');
        this.rssiMonitor.startMonitoring(null);
        return;
      }
      
      const targetDevice = devices[0];
      console.log('Attempting to connect to:', targetDevice.name);
      
      await BleClient.connect(targetDevice.deviceId);
      this.connectedDevice = targetDevice;
      
      console.log('Connected to device:', targetDevice.name);
      this.rssiMonitor.startMonitoring(targetDevice);
      
    } catch (error) {
      console.error('Failed to connect to device:', error);
      console.log('Connection failed, using simulated mode');
      this.rssiMonitor.startMonitoring(null);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connectedDevice) {
        await BleClient.disconnect(this.connectedDevice.deviceId);
        console.log('Disconnected from device:', this.connectedDevice.name);
      }
      
      this.rssiMonitor.stopMonitoring();
      this.rssiMonitor.reset();
      this.connectedDevice = null;
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  }

  setRSSICallback(callback: (rssi: number) => void): void {
    this.rssiMonitor.setCallback(callback);
  }

  async setVolume(volume: number): Promise<void> {
    console.log(`Setting volume to ${volume}`);
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
