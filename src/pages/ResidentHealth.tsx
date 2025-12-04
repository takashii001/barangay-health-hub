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
import { Eye, Download, Heart, User, Calendar } from 'lucide-react';

const FAMILY_HEALTH = [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    relationship: 'Self',
    age: 45,
    bloodType: 'O+',
    conditions: 'None',
    lastCheckup: '2025-12-01',
    status: 'Healthy',
  },
  {
    id: 2,
    name: 'Maria Dela Cruz',
    relationship: 'Spouse',
    age: 42,
    bloodType: 'A+',
    conditions: 'Mild Hypertension',
    lastCheckup: '2025-11-15',
    status: 'Under Monitoring',
  },
  {
    id: 3,
    name: 'Pedro Dela Cruz Jr.',
    relationship: 'Son',
    age: 2,
    bloodType: 'O+',
    conditions: 'None',
    lastCheckup: '2025-11-20',
    status: 'Healthy',
  },
];

const CONSULTATION_HISTORY = [
  {
    id: 'C001',
    patient: 'Juan Dela Cruz',
    date: '2025-12-01',
    complaint: 'Headache, Fever',
    diagnosis: 'Flu',
    medicine: 'Paracetamol 500mg',
  },
  {
    id: 'C002',
    patient: 'Maria Dela Cruz',
    date: '2025-11-15',
    complaint: 'Dizziness',
    diagnosis: 'High Blood Pressure',
    medicine: 'Amlodipine 5mg',
  },
];

export default function ResidentHealth() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Family's Health</h1>
        <p className="page-description">
          View health records and consultation history for your family
        </p>
      </div>

      {/* Family Members */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Family Members
          </CardTitle>
          <CardDescription>Health profiles of registered family members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {FAMILY_HEALTH.map((member) => (
              <Card key={member.id} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {member.relationship} • {member.age} yrs
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs">
                          <span className="text-muted-foreground">Blood Type:</span> {member.bloodType}
                        </p>
                        <p className="text-xs">
                          <span className="text-muted-foreground">Conditions:</span> {member.conditions}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <StatusBadge
                          status={member.status === 'Healthy' ? 'success' : 'warning'}
                          label={member.status}
                        />
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consultation History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Consultation History
              </CardTitle>
              <CardDescription>Past medical consultations and treatments</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Records
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="data-table-header">
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Medicine Prescribed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CONSULTATION_HISTORY.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell className="font-medium">{record.patient}</TableCell>
                    <TableCell>{record.complaint}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>{record.medicine}</TableCell>
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
    </div>
  );
}
