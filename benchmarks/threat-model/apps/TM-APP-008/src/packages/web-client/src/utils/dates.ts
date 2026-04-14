/**
 * Date utilities for task due date handling.
 */

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export function daysUntilDue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDueDate(dueDate: string): { text: string; color: string } {
  const days = daysUntilDue(dueDate);
  if (days < 0) return { text: `${Math.abs(days)} days overdue`, color: '#e74c3c' };
  if (days === 0) return { text: 'Due today', color: '#f39c12' };
  if (days === 1) return { text: 'Due tomorrow', color: '#f39c12' };
  if (days <= 3) return { text: `Due in ${days} days`, color: '#f1c40f' };
  if (days <= 7) return { text: `Due in ${days} days`, color: '#3498db' };
  return { text: new Date(dueDate).toLocaleDateString(), color: '#95a5a6' };
}

export function dateRangeToQuery(from?: Date, to?: Date): Record<string, string> {
  const params: Record<string, string> = {};
  if (from) params.dueDateFrom = from.toISOString();
  if (to) params.dueDateTo = to.toISOString();
  return params;
}
