import { api } from '@/lib/api';

export interface ImportResponse {
  jobId: string;
  totalRows: number;
  totalBatches: number;
  batchSize: number;
}

export interface ImportProgress {
  progress: number;
  processed: number;
  totalBatches: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error: string | null;
  createdAt: string;
  lastUpdated: string;
}

export const importApiService = {
  // Upload CSV file for import
  uploadCSV: async (file: File): Promise<ImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    // Use api client with custom config for multipart form data
    return api.post<ImportResponse>('/import/employees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get import progress/status
  getImportStatus: async (jobId: string): Promise<ImportProgress> => {
    return api.get<ImportProgress>(`/import/status/${jobId}`);
  },
};
