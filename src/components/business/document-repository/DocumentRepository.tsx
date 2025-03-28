import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, FileText, Filter, Search, Tag, Upload, Settings, BarChart2, History, Archive, Plus, X, Check, ChevronRight, Clock, MoreHorizontal, DownloadCloud, RefreshCw, File, Folder, List, CheckSquare, Database, Files, LayoutGrid } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import DocumentUpload from './DocumentUpload';
import LyzrDocumentAgentChat from './LyzrDocumentAgentChat';

// Types
type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  lastModified: string;
  status: 'processing' | 'completed' | 'error';
  tags: string[];
  owner: {
    name: string;
    avatar: string;
  };
  meta: {
    pages?: number;
    form?: string;
    year?: string;
    organization?: string;
  };
};

type DocumentFilter = {
  status: string[];
  tags: string[];
  types: string[];
  dateRange: [Date | null, Date | null];
  searchQuery: string;
};

// Dummy data for demonstration
const documentData: Document[] = [
  {
    id: '1',
    name: 'Form_990_2023_Draft.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: '2023-10-15',
    lastModified: '2023-10-20',
    status: 'completed',
    tags: ['Form 990', 'Draft', 'Tax'],
    owner: {
      name: 'Alex Johnson',
      avatar: '',
    },
    meta: {
      pages: 45,
      form: '990',
      year: '2023',
      organization: 'ABC Nonprofit',
    },
  },
  {
    id: '2',
    name: 'Financial_Statement_Q3_2023.xlsx',
    type: 'XLSX',
    size: '1.8 MB',
    uploadDate: '2023-09-30',
    lastModified: '2023-10-05',
    status: 'completed',
    tags: ['Financial', 'Q3', 'Statement'],
    owner: {
      name: 'Sarah Williams',
      avatar: '',
    },
    meta: {
      pages: 12,
      year: '2023',
      organization: 'ABC Nonprofit',
    },
  },
  {
    id: '3',
    name: 'Board_Meeting_Minutes_Sept.docx',
    type: 'DOCX',
    size: '568 KB',
    uploadDate: '2023-09-15',
    lastModified: '2023-09-15',
    status: 'completed',
    tags: ['Board', 'Minutes', 'Meeting', 'Governance'],
    owner: {
      name: 'Michael Chen',
      avatar: '',
    },
    meta: {
      pages: 8,
      year: '2023',
      organization: 'ABC Nonprofit',
    },
  },
  {
    id: '4',
    name: 'Donation_Records_2023.csv',
    type: 'CSV',
    size: '3.2 MB',
    uploadDate: '2023-10-01',
    lastModified: '2023-10-10',
    status: 'processing',
    tags: ['Donations', 'Records', 'Financial'],
    owner: {
      name: 'Alex Johnson',
      avatar: '',
    },
    meta: {
      year: '2023',
      organization: 'ABC Nonprofit',
    },
  },
  {
    id: '5',
    name: 'Annual_Report_2022.pdf',
    type: 'PDF',
    size: '5.7 MB',
    uploadDate: '2023-08-12',
    lastModified: '2023-08-15',
    status: 'completed',
    tags: ['Annual', 'Report', 'Public'],
    owner: {
      name: 'Sarah Williams',
      avatar: '',
    },
    meta: {
      pages: 32,
      year: '2022',
      organization: 'ABC Nonprofit',
    },
  },
  {
    id: '6',
    name: 'IRS_Correspondence_Sept15.pdf',
    type: 'PDF',
    size: '1.2 MB',
    uploadDate: '2023-09-16',
    lastModified: '2023-09-16',
    status: 'error',
    tags: ['IRS', 'Correspondence', 'Important'],
    owner: {
      name: 'Michael Chen',
      avatar: '',
    },
    meta: {
      pages: 3,
      year: '2023',
      organization: 'ABC Nonprofit',
    },
  },
];

// Main component
const DocumentRepository: React.FC = () => {
  // State management
  const [documents, setDocuments] = useState<Document[]>(documentData);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documentData);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DocumentFilter>({
    status: [],
    tags: [],
    types: [],
    dateRange: [null, null],
    searchQuery: '',
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Effect to filter documents based on search query and filters
  useEffect(() => {
    if (!documents) return;
    
    let filtered = [...documents];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(query) || 
        doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
        doc.type.toLowerCase().includes(query) ||
        (doc.meta.organization && doc.meta.organization.toLowerCase().includes(query))
      );
    }
    
    // Apply status filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(doc => filters.status.includes(doc.status));
    }
    
    // Apply tag filters
    if (filters.tags.length > 0) {
      filtered = filtered.filter(doc => 
        doc.tags.some(tag => filters.tags.includes(tag))
      );
    }
    
    // Apply type filters
    if (filters.types.length > 0) {
      filtered = filtered.filter(doc => filters.types.includes(doc.type));
    }
    
    // Apply date range filters if needed
    // This would go here
    
    setFilteredDocuments(filtered);
  }, [documents, searchQuery, filters]);
  
  // Toggle document selection
  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };
  
  // Check if all documents are selected
  const areAllSelected = filteredDocuments.length > 0 && selectedDocuments.length === filteredDocuments.length;
  
  // Toggle selection of all visible documents
  const toggleSelectAll = () => {
    if (areAllSelected) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };
  
  // Function to get all available tags from documents
  const getAllTags = () => {
    const tagsSet = new Set<string>();
    documents.forEach(doc => {
      doc.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  };
  
  // Function to get all available document types
  const getAllTypes = () => {
    const typesSet = new Set<string>();
    documents.forEach(doc => {
      typesSet.add(doc.type);
    });
    return Array.from(typesSet);
  };
  
  // Function to toggle a filter value
  const toggleFilter = (filterType: keyof DocumentFilter, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      return {
        ...prev,
        [filterType]: currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value],
      };
    });
  };
  
  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      status: [],
      tags: [],
      types: [],
      dateRange: [null, null],
      searchQuery: '',
    });
    setSearchQuery('');
  };
  
  // Handle document upload
  const handleUpload = (fileDetails: {
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadDate: string;
    metadata: any;
    githubUrl?: string;
  }) => {
    console.log('Files uploaded:', fileDetails);
    // Simulate adding the file to our documents list
    const newDocument: Document = {
      id: `new-${Date.now()}`,
      name: fileDetails.name,
      type: fileDetails.type,
      size: fileDetails.size,
      uploadDate: fileDetails.uploadDate,
      lastModified: fileDetails.uploadDate,
      status: 'processing' as const,
      tags: [],
      owner: {
        name: fileDetails.uploadedBy,
        avatar: '',
      },
      meta: {
        year: new Date().getFullYear().toString(),
        organization: 'ABC Nonprofit',
      },
    };
    
    setDocuments(prev => [newDocument, ...prev]);
    setShowUploadModal(false);
  };
  
  // Render document items based on view mode
  const renderDocumentItems = () => {
    if (filteredDocuments.length === 0) {
      return (
        <div className="col-span-full py-12 text-center">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <File className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="font-medium text-lg mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || Object.values(filters).some(f => Array.isArray(f) && f.length > 0)
              ? 'Try adjusting your search or filters'
              : 'Upload some documents to get started'}
          </p>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Documents
          </Button>
        </div>
      );
    }
    
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map(doc => (
            <Card 
              key={doc.id} 
              className={`overflow-hidden transition-all ${
                selectedDocuments.includes(doc.id) ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={() => toggleDocumentSelection(doc.id)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium truncate max-w-[220px]" title={doc.name}>
                      {doc.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {doc.type} • {doc.size}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      <span>Reprocess</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Tag className="mr-2 h-4 w-4" />
                      <span>Manage Tags</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge 
                    variant={
                      doc.status === 'completed' ? 'default' : 
                      doc.status === 'processing' ? 'secondary' : 'destructive'
                    }
                    className="capitalize"
                  >
                    {doc.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {doc.uploadDate}
                  </div>
                </div>
                
                {doc.status === 'processing' && (
                  <div className="mb-2">
                    <Progress value={68} className="h-1" />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else {
      return (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-2 py-3 text-left">
                  <Checkbox
                    checked={areAllSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-2 py-3 text-left">Document</th>
                <th className="px-2 py-3 text-left">Type</th>
                <th className="px-2 py-3 text-left">Status</th>
                <th className="px-2 py-3 text-left">Tags</th>
                <th className="px-2 py-3 text-left">Uploaded</th>
                <th className="px-2 py-3 text-left">Size</th>
                <th className="px-2 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map(doc => (
                <tr 
                  key={doc.id}
                  className={`border-b hover:bg-muted/30 ${
                    selectedDocuments.includes(doc.id) ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="px-2 py-3">
                    <Checkbox
                      checked={selectedDocuments.includes(doc.id)}
                      onCheckedChange={() => toggleDocumentSelection(doc.id)}
                    />
                  </td>
                  <td className="px-2 py-3 font-medium">{doc.name}</td>
                  <td className="px-2 py-3">{doc.type}</td>
                  <td className="px-2 py-3">
                    <Badge 
                      variant={
                        doc.status === 'completed' ? 'default' : 
                        doc.status === 'processing' ? 'secondary' : 'destructive'
                      }
                    >
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{doc.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">{doc.uploadDate}</td>
                  <td className="px-2 py-3 text-sm">{doc.size}</td>
                  <td className="px-2 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <DownloadCloud className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          <span>Reprocess</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Tag className="mr-2 h-4 w-4" />
                          <span>Manage Tags</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="repository" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="repository">Document Repository</TabsTrigger>
          <TabsTrigger value="ai">AI Document Agent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="repository" className="space-y-6">
          {/* Search and filter bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="w-full sm:w-auto flex-1 max-w-md relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search documents..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                className={showFilters ? 'bg-secondary' : ''}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {Object.values(filters).some(f => Array.isArray(f) && f.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {[...filters.status, ...filters.tags, ...filters.types].length}
                  </Badge>
                )}
              </Button>
              
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </div>
          </div>
          
          {/* Filter panel */}
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Status filter */}
                    <div>
                      <h4 className="font-medium mb-3">Status</h4>
                      <div className="space-y-2">
                        {['completed', 'processing', 'error'].map(status => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`status-${status}`} 
                              checked={filters.status.includes(status)}
                              onCheckedChange={() => toggleFilter('status', status)}
                            />
                            <label 
                              htmlFor={`status-${status}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                            >
                              {status}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tags filter */}
                    <div>
                      <h4 className="font-medium mb-3">Tags</h4>
                      <div className="space-y-2">
                        {getAllTags().slice(0, 6).map(tag => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`tag-${tag}`} 
                              checked={filters.tags.includes(tag)}
                              onCheckedChange={() => toggleFilter('tags', tag)}
                            />
                            <label 
                              htmlFor={`tag-${tag}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {tag}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* File Type filter */}
                    <div>
                      <h4 className="font-medium mb-3">File Type</h4>
                      <div className="space-y-2">
                        {getAllTypes().map(type => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`type-${type}`} 
                              checked={filters.types.includes(type)}
                              onCheckedChange={() => toggleFilter('types', type)}
                            />
                            <label 
                              htmlFor={`type-${type}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="mr-2 h-4 w-4" /> Clear Filters
                    </Button>
                    <Button size="sm" onClick={() => setShowFilters(false)}>
                      <Check className="mr-2 h-4 w-4" /> Apply Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Selected actions */}
          {selectedDocuments.length > 0 && (
            <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{selectedDocuments.length} documents selected</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDocuments([])}>
                  Clear
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download All
                </Button>
                <Button size="sm" variant="outline">
                  <Tag className="mr-2 h-4 w-4" />
                  Add Tags
                </Button>
              </div>
            </div>
          )}
          
          {/* Document list */}
          {renderDocumentItems()}
          
          {/* Document upload modal */}
          {showUploadModal && (
            <DocumentUpload 
              onClose={() => setShowUploadModal(false)}
              onUploadComplete={handleUpload}
            />
          )}
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LyzrDocumentAgentChat />
            <div className="bg-muted/50 rounded-lg p-6 border flex flex-col justify-center space-y-6">
              <div>
                <h3 className="font-medium mb-3">What can Document Agent help you with?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                      <CheckSquare className="h-3 w-3 text-primary" />
                    </div>
                    <span>Analyze document content and extract key information</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                      <CheckSquare className="h-3 w-3 text-primary" />
                    </div>
                    <span>Compare data across multiple documents</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                      <CheckSquare className="h-3 w-3 text-primary" />
                    </div>
                    <span>Generate summaries and reports from document data</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                      <CheckSquare className="h-3 w-3 text-primary" />
                    </div>
                    <span>Answer questions about document content</span>
                  </li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Popular Document Questions</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2 px-3">
                    Summarize the key points in my Form 990
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2 px-3">
                    Compare financial data across quarterly statements
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2 px-3">
                    Extract all donation amounts from my records
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-6 mt-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Document Analytics</h3>
            </div>
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Documents</p>
                    <h4 className="text-2xl font-semibold mt-1">42</h4>
                  </div>
                  <div className="rounded-full p-2 bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={78} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-2">78% processed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Storage Used</p>
                    <h4 className="text-2xl font-semibold mt-1">3.8 GB</h4>
                  </div>
                  <div className="rounded-full p-2 bg-primary/10">
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={42} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-2">42% of 10GB limit</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Document Types</p>
                    <h4 className="text-2xl font-semibold mt-1">5 Types</h4>
                  </div>
                  <div className="rounded-full p-2 bg-primary/10">
                    <Files className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-xs">PDF (58%)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">XLSX (22%)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">Other (20%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-4">
            <History className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Recent Activity</h3>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{['AJ', 'SW', 'MC', 'AB', 'TK'][i % 5]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {['Alex Johnson', 'Sarah Williams', 'Michael Chen', 'Alex Brown', 'Terry Kim'][i % 5]} 
                          {' '}
                          {i === 1 
                            ? 'uploaded a new document' 
                            : i === 2 
                              ? 'updated tags on Form_990_2023_Draft.pdf'
                              : i === 3
                                ? 'downloaded Donation_Records_2023.csv'
                                : i === 4
                                  ? 'shared Financial_Statement_Q3_2023.xlsx'
                                  : 'added comments to Annual_Report_2022.pdf'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {['2 hours ago', '3 days ago', '1 week ago', '2 weeks ago', '1 month ago'][i % 5]}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentRepository;
