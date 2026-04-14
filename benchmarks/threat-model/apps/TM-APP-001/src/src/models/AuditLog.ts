export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  ip_address: string;
  details: string;
  created_at: Date;
}

export type AuditAction =
  | 'login'
  | 'logout'
  | 'register'
  | 'password_reset'
  | 'profile_update'
  | 'avatar_upload'
  | 'user_banned'
  | 'user_unbanned'
  | 'admin_action';

export interface CreateAuditLogInput {
  user_id: string;
  action: AuditAction;
  ip_address: string;
  details: Record<string, unknown>;
}
