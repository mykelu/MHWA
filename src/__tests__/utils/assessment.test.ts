import { describe, it, expect } from 'vitest';
import { calculateScore, interpretScore } from '../../utils/assessment';
import { Assessment, AssessmentResponse } from '../../types/assessment';

describe('Assessment Utils', () => {
  const mockAssessment: Assessment = {
    id: 'test-assessment',
    title: 'Test Assessment',
    description: 'Test Description',
    type: 'PHQ9',
    questions: [
      {
        id: 'q1',
        text: 'Question 1',
        type: 'scale',
        minValue: 0,
        maxValue: 3,
      },
      {
        id: 'q2',
        text: 'Question 2',
        type: 'scale',
        minValue: 0,
        maxValue: 3,
      },
    ],
    scoring: {
      calculation: 'sum',
      ranges: [
        { min: 0, max: 4, label: 'Minimal', description: 'Minimal symptoms' },
        { min: 5, max: 9, label: 'Mild', description: 'Mild symptoms' },
        { min: 10, max: 14, label: 'Moderate', description: 'Moderate symptoms' },
      ],
    },
  };

  describe('calculateScore', () => {
    it('should correctly calculate sum score', () => {
      const responses = [
        { questionId: 'q1', value: 2 },
        { questionId: 'q2', value: 3 },
      ];

      const score = calculateScore(mockAssessment, responses);
      expect(score).toBe(5);
    });

    it('should handle empty responses', () => {
      const score = calculateScore(mockAssessment, []);
      expect(score).toBe(0);
    });

    it('should calculate average when specified', () => {
      const averageAssessment = {
        ...mockAssessment,
        scoring: { ...mockAssessment.scoring, calculation: 'average' as const },
      };

      const responses = [
        { questionId: 'q1', value: 2 },
        { questionId: 'q2', value: 4 },
      ];

      const score = calculateScore(averageAssessment, responses);
      expect(score).toBe(3);
    });
  });

  describe('interpretScore', () => {
    it('should return correct interpretation for minimal score', () => {
      const interpretation = interpretScore(mockAssessment, 3);
      expect(interpretation).toBe('Minimal symptoms');
    });

    it('should return correct interpretation for mild score', () => {
      const interpretation = interpretScore(mockAssessment, 7);
      expect(interpretation).toBe('Mild symptoms');
    });

    it('should return correct interpretation for moderate score', () => {
      const interpretation = interpretScore(mockAssessment, 12);
      expect(interpretation).toBe('Moderate symptoms');
    });

    it('should handle score outside defined ranges', () => {
      const interpretation = interpretScore(mockAssessment, 20);
      expect(interpretation).toBe('Score interpretation not available');
    });
  });
});