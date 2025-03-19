
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
