
import { 
  Info, 
  Download, 
  FileText,
  ArrowRight 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const HelpResources = () => {
  return (
    <div className="space-y-8">
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
    </div>
  );
};

export default HelpResources;
