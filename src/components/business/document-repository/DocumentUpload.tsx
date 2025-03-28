import { useState, useEffect } from 'react';
import { Upload, X, FileText, File as FileIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { uploadToGitHub } from "@/services/githubService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DocumentUploadProps {
  onUploadComplete: (fileDetails: {
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadDate: string;
    metadata: DocumentMetadata;
    githubUrl?: string;
  }) => void;
  onClose: () => void;
}

interface DocumentMetadata {
  jurisdiction: string;
  serviceLine: string;
  entity: string;
  clientApproved: string;
  client: string;
  clientNumber: string;
  category: string;
}

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
  serviceLine: z.string().min(1, "Service Line is required"),
  entity: z.string().optional(),
  clientApproved: z.enum(["yes", "no"], {
    required_error: "Please select if client approved",
  }),
  client: z.string().optional(),
  clientNumber: z.string().optional(),
});

const settingsSchema = z.object({
  githubToken: z.string().min(1, "GitHub token is required")
});

const DocumentUpload = ({ onUploadComplete, onClose }: DocumentUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [githubToken, setGithubToken] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const { toast: uiToast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "form990",
      jurisdiction: "",
      serviceLine: "",
      entity: "",
      clientApproved: "no",
      client: "",
      clientNumber: "",
    },
  });

  const settingsForm = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      githubToken: ""
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('github_token');
    if (token) {
      setGithubToken(token);
      settingsForm.setValue('githubToken', token);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      const validFiles = fileArray.filter(file => file.size <= 10 * 1024 * 1024);
      const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        uiToast({
          title: "Files too large",
          description: `${oversizedFiles.length} file(s) exceed the 10MB limit and were not added.`,
          variant: "destructive",
        });
      }
      
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    const extension = fileType.split('/')[1];
    if (extension === 'pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (['excel', 'spreadsheet', 'sheet', 'xlsx', 'xls'].includes(extension) || 
               fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileText className="h-5 w-5 text-green-600" />;
    } else if (['word', 'document', 'doc', 'docx'].includes(extension) || 
               fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
    return <FileIcon className="h-5 w-5 text-gray-600" />;
  };

  const saveSettings = (data: z.infer<typeof settingsSchema>) => {
    localStorage.setItem('github_token', data.githubToken);
    setGithubToken(data.githubToken);
    toast.success('GitHub token saved successfully');
    setShowSettings(false);
  };

  const uploadFiles = async (formData: z.infer<typeof formSchema>) => {
    if (selectedFiles.length === 0) return;
    
    if (!githubToken) {
      uiToast({
        title: "GitHub token required",
        description: "Please set your GitHub token in settings before uploading.",
        variant: "destructive",
      });
      setShowSettings(true);
      return;
    }
    
    setUploading(true);
    toast.loading(`Uploading ${selectedFiles.length} document(s)...`);

    try {
      for (const file of selectedFiles) {
        const metadata: DocumentMetadata = {
          jurisdiction: formData.jurisdiction,
          serviceLine: formData.serviceLine,
          entity: formData.entity || "",
          clientApproved: formData.clientApproved,
          client: formData.client || "",
          clientNumber: formData.clientNumber || "",
          category: formData.category,
        };
        
        const uploadResult = await uploadToGitHub(file, metadata);
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.message || 'Failed to upload to GitHub');
        }
        
        onUploadComplete({
          name: file.name,
          type: file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') 
            ? 'Excel' 
            : file.type.includes('pdf') || file.name.endsWith('.pdf') 
              ? 'PDF' 
              : file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx') 
                ? 'Word' 
                : file.name.endsWith('.pptx') || file.name.endsWith('.ppt') 
                  ? 'PowerPoint' 
                  : 'Other',
          size: formatFileSize(file.size),
          uploadedBy: 'Aswin Bhaskaran',
          uploadDate: new Date().toISOString(),
          metadata,
          githubUrl: uploadResult.url,
        });
      }

      toast.success(`Successfully uploaded ${selectedFiles.length} document(s) to GitHub`);
      
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred while uploading files.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const fileArray = Array.from(e.dataTransfer.files);
      
      const validFiles = fileArray.filter(file => file.size <= 10 * 1024 * 1024);
      const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        uiToast({
          title: "Files too large",
          description: `${oversizedFiles.length} file(s) exceed the 10MB limit and were not added.`,
          variant: "destructive",
        });
      }
      
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Upload to GitHub Repository</h2>
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              GitHub Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>GitHub Settings</DialogTitle>
              <DialogDescription>
                Set your GitHub personal access token to enable document uploads.
                The token needs permissions for repository content.
              </DialogDescription>
            </DialogHeader>
            <Form {...settingsForm}>
              <form onSubmit={settingsForm.handleSubmit(saveSettings)} className="space-y-4">
                <FormField
                  control={settingsForm.control}
                  name="githubToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Personal Access Token</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your GitHub token" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Save Settings</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div 
        className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
        onClick={() => document.getElementById('file-upload')?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-primary/60" />
        <p className="text-sm font-medium">Drag and drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Maximum file size: 10MB</p>
        <input 
          type="file" 
          id="file-upload" 
          multiple 
          className="hidden" 
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
        />
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="border rounded-md p-4 space-y-3">
          <h3 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary/30 p-2 rounded-md">
                <div className="flex items-center gap-2 overflow-hidden">
                  {getFileIcon(file.type)}
                  <div className="truncate">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(uploadFiles)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="form990">Form 990</SelectItem>
                      <SelectItem value="financial">Financial Data</SelectItem>
                      <SelectItem value="tax">Tax Documents</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jurisdiction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jurisdiction</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="australia">Australia</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="denmark">Denmark</SelectItem>
                      <SelectItem value="germany">Germany</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="norway">Norway</SelectItem>
                      <SelectItem value="sweden">Sweden</SelectItem>
                      <SelectItem value="united_kingdom">United Kingdom</SelectItem>
                      <SelectItem value="united_states">United States</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceLine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Line</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service line" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tax">Tax</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                      <SelectItem value="advisory">Advisory</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter entity name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="clientApproved"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Client Approved</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={uploading} type="button">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={selectedFiles.length === 0 || uploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {uploading ? (
                <>Uploading to GitHub...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload to GitHub
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DocumentUpload;
