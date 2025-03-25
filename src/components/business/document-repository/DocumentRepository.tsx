import { useState, useEffect } from 'react';
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
  Move,
  Settings,
  RefreshCw
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
import { GitHubDocument, fetchDocumentsFromGitHub } from '@/services/githubService';

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
  url?: string;
  downloadUrl?: string;
}

interface Permission {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
  dateAdded: string;
}

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
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    fetchDocuments();
    
    const token = localStorage.getItem('github_token');
    if (token) {
      setGithubToken(token);
    }
  }, []);
  
  const fetchDocuments = async () => {
    setIsLoadingDocuments(true);
    try {
      const githubDocs = await fetchDocumentsFromGitHub();
      console.log(`Total documents loaded: ${githubDocs.length}`);
      setDocuments(githubDocs);
      if (githubDocs.length > 0) {
        toast({
          title: "Documents loaded",
          description: `${githubDocs.length} documents loaded from GitHub repository`,
        });
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error loading documents",
        description: "Failed to load documents from GitHub repository",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  };
  
  const handleRefresh = () => {
    fetchDocuments();
  };
  
  const saveGitHubToken = () => {
    localStorage.setItem('github_token', githubToken);
    toast({
      title: "Token saved",
      description: "Your GitHub token has been saved.",
    });
    setIsSettingsDialogOpen(false);
    fetchDocuments();
  };
  
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
        doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.entity?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredDocs;
  };
  
  const downloadSelectedDocuments = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select documents to download",
        variant: "destructive",
      });
      return;
    }

    const docsToDownload = documents.filter(doc => 
      selectedDocuments.includes(doc.id) && doc.downloadUrl
    );
    
    docsToDownload.forEach(doc => {
      if (doc.downloadUrl) {
        window.open(doc.downloadUrl, '_blank');
      }
    });
    
    if (docsToDownload.length > 0) {
      toast({
        title: "Download started",
        description: `Started downloading ${docsToDownload.length} document(s)`,
      });
    } else {
      toast({
        title: "Download failed",
        description: "No download URLs available for selected documents",
        variant: "destructive",
      });
    }
  };
  
  const archiveSelectedDocuments = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select documents to archive",
        variant: "destructive",
      });
      return;
    }

    const updatedDocs = documents.map(doc => {
      if (selectedDocuments.includes(doc.id)) {
        return { ...doc, isArchived: true };
      }
      return doc;
    });
    
    setDocuments(updatedDocs);
    
    toast({
      title: "Documents archived",
      description: `${selectedDocuments.length} document(s) archived successfully`,
    });
    
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
    toast({
      title: "Documents moved",
      description: `${selectedDocuments.length} document(s) moved to ${destination}`,
    });
    setIsMoveDialogOpen(false);
    setSelectedDocuments([]);
  };

  const handleUploadComplete = (fileDetails: {
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadDate: string;
    url?: string;
  }) => {
    fetchDocuments();
    
    toast({
      title: "Upload complete",
      description: `${fileDetails.name} uploaded successfully`,
    });
  };

  const handleDeleteDocuments = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select documents to delete",
        variant: "destructive",
      });
      return;
    }
    
    const updatedDocs = documents.filter(doc => !selectedDocuments.includes(doc.id));
    setDocuments(updatedDocs);
    
    toast({
      title: "Documents deleted",
      description: `${selectedDocuments.length} document(s) deleted`,
    });
    
    setSelectedDocuments([]);
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
            onClick={handleRefresh}
            disabled={isLoadingDocuments}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingDocuments ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setIsSettingsDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <Button 
            variant="outline" 
            onClick={copySelectedDocuments}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          
          <Button 
            variant="outline" 
            onClick={moveSelectedDocuments}
          >
            <Move className="h-4 w-4 mr-2" />
            Move
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
                onClick={handleDeleteDocuments}
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
      
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Repository Settings</DialogTitle>
            <DialogDescription>
              Configure your GitHub integration settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub Personal Access Token</label>
              <Input
                type="text"
                placeholder="Enter your GitHub token"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Token needs repo permissions. 
                <a 
                  href="https://github.com/settings/tokens/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary ml-1"
                >
                  Generate token
                </a>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={saveGitHubToken}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
                    {isLoadingDocuments ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                          Loading documents...
                        </TableCell>
                      </TableRow>
                    ) : getFilteredDocuments().length > 0 ? (
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
                              <a 
                                href={doc.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:underline"
                              >
                                {doc.name}
                              </a>
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
            {documents.filter(doc => doc.isArchived).length} archived items
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
                      <span className="font-medium">{documents.filter(doc => doc.isArchived).length}</span>
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
