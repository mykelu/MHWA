import React, { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { GroupChatRoom } from '../../components/forum/GroupChatRoom';
import { ForumModeration } from '../../components/forum/ForumModeration';
import { BackButton } from '../../components/common/BackButton';
import { useAuth } from '../../contexts/AuthContext';
import { GroupChat, GroupMessage, ForumPost, ForumComment } from '../../types/forum';
import { v4 as uuidv4 } from 'uuid';

export function ForumPage() {
  const { state: { user } } = useAuth();
  const [activeGroup, setActiveGroup] = useState<GroupChat | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [comments, setComments] = useState<ForumComment[]>([]);

  // Simulated group data
  const groups: GroupChat[] = [
    {
      id: '1',
      name: 'Anxiety Support',
      description: 'A safe space to discuss anxiety and coping strategies',
      category: 'support',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      moderators: ['mod1', 'mod2'],
      members: ['user1', 'user2', 'user3'],
      isPrivate: false,
      rules: [
        'Be respectful and supportive',
        'No hate speech or bullying',
        'Maintain confidentiality'
      ]
    }
  ];

  const handleSendMessage = async (content: string, isAnonymous: boolean) => {
    if (!activeGroup || !user) return;

    const newMessage: GroupMessage = {
      id: uuidv4(),
      groupId: activeGroup.id,
      content,
      authorId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAnonymous,
      moderationStatus: 'pending'
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleReportMessage = async (messageId: string, reason: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, moderationStatus: 'flagged', moderationNotes: reason }
          : msg
      )
    );
  };

  const handleModeratePost = async (postId: string, status: 'pending' | 'approved' | 'rejected' | 'flagged', notes?: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              moderationStatus: status,
              moderatedBy: user?.id,
              moderatedAt: new Date().toISOString(),
              moderationNotes: notes
            }
          : post
      )
    );
  };

  const handleModerateComment = async (commentId: string, status: 'pending' | 'approved' | 'rejected' | 'flagged', notes?: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              moderationStatus: status,
              moderatedBy: user?.id,
              moderatedAt: new Date().toISOString(),
              moderationNotes: notes
            }
          : comment
      )
    );
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Groups List */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Discussion Groups</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {groups.map(group => (
                      <button
                        key={group.id}
                        onClick={() => setActiveGroup(group)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                          activeGroup?.id === group.id ? 'bg-gray-50' : ''
                        }`}
                      >
                        <h3 className="text-sm font-medium text-gray-900">{group.name}</h3>
                        <p className="mt-1 text-sm text-gray-500 truncate">{group.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {user?.role === 'moderator' && (
                  <div className="mt-8">
                    <ForumModeration
                      posts={posts}
                      comments={comments}
                      onModeratePost={handleModeratePost}
                      onModerateComment={handleModerateComment}
                    />
                  </div>
                )}
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-2">
                {activeGroup ? (
                  <GroupChatRoom
                    group={activeGroup}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onReportMessage={handleReportMessage}
                  />
                ) : (
                  <div className="bg-white shadow rounded-lg p-6 text-center">
                    <p className="text-gray-500">Select a group to join the discussion</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}