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
import { QRScanner, ScannedResult } from '@/components/features/QRScanner';
import { InspectionChecklist } from '@/components/features/InspectionChecklist';
import {
  Search,
  Plus,
  Eye,
  Edit,
  ClipboardCheck,
  Building2,
  AlertCircle,
  CheckCircle,
  QrCode,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PERMITS = [
  {
    id: 'SP-2025-001',
    businessName: 'Dela Cruz Sari-Sari Store',
    owner: 'Juan Dela Cruz',
    address: 'Zone 1, Purok 3',
    type: 'Food Establishment',
    dateApplied: '2025-11-01',
    status: 'Approved',
    expiryDate: '2026-01-15',
  },
  {
    id: 'SP-2025-002',
    businessName: 'Santos Carinderia',
    owner: 'Maria Santos',
    address: 'Zone 2, Purok 1',
    type: 'Food Establishment',
    dateApplied: '2025-11-28',
    status: 'Pending Inspection',
    expiryDate: '-',
  },
  {
    id: 'SP-2025-003',
    businessName: 'Reyes Bakery',
    owner: 'Pedro Reyes',
    address: 'Zone 1, Purok 5',
    type: 'Food Establishment',
    dateApplied: '2025-11-15',
    status: 'Under Review',
    expiryDate: '-',
  },
];

const INSPECTIONS = [
  {
    id: 'INS-2025-001',
    businessName: 'Dela Cruz Sari-Sari Store',
    inspectionDate: '2025-11-20',
    inspector: 'Pedro Reyes (BSI)',
    result: 'Passed',
    notes: 'All sanitation requirements met',
  },
  {
    id: 'INS-2025-002',
    businessName: 'Garcia Hardware',
    inspectionDate: '2025-11-25',
    inspector: 'Pedro Reyes (BSI)',
    result: 'Failed',
    notes: 'Waste disposal not compliant',
  },
];

const VIOLATIONS = [
  {
    id: 'VIO-2025-001',
    businessName: 'Garcia Hardware',
    violationType: 'Improper Waste Disposal',
    dateIssued: '2025-11-25',
    deadline: '2025-12-10',
    status: 'Open',
    fineAmount: '₱500',
  },
];

export default function Sanitation() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [showInspection, setShowInspection] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  const isReadOnly = user?.role === 'captain';
  const canEdit = user?.role === 'bsi' || user?.role === 'clerk' || user?.role === 'sysadmin';
  const canInspect = user?.role === 'bsi' || user?.role === 'sysadmin';

  const handleQRScan = (result: ScannedResult) => {
    setShowScanner(false);
    toast({
      title: 'QR Code Scanned',
      description: `Business permit found: ${result.name}`,
      className: 'bg-green-600 text-white border-green-700',
    });
  };

  const handleStartInspection = (businessName: string) => {
    setSelectedBusiness(businessName);
    setShowInspection(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Sanitation & Permits</h1>
        <p className="page-description">
          Manage sanitation permits, inspections, and violations
          {isReadOnly && ' (View Only Mode)'}
        </p>
      </div>

      <Tabs defaultValue="permits" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="permits" className="gap-2">
              <Building2 className="w-4 h-4" />
              Permits
            </TabsTrigger>
            <TabsTrigger value="inspections" className="gap-2">
              <ClipboardCheck className="w-4 h-4" />
              Inspections
            </TabsTrigger>
            <TabsTrigger value="violations" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              Violations
            </TabsTrigger>
          </TabsList>

          {canInspect && (
            <Dialog open={showScanner} onOpenChange={setShowScanner}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <QrCode className="w-4 h-4" />
                  Scan Business QR
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Scan Business Permit QR Code</DialogTitle>
                </DialogHeader>
                <QRScanner onScan={handleQRScan} type="business" />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Permits Tab */}
        <TabsContent value="permits">
          <Card className="animate-slide-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Sanitation Permits</CardTitle>
                  <CardDescription>
                    Business sanitation permit applications and status
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search permits..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  {canEdit && (
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Permit
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
                      <TableHead>Permit ID</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PERMITS.filter(
                      (p) =>
                        p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.id.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((permit, index) => (
                      <TableRow 
                        key={permit.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">{permit.id}</TableCell>
                        <TableCell>{permit.businessName}</TableCell>
                        <TableCell>{permit.owner}</TableCell>
                        <TableCell>{permit.type}</TableCell>
                        <TableCell>{permit.dateApplied}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              permit.status === 'Approved'
                                ? 'success'
                                : permit.status === 'Pending Inspection'
                                ? 'warning'
                                : 'info'
                            }
                            label={permit.status}
                          />
                        </TableCell>
                        <TableCell>{permit.expiryDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {canInspect && permit.status === 'Pending Inspection' && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleStartInspection(permit.businessName)}
                              >
                                <ClipboardCheck className="w-4 h-4" />
                              </Button>
                            )}
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

        {/* Inspections Tab */}
        <TabsContent value="inspections">
          <Card className="animate-slide-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Inspection Records</CardTitle>
                  <CardDescription>
                    Sanitation inspection history and results
                  </CardDescription>
                </div>
                {canInspect && (
                  <Dialog open={showInspection} onOpenChange={setShowInspection}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Inspection
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Digital Inspection Checklist
                          {selectedBusiness && ` - ${selectedBusiness}`}
                        </DialogTitle>
                      </DialogHeader>
                      <InspectionChecklist 
                        businessName={selectedBusiness || 'New Business'} 
                        onComplete={() => {
                          setShowInspection(false);
                          setSelectedBusiness(null);
                          toast({
                            title: 'Inspection Submitted',
                            description: 'The inspection report has been saved successfully.',
                            className: 'bg-green-600 text-white border-green-700',
                          });
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="data-table-header">
                      <TableHead>ID</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {INSPECTIONS.map((inspection, index) => (
                      <TableRow 
                        key={inspection.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">{inspection.id}</TableCell>
                        <TableCell>{inspection.businessName}</TableCell>
                        <TableCell>{inspection.inspectionDate}</TableCell>
                        <TableCell>{inspection.inspector}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={inspection.result === 'Passed' ? 'success' : 'danger'}
                            label={inspection.result}
                          />
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{inspection.notes}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
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

        {/* Violations Tab */}
        <TabsContent value="violations">
          <Card className="animate-slide-in">
            <CardHeader>
              <CardTitle>Violations Report</CardTitle>
              <CardDescription>
                Active sanitation violations and compliance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="data-table-header">
                      <TableHead>ID</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Violation Type</TableHead>
                      <TableHead>Date Issued</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Fine</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VIOLATIONS.map((violation, index) => (
                      <TableRow 
                        key={violation.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-medium">{violation.id}</TableCell>
                        <TableCell>{violation.businessName}</TableCell>
                        <TableCell>{violation.violationType}</TableCell>
                        <TableCell>{violation.dateIssued}</TableCell>
                        <TableCell>{violation.deadline}</TableCell>
                        <TableCell>{violation.fineAmount}</TableCell>
                        <TableCell>
                          <StatusBadge status="danger" label={violation.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {canEdit && (
                              <Button variant="ghost" size="icon">
                                <CheckCircle className="w-4 h-4" />
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
      </Tabs>
    </div>
  );
}
