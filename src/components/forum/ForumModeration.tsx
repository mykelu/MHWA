import React, { useState } from 'react';
import { ForumPost, ForumComment, ModerationType } from '../../types/forum';
import { AlertTriangle, CheckCircle, XCircle, MessageSquare, Flag } from 'lucide-react';

interface ForumModerationProps {
  posts: ForumPost[];
  comments: ForumComment[];
  onModeratePost: (postId: string, status: ModerationType, notes?: string) => Promise<void>;
  onModerateComment: (commentId: string, status: ModerationType, notes?: string) => Promise<void>;
}

export function ForumModeration({
  posts,
  comments,
  onModeratePost,
  onModerateComment,
}: ForumModerationProps) {
  const [selectedItem, setSelectedItem] = useState<ForumPost | ForumComment | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');

  const handleModeration = async (status: ModerationType) => {
    if (!selectedItem) return;

    try {
      if ('title' in selectedItem) {
        await onModeratePost(selectedItem.id, status, moderationNotes);
      } else {
        await onModerateComment(selectedItem.id, status, moderationNotes);
      }
      setSelectedItem(null);
      setModerationNotes('');
    } catch (error) {
      console.error('Moderation failed:', error);
    }
  };

  const getStatusBadge = (status: ModerationType) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Flag className="w-4 h-4 mr-1" />
            Flagged
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Content Moderation Queue</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and moderate pending content
          </p>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-4">
            {[...posts, ...comments]
              .filter(item => item.moderationStatus === 'pending' || item.moderationStatus === 'flagged')
              .map(item => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {'title' in item ? (
                        <>
                          <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">{item.content}</p>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-sm text-gray-500">{item.content}</p>
                        </div>
                      )}
                      <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                        <span>By: {item.isAnonymous ? 'Anonymous' : item.authorId}</span>
                        {getStatusBadge(item.moderationStatus)}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="ml-4 text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Review Content
            </h3>

            <div className="space-y-4">
              {'title' in selectedItem && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.title}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.content}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Moderation Notes
                </label>
                <textarea
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleModeration('rejected')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => handleModeration('approved')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setModerationNotes('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}