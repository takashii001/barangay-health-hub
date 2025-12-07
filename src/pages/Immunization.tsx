import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AnimatedChart } from '@/components/charts/AnimatedChart';
import { OperationTimbangScheduler } from '@/components/features/OperationTimbangScheduler';
import { QRScanner, ScannedResult } from '@/components/features/QRScanner';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Syringe,
  Baby,
  MessageSquare,
  Bell,
  Calendar,
  QrCode,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const VACCINE_RECORDS = [
  {
    id: 'VAX-2025-001',
    childName: 'Pedro Dela Cruz Jr.',
    age: '2 years',
    parent: 'Juan Dela Cruz',
    vaccine: 'Measles',
    dateGiven: '2025-10-15',
    nextDose: '2026-10-15',
    status: 'Completed',
  },
  {
    id: 'VAX-2025-002',
    childName: 'Maria Santos Jr.',
    age: '6 months',
    parent: 'Maria Santos',
    vaccine: 'BCG',
    dateGiven: '2025-06-01',
    nextDose: '-',
    status: 'Completed',
  },
  {
    id: 'VAX-2025-003',
    childName: 'Ana Reyes',
    age: '1 year',
    parent: 'Pedro Reyes',
    vaccine: 'Polio',
    dateGiven: '2025-09-20',
    nextDose: '2025-12-20',
    status: 'Due Soon',
  },
];

const NUTRITION_RECORDS = [
  {
    id: 'NUT-2025-001',
    childName: 'Pedro Dela Cruz Jr.',
    age: '2 years',
    weight: '12.5 kg',
    height: '85 cm',
    status: 'Normal',
    lastAssessment: '2025-11-15',
  },
  {
    id: 'NUT-2025-002',
    childName: 'Maria Santos Jr.',
    age: '6 months',
    weight: '7.2 kg',
    height: '65 cm',
    status: 'Normal',
    lastAssessment: '2025-11-20',
  },
  {
    id: 'NUT-2025-003',
    childName: 'Jose Garcia',
    age: '3 years',
    weight: '10 kg',
    height: '88 cm',
    status: 'Underweight',
    lastAssessment: '2025-11-10',
  },
];

const SMS_REMINDERS = [
  {
    id: 1,
    recipient: 'Juan Dela Cruz',
    phone: '0917****123',
    message: 'Reminder: Pedro\'s Measles booster is due on Oct 15, 2026',
    scheduledDate: '2026-10-01',
    status: 'Scheduled',
  },
  {
    id: 2,
    recipient: 'Pedro Reyes',
    phone: '0918****456',
    message: 'Reminder: Ana\'s Polio vaccine is due on Dec 20, 2025',
    scheduledDate: '2025-12-15',
    status: 'Scheduled',
  },
];

const VACCINATION_TREND_DATA = [
  { name: 'Jan', vaccinations: 42 },
  { name: 'Feb', vaccinations: 38 },
  { name: 'Mar', vaccinations: 55 },
  { name: 'Apr', vaccinations: 47 },
  { name: 'May', vaccinations: 52 },
  { name: 'Jun', vaccinations: 48 },
];

const NUTRITION_STATUS_DATA = [
  { name: 'Normal', value: 85 },
  { name: 'Underweight', value: 10 },
  { name: 'Overweight', value: 5 },
];

export default function Immunization() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const isReadOnly = user?.role === 'captain';
  const canEdit = user?.role === 'bhw' || user?.role === 'clerk' || user?.role === 'sysadmin';

  const handleQRScan = (result: ScannedResult) => {
    setShowScanner(false);
    toast({
      title: 'Resident Found',
      description: `Loading health records for: ${result.name}`,
      className: 'bg-green-600 text-white border-green-700',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Immunization & Nutrition</h1>
          <p className="page-description">
            Track vaccinations, nutrition status, and health reminders
            {isReadOnly && ' (View Only Mode)'}
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Dialog open={showScanner} onOpenChange={setShowScanner}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <QrCode className="w-4 h-4" />
                  Scan Resident QR
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Scan Resident QR Code</DialogTitle>
                </DialogHeader>
                <QRScanner onScan={handleQRScan} type="resident" />
              </DialogContent>
            </Dialog>

            <Dialog open={showScheduler} onOpenChange={setShowScheduler}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary">
                  <Calendar className="w-4 h-4" />
                  Operation Timbang Scheduler
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Auto-Schedule Operation Timbang</DialogTitle>
                </DialogHeader>
                <OperationTimbangScheduler />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AnimatedChart
          title="Vaccination Trend"
          description="Monthly vaccinations administered"
          data={VACCINATION_TREND_DATA}
          type="area"
          dataKeys={['vaccinations']}
          colors={['hsl(var(--primary))']}
        />
        <AnimatedChart
          title="Nutrition Status Distribution"
          description="Current nutrition assessment results"
          data={NUTRITION_STATUS_DATA}
          type="pie"
          dataKeys={['value']}
        />
      </div>

      <Tabs defaultValue="vaccinations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="vaccinations" className="gap-2">
            <Syringe className="w-4 h-4" />
            Vaccinations
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="gap-2">
            <Baby className="w-4 h-4" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="reminders" className="gap-2">
            <Bell className="w-4 h-4" />
            Reminders
          </TabsTrigger>
        </TabsList>

        {/* Vaccinations Tab */}
        <TabsContent value="vaccinations">
          <Card className="animate-slide-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Vaccination Records</CardTitle>
                  <CardDescription>
                    Immunization history and schedules
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  {canEdit && (
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Record
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="data-table-header">
                      <TableHead>ID</TableHead>
                      <TableHead>Child Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Parent/Guardian</TableHead>
                      <TableHead>Vaccine</TableHead>
                      <TableHead>Date Given</TableHead>
                      <TableHead>Next Dose</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VACCINE_RECORDS.filter(
                      (r) =>
                        r.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.id.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((record, index) => (
                      <TableRow 
                        key={record.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>{record.childName}</TableCell>
                        <TableCell>{record.age}</TableCell>
                        <TableCell>{record.parent}</TableCell>
                        <TableCell>{record.vaccine}</TableCell>
                        <TableCell>{record.dateGiven}</TableCell>
                        <TableCell>{record.nextDose}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={record.status === 'Completed' ? 'success' : 'warning'}
                            label={record.status}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {canEdit && (
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition">
          <Card className="animate-slide-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Nutrition Tracker</CardTitle>
                  <CardDescription>
                    Child nutrition monitoring and assessment
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Assessment
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="data-table-header">
                      <TableHead>ID</TableHead>
                      <TableHead>Child Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Height</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Assessment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {NUTRITION_RECORDS.map((record, index) => (
                      <TableRow 
                        key={record.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>{record.childName}</TableCell>
                        <TableCell>{record.age}</TableCell>
                        <TableCell>{record.weight}</TableCell>
                        <TableCell>{record.height}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={record.status === 'Normal' ? 'success' : 'warning'}
                            label={record.status}
                          />
                        </TableCell>
                        <TableCell>{record.lastAssessment}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {canEdit && (
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders">
          <Card className="animate-slide-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>SMS Reminder Dashboard</CardTitle>
                  <CardDescription>
                    Scheduled vaccination and checkup reminders (Mock)
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="data-table-header">
                      <TableHead>Recipient</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SMS_REMINDERS.map((reminder, index) => (
                      <TableRow 
                        key={reminder.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">{reminder.recipient}</TableCell>
                        <TableCell>{reminder.phone}</TableCell>
                        <TableCell className="max-w-xs truncate">{reminder.message}</TableCell>
                        <TableCell>{reminder.scheduledDate}</TableCell>
                        <TableCell>
                          <StatusBadge status="info" label={reminder.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
