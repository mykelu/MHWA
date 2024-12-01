import React from 'react';
import { Smile, Frown, Meh } from 'lucide-react';

interface MoodSelectorProps {
  selectedMood: number | null;
  onSelect: (value: number) => void;
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex justify-between items-center">
      <button
        type="button"
        onClick={() => onSelect(1)}
        className={`p-2 rounded-full transition-colors ${
          selectedMood === 1 ? 'bg-red-100' : 'hover:bg-gray-100'
        }`}
      >
        <Frown className="w-8 h-8 text-red-500" />
      </button>
      <button
        type="button"
        onClick={() => onSelect(5)}
        className={`p-2 rounded-full transition-colors ${
          selectedMood === 5 ? 'bg-yellow-100' : 'hover:bg-gray-100'
        }`}
      >
        <Meh className="w-8 h-8 text-yellow-500" />
      </button>
      <button
        type="button"
        onClick={() => onSelect(10)}
        className={`p-2 rounded-full transition-colors ${
          selectedMood === 10 ? 'bg-green-100' : 'hover:bg-gray-100'
        }`}
      >
        <Smile className="w-8 h-8 text-green-500" />
      </button>
    </div>
  );
}