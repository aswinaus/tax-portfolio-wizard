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
  Copy
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  isArchived: boolean;
  category: 'form990' | 'financial' | 'tax' | 'other';
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
    category: 'form990'
  },
  {
    id: 'doc-2',
    name: 'Financial Statement Q4 2023.xlsx',
    type: 'Excel',
    size: '1.7 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-15T14:45:00Z',
    isArchived: false,
    category: 'financial'
  },
  {
    id: 'doc-3',
    name: 'Form 990 - 2022.pdf',
    type: 'PDF',
    size: '2.2 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2022-12-05T09:15:00Z',
    isArchived: true,
    category: 'form990'
  },
  {
    id: 'doc-4',
    name: 'Annual Tax Report 2023.pdf',
    type: 'PDF',
    size: '3.1 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-11-28T16:30:00Z',
    isArchived: false,
    category: 'tax'
  },
  {
    id: 'doc-5',
    name: 'Budget Projections 2024.xlsx',
    type: 'Excel',
    size: '1.5 MB',
    uploadedBy: 'Aswin Bhaskaran',
    uploadDate: '2023-12-20T11:30:00Z',
    isArchived: false,
    category: 'financial'
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
    let filteredDocs = sampleDocuments;
    
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
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-primary/60" />
                  <p className="text-sm font-medium">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">Maximum file size: 10MB</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">Category</div>
                  <select className="border rounded-md p-2">
                    <option value="form990">Form 990</option>
                    <option value="financial">Financial Data</option>
                    <option value="tax">Tax Documents</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setIsUploadDialogOpen(false)}>
                  Upload Files
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            onClick={copySelectedDocuments}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Documents
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
                        <TableCell>{doc.uploadedBy}</TableCell>
                        <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No documents found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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

