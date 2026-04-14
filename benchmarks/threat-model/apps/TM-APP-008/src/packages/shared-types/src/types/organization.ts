import { z } from 'zod';
import { OrganizationCreateSchema, OrganizationUpdateSchema } from '../schemas/organization';

export type OrganizationCreateType = z.infer<typeof OrganizationCreateSchema>;
export type OrganizationUpdateType = z.infer<typeof OrganizationUpdateSchema>;

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  memberIds: string[];
  settings: OrgSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrgMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export interface OrgInvite {
  id: string;
  email: string;
  organizationId: string;
  role: 'admin' | 'member' | 'viewer';
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}

export interface OrgSettings {
  isPublic: boolean;
  allowMemberInvites: boolean;
  defaultMemberRole: 'member' | 'viewer';
  maxProjects: number;
}
