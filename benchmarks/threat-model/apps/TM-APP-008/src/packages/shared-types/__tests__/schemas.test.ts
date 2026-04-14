import {
  UserCreateSchema,
  UserUpdateSchema,
  UserLoginSchema,
  OrganizationCreateSchema,
  ProjectCreateSchema,
  TaskCreateSchema,
  WebhookCreateSchema,
  WebhookTestSchema,
  CommentCreateSchema,
  PaginationSchema,
  SearchQuerySchema,
  LoginSchema,
  RegisterSchema,
  FileUploadSchema,
  ApiKeyCreateSchema,
} from '../src/schemas';

describe('UserCreateSchema', () => {
  it('accepts valid user creation data', () => {
    const result = UserCreateSchema.safeParse({
      email: 'test@example.com',
      password: 'SecureP4ss',
      name: 'Test User',
    });
    expect(result.success).toBe(true);
  });

  it('rejects weak passwords', () => {
    const result = UserCreateSchema.safeParse({
      email: 'test@example.com',
      password: 'weak',
      name: 'Test User',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid emails', () => {
    const result = UserCreateSchema.safeParse({
      email: 'not-an-email',
      password: 'SecureP4ss',
      name: 'Test User',
    });
    expect(result.success).toBe(false);
  });
});

describe('UserUpdateSchema', () => {
  it('accepts valid profile update', () => {
    const result = UserUpdateSchema.safeParse({
      name: 'Updated Name',
      bio: 'This is my bio',
    });
    expect(result.success).toBe(true);
  });

  it('accepts metadata field with any value', () => {
    // NOTE: This test passes because metadata is z.any()
    // This is the vulnerability -- arbitrary data is accepted
    const result = UserUpdateSchema.safeParse({
      metadata: { role: 'admin', permissions: ['*'] },
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty metadata', () => {
    const result = UserUpdateSchema.safeParse({ metadata: {} });
    expect(result.success).toBe(true);
  });
});

describe('OrganizationCreateSchema', () => {
  it('accepts valid organization data', () => {
    const result = OrganizationCreateSchema.safeParse({
      name: 'My Organization',
      slug: 'my-organization',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid slugs', () => {
    const result = OrganizationCreateSchema.safeParse({
      name: 'My Org',
      slug: 'Invalid Slug!',
    });
    expect(result.success).toBe(false);
  });
});

describe('TaskCreateSchema', () => {
  it('accepts valid task data', () => {
    const result = TaskCreateSchema.safeParse({
      title: 'Fix bug',
      projectId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('requires description for critical priority', () => {
    const result = TaskCreateSchema.safeParse({
      title: 'Critical issue',
      priority: 'critical',
      projectId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(false);
  });
});

describe('WebhookTestSchema', () => {
  it('accepts valid webhook test URL', () => {
    const result = WebhookTestSchema.safeParse({
      url: 'https://example.com/webhook',
    });
    expect(result.success).toBe(true);
  });

  it('accepts internal URLs (no SSRF protection at schema level)', () => {
    const result = WebhookTestSchema.safeParse({
      url: 'http://169.254.169.254/latest/meta-data/',
    });
    expect(result.success).toBe(true);
  });
});

describe('PaginationSchema', () => {
  it('applies defaults for missing fields', () => {
    const result = PaginationSchema.parse({});
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(0);
    expect(result.sortOrder).toBe('desc');
  });

  it('rejects limit over 100', () => {
    const result = PaginationSchema.safeParse({ limit: 500 });
    expect(result.success).toBe(false);
  });
});
