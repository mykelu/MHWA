import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MessageSquare, Phone, Video } from 'lucide-react';
import { CrisisRequest, SeverityLevel } from '../../types/crisis';
import { format } from 'date-fns';

interface CrisisQueueProps {
  requests: CrisisRequest[];
  onAcceptRequest: (requestId: string) => void;
}

export function CrisisQueue({ requests, onAcceptRequest }: CrisisQueueProps) {
  const [sortedRequests, setSortedRequests] = useState<CrisisRequest[]>([]);

  useEffect(() => {
    // Sort requests by severity and timestamp
    const sorted = [...requests].sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    setSortedRequests(sorted);
  }, [requests]);

  const getSeverityColor = (severity: SeverityLevel) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[severity];
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'chat':
        return <MessageSquare className="h-5 w-5" />;
      case 'audio':
        return <Phone className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Crisis Support Queue</h3>
        <p className="mt-1 text-sm text-gray-500">
          {sortedRequests.length} requests waiting for support
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        {sortedRequests.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {sortedRequests.map((request) => (
              <li key={request.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(request.severity)}`}>
                        {request.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {request.type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span>
                        Waiting since {format(new Date(request.timestamp), 'HH:mm')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-500">
                      {getChannelIcon(request.preferredChannel)}
                      <span className="text-sm">
                        {request.preferredChannel.charAt(0).toUpperCase() + 
                         request.preferredChannel.slice(1)}
                      </span>
                    </div>

                    <button
                      onClick={() => onAcceptRequest(request.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Accept Request
                    </button>
                  </div>
                </div>

                {request.severity === 'critical' && (
                  <div className="mt-2 flex items-center text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      Immediate attention required
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No pending requests at this time
          </div>
        )}
      </div>
    </div>
  );
}