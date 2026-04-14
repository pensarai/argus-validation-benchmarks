import { sanitizedString, slug, uuid, dateRange, tags } from '../src/validation/rules';
import { stripHtml, normalizeWhitespace, slugify, truncate, escapeHtml } from '../src/validation/sanitizers';
import { generateSlug, isValidSlug } from '../src/utils/slug';

describe('validation rules', () => {
  describe('sanitizedString', () => {
    it('escapes HTML characters', () => {
      const result = sanitizedString.parse('<script>alert(1)</script>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;');
    });
  });

  describe('slug', () => {
    it('accepts valid slugs', () => {
      expect(slug.safeParse('my-project').success).toBe(true);
      expect(slug.safeParse('project123').success).toBe(true);
    });

    it('rejects invalid slugs', () => {
      expect(slug.safeParse('My Project').success).toBe(false);
      expect(slug.safeParse('project_name').success).toBe(false);
    });
  });

  describe('uuid', () => {
    it('accepts valid UUIDs', () => {
      expect(uuid.safeParse('550e8400-e29b-41d4-a716-446655440000').success).toBe(true);
    });

    it('rejects non-UUIDs', () => {
      expect(uuid.safeParse('not-a-uuid').success).toBe(false);
    });
  });

  describe('dateRange', () => {
    it('accepts valid date ranges', () => {
      const result = dateRange.safeParse({
        start: '2024-01-01T00:00:00Z',
        end: '2024-06-01T00:00:00Z',
      });
      expect(result.success).toBe(true);
    });

    it('rejects reversed date ranges', () => {
      const result = dateRange.safeParse({
        start: '2024-06-01T00:00:00Z',
        end: '2024-01-01T00:00:00Z',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('sanitizers', () => {
  describe('stripHtml', () => {
    it('removes HTML tags', () => {
      expect(stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world');
    });

    it('removes script tags with content', () => {
      expect(stripHtml('<script>alert(1)</script>Hello')).toBe('Hello');
    });
  });

  describe('normalizeWhitespace', () => {
    it('collapses multiple spaces', () => {
      expect(normalizeWhitespace('hello    world')).toBe('hello world');
    });
  });

  describe('slugify', () => {
    it('converts to slug format', () => {
      expect(slugify('My Project Name!')).toBe('my-project-name');
    });
  });

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('does not truncate short strings', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });
  });

  describe('escapeHtml', () => {
    it('escapes HTML special characters', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
    });
  });
});

describe('slug utilities', () => {
  it('generates valid slugs', () => {
    const result = generateSlug('My Project Name');
    expect(isValidSlug(result)).toBe(true);
  });
});
