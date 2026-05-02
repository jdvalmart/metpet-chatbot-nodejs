import whatsappService from './whatsappService.js';
import aiService from './aiService.js';

interface WhatsAppMessage {
  type: string;
  text?: {
    body: string;
  };
  from: string;
  id: string;
}

interface SenderInfo {
  profile?: {
    name?: string;
  };
  wa_id: string;
}

const GREETINGS = ['hi', 'hello', 'hola', 'buenos dias', 'buenas tardes', 'buenas noches'];

class MessageHandler {
  async handleIncomingMessage(message: WhatsAppMessage, senderInfo: SenderInfo): Promise<void> {
    if (message?.type === 'text' && message.text) {
      const incomingMessage = message.text.body.toLowerCase().trim();

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(message.from, message.id, senderInfo);
      } else {
        await this.processUserMessage(message);
      }
      await whatsappService.markAsRead(message.id);
    }
  }

  private async processUserMessage(message: WhatsAppMessage): Promise<void> {
    let response: string;

    if (aiService.isEnabled()) {
      const aiResponse = await aiService.generateResponse(message.text?.body || '');
      response = aiResponse || `Echo: ${message.text?.body}`;
    } else {
      response = `Echo: ${message.text?.body}`;
    }

    await whatsappService.sendMessage(message.from, response, message.id);
  }

  isGreeting(message: string): boolean {
    return GREETINGS.includes(message);
  }

  getSenderName(senderInfo: SenderInfo): string {
    return senderInfo.profile?.name || senderInfo.wa_id;
  }

  getFirstName(name: string): string {
    return name.split(' ')[0];
  }

  async sendWelcomeMessage(to: string, messageId: string, senderInfo: SenderInfo): Promise<void> {
    const name = this.getSenderName(senderInfo);
    const firstName = this.getFirstName(name);
    const welcomeMessage = `Hola ${firstName} Bienvenido a su fundación ValCer.`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }
}

export default new MessageHandler();