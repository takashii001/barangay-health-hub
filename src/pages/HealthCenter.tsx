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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRScanner, ScannedResult } from '@/components/features/QRScanner';
import { AnimatedChart } from '@/components/charts/AnimatedChart';
import {
  Search,
  Plus,
  Eye,
  Edit,
  FileText,
  Users,
  Pill,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  QrCode,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data
const PATIENTS = [
  {
    id: 'P001',
    name: 'Juan Dela Cruz',
    age: 45,
    gender: 'Male',
    address: 'Zone 1, Purok 3',
    lastVisit: '2025-12-01',
    status: 'Active',
  },
  {
    id: 'P002',
    name: 'Maria Santos',
    age: 32,
    gender: 'Female',
    address: 'Zone 2, Purok 1',
    lastVisit: '2025-11-28',
    status: 'Active',
  },
  {
    id: 'P003',
    name: 'Pedro Reyes',
    age: 58,
    gender: 'Male',
    address: 'Zone 1, Purok 5',
    lastVisit: '2025-11-25',
    status: 'Follow-up',
  },
  {
    id: 'P004',
    name: 'Ana Garcia',
    age: 28,
    gender: 'Female',
    address: 'Zone 3, Purok 2',
    lastVisit: '2025-12-03',
    status: 'Active',
  },
  {
    id: 'P005',
    name: 'Jose Rizal',
    age: 67,
    gender: 'Male',
    address: 'Zone 2, Purok 4',
    lastVisit: '2025-11-20',
    status: 'Critical',
  },
];

const CONSULTATIONS = [
  {
    id: 'C001',
    patientName: 'Juan Dela Cruz',
    date: '2025-12-01',
    symptoms: 'Headache, Fever',
    diagnosis: 'Flu',
    medicine: 'Paracetamol',
    attendedBy: 'Maria Santos (BHW)',
  },
  {
    id: 'C002',
    patientName: 'Ana Garcia',
    date: '2025-12-03',
    symptoms: 'Cough, Sore throat',
    diagnosis: 'Upper Respiratory Infection',
    medicine: 'Amoxicillin, Vitamin C',
    attendedBy: 'Maria Santos (BHW)',
  },
  {
    id: 'C003',
    patientName: 'Pedro Reyes',
    date: '2025-11-25',
    symptoms: 'High blood pressure',
    diagnosis: 'Hypertension',
    medicine: 'Amlodipine',
    attendedBy: 'Maria Santos (BHW)',
  },
];

const MEDICINES = [
  { id: 'M001', name: 'Paracetamol 500mg', stock: 500, unit: 'tablets', status: 'In Stock' },
  { id: 'M002', name: 'Amoxicillin 500mg', stock: 200, unit: 'capsules', status: 'In Stock' },
  { id: 'M003', name: 'Vitamin C 500mg', stock: 300, unit: 'tablets', status: 'In Stock' },
  { id: 'M004', name: 'Amlodipine 5mg', stock: 50, unit: 'tablets', status: 'Low Stock' },
  { id: 'M005', name: 'Metformin 500mg', stock: 0, unit: 'tablets', status: 'Out of Stock' },
];

const CONSULTATION_TREND_DATA = [
  { name: 'Mon', consultations: 12 },
  { name: 'Tue', consultations: 18 },
  { name: 'Wed', consultations: 15 },
  { name: 'Thu', consultations: 22 },
  { name: 'Fri', consultations: 19 },
  { name: 'Sat', consultations: 8 },
  { name: 'Sun', consultations: 4 },
];

const DIAGNOSIS_DISTRIBUTION_DATA = [
  { name: 'Respiratory', value: 30 },
  { name: 'Hypertension', value: 20 },
  { name: 'Dengue', value: 18 },
  { name: 'Influenza', value: 17 },
  { name: 'Leptospirosis', value: 15 },
];

export default function HealthCenter() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const isReadOnly = user?.role === 'captain';
  const canEdit = user?.role === 'bhw' || user?.role === 'clerk' || user?.role === 'sysadmin';

  const handleAddPatient = () => {
    toast({
      title: 'Patient Added',
      description: 'New patient record has been created successfully.',
      className: 'bg-green-600 text-white border-green-700',
    });
    setIsAddDialogOpen(false);
  };

  const handleQRScan = (result: ScannedResult) => {
    setShowScanner(false);
    toast({
      title: 'Patient Found',
      description: `Loading records for: ${result.name}`,
      className: 'bg-green-600 text-white border-green-700',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Health Center Services</h1>
          <p className="page-description">
            Manage patient records, consultations, and medicine inventory
            {isReadOnly && ' (View Only Mode)'}
          </p>
        </div>
        {canEdit && (
          <Dialog open={showScanner} onOpenChange={setShowScanner}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <QrCode className="w-4 h-4" />
                Scan Patient QR
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Scan Patient QR Code</DialogTitle>
              </DialogHeader>
              <QRScanner onScan={handleQRScan} type="resident" />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AnimatedChart
          title="Weekly Consultations"
          description="Daily consultation count this week"
          data={CONSULTATION_TREND_DATA}
          type="bar"
          dataKeys={['consultations']}
          colors={['hsl(var(--primary))']}
        />
        <AnimatedChart
          title="Diagnosis Distribution"
          description="Common diagnoses this month"
          data={DIAGNOSIS_DISTRIBUTION_DATA}
          type="pie"
          dataKeys={['value']}
        />
      </div>

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="patients" className="gap-2">
            <Users className="w-4 h-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="consultations" className="gap-2">
            <Stethoscope className="w-4 h-4" />
            Consultations
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <Pill className="w-4 h-4" />
            Inventory
          </TabsTrigger>
        </TabsList>

        {/* Patients Tab */}
        <TabsContent value="patients">
          <Card className="animate-slide-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Patient Records</CardTitle>
                  <CardDescription>
                    View and manage registered patients
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  {canEdit && (
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Patient
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Patient</DialogTitle>
                          <DialogDescription>
                            Enter the patient's information below.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Juan Dela Cruz" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="age">Age</Label>
                              <Input id="age" type="number" placeholder="30" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="gender">Gender</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="Zone 1, Purok 1" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddPatient}>Add Patient</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="data-table-header">
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PATIENTS.filter(
                      (p) =>
                        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.id.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((patient, index) => (
                      <TableRow 
                        key={patient.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">{patient.id}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.address}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              patient.status === 'Active'
                                ? 'success'
                                : patient.status === 'Follow-up'
                                ? 'warning'
                                : 'danger'
                            }
                            label={patient.status}
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

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing 1-5 of 5 patients
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consultations Tab */}
        <TabsContent value="consultations">
          <Card className="animate-slide-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Consultation Records</CardTitle>
                  <CardDescription>
                    View patient consultations and medical history
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Consultation
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
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Symptoms</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Attended By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CONSULTATIONS.map((consultation, index) => (
                      <TableRow 
                        key={consultation.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">{consultation.id}</TableCell>
                        <TableCell>{consultation.patientName}</TableCell>
                        <TableCell>{consultation.date}</TableCell>
                        <TableCell>{consultation.symptoms}</TableCell>
                        <TableCell>{consultation.diagnosis}</TableCell>
                        <TableCell>{consultation.medicine}</TableCell>
                        <TableCell>{consultation.attendedBy}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card className="animate-slide-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Medicine Inventory</CardTitle>
                  <CardDescription>
                    Track and manage medicine stock levels
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medicine
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
                      <TableHead>Medicine Name</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MEDICINES.map((medicine, index) => (
                      <TableRow 
                        key={medicine.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">{medicine.id}</TableCell>
                        <TableCell>{medicine.name}</TableCell>
                        <TableCell>{medicine.stock}</TableCell>
                        <TableCell>{medicine.unit}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              medicine.status === 'In Stock'
                                ? 'success'
                                : medicine.status === 'Low Stock'
                                ? 'warning'
                                : 'danger'
                            }
                            label={medicine.status}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {canEdit && (
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
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
