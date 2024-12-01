import React from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { JournalPrompt } from '../../components/wellness/JournalPrompt';
import { BackButton } from '../../components/common/BackButton';
import { JournalEntry } from '../../types/wellness';

export function JournalPage() {
  const handleJournalSubmit = async (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    // Implementation for journal submission
    console.log('Journal entry submitted:', entry);
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
            <JournalPrompt 
              prompt="What are three things you're grateful for today?"
              onSubmit={handleJournalSubmit}
            />
          </div>
        </main>
      </div>
    </div>
  );
}