
import { FileText } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Form type interface
interface FormType {
  id: string;
  name: string;
  description: string;
  forWho: string;
  status: 'available' | 'coming_soon';
}

// Form types data
const formTypes: FormType[] = [
  {
    id: '990',
    name: 'Form 990',
    description: 'Return of Organization Exempt From Income Tax',
    forWho: 'Most tax-exempt organizations with gross receipts ≥ $200,000 or total assets ≥ $500,000',
    status: 'available'
  },
  {
    id: '990-EZ',
    name: 'Form 990-EZ',
    description: 'Short Form Return of Organization Exempt From Income Tax',
    forWho: 'Most tax-exempt organizations with gross receipts < $200,000 and total assets < $500,000',
    status: 'available'
  },
  {
    id: '990-N',
    name: 'Form 990-N',
    description: 'Electronic Notice (e-Postcard)',
    forWho: 'Small tax-exempt organizations with gross receipts ≤ $50,000',
    status: 'available'
  },
  {
    id: '990-PF',
    name: 'Form 990-PF',
    description: 'Return of Private Foundation',
    forWho: 'Private foundations, regardless of financial status',
    status: 'available'
  },
  {
    id: '990-T',
    name: 'Form 990-T',
    description: 'Exempt Organization Business Income Tax Return',
    forWho: 'Organizations with unrelated business income',
    status: 'coming_soon'
  }
];

interface FormTypesProps {
  selectedFormType: string | null;
  setSelectedFormType: (formType: string) => void;
  handleCreateForm: () => void;
}

const FormTypes = ({ selectedFormType, setSelectedFormType, handleCreateForm }: FormTypesProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-base mb-1">Before you begin</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Make sure you have the following information ready:
            </p>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Organization's EIN (Employer Identification Number)</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Financial statements for the tax year</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>List of officers, directors, and key employees with compensation information</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Program service accomplishments and expenses</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-display font-medium">Select Form Type</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formTypes.map((form) => (
            <Card 
              key={form.id}
              className={`border cursor-pointer transition-all ${
                selectedFormType === form.id 
                  ? 'border-primary bg-primary/5' 
                  : form.status === 'coming_soon' 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'border-border/60 hover:border-primary/50'
              }`}
              onClick={() => form.status === 'available' && setSelectedFormType(form.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    {form.name}
                  </CardTitle>
                  {form.status === 'coming_soon' && (
                    <Badge variant="outline" className="bg-secondary">Coming Soon</Badge>
                  )}
                </div>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <strong>For:</strong> {form.forWho}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleCreateForm}
            disabled={!selectedFormType}
          >
            <FileText className="mr-2 h-4 w-4" />
            Create Form {selectedFormType}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormTypes;
export { formTypes };
