
import { toast } from 'sonner';

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  topics: string[];
  homepage: string | null;
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export interface GitHubDocument {
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
  clientNumber?: string;
  url: string;
  downloadUrl: string;
  metadata?: Record<string, any>;
}

export const fetchGitHubRepos = async (username: string = 'aswinaus'): Promise<GitHubRepo[]> => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub repositories: ${response.status}`);
    }
    
    const repos = await response.json();
    return repos as GitHubRepo[];
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    toast.error('Failed to load GitHub repositories');
    
    // Return empty array on error
    return [];
  }
};

export const fetchGitHubUserData = async (username: string = 'aswinaus') => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub user data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub user data:', error);
    toast.error('Failed to load GitHub user data');
    
    // Return null on error
    return null;
  }
};

export const fetchDocumentsFromGitHub = async (
  repo: string = 'docstorage',
  owner: string = 'aswinaus',
  path: string = 'uploads'
): Promise<GitHubDocument[]> => {
  try {
    // Get GitHub token from localStorage
    const token = localStorage.getItem('github_token');
    
    if (!token) {
      toast.error('GitHub token required to fetch documents');
      return [];
    }
    
    // Fetch files from the repository
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?per_page=100`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch files from GitHub: ${response.status}`);
    }
    
    const files = await response.json() as GitHubFile[];
    console.log(`Raw GitHub files fetched: ${files.length}`);
    
    // Filter out metadata files and process document files
    const documentFiles = files.filter(file => !file.name.endsWith('.metadata.json'));
    console.log(`Document files (excluding metadata): ${documentFiles.length}`);
    
    // Create an array to store documents with their metadata
    const documents: GitHubDocument[] = [];
    
    // Process each document file
    for (const file of documentFiles) {
      try {
        // Look for corresponding metadata file
        const metadataFileName = `${file.name}.metadata.json`;
        const metadataFileIndex = files.findIndex(f => f.name === metadataFileName);
        
        let metadata: Record<string, any> = {};
        
        // If metadata file exists, fetch and parse it
        if (metadataFileIndex !== -1) {
          const metadataFile = files[metadataFileIndex];
          const metadataResponse = await fetch(metadataFile.download_url);
          if (metadataResponse.ok) {
            metadata = await metadataResponse.json();
          }
        }
        
        // Parse filename to extract information
        // Expected format: YYYY-MM-DD_category_filename.ext
        const nameParts = file.name.split('_');
        let uploadDate = '';
        let category: GitHubDocument['category'] = 'other';
        
        if (nameParts.length >= 2 && nameParts[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
          uploadDate = nameParts[0];
          
          if (nameParts[1] === 'form990') {
            category = 'form990';
          } else if (nameParts[1] === 'financial') {
            category = 'financial';
          } else if (nameParts[1] === 'tax') {
            category = 'tax';
          }
        }
        
        // Get file extension for type
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        let fileType = fileExtension;
        
        if (fileExtension === 'pdf') {
          fileType = 'PDF';
        } else if (['xlsx', 'xls'].includes(fileExtension)) {
          fileType = 'Excel';
        } else if (['docx', 'doc'].includes(fileExtension)) {
          fileType = 'Word';
        } else if (['pptx', 'ppt'].includes(fileExtension)) {
          fileType = 'PowerPoint';
        }
        
        // Format size
        const sizeInKB = Math.round(file.size / 1024 * 10) / 10;
        const sizeInMB = Math.round(file.size / (1024 * 1024) * 10) / 10;
        const sizeStr = sizeInMB >= 1 ? `${sizeInMB} MB` : `${sizeInKB} KB`;
        
        // Create document object - ensure unique ID for each document
        const document: GitHubDocument = {
          id: file.sha, // This should be unique for each file in GitHub
          name: metadata.originalName || file.name,
          type: fileType,
          size: sizeStr,
          uploadedBy: metadata.uploadedBy || 'Aswin Bhaskaran',
          uploadDate: metadata.uploadDate || uploadDate || new Date().toISOString(),
          isArchived: metadata.isArchived || false,
          category: metadata.category || category,
          jurisdiction: metadata.jurisdiction || 'United States',
          serviceLine: metadata.serviceLine || 'Tax',
          recordType: metadata.recordType || 'Document',
          entity: metadata.entity || 'Corporate',
          clientApproved: metadata.clientApproved === true || false,
          clientContact: metadata.clientContact || 'Aswin Bhaskaran',
          client: metadata.client || 'Client',
          clientNumber: metadata.clientNumber || '',
          url: file.html_url,
          downloadUrl: file.download_url,
          metadata
        };
        
        documents.push(document);
        console.log(`Processed document: ${document.name} (${document.id})`);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        // Continue with next file if there's an error with the current one
      }
    }
    
    // Sort documents by upload date (newest first)
    documents.sort((a, b) => {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    });
    
    // Log the number of documents for debugging
    console.log(`Fetched ${documents.length} documents from GitHub`);
    
    return documents;
  } catch (error) {
    console.error('Error fetching documents from GitHub:', error);
    toast.error('Failed to load documents from GitHub repository');
    return [];
  }
};

// GitHub API requires a personal access token to upload files
// This function uploads a file to the specified GitHub repository
export const uploadToGitHub = async (
  file: File, 
  metadata: Record<string, any>, 
  repo: string = 'docstorage', 
  owner: string = 'aswinaus'
): Promise<{ success: boolean; url?: string; message?: string }> => {
  try {
    // Convert file to base64
    const base64Content = await fileToBase64(file);
    
    // Get the current date for the commit message
    const date = new Date().toISOString().split('T')[0];
    
    // Create a filename that includes metadata to make it searchable
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `uploads/${date}_${metadata.category}_${safeFileName}`;

    // Add metadata as JSON file for better searchability
    const metadataContent = JSON.stringify({
      ...metadata,
      originalName: file.name,
      uploadDate: new Date().toISOString(),
      size: file.size,
      type: file.type
    }, null, 2);
    
    // The GitHub API endpoint
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const metadataUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}.metadata.json`;
    
    // This should be replaced with a secure method of getting the token
    // For demo purposes we'll use localStorage
    const token = localStorage.getItem('github_token');
    
    if (!token) {
      toast.error('GitHub personal access token is required');
      return { 
        success: false, 
        message: 'GitHub token not found. Please provide a token in the settings.'
      };
    }

    // Upload the file
    const fileResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload ${file.name} via Document Repository`,
        content: base64Content,
        branch: 'main'
      })
    });

    if (!fileResponse.ok) {
      const errorData = await fileResponse.json();
      throw new Error(`GitHub API error: ${errorData.message}`);
    }

    // Upload the metadata file
    const metadataResponse = await fetch(metadataUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload metadata for ${file.name}`,
        content: btoa(metadataContent),
        branch: 'main'
      })
    });

    if (!metadataResponse.ok) {
      const errorData = await metadataResponse.json();
      console.error('Metadata upload failed but file was uploaded:', errorData);
    }

    const fileData = await fileResponse.json();
    
    return { 
      success: true, 
      url: fileData.content.html_url,
      message: 'File uploaded successfully to GitHub'
    };
  } catch (error) {
    console.error('Error uploading to GitHub:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};
