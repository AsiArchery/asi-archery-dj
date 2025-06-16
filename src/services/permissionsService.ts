
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';

export class PermissionsService {
  async checkBluetoothPermissions(): Promise<boolean> {
    try {
      // First check if Bluetooth is available and enabled
      const isAvailable = await BleClient.isEnabled();
      console.log('Bluetooth is available:', isAvailable);
      return isAvailable;
    } catch (error) {
      console.error('Bluetooth permission check failed:', error);
      return false;
    }
  }

  async requestBluetoothPermissions(): Promise<boolean> {
    try {
      console.log('Requesting Bluetooth permissions...');
      
      // Initialize BleClient first
      await BleClient.initialize();
      console.log('BleClient initialized');
      
      // Request to enable Bluetooth if not enabled
      await BleClient.requestEnable();
      console.log('Bluetooth enable requested');
      
      // Check if it's now enabled
      const isEnabled = await BleClient.isEnabled();
      console.log('Bluetooth is now enabled:', isEnabled);
      
      return isEnabled;
    } catch (error) {
      console.error('Failed to request Bluetooth permissions:', error);
      return false;
    }
  }

  openDeviceSettings(): void {
    // Show instructions for manual settings opening
    console.log('User needs to open device settings manually');
  }
}

export const permissionsService = new PermissionsService();
