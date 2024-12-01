import { Assessment, AssessmentResponse } from '../types/assessment';

export function calculateScore(
  assessment: Assessment,
  responses: AssessmentResponse['responses']
): number {
  if (responses.length === 0) return 0;

  const total = responses.reduce((sum, response) => sum + Number(response.value), 0);

  if (assessment.scoring.calculation === 'average') {
    return Math.round(total / responses.length);
  }

  return total;
}

export function interpretScore(assessment: Assessment, score: number): string {
  const range = assessment.scoring.ranges.find(
    (r) => score >= r.min && score <= r.max
  );

  return range?.description || 'Score interpretation not available';
}