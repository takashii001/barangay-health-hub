import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Building2, Plus, Search, Eye, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { establishmentService } from '@/services/establishmentService';
import type { Establishment } from '@/types/database';

export default function EstablishmentManagement() {
  const { user } = useAuth();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newEstablishment, setNewEstablishment] = useState({
    business_name: '',
    business_type: 'Food Establishment',
    address: '',
  });

  const isBusinessOwner = user?.role === 'business_owner';

  useEffect(() => {
    const load = async () => {
      try {
        const data = isBusinessOwner && user?.id
          ? await establishmentService.getByOwner(user.id)
          : await establishmentService.getAll();
        setEstablishments(data);
      } catch (err) {
        console.error('Failed to load establishments:', err);
        toast({ title: 'Error', description: 'Could not load establishments', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user?.id, isBusinessOwner]);

  const filtered = establishments.filter(e =>
    e.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.business_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    if (!user?.id) return;
    try {
      const created = await establishmentService.create({
        user_id: user.id,
        business_name: newEstablishment.business_name,
        business_type: newEstablishment.business_type,
        address: newEstablishment.address,
      });
      setEstablishments([created, ...establishments]);
      setIsAddDialogOpen(false);
      setNewEstablishment({ business_name: '', business_type: 'Food Establishment', address: '' });
      toast({ title: 'Establishment Registered', description: `${created.business_name} has been registered.` });
    } catch (err) {
      console.error('Failed to create establishment:', err);
      toast({ title: 'Error', description: 'Could not register establishment', variant: 'destructive' });
    }
  };

  const statusMap: Record<string, 'success' | 'warning' | 'pending' | 'danger'> = {
    approved: 'success',
    active: 'success',
    pending: 'pending',
    rejected: 'danger',
    inactive: 'danger',
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{isBusinessOwner ? 'My Establishments' : 'Establishment Management'}</h1>
        <p className="page-description">
          {isBusinessOwner ? 'Register and manage your business establishments' : 'View and manage registered establishments'}
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
                <Input placeholder="Search establishments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="w-4 h-4 mr-2" />Register</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Register New Establishment</DialogTitle>
                    <DialogDescription>Fill in the details to register a new business establishment.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Business Name</Label>
                      <Input value={newEstablishment.business_name} onChange={(e) => setNewEstablishment({ ...newEstablishment, business_name: e.target.value })} placeholder="Enter business name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newEstablishment.business_type} onChange={(e) => setNewEstablishment({ ...newEstablishment, business_type: e.target.value })}>
                        <option>Food Establishment</option>
                        <option>Food Retail</option>
                        <option>Personal Care</option>
                        <option>Accommodation</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input value={newEstablishment.address} onChange={(e) => setNewEstablishment({ ...newEstablishment, address: e.target.value })} placeholder="Enter address" />
                    </div>
                    <Button onClick={handleAdd} className="w-full" disabled={!newEstablishment.business_name || !newEstablishment.address}>
                      Register Establishment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Permit Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((est) => (
                    <TableRow key={est.establishment_id}>
                      <TableCell className="font-medium">{est.business_name}</TableCell>
                      <TableCell>{est.business_type}</TableCell>
                      <TableCell>{est.address}</TableCell>
                      <TableCell>
                        <StatusBadge status={statusMap[est.permit_status || ''] || 'pending'} label={est.permit_status || 'pending'} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon"><FileText className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No establishments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
