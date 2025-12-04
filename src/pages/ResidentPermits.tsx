import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Download, Building2, FileText, Plus } from 'lucide-react';

const MY_PERMITS = [
  {
    id: 'SP-2025-001',
    businessName: 'Dela Cruz Sari-Sari Store',
    type: 'Sanitation Permit',
    dateApplied: '2025-11-01',
    dateApproved: '2025-11-15',
    expiryDate: '2026-01-15',
    status: 'Approved',
  },
  {
    id: 'SP-2025-002',
    businessName: 'Dela Cruz Carinderia',
    type: 'Sanitation Permit',
    dateApplied: '2025-11-28',
    dateApproved: '-',
    expiryDate: '-',
    status: 'Pending',
  },
];

export default function ResidentPermits() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Business Permits</h1>
        <p className="page-description">
          View your sanitation permits and application status
        </p>
      </div>

      {/* Permits List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Sanitation Permits
              </CardTitle>
              <CardDescription>Your business permit applications and status</CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="data-table-header">
                  <TableHead>Permit ID</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Date Approved</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MY_PERMITS.map((permit) => (
                  <TableRow key={permit.id}>
                    <TableCell className="font-medium">{permit.id}</TableCell>
                    <TableCell>{permit.businessName}</TableCell>
                    <TableCell>{permit.type}</TableCell>
                    <TableCell>{permit.dateApplied}</TableCell>
                    <TableCell>{permit.dateApproved}</TableCell>
                    <TableCell>{permit.expiryDate}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={permit.status === 'Approved' ? 'success' : 'pending'}
                        label={permit.status}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {permit.status === 'Approved' && (
                          <Button variant="ghost" size="icon" title="Download Permit">
                            <Download className="w-4 h-4" />
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

      {/* Info Card */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Need a New Permit?
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Click "New Application" to submit a sanitation permit request. 
                Make sure to prepare required documents including business registration 
                and barangay clearance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
