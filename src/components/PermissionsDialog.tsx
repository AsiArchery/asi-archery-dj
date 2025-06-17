
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings, Smartphone, MapPin } from 'lucide-react';

interface PermissionsDialogProps {
  isVisible: boolean;
  onRequestPermissions: () => void;
  onDismiss: () => void;
}

export const PermissionsDialog: React.FC<PermissionsDialogProps> = ({
  isVisible,
  onRequestPermissions,
  onDismiss
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-left">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Permissions Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              The app requires the following permissions to function:
            </p>
            
            <div className="bg-blue-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-left">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Bluetooth - for speaker connection and volume control</span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <MapPin className="w-4 h-4 text-green-600" />
                <span>Location - required for Bluetooth device scanning</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <strong>Note:</strong> The app does not store or use personal location data.
              Location permission is required by Android for Bluetooth device scanning only.
            </div>

            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
              <strong>Instructions:</strong> Click "Grant Permissions" and approve both permissions that appear.
              If permissions don't appear, manually open app settings.
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onDismiss} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={onRequestPermissions} className="flex-1">
              Grant Permissions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
