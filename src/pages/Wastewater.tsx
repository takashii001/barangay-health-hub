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
  Search,
  Plus,
  Eye,
  Edit,
  Droplets,
  AlertTriangle,
  Calendar,
  CheckCircle,
} from 'lucide-react';

const COMPLAINTS = [
  {
    id: 'WC-2025-001',
    complainant: 'Juan Dela Cruz',
    type: 'Clogged Drainage',
    location: 'Zone 1, Purok 3',
    dateSubmitted: '2025-11-28',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Pedro Reyes (BSI)',
  },
  {
    id: 'WC-2025-002',
    complainant: 'Maria Santos',
    type: 'Septic Tank Overflow',
    location: 'Zone 2, Purok 1',
    dateSubmitted: '2025-11-25',
    priority: 'Critical',
    status: 'Scheduled',
    assignedTo: 'Pedro Reyes (BSI)',
  },
  {
    id: 'WC-2025-003',
    complainant: 'Ana Garcia',
    type: 'Foul Odor',
    location: 'Zone 3, Purok 2',
    dateSubmitted: '2025-11-20',
    priority: 'Medium',
    status: 'Resolved',
    assignedTo: 'Pedro Reyes (BSI)',
  },
];

const SCHEDULES = [
  {
    id: 'SCH-2025-001',
    complaintId: 'WC-2025-002',
    type: 'Septic Tank Pump-out',
    location: 'Zone 2, Purok 1',
    scheduledDate: '2025-12-05',
    timeSlot: '9:00 AM - 11:00 AM',
    assignedTeam: 'Sanitation Team A',
    status: 'Confirmed',
  },
  {
    id: 'SCH-2025-002',
    complaintId: 'WC-2025-001',
    type: 'Drainage Clearing',
    location: 'Zone 1, Purok 3',
    scheduledDate: '2025-12-06',
    timeSlot: '1:00 PM - 3:00 PM',
    assignedTeam: 'Sanitation Team B',
    status: 'Pending',
  },
];

const SERVICE_TRACKING = [
  {
    id: 'SRV-2025-001',
    complaintId: 'WC-2025-003',
    serviceType: 'Odor Treatment',
    startDate: '2025-11-22',
    completionDate: '2025-11-22',
    status: 'Completed',
    notes: 'Applied disinfectant and cleared minor blockage',
  },
];

export default function Wastewater() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const isReadOnly = user?.role === 'captain';
  const canEdit = user?.role === 'bsi' || user?.role === 'clerk' || user?.role === 'sysadmin';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Wastewater & Septic Services</h1>
        <p className="page-description">
          Manage complaints, scheduling, and service tracking
          {isReadOnly && ' (View Only Mode)'}
        </p>
      </div>

      <Tabs defaultValue="complaints" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="complaints" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Complaints
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="gap-2">
            <Calendar className="w-4 h-4" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-2">
            <Droplets className="w-4 h-4" />
            Tracking
          </TabsTrigger>
        </TabsList>

        {/* Complaints Tab */}
        <TabsContent value="complaints">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Complaint List</CardTitle>
                  <CardDescription>
                    Wastewater and septic-related complaints
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="data-table-header">
                      <TableHead>ID</TableHead>
                      <TableHead>Complainant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {COMPLAINTS.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium">{complaint.id}</TableCell>
                        <TableCell>{complaint.complainant}</TableCell>
                        <TableCell>{complaint.type}</TableCell>
                        <TableCell>{complaint.location}</TableCell>
                        <TableCell>{complaint.dateSubmitted}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              complaint.priority === 'Critical'
                                ? 'danger'
                                : complaint.priority === 'High'
                                ? 'warning'
                                : 'info'
                            }
                            label={complaint.priority}
                          />
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>{complaint.assignedTo}</TableCell>
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

        {/* Scheduling Tab */}
        <TabsContent value="scheduling">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Service Scheduling</CardTitle>
                  <CardDescription>
                    Scheduled wastewater services and maintenance
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Schedule
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="data-table-header">
                      <TableHead>Schedule ID</TableHead>
                      <TableHead>Complaint ID</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SCHEDULES.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">{schedule.id}</TableCell>
                        <TableCell>{schedule.complaintId}</TableCell>
                        <TableCell>{schedule.type}</TableCell>
                        <TableCell>{schedule.location}</TableCell>
                        <TableCell>{schedule.scheduledDate}</TableCell>
                        <TableCell>{schedule.timeSlot}</TableCell>
                        <TableCell>{schedule.assignedTeam}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={schedule.status === 'Confirmed' ? 'success' : 'pending'}
                            label={schedule.status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Service Tracking</CardTitle>
              <CardDescription>
                Track completed and ongoing services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="data-table-header">
                      <TableHead>Service ID</TableHead>
                      <TableHead>Complaint ID</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SERVICE_TRACKING.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.id}</TableCell>
                        <TableCell>{service.complaintId}</TableCell>
                        <TableCell>{service.serviceType}</TableCell>
                        <TableCell>{service.startDate}</TableCell>
                        <TableCell>{service.completionDate}</TableCell>
                        <TableCell>
                          <StatusBadge status="success" label={service.status} />
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{service.notes}</TableCell>
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
