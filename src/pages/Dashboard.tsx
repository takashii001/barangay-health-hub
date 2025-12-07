import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedChart } from '@/components/charts/AnimatedChart';
import { HealthIndexMeter } from '@/components/charts/HealthIndexMeter';
import {
  Users,
  Stethoscope,
  ClipboardCheck,
  Syringe,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity,
} from 'lucide-react';

const RECENT_ACTIVITIES = [
  { id: 1, action: 'New patient consultation', user: 'Maria Santos', time: '5 min ago', type: 'health' },
  { id: 2, action: 'Sanitation permit approved', user: 'Ana Garcia', time: '15 min ago', type: 'permit' },
  { id: 3, action: 'Immunization record added', user: 'Maria Santos', time: '1 hour ago', type: 'vaccine' },
  { id: 4, action: 'Outbreak alert created', user: 'System', time: '2 hours ago', type: 'alert' },
  { id: 5, action: 'Wastewater complaint filed', user: 'Juan Dela Cruz', time: '3 hours ago', type: 'complaint' },
];

const UPCOMING_SCHEDULES = [
  { id: 1, title: 'Vaccination Drive', date: 'Dec 5, 2025', location: 'Health Center' },
  { id: 2, title: 'Sanitation Inspection', date: 'Dec 6, 2025', location: 'Zone 1-3' },
  { id: 3, title: 'Nutrition Monitoring', date: 'Dec 7, 2025', location: 'Day Care Center' },
];

const MONTHLY_CONSULTATIONS_DATA = [
  { name: 'Week 1', consultations: 85, vaccinations: 42 },
  { name: 'Week 2', consultations: 92, vaccinations: 38 },
  { name: 'Week 3', consultations: 78, vaccinations: 55 },
  { name: 'Week 4', consultations: 87, vaccinations: 21 },
];

const DISEASE_DISTRIBUTION_DATA = [
  { name: 'Respiratory', value: 30 },
  { name: 'Hypertension', value: 20 },
  { name: 'Dengue', value: 18 },
  { name: 'Influenza', value: 17 },
  { name: 'Leptospirosis', value: 15 },
];

export default function Dashboard() {
  const { user } = useAuth();

  const isReadOnly = user?.role === 'captain';
  const showHealthIndex = ['captain', 'clerk', 'sysadmin'].includes(user?.role || '');

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Welcome back, {user?.name}! 
          {isReadOnly && ' (View Only Mode)'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Patients"
          value="1,284"
          change="+12% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Consultations Today"
          value="48"
          change="+5 from yesterday"
          changeType="positive"
          icon={Stethoscope}
        />
        <StatCard
          title="Pending Permits"
          value="23"
          change="8 require inspection"
          changeType="neutral"
          icon={ClipboardCheck}
        />
        <StatCard
          title="Vaccinations (Dec)"
          value="156"
          change="Target: 200"
          changeType="neutral"
          icon={Syringe}
        />
      </div>

      {/* Health Index for Officials */}
      {showHealthIndex && (
        <div className="mb-6">
          <HealthIndexMeter />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AnimatedChart
          title="Weekly Consultations & Vaccinations"
          description="Health center activity trends"
          data={MONTHLY_CONSULTATIONS_DATA}
          type="bar"
          dataKeys={['consultations', 'vaccinations']}
          colors={['hsl(var(--primary))', 'hsl(var(--chart-2))']}
        />
        <AnimatedChart
          title="Disease Distribution"
          description="Current month breakdown"
          data={DISEASE_DISTRIBUTION_DATA}
          type="pie"
          dataKeys={['value']}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 animate-slide-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest system activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0 animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        by {activity.user}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedules */}
        <Card className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Schedules
            </CardTitle>
            <CardDescription>Events and activities this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {UPCOMING_SCHEDULES.map((schedule, index) => (
                <div
                  key={schedule.id}
                  className="p-3 rounded-lg bg-muted/50 border border-border animate-scale-in"
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <p className="font-medium text-sm">{schedule.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{schedule.date}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{schedule.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Alerts */}
        <Card className="lg:col-span-2 animate-slide-in" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-status-warning" />
              Health Alerts
            </CardTitle>
            <CardDescription>Active health advisories and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-amber-800 dark:text-amber-200">
                        Dengue Case Increase
                      </p>
                      <StatusBadge status="warning" label="Active" />
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      5 new dengue cases reported in Zone 2. Enhanced surveillance recommended.
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      Reported: Dec 3, 2025
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 animate-fade-in" style={{ animationDelay: '500ms' }}>
                <div className="flex items-start gap-3">
                  <Syringe className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        Measles Vaccination Drive
                      </p>
                      <StatusBadge status="info" label="Upcoming" />
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Mass vaccination scheduled for children ages 6-59 months.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      Date: Dec 5, 2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="animate-slide-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Monthly Summary
            </CardTitle>
            <CardDescription>December 2025 statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Total Consultations', value: '342', trend: '+8%' },
                { label: 'Permits Issued', value: '28', trend: '+15%' },
                { label: 'Vaccinations', value: '156', trend: '-5%' },
                { label: 'Complaints Resolved', value: '12', trend: '+20%' },
              ].map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="flex items-center justify-between animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 100 + 400}ms` }}
                >
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{stat.value}</span>
                    <span
                      className={`text-xs ${
                        stat.trend.startsWith('+')
                          ? 'text-status-success'
                          : 'text-destructive'
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
