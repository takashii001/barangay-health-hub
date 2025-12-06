import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Stethoscope,
  ClipboardCheck,
  Syringe,
  Droplets,
  Activity,
  Settings,
  LogOut,
  Users,
  Home,
  FileText,
  AlertTriangle,
  Heart,
  Building2,
  X,
  QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: UserRole[];
}

const STAFF_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    roles: ['bhw', 'bsi', 'clerk', 'captain', 'sysadmin'],
  },
  {
    label: 'Health Center Services',
    icon: Stethoscope,
    path: '/health-center',
    roles: ['bhw', 'clerk', 'captain', 'sysadmin'],
  },
  {
    label: 'Sanitation & Permits',
    icon: ClipboardCheck,
    path: '/sanitation',
    roles: ['bsi', 'clerk', 'captain', 'sysadmin'],
  },
  {
    label: 'Immunization & Nutrition',
    icon: Syringe,
    path: '/immunization',
    roles: ['bhw', 'clerk', 'captain', 'sysadmin'],
  },
  {
    label: 'Wastewater & Septic',
    icon: Droplets,
    path: '/wastewater',
    roles: ['bsi', 'clerk', 'captain', 'sysadmin'],
  },
  {
    label: 'Health Surveillance',
    icon: Activity,
    path: '/surveillance',
    roles: ['clerk', 'captain', 'sysadmin'],
  },
  {
    label: 'User Management',
    icon: Users,
    path: '/users',
    roles: ['sysadmin'],
  },
];

const RESIDENT_NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    icon: Home,
    path: '/resident',
    roles: ['resident'],
  },
  {
    label: "My Family's Health",
    icon: Heart,
    path: '/resident/health',
    roles: ['resident'],
  },
  {
    label: 'My QR Code',
    icon: QrCode,
    path: '/resident/qrcode',
    roles: ['resident'],
  },
  {
    label: 'My Business Permits',
    icon: Building2,
    path: '/resident/permits',
    roles: ['resident'],
  },
  {
    label: 'My Complaints',
    icon: AlertTriangle,
    path: '/resident/complaints',
    roles: ['resident'],
  },
  {
    label: 'File a Request',
    icon: FileText,
    path: '/resident/request',
    roles: ['resident'],
  },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  {
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    roles: ['bhw', 'bsi', 'clerk', 'captain', 'sysadmin'],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isResident = user.role === 'resident';
  const navItems = isResident ? RESIDENT_NAV_ITEMS : STAFF_NAV_ITEMS;
  const filteredItems = navItems.filter(item => item.roles.includes(user.role));
  const bottomItems = isResident ? [] : BOTTOM_NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Fixed position, full height */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-sidebar flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sidebar-foreground text-sm">
              HSM System
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {filteredItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'nav-item',
                      isActive ? 'nav-item-active' : 'nav-item-inactive'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section - Fixed at bottom */}
        <div className="shrink-0 border-t border-sidebar-border p-3 space-y-1">
          {/* Settings (for staff) */}
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'nav-item',
                  isActive ? 'nav-item-active' : 'nav-item-inactive'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="nav-item nav-item-inactive w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}