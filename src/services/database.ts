import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../data/chatbot.db');

export interface Conversation {
  id: number;
  phone_number: string;
  user_name: string;
  message: string;
  response: string;
  is_ai_response: boolean;
  timestamp: string;
}

class DatabaseService {
  private db: Database.Database;

  constructor() {
    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.initializeTables();
    logger.info('Database initialized', { path: dbPath });
  }

  private initializeTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT NOT NULL,
        user_name TEXT,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        is_ai_response INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for faster queries
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_phone_number ON conversations(phone_number);
      CREATE INDEX IF NOT EXISTS idx_timestamp ON conversations(timestamp);
    `);
  }

  saveConversation(
    phoneNumber: string,
    userName: string | undefined,
    message: string,
    response: string,
    isAIResponse: boolean
  ): number {
    const stmt = this.db.prepare(`
      INSERT INTO conversations (phone_number, user_name, message, response, is_ai_response)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(phoneNumber, userName || null, message, response, isAIResponse ? 1 : 0);
    return result.lastInsertRowid as number;
  }

  getConversations(phoneNumber: string, limit: number = 50): Conversation[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations
      WHERE phone_number = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `);

    return stmt.all(phoneNumber, limit) as Conversation[];
  }

  getAllConversations(limit: number = 100): Conversation[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations
      ORDER BY timestamp DESC
      LIMIT ?
    `);

    return stmt.all(limit) as Conversation[];
  }

  getConversationStats(): { total: number; ai: number; human: number; unique_users: number } {
    const total = this.db.prepare('SELECT COUNT(*) as count FROM conversations').get() as { count: number };
    const ai = this.db.prepare('SELECT COUNT(*) as count FROM conversations WHERE is_ai_response = 1').get() as { count: number };
    const unique = this.db.prepare('SELECT COUNT(DISTINCT phone_number) as count FROM conversations').get() as { count: number };

    return {
      total: total.count,
      ai: ai.count,
      human: total.count - ai.count,
      unique_users: unique.count,
    };
  }

  close(): void {
    this.db.close();
  }
}

export default new DatabaseService();