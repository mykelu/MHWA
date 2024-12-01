import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { MoodTracker } from '../../components/wellness/MoodTracker';
import { MoodHistory } from '../../components/wellness/MoodHistory';
import { BackButton } from '../../components/common/BackButton';
import { Mood } from '../../types/wellness';
import { saveMood, getUserMoodHistory } from '../../services/storage/moodStorage';
import { useAuth } from '../../contexts/AuthContext';

export function MoodTrackerPage() {
  const { state: { user } } = useAuth();
  const [moods, setMoods] = useState<Mood[]>([]);

  useEffect(() => {
    if (user?.id) {
      const userMoods = getUserMoodHistory(user.id);
      setMoods(userMoods);
    }
  }, [user?.id]);

  const handleMoodSubmit = async (mood: Mood) => {
    try {
      const moodWithUserId = {
        ...mood,
        userId: user?.id || 'anonymous',
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };
      
      saveMood(moodWithUserId);
      setMoods(prev => [moodWithUserId, ...prev]);
    } catch (error) {
      console.error('Failed to save mood:', error);
    }
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
            <div className="space-y-8">
              <MoodTracker onSubmit={handleMoodSubmit} />
              <MoodHistory moods={moods} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}