import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { AnimatedChart } from '@/components/charts/AnimatedChart';
import { HealthIndexMeter } from '@/components/charts/HealthIndexMeter';
import { BarangayHealthMap } from '@/components/maps/BarangayHealthMap';
import { ReportGenerator } from '@/components/features/ReportGenerator';
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
  const [showMap, setShowMap] = useState(false);
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
      <div className="page-header">
        <h1 className="page-title">Health Surveillance System</h1>
        <p className="page-description">
          Real-time disease monitoring, trends, and outbreak management
          {user?.role === 'captain' && ' (View Only Mode)'}
        </p>
      </div>

      {/* Health Index Meter */}
      <div className="mb-6">
        <HealthIndexMeter />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outbreak Alerts */}
        <Card className="lg:col-span-2 animate-slide-in" style={{ animationDelay: '100ms' }}>
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

        {/* Quick Actions */}
        <Card className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Surveillance tools and reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog open={showMap} onOpenChange={setShowMap}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Map className="w-4 h-4" />
                  View Barangay Health Map
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Interactive Barangay Health Map</DialogTitle>
                </DialogHeader>
                <BarangayHealthMap />
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="w-full justify-start gap-2">
              <TrendingUp className="w-4 h-4" />
              View Trend Charts
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <MapPin className="w-4 h-4" />
              Disease Heatmap
            </Button>
            
            <Dialog open={showReportGenerator} onOpenChange={setShowReportGenerator}>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full justify-start gap-2 bg-primary">
                  <FileText className="w-4 h-4" />
                  Generate Monthly FHSIS Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Report Generator</DialogTitle>
                </DialogHeader>
                <ReportGenerator />
              </DialogContent>
            </Dialog>
            
            {user?.role !== 'captain' && (
              <Button variant="outline" className="w-full justify-start gap-2">
                <AlertTriangle className="w-4 h-4" />
                Create Alert
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Disease Trend Chart */}
        <Card className="lg:col-span-2 animate-slide-in" style={{ animationDelay: '300ms' }}>
          <AnimatedChart
            title="Disease Trend (Last 30 Days)"
            description="Weekly case counts by disease type"
            data={DISEASE_TREND_DATA}
            type="area"
            dataKeys={['Dengue', 'Respiratory', 'Diarrhea']}
            colors={['hsl(var(--destructive))', 'hsl(var(--primary))', 'hsl(var(--chart-3))']}
          />
        </Card>

        {/* Zone Distribution */}
        <Card className="animate-slide-in" style={{ animationDelay: '400ms' }}>
          <AnimatedChart
            title="Cases by Zone"
            description="Distribution across barangay zones"
            data={ZONE_DISTRIBUTION_DATA}
            type="bar"
            dataKeys={['cases']}
            colors={['hsl(var(--primary))']}
          />
        </Card>
      </div>
    </div>
  );
}
