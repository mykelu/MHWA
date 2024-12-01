import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentForm } from '../../components/assessment/AssessmentForm';
import { Assessment } from '../../types/assessment';

describe('AssessmentForm', () => {
  const mockAssessment: Assessment = {
    id: 'phq9',
    title: 'PHQ-9 Depression Scale',
    description: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    type: 'PHQ9',
    questions: [
      {
        id: 'phq9_1',
        text: 'Little interest or pleasure in doing things',
        type: 'scale',
        required: true,
        minValue: 0,
        maxValue: 3,
        labels: {
          0: 'Not at all',
          1: 'Several days',
          2: 'More than half the days',
          3: 'Nearly every day',
        },
      },
      {
        id: 'phq9_2',
        text: 'Feeling down, depressed, or hopeless',
        type: 'scale',
        required: true,
        minValue: 0,
        maxValue: 3,
        labels: {
          0: 'Not at all',
          1: 'Several days',
          2: 'More than half the days',
          3: 'Nearly every day',
        },
      },
    ],
    scoring: {
      ranges: [
        { min: 0, max: 4, label: 'Minimal', description: 'Minimal depression' },
        { min: 5, max: 9, label: 'Mild', description: 'Mild depression' },
      ],
      calculation: 'sum',
    },
  };

  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders assessment title and description', () => {
    render(<AssessmentForm assessment={mockAssessment} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText(mockAssessment.title)).toBeInTheDocument();
    expect(screen.getByText(mockAssessment.description)).toBeInTheDocument();
  });

  it('displays questions one at a time', () => {
    render(<AssessmentForm assessment={mockAssessment} onSubmit={mockOnSubmit} />);
    
    // First question should be visible
    expect(screen.getByText(mockAssessment.questions[0].text)).toBeInTheDocument();
    // Second question should not be visible yet
    expect(screen.queryByText(mockAssessment.questions[1].text)).not.toBeInTheDocument();
  });

  it('allows navigation between questions', async () => {
    render(<AssessmentForm assessment={mockAssessment} onSubmit={mockOnSubmit} />);
    
    // Select an answer for the first question
    const firstAnswer = screen.getByLabelText('Not at all');
    await userEvent.click(firstAnswer);
    
    // Click next
    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);
    
    // Second question should now be visible
    expect(screen.getByText(mockAssessment.questions[1].text)).toBeInTheDocument();
    
    // Click previous
    const prevButton = screen.getByText('Previous');
    await userEvent.click(prevButton);
    
    // First question should be visible again
    expect(screen.getByText(mockAssessment.questions[0].text)).toBeInTheDocument();
  });

  it('submits form with all responses', async () => {
    render(<AssessmentForm assessment={mockAssessment} onSubmit={mockOnSubmit} />);
    
    // Answer first question
    const firstAnswer = screen.getByLabelText('Not at all');
    await userEvent.click(firstAnswer);
    
    // Go to next question
    await userEvent.click(screen.getByText('Next'));
    
    // Answer second question
    const secondAnswer = screen.getByLabelText('Several days');
    await userEvent.click(secondAnswer);
    
    // Submit form
    const submitButton = screen.getByText('Submit Assessment');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        assessmentId: 'phq9',
        responses: [
          { questionId: 'phq9_1', value: 0 },
          { questionId: 'phq9_2', value: 1 },
        ],
      });
    });
  });

  it('shows error when trying to proceed without answering required question', async () => {
    render(<AssessmentForm assessment={mockAssessment} onSubmit={mockOnSubmit} />);
    
    // Try to go to next question without answering
    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);
    
    // Should show error message
    expect(screen.getByText(/This question is required/i)).toBeInTheDocument();
  });
});