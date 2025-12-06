import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Camera, Search, User, Building2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScannedResult {
  id: string;
  name: string;
  type: 'resident' | 'business';
  address: string;
  lastVisit: string;
}

const MOCK_RESULTS: Record<string, ScannedResult> = {
  'RES-001': { id: 'RES-001', name: 'Juan Dela Cruz', type: 'resident', address: 'Zone 1, Purok 3', lastVisit: '2025-12-01' },
  'RES-002': { id: 'RES-002', name: 'Maria Santos', type: 'resident', address: 'Zone 2, Purok 1', lastVisit: '2025-11-28' },
  'BUS-001': { id: 'BUS-001', name: 'Dela Cruz Sari-Sari Store', type: 'business', address: 'Zone 1, Purok 3', lastVisit: '2025-11-20' },
};

interface QRScannerProps {
  onScan?: (result: ScannedResult) => void;
  className?: string;
}

export function QRScanner({ onScan, className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualId, setManualId] = useState('');
  const [scannedResult, setScannedResult] = useState<ScannedResult | null>(null);

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const ids = Object.keys(MOCK_RESULTS);
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      const result = MOCK_RESULTS[randomId];
      setScannedResult(result);
      setIsScanning(false);
      toast({
        title: 'QR Code Scanned',
        description: `Found: ${result.name}`,
      });
      onScan?.(result);
    }, 1500);
  };

  const handleManualSearch = () => {
    const result = MOCK_RESULTS[manualId.toUpperCase()];
    if (result) {
      setScannedResult(result);
      toast({
        title: 'Record Found',
        description: `Found: ${result.name}`,
      });
      onScan?.(result);
    } else {
      toast({
        title: 'Not Found',
        description: 'No record found with that ID',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          QR Code Scanner
        </CardTitle>
        <CardDescription>
          Scan a citizen or business QR code to pull up their records instantly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scanner Preview */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border">
          {isScanning ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-48 h-48 border-4 border-primary rounded-lg animate-pulse" />
              <div className="absolute inset-0 bg-primary/10">
                <div className="absolute left-0 right-0 h-1 bg-primary animate-scan" />
              </div>
              <p className="text-sm text-muted-foreground absolute bottom-4">Scanning...</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Camera className="w-16 h-16 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
            </div>
          )}
        </div>

        {/* Scan Button */}
        <Button className="w-full gap-2" onClick={simulateScan} disabled={isScanning}>
          <Camera className="w-4 h-4" />
          {isScanning ? 'Scanning...' : 'Simulate QR Scan'}
        </Button>

        {/* Manual Entry */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or enter ID manually</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter ID (e.g., RES-001)"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
          />
          <Button variant="outline" onClick={handleManualSearch}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Scanned Result */}
        {scannedResult && (
          <div className="p-4 bg-muted/50 rounded-lg border animate-fade-in">
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                scannedResult.type === 'resident' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
              )}>
                {scannedResult.type === 'resident' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{scannedResult.name}</p>
                  <CheckCircle className="w-4 h-4 text-status-success" />
                </div>
                <p className="text-xs text-muted-foreground font-mono">{scannedResult.id}</p>
                <p className="text-sm text-muted-foreground mt-1">{scannedResult.address}</p>
                <p className="text-xs text-muted-foreground">Last visit: {scannedResult.lastVisit}</p>
              </div>
            </div>
            <Button className="w-full mt-3" size="sm">
              View Full Record
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}