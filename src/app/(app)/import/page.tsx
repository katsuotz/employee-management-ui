'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload, FileText, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { importApiService, ImportResponse, ImportProgress } from '@/services/importApiService';
import { toast } from 'sonner';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importResponse, setImportResponse] = useState<ImportResponse | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [polling, setPolling] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
      setImportResponse(null);
      setImportProgress(null);
    }
  }, []);

  // Handle file upload
  const handleUpload = useCallback(async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      const response = await importApiService.uploadCSV(file);
      setImportResponse(response);
      
      toast.success('File uploaded successfully! Import started.');
      
      // Show progress modal and start polling
      setShowProgressModal(true);
      startPolling(response.jobId);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [file]);

  // Start polling for import progress
  const startPolling = useCallback((jobId: string) => {
    setPolling(true);
    
    const pollProgress = async () => {
      try {
        const progress = await importApiService.getImportStatus(jobId);
        setImportProgress(progress);

        // Stop polling if import is completed or failed
        if (progress.status === 'completed' || progress.status === 'failed') {
          setPolling(false);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          if (progress.status === 'completed') {
            toast.success(`Import completed! ${progress.processed} employees processed successfully.`);
            // Close modal after a short delay to show completion
          } else {
            toast.error(`Import failed! ${progress.error || 'Unknown error occurred'}`);
            // Close modal on error
            setShowProgressModal(false);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        // Don't show toast for polling errors to avoid spam
      }
    };

    // Initial poll
    pollProgress();

    // Set up interval for polling every 2 seconds
    pollingIntervalRef.current = setInterval(pollProgress, 1000);
  }, []);

  // Stop polling
  const stopPolling = useCallback(() => {
    setPolling(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Cleanup polling on unmount
  React.useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Get status text
  const getStatusText = () => {
    if (!importProgress) return '';
    
    switch (importProgress.status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing...';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import Employees</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Click to upload CSV file
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  CSV files up to 10MB
                </span>
              </label>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            {file && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading || polling}
              className="w-full max-w-xs"
            >
              {uploading ? 'Uploading...' : 'Import Employees'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Dialog */}
      <Dialog 
        open={showProgressModal} 
        onOpenChange={(open) => {
          // Prevent closing during processing
          if (importProgress?.status === 'processing') {
            return;
          }
          setShowProgressModal(open);
        }}
      >
        <DialogContent 
          hideCloseButton={true}
          onInteractOutside={(e) => {
            // Prevent closing on outside click during processing
            if (importProgress?.status === 'processing') {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            // Prevent closing on escape key during processing
            if (importProgress?.status === 'processing') {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Importing Employees</span>
            </DialogTitle>
          </DialogHeader>

          {importProgress && (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{importProgress.progress.toFixed(1)}%</span>
                  <span className="text-gray-600">{getStatusText()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Processed:</span>{' '}
                  {importProgress.processed} records
                </div>
                <div>
                  <span className="font-medium">Total:</span>{' '}
                  {importProgress.totalBatches} records
                </div>
              </div>

              {/* Error Message */}
              {importProgress.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {importProgress.error}
                </div>
              )}

              {/* Close button for completed/failed status */}
              {(importProgress.status === 'completed' || importProgress.status === 'failed') && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowProgressModal(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
