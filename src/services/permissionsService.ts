
import { BleClient } from '@capacitor-community/bluetooth-le';
import { Permissions } from '@capacitor/permissions';
import { Capacitor } from '@capacitor/core';

export class PermissionsService {
  async checkBluetoothPermissions(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.log('Running on web, skipping native permission checks');
        return true;
      }

      // Check location permission (required for Bluetooth scanning on Android)
      const locationStatus = await Permissions.query({ name: 'location' });
      console.log('Location permission status:', locationStatus.state);

      // Check if Bluetooth is available and enabled
      const isAvailable = await BleClient.isEnabled();
      console.log('Bluetooth is available:', isAvailable);
      
      return locationStatus.state === 'granted' && isAvailable;
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

      // First request location permission (required for Bluetooth scanning)
      console.log('Requesting location permission...');
      const locationResult = await Permissions.request({ name: 'location' });
      console.log('Location permission result:', locationResult.state);
      
      if (locationResult.state !== 'granted') {
        console.log('Location permission denied');
        return false;
      }

      // Initialize BleClient
      await BleClient.initialize();
      console.log('BleClient initialized');
      
      // Check if Bluetooth is enabled, request if not
      const isEnabled = await BleClient.isEnabled();
      if (!isEnabled) {
        console.log('Bluetooth not enabled, requesting...');
        await BleClient.requestEnable();
      }
      
      // Final check
      const finalEnabled = await BleClient.isEnabled();
      console.log('Bluetooth is now enabled:', finalEnabled);
      
      return finalEnabled;
    } catch (error) {
      console.error('Failed to request Bluetooth permissions:', error);
      return false;
    }
  }

  openDeviceSettings(): void {
    if (Capacitor.isNativePlatform()) {
      // On mobile, show instructions for manual settings
      console.log('User needs to open device settings manually');
    } else {
      console.log('Running on web, no settings to open');
    }
  }
}

export const permissionsService = new PermissionsService();
