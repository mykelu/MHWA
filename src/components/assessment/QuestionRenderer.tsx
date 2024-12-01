import React from 'react';
import { AssessmentQuestion } from '../../types/assessment';

interface QuestionRendererProps {
  question: AssessmentQuestion;
  value?: string | number;
  onChange: (value: string | number) => void;
  error?: string;
}

export function QuestionRenderer({ question, value, onChange, error }: QuestionRendererProps) {
  const renderScaleQuestion = () => {
    return (
      <div className="space-y-4">
        {Array.from({ length: (question.maxValue || 3) - (question.minValue || 0) + 1 }).map((_, index) => {
          const optionValue = (question.minValue || 0) + index;
          const label = question.labels?.[optionValue] || optionValue.toString();
          
          return (
            <div key={optionValue} className="flex items-center">
              <input
                type="radio"
                id={`${question.id}_${optionValue}`}
                name={question.id}
                value={optionValue}
                checked={value === optionValue}
                onChange={() => onChange(optionValue)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                aria-label={label}
              />
              <label
                htmlFor={`${question.id}_${optionValue}`}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMultiChoiceQuestion = () => {
    return (
      <div className="space-y-4">
        {question.options?.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={`${question.id}_${index}`}
              name={question.id}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label
              htmlFor={`${question.id}_${index}`}
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const renderTextQuestion = () => {
    return (
      <textarea
        id={question.id}
        name={question.id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-base text-gray-900">{question.text}</p>
        {question.required && (
          <span className="text-sm text-red-500 ml-1">*</span>
        )}
      </div>

      {question.type === 'scale' && renderScaleQuestion()}
      {question.type === 'multiChoice' && renderMultiChoiceQuestion()}
      {question.type === 'text' && renderTextQuestion()}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}