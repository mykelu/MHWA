import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Mood } from '../../types/wellness';

interface ActivitySelectorProps {
  register: UseFormRegister<Mood>;
}

export function ActivitySelector({ register }: ActivitySelectorProps) {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('mood.activities')}
      </label>
      <select
        multiple
        {...register('activities')}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="exercise">{t('activities.exercise')}</option>
        <option value="meditation">{t('activities.meditation')}</option>
        <option value="reading">{t('activities.reading')}</option>
        <option value="socializing">{t('activities.socializing')}</option>
        <option value="work">{t('activities.work')}</option>
      </select>
    </div>
  );
}