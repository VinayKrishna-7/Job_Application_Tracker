import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatSalaryRange,
  getDaysRemaining,
} from '../utils/formatters';

describe('Formatters Utilities', () => {
  it('formats dates cleanly', () => {
    const formatted = formatDate('2026-05-15T12:00:00Z');
    expect(formatted).toContain('May');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2026');
  });

  it('handles null date gracefully', () => {
    expect(formatDate(null)).toBe('Not set');
    expect(formatDate(undefined)).toBe('Not set');
  });

  it('formats salary ranges with currency', () => {
    const range = formatSalaryRange(120000, 150000, 'USD');
    expect(range).toContain('$120,000');
    expect(range).toContain('$150,000');
  });

  it('formats single minimum salary', () => {
    const minOnly = formatSalaryRange(100000, null, 'USD');
    expect(minOnly).toContain('From $100,000');
  });

  it('formats single maximum salary', () => {
    const maxOnly = formatSalaryRange(null, 180000, 'USD');
    expect(maxOnly).toContain('Up to $180,000');
  });

  it('calculates days remaining for future and overdue dates', () => {
    const today = new Date().toISOString();
    expect(getDaysRemaining(today).isToday).toBe(true);

    const yesterday = new Date(Date.now() - 86400000).toISOString();
    expect(getDaysRemaining(yesterday).isOverdue).toBe(true);

    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();
    expect(getDaysRemaining(nextWeek).isOverdue).toBe(false);
  });
});
