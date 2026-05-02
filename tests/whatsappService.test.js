import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de axios
vi.mock('axios', () => ({
  default: vi.fn(() => Promise.resolve({ data: {} })),
}));

import whatsappService from '../src/services/whatsappService.js';
import axios from 'axios';

describe('WhatsAppService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should call axios with correct config', async () => {
      await whatsappService.sendMessage('123456789', 'Hello', 'msg-123');

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/messages'),
          data: expect.objectContaining({
            messaging_product: 'whatsapp',
            text: { body: 'Hello' },
          }),
        })
      );
    });

    it('should handle errors without throwing', async () => {
      axios.mockRejectedValueOnce(new Error('Network error'));

      // Should not throw
      await expect(
        whatsappService.sendMessage('123456789', 'Test', 'msg-123')
      ).resolves.not.toThrow();
    });
  });

  describe('markAsRead', () => {
    it('should call axios with read status', async () => {
      await whatsappService.markAsRead('msg-123');

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: expect.objectContaining({
            messaging_product: 'whatsapp',
            status: 'read',
          }),
        })
      );
    });

    it('should handle errors gracefully', async () => {
      axios.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        whatsappService.markAsRead('msg-123')
      ).resolves.not.toThrow();
    });
  });
});