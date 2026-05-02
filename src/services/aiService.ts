import ollama from 'ollama';
import config from '../config/env.js';
import logger from './logger.js';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

class AIService {
  private model: string;
  private enabled: boolean;
  private systemPrompt: string;

  constructor() {
    this.enabled = config.AI_ENABLED;
    this.model = config.AI_MODEL;
    this.systemPrompt = config.AI_SYSTEM_PROMPT;
  }

  async generateResponse(userMessage: string): Promise<string | null> {
    if (!this.enabled) {
      return null;
    }

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const startTime = Date.now();
        const response = await ollama.chat({
          model: this.model,
          messages: [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: userMessage },
          ],
        });

        logger.info('AI response generated', {
          model: this.model,
          duration_ms: Date.now() - startTime,
          message_length: userMessage.length,
        });

        return response.message?.content || null;
      } catch (error) {
        if (attempt < MAX_RETRIES) {
          logger.warn(`AI retry ${attempt + 1}/${MAX_RETRIES}`, {
            model: this.model,
            error: (error as Error).message,
          });
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          logger.error('AI generation failed after retries', {
            model: this.model,
            error: (error as Error).message,
          });
          return null;
        }
      }
    }

    return null;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getModel(): string {
    return this.model;
  }
}

export default new AIService();