
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9f37b4b0f1a2478eb91fa699da058f77',
  appName: 'archers-bluetooth-volume-control',
  webDir: 'dist',
  server: {
    url: 'https://9f37b4b0-f1a2-478e-b91f-a699da058f77.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "סורק התקני Bluetooth...",
        cancel: "ביטול",
        availableDevices: "התקנים זמינים",
        noDeviceFound: "לא נמצאו התקנים"
      }
    }
  }
};

export default config;
