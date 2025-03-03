import whatsappService from './whatsappService.js';

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim()

        if(this.isGreeting(incomingMessage)){
            await this.sendWelcomeMessage(message.from, message.id, senderInfo)
        }else {
            const response = `Echo: ${message.text.body}`;
            await whatsappService.sendMessage(message.from, response, message.id); 
        }
        await whatsappService.markAsRead(message.id);
    }
  }

  isGreeting(message){
    const greetings = ['hi', 'hello', 'hola','buenos dias', 'buenas tardes', 'buenas noches'];
    return greetings.includes(message);
  }

  getSenderName(senderInfo){
    return senderInfo.profile?.name || senderInfo.wa_id 
  }

  getFirstName(name){
    const firtsName = name.split(' ')[0]
    return firtsName
  }

  async  sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo)
    const firstName = this.getFirstName(name)
    const welcomeMessage = `Hola ${firstName} Bienvenido a su fundación ValCer.`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }
}

export default new MessageHandler();