import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS, ROLE_COLORS, UserRole } from '@/types/auth';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Edit,
  KeyRound,
  UserCheck,
  UserX,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const USERS = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    role: 'resident' as UserRole,
    status: 'Active',
    lastLogin: '2025-12-03',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@barangay.gov.ph',
    role: 'bhw' as UserRole,
    status: 'Active',
    lastLogin: '2025-12-04',
  },
  {
    id: '3',
    name: 'Pedro Reyes',
    email: 'pedro.reyes@barangay.gov.ph',
    role: 'bsi' as UserRole,
    status: 'Active',
    lastLogin: '2025-12-04',
  },
  {
    id: '4',
    name: 'Ana Garcia',
    email: 'ana.garcia@barangay.gov.ph',
    role: 'clerk' as UserRole,
    status: 'Active',
    lastLogin: '2025-12-04',
  },
  {
    id: '5',
    name: 'Jose Rizal',
    email: 'jose.rizal@barangay.gov.ph',
    role: 'captain' as UserRole,
    status: 'Active',
    lastLogin: '2025-12-03',
  },
  {
    id: '6',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@email.com',
    role: 'resident' as UserRole,
    status: 'Inactive',
    lastLogin: '2025-10-15',
  },
];

export default function UserManagement() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Only sysadmin can access this page
  if (user?.role !== 'sysadmin') {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              Only System Administrators can access User Management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddUser = () => {
    toast({
      title: 'User Added',
      description: 'New user has been created successfully.',
    });
    setIsAddDialogOpen(false);
  };

  const filteredUsers = USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-description">
          Manage system users, roles, and access permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{USERS.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">
                  {USERS.filter((u) => u.status === 'Active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive Users</p>
                <p className="text-2xl font-bold">
                  {USERS.filter((u) => u.status === 'Inactive').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>System Users</CardTitle>
              <CardDescription>
                All registered users and their access levels
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account with assigned role.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Juan Dela Cruz" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="user@barangay.gov.ph" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="resident">Resident</SelectItem>
                          <SelectItem value="bhw">Barangay Health Worker</SelectItem>
                          <SelectItem value="bsi">Sanitary Inspector</SelectItem>
                          <SelectItem value="clerk">Barangay Clerk</SelectItem>
                          <SelectItem value="captain">Barangay Captain</SelectItem>
                          <SelectItem value="sysadmin">System Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Initial Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>Create User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="data-table-header">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <span className={cn('px-2 py-1 rounded text-xs font-medium', ROLE_COLORS[u.role])}>
                        {ROLE_LABELS[u.role]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={u.status === 'Active' ? 'success' : 'danger'}
                        label={u.status}
                      />
                    </TableCell>
                    <TableCell>{u.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Edit User">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Reset Password">
                          <KeyRound className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {u.status === 'Active' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
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
