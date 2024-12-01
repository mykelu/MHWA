import React from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { BreathingExercise } from '../../components/wellness/BreathingExercise';
import { BackButton } from '../../components/common/BackButton';
import { BreathingExercise as BreathingExerciseType } from '../../types/wellness';

const SAMPLE_EXERCISE: BreathingExerciseType = {
  id: '1',
  name: '4-7-8 Breathing',
  description: 'A relaxing breath pattern to reduce anxiety and help with sleep',
  pattern: {
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4
  },
  difficulty: 'beginner',
  benefits: [
    'Reduces anxiety and stress',
    'Helps with sleep',
    'Improves focus',
    'Regulates nervous system'
  ]
};

export function BreathingPage() {
  const handleExerciseComplete = () => {
    console.log('Breathing exercise completed');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <BackButton />
            </div>
            <BreathingExercise 
              exercise={SAMPLE_EXERCISE}
              onComplete={handleExerciseComplete}
            />
          </div>
        </main>
      </div>
    </div>
  );
}