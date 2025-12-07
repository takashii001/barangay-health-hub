import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_LABELS, ROLE_COLORS } from '@/types/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Eye, EyeOff, ArrowRight, Moon, Sun } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DEMO_ROLES: { role: UserRole; description: string }[] = [
  { role: 'resident', description: 'Limited view-only access' },
  { role: 'bhw', description: 'Health services & immunization' },
  { role: 'bsi', description: 'Sanitation & inspections' },
  { role: 'clerk', description: 'Full administrative access' },
  { role: 'captain', description: 'Supervisory read-only' },
  { role: 'sysadmin', description: 'Full system access' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('clerk');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, selectedRole);
      toast({
        title: 'Login successful',
        description: `Welcome! You are logged in as ${ROLE_LABELS[selectedRole]}.`,
      });
      
      if (selectedRole === 'resident') {
        navigate('/resident');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      await login('demo@barangay.gov.ph', 'demo123', role);
      toast({
        title: 'Demo Login Successful',
        description: `Logged in as ${ROLE_LABELS[role]}`,
        className: 'bg-green-600 text-white border-green-700',
      });
      
      if (role === 'resident') {
        navigate('/resident');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-secondary-foreground">
                HSM System
              </h1>
              <p className="text-sm text-secondary-foreground/70">
                Barangay Management
              </p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-display font-bold text-secondary-foreground leading-tight mb-6">
            Health & Sanitation
            <br />
            <span className="text-primary">Management System</span>
          </h2>

          <p className="text-secondary-foreground/80 text-lg max-w-md">
            A comprehensive system for managing barangay health services, 
            sanitation permits, immunization records, and community health surveillance.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
            {[
              { label: 'Health Center', value: '5 Modules' },
              { label: 'Active Users', value: '150+' },
              { label: 'Records', value: '10,000+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-secondary-foreground/5 rounded-xl p-4">
                <p className="text-2xl font-bold text-secondary-foreground">{stat.value}</p>
                <p className="text-sm text-secondary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-20 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background relative">
        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="absolute top-4 right-4"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">HSM System</h1>
              <p className="text-xs text-muted-foreground">Barangay Management</p>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-display">Welcome back</CardTitle>
              <CardDescription>
                Sign in to access the Health & Sanitation Management System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@barangay.gov.ph"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Quick Demo Login
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DEMO_ROLES.map(({ role, description }) => (
                  <Button
                    key={role}
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-3 flex-col items-start text-left"
                    onClick={() => handleQuickLogin(role)}
                    disabled={isLoading}
                  >
                    <span className={cn('text-xs px-1.5 py-0.5 rounded', ROLE_COLORS[role])}>
                      {ROLE_LABELS[role]}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {description}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            This is a prototype system for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
