
import { BleClient } from '@capacitor-community/bluetooth-le';

export class PermissionsService {
  async checkBluetoothPermissions(): Promise<boolean> {
    try {
      // Check if Bluetooth is available
      const isAvailable = await BleClient.isEnabled();
      return isAvailable;
    } catch (error) {
      console.error('Bluetooth permission check failed:', error);
      return false;
    }
  }

  async requestBluetoothPermissions(): Promise<boolean> {
    try {
      await BleClient.requestEnable();
      return true;
    } catch (error) {
      console.error('Failed to request Bluetooth permissions:', error);
      return false;
    }
  }

  openDeviceSettings(): void {
    // This will need to be handled by the user manually
    // We'll show instructions instead
    console.log('User needs to open device settings manually');
  }
}

export const permissionsService = new PermissionsService();
