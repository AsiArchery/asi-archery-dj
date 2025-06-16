
import { BleClient, BleDevice, ScanResult } from '@capacitor-community/bluetooth-le';

export interface BluetoothDeviceInfo {
  deviceId: string;
  name: string;
  rssi: number;
}

export class BluetoothService {
  private connectedDevice: BleDevice | null = null;
  private scanningCallback: ((devices: BluetoothDeviceInfo[]) => void) | null = null;
  private rssiCallback: ((rssi: number) => void) | null = null;
  private rssiInterval: NodeJS.Timeout | null = null;

  constructor() {}

  async initialize(): Promise<void> {
    try {
      await BleClient.initialize();
      console.log('Bluetooth initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      throw error;
    }
  }

  async requestPermissions(): Promise<void> {
    try {
      await BleClient.requestLEScan(
        {
          services: []
        },
        () => {
          // Empty callback for permission request
        }
      );
      await BleClient.stopLEScan();
      console.log('Bluetooth permissions granted');
    } catch (error) {
      console.error('Failed to get Bluetooth permissions:', error);
      throw error;
    }
  }

  async startScan(callback: (devices: BluetoothDeviceInfo[]) => void): Promise<void> {
    this.scanningCallback = callback;
    const discoveredDevices: Map<string, BluetoothDeviceInfo> = new Map();

    try {
      await BleClient.requestLEScan(
        {
          services: []
        },
        (result: ScanResult) => {
          const device: BluetoothDeviceInfo = {
            deviceId: result.device.deviceId,
            name: result.device.name || result.localName || 'Unknown Device',
            rssi: result.rssi
          };
          
          discoveredDevices.set(device.deviceId, device);
          callback(Array.from(discoveredDevices.values()));
        }
      );

      setTimeout(async () => {
        await this.stopScan();
      }, 10000);
    } catch (error) {
      console.error('Failed to start scan:', error);
      throw error;
    }
  }

  async stopScan(): Promise<void> {
    try {
      await BleClient.stopLEScan();
      console.log('Bluetooth scan stopped');
    } catch (error) {
      console.error('Failed to stop scan:', error);
    }
  }

  async connectToDevice(deviceId: string): Promise<BluetoothDeviceInfo> {
    try {
      await BleClient.connect(deviceId);
      this.connectedDevice = { deviceId } as BleDevice;
      
      console.log('Connected to device:', deviceId);
      this.startRSSIMonitoring(deviceId);
      
      return {
        deviceId,
        name: 'Connected Device',
        rssi: -50
      };
    } catch (error) {
      console.error('Failed to connect to device:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      try {
        await BleClient.disconnect(this.connectedDevice.deviceId);
        console.log('Disconnected from device');
      } catch (error) {
        console.error('Failed to disconnect from device:', error);
        throw error;
      }
      
      this.connectedDevice = null;
      this.stopRSSIMonitoring();
    }
  }

  private startRSSIMonitoring(deviceId: string): void {
    this.rssiInterval = setInterval(async () => {
      try {
        // In a real implementation, this would read actual RSSI from the device
        // For now, we'll simulate realistic RSSI changes
        const rssi = -40 + Math.sin(Date.now() / 2000) * 20 + Math.random() * 10;
        
        if (this.rssiCallback) {
          this.rssiCallback(rssi);
        }
      } catch (error) {
        console.error('Failed to read RSSI:', error);
      }
    }, 1000);
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

  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  getConnectedDevice(): BleDevice | null {
    return this.connectedDevice;
  }

  async setVolume(volume: number): Promise<void> {
    console.log(`Setting volume to ${volume}`);
    // Native Bluetooth volume control implementation would go here
  }
}

export const bluetoothService = new BluetoothService();
