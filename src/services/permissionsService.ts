import { BleClient } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

// Define permission types since they're not exported from @capacitor/core
type PermissionType = 'camera' | 'photos' | 'geolocation' | 'notifications' | 'clipboard-read' | 'clipboard-write' | 'microphone';

export class PermissionsService {
  async checkBluetoothPermissions(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.log('Running on web, skipping native permission checks');
        return true;
      }

      console.log('Checking Bluetooth permissions...');
      
      // Check if Bluetooth is available and enabled
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

      // Initialize BleClient first
      console.log('Initializing BLE client...');
      await BleClient.initialize();
      console.log('BleClient initialized successfully');
      
      // Check if Bluetooth is enabled, request if not
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
      
      // Final check after potential enable request
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
      // On mobile, show instructions for manual settings
      console.log('User needs to open device settings manually');
      // Could potentially use App plugin to open settings in future
    } else {
      console.log('Running on web, no settings to open');
    }
  }
}

export const permissionsService = new PermissionsService();
