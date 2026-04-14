import { z } from 'zod';

/**
 * Task-related Zod schemas.
 * Tasks belong to projects and can be assigned to users.
 */

const taskStatusEnum = z.enum(['todo', 'in_progress', 'in_review', 'done', 'cancelled'], {
  errorMap: () => ({ message: 'Invalid task status' }),
});

const taskPriorityEnum = z.enum(['low', 'medium', 'high', 'critical'], {
  errorMap: () => ({ message: 'Priority must be low, medium, high, or critical' }),
});

export const TaskCreateSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(500).trim(),
  description: z.string().max(10000).optional(),
  priority: taskPriorityEnum.default('medium'),
  assigneeId: z.string().uuid('Must be a valid user ID').optional(),
  projectId: z.string().uuid('Must be a valid project ID'),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string().min(1).max(50).trim()).max(20).optional(),
  position: z.number().int().min(0).optional(),
  estimatedHours: z.number().min(0).max(999).optional(),
}).refine(
  (data) => {
    // Critical priority tasks require a description
    if (data.priority === 'critical' && (!data.description || data.description.length < 10)) {
      return false;
    }
    return true;
  },
  { message: 'Critical priority tasks require a description of at least 10 characters', path: ['description'] }
);

export const TaskUpdateSchema = z.object({
  title: z.string().min(1).max(500).trim().optional(),
  description: z.string().max(10000).optional(),
  priority: taskPriorityEnum.optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  tags: z.array(z.string().min(1).max(50).trim()).max(20).optional(),
  position: z.number().int().min(0).optional(),
  estimatedHours: z.number().min(0).max(999).nullable().optional(),
});

// Valid status transitions
const validTransitions: Record<string, string[]> = {
  todo: ['in_progress', 'cancelled'],
  in_progress: ['in_review', 'todo', 'cancelled'],
  in_review: ['done', 'in_progress', 'cancelled'],
  done: ['in_progress'],
  cancelled: ['todo'],
};

export const TaskStatusChangeSchema = z.object({
  status: taskStatusEnum,
  comment: z.string().max(500).optional(),
}).refine(
  (data) => {
    // Status transition validation happens at service layer where current status is known
    return taskStatusEnum.safeParse(data.status).success;
  },
  { message: 'Invalid task status' }
);

export { validTransitions as taskStatusTransitions };

export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
export type TaskStatusChange = z.infer<typeof TaskStatusChangeSchema>;
