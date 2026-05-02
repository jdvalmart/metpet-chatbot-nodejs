import axios, { AxiosError } from 'axios';
import config from '../config/env.js';

interface MessagePayload {
  messaging_product: string;
  to: string;
  text: { body: string };
  context?: { message_id: string };
}

interface MarkAsReadPayload {
  messaging_product: string;
  status: string;
  message_id: string;
}

class WhatsAppService {
  async sendMessage(to: string, body: string, messageId: string): Promise<void> {
    try {
      const payload: MessagePayload = {
        messaging_product: 'whatsapp',
        to,
        text: { body },
        context: {
          message_id: messageId,
        },
      };

      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: payload,
      });
    } catch (error) {
      const err = error as AxiosError;
      console.error('Error sending message:', err.message);
    }
  }

  async markAsRead(messageId: string): Promise<void> {
    try {
      const payload: MarkAsReadPayload = {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      };

      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: payload,
      });
    } catch (error) {
      const err = error as AxiosError;
      console.error('Error marking message as read:', err.message);
    }
  }
}

export default new WhatsAppService();