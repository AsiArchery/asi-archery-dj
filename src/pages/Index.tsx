
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useBluetoothNative } from '@/hooks/useBluetoothNative';
import { Header } from '@/components/Header';
import { BluetoothConnection } from '@/components/BluetoothConnection';
import { SignalDisplay } from '@/components/SignalDisplay';
import { ControlPanel } from '@/components/ControlPanel';
import { StatusInfo } from '@/components/StatusInfo';
import { PermissionsDialog } from '@/components/PermissionsDialog';

const Index = () => {
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(5);
  const [targetDistance, setTargetDistance] = useState('50');
  const [initialVolume, setInitialVolume] = useState([3]);
  const [minVolume, setMinVolume] = useState([1]);
  const [maxVolume, setMaxVolume] = useState([10]);
  const { toast } = useToast();

  const {
    isInitialized,
    isConnected,
    connectedDevice,
    rssi,
    showPermissionsDialog,
    connectToSystemAudio,
    disconnect,
    setVolume,
    handlePermissionsRequest,
    dismissPermissionsDialog
  } = useBluetoothNative();

  // Fixed volume calculation: Lower RSSI (farther) = Higher volume
  const calculateVolume = (rssiValue: number) => {
    // Convert RSSI to distance-based volume
    // RSSI range: -80 (far) to -20 (close)
    // Volume should be: far = high volume, close = low volume
    const normalizedDistance = Math.max(0, Math.min(1, (-rssiValue - 20) / 60));
    const volume = minVolume[0] + normalizedDistance * (maxVolume[0] - minVolume[0]);
    return Math.round(volume);
  };

  useEffect(() => {
    if (isConnected && isAutoMode) {
      const newVolume = calculateVolume(rssi);
      if (newVolume !== currentVolume) {
        setCurrentVolume(newVolume);
        setVolume(newVolume);
        console.log(`RSSI: ${Math.round(rssi)}, Volume: ${newVolume}`);
      }
    }
  }, [rssi, isConnected, isAutoMode, minVolume, maxVolume, currentVolume]);

  const toggleAutoMode = () => {
    setIsAutoMode(!isAutoMode);
    if (!isAutoMode) {
      toast({
        title: "Auto Mode Enabled",
        description: "Volume will automatically adjust based on distance",
      });
    }
  };

  const getSignalStrength = (rssi: number) => {
    return Math.max(0, Math.min(100, ((rssi + 100) / 70) * 100));
  };

  return (
    <div 
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: `url('/lovable-uploads/185c1280-34ab-4f1c-8252-53c6f706c6c3.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <Header isInitialized={isInitialized} />

        <BluetoothConnection
          isInitialized={isInitialized}
          isConnected={isConnected}
          connectedDevice={connectedDevice}
          connectToSystemAudio={connectToSystemAudio}
          disconnect={disconnect}
        />

        <SignalDisplay
          rssi={rssi}
          currentVolume={currentVolume}
          maxVolume={maxVolume[0]}
          isConnected={isConnected}
          getSignalStrength={getSignalStrength}
        />

        <ControlPanel
          isAutoMode={isAutoMode}
          isConnected={isConnected}
          targetDistance={targetDistance}
          initialVolume={initialVolume}
          minVolume={minVolume}
          maxVolume={maxVolume}
          toggleAutoMode={toggleAutoMode}
          setTargetDistance={setTargetDistance}
          setInitialVolume={setInitialVolume}
          setMinVolume={setMinVolume}
          setMaxVolume={setMaxVolume}
        />

        <StatusInfo
          targetDistance={targetDistance}
          minVolume={minVolume}
          maxVolume={maxVolume}
          isAutoMode={isAutoMode}
          isConnected={isConnected}
          connectedDevice={connectedDevice}
          calculateVolume={calculateVolume}
          rssi={rssi}
        />

        <PermissionsDialog
          isVisible={showPermissionsDialog}
          onRequestPermissions={handlePermissionsRequest}
          onDismiss={dismissPermissionsDialog}
        />
      </div>
    </div>
  );
};

export default Index;
