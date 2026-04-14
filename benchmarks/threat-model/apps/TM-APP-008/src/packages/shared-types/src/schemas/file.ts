import { z } from 'zod';

/**
 * File upload schema.
 * Validates file metadata before upload processing.
 */

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FileUploadSchema = z.object({
  name: z.string().min(1, 'File name is required').max(255),
  mimeType: z.enum(ALLOWED_MIME_TYPES, {
    errorMap: () => ({ message: 'File type not allowed. Supported: images, PDF, Word, text, CSV' }),
  }),
  size: z.number().int().min(1).max(MAX_FILE_SIZE, `File size must not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`),
  projectId: z.string().uuid('Must be a valid project ID'),
});

export type FileUpload = z.infer<typeof FileUploadSchema>;
export { ALLOWED_MIME_TYPES, MAX_FILE_SIZE };
