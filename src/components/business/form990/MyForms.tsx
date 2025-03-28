
import { useState } from 'react';
import { 
  FileText, 
  CheckSquare, 
  Download, 
  Upload, 
  Folder,
  CheckCircle2,
  Clock
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

// Draft form interface
interface DraftForm {
  id: string;
  formType: string;
  name: string;
  createdAt: string;
  lastModified: string;
  progress: number;
  status: 'in_progress' | 'ready_to_submit';
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

const MyForms = () => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
            View All Forms
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
    </div>
  );
};

export default MyForms;
