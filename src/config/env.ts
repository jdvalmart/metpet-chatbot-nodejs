import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  WEBHOOK_VERIFY_TOKEN: string | undefined;
  API_TOKEN: string | undefined;
  BUSINESS_PHONE: string | undefined;
  API_VERSION: string | undefined;
  PORT: number;
  AI_ENABLED: boolean;
  AI_MODEL: string;
  AI_SYSTEM_PROMPT: string;
  CONVERSATIONS_API_KEY: string | undefined;
}

const config: Config = {
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN,
  API_TOKEN: process.env.API_TOKEN,
  BUSINESS_PHONE: process.env.BUSINESS_PHONE,
  API_VERSION: process.env.API_VERSION,
  PORT: parseInt(process.env.PORT || '3000', 10),
  AI_ENABLED: process.env.AI_ENABLED === 'true',
  AI_MODEL: process.env.AI_MODEL || 'llama3.2',
  AI_SYSTEM_PROMPT: process.env.AI_SYSTEM_PROMPT || 'You are a helpful assistant for a pet foundation called ValCer. Keep responses concise and friendly.',
  CONVERSATIONS_API_KEY: process.env.CONVERSATIONS_API_KEY,
};

export default config;