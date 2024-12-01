import React, { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { AudioCall } from '../../components/crisis/AudioCall';
import { BackButton } from '../../components/common/BackButton';
import { Phone, PhoneOff, Clock, User } from 'lucide-react';
import { SupportSession } from '../../types/crisis';
import { v4 as uuidv4 } from 'uuid';

export function VoiceSupportPage() {
  const [activeCall, setActiveCall] = useState<SupportSession | null>(null);
  const [waitingCalls, setWaitingCalls] = useState([
    {
      id: uuidv4(),
      userId: 'user1',
      severity: 'high',
      waitTime: '5:23',
      type: 'anxiety',
    },
    {
      id: uuidv4(),
      userId: 'user2',
      severity: 'medium',
      waitTime: '2:45',
      type: 'depression',
    },
  ]);

  const handleAcceptCall = (callId: string) => {
    const call = waitingCalls.find(c => c.id === callId);
    if (call) {
      const session: SupportSession = {
        id: uuidv4(),
        requestId: call.id,
        supporterId: 'current-user',
        userId: call.userId,
        channel: 'audio',
        startTime: new Date().toISOString(),
        status: 'active',
        escalated: false,
      };
      setActiveCall(session);
      setWaitingCalls(prev => prev.filter(c => c.id !== callId));
    }
  };

  const handleEndCall = () => {
    if (activeCall) {
      setActiveCall(prev => 
        prev ? { ...prev, status: 'ended', endTime: new Date().toISOString() } : null
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <BackButton />
            </div>

            {activeCall ? (
              <div className="h-[calc(100vh-12rem)]">
                <AudioCall
                  session={activeCall}
                  onEndCall={handleEndCall}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Voice Support Queue</h2>
                  
                  {waitingCalls.length > 0 ? (
                    <div className="space-y-4">
                      {waitingCalls.map((call) => (
                        <div
                          key={call.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Caller #{call.userId}
                              </p>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Waiting: {call.waitTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              call.severity === 'high' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {call.severity.toUpperCase()}
                            </span>

                            <button
                              onClick={() => handleAcceptCall(call.id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Accept Call
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <PhoneOff className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No calls waiting</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        The voice support queue is currently empty
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Statistics</h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Calls</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">24</dd>
                    </div>
                    <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Average Duration</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">18m</dd>
                    </div>
                    <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Response Rate</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">95%</dd>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}