
import { useState } from 'react';
import { Upload, X, FileText, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onUploadComplete: (fileDetails: {
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadDate: string;
  }) => void;
  onClose: () => void;
}

const AZURE_BLOB_STORAGE_URL = "https://aswinaitaxdocs.blob.core.windows.net/general?sp=racwdl&st=2025-03-25T00:37:28Z&se=2026-03-25T08:37:28Z&spr=https&sv=2024-11-04&sr=c&sig=NG6mtoZ%2BvGDj6iWrGnemO%2B3LgpL5I6hY5NWMQL7gMV0%3D";

const DocumentUpload = ({ onUploadComplete, onClose }: DocumentUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<string>('form990');
  const { toast } = useToast();

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

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    toast({
      title: "Upload started",
      description: `Uploading ${selectedFiles.length} document(s)...`,
    });

    try {
      // Upload each file to Azure Blob Storage
      for (const file of selectedFiles) {
        const blockBlobClient = new URL(AZURE_BLOB_STORAGE_URL);
        blockBlobClient.pathname = `/general/${file.name}`;
        
        const response = await fetch(blockBlobClient.toString(), {
          method: 'PUT',
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
        });
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
      
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">Category</div>
        <select 
          className="border rounded-md p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="form990">Form 990</option>
          <option value="financial">Financial Data</option>
          <option value="tax">Tax Documents</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button 
          onClick={uploadFiles} 
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
    </div>
  );
};

export default DocumentUpload;
