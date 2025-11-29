import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JobCard from '../JobCard';

const mockJob = {
  _id: '1',
  title: 'Test Job',
  description: 'Test description',
  category: 'cleaning',
  date: new Date().toISOString(),
  startTime: '10:00',
  durationHours: 2,
  location: { city: 'San Francisco' },
  distance: 5.2
};

describe('JobCard Component', () => {
  it('renders job information', () => {
    render(
      <BrowserRouter>
        <JobCard job={mockJob} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Job')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText(/San Francisco/i)).toBeInTheDocument();
  });
});

