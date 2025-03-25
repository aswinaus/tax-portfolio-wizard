
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
