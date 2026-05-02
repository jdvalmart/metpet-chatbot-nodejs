import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  WEBHOOK_VERIFY_TOKEN: string | undefined;
  API_TOKEN: string | undefined;
  BUSINESS_PHONE: string | undefined;
  API_VERSION: string | undefined;
  PORT: number;
}

const config: Config = {
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN,
  API_TOKEN: process.env.API_TOKEN,
  BUSINESS_PHONE: process.env.BUSINESS_PHONE,
  API_VERSION: process.env.API_VERSION,
  PORT: parseInt(process.env.PORT || '3000', 10),
};

export default config;