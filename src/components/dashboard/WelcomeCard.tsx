import React from 'react';
import { Sun, Heart, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function WelcomeCard() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-xl p-6 text-white">
      <div className="flex items-center">
        <Sun className="h-8 w-8 mr-4" />
        <div>
          <h2 className="text-2xl font-bold">{t('dashboard.welcome')}</h2>
          <p className="mt-1 text-indigo-100">{t('dashboard.feelingPrompt')}</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          to="/wellness/mood"
          className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 rounded-lg p-4 flex items-center"
        >
          <Heart className="h-5 w-5 mr-2" />
          <span>{t('dashboard.trackMood')}</span>
        </Link>
        <Link
          to="/assessments"
          className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 rounded-lg p-4 flex items-center"
        >
          <Brain className="h-5 w-5 mr-2" />
          <span>{t('dashboard.takeAssessment')}</span>
        </Link>
        <Link
          to="/wellness/breathing"
          className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 rounded-lg p-4 flex items-center"
        >
          <Sun className="h-5 w-5 mr-2" />
          <span>{t('dashboard.startBreathing')}</span>
        </Link>
      </div>
    </div>
  );
}