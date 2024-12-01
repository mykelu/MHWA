import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { BreathingExercise as BreathingExerciseType } from '../../types/wellness';
import { useTranslation } from 'react-i18next';

interface BreathingExerciseProps {
  exercise: BreathingExerciseType;
  onComplete: () => void;
}

export function BreathingExercise({ exercise, onComplete }: BreathingExerciseProps) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdEmpty'>('inhale');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTimer = prev + 1;
          
          // Calculate phase transitions
          const { inhale, hold, exhale, holdEmpty } = exercise.pattern;
          const cycleLength = inhale + (hold || 0) + exhale + (holdEmpty || 0);
          
          if (newTimer >= cycleLength) {
            // Start new cycle
            setCurrentCycle(prev => {
              if (prev >= exercise.pattern.cycles) {
                setIsPlaying(false);
                onComplete();
                return prev;
              }
              return prev + 1;
            });
            return 0;
          }

          // Update current phase
          let timeInCycle = newTimer;
          if (timeInCycle < inhale) {
            setCurrentPhase('inhale');
          } else {
            timeInCycle -= inhale;
            if (hold && timeInCycle < hold) {
              setCurrentPhase('hold');
            } else {
              timeInCycle -= (hold || 0);
              if (timeInCycle < exhale) {
                setCurrentPhase('exhale');
              } else {
                setCurrentPhase('holdEmpty');
              }
            }
          }

          return newTimer;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, exercise, onComplete]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhase('inhale');
    setCurrentCycle(1);
    setTimer(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{exercise.name}</h2>
        <p className="text-gray-600 mt-2">{exercise.description}</p>
      </div>

      <div className="flex justify-center items-center space-x-4 mb-8">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
        </button>
        <button
          onClick={handleReset}
          className="p-4 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
        >
          <RefreshCw className="w-8 h-8" />
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-indigo-600 mb-2">
          {t(`breathing.phases.${currentPhase}`)}
        </div>
        <div className="text-gray-600">
          {t('breathing.cycle')} {currentCycle} / {exercise.pattern.cycles}
        </div>
      </div>

      <div className="space-y-2">
        {exercise.benefits.map((benefit, index) => (
          <div key={index} className="text-sm text-gray-600 flex items-center">
            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
}