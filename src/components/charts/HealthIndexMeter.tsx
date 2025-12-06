import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface HealthIndexMeterProps {
  score: number;
  maxScore?: number;
  className?: string;
}

export function HealthIndexMeter({ score, maxScore = 100, className }: HealthIndexMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const percentage = (animatedScore / maxScore) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  const getColor = () => {
    if (percentage >= 80) return 'text-status-success';
    if (percentage >= 60) return 'text-status-warning';
    return 'text-destructive';
  };

  const getLabel = () => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getBgColor = () => {
    if (percentage >= 80) return 'from-green-500 to-green-600';
    if (percentage >= 60) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center transition-all duration-700',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
        className
      )}
    >
      {/* Gauge Container */}
      <div className="relative w-48 h-28 overflow-hidden">
        {/* Background arc */}
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full border-[12px] border-muted" 
          style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }} 
        />
        
        {/* Colored arc */}
        <div
          className={cn('absolute bottom-0 left-0 w-48 h-48 rounded-full border-[12px] bg-gradient-to-r transition-all duration-1000', getBgColor())}
          style={{
            clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
            borderColor: 'transparent',
            background: `conic-gradient(from 180deg, hsl(var(--muted)) 0deg, hsl(var(--muted)) ${180 - (percentage * 1.8)}deg, transparent ${180 - (percentage * 1.8)}deg)`,
            transform: 'rotate(180deg)',
          }}
        />

        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className="w-1 h-20 bg-foreground rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-foreground rounded-full" />
        </div>
      </div>

      {/* Score Display */}
      <div className="text-center mt-4">
        <div className={cn('text-5xl font-bold transition-colors', getColor())}>
          {animatedScore}
          <span className="text-2xl text-muted-foreground">/{maxScore}</span>
        </div>
        <div className={cn('text-lg font-semibold mt-1', getColor())}>
          {getLabel()}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Barangay Health Index
        </p>
      </div>
    </div>
  );
}