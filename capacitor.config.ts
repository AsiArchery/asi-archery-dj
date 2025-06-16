
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9f37b4b0f1a2478eb91fa699da058f77',
  appName: 'Asi Archery DJ',
  webDir: 'dist',
  server: {
    url: 'https://9f37b4b0-f1a2-478e-b91f-a699da058f77.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "Scanning for Bluetooth devices...",
        cancel: "Cancel",
        availableDevices: "Available Devices",
        noDeviceFound: "No devices found"
      }
    }
  },
  android: {
    permissions: [
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.BLUETOOTH_SCAN',
      'android.permission.BLUETOOTH_CONNECT',
      'android.permission.MODIFY_AUDIO_SETTINGS'
    ]
  },
  ios: {
    plist: {
      NSBluetoothAlwaysUsageDescription: 'This app uses Bluetooth to connect to speakers and control volume',
      NSBluetoothPeripheralUsageDescription: 'This app uses Bluetooth to connect to speakers and control volume',
      NSLocationWhenInUseUsageDescription: 'Location access is required for Bluetooth functionality'
    }
  }
};

export default config;
