import { useState, useCallback } from 'react';
import { Assessment, AssessmentResponse } from '../types/assessment';

interface UseAssessmentProps {
  assessment: Assessment;
  onSubmit: (response: Omit<AssessmentResponse, 'id' | 'score' | 'interpretation' | 'completedAt'>) => Promise<void>;
}

export function useAssessment({ assessment, onSubmit }: UseAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateQuestion = useCallback((questionIndex: number) => {
    const question = assessment.questions[questionIndex];
    if (question.required && !Object.prototype.hasOwnProperty.call(responses, question.id)) {
      setErrors(prev => ({
        ...prev,
        [question.id]: 'This question is required'
      }));
      return false;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[question.id];
      return newErrors;
    });
    return true;
  }, [assessment.questions, responses]);

  const handleQuestionChange = useCallback((questionId: string, value: string | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (validateQuestion(currentQuestion)) {
      setCurrentQuestion(prev => Math.min(assessment.questions.length - 1, prev + 1));
    }
  }, [currentQuestion, validateQuestion, assessment.questions.length]);

  const handlePrevious = useCallback(() => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (!validateQuestion(currentQuestion)) {
        return;
      }

      const formattedResponses = Object.entries(responses).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      setIsSubmitting(true);
      await onSubmit({
        assessmentId: assessment.id,
        responses: formattedResponses,
      });
    } catch (error) {
      console.error('Assessment submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [assessment.id, currentQuestion, onSubmit, responses, validateQuestion]);

  return {
    currentQuestion,
    responses,
    errors,
    isSubmitting,
    handleQuestionChange,
    handleNext,
    handlePrevious,
    handleSubmit,
  };
}