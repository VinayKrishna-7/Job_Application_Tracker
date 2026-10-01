import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ApplicationStatus } from '../types/application';

describe('StatusBadge Component', () => {
  const statuses: ApplicationStatus[] = [
    'Wishlist',
    'Applied',
    'Screening',
    'Interview',
    'Technical Round',
    'Offer',
    'Rejected',
    'Withdrawn',
  ];

  statuses.forEach((status) => {
    it(`renders status badge correctly for ${status}`, () => {
      render(<StatusBadge status={status} />);
      const textMatches = screen.getAllByText(new RegExp(status.replace('Round', '').trim(), 'i'));
      expect(textMatches.length).toBeGreaterThanOrEqual(1);
    });
  });
});
