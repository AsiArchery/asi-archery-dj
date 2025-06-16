
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
  }
};

export default config;
