import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, MapPin, AlertTriangle, Droplets, Syringe, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MapPin {
  id: string;
  x: number;
  y: number;
  type: 'disease' | 'inspection' | 'complaint' | 'vaccination';
  zone: string;
  label: string;
  count: number;
  details: string;
}

const MOCK_PINS: MapPin[] = [
  { id: '1', x: 25, y: 30, type: 'disease', zone: 'Purok 1', label: 'Dengue Cluster', count: 5, details: '5 active dengue cases reported in the last 7 days' },
  { id: '2', x: 45, y: 20, type: 'disease', zone: 'Purok 2', label: 'Flu Cases', count: 8, details: '8 flu cases under monitoring' },
  { id: '3', x: 70, y: 35, type: 'inspection', zone: 'Purok 3', label: 'Failed Inspection', count: 2, details: '2 businesses failed sanitation inspection' },
  { id: '4', x: 30, y: 55, type: 'complaint', zone: 'Purok 4', label: 'Open Canal', count: 3, details: '3 open canal complaints pending resolution' },
  { id: '5', x: 55, y: 65, type: 'vaccination', zone: 'Purok 5', label: 'High Vaccination', count: 95, details: '95% vaccination coverage achieved' },
  { id: '6', x: 80, y: 50, type: 'vaccination', zone: 'Purok 6', label: 'Vaccination Drive', count: 78, details: '78% coverage, drive scheduled' },
  { id: '7', x: 15, y: 70, type: 'complaint', zone: 'Purok 7', label: 'Septic Issues', count: 2, details: '2 septic tank complaints reported' },
  { id: '8', x: 60, y: 25, type: 'disease', zone: 'Purok 8', label: 'Diarrhea Cases', count: 4, details: '4 diarrhea cases, water quality check needed' },
];

const getPinColor = (type: MapPin['type']) => {
  switch (type) {
    case 'disease':
      return 'bg-red-500 hover:bg-red-600 shadow-red-500/50';
    case 'inspection':
      return 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/50';
    case 'complaint':
      return 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/50';
    case 'vaccination':
      return 'bg-green-500 hover:bg-green-600 shadow-green-500/50';
  }
};

const getPinIcon = (type: MapPin['type']) => {
  switch (type) {
    case 'disease':
      return AlertTriangle;
    case 'inspection':
      return Building2;
    case 'complaint':
      return Droplets;
    case 'vaccination':
      return Syringe;
  }
};

interface BarangayHealthMapProps {
  className?: string;
}

export function BarangayHealthMap({ className }: BarangayHealthMapProps) {
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useState(() => {
    setTimeout(() => setIsVisible(true), 100);
  });

  return (
    <div className={cn('relative', className)}>
      {/* Map Container */}
      <div 
        className={cn(
          'relative w-full h-[500px] bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg overflow-hidden border-2 border-border transition-all duration-700',
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Zone labels */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
          <h3 className="text-sm font-bold mb-2">Barangay Zones</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Disease Cluster</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Failed Inspection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Open Complaint</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>High Vaccination</span>
            </div>
          </div>
        </div>

        {/* Map pins */}
        {MOCK_PINS.map((pin, index) => {
          const Icon = getPinIcon(pin.type);
          return (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              className={cn(
                'absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-125 cursor-pointer animate-pulse',
                getPinColor(pin.type)
              )}
              style={{ 
                left: `${pin.x}%`, 
                top: `${pin.y}%`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}

        {/* Roads simulation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <path d="M 0 200 Q 150 180, 300 200 T 600 180" stroke="currentColor" strokeWidth="8" fill="none" />
          <path d="M 200 0 Q 220 150, 200 300 T 180 500" stroke="currentColor" strokeWidth="6" fill="none" />
          <path d="M 400 0 Q 380 200, 420 400 T 400 500" stroke="currentColor" strokeWidth="6" fill="none" />
        </svg>
      </div>

      {/* Pin Details Popup */}
      {selectedPin && (
        <Card className="absolute top-4 right-4 w-72 shadow-2xl animate-scale-in z-10">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white', getPinColor(selectedPin.type).split(' ')[0])}>
                  {(() => {
                    const Icon = getPinIcon(selectedPin.type);
                    return <Icon className="w-4 h-4" />;
                  })()}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{selectedPin.label}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedPin.zone}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedPin(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{selectedPin.count}</div>
              <p className="text-sm text-muted-foreground mt-1">{selectedPin.details}</p>
            </div>
            <Button className="w-full mt-3" size="sm">
              View Full Details
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}