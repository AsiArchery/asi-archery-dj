
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
      await BleClient.requestLEScan();
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
          // Scan for audio devices (optional filter)
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

      // Stop scanning after 10 seconds
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
      
      // Start RSSI monitoring
      this.startRSSIMonitoring(deviceId);
      
      return {
        deviceId,
        name: 'Connected Device',
        rssi: -50 // Initial value
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
        this.connectedDevice = null;
        this.stopRSSIMonitoring();
        console.log('Disconnected from device');
      } catch (error) {
        console.error('Failed to disconnect:', error);
        throw error;
      }
    }
  }

  private startRSSIMonitoring(deviceId: string): void {
    this.rssiInterval = setInterval(async () => {
      try {
        // Note: RSSI reading might not be available on all platforms
        // This is a simulation for now, but on actual devices this would read real RSSI
        const simulatedRSSI = -30 + Math.random() * -60; // -30 to -90
        
        if (this.rssiCallback) {
          this.rssiCallback(simulatedRSSI);
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

  // Volume control would need to be implemented based on the specific audio protocol
  // Most Bluetooth speakers use A2DP which doesn't allow direct volume control from web/hybrid apps
  // This would typically require platform-specific native code
  async setVolume(volume: number): Promise<void> {
    console.log(`Setting volume to ${volume} (Note: Actual volume control requires native implementation)`);
    // Implementation would depend on the specific device's protocol
  }
}

export const bluetoothService = new BluetoothService();
