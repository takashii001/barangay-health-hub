import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Calendar, FileText, Heart, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    contact_no: '',
    address: '',
  });

  // Fetch user profile from database
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: 'Error',
            description: 'Could not load profile data',
            variant: 'destructive',
          });
          return;
        }

        setUserProfile(data);
        setFormData({
          full_name: data?.full_name || '',
          email: data?.email || '',
          contact_no: data?.contact_no || '',
          address: data?.address || '',
        });
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Could not load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          contact_no: formData.contact_no,
          address: formData.address,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: 'Error',
          description: 'Could not update profile',
          variant: 'destructive',
        });
        return;
      }

      // Update local state
      setUserProfile({
        ...userProfile,
        ...formData,
      });

      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved.',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Could not update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: userProfile?.full_name || '',
      email: userProfile?.email || '',
      contact_no: userProfile?.contact_no || '',
      address: userProfile?.address || '',
    });
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Requests', value: '12', icon: FileText, color: 'text-blue-600' },
    { label: 'Health Records', value: '8', icon: Heart, color: 'text-green-600' },
    { label: 'Active Issues', value: '2', icon: AlertTriangle, color: 'text-amber-600' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Profile</h1>
            <p className="page-description">Manage your personal information and account settings</p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {ROLE_LABELS[userProfile?.user_type || user.role]}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your account details and contact information</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="sm" disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                ) : (
                  <div className="text-sm font-medium py-2">{userProfile?.full_name || 'Not provided'}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <div className="text-sm font-medium py-2">{userProfile?.email || 'Not provided'}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={formData.contact_no}
                    onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="text-sm font-medium py-2">{userProfile?.contact_no || 'Not provided'}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address"
                  />
                ) : (
                  <div className="text-sm font-medium py-2">{userProfile?.address || 'Not provided'}</div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Account Role</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{ROLE_LABELS[userProfile?.user_type || user.role]}</Badge>
                <span className="text-xs text-muted-foreground">Role cannot be changed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Account Statistics
            </CardTitle>
            <CardDescription>Overview of your activity and records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}