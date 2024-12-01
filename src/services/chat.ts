import { io, Socket } from 'socket.io-client';
import { Message, Conversation, MessageReport } from '../types/chat';
import { generateKeyPair, encryptMessage, decryptMessage } from '../utils/encryption';

class ChatService {
  private socket: Socket | null = null;
  private keyPair: { publicKey: string; privateKey: string } | null = null;

  constructor() {
    this.keyPair = generateKeyPair();
  }

  connect(userId: string, token: string) {
    this.socket = io('/chat', {
      auth: { token },
      query: { userId },
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.socket?.emit('key_exchange', { userId, publicKey: this.keyPair?.publicKey });
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('message', this.handleIncomingMessage.bind(this));
    this.socket.on('message_status', this.handleMessageStatus.bind(this));
    this.socket.on('user_status', this.handleUserStatus.bind(this));
  }

  private handleIncomingMessage(encryptedMessage: string) {
    try {
      if (!this.keyPair?.privateKey) throw new Error('No private key available');
      
      // Decrypt and process message
      // Implementation details would go here
    } catch (error) {
      console.error('Error handling incoming message:', error);
    }
  }

  private handleMessageStatus(update: { messageId: string; status: string }) {
    // Handle message status updates
    console.log('Message status update:', update);
  }

  private handleUserStatus(update: { userId: string; status: 'online' | 'offline' }) {
    // Handle user status updates
    console.log('User status update:', update);
  }

  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'status'>) {
    try {
      if (!this.socket || !this.keyPair) {
        throw new Error('Chat service not properly initialized');
      }

      const encryptedContent = encryptMessage(
        message.content,
        this.keyPair.privateKey,
        message.recipientId // This would actually be the recipient's public key
      );

      const messageToSend = {
        ...message,
        encryptedContent,
        timestamp: new Date().toISOString(),
      };

      return new Promise((resolve, reject) => {
        this.socket?.emit('send_message', messageToSend, (response: any) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response);
          }
        });
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async reportMessage(report: Omit<MessageReport, 'id' | 'timestamp' | 'status'>) {
    return new Promise((resolve, reject) => {
      this.socket?.emit('report_message', report, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async blockUser(userId: string) {
    return new Promise((resolve, reject) => {
      this.socket?.emit('block_user', { userId }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async unblockUser(userId: string) {
    return new Promise((resolve, reject) => {
      this.socket?.emit('unblock_user', { userId }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.keyPair = null;
  }
}

export const chatService = new ChatService();