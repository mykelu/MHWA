import React from 'react';
import { useForm } from 'react-hook-form';
import { Book } from 'lucide-react';
import { JournalEntry } from '../../types/wellness';
import { useTranslation } from 'react-i18next';

interface JournalPromptProps {
  prompt: string;
  onSubmit: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => Promise<void>;
}

export function JournalPrompt({ prompt, onSubmit }: JournalPromptProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ content: string }>();

  const handleJournalSubmit = async (data: { content: string }) => {
    try {
      await onSubmit({
        userId: 'current-user', // In a real app, get from auth context
        content: data.content,
        prompt,
        tags: [],
      });
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Book className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">{t('journal.todayPrompt')}</h2>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4 mb-6">
        <p className="text-indigo-900">{prompt}</p>
      </div>

      <form onSubmit={handleSubmit(handleJournalSubmit)} className="space-y-4">
        <div>
          <textarea
            {...register('content', { required: t('journal.contentRequired') })}
            rows={6}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder={t('journal.writingPlaceholder')}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? t('common.saving') : t('journal.save')}
        </button>
      </form>
    </div>
  );
}