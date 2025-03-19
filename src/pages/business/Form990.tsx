
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckSquare, 
  Info, 
  AlertCircle, 
  ChevronRight, 
  Download, 
  Upload, 
  ArrowRight, 
  ChevronDown,
  CheckCircle2,
  Clock,
  MessageSquare,
  Folder
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import LyzrAgentChat from '@/components/business/LyzrAgentChat';
import Form990PartI from '@/components/business/Form990PartI';

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

// FAQ interface
interface FAQ {
  question: string;
  answer: string;
}

// FAQs data
const faqs: FAQ[] = [
  {
    question: 'Which Form 990 does my organization need to file?',
    answer: 'The form your organization needs to file depends on your gross receipts and total assets. Form 990-N for gross receipts ≤ $50,000, Form 990-EZ for gross receipts < $200,000 and total assets < $500,000, and Form 990 for gross receipts ≥ $200,000 or total assets ≥ $500,000. Private foundations file Form 990-PF regardless of financial status.'
  },
  {
    question: 'When is Form 990 due?',
    answer: 'Form 990 must be filed by the 15th day of the 5th month after the end of your organization\'s fiscal year. For example, if your fiscal year ends on December 31, the form is due by May 15 of the following year.'
  },
  {
    question: 'What happens if we miss the filing deadline?',
    answer: 'If you miss the deadline, your organization may be subject to penalties. Additionally, if you fail to file for three consecutive years, your tax-exempt status will be automatically revoked.'
  },
  {
    question: 'Can I get an extension for filing Form 990?',
    answer: 'Yes, you can request an automatic 6-month extension by filing Form 8868 before your due date. This extension applies to Form 990, 990-EZ, and 990-PF, but not to Form 990-N.'
  },
  {
    question: 'Is our Form 990 information public?',
    answer: 'Yes, most information reported on Form 990 is available to the public. Organizations are required to provide copies of their three most recent Forms 990 to anyone who requests them in person or in writing.'
  }
];

const Form990 = () => {
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const handleCreateForm = () => {
    if (!selectedFormType) {
      toast.error('Please select a form type first');
      return;
    }
    
    toast.success(`Starting new Form ${selectedFormType} filing`);
    setShowForm(true);
    // In a real app, this would redirect to the form editor
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <Badge variant="outline" className="mb-2">Business</Badge>
        <h1 className="text-3xl font-display font-semibold">Tax Form 990 Filing</h1>
        <p className="text-muted-foreground mt-1">
          Complete and submit your Form 990 tax forms to the IRS
        </p>
      </div>
      
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={() => setChatOpen(!chatOpen)}
            className="h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all"
            size="icon"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
      
      {/* AI Assistant Chat Panel */}
      {chatOpen && (
        <motion.div 
          className="fixed bottom-24 right-6 w-[400px] z-10 shadow-xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <LyzrAgentChat />
        </motion.div>
      )}
      
      <Tabs defaultValue={showForm ? "fill" : "forms"} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="forms" className="text-sm">My Forms</TabsTrigger>
          <TabsTrigger value="create" className="text-sm">Create New Form</TabsTrigger>
          <TabsTrigger value="fill" className="text-sm">Fill Form</TabsTrigger>
          <TabsTrigger value="help" className="text-sm">Help & Resources</TabsTrigger>
          <TabsTrigger value="assistant" className="text-sm">AI Assistant</TabsTrigger>
        </TabsList>
        
        {/* My Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
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
        </TabsContent>
        
        {/* Create New Form Tab */}
        <TabsContent value="create" className="space-y-8">
          <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-primary" />
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
        </TabsContent>
        
        {/* Fill Form Tab */}
        <TabsContent value="fill" className="space-y-6">
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
        </TabsContent>
        
        {/* Help & Resources Tab */}
        <TabsContent value="help" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/60 hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Form Instructions
                </CardTitle>
                <CardDescription>
                  Download official IRS instructions for each form
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 text-primary" />
                    <a href="#" className="text-primary hover:underline">Form 990 Instructions</a>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 text-primary" />
                    <a href="#" className="text-primary hover:underline">Form 990-EZ Instructions</a>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 text-primary" />
                    <a href="#" className="text-primary hover:underline">Form 990-N Guide</a>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 text-primary" />
                    <a href="#" className="text-primary hover:underline">Form 990-PF Instructions</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-border/60 hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Sample Forms
                </CardTitle>
                <CardDescription>
                  View completed sample forms for reference
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 text-primary" />
                    <a href="#" className="text-primary hover:underline">Sample Form 990</a>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 text-primary" />
                    <a href="#" className="text-primary hover:underline">Sample Form 990-EZ</a>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 text-primary" />
                    <a href="#" className="text-primary hover:underline">Sample Form 990-PF</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-border/60 hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  IRS Resources
                </CardTitle>
                <CardDescription>
                  Official IRS resources for tax-exempt organizations
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 text-primary" />
                    <a href="https://www.irs.gov/charities-non-profits" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      IRS Charities & Non-Profits
                    </a>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 text-primary" />
                    <a href="https://www.irs.gov/charities-non-profits/annual-filing-and-forms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Annual Filing Requirements
                    </a>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 text-primary" />
                    <a href="https://www.irs.gov/charities-non-profits/tax-exempt-organization-search" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Tax Exempt Organization Search
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-display font-medium flex items-center gap-2">
              <Info className="h-5 w-5" />
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
        
        {/* AI Assistant Tab */}
        <TabsContent value="assistant" className="space-y-6">
          <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1">Form 990 Filing Assistant</h3>
                <p className="text-muted-foreground text-sm">
                  Our AI assistant can answer your questions about Form 990 filing requirements, deadlines, 
                  extensions, and more. Just ask a question to get started.
                </p>
              </div>
            </div>
          </div>
          
          <LyzrAgentChat />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Form990;

