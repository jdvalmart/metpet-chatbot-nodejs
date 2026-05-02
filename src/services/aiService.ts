import ollama from 'ollama';
import config from '../config/env.js';

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

    try {
      const response = await ollama.chat({
        model: this.model,
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: userMessage },
        ],
      });

      return response.message?.content || null;
    } catch (error) {
      console.error('AI generation error:', error);
      return null;
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getModel(): string {
    return this.model;
  }
}

export default new AIService();