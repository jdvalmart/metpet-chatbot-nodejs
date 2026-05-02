# MetPet Chatbot

WhatsApp Cloud API chatbot with AI-powered responses for pet foundation ValCer.

## Features

- **WhatsApp Integration**: Receive and respond to messages via WhatsApp Cloud API
- **AI Responses**: Intelligent responses using Ollama (local LLMs like llama3.2)
- **Conversation Persistence**: SQLite database stores all conversations
- **REST API**: Endpoints to query conversation history and statistics
- **TypeScript**: Full type safety with strict mode
- **Testing**: 22 unit tests with Vitest
- **Logging**: Structured logging with Winston
- **Docker**: Containerized deployment ready
- **Security**: API key authentication for conversation endpoints

## Tech Stack

- Node.js 18+
- Express.js
- TypeScript (strict mode)
- Ollama (AI)
- SQLite (better-sqlite3)
- Vitest (testing)
- Winston (logging)
- Docker

## Quick Start

### Prerequisites

- Node.js 18+
- WhatsApp Cloud API credentials
- (Optional) Ollama for AI responses

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env_example .env
```

### Configuration

Edit `.env` with your credentials:

```env
# WhatsApp API
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
API_TOKEN=your_facebook_access_token
BUSINESS_PHONE=your_business_phone_number
API_VERSION=v18.0

# Server
PORT=3000

# AI (Optional - set to true to enable)
AI_ENABLED=false
AI_MODEL=llama3.2
AI_SYSTEM_PROMPT=You are a helpful assistant for a pet foundation called ValCer. Keep responses concise and friendly.

# Security
CONVERSATIONS_API_KEY=your-secret-api-key
```

### Running

```bash
# Development
npm start

# Run tests
npm test

# Build TypeScript
npm run build
```

### Running with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

## API Endpoints

### Webhook

- `GET /webhook` — WhatsApp webhook verification
- `POST /webhook` — Receive incoming messages

### Conversations (requires API key)

```bash
# Add header: x-api-key: your-secret-api-key

# Get all conversations
GET /conversations

# Get conversations by phone
GET /conversations/:phone

# Get statistics
GET /conversations/stats
```

Example:

```bash
curl -H "x-api-key: your-secret-api-key" \
  http://localhost:3000/conversations/stats
```

## Project Structure

```
src/
├── app.ts                    # Express server
├── config/env.ts            # Environment configuration
├── controllers/
│   ├── conversationController.ts
│   └── webhookController.ts
├── middleware/
│   ├── auth.ts              # API key authentication
│   └── errorHandler.ts      # Error handling
├── routes/
│   ├── conversationRoutes.ts
│   └── webhookRoutes.ts
└── services/
    ├── aiService.ts         # Ollama AI integration
    ├── database.ts          # SQLite persistence
    ├── logger.ts            # Winston logging
    ├── messageHandler.ts    # Message processing
    └── whatsappService.ts   # WhatsApp API client
```

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## AI Setup (Optional)

1. Install Ollama: https://ollama.com
2. Pull a model: `ollama pull llama3.2`
3. Start Ollama: `ollama serve`
4. Set `AI_ENABLED=true` in `.env`

## License

ISC