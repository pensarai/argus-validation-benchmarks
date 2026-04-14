import { Application } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import organizationRoutes from './organizations';
import projectRoutes from './projects';
import taskRoutes from './tasks';
import webhookRoutes from './webhooks';

/**
 * Alternative route configuration function.
 * Can be used instead of direct app.use() calls in app.ts.
 */
export function configureRoutes(app: Application): void {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/organizations', organizationRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/webhooks', webhookRoutes);
}

export { authRoutes, userRoutes, organizationRoutes, projectRoutes, taskRoutes, webhookRoutes };
