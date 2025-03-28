
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DocumentUpload from '../DocumentUpload';
import * as githubService from '@/services/githubService';

// Mock the GitHub services
jest.mock('@/services/githubService', () => ({
  uploadToGitHub: jest.fn(),
}));

// Mock toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('DocumentUpload Component', () => {
  const mockOnUploadComplete = jest.fn();
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-github-token');
  });
  
  test('renders upload form correctly', () => {
    render(<DocumentUpload onUploadComplete={mockOnUploadComplete} onClose={mockOnClose} />);
    
    // Check if the main elements are rendered
    expect(screen.getByText('Upload to GitHub Repository')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop files here or click to browse')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /GitHub Settings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload to GitHub/i })).toBeDisabled(); // Should be disabled with no files selected
  });
  
  test('displays GitHub settings dialog when clicked', async () => {
    render(<DocumentUpload onUploadComplete={mockOnUploadComplete} onClose={mockOnClose} />);
    
    const settingsButton = screen.getByRole('button', { name: /GitHub Settings/i });
    await userEvent.click(settingsButton);
    
    expect(screen.getByText('GitHub Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('GitHub Personal Access Token')).toBeInTheDocument();
  });
  
  test('validates form fields properly', async () => {
    render(<DocumentUpload onUploadComplete={mockOnUploadComplete} onClose={mockOnClose} />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const inputEl = screen.getByTestId('file-upload') || document.querySelector('#file-upload');
    
    // Simulate file selection
    if (inputEl) {
      await userEvent.upload(inputEl, file);
    }
    
    // Try to submit with missing required fields
    const uploadButton = screen.getByRole('button', { name: /Upload to GitHub/i });
    await userEvent.click(uploadButton);
    
    // It should display validation errors
    await waitFor(() => {
      expect(screen.getByText('Jurisdiction is required')).toBeInTheDocument();
      expect(screen.getByText('Service Line is required')).toBeInTheDocument();
    });
  });
  
  test('handles file selection and removal', async () => {
    render(<DocumentUpload onUploadComplete={mockOnUploadComplete} onClose={mockOnClose} />);
    
    // Create mock files
    const file1 = new File(['content1'], 'test1.pdf', { type: 'application/pdf' });
    const file2 = new File(['content2'], 'test2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const inputEl = screen.getByTestId('file-upload') || document.querySelector('#file-upload');
    
    // Simulate file selection
    if (inputEl) {
      await userEvent.upload(inputEl, [file1, file2]);
    }
    
    // Check if files are displayed
    await waitFor(() => {
      expect(screen.getByText('test1.pdf')).toBeInTheDocument();
      expect(screen.getByText('test2.xlsx')).toBeInTheDocument();
    });
    
    // Remove one file
    const removeButtons = screen.getAllByRole('button', { name: '' }); // The X buttons don't have text
    await userEvent.click(removeButtons[0]);
    
    // Check if file was removed
    await waitFor(() => {
      expect(screen.queryByText('test1.pdf')).not.toBeInTheDocument();
      expect(screen.getByText('test2.xlsx')).toBeInTheDocument();
    });
  });
  
  test('uploads files successfully', async () => {
    // Mock the GitHub upload response
    (githubService.uploadToGitHub as jest.Mock).mockResolvedValue({
      success: true,
      url: 'https://github.com/aswinaus/repo/test.pdf',
      message: 'File uploaded successfully'
    });
    
    render(<DocumentUpload onUploadComplete={mockOnUploadComplete} onClose={mockOnClose} />);
    
    // Create a mock file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const inputEl = screen.getByTestId('file-upload') || document.querySelector('#file-upload');
    
    // Simulate file selection
    if (inputEl) {
      await userEvent.upload(inputEl, file);
    }
    
    // Fill required form fields
    await userEvent.click(screen.getByRole('button', { name: /jurisdiction/i, hidden: true }));
    await userEvent.click(screen.getByRole('option', { name: 'United States' }));
    
    await userEvent.click(screen.getByRole('button', { name: /service line/i, hidden: true }));
    await userEvent.click(screen.getByRole('option', { name: 'Tax' }));
    
    // Submit the form
    const uploadButton = screen.getByRole('button', { name: /Upload to GitHub/i });
    await userEvent.click(uploadButton);
    
    // Verify upload was called with correct parameters
    await waitFor(() => {
      expect(githubService.uploadToGitHub).toHaveBeenCalledWith(
        file,
        expect.objectContaining({
          jurisdiction: 'united_states',
          serviceLine: 'tax',
          category: 'form990'
        }),
        'docstorage',
        'aswinaus'
      );
      expect(mockOnUploadComplete).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
  
  test('handles upload errors', async () => {
    // Mock an upload failure
    (githubService.uploadToGitHub as jest.Mock).mockResolvedValue({
      success: false,
      message: 'GitHub API error'
    });
    
    render(<DocumentUpload onUploadComplete={mockOnUploadComplete} onClose={mockOnClose} />);
    
    // Create a mock file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const inputEl = screen.getByTestId('file-upload') || document.querySelector('#file-upload');
    
    // Simulate file selection
    if (inputEl) {
      await userEvent.upload(inputEl, file);
    }
    
    // Fill required form fields
    await userEvent.click(screen.getByRole('button', { name: /jurisdiction/i, hidden: true }));
    await userEvent.click(screen.getByRole('option', { name: 'United States' }));
    
    await userEvent.click(screen.getByRole('button', { name: /service line/i, hidden: true }));
    await userEvent.click(screen.getByRole('option', { name: 'Tax' }));
    
    // Submit the form
    const uploadButton = screen.getByRole('button', { name: /Upload to GitHub/i });
    await userEvent.click(uploadButton);
    
    // Verify error handling
    await waitFor(() => {
      expect(githubService.uploadToGitHub).toHaveBeenCalled();
      expect(mockOnUploadComplete).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
  
  test('validates GitHub token before upload', async () => {
    // Mock localStorage to return null for github_token
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<DocumentUpload onUploadComplete={mockOnUploadComplete} onClose={mockOnClose} />);
    
    // Create a mock file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const inputEl = screen.getByTestId('file-upload') || document.querySelector('#file-upload');
    
    // Simulate file selection
    if (inputEl) {
      await userEvent.upload(inputEl, file);
    }
    
    // Fill required form fields
    await userEvent.click(screen.getByRole('button', { name: /jurisdiction/i, hidden: true }));
    await userEvent.click(screen.getByRole('option', { name: 'United States' }));
    
    await userEvent.click(screen.getByRole('button', { name: /service line/i, hidden: true }));
    await userEvent.click(screen.getByRole('option', { name: 'Tax' }));
    
    // Submit the form
    const uploadButton = screen.getByRole('button', { name: /Upload to GitHub/i });
    await userEvent.click(uploadButton);
    
    // It should prompt for GitHub token instead of uploading
    await waitFor(() => {
      expect(githubService.uploadToGitHub).not.toHaveBeenCalled();
      // Should show the settings dialog
      expect(screen.getByText('GitHub Settings')).toBeInTheDocument();
    });
  });
});
