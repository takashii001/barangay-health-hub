import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ClipboardCheck,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Inspection } from '@/types/database';

const MOCK_INSPECTIONS: Inspection[] = [
  {
    id: '1',
    application_id: 'APP-001',
    establishment_id: '1',
    inspector_id: '4',
    scheduled_date: '2025-12-10',
    status: 'scheduled',
    created_at: '2025-12-01',
    updated_at: '2025-12-01',
  },
  {
    id: '2',
    application_id: 'APP-002',
    establishment_id: '2',
    inspector_id: '4',
    scheduled_date: '2025-12-05',
    completed_date: '2025-12-05',
    status: 'completed',
    findings: 'All areas clean. Proper waste disposal observed.',
    compliance_status: 'compliant',
    recommendation: 'approve',
    created_at: '2025-11-28',
    updated_at: '2025-12-05',
  },
  {
    id: '3',
    application_id: 'APP-003',
    establishment_id: '3',
    inspector_id: '4',
    scheduled_date: '2025-12-08',
    completed_date: '2025-12-08',
    status: 'completed',
    findings: 'Drainage system needs repair. Waste segregation not followed.',
    compliance_status: 'non_compliant',
    correction_notice: 'Repair drainage within 15 days.',
    recommendation: 'reinspect',
    created_at: '2025-11-30',
    updated_at: '2025-12-08',
  },
];

export default function InspectionManagement() {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [conductDialogOpen, setConductDialogOpen] = useState(false);
  const [findings, setFindings] = useState('');
  const [compliance, setCompliance] = useState<'compliant' | 'non_compliant' | 'partial'>('compliant');
  const [recommendation, setRecommendation] = useState<'approve' | 'reject' | 'reinspect'>('approve');
  const [correctionNotice, setCorrectionNotice] = useState('');

  const scheduled = inspections.filter(i => i.status === 'scheduled');
  const completed = inspections.filter(i => i.status === 'completed');

  const handleConduct = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setFindings('');
    setCompliance('compliant');
    setRecommendation('approve');
    setCorrectionNotice('');
    setConductDialogOpen(true);
  };

  const handleSubmitInspection = () => {
    if (!selectedInspection) return;
    setInspections(prev =>
      prev.map(i =>
        i.id === selectedInspection.id
          ? {
              ...i,
              status: 'completed' as const,
              completed_date: new Date().toISOString(),
              findings,
              compliance_status: compliance,
              recommendation,
              correction_notice: correctionNotice || undefined,
            }
          : i
      )
    );
    setConductDialogOpen(false);
    toast({
      title: 'Inspection Completed',
      description: `Inspection #${selectedInspection.id} has been submitted.`,
    });
  };

  const complianceIcon = (status?: string | null) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'non_compliant': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default: return null;
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, 'info' | 'success' | 'warning' | 'pending'> = {
      scheduled: 'info',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'pending',
    };
    return <StatusBadge status={map[status] || 'pending'} label={status.replace('_', ' ')} />;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Inspection Management</h1>
        <p className="page-description">
          View scheduled inspections, conduct digital inspections, and record findings
        </p>
      </div>

      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">
            Scheduled ({scheduled.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Scheduled Inspections
              </CardTitle>
              <CardDescription>Upcoming inspections to conduct</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Application</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduled.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">INS-{inspection.id}</TableCell>
                        <TableCell>{inspection.application_id || '—'}</TableCell>
                        <TableCell>{inspection.scheduled_date}</TableCell>
                        <TableCell>{statusBadge(inspection.status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleConduct(inspection)}
                          >
                            <ClipboardCheck className="w-4 h-4 mr-2" />
                            Conduct
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {scheduled.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No scheduled inspections.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Completed Inspections
              </CardTitle>
              <CardDescription>Past inspection records and findings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date Completed</TableHead>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Recommendation</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completed.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">INS-{inspection.id}</TableCell>
                        <TableCell>{inspection.completed_date || '—'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {complianceIcon(inspection.compliance_status)}
                            <span className="capitalize text-sm">
                              {inspection.compliance_status?.replace('_', ' ') || '—'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize text-sm">{inspection.recommendation || '—'}</span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {inspection.findings || '—'}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {completed.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No completed inspections.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Conduct Inspection Dialog */}
      <Dialog open={conductDialogOpen} onOpenChange={setConductDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Conduct Inspection</DialogTitle>
            <DialogDescription>
              Record your findings for inspection INS-{selectedInspection?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Findings</Label>
              <Textarea
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Describe your inspection findings..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Compliance Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={compliance}
                onChange={(e) => setCompliance(e.target.value as any)}
              >
                <option value="compliant">Compliant</option>
                <option value="non_compliant">Non-Compliant</option>
                <option value="partial">Partial</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Recommendation</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value as any)}
              >
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
                <option value="reinspect">Reinspect</option>
              </select>
            </div>
            {(compliance === 'non_compliant' || compliance === 'partial') && (
              <div className="space-y-2">
                <Label>Correction Notice</Label>
                <Textarea
                  value={correctionNotice}
                  onChange={(e) => setCorrectionNotice(e.target.value)}
                  placeholder="Describe required corrections..."
                  rows={3}
                />
              </div>
            )}
            <Button
              onClick={handleSubmitInspection}
              className="w-full"
              disabled={!findings}
            >
              Submit Inspection Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
