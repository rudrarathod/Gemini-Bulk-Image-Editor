
export interface ImageResult {
  id: string;
  originalFile: File;
  originalUrl: string;
  editedUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}
