import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Camera, CheckCircle, XCircle, Upload, Image, ClipboardCheck, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  compliant: boolean | null;
  photo: string | null;
  notes: string;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '1', label: 'Waste Segregation (Biodegradable/Non-biodegradable)', category: 'Waste Management', compliant: null, photo: null, notes: '' },
  { id: '2', label: 'Proper Waste Storage Containers', category: 'Waste Management', compliant: null, photo: null, notes: '' },
  { id: '3', label: 'Regular Waste Collection Schedule', category: 'Waste Management', compliant: null, photo: null, notes: '' },
  { id: '4', label: 'Pest Control Measures in Place', category: 'Pest Control', compliant: null, photo: null, notes: '' },
  { id: '5', label: 'No Visible Pest Infestation', category: 'Pest Control', compliant: null, photo: null, notes: '' },
  { id: '6', label: 'Clean Food Preparation Areas', category: 'Food Safety', compliant: null, photo: null, notes: '' },
  { id: '7', label: 'Proper Food Storage Temperature', category: 'Food Safety', compliant: null, photo: null, notes: '' },
  { id: '8', label: 'Staff Health Certificates Valid', category: 'Personnel', compliant: null, photo: null, notes: '' },
  { id: '9', label: 'Adequate Ventilation', category: 'Facility', compliant: null, photo: null, notes: '' },
  { id: '10', label: 'Functional Handwashing Facilities', category: 'Sanitation', compliant: null, photo: null, notes: '' },
];

interface InspectionChecklistProps {
  businessName: string;
  businessId?: string;
  onSubmit?: (checklist: ChecklistItem[]) => void;
  onComplete?: () => void;
  className?: string;
}

export function InspectionChecklist({ businessName, businessId = 'NEW', onSubmit, onComplete, className }: InspectionChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [notes, setNotes] = useState('');

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const simulatePhotoCapture = (id: string) => {
    toast({
      title: 'Photo Captured',
      description: 'Evidence photo has been attached to this item',
    });
    updateItem(id, { photo: `photo-${id}-${Date.now()}.jpg` });
  };

  const handleSubmit = () => {
    const incomplete = checklist.filter(item => item.compliant === null);
    if (incomplete.length > 0) {
      toast({
        title: 'Incomplete Checklist',
        description: `Please complete all ${incomplete.length} remaining items`,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Inspection Submitted',
      description: 'The inspection report has been saved successfully',
    });
    onSubmit?.(checklist);
    onComplete?.();
  };

  const compliantCount = checklist.filter(item => item.compliant === true).length;
  const nonCompliantCount = checklist.filter(item => item.compliant === false).length;
  const pendingCount = checklist.filter(item => item.compliant === null).length;

  const groupedChecklist = checklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            Digital Inspection Checklist
          </CardTitle>
          <CardDescription>
            Inspecting: <span className="font-semibold text-foreground">{businessName}</span> ({businessId})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-success" />
              <span>Compliant: {compliantCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span>Non-Compliant: {nonCompliantCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span>Pending: {pendingCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items by Category */}
      {Object.entries(groupedChecklist).map(([category, items]) => (
        <Card key={category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <Label className="text-sm font-medium leading-relaxed">
                    {item.label}
                  </Label>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => updateItem(item.id, { compliant: false })}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        item.compliant === false ? 'bg-destructive text-destructive-foreground' : 'bg-muted hover:bg-destructive/20'
                      )}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateItem(item.id, { compliant: true })}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        item.compliant === true ? 'bg-status-success text-white' : 'bg-muted hover:bg-green-500/20'
                      )}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Photo Evidence */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => simulatePhotoCapture(item.id)}
                  >
                    <Camera className="w-4 h-4" />
                    Add Photo
                  </Button>
                  {item.photo && (
                    <span className="text-xs text-status-success flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      Photo attached
                    </span>
                  )}
                </div>

                {/* Notes for non-compliant items */}
                {item.compliant === false && (
                  <Textarea
                    placeholder="Describe the violation..."
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, { notes: e.target.value })}
                    className="text-sm"
                    rows={2}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* General Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any additional observations or notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button className="w-full gap-2" size="lg" onClick={handleSubmit}>
        <Send className="w-4 h-4" />
        Submit Inspection Report
      </Button>
    </div>
  );
}