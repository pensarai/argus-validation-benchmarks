export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone: string | null;
  address: string | null;
  bio: string | null;
  avatar_path: string | null;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  reset_token_hash: string | null;
  reset_token_expires: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  bio: string | null;
  role: string;
  created_at: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}
