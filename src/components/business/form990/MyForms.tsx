
import { useState } from 'react';
import { 
  FileText, 
  CheckSquare, 
  Download, 
  Upload, 
  Folder,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Draft form interface
interface DraftForm {
  id: string;
  formType: string;
  name: string;
  createdAt: string;
  lastModified: string;
  progress: number;
  status: 'in_progress' | 'ready_to_submit' | 'pending_submission';
  dueDate?: string;
}

// Sample draft forms
const sampleDrafts: DraftForm[] = [
  {
    id: 'draft-1',
    formType: '990',
    name: 'Org Name - 2023 Tax Year',
    createdAt: '2023-12-10T10:30:00Z',
    lastModified: '2023-12-15T14:45:00Z',
    progress: 68,
    status: 'in_progress'
  },
  {
    id: 'draft-2',
    formType: '990-EZ',
    name: 'Another Org - 2023 Tax Year',
    createdAt: '2023-11-05T09:15:00Z',
    lastModified: '2023-12-20T11:30:00Z',
    progress: 100,
    status: 'ready_to_submit'
  }
];

// Sample pending submissions
const pendingSubmissions: DraftForm[] = [
  {
    id: 'pending-1',
    formType: '990',
    name: 'Main Organization - 2023 Tax Year',
    createdAt: '2023-10-15T08:20:00Z',
    lastModified: '2023-12-22T16:30:00Z',
    progress: 100,
    status: 'pending_submission',
    dueDate: '2024-05-15T23:59:59Z'
  },
  {
    id: 'pending-2',
    formType: '990-PF',
    name: 'Foundation Name - 2023 Tax Year',
    createdAt: '2023-11-20T14:10:00Z',
    lastModified: '2023-12-18T09:45:00Z',
    progress: 100,
    status: 'pending_submission',
    dueDate: '2024-04-30T23:59:59Z'
  }
];

const MyForms = () => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculateDaysRemaining = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Folder className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-base mb-1">My Forms</h3>
            <p className="text-muted-foreground text-sm">
              View, edit, and manage all your Form 990 submissions from this dashboard.
              Track progress, meet deadlines, and keep your tax-exempt status in good standing.
            </p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="drafts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="drafts" className="text-sm">Draft Forms</TabsTrigger>
          <TabsTrigger value="pending" className="text-sm">
            Pending Submission
            {pendingSubmissions.length > 0 && (
              <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-700 border-amber-200">
                {pendingSubmissions.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="drafts" className="space-y-4">
          {sampleDrafts.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-display font-medium flex items-center gap-2">
                <Folder className="h-5 w-5 text-primary" />
                Your Draft Forms
              </h2>
              
              {sampleDrafts.map((draft) => (
                <Card key={draft.id} className="border-border/60 hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="mb-2">Form {draft.formType}</Badge>
                        <CardTitle className="text-lg">{draft.name}</CardTitle>
                        <CardDescription className="flex gap-3 mt-1">
                          <span>Created: {formatDate(draft.createdAt)}</span>
                          <span>Last modified: {formatDate(draft.lastModified)}</span>
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={draft.status === 'ready_to_submit' ? 'default' : 'outline'}
                        className={draft.status === 'ready_to_submit' ? 'bg-green-500 hover:bg-green-500/90' : ''}
                      >
                        {draft.status === 'ready_to_submit' ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Ready to Submit
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> In Progress
                          </span>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Completion:</span>
                        <span className="font-medium">{draft.progress}%</span>
                      </div>
                      <Progress value={draft.progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="mr-2">
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download
                    </Button>
                    <Button size="sm">
                      {draft.status === 'ready_to_submit' ? (
                        <>
                          <Upload className="h-3.5 w-3.5 mr-1.5" />
                          Submit to IRS
                        </>
                      ) : (
                        <>
                          <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
                          Continue Editing
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View All Draft Forms
              </Button>
            </div>
          ) : (
            <div className="text-center py-16 bg-secondary/40 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No form drafts yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't created any Form 990 drafts yet. Create a new form to get started.
              </p>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Create New Form
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingSubmissions.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-display font-medium flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Forms Pending Submission
              </h2>
              
              {pendingSubmissions.map((form) => {
                const daysRemaining = form.dueDate ? calculateDaysRemaining(form.dueDate) : null;
                const isUrgent = daysRemaining !== null && daysRemaining <= 14;
                
                return (
                  <Card key={form.id} className={`border-border/60 hover:shadow-sm transition-shadow ${isUrgent ? 'border-amber-300' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="mb-2">Form {form.formType}</Badge>
                          <CardTitle className="text-lg">{form.name}</CardTitle>
                          <CardDescription className="flex flex-wrap gap-3 mt-1">
                            <span>Last modified: {formatDate(form.lastModified)}</span>
                            {form.dueDate && (
                              <span className={`font-medium ${isUrgent ? 'text-amber-600' : ''}`}>
                                Due: {formatDate(form.dueDate)} 
                                {daysRemaining !== null && (
                                  <span className={`ml-1 ${daysRemaining <= 7 ? 'text-red-500' : ''}`}>
                                    ({daysRemaining} days remaining)
                                  </span>
                                )}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant="outline"
                          className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                        >
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Pending Submission
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="bg-amber-50 text-amber-800 rounded p-2 text-sm">
                          <p className="flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                            This form is complete but has not been submitted to the IRS. 
                            {isUrgent && <span className="font-medium">Submission deadline is approaching!</span>}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Download
                      </Button>
                      <Button size="sm" className={isUrgent ? 'bg-amber-600 hover:bg-amber-700' : ''}>
                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                        Submit to IRS
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
              
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View All Pending Forms
              </Button>
            </div>
          ) : (
            <div className="text-center py-16 bg-secondary/40 rounded-lg">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No pending submissions</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You don't have any forms pending submission. Complete your draft forms to prepare them for submission to the IRS.
              </p>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Review Draft Forms
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyForms;
