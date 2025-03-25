import { useState } from 'react';
import { 
  Folder, 
  Upload, 
  Download, 
  Archive, 
  Lock,
  File,
  FileText,
  Trash2,
  CheckSquare,
  Square,
  Search,
  Filter,
  FolderOpen,
  Copy,
  Flag,
  List,
  Box,
  User,
  Move
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload from './DocumentUpload';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  isArchived: boolean;
  category: 'form990' | 'financial' | 'tax' | 'other';
  jurisdiction: string;
  serviceLine: string;
  recordType: string;
  entity: string;
  clientApproved: boolean;
  clientContact: string;
  client: string;
}

interface Permission {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
  dateAdded: string;
}

const sampleDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Form 990 - 2023.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-10T10:30:00Z',
    isArchived: false,
    category: 'form990',
    jurisdiction: 'United States',
    serviceLine: 'Tax',
    recordType: 'Tax returns',
    entity: 'Non-profit Organization',
    clientApproved: true,
    clientContact: 'Sarah Johnson',
    client: 'Coke'
  },
  {
    id: 'doc-2',
    name: 'Financial Statement Q4 2023.xlsx',
    type: 'Excel',
    size: '1.7 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-15T14:45:00Z',
    isArchived: false,
    category: 'financial',
    jurisdiction: 'United States',
    serviceLine: 'Assurance',
    recordType: 'Financial reporting',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'Michael Chen',
    client: 'Boeing'
  },
  {
    id: 'doc-3',
    name: 'Form 990 - 2022.pdf',
    type: 'PDF',
    size: '2.2 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2022-12-05T09:15:00Z',
    isArchived: true,
    category: 'form990',
    jurisdiction: 'United States',
    serviceLine: 'Tax',
    recordType: 'Tax returns',
    entity: 'Non-profit Organization',
    clientApproved: false,
    clientContact: 'Sarah Johnson',
    client: 'Coke'
  },
  {
    id: 'doc-4',
    name: 'Annual Tax Report 2023.pdf',
    type: 'PDF',
    size: '3.1 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-11-28T16:30:00Z',
    isArchived: false,
    category: 'tax',
    jurisdiction: 'India',
    serviceLine: 'Tax',
    recordType: 'Tax permanent documentation',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'Raj Patel',
    client: 'Air Canada'
  },
  {
    id: 'doc-5',
    name: 'Budget Projections 2024.xlsx',
    type: 'Excel',
    size: '1.5 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-20T11:30:00Z',
    isArchived: false,
    category: 'financial',
    jurisdiction: 'Canada',
    serviceLine: 'Advisory',
    recordType: 'Budget planning',
    entity: 'Government',
    clientApproved: false,
    clientContact: 'Emma Thompson',
    client: 'Air Canada'
  },
  {
    id: 'doc-6',
    name: 'Form 990-EZ 2023.pdf',
    type: 'PDF',
    size: '1.8 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-08T09:45:00Z',
    isArchived: false,
    category: 'form990',
    jurisdiction: 'United States',
    serviceLine: 'Tax',
    recordType: 'Tax returns',
    entity: 'Non-profit Organization',
    clientApproved: true,
    clientContact: 'Robert Miller',
    client: 'Microsoft'
  },
  {
    id: 'doc-7',
    name: 'Transfer Pricing Study 2023.pdf',
    type: 'PDF',
    size: '4.2 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-11-15T13:20:00Z',
    isArchived: false,
    category: 'tax',
    jurisdiction: 'Global',
    serviceLine: 'Transfer Pricing',
    recordType: 'Tax study',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'Jennifer Lee',
    client: 'Boeing'
  },
  {
    id: 'doc-8',
    name: 'Q1 Financial Results 2024.xlsx',
    type: 'Excel',
    size: '2.1 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2024-04-10T10:15:00Z',
    isArchived: false,
    category: 'financial',
    jurisdiction: 'United States',
    serviceLine: 'Assurance',
    recordType: 'Financial reporting',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'David Wang',
    client: 'Tesla'
  },
  {
    id: 'doc-9',
    name: 'Donation Records 2023.docx',
    type: 'Word',
    size: '1.3 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-22T15:45:00Z',
    isArchived: false,
    category: 'form990',
    jurisdiction: 'United States',
    serviceLine: 'Advisory',
    recordType: 'Supporting documentation',
    entity: 'Non-profit Organization',
    clientApproved: true,
    clientContact: 'Maria Rodriguez',
    client: 'McDonald'
  },
  {
    id: 'doc-10',
    name: 'Tax Compliance Checklist 2023.pdf',
    type: 'PDF',
    size: '0.8 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-10-05T11:30:00Z',
    isArchived: false,
    category: 'tax',
    jurisdiction: 'Canada',
    serviceLine: 'Tax',
    recordType: 'Compliance',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'John Peterson',
    client: 'WestJet'
  },
  {
    id: 'doc-11',
    name: 'Form 990-T 2023.pdf',
    type: 'PDF',
    size: '2.0 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-12T14:20:00Z',
    isArchived: false,
    category: 'form990',
    jurisdiction: 'United States',
    serviceLine: 'Tax',
    recordType: 'Tax returns',
    entity: 'Non-profit Organization',
    clientApproved: false,
    clientContact: 'Laura Smith',
    client: 'Toyota'
  },
  {
    id: 'doc-12',
    name: 'Revenue Recognition Analysis.xlsx',
    type: 'Excel',
    size: '1.9 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-11-10T09:25:00Z',
    isArchived: false,
    category: 'financial',
    jurisdiction: 'United States',
    serviceLine: 'Advisory',
    recordType: 'Financial analysis',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'Paul Johnson',
    client: 'Microsoft'
  },
  {
    id: 'doc-13',
    name: 'Form 990 - 2021.pdf',
    type: 'PDF',
    size: '2.3 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2021-12-08T10:15:00Z',
    isArchived: true,
    category: 'form990',
    jurisdiction: 'United States',
    serviceLine: 'Tax',
    recordType: 'Tax returns',
    entity: 'Non-profit Organization',
    clientApproved: true,
    clientContact: 'Sarah Johnson',
    client: 'Coke'
  },
  {
    id: 'doc-14',
    name: 'GST Audit Report 2023.pdf',
    type: 'PDF',
    size: '2.5 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-18T16:40:00Z',
    isArchived: false,
    category: 'tax',
    jurisdiction: 'India',
    serviceLine: 'Tax',
    recordType: 'Audit report',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'Ananya Patel',
    client: 'Tata'
  },
  {
    id: 'doc-15',
    name: 'Capital Expenditure Plan 2024.pptx',
    type: 'PowerPoint',
    size: '3.4 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2024-01-15T14:30:00Z',
    isArchived: false,
    category: 'financial',
    jurisdiction: 'Global',
    serviceLine: 'Advisory',
    recordType: 'Strategic planning',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'Thomas Brown',
    client: 'Apple'
  },
  {
    id: 'doc-16',
    name: 'Schedule A Form 990 2023.pdf',
    type: 'PDF',
    size: '1.6 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-11T11:20:00Z',
    isArchived: false,
    category: 'form990',
    jurisdiction: 'United States',
    serviceLine: 'Tax',
    recordType: 'Tax returns',
    entity: 'Non-profit Organization',
    clientApproved: true,
    clientContact: 'William Davis',
    client: 'Pepsi'
  },
  {
    id: 'doc-17',
    name: 'International Tax Restructuring Memo.docx',
    type: 'Word',
    size: '1.2 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-10-25T15:10:00Z',
    isArchived: false,
    category: 'tax',
    jurisdiction: 'Global',
    serviceLine: 'International Tax',
    recordType: 'Planning',
    entity: 'Corporate',
    clientApproved: false,
    clientContact: 'Richard Green',
    client: 'Walmart'
  },
  {
    id: 'doc-18',
    name: 'Cash Flow Projections 2024-2025.xlsx',
    type: 'Excel',
    size: '1.8 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2024-02-05T09:45:00Z',
    isArchived: false,
    category: 'financial',
    jurisdiction: 'United States',
    serviceLine: 'Advisory',
    recordType: 'Financial planning',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'Karen Williams',
    client: 'Netflix'
  },
  {
    id: 'doc-19',
    name: 'Form 990-N E-Postcard 2023.pdf',
    type: 'PDF',
    size: '0.5 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-07T13:15:00Z',
    isArchived: false,
    category: 'form990',
    jurisdiction: 'United States',
    serviceLine: 'Tax',
    recordType: 'Tax returns',
    entity: 'Non-profit Organization',
    clientApproved: true,
    clientContact: 'Jessica Taylor',
    client: 'Google'
  },
  {
    id: 'doc-20',
    name: 'VAT Return Q4 2023.pdf',
    type: 'PDF',
    size: '1.0 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2024-01-10T10:30:00Z',
    isArchived: false,
    category: 'tax',
    jurisdiction: 'United Kingdom',
    serviceLine: 'Tax',
    recordType: 'Tax returns',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'James Wilson',
    client: 'BP'
  },
  {
    id: 'doc-21',
    name: 'Annual Financial Statements 2023.pdf',
    type: 'PDF',
    size: '5.2 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2024-03-15T14:45:00Z',
    isArchived: false,
    category: 'financial',
    jurisdiction: 'United States',
    serviceLine: 'Assurance',
    recordType: 'Financial reporting',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'Michelle Robinson',
    client: 'Ford'
  },
  {
    id: 'doc-22',
    name: 'Form 990 Schedule B 2023.pdf',
    type: 'PDF',
    size: '1.7 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-14T11:40:00Z',
    isArchived: false,
    category: 'form990',
    jurisdiction: 'United States',
    serviceLine: 'Tax',
    recordType: 'Tax returns',
    entity: 'Non-profit Organization',
    clientApproved: true,
    clientContact: 'Robert Johnson',
    client: 'Facebook'
  },
  {
    id: 'doc-23',
    name: 'Corporate Income Tax Return 2023.pdf',
    type: 'PDF',
    size: '3.3 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2024-03-01T10:20:00Z',
    isArchived: false,
    category: 'tax',
    jurisdiction: 'Canada',
    serviceLine: 'Tax',
    recordType: 'Tax returns',
    entity: 'Corporate',
    clientApproved: true,
    clientContact: 'Daniel Thompson',
    client: 'Shell'
  },
  {
    id: 'doc-24',
    name: 'Audit Planning Memo 2024.docx',
    type: 'Word',
    size: '1.4 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2024-01-20T09:30:00Z',
    isArchived: false,
    category: 'financial',
    jurisdiction: 'Global',
    serviceLine: 'Assurance',
    recordType: 'Audit planning',
    entity: 'Corporate',
    clientApproved: false,
    clientContact: 'Lisa Garcia',
    client: 'Amazon'
  },
  {
    id: 'doc-25',
    name: 'Form 990 Extension Request 2023.pdf',
    type: 'PDF',
    size: '0.7 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-11-05T15:30:00Z',
    isArchived: false,
    category: 'form990',
    jurisdiction: 'United States',
    serviceLine: 'Tax',
    recordType: 'Tax filing',
    entity: 'Non-profit Organization',
    clientApproved: true,
    clientContact: 'Elizabeth Moore',
    client: 'Twitter'
  }
];

const samplePermissions: Permission[] = [
  {
    id: 'perm-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'viewer',
    dateAdded: '2023-11-15T10:30:00Z'
  },
  {
    id: 'perm-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'editor',
    dateAdded: '2023-11-20T14:45:00Z'
  },
  {
    id: 'perm-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'admin',
    dateAdded: '2023-10-05T09:15:00Z'
  }
];

const DocumentRepository = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [documents, setDocuments] = useState(sampleDocuments);
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const toggleDocumentSelection = (docId: string) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== docId));
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
  };
  
  const selectAllDocuments = () => {
    if (selectedDocuments.length === getFilteredDocuments().length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(getFilteredDocuments().map(doc => doc.id));
    }
  };
  
  const getFilteredDocuments = () => {
    let filteredDocs = documents;
    
    if (activeTab === 'archived') {
      filteredDocs = filteredDocs.filter(doc => doc.isArchived);
    } else if (activeTab === 'active') {
      filteredDocs = filteredDocs.filter(doc => !doc.isArchived);
    } else if (activeTab !== 'all') {
      filteredDocs = filteredDocs.filter(doc => doc.category === activeTab);
    }
    
    if (searchTerm) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredDocs;
  };
  
  const downloadSelectedDocuments = () => {
    console.log('Downloading documents:', selectedDocuments);
    alert(`Downloading ${selectedDocuments.length} document(s)`);
  };
  
  const archiveSelectedDocuments = () => {
    console.log('Archiving documents:', selectedDocuments);
    alert(`Archived ${selectedDocuments.length} document(s)`);
    setSelectedDocuments([]);
  };

  const copySelectedDocuments = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select documents to copy",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Copying documents:', selectedDocuments);
    toast({
      title: "Documents copied",
      description: `${selectedDocuments.length} document(s) copied successfully`,
    });
  };

  const moveSelectedDocuments = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select documents to move",
        variant: "destructive",
      });
      return;
    }
    
    setIsMoveDialogOpen(true);
  };

  const handleMoveDocuments = (destination: string) => {
    console.log('Moving documents:', selectedDocuments, 'to destination:', destination);
    toast({
      title: "Documents moved",
      description: `${selectedDocuments.length} document(s) moved to ${destination}`,
    });
    setIsMoveDialogOpen(false);
  };

  const handleUploadComplete = (fileDetails: {
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadDate: string;
  }) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: fileDetails.name,
      type: fileDetails.type,
      size: fileDetails.size,
      uploadedBy: fileDetails.uploadedBy,
      uploadDate: fileDetails.uploadDate,
      isArchived: false,
      category: 'form990',
      jurisdiction: 'United States',
      serviceLine: 'Tax',
      recordType: 'Tax returns',
      entity: 'Non-profit Organization',
      clientApproved: false,
      clientContact: 'Aswin Bhaskaran',
      client: 'Client Name'
    };
    
    setDocuments([newDocument, ...documents]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-base mb-1">My Documents Repository</h3>
            <p className="text-muted-foreground text-sm">
              Securely store, organize, and manage all your important documents. Use the repository to store Form 990 submissions, 
              financial data, and other critical business documents.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 max-w-sm relative">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-8"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Documents</DialogTitle>
                <DialogDescription>
                  Add files to your document repository. Supported formats: PDF, DOCX, XLSX, JPG, PNG.
                </DialogDescription>
              </DialogHeader>
              <DocumentUpload 
                onUploadComplete={handleUploadComplete}
                onClose={() => setIsUploadDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            onClick={copySelectedDocuments}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Documents
          </Button>
          
          <Button 
            variant="outline" 
            onClick={moveSelectedDocuments}
          >
            <Move className="h-4 w-4 mr-2" />
            Move Documents
          </Button>
          
          {selectedDocuments.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={downloadSelectedDocuments}
              >
                <Download className="h-4 w-4 mr-2" />
                Download ({selectedDocuments.length})
              </Button>
              
              <Button 
                variant="outline" 
                onClick={archiveSelectedDocuments}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setSelectedDocuments([])}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Filter Documents</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="filter-pdf" />
                    <label htmlFor="filter-pdf" className="text-sm">PDF Files</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="filter-excel" />
                    <label htmlFor="filter-excel" className="text-sm">Excel Files</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="filter-word" />
                    <label htmlFor="filter-word" className="text-sm">Word Files</label>
                  </div>
                </div>
                <div className="pt-2">
                  <Button size="sm" className="w-full">Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move Documents</DialogTitle>
            <DialogDescription>
              Select a destination folder to move the selected documents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Destination Folder</div>
              <select 
                className="w-full border rounded-md p-2"
                defaultValue=""
                onChange={(e) => e.target.value && handleMoveDocuments(e.target.value)}
              >
                <option value="" disabled>Select a folder</option>
                <option value="Form 990">Form 990</option>
                <option value="Financial Data">Financial Data</option>
                <option value="Tax Documents">Tax Documents</option>
                <option value="Client Documentation">Client Documentation</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => handleMoveDocuments('Selected Folder')}>
              Move Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="form990">Form 990</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <div className="flex items-center justify-center" onClick={selectAllDocuments}>
                          {selectedDocuments.length === getFilteredDocuments().length && getFilteredDocuments().length > 0 ? (
                            <CheckSquare className="h-4 w-4 cursor-pointer" />
                          ) : (
                            <Square className="h-4 w-4 cursor-pointer" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Flag className="h-3 w-3" />
                          <span>Jurisdiction</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <List className="h-3 w-3" />
                          <span>Service Line</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>Record Type</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Box className="h-3 w-3" />
                          <span>Entity</span>
                        </div>
                      </TableHead>
                      <TableHead>Client Approved</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Client Contact</span>
                        </div>
                      </TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredDocuments().length > 0 ? (
                      getFilteredDocuments().map((doc) => (
                        <TableRow key={doc.id} className={doc.isArchived ? "opacity-70" : ""}>
                          <TableCell>
                            <div 
                              className="flex items-center justify-center" 
                              onClick={() => toggleDocumentSelection(doc.id)}
                            >
                              {selectedDocuments.includes(doc.id) ? (
                                <CheckSquare className="h-4 w-4 cursor-pointer" />
                              ) : (
                                <Square className="h-4 w-4 cursor-pointer" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {doc.type === 'PDF' ? (
                                <FileText className="h-4 w-4 text-red-500" />
                              ) : doc.type === 'Excel' ? (
                                <FileText className="h-4 w-4 text-green-600" />
                              ) : (
                                <File className="h-4 w-4" />
                              )}
                              <span>{doc.name}</span>
                              {doc.isArchived && (
                                <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full ml-1">
                                  Archived
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{doc.size}</TableCell>
                          <TableCell>{doc.jurisdiction}</TableCell>
                          <TableCell>{doc.serviceLine}</TableCell>
                          <TableCell>{doc.recordType}</TableCell>
                          <TableCell>{doc.entity}</TableCell>
                          <TableCell>
                            {doc.clientApproved ? (
                              <CheckSquare className="h-4 w-4 text-green-500" />
                            ) : (
                              <Square className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell>{doc.clientContact}</TableCell>
                          <TableCell>{doc.client}</TableCell>
                          <TableCell>{doc.uploadedBy}</TableCell>
                          <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                          No documents found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Collapsible className="border rounded-md">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Archival Management</h3>
          </div>
          <div className="text-muted-foreground text-sm">
            {sampleDocuments.filter(doc => doc.isArchived).length} archived items
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage your archived documents. Archived items are not deleted but kept in a separate section for historical reference.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Archive Policies</CardTitle>
                  <CardDescription>Configure automatic archival policies</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Archive documents older than 1 year</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Archive superseded versions</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Archive based on document category</span>
                      <input type="checkbox" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Save Preferences</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Archival Statistics</CardTitle>
                  <CardDescription>Document archival metrics</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Total archived documents:</span>
                      <span className="font-medium">{sampleDocuments.filter(doc => doc.isArchived).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Archive storage used:</span>
                      <span className="font-medium">5.4 MB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Most recent archive:</span>
                      <span className="font-medium">Nov 15, 2023</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View Full Report</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Collapsible className="border rounded-md">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Permission Management</h3>
          </div>
          <div className="text-muted-foreground text-sm">
            {samplePermissions.length} users with access
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Manage who can access, view, and modify documents in the repository.
              </p>
              <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Grant access to documents in the repository.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Name</label>
                      <Input className="col-span-3" placeholder="Enter user name" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Email</label>
                      <Input className="col-span-3" placeholder="Enter email address" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Role</label>
                      <select className="col-span-3 border rounded-md p-2">
                        <option value="viewer">Viewer (Can only view documents)</option>
                        <option value="editor">Editor (Can upload and edit documents)</option>
                        <option value="admin">Admin (Full access)</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={() => setIsPermissionDialogOpen(false)}>
                      Add User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samplePermissions.map((perm) => (
                  <TableRow key={perm.id}>
                    <TableCell className="font-medium">{perm.name}</TableCell>
                    <TableCell>{perm.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        perm.role === 'admin' 
                          ? 'bg-primary/10 text-primary' 
                          : perm.role === 'editor'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {perm.role.charAt(0).toUpperCase() + perm.role.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(perm.dateAdded)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive">Remove</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DocumentRepository;
