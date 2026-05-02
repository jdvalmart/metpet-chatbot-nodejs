import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de whatsappService
vi.mock('../src/services/whatsappService.js', () => ({
  default: {
    sendMessage: vi.fn().mockResolvedValue(true),
    markAsRead: vi.fn().mockResolvedValue(true),
  },
}));

import messageHandler from '../src/services/messageHandler.js';
import whatsappService from '../src/services/whatsappService.js';

describe('MessageHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isGreeting', () => {
    it('should return true for greeting messages', () => {
      expect(messageHandler.isGreeting('hello')).toBe(true);
      expect(messageHandler.isGreeting('hi')).toBe(true);
      expect(messageHandler.isGreeting('hola')).toBe(true);
      expect(messageHandler.isGreeting('buenos dias')).toBe(true);
      expect(messageHandler.isGreeting('buenas tardes')).toBe(true);
      expect(messageHandler.isGreeting('buenas noches')).toBe(true);
    });

    it('should return false for non-greeting messages', () => {
      expect(messageHandler.isGreeting('help')).toBe(false);
      expect(messageHandler.isGreeting('thanks')).toBe(false);
      expect(messageHandler.isGreeting('')).toBe(false);
    });

    it('should match exact lowercase greetings', () => {
      // isGreeting expects already lowercase + trimmed input
      // (the transformation happens in handleIncomingMessage)
      expect(messageHandler.isGreeting('hello')).toBe(true);
      expect(messageHandler.isGreeting('hi')).toBe(true);
    });

    it('should return false for non-matching strings', () => {
      expect(messageHandler.isGreeting('hello world')).toBe(false);
      expect(messageHandler.isGreeting('hell')).toBe(false);
    });
  });

  describe('getSenderName', () => {
    it('should return profile name when available', () => {
      const senderInfo = { profile: { name: 'Juan Perez' }, wa_id: '123' };
      expect(messageHandler.getSenderName(senderInfo)).toBe('Juan Perez');
    });

    it('should fall back to wa_id when profile name is missing', () => {
      const senderInfo = { profile: {}, wa_id: '123456' };
      expect(messageHandler.getSenderName(senderInfo)).toBe('123456');
    });

    it('should handle missing profile object', () => {
      const senderInfo = { wa_id: '123456' };
      expect(messageHandler.getSenderName(senderInfo)).toBe('123456');
    });
  });

  describe('getFirstName', () => {
    it('should return first name from full name', () => {
      expect(messageHandler.getFirstName('Juan Perez')).toBe('Juan');
      expect(messageHandler.getFirstName('Maria Garcia Lopez')).toBe('Maria');
    });

    it('should handle single name', () => {
      expect(messageHandler.getFirstName('Juan')).toBe('Juan');
    });
  });

  describe('handleIncomingMessage', () => {
    it('should send welcome message for greetings', async () => {
      const message = {
        type: 'text',
        text: { body: 'Hello' },
        from: '123456789',
        id: 'msg-123',
      };
      const senderInfo = { profile: { name: 'Juan' }, wa_id: '123' };

      await messageHandler.handleIncomingMessage(message, senderInfo);

      expect(whatsappService.sendMessage).toHaveBeenCalledWith(
        '123456789',
        expect.stringContaining('Bienvenido'),
        'msg-123'
      );
    });

    it('should send echo for non-greeting messages', async () => {
      const message = {
        type: 'text',
        text: { body: 'Some message' },
        from: '123456789',
        id: 'msg-123',
      };
      const senderInfo = { profile: { name: 'Juan' }, wa_id: '123' };

      await messageHandler.handleIncomingMessage(message, senderInfo);

      expect(whatsappService.sendMessage).toHaveBeenCalledWith(
        '123456789',
        'Echo: Some message',
        'msg-123'
      );
    });

    it('should mark message as read after processing', async () => {
      const message = {
        type: 'text',
        text: { body: 'Hello' },
        from: '123456789',
        id: 'msg-123',
      };
      const senderInfo = { profile: { name: 'Juan' }, wa_id: '123' };

      await messageHandler.handleIncomingMessage(message, senderInfo);

      expect(whatsappService.markAsRead).toHaveBeenCalledWith('msg-123');
    });

    it('should not process non-text messages', async () => {
      const message = {
        type: 'image',
        from: '123456789',
        id: 'msg-123',
      };

      await messageHandler.handleIncomingMessage(message, {});

      expect(whatsappService.sendMessage).not.toHaveBeenCalled();
      expect(whatsappService.markAsRead).not.toHaveBeenCalled();
    });
  });

  describe('sendWelcomeMessage', () => {
    it('should send welcome message with sender first name', async () => {
      const senderInfo = { profile: { name: 'Juan Perez' }, wa_id: '123' };

      await messageHandler.sendWelcomeMessage('123456789', 'msg-123', senderInfo);

      expect(whatsappService.sendMessage).toHaveBeenCalledWith(
        '123456789',
        'Hola Juan Bienvenido a su fundación ValCer.',
        'msg-123'
      );
    });

    it('should use wa_id when profile name is missing', async () => {
      const senderInfo = { wa_id: '123456' };

      await messageHandler.sendWelcomeMessage('123456789', 'msg-123', senderInfo);

      expect(whatsappService.sendMessage).toHaveBeenCalledWith(
        '123456789',
        'Hola 123456 Bienvenido a su fundación ValCer.',
        'msg-123'
      );
    });
  });
});