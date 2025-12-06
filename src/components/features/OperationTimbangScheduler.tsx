import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Calendar, Baby, MapPin, CheckCircle, Clock, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScheduleItem {
  id: string;
  week: string;
  purok: string;
  childrenDue: number;
  status: 'pending' | 'confirmed' | 'completed';
  date?: string;
}

const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: '1', week: 'Week 1', purok: 'Purok 1', childrenDue: 12, status: 'confirmed', date: 'Dec 9-10, 2025' },
  { id: '2', week: 'Week 1', purok: 'Purok 2', childrenDue: 8, status: 'confirmed', date: 'Dec 11-12, 2025' },
  { id: '3', week: 'Week 2', purok: 'Purok 3', childrenDue: 15, status: 'pending' },
  { id: '4', week: 'Week 2', purok: 'Purok 4', childrenDue: 10, status: 'pending' },
  { id: '5', week: 'Week 3', purok: 'Purok 5', childrenDue: 18, status: 'pending' },
  { id: '6', week: 'Week 3', purok: 'Purok 6', childrenDue: 14, status: 'pending' },
  { id: '7', week: 'Week 4', purok: 'Purok 7', childrenDue: 9, status: 'pending' },
];

interface OperationTimbangSchedulerProps {
  onConfirm?: (schedules: ScheduleItem[]) => void;
  className?: string;
  isReadOnly?: boolean;
}

export function OperationTimbangScheduler({ onConfirm, className, isReadOnly }: OperationTimbangSchedulerProps) {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(MOCK_SCHEDULE);

  const totalChildren = schedule.reduce((acc, item) => acc + item.childrenDue, 0);
  const confirmedCount = schedule.filter(item => item.status === 'confirmed').length;

  const confirmSchedule = (id: string) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'confirmed' as const, date: 'TBD' } : item
    ));
    toast({
      title: 'Schedule Confirmed',
      description: 'The schedule has been confirmed and SMS reminders will be sent.',
    });
  };

  const confirmAll = () => {
    setSchedule(prev => prev.map(item => ({ ...item, status: 'confirmed' as const, date: item.date || 'TBD' })));
    toast({
      title: 'All Schedules Confirmed',
      description: `All ${schedule.length} schedules have been confirmed.`,
    });
    onConfirm?.(schedule);
  };

  const groupedByWeek = schedule.reduce((acc, item) => {
    if (!acc[item.week]) acc[item.week] = [];
    acc[item.week].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Baby className="w-5 h-5 text-primary" />
            Operation Timbang Auto-Scheduler
          </CardTitle>
          <CardDescription>
            System-generated schedule based on children due for weight check (6+ months since last assessment)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-card rounded-lg">
              <Users className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{totalChildren}</div>
              <p className="text-xs text-muted-foreground">Children Due</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <Calendar className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{schedule.length}</div>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto text-status-success mb-2" />
              <div className="text-2xl font-bold">{confirmedCount}</div>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      {Object.entries(groupedByWeek).map(([week, items]) => (
        <Card key={week}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {week}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg border transition-colors',
                  item.status === 'confirmed' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-muted/50'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.purok}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.childrenDue} children due for assessment
                    </p>
                    {item.date && (
                      <p className="text-xs text-primary mt-1">{item.date}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge
                    status={item.status === 'confirmed' ? 'success' : item.status === 'completed' ? 'info' : 'warning'}
                    label={item.status === 'confirmed' ? 'Confirmed' : item.status === 'completed' ? 'Completed' : 'Pending'}
                  />
                  {!isReadOnly && item.status === 'pending' && (
                    <Button size="sm" onClick={() => confirmSchedule(item.id)}>
                      Confirm
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Confirm All Button */}
      {!isReadOnly && (
        <Button className="w-full gap-2" size="lg" onClick={confirmAll}>
          <CheckCircle className="w-4 h-4" />
          Confirm All Schedules & Send SMS Reminders
        </Button>
      )}
    </div>
  );
}