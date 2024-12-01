import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Smile, Frown, Meh } from 'lucide-react';
import { Mood, moodSchema } from '../../types/wellness';
import { useTranslation } from 'react-i18next';
import { MoodSelector } from './MoodSelector';
import { ActivitySelector } from './ActivitySelector';

interface MoodTrackerProps {
  onSubmit: (mood: Omit<Mood, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
}

export function MoodTracker({ onSubmit }: MoodTrackerProps) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Mood>({
    resolver: zodResolver(moodSchema),
    defaultValues: {
      value: undefined,
      activities: [],
      note: '',
    }
  });

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
    setValue('value', value);
  };

  const handleFormSubmit = async (data: Mood) => {
    if (!selectedMood) return;
    
    try {
      setSubmitting(true);
      await onSubmit({
        value: selectedMood,
        note: data.note || '',
        activities: data.activities || [],
        tags: [],
      });
      reset();
      setSelectedMood(null);
    } catch (error) {
      console.error('Failed to submit mood:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{t('mood.trackTitle')}</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('mood.howAreYou')}
          </label>
          <input type="hidden" {...register('value')} />
          <MoodSelector selectedMood={selectedMood} onSelect={handleMoodSelect} />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{t('mood.selectMood')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('mood.note')}
          </label>
          <textarea
            {...register('note')}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder={t('mood.notePlaceholder')}
          />
        </div>

        <ActivitySelector register={register} />

        <button
          type="submit"
          disabled={submitting || !selectedMood}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {submitting ? t('common.submitting') : t('mood.submit')}
        </button>
      </form>
    </div>
  );
}