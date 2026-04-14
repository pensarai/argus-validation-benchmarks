import { PrismaClient } from '@prisma/client';
import { AppError } from '@app/shared-types';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

class ProjectService {
  async create(data: {
    name: string;
    slug: string;
    description?: string;
    organizationId: string;
    settings?: Record<string, unknown>;
  }) {
    const existing = await prisma.project.findFirst({
      where: { organizationId: data.organizationId, slug: data.slug },
    });
    if (existing) {
      throw new AppError('Project slug already exists in this organization', 409, 'DUPLICATE_SLUG');
    }

    return prisma.project.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        organizationId: data.organizationId,
        status: 'active',
        settings: data.settings || {},
      },
    });
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        tasks: { orderBy: { position: 'asc' } },
        files: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async listByOrganization(orgId: string, options: { status?: string; limit: number; offset: number }) {
    const where: any = { organizationId: orgId };
    if (options.status) where.status = options.status;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        take: options.limit,
        skip: options.offset,
        orderBy: { updatedAt: 'desc' },
        include: { _count: { select: { tasks: true } } },
      }),
      prisma.project.count({ where }),
    ]);

    return { items: projects, total, limit: options.limit, offset: options.offset };
  }

  async update(id: string, data: { name?: string; description?: string; status?: string; settings?: Record<string, unknown> }) {
    return prisma.project.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }

  async addFile(projectId: string, file: {
    name: string;
    path: string;
    size: number;
    mimeType: string;
    uploadedBy: string;
  }) {
    return prisma.projectFile.create({
      data: { projectId, ...file },
    });
  }

  async getStats(projectId: string) {
    const taskCounts = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId },
      _count: { status: true },
    });

    const stats: Record<string, number> = { total: 0 };
    for (const group of taskCounts) {
      stats[group.status] = group._count.status;
      stats.total += group._count.status;
    }

    return stats;
  }
}

export const projectService = new ProjectService();
