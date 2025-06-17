
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
            נדרשות הרשאות
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-right">
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              האפליקציה זקוקה להרשאות הבאות כדי לפעול:
            </p>
            
            <div className="bg-blue-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-right">
                <span>בלוטות' - לחיבור לרמקול ובקרת עוצמה</span>
                <Smartphone className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-center gap-2 text-right">
                <span>מיקום - נדרש לסריקת מכשירי בלוטות'</span>
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <strong>שימו לב:</strong> האפליקציה לא שומרת או משתמשת במידע מיקום אישי.
              הרשאת המיקום נדרשת על ידי אנדרואיד לסריקת מכשירי בלוטות' בלבד.
            </div>

            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
              <strong>הוראות:</strong> לחץ על "אישור הרשאות" ואשר את שתי ההרשאות שיופיעו.
              אם לא מופיעות ההרשאות, פתח את הגדרות האפליקציה ידנית.
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onDismiss} variant="outline" className="flex-1">
              ביטול
            </Button>
            <Button onClick={onRequestPermissions} className="flex-1">
              אישור הרשאות
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
