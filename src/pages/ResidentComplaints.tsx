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
import { Eye, AlertTriangle, Plus, MessageSquare } from 'lucide-react';

const MY_COMPLAINTS = [
  {
    id: 'WC-2025-012',
    type: 'Wastewater',
    description: 'Clogged drainage in front of house causing flooding',
    location: 'Zone 1, Purok 3',
    dateSubmitted: '2025-11-28',
    lastUpdate: '2025-12-02',
    status: 'In Progress',
    remarks: 'Scheduled for clearing on Dec 6',
  },
  {
    id: 'WC-2025-008',
    type: 'Sanitation',
    description: 'Uncollected garbage in the corner lot',
    location: 'Zone 1, Purok 3',
    dateSubmitted: '2025-11-15',
    lastUpdate: '2025-11-18',
    status: 'Resolved',
    remarks: 'Garbage collected. Area cleared.',
  },
];

export default function ResidentComplaints() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Complaints</h1>
        <p className="page-description">
          Track your filed complaints and their resolution status
        </p>
      </div>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Filed Complaints
              </CardTitle>
              <CardDescription>Your submitted complaints and status updates</CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              File New Complaint
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MY_COMPLAINTS.map((complaint) => (
              <Card key={complaint.id} className="border">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm font-medium">{complaint.id}</span>
                        <StatusBadge
                          status={
                            complaint.status === 'Resolved'
                              ? 'success'
                              : complaint.status === 'In Progress'
                              ? 'warning'
                              : 'info'
                          }
                          label={complaint.status}
                        />
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {complaint.type}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{complaint.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <p>📍 {complaint.location}</p>
                        <p>📅 Submitted: {complaint.dateSubmitted}</p>
                        <p>🔄 Last Update: {complaint.lastUpdate}</p>
                      </div>
                      {complaint.remarks && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            <MessageSquare className="w-3 h-3 inline mr-1" />
                            <strong>Remarks:</strong> {complaint.remarks}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
