
export interface BluetoothDeviceInfo {
  deviceId: string;
  name: string;
  rssi: number;
}

export interface BluetoothServiceInterface {
  initialize(): Promise<void>;
  requestPermissions(): Promise<boolean>;
  scanForDevices(): Promise<any[]>;
  connectToSystemAudio(): Promise<void>;
  disconnect(): Promise<void>;
  setRSSICallback(callback: (rssi: number) => void): void;
  setVolume(volume: number): Promise<void>;
  isReady(): boolean;
}
