import React from 'react';
import { Assessment } from '../../types/assessment';
import { ClipboardList, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AssessmentListProps {
  assessments: Assessment[];
}

export function AssessmentList({ assessments }: AssessmentListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {assessments.map((assessment) => (
        <div
          key={assessment.id}
          className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardList className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {assessment.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {assessment.description}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to={`/assessment/${assessment.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Start Assessment
                <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="px-4 py-4 sm:px-6">
            <div className="text-sm text-gray-500">
              {assessment.frequency && (
                <p>Recommended frequency: {assessment.frequency}</p>
              )}
              {assessment.timeLimit && (
                <p>Time limit: {assessment.timeLimit} minutes</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}