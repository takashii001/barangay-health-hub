import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Upload, Send, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ResidentRequest() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Request Submitted',
      description: 'Your service request has been filed successfully.',
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">File a Request</h1>
          <p className="page-description">
            Submit service requests and complaints
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Request Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your request has been received and will be processed by our staff.
              You can track the status in "My Complaints" section.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">File a Request</h1>
        <p className="page-description">
          Submit service requests, complaints, or permit applications
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Service Request Form
          </CardTitle>
          <CardDescription>
            Fill out the form below to submit your request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="request-type">Request Type *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type of request" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wastewater">Wastewater/Drainage Issue</SelectItem>
                  <SelectItem value="septic">Septic Tank Service</SelectItem>
                  <SelectItem value="sanitation">Sanitation Complaint</SelectItem>
                  <SelectItem value="permit">Business Permit Application</SelectItem>
                  <SelectItem value="health">Health Service Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location / Address *</Label>
              <Input
                id="location"
                placeholder="e.g., Zone 1, Purok 3, near the basketball court"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Please provide details about your request or complaint..."
                rows={4}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                type="tel"
                placeholder="09XX XXX XXXX"
              />
            </div>

            <div className="grid gap-2">
              <Label>Attachment (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG or PDF (max. 5MB)
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
