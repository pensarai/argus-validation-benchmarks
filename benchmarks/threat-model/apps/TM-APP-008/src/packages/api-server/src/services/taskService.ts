import { PrismaClient } from '@prisma/client';
import { AppError } from '@app/shared-types';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Valid status transitions
const validTransitions: Record<string, string[]> = {
  todo: ['in_progress', 'cancelled'],
  in_progress: ['in_review', 'todo', 'cancelled'],
  in_review: ['done', 'in_progress', 'cancelled'],
  done: ['in_progress'],
  cancelled: ['todo'],
};

class TaskService {
  async create(data: {
    title: string;
    description?: string;
    priority?: string;
    assigneeId?: string;
    projectId: string;
    creatorId: string;
    dueDate?: string;
    tags?: string[];
    position?: number;
  }) {
    const maxPosition = await prisma.task.findFirst({
      where: { projectId: data.projectId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        priority: data.priority || 'medium',
        assigneeId: data.assigneeId || null,
        projectId: data.projectId,
        creatorId: data.creatorId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        tags: data.tags || [],
        position: data.position ?? (maxPosition ? maxPosition.position + 1 : 0),
        status: 'todo',
      },
      include: {
        assignee: { select: { id: true, name: true, avatarUrl: true } },
        creator: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, avatarUrl: true } },
        creator: { select: { id: true, name: true, avatarUrl: true } },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
    });
  }

  async listByProject(projectId: string, options: {
    filters: Record<string, unknown>;
    sortBy: string;
    sortOrder: string;
    limit: number;
    offset: number;
  }) {
    const where: any = { projectId };

    if (options.filters.status) where.status = options.filters.status;
    if (options.filters.priority) where.priority = options.filters.priority;
    if (options.filters.assigneeId) where.assigneeId = options.filters.assigneeId;
    if (options.filters.tags) where.tags = { hasSome: options.filters.tags as string[] };
    if (options.filters.dueDateFrom || options.filters.dueDateTo) {
      where.dueDate = {};
      if (options.filters.dueDateFrom) where.dueDate.gte = new Date(options.filters.dueDateFrom as string);
      if (options.filters.dueDateTo) where.dueDate.lte = new Date(options.filters.dueDateTo as string);
    }

    const orderBy: any = { [options.sortBy]: options.sortOrder };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        take: options.limit,
        skip: options.offset,
        orderBy,
        include: {
          assignee: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return { items: tasks, total, limit: options.limit, offset: options.offset };
  }

  async update(id: string, data: Record<string, unknown>) {
    return prisma.task.update({
      where: { id },
      data: { ...data, updatedAt: new Date() } as any,
    });
  }

  async updateStatus(id: string, currentStatus: string, newStatus: string, userId: string, comment?: string) {
    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new AppError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        400,
        'INVALID_STATUS_TRANSITION'
      );
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { status: newStatus, updatedAt: new Date() },
    });

    if (comment) {
      await prisma.comment.create({
        data: {
          content: `Status changed to ${newStatus}. ${comment}`,
          taskId: id,
          authorId: userId,
        },
      });
    }

    logger.info('Task status changed', { taskId: id, from: currentStatus, to: newStatus });
    return updated;
  }

  async addComment(data: { content: string; taskId: string; authorId: string; parentId?: string }) {
    return prisma.comment.create({
      data: {
        content: data.content,
        taskId: data.taskId,
        authorId: data.authorId,
      },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }
}

export const taskService = new TaskService();
