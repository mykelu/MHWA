import React, { useState, useRef, useEffect } from 'react';
import { GroupChat, GroupMessage } from '../../types/forum';
import { Send, Flag, AlertCircle, Users } from 'lucide-react';
import { format } from 'date-fns';

interface GroupChatRoomProps {
  group: GroupChat;
  messages: GroupMessage[];
  onSendMessage: (content: string, isAnonymous: boolean) => Promise<void>;
  onReportMessage: (messageId: string, reason: string) => Promise<void>;
}

export function GroupChatRoom({
  group,
  messages,
  onSendMessage,
  onReportMessage,
}: GroupChatRoomProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<GroupMessage | null>(null);
  const [reportReason, setReportReason] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await onSendMessage(newMessage, isAnonymous);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleReport = async () => {
    if (!selectedMessage || !reportReason) return;

    try {
      await onReportMessage(selectedMessage.id, reportReason);
      setShowReportModal(false);
      setSelectedMessage(null);
      setReportReason('');
    } catch (error) {
      console.error('Failed to report message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Group Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">{group.name}</h2>
            <p className="text-sm text-gray-500">{group.description}</p>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-5 w-5 mr-2" />
            <span>{group.members.length} members</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="group relative">
            <div className={`flex items-start space-x-3 ${
              message.moderationStatus === 'rejected' ? 'opacity-50' : ''
            }`}>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    {message.isAnonymous ? 'Anonymous' : message.authorId}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {format(new Date(message.createdAt), 'HH:mm')}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  {message.content}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedMessage(message);
                  setShowReportModal(true);
                }}
                className="hidden group-hover:block p-1 rounded-full hover:bg-gray-100"
              >
                <Flag className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {message.moderationStatus === 'flagged' && (
              <div className="mt-1 text-xs text-yellow-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                This message has been flagged for review
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-200">
        <form onSubmit={handleSend}>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={1}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-500">
                Send anonymously
              </span>
            </label>
          </div>
        </form>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Message</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please provide a reason for reporting this message..."
              className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedMessage(null);
                  setReportReason('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}