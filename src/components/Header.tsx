
import React from 'react';

interface HeaderProps {
  isInitialized: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isInitialized }) => {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-3 mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
          Asi Archery DJ
        </h1>
      </div>
      <p className="text-gray-600">Automatic volume control based on distance from target</p>
      <div className="text-sm font-medium">
        {isInitialized ? (
          <span className="text-green-600">
            ✓ System Ready - Native Bluetooth
          </span>
        ) : (
          <span className="text-amber-600">Initializing system...</span>
        )}
      </div>
    </div>
  );
};
