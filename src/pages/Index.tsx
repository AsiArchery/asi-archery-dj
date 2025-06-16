
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useBluetoothNative } from '@/hooks/useBluetoothNative';
import { Header } from '@/components/Header';
import { BluetoothConnection } from '@/components/BluetoothConnection';
import { SignalDisplay } from '@/components/SignalDisplay';
import { ControlPanel } from '@/components/ControlPanel';
import { StatusInfo } from '@/components/StatusInfo';

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
    isScanning,
    discoveredDevices,
    connectedDevice,
    rssi,
    isNative,
    startScan,
    connectToDevice,
    disconnect,
    setVolume
  } = useBluetoothNative();

  const calculateVolume = (rssiValue: number) => {
    const normalized = Math.max(0, Math.min(1, (rssiValue + 100) / 70));
    const volume = minVolume[0] + normalized * (maxVolume[0] - minVolume[0]);
    return Math.round(volume);
  };

  useEffect(() => {
    if (isConnected && isAutoMode) {
      const newVolume = calculateVolume(rssi);
      if (newVolume !== currentVolume) {
        setCurrentVolume(newVolume);
        setVolume(newVolume);
      }
    }
  }, [rssi, isConnected, isAutoMode, minVolume, maxVolume, currentVolume]);

  const toggleAutoMode = () => {
    setIsAutoMode(!isAutoMode);
    if (!isAutoMode) {
      toast({
        title: "מצב אוטומטי הופעל",
        description: "הווליום יכוונן אוטומטית לפי המרחק",
      });
    }
  };

  const getSignalStrength = (rssi: number) => {
    return Math.max(0, Math.min(100, ((rssi + 100) / 70) * 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header isInitialized={isInitialized} isNative={isNative} />

        <BluetoothConnection
          isInitialized={isInitialized}
          isConnected={isConnected}
          isScanning={isScanning}
          discoveredDevices={discoveredDevices}
          connectedDevice={connectedDevice}
          startScan={startScan}
          connectToDevice={connectToDevice}
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
      </div>
    </div>
  );
};

export default Index;
