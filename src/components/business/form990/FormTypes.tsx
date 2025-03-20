
import { FileText, FilePlus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispatch, SetStateAction } from 'react';

interface FormTypesProps {
  selectedFormType: string | null;
  setSelectedFormType: Dispatch<SetStateAction<string | null>>;
  handleCreateForm: () => void;
}

interface FormTypeProps {
  title: string;
  description: string;
  for: string;
  requirements: string[];
}

const formTypes: FormTypeProps[] = [
  {
    title: "Form 990",
    description: "Return of Organization Exempt From Income Tax",
    for: "Most tax-exempt organizations",
    requirements: [
      "Gross receipts ≥ $200,000", 
      "Total assets ≥ $500,000"
    ]
  },
  {
    title: "Form 990-EZ",
    description: "Short Form Return of Organization Exempt From Income Tax",
    for: "Small tax-exempt organizations",
    requirements: [
      "Gross receipts < $200,000", 
      "Total assets < $500,000"
    ]
  },
  {
    title: "Form 990-N",
    description: "e-Postcard",
    for: "Very small tax-exempt organizations",
    requirements: [
      "Gross receipts ≤ $50,000"
    ]
  },
  {
    title: "Form 990-PF",
    description: "Return of Private Foundation",
    for: "Private foundations",
    requirements: [
      "All private foundations regardless of size"
    ]
  }
];

const FormTypes = ({ selectedFormType, setSelectedFormType, handleCreateForm }: FormTypesProps) => {
  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-base mb-1">IRS Form 990 Series</h3>
            <p className="text-muted-foreground text-sm">
              The Form 990 series is a set of tax forms used by tax-exempt organizations to file annual returns with the IRS. 
              Select the appropriate form based on your organization's size and type.
            </p>
          </div>
        </div>
      </div>
      
      {/* Form Type Tabs */}
      <Tabs defaultValue="standard">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard Forms</TabsTrigger>
          <TabsTrigger value="schedules">Schedules & Add-ons</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formTypes.map((form, index) => (
              <Card 
                key={index} 
                className={selectedFormType === form.title ? "border-primary" : ""}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{form.title}</CardTitle>
                  <CardDescription>{form.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">For:</div>
                      <div className="text-sm text-muted-foreground">{form.for}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Requirements:</div>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        {form.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedFormType(form.title)}
                    variant={selectedFormType === form.title ? "default" : "outline"}
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    {selectedFormType === form.title ? "Selected" : `Select ${form.title}`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {selectedFormType && (
            <div className="mt-6 text-center">
              <Button size="lg" onClick={handleCreateForm}>
                Create {selectedFormType} Form
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="schedules" className="pt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule A</CardTitle>
                <CardDescription>Public Charity Status and Public Support</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Must be completed by organizations that are described in section 501(c)(3) and are public charities.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Schedule B</CardTitle>
                <CardDescription>Schedule of Contributors</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Required for organizations that received contributions of $5,000 or more from any one contributor.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Schedule C</CardTitle>
                <CardDescription>Political Campaign and Lobbying Activities</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                For organizations engaged in political campaign activities or lobbying.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Schedule D</CardTitle>
                <CardDescription>Supplemental Financial Statements</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Required if the organization answered "Yes" to specific questions in Form 990 Part IV.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormTypes;
