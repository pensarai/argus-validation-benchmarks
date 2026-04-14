import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { requireOrgMembership } from '../middleware/rbac';
import { validate } from '../middleware/validation';
import {
  OrganizationCreateSchema,
  OrganizationUpdateSchema,
  AppError,
} from '@app/shared-types';
import { orgService } from '../services/orgService';
import { logger } from '../utils/logger';

const router = Router();

// POST /api/organizations -- Create a new organization
router.post(
  '/',
  validate(OrganizationCreateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    const org = await orgService.create({
      ...req.body,
      creatorId: req.user!.id,
    });

    logger.info('Organization created', { orgId: org.id, userId: req.user!.id });
    res.status(201).json({ data: org });
  }
);

// GET /api/organizations -- List user's organizations
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const orgs = await orgService.listByUser(req.user!.id);
  res.json({ data: orgs });
});

// GET /api/organizations/:id -- Get organization by ID
router.get('/:id', requireOrgMembership, async (req: AuthenticatedRequest, res: Response) => {
  const org = await orgService.findById(req.params.id);
  if (!org) {
    throw new AppError('Organization not found', 404, 'NOT_FOUND');
  }
  res.json({ data: org });
});

// PUT /api/organizations/:id -- Update organization
router.put(
  '/:id',
  requireOrgMembership,
  validate(OrganizationUpdateSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    const updated = await orgService.update(req.params.id, req.body);
    logger.info('Organization updated', { orgId: req.params.id, userId: req.user!.id });
    res.json({ data: updated });
  }
);

// POST /api/organizations/:id/members -- Add a member
router.post(
  '/:id/members',
  requireOrgMembership,
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId, role } = req.body;
    if (!userId) {
      throw new AppError('User ID is required', 400, 'MISSING_USER_ID');
    }

    const org = await orgService.addMember(req.params.id, userId, role || 'member');
    logger.info('Member added to organization', {
      orgId: req.params.id,
      newMemberId: userId,
      addedBy: req.user!.id,
    });
    res.json({ data: org });
  }
);

// DELETE /api/organizations/:id/members/:userId -- Remove a member
router.delete(
  '/:id/members/:userId',
  requireOrgMembership,
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.params.userId === req.user!.id) {
      throw new AppError('Cannot remove yourself from the organization', 400, 'SELF_REMOVAL');
    }

    const org = await orgService.removeMember(req.params.id, req.params.userId);
    logger.info('Member removed from organization', {
      orgId: req.params.id,
      removedUserId: req.params.userId,
      removedBy: req.user!.id,
    });
    res.json({ data: org });
  }
);

export default router;
