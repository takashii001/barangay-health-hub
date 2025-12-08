import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { AnimatedChart } from '@/components/charts/AnimatedChart';
import { HealthIndexMeter } from '@/components/charts/HealthIndexMeter';
import { BarangayHealthMap } from '@/components/maps/BarangayHealthMap';
import { ReportGenerator } from '@/components/features/ReportGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  TrendingUp,
  MapPin,
  FileText,
  AlertTriangle,
  ThermometerSun,
  Droplets,
  Bug,
  Map,
  BarChart3,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const OUTBREAK_ALERTS = [
  {
    id: 1,
    disease: 'Dengue',
    zone: 'Zone 2',
    cases: 5,
    trend: 'Rising',
    severity: 'Moderate',
    lastUpdate: '2025-12-03',
  },
  {
    id: 2,
    disease: 'Flu',
    zone: 'Zone 1, 3',
    cases: 12,
    trend: 'Stable',
    severity: 'Low',
    lastUpdate: '2025-12-02',
  },
];

const WEEKLY_STATS = [
  { label: 'Total Cases', value: 48, change: '+8%', icon: Activity },
  { label: 'Dengue Cases', value: 5, change: '+25%', icon: Bug },
  { label: 'Respiratory', value: 23, change: '-5%', icon: ThermometerSun },
  { label: 'Diarrhea Cases', value: 8, change: '+12%', icon: Droplets },
];

const DISEASE_TREND_DATA = [
  { name: 'Week 1', Dengue: 2, Respiratory: 18, Diarrhea: 5 },
  { name: 'Week 2', Dengue: 3, Respiratory: 22, Diarrhea: 6 },
  { name: 'Week 3', Dengue: 4, Respiratory: 20, Diarrhea: 8 },
  { name: 'Week 4', Dengue: 5, Respiratory: 23, Diarrhea: 8 },
];

const ZONE_DISTRIBUTION_DATA = [
  { name: 'Zone 1', cases: 15 },
  { name: 'Zone 2', cases: 22 },
  { name: 'Zone 3', cases: 8 },
  { name: 'Zone 4', cases: 3 },
];

export default function Surveillance() {
  const { user } = useAuth();
  const [showReportGenerator, setShowReportGenerator] = useState(false);

  // Only certain roles can access surveillance
  const hasAccess = ['clerk', 'captain', 'sysadmin'].includes(user?.role || '');

  if (!hasAccess) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              You do not have permission to access the Health Surveillance System.
              This module is only available to Clerks, Captains, and System Administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Health Surveillance System</h1>
          <p className="page-description">
            Real-time disease monitoring, trends, and outbreak management
            {user?.role === 'captain' && ' (View Only Mode)'}
          </p>
        </div>
        <Dialog open={showReportGenerator} onOpenChange={setShowReportGenerator}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary">
              <FileText className="w-4 h-4" />
              Generate FHSIS Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Generator</DialogTitle>
            </DialogHeader>
            <ReportGenerator />
          </DialogContent>
        </Dialog>
      </div>

      {/* Interactive Barangay Health Map - Full Width */}
      <Card className="mb-6 animate-slide-in">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            Interactive Barangay Health Map
          </CardTitle>
          <CardDescription>Click on pins to view detailed health data for each zone</CardDescription>
        </CardHeader>
        <CardContent>
          <BarangayHealthMap className="min-h-[400px]" />
        </CardContent>
      </Card>

      {/* Health Index Meter */}
      <div className="mb-6">
        <HealthIndexMeter />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in">
            {WEEKLY_STATS.map((stat, index) => (
              <Card 
                key={stat.label} 
                className="card-hover animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      <p
                        className={`text-xs mt-1 ${
                          stat.change.startsWith('+') ? 'text-destructive' : 'text-status-success'
                        }`}
                      >
                        {stat.change} from last week
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card className="animate-slide-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-status-warning" />
                Active Outbreak Alerts
              </CardTitle>
              <CardDescription>Current disease outbreaks requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {OUTBREAK_ALERTS.map((alert, index) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border animate-fade-in ${
                      alert.severity === 'Moderate'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    }`}
                    style={{ animationDelay: `${(index + 1) * 150}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{alert.disease} Outbreak</h3>
                          <StatusBadge
                            status={alert.severity === 'Moderate' ? 'warning' : 'info'}
                            label={alert.severity}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {alert.zone} • {alert.cases} cases • Trend: {alert.trend}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Last updated: {alert.lastUpdate}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
            <AnimatedChart
              title="Disease Trend (Last 30 Days)"
              description="Weekly case counts by disease type"
              data={DISEASE_TREND_DATA}
              type="area"
              dataKeys={['Dengue', 'Respiratory', 'Diarrhea']}
              colors={['hsl(var(--destructive))', 'hsl(var(--primary))', 'hsl(var(--chart-3))']}
            />
            <AnimatedChart
              title="Cases by Zone"
              description="Distribution across barangay zones"
              data={ZONE_DISTRIBUTION_DATA}
              type="bar"
              dataKeys={['cases']}
              colors={['hsl(var(--primary))']}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}