import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, Loader2, CheckCircle, FileSpreadsheet, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReportGeneratorProps {
  className?: string;
}

export function ReportGenerator({ className }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportReady, setReportReady] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    setProgress(0);
    setReportReady(false);

    const steps = [
      { progress: 20, message: 'Fetching consultation records...' },
      { progress: 40, message: 'Compiling vaccination data...' },
      { progress: 60, message: 'Aggregating nutrition records...' },
      { progress: 80, message: 'Calculating statistics...' },
      { progress: 100, message: 'Generating PDF...' },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        toast({
          title: 'Generating Report',
          description: steps[currentStep].message,
        });
        currentStep++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setReportReady(true);
        toast({
          title: 'Report Ready!',
          description: 'Your FHSIS report has been generated successfully.',
        });
      }
    }, 800);
  };

  const downloadReport = () => {
    toast({
      title: 'Downloading Report',
      description: 'FHSIS_Report_December_2025.pdf',
    });
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          One-Click Report Generator
        </CardTitle>
        <CardDescription>
          Generate official FHSIS report for the City Health Department
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Report Preview */}
        <div className="border-2 border-dashed rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-20 bg-muted rounded flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Field Health Service Information System (FHSIS)</h4>
              <p className="text-sm text-muted-foreground">Monthly Report • December 2025</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>• Total Consultations: 342</p>
                <p>• Vaccinations Administered: 156</p>
                <p>• Nutrition Assessments: 89</p>
                <p>• Maternal Care Visits: 45</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Generating report...</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Report Ready State */}
        {reportReady && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-status-success" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">Report Ready!</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  FHSIS_Report_December_2025.pdf (2.4 MB)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!reportReady ? (
            <Button
              className="flex-1 gap-2"
              size="lg"
              onClick={generateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Monthly FHSIS Report
                </>
              )}
            </Button>
          ) : (
            <>
              <Button className="flex-1 gap-2" size="lg" onClick={downloadReport}>
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </>
          )}
        </div>

        {/* Additional Options */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium mb-3">Other Reports Available</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start gap-2">
              <FileText className="w-4 h-4" />
              Weekly Summary
            </Button>
            <Button variant="outline" size="sm" className="justify-start gap-2">
              <FileText className="w-4 h-4" />
              Disease Report
            </Button>
            <Button variant="outline" size="sm" className="justify-start gap-2">
              <FileText className="w-4 h-4" />
              Immunization Report
            </Button>
            <Button variant="outline" size="sm" className="justify-start gap-2">
              <FileText className="w-4 h-4" />
              Sanitation Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}