
import { BleClient } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

export class PermissionsService {
  async checkBluetoothPermissions(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.log('Running on web, skipping native permission checks');
        return true;
      }

      console.log('Checking Bluetooth permissions...');
      
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
      
      if (!Capacitor.isNativePlatform()) {
        console.log('Running on web, initializing BLE client only');
        await BleClient.initialize();
        return true;
      }

      console.log('Initializing BLE client...');
      await BleClient.initialize();
      console.log('BleClient initialized successfully');
      
      const isEnabled = await BleClient.isEnabled();
      console.log('Bluetooth enabled status:', isEnabled);
      
      if (!isEnabled) {
        console.log('Bluetooth not enabled, requesting enable...');
        try {
          await BleClient.requestEnable();
          console.log('Bluetooth enable request sent');
        } catch (enableError) {
          console.error('Failed to request Bluetooth enable:', enableError);
          return false;
        }
      }
      
      const finalEnabled = await BleClient.isEnabled();
      console.log('Final Bluetooth enabled status:', finalEnabled);
      
      return finalEnabled;
    } catch (error) {
      console.error('Failed to request Bluetooth permissions:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      return false;
    }
  }

  openDeviceSettings(): void {
    if (Capacitor.isNativePlatform()) {
      console.log('User needs to open device settings manually');
    } else {
      console.log('Running on web, no settings to open');
    }
  }
}

export const permissionsService = new PermissionsService();
