import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Heart,
  Building2,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Calendar,
  Syringe,
  User,
} from 'lucide-react';

const MY_HEALTH_RECORDS = [
  {
    id: 1,
    member: 'Juan Dela Cruz',
    relationship: 'Self',
    lastCheckup: '2025-12-01',
    condition: 'Healthy',
  },
  {
    id: 2,
    member: 'Maria Dela Cruz',
    relationship: 'Spouse',
    lastCheckup: '2025-11-15',
    condition: 'Healthy',
  },
  {
    id: 3,
    member: 'Pedro Dela Cruz',
    relationship: 'Son',
    lastCheckup: '2025-11-20',
    condition: 'Requires Follow-up',
  },
];

const MY_PERMITS = [
  {
    id: 'SP-2025-001',
    business: 'Dela Cruz Sari-Sari Store',
    type: 'Sanitation Permit',
    status: 'Approved',
    expiry: '2026-01-15',
  },
  {
    id: 'SP-2025-002',
    business: 'Dela Cruz Carinderia',
    type: 'Sanitation Permit',
    status: 'Pending',
    expiry: '-',
  },
];

const MY_COMPLAINTS = [
  {
    id: 'WC-2025-012',
    type: 'Wastewater',
    description: 'Clogged drainage in front of house',
    dateSubmitted: '2025-11-28',
    status: 'In Progress',
  },
];

const VACCINATIONS = [
  {
    id: 1,
    member: 'Pedro Dela Cruz',
    vaccine: 'Measles',
    date: '2025-10-15',
    status: 'Completed',
  },
  {
    id: 2,
    member: 'Pedro Dela Cruz',
    vaccine: 'Polio',
    date: '2025-09-20',
    status: 'Completed',
  },
];

export default function ResidentPortal() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name}</h1>
        <p className="page-description">
          View your family's health records, permits, and service requests
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Family Members</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Permits</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Complaints</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Syringe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vaccinations</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Health Records */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Family Health Records
                </CardTitle>
                <CardDescription>View your family's health information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MY_HEALTH_RECORDS.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{record.member}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.relationship} • Last: {record.lastCheckup}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={record.condition === 'Healthy' ? 'success' : 'warning'}
                      label={record.condition}
                    />
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vaccination Records */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-primary" />
                  Vaccination Records
                </CardTitle>
                <CardDescription>Immunization history</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {VACCINATIONS.map((vax) => (
                <div
                  key={vax.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                >
                  <div>
                    <p className="font-medium text-sm">{vax.vaccine}</p>
                    <p className="text-xs text-muted-foreground">
                      {vax.member} • {vax.date}
                    </p>
                  </div>
                  <StatusBadge status="success" label={vax.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Permits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              My Business Permits
            </CardTitle>
            <CardDescription>Sanitation permits and applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MY_PERMITS.map((permit) => (
                <div
                  key={permit.id}
                  className="p-4 rounded-lg bg-muted/50 border"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{permit.business}</p>
                      <p className="text-sm text-muted-foreground">{permit.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {permit.id}
                        {permit.expiry !== '-' && ` • Expires: ${permit.expiry}`}
                      </p>
                    </div>
                    <StatusBadge
                      status={permit.status === 'Approved' ? 'success' : 'pending'}
                      label={permit.status}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Complaints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              My Complaints
            </CardTitle>
            <CardDescription>Filed complaints and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MY_COMPLAINTS.length > 0 ? (
                MY_COMPLAINTS.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="p-4 rounded-lg bg-muted/50 border"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{complaint.type} Complaint</p>
                        <p className="text-sm text-muted-foreground">
                          {complaint.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {complaint.id} • Submitted: {complaint.dateSubmitted}
                        </p>
                      </div>
                      <StatusBadge status="warning" label={complaint.status} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No complaints filed
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notice */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Upcoming Vaccination Schedule
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Mass vaccination drive on December 5, 2025 at the Barangay Health Center.
                Children ages 6-59 months are eligible for measles vaccination.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
