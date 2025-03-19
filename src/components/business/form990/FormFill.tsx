
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import Form990PartI from '@/components/business/Form990PartI';

interface FormFillProps {
  showForm: boolean;
}

const FormFill = ({ showForm }: FormFillProps) => {
  return (
    <div className="space-y-6">
      {showForm ? (
        <Form990PartI />
      ) : (
        <div className="text-center py-16 bg-secondary/40 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No form selected</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Please select a form type from the "Create New Form" tab first.
          </p>
          <Button onClick={() => {
            document.querySelector('[data-value="create"]')?.dispatchEvent(
              new MouseEvent('click', { bubbles: true })
            );
          }}>
            <FileText className="mr-2 h-4 w-4" />
            Select Form Type
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormFill;
