import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { ChatInterface } from '../../components/crisis/ChatInterface';
import { VideoCall } from '../../components/crisis/VideoCall';
import { AudioCall } from '../../components/crisis/AudioCall';
import { CrisisQueue } from '../../components/crisis/CrisisQueue';
import { SupporterMetrics } from '../../components/crisis/SupporterMetrics';
import { CrisisRequest, Message, SupportSession } from '../../types/crisis';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';

export function CrisisSupportPage() {
  const { state: { user } } = useAuth();
  const [activeSession, setActiveSession] = useState<SupportSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [requests, setRequests] = useState<CrisisRequest[]>([]);

  // Simulated data for demonstration
  useEffect(() => {
    setRequests([
      {
        id: uuidv4(),
        userId: 'user123',
        severity: 'high',
        type: 'anxiety',
        description: 'Experiencing severe anxiety attack',
        preferredChannel: 'chat',
        timestamp: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        userId: 'user456',
        severity: 'critical',
        type: 'depression',
        description: 'Having suicidal thoughts',
        preferredChannel: 'video',
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleAcceptRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      const newSession: SupportSession = {
        id: uuidv4(),
        requestId: request.id,
        supporterId: user?.id || '',
        userId: request.userId,
        channel: request.preferredChannel,
        startTime: new Date().toISOString(),
        status: 'active',
        escalated: false,
      };
      setActiveSession(newSession);
      setRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const handleSendMessage = (content: string) => {
    if (!activeSession) return;

    const newMessage: Message = {
      id: uuidv4(),
      sessionId: activeSession.id,
      senderId: user?.id || '',
      content,
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleEscalate = () => {
    if (activeSession) {
      setActiveSession(prev => prev ? { ...prev, escalated: true } : null);
      // In a real app, this would trigger escalation protocols
    }
  };

  const handleEndSession = () => {
    if (activeSession) {
      setActiveSession(prev => prev ? { ...prev, status: 'ended', endTime: new Date().toISOString() } : null);
      setMessages([]);
    }
  };

  const renderActiveSession = () => {
    if (!activeSession) return null;

    switch (activeSession.channel) {
      case 'chat':
        return (
          <ChatInterface
            session={activeSession}
            messages={messages}
            onSendMessage={handleSendMessage}
            onEscalate={handleEscalate}
          />
        );
      case 'video':
        return (
          <VideoCall
            session={activeSession}
            onEndCall={handleEndSession}
          />
        );
      case 'audio':
        return (
          <AudioCall
            session={activeSession}
            onEndCall={handleEndSession}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Crisis Support Center</h1>
            
            {!activeSession ? (
              <>
                <SupporterMetrics
                  metrics={{
                    id: '1',
                    supporterId: user?.id || '',
                    totalSessions: 24,
                    averageResponseTime: 2.5,
                    averageSessionDuration: 45,
                    escalationRate: 0.15,
                    satisfactionScore: 4.8,
                    period: 'daily',
                    timestamp: new Date().toISOString(),
                  }}
                />
                <CrisisQueue
                  requests={requests}
                  onAcceptRequest={handleAcceptRequest}
                />
              </>
            ) : (
              <div className="h-[calc(100vh-12rem)]">
                {renderActiveSession()}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}