export interface Session {
  id: string;
  user_id: string;
  token_hash: string;
  ip_address: string;
  user_agent: string;
  expires_at: Date;
  created_at: Date;
}

export interface CreateSessionInput {
  user_id: string;
  token_hash: string;
  ip_address: string;
  user_agent: string;
  expires_at: Date;
}
