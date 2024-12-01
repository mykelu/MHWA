import React from 'react';
import { Assessment, AssessmentResponse } from '../../types/assessment';
import { QuestionRenderer } from './QuestionRenderer';
import { useAssessment } from '../../hooks/useAssessment';

interface AssessmentFormProps {
  assessment: Assessment;
  onSubmit: (response: Omit<AssessmentResponse, 'id' | 'score' | 'interpretation' | 'completedAt'>) => Promise<void>;
}

export function AssessmentForm({ assessment, onSubmit }: AssessmentFormProps) {
  const {
    currentQuestion,
    responses,
    errors,
    isSubmitting,
    handleQuestionChange,
    handleNext,
    handlePrevious,
    handleSubmit,
  } = useAssessment({ assessment, onSubmit });

  const currentQuestionData = assessment.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{assessment.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{assessment.description}</p>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Question {currentQuestion + 1} of {assessment.questions.length}
              </h3>
            </div>

            <QuestionRenderer
              question={currentQuestionData}
              value={responses[currentQuestionData.id]}
              onChange={(value) => handleQuestionChange(currentQuestionData.id, value)}
              error={errors[currentQuestionData.id]}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Previous
            </button>

            {currentQuestion === assessment.questions.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}