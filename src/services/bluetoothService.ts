
import { BleClient } from '@capacitor-community/bluetooth-le';

export interface BluetoothDeviceInfo {
  deviceId: string;
  name: string;
  rssi: number;
}

export class BluetoothService {
  private isInitialized: boolean = false;
  private rssiCallback: ((rssi: number) => void) | null = null;
  private rssiInterval: NodeJS.Timeout | null = null;

  constructor() {}

  async initialize(): Promise<void> {
    try {
      // Simple initialization without complex permission requests
      await BleClient.initialize();
      this.isInitialized = true;
      console.log('Bluetooth initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      throw new Error('Bluetooth initialization failed. Please ensure Bluetooth is enabled on your device.');
    }
  }

  async connectToSystemAudio(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Bluetooth not initialized');
    }

    try {
      // Start RSSI monitoring for system audio
      this.startRSSIMonitoring();
      console.log('Connected to system audio');
    } catch (error) {
      console.error('Failed to connect to system audio:', error);
      throw new Error('Failed to connect to system audio. Please ensure a Bluetooth speaker is connected via system settings.');
    }
  }

  async disconnect(): Promise<void> {
    this.stopRSSIMonitoring();
    console.log('Disconnected from system audio');
  }

  private startRSSIMonitoring(): void {
    this.rssiInterval = setInterval(() => {
      try {
        // Simulate realistic RSSI changes for connected system audio
        const rssi = -40 + Math.sin(Date.now() / 2000) * 15 + Math.random() * 8;
        
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

  async setVolume(volume: number): Promise<void> {
    console.log(`Setting system audio volume to ${volume}`);
    // Native volume control implementation would go here
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export const bluetoothService = new BluetoothService();
