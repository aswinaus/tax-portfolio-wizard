
import { useState } from 'react';
import { Upload, X, FileText, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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

interface DocumentUploadProps {
  onUploadComplete: (fileDetails: {
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadDate: string;
    metadata: DocumentMetadata;
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

// Using a mock API for development since actual Azure connection is failing
const useMockUpload = true;

// Validation schema for the form
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

const DocumentUpload = ({ onUploadComplete, onClose }: DocumentUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Initialize the form
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Filter out files larger than 10MB
      const validFiles = fileArray.filter(file => file.size <= 10 * 1024 * 1024);
      const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        toast({
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

  const uploadFiles = async (formData: z.infer<typeof formSchema>) => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    toast({
      title: "Upload started",
      description: `Uploading ${selectedFiles.length} document(s)...`,
    });

    try {
      for (const file of selectedFiles) {
        // If we're in mock mode, simulate a successful upload
        if (useMockUpload) {
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          console.log(`Mock upload complete for ${file.name}`);
          
          // Extract metadata from form
          const metadata: DocumentMetadata = {
            jurisdiction: formData.jurisdiction,
            serviceLine: formData.serviceLine,
            entity: formData.entity || "",
            clientApproved: formData.clientApproved,
            client: formData.client || "",
            clientNumber: formData.clientNumber || "",
            category: formData.category,
          };
          
          // Notify parent of "successful" upload
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
          });
        } else {
          // Real implementation (currently failing due to CORS or network issues)
          // This code is preserved for when the Azure connection is fixed
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('https://aswinaitaxdocs.blob.core.windows.net/general', {
            method: 'POST',
            headers: {
              'x-ms-blob-type': 'BlockBlob',
              'Content-Type': file.type,
            },
            body: file,
          });

          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}: ${response.statusText}`);
          }

          // For each successful upload, notify the parent component
          // We'd include metadata here too in a real implementation
        }
      }

      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${selectedFiles.length} document(s)`,
      });
      
      // Clear the selected files and close the dialog
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred while uploading files.",
        variant: "destructive",
      });
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
      
      // Filter out files larger than 10MB
      const validFiles = fileArray.filter(file => file.size <= 10 * 1024 * 1024);
      const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        toast({
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
            {/* Category Field */}
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

            {/* Jurisdiction Field */}
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
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="federal">Federal</SelectItem>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Service Line Field */}
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

            {/* Entity Field */}
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

            {/* Client Field */}
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

            {/* Client Number Field */}
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

          {/* Client Approved Radio Group */}
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
            >
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
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
