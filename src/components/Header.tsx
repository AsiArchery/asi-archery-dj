
import React from 'react';
import { Speaker, Smartphone } from 'lucide-react';

interface HeaderProps {
  isInitialized: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isInitialized }) => {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Speaker className="w-12 h-12 text-purple-600 bg-white rounded-lg shadow-lg p-2" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
          Asi Archery DJ
        </h1>
        <Smartphone className="w-6 h-6 text-purple-600" />
      </div>
      <p className="text-gray-600">שליטה אוטומטית על עוצמת הקול לפי המרחק מהמטרה</p>
      <div className="text-sm text-green-600 font-medium">
        {isInitialized ? "✓ מצב נטיבי - Bluetooth אמיתי" : "מפעיל מצב נטיבי..."}
      </div>
    </div>
  );
};
