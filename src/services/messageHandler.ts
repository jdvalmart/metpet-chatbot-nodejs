import whatsappService from './whatsappService.js';
import aiService from './aiService.js';
import databaseService from './database.js';

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
    if (message?.type === 'text' && message.text?.body) {
      const incomingMessage = message.text.body.toLowerCase().trim();
      const userName = this.getSenderName(senderInfo);

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(message.from, message.id, senderInfo);
        // Save welcome message - await to prevent silent failures
        await databaseService.saveConversation(
          message.from,
          userName,
          incomingMessage,
          `Hola ${this.getFirstName(userName) || 'Usuario'} Bienvenido a su fundación ValCer.`,
          false
        );
      } else {
        await this.processUserMessage(message, senderInfo);
      }
      // Await markAsRead to ensure it completes before returning
      await whatsappService.markAsRead(message.id);
    }
  }

  private async processUserMessage(message: WhatsAppMessage, senderInfo: SenderInfo): Promise<void> {
    const userMessage = message.text?.body || '';
    let response: string;
    let isAI = false;

    if (aiService.isEnabled()) {
      const aiResponse = await aiService.generateResponse(userMessage);
      response = aiResponse || `Echo: ${userMessage}`;
      isAI = !!aiResponse;
    } else {
      response = `Echo: ${userMessage}`;
    }

    // Save to database - await to prevent silent failures
    await databaseService.saveConversation(
      message.from,
      this.getSenderName(senderInfo),
      userMessage,
      response,
      isAI
    );

    await whatsappService.sendMessage(message.from, response, message.id);
  }

  private isGreeting(message: string): boolean {
    return GREETINGS.includes(message);
  }

  getSenderName(senderInfo: SenderInfo): string {
    return senderInfo.profile?.name || senderInfo.wa_id;
  }

  getFirstName(name: string): string {
    const first = name.split(' ')[0];
    return first || 'Usuario';
  }

  async sendWelcomeMessage(to: string, messageId: string, senderInfo: SenderInfo): Promise<void> {
    const name = this.getSenderName(senderInfo);
    const firstName = this.getFirstName(name);
    const welcomeMessage = `Hola ${firstName} Bienvenido a su fundación ValCer.`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }
}

export default new MessageHandler();