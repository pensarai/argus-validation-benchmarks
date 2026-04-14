import React, { useState, useCallback } from 'react';
import { FileUploadSchema } from '@app/shared-types';
import { apiClient } from '../api/client';

interface FileUploadProps {
  projectId: string;
  onUploadComplete?: () => void;
}

export default function FileUpload({ projectId, onUploadComplete }: FileUploadProps): React.ReactElement {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleUpload(files[0]);
  }, [projectId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleUpload(files[0]);
  };

  const handleUpload = async (file: File) => {
    setError(null);
    const validation = FileUploadSchema.safeParse({
      name: file.name,
      mimeType: file.type,
      size: file.size,
      projectId,
    });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await apiClient.post(`/api/projects/${projectId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => setProgress(Math.round((p.loaded / (p.total || 1)) * 100)),
      });
      onUploadComplete?.();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className={`file-upload ${isDragging ? 'dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}>
      <input type="file" onChange={handleFileSelect} id="file-input" hidden />
      <label htmlFor="file-input" className="upload-label">
        {uploading ? `Uploading... ${progress}%` : 'Drop files here or click to upload'}
      </label>
      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}
