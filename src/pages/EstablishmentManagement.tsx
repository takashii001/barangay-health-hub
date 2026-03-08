import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  Plus,
  Search,
  Eye,
  FileText,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { establishmentService } from '@/services/establishmentService';
import type { Establishment } from '@/types/database';

const MOCK_ESTABLISHMENTS: Establishment[] = [
  {
    id: '1',
    owner_id: '2',
    name: 'Santos Carinderia',
    type: 'Food Establishment',
    address: 'Zone 1, Brgy. Health',
    contact_number: '09171234567',
    status: 'active',
    created_at: '2025-01-15',
    updated_at: '2025-01-15',
  },
  {
    id: '2',
    owner_id: '2',
    name: 'Maria Beauty Salon',
    type: 'Personal Care',
    address: 'Zone 2, Brgy. Health',
    contact_number: '09181234567',
    status: 'pending',
    created_at: '2025-02-20',
    updated_at: '2025-02-20',
  },
  {
    id: '3',
    owner_id: '3',
    name: 'Dela Cruz Boarding House',
    type: 'Accommodation',
    address: 'Zone 3, Brgy. Health',
    contact_number: '09191234567',
    status: 'active',
    created_at: '2025-03-10',
    updated_at: '2025-03-10',
  },
];

export default function EstablishmentManagement() {
  const { user } = useAuth();
  const [establishments, setEstablishments] = useState<Establishment[]>(MOCK_ESTABLISHMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEstablishment, setNewEstablishment] = useState({
    name: '',
    type: 'Food Establishment',
    address: '',
    contact_number: '',
  });

  const isBusinessOwner = user?.role === 'business_owner';
  const filtered = establishments.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newEst: Establishment = {
      id: String(Date.now()),
      owner_id: user?.id || '',
      name: newEstablishment.name,
      type: newEstablishment.type,
      address: newEstablishment.address,
      contact_number: newEstablishment.contact_number,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEstablishments([newEst, ...establishments]);
    setIsAddDialogOpen(false);
    setNewEstablishment({ name: '', type: 'Food Establishment', address: '', contact_number: '' });
    toast({ title: 'Establishment Registered', description: `${newEst.name} has been registered.` });
  };

  const statusMap: Record<string, 'success' | 'warning' | 'pending' | 'danger'> = {
    active: 'success',
    pending: 'pending',
    inactive: 'danger',
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">
          {isBusinessOwner ? 'My Establishments' : 'Establishment Management'}
        </h1>
        <p className="page-description">
          {isBusinessOwner
            ? 'Register and manage your business establishments'
            : 'View and manage registered establishments'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Registered Establishments
            </CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search establishments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Register New Establishment</DialogTitle>
                    <DialogDescription>
                      Fill in the details to register a new business establishment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Business Name</Label>
                      <Input
                        value={newEstablishment.name}
                        onChange={(e) => setNewEstablishment({ ...newEstablishment, name: e.target.value })}
                        placeholder="Enter business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newEstablishment.type}
                        onChange={(e) => setNewEstablishment({ ...newEstablishment, type: e.target.value })}
                      >
                        <option>Food Establishment</option>
                        <option>Food Retail</option>
                        <option>Personal Care</option>
                        <option>Accommodation</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={newEstablishment.address}
                        onChange={(e) => setNewEstablishment({ ...newEstablishment, address: e.target.value })}
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Number</Label>
                      <Input
                        value={newEstablishment.contact_number}
                        onChange={(e) => setNewEstablishment({ ...newEstablishment, contact_number: e.target.value })}
                        placeholder="09XX-XXX-XXXX"
                      />
                    </div>
                    <Button onClick={handleAdd} className="w-full" disabled={!newEstablishment.name || !newEstablishment.address}>
                      Register Establishment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((est) => (
                  <TableRow key={est.id}>
                    <TableCell className="font-medium">{est.name}</TableCell>
                    <TableCell>{est.type}</TableCell>
                    <TableCell>{est.address}</TableCell>
                    <TableCell>{est.contact_number || '—'}</TableCell>
                    <TableCell>
                      <StatusBadge status={statusMap[est.status] || 'pending'} label={est.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No establishments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
