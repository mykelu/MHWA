import React, { useEffect, useState } from 'react';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { SupportSession } from '../../types/crisis';
import { format } from 'date-fns';

interface AudioCallProps {
  session: SupportSession;
  onEndCall: () => void;
}

export function AudioCall({ session, onEndCall }: AudioCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, this would mute the audio stream
  };

  const toggleSpeaker = () => {
    setIsSpeakerMuted(!isSpeakerMuted);
    // In a real implementation, this would mute the speaker
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl font-bold">
            {session.userId.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-2">
          Support Session #{session.id.slice(0, 8)}
        </h2>
        
        <p className="text-gray-400 mb-4">
          Started at {format(new Date(session.startTime), 'HH:mm')}
        </p>

        <div className="text-2xl font-mono mb-8">
          {formatDuration(duration)}
        </div>

        <div className="flex space-x-6">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="h-6 w-6" />
          </button>

          <button
            onClick={toggleSpeaker}
            className={`p-4 rounded-full ${
              isSpeakerMuted ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isSpeakerMuted ? (
              <VolumeX className="h-6 w-6" />
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}