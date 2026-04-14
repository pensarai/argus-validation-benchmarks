import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validation';
import {
  TaskCreateSchema,
  TaskUpdateSchema,
  TaskStatusChangeSchema,
  CommentCreateSchema,
  PaginationSchema,
  AppError,
} from '@app/shared-types';
import { taskService } from '../services/taskService';
import { logger } from '../utils/logger';

const router = Router();

// POST /api/projects/:projectId/tasks -- Create task within project
router.post(
  '/projects/:projectId',
  validate(TaskCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    const task = await taskService.create({
      ...req.body,
      projectId: req.params.projectId,
      creatorId: req.user!.id,
    });

    logger.info('Task created', { taskId: task.id, projectId: req.params.projectId });
    res.status(201).json({ data: task });
  }
);

// GET /api/projects/:projectId/tasks -- List tasks by project with filtering
router.get(
  '/projects/:projectId',
  async (req: AuthenticatedRequest, res: Response) => {
    const filters: Record<string, unknown> = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.assigneeId) filters.assigneeId = req.query.assigneeId;
    if (req.query.dueDateFrom) filters.dueDateFrom = req.query.dueDateFrom;
    if (req.query.dueDateTo) filters.dueDateTo = req.query.dueDateTo;
    if (req.query.tags) filters.tags = (req.query.tags as string).split(',');

    const sortBy = (req.query.sortBy as string) || 'position';
    const sortOrder = (req.query.sortOrder as string) || 'asc';
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const tasks = await taskService.listByProject(req.params.projectId, {
      filters,
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    res.json({ data: tasks });
  }
);

// GET /api/tasks/:id -- Get task by ID
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const task = await taskService.findById(req.params.id);
  if (!task) {
    throw new AppError('Task not found', 404, 'NOT_FOUND');
  }
  res.json({ data: task });
});

// PUT /api/tasks/:id -- Update task
router.put(
  '/:id',
  validate(TaskUpdateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    const task = await taskService.findById(req.params.id);
    if (!task) {
      throw new AppError('Task not found', 404, 'NOT_FOUND');
    }

    const updated = await taskService.update(req.params.id, req.body);
    logger.info('Task updated', { taskId: req.params.id, userId: req.user!.id });
    res.json({ data: updated });
  }
);

// PATCH /api/tasks/:id/status -- Update task status
router.patch(
  '/:id/status',
  validate(TaskStatusChangeSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    const task = await taskService.findById(req.params.id);
    if (!task) {
      throw new AppError('Task not found', 404, 'NOT_FOUND');
    }

    const updated = await taskService.updateStatus(
      req.params.id,
      task.status,
      req.body.status,
      req.user!.id,
      req.body.comment
    );
    logger.info('Task status updated', {
      taskId: req.params.id,
      from: task.status,
      to: req.body.status,
    });
    res.json({ data: updated });
  }
);

// POST /api/tasks/:id/comments -- Add comment to task
router.post(
  '/:id/comments',
  validate(CommentCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    const task = await taskService.findById(req.params.id);
    if (!task) {
      throw new AppError('Task not found', 404, 'NOT_FOUND');
    }

    const comment = await taskService.addComment({
      content: req.body.content,
      taskId: req.params.id,
      authorId: req.user!.id,
      parentId: req.body.parentId,
    });

    logger.info('Comment added', { taskId: req.params.id, commentId: comment.id });
    res.status(201).json({ data: comment });
  }
);

export default router;
