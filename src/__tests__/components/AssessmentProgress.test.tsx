import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssessmentProgress } from '../../components/assessment/AssessmentProgress';
import { Assessment, AssessmentResponse } from '../../types/assessment';

describe('AssessmentProgress', () => {
  const mockAssessment: Assessment = {
    id: 'phq9',
    title: 'PHQ-9 Depression Scale',
    type: 'PHQ9',
    description: 'Depression screening tool',
    questions: [],
    scoring: {
      ranges: [
        { min: 0, max: 4, label: 'Minimal', description: 'Minimal depression' },
        { min: 5, max: 9, label: 'Mild', description: 'Mild depression' },
        { min: 10, max: 14, label: 'Moderate', description: 'Moderate depression' },
      ],
      calculation: 'sum',
    },
  };

  const mockHistory: AssessmentResponse[] = [
    {
      id: '1',
      assessmentId: 'phq9',
      userId: 'user1',
      responses: [],
      score: 3,
      interpretation: 'Minimal depression',
      completedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      assessmentId: 'phq9',
      userId: 'user1',
      responses: [],
      score: 7,
      interpretation: 'Mild depression',
      completedAt: '2024-02-01T00:00:00.000Z',
    },
  ];

  it('renders chart with assessment history', () => {
    render(
      <AssessmentProgress
        assessmentHistory={mockHistory}
        assessmentType="PHQ9"
        assessment={mockAssessment}
      />
    );

    expect(screen.getByText('PHQ-9 Depression Scale Progress')).toBeInTheDocument();
    expect(screen.getByText('Score Interpretation')).toBeInTheDocument();
    expect(screen.getByText('Latest Result')).toBeInTheDocument();
  });

  it('displays score ranges correctly', () => {
    render(
      <AssessmentProgress
        assessmentHistory={mockHistory}
        assessmentType="PHQ9"
        assessment={mockAssessment}
      />
    );

    mockAssessment.scoring.ranges.forEach((range) => {
      expect(screen.getByText(range.label)).toBeInTheDocument();
      expect(screen.getByText(`${range.min}-${range.max} points`)).toBeInTheDocument();
    });
  });

  it('shows latest result information', () => {
    render(
      <AssessmentProgress
        assessmentHistory={mockHistory}
        assessmentType="PHQ9"
        assessment={mockAssessment}
      />
    );

    expect(screen.getByText(/Score: 7/)).toBeInTheDocument();
    expect(screen.getByText('Mild depression')).toBeInTheDocument();
  });

  it('handles empty assessment history', () => {
    render(
      <AssessmentProgress
        assessmentHistory={[]}
        assessmentType="PHQ9"
        assessment={mockAssessment}
      />
    );

    expect(screen.getByText('No assessment history available yet.')).toBeInTheDocument();
    expect(screen.getByText('Complete an assessment to see your progress.')).toBeInTheDocument();
  });

  it('provides export functionality', () => {
    const { container } = render(
      <AssessmentProgress
        assessmentHistory={mockHistory}
        assessmentType="PHQ9"
        assessment={mockAssessment}
      />
    );

    const exportButton = screen.getByText('Export Data');
    expect(exportButton).toBeInTheDocument();
  });
});