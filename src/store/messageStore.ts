import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  isSystemMessage?: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isSystemConversation?: boolean;
  toolContext?: {
    toolId: string;
    toolTitle: string;
    toolImage: string;
  };
  messages: Message[];
}

interface MessageState {
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
  addMessage: (conversationId: string, message: Message) => void;
  markAsRead: (conversationId: string) => void;
  createToolPostingConfirmation: (userId: string, toolData: any) => void;
  getTotalUnread: () => number;
  getUserConversations: (userId: string) => Conversation[];
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      conversations: [],
      
      addConversation: (conversation) => set((state) => ({
        conversations: [...state.conversations, conversation]
      })),
      
      addMessage: (conversationId, message) => set((state) => ({
        conversations: state.conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
              unreadCount: message.senderId !== conv.participantId ? conv.unreadCount + 1 : conv.unreadCount
            };
          }
          return conv;
        })
      })),
      
      markAsRead: (conversationId) => set((state) => ({
        conversations: state.conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map(msg => ({ ...msg, read: true }))
            };
          }
          return conv;
        })
      })),
      
      createToolPostingConfirmation: (userId, toolData) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = new Date().toLocaleDateString();
        
        const confirmationMessage = `🎉 **Tool Posted Successfully!**

Your tool "${toolData.title}" has been posted to ToolShare and is now live for the community to discover and rent.

**📋 Tool Details:**
• **Category:** ${toolData.category}
• **Daily Rate:** $${toolData.price.daily}
${toolData.price.hourly ? `• **Hourly Rate:** $${toolData.price.hourly}` : ''}
${toolData.price.weekly ? `• **Weekly Rate:** $${toolData.price.weekly}` : ''}
• **Security Deposit:** $${toolData.deposit}
• **Location:** ${toolData.location.city}, ${toolData.location.state}

**🚀 What's Next:**
✅ Your tool is now visible to nearby renters
✅ You'll receive notifications for rental requests
✅ Messages from interested renters will appear here
✅ Track your earnings in the Dashboard

**💡 Pro Tips:**
• Respond quickly to rental requests to boost your rating
• Keep your tool description updated and accurate
• Upload high-quality photos to attract more renters
• Set competitive pricing using our Smart Pricing feature

**📱 Manage Your Listing:**
• View analytics in your Dashboard
• Edit details anytime in "My Tools"
• Enable auto-accept for verified renters
• Use Smart Pricing for optimal rates

Thank you for sharing with the ToolShare community! 🛠️

*Posted on ${dateString} at ${timestamp}*`;

        const systemConversationId = `system-${userId}`;
        const existingConversation = get().conversations.find(c => c.id === systemConversationId);
        
        const confirmationMessageObj: Message = {
          id: `msg-${Date.now()}`,
          senderId: 'system',
          senderName: 'ToolShare Admin',
          senderAvatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: confirmationMessage,
          timestamp,
          read: false,
          isSystemMessage: true
        };

        if (existingConversation) {
          // Add message to existing system conversation
          get().addMessage(systemConversationId, confirmationMessageObj);
        } else {
          // Create new system conversation
          const systemConversation: Conversation = {
            id: systemConversationId,
            participantId: 'system',
            participantName: 'ToolShare Admin',
            participantAvatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150',
            lastMessage: 'Tool posting confirmation',
            lastMessageTime: timestamp,
            unreadCount: 1,
            isSystemConversation: true,
            toolContext: {
              toolId: toolData.id,
              toolTitle: toolData.title,
              toolImage: toolData.images[0]
            },
            messages: [confirmationMessageObj]
          };
          
          get().addConversation(systemConversation);
        }
      },
      
      getTotalUnread: () => {
        return get().conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      },
      
      getUserConversations: (userId) => {
        return get().conversations.filter(conv => 
          conv.participantId === userId || conv.id.includes(userId)
        );
      }
    }),
    {
      name: 'message-storage',
    }
  )
);