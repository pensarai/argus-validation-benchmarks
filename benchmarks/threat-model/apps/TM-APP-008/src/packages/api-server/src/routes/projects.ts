import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { ProjectCreateSchema, ProjectUpdateSchema, AppError } from '@app/shared-types';
import { projectService } from '../services/projectService';
import { logger } from '../utils/logger';
import multer from 'multer';
import path from 'path';

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

const router = Router();

// POST /api/organizations/:orgId/projects -- Create project within organization
router.post(
  '/organizations/:orgId',
  validate(ProjectCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    const project = await projectService.create({
      ...req.body,
      organizationId: req.params.orgId,
    });
    logger.info('Project created', { projectId: project.id, orgId: req.params.orgId });
    res.status(201).json({ data: project });
  }
);

// GET /api/organizations/:orgId/projects -- List projects by organization
router.get(
  '/organizations/:orgId',
  async (req: AuthenticatedRequest, res: Response) => {
    const projects = await projectService.listByOrganization(req.params.orgId, {
      status: req.query.status as string | undefined,
      limit: Number(req.query.limit) || 20,
      offset: Number(req.query.offset) || 0,
    });
    res.json({ data: projects });
  }
);

// GET /api/projects/:id -- Get project by ID
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const project = await projectService.findById(req.params.id);
  if (!project) {
    throw new AppError('Project not found', 404, 'NOT_FOUND');
  }
  res.json({ data: project });
});

// PUT /api/projects/:id -- Update project
router.put(
  '/:id',
  validate(ProjectUpdateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    const project = await projectService.findById(req.params.id);
    if (!project) {
      throw new AppError('Project not found', 404, 'NOT_FOUND');
    }

    const updated = await projectService.update(req.params.id, req.body);
    logger.info('Project updated', { projectId: req.params.id, userId: req.user!.id });
    res.json({ data: updated });
  }
);

// DELETE /api/projects/:id -- Delete project
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const project = await projectService.findById(req.params.id);
  if (!project) {
    throw new AppError('Project not found', 404, 'NOT_FOUND');
  }

  await projectService.delete(req.params.id);
  logger.info('Project deleted', { projectId: req.params.id, userId: req.user!.id });
  res.status(204).end();
});

// POST /api/projects/:id/files -- Upload file to project
router.post(
  '/:id/files',
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400, 'NO_FILE');
    }

    const fileRecord = await projectService.addFile(req.params.id, {
      name: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user!.id,
    });

    logger.info('File uploaded', { projectId: req.params.id, fileName: req.file.originalname });
    res.status(201).json({ data: fileRecord });
  }
);

export default router;
