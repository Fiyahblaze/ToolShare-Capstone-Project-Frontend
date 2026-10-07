import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Search, MoreVertical, Plus, Shield, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useMessageStore, Message } from '../store/messageStore';

const MessageCenter: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    addMessage, 
    markAsRead, 
    getTotalUnread,
    getUserConversations 
  } = useMessageStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  // Get user's conversations (including system messages)
  const userConversations = getUserConversations(user!.id);
  const totalUnread = getTotalUnread();
  
  const filteredConversations = userConversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = userConversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user!.id,
      senderName: user!.name,
      senderAvatar: user!.avatar || '',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    addMessage(selectedConversation, message);
    setNewMessage('');
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    markAsRead(conversationId);
  };

  const selectedConv = userConversations.find(c => c.id === selectedConversation);

  const renderMessageContent = (content: string, isSystemMessage?: boolean) => {
    if (!isSystemMessage) {
      return <p className="text-sm">{content}</p>;
    }

    // Render system messages with formatting
    const lines = content.split('\n');
    return (
      <div className="text-sm space-y-2">
        {lines.map((line, index) => {
          if (line.startsWith('🎉 **') && line.endsWith('**')) {
            return (
              <h4 key={index} className="font-bold text-green-700 text-base">
                {line.replace(/\*\*/g, '')}
              </h4>
            );
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <h5 key={index} className="font-semibold text-gray-800 mt-3 mb-1">
                {line.replace(/\*\*/g, '')}
              </h5>
            );
          }
          if (line.startsWith('• ')) {
            return (
              <p key={index} className="text-gray-700 ml-2">
                {line}
              </p>
            );
          }
          if (line.startsWith('✅ ')) {
            return (
              <p key={index} className="text-green-600 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                {line.substring(2)}
              </p>
            );
          }
          if (line.startsWith('*') && line.endsWith('*')) {
            return (
              <p key={index} className="text-xs text-gray-500 italic mt-2">
                {line.replace(/\*/g, '')}
              </p>
            );
          }
          if (line.trim()) {
            return (
              <p key={index} className="text-gray-700">
                {line}
              </p>
            );
          }
          return <br key={index} />;
        })}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Message Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {/* Message Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-8 lg:top-16 lg:bottom-24 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-full lg:max-w-6xl lg:h-auto bg-white rounded-xl shadow-xl z-[70] flex flex-col"
            >
              {/* Mobile Header - Only visible on small screens */}
              <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Main Content */}
              <div className="flex flex-1 min-h-0">
                {/* Conversations List */}
                <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-gray-200 flex-col min-h-0`}>
                  {/* Desktop Header */}
                  <div className="hidden md:block p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Messages</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowNewMessageModal(true)}
                          className="p-1 text-primary-600 hover:text-primary-700 transition-colors"
                          title="New message"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Mobile Search */}
                  <div className="md:hidden p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                      <div className="p-8 text-center">
                        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No conversations found</p>
                      </div>
                    ) : (
                      filteredConversations.map((conversation) => (
                        <button
                          key={conversation.id}
                          onClick={() => handleConversationSelect(conversation.id)}
                          className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                            selectedConversation === conversation.id ? 'bg-primary-50 border-primary-200' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={conversation.participantAvatar}
                                alt={conversation.participantName}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              {conversation.isSystemConversation && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                                  <Shield className="h-3 w-3" />
                                </div>
                              )}
                              {conversation.unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`font-medium truncate ${
                                  conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {conversation.participantName}
                                  {conversation.isSystemConversation && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                      Official
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {conversation.lastMessageTime}
                                </p>
                              </div>
                              
                              {conversation.toolContext && (
                                <p className="text-xs text-primary-600 mb-1 truncate">
                                  Re: {conversation.toolContext.toolTitle}
                                </p>
                              )}
                              
                              <p className={`text-sm truncate ${
                                conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                              }`}>
                                {conversation.lastMessage}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Chat Area */}
                <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-h-0`}>
                  {selectedConv ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* Mobile Back Button */}
                            <button
                              onClick={() => setSelectedConversation(null)}
                              className="md:hidden p-1 text-gray-600 hover:text-gray-900"
                            >
                              <X className="h-5 w-5" />
                            </button>
                            
                            <div className="relative">
                              <img
                                src={selectedConv.participantAvatar}
                                alt={selectedConv.participantName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              {selectedConv.isSystemConversation && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                                  <Shield className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <p className="font-medium text-gray-900 flex items-center">
                                {selectedConv.participantName}
                                {selectedConv.isSystemConversation && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    Official
                                  </span>
                                )}
                              </p>
                              {selectedConv.toolContext && (
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={selectedConv.toolContext.toolImage}
                                    alt={selectedConv.toolContext.toolTitle}
                                    className="w-4 h-4 rounded object-cover"
                                  />
                                  <p className="text-sm text-gray-600 truncate">
                                    {selectedConv.toolContext.toolTitle}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {!selectedConv.isSystemConversation && (
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {selectedConv.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderId === user!.id ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                              message.senderId === user!.id ? 'flex-row-reverse space-x-reverse' : ''
                            } ${message.isSystemMessage ? 'max-w-full' : ''}`}>
                              <img
                                src={message.senderAvatar || ''}
                                alt={message.senderName}
                                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                              />
                              <div
                                className={`px-4 py-3 rounded-lg ${
                                  message.isSystemMessage
                                    ? 'bg-blue-50 border border-blue-200 text-blue-900'
                                    : message.senderId === user!.id
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                {renderMessageContent(message.content, message.isSystemMessage)}
                                <p
                                  className={`text-xs mt-2 ${
                                    message.isSystemMessage
                                      ? 'text-blue-600'
                                      : message.senderId === user!.id
                                      ? 'text-primary-100'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {message.timestamp}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input - Only show for non-system conversations */}
                      {!selectedConv.isSystemConversation && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                              placeholder="Type a message..."
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <button
                              onClick={sendMessage}
                              disabled={!newMessage.trim()}
                              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Send className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Messages</h3>
                        <p className="text-gray-500 mb-4">Select a conversation to start messaging</p>
                        <button
                          onClick={() => setShowNewMessageModal(true)}
                          className="btn-primary"
                        >
                          Start New Conversation
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Message Modal */}
      <AnimatePresence>
        {showNewMessageModal && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-[80]"
              onClick={() => setShowNewMessageModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 bg-white rounded-xl shadow-xl z-[90] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send to
                  </label>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button className="flex-1 btn-primary">
                  Send Message
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageCenter;