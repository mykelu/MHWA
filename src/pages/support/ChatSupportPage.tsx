import React from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { useChat } from '../../hooks/useChat';
import { BackButton } from '../../components/common/BackButton';

export function ChatSupportPage() {
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    sendMessage,
    reportMessage,
    blockUser,
    setActiveConversation,
  } = useChat();

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
            
            <div className="bg-white rounded-lg shadow">
              <div className="h-[calc(100vh-12rem)]">
                <ChatInterface
                  conversations={conversations}
                  activeConversation={activeConversation}
                  messages={messages}
                  loading={loading}
                  error={error}
                  onSendMessage={sendMessage}
                  onReportMessage={reportMessage}
                  onBlockUser={blockUser}
                  onConversationSelect={setActiveConversation}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}