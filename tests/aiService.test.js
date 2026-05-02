import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock ollama
vi.mock('ollama', () => ({
  default: {
    chat: vi.fn(),
  },
}));

// Mock config — AI disabled by default
vi.mock('../src/config/env.js', () => ({
  default: {
    AI_ENABLED: false,
    AI_MODEL: 'test-model',
    AI_SYSTEM_PROMPT: 'Test system prompt',
  },
}));

import aiService from '../src/services/aiService.js';

describe('AIService', () => {
  describe('when AI is disabled', () => {
    it('should return null when AI is not enabled', async () => {
      const result = await aiService.generateResponse('Hello');
      expect(result).toBeNull();
    });

    it('should report disabled', () => {
      expect(aiService.isEnabled()).toBe(false);
    });
  });

  describe('model info', () => {
    it('should return the configured model', () => {
      expect(aiService.getModel()).toBe('test-model');
    });
  });
});