import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Flag, Ban, AlertCircle } from 'lucide-react';
import { Conversation, Message } from '../../types/chat';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  onSendMessage: (content: string, recipientId: string, isAnonymous?: boolean) => Promise<void>;
  onReportMessage: (messageId: string, reason: string, description?: string) => Promise<void>;
  onBlockUser: (userId: string) => Promise<void>;
  onConversationSelect: (conversation: Conversation) => void;
}

export function ChatInterface({
  conversations,
  activeConversation,
  messages,
  loading,
  error,
  onSendMessage,
  onReportMessage,
  onBlockUser,
  onConversationSelect,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reportReason, setReportReason] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const recipientId = activeConversation.participants.find(
        id => id !== 'current-user'
      ) || '';
      await onSendMessage(newMessage, recipientId, isAnonymous);
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

  const handleBlock = async (userId: string) => {
    try {
      await onBlockUser(userId);
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-1/4 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Conversations</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onConversationSelect(conversation)}
              className={`w-full p-4 text-left hover:bg-gray-50 ${
                activeConversation?.id === conversation.id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {conversation.participants.join(', ')}
                </span>
                {conversation.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {format(new Date(conversation.lastMessage.timestamp), 'HH:mm')}
                  </span>
                )}
              </div>
              {conversation.lastMessage && (
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage.content}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {activeConversation.participants.join(', ')}
              </h3>
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === 'current-user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div className="group relative">
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === 'current-user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.isAnonymous && (
                        <span className="text-xs opacity-75">Anonymous</span>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </span>
                    </div>
                    
                    {/* Message Actions */}
                    <div className="absolute top-0 right-0 -mr-8 hidden group-hover:flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setSelectedMessage(message);
                          setShowReportModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        title="Report message"
                      >
                        <Flag className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleBlock(message.senderId)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        title="Block user"
                      >
                        <Ban className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full resize-none border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
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
              <div className="mt-2 flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Send anonymously</span>
                </label>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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