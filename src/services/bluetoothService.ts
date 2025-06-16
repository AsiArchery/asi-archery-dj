
import { BleClient, BleDevice, ScanResult } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

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
  private isNativeEnvironment: boolean;
  private mockDevices: BluetoothDeviceInfo[] = [
    { deviceId: 'mock-speaker-1', name: 'רמקול בלוטוט', rssi: -45 },
    { deviceId: 'mock-speaker-2', name: 'JBL Charge 5', rssi: -60 },
    { deviceId: 'mock-speaker-3', name: 'Sony SRS-XB23', rssi: -55 }
  ];

  constructor() {
    this.isNativeEnvironment = Capacitor.isNativePlatform();
  }

  async initialize(): Promise<void> {
    if (this.isNativeEnvironment) {
      try {
        await BleClient.initialize();
        console.log('Native Bluetooth initialized successfully');
      } catch (error) {
        console.error('Failed to initialize native Bluetooth:', error);
        throw error;
      }
    } else {
      console.log('Running in browser - using demo mode');
      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  async requestPermissions(): Promise<void> {
    if (this.isNativeEnvironment) {
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
        console.log('Native Bluetooth permissions granted');
      } catch (error) {
        console.error('Failed to get native Bluetooth permissions:', error);
        throw error;
      }
    } else {
      // Browser demo mode - no permissions needed
      console.log('Browser demo mode - no permissions required');
    }
  }

  async startScan(callback: (devices: BluetoothDeviceInfo[]) => void): Promise<void> {
    this.scanningCallback = callback;

    if (this.isNativeEnvironment) {
      await this.startNativeScan(callback);
    } else {
      await this.startDemoScan(callback);
    }
  }

  private async startNativeScan(callback: (devices: BluetoothDeviceInfo[]) => void): Promise<void> {
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
      console.error('Failed to start native scan:', error);
      throw error;
    }
  }

  private async startDemoScan(callback: (devices: BluetoothDeviceInfo[]) => void): Promise<void> {
    console.log('Starting demo scan...');
    
    // Simulate discovering devices gradually
    const devices: BluetoothDeviceInfo[] = [];
    
    for (let i = 0; i < this.mockDevices.length; i++) {
      setTimeout(() => {
        devices.push(this.mockDevices[i]);
        callback([...devices]);
      }, (i + 1) * 1000);
    }
  }

  async stopScan(): Promise<void> {
    if (this.isNativeEnvironment) {
      try {
        await BleClient.stopLEScan();
        console.log('Native Bluetooth scan stopped');
      } catch (error) {
        console.error('Failed to stop native scan:', error);
      }
    } else {
      console.log('Demo scan stopped');
    }
  }

  async connectToDevice(deviceId: string): Promise<BluetoothDeviceInfo> {
    if (this.isNativeEnvironment) {
      return await this.connectToNativeDevice(deviceId);
    } else {
      return await this.connectToDemoDevice(deviceId);
    }
  }

  private async connectToNativeDevice(deviceId: string): Promise<BluetoothDeviceInfo> {
    try {
      await BleClient.connect(deviceId);
      this.connectedDevice = { deviceId } as BleDevice;
      
      console.log('Connected to native device:', deviceId);
      this.startRSSIMonitoring(deviceId);
      
      return {
        deviceId,
        name: 'Connected Device',
        rssi: -50
      };
    } catch (error) {
      console.error('Failed to connect to native device:', error);
      throw error;
    }
  }

  private async connectToDemoDevice(deviceId: string): Promise<BluetoothDeviceInfo> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const device = this.mockDevices.find(d => d.deviceId === deviceId);
    if (!device) {
      throw new Error('Demo device not found');
    }

    this.connectedDevice = { deviceId } as BleDevice;
    console.log('Connected to demo device:', device.name);
    this.startRSSIMonitoring(deviceId);
    
    return device;
  }

  async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      if (this.isNativeEnvironment) {
        try {
          await BleClient.disconnect(this.connectedDevice.deviceId);
          console.log('Disconnected from native device');
        } catch (error) {
          console.error('Failed to disconnect from native device:', error);
          throw error;
        }
      } else {
        console.log('Disconnected from demo device');
      }
      
      this.connectedDevice = null;
      this.stopRSSIMonitoring();
    }
  }

  private startRSSIMonitoring(deviceId: string): void {
    this.rssiInterval = setInterval(async () => {
      try {
        let rssi: number;
        
        if (this.isNativeEnvironment) {
          // On native platforms, this would read actual RSSI
          // For now, simulate varying signal strength
          rssi = -30 + Math.random() * -60; // -30 to -90
        } else {
          // Demo mode - simulate realistic RSSI changes
          rssi = -40 + Math.sin(Date.now() / 2000) * 20 + Math.random() * 10;
        }
        
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

  isNative(): boolean {
    return this.isNativeEnvironment;
  }

  async setVolume(volume: number): Promise<void> {
    if (this.isNativeEnvironment) {
      console.log(`Setting native volume to ${volume}`);
      // Native implementation would go here
    } else {
      console.log(`Demo: Setting volume to ${volume}`);
    }
  }
}

export const bluetoothService = new BluetoothService();
