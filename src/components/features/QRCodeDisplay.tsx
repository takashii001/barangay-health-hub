import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
  userId: string;
  userName: string;
  type: 'resident' | 'business';
  className?: string;
}

export function QRCodeDisplay({ userId, userName, type, className }: QRCodeDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Generate a mock QR code pattern (in real app, use a QR library)
  const generateQRPattern = () => {
    const size = 21;
    const pattern: boolean[][] = [];
    
    for (let i = 0; i < size; i++) {
      pattern[i] = [];
      for (let j = 0; j < size; j++) {
        // Create finder patterns in corners
        if ((i < 7 && j < 7) || (i < 7 && j >= size - 7) || (i >= size - 7 && j < 7)) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || j === size - 1 || j === size - 7 || i === size - 1 || i === size - 7) {
            pattern[i][j] = true;
          } else if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            pattern[i][j] = true;
          } else if (i >= 2 && i <= 4 && j >= size - 5 && j <= size - 3) {
            pattern[i][j] = true;
          } else if (i >= size - 5 && i <= size - 3 && j >= 2 && j <= 4) {
            pattern[i][j] = true;
          } else {
            pattern[i][j] = false;
          }
        } else {
          // Random data pattern based on userId
          const hash = (userId.charCodeAt(i % userId.length) + j * 17) % 3;
          pattern[i][j] = hash === 0 || hash === 1;
        }
      }
    }
    return pattern;
  };

  const qrPattern = generateQRPattern();

  return (
    <Card className={cn(
      'max-w-md mx-auto transition-all duration-700',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      className
    )}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          My Citizen QR Code
        </CardTitle>
        <CardDescription>
          Present this QR code when availing barangay health services
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* QR Code */}
        <div className="bg-white p-6 rounded-xl shadow-inner mx-auto w-fit">
          <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(21, 10px)` }}>
            {qrPattern.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={cn(
                    'w-[10px] h-[10px] transition-all duration-500',
                    cell ? 'bg-foreground' : 'bg-white'
                  )}
                  style={{ transitionDelay: `${(i + j) * 5}ms` }}
                />
              ))
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mt-6 space-y-1">
          <p className="font-bold text-lg">{userName}</p>
          <p className="text-sm text-muted-foreground font-mono">{userId}</p>
          <p className="text-xs text-muted-foreground capitalize">{type} ID</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1 gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          This QR code is unique to your profile and can be scanned by BHW or BSI for quick access to your records.
        </p>
      </CardContent>
    </Card>
  );
}