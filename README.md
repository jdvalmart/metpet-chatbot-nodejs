# MetPet Chatbot

Chatbot de WhatsApp con respuestas con IA para la fundación de mascotas ValCer.

## Características

- **Integración con WhatsApp**: Recibir y responder mensajes via WhatsApp Cloud API
- **Respuestas con IA**: Respuestas inteligentes usando Ollama (modelos locales como llama3.2)
- **Persistencia de conversaciones**: Base de datos SQLite almacena todas las conversaciones
- **API REST**: Endpoints para consultar historial de conversaciones y estadísticas
- **TypeScript**: Seguridad total de tipos con modo estricto
- **Testing**: 22 tests unitarios con Vitest
- **Logging**: Logging estructurado con Winston
- **Docker**:listo para despliegue en contenedores
- **Seguridad**: Autenticación con API key para endpoints de conversaciones

## Tech Stack

- Node.js 18+
- Express.js
- TypeScript (modo estricto)
- Ollama (IA)
- SQLite (better-sqlite3)
- Vitest (testing)
- Winston (logging)
- Docker

## Inicio Rápido

### Requisitos Previos

- Node.js 18+
- Credenciales de WhatsApp Cloud API
- (Opcional) Ollama para respuestas con IA

### Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de entorno
cp .env_example .env
```

### Configuración

Editar `.env` con tus credenciales:

```env
# WhatsApp API
WEBHOOK_VERIFY_TOKEN=tu_token_de_verificacion
API_TOKEN=tu_token_de_facebook
BUSINESS_PHONE=tu_numero_de_telefono
API_VERSION=v18.0

# Servidor
PORT=3000

# IA (Opcional - establecer en true para habilitar)
AI_ENABLED=false
AI_MODEL=llama3.2
AI_SYSTEM_PROMPT=Eres un asistente útil para una fundación de mascotas llamada ValCer. Mantén respuestas concisas y amigables.

# Seguridad
CONVERSATIONS_API_KEY=tu-api-key-secreta
```

### Ejecución

```bash
# Desarrollo
npm start

# Ejecutar tests
npm test

# Compilar TypeScript
npm run build
```

### Ejecutar con Docker

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f
```

## Endpoints de API

### Webhook

- `GET /webhook` — Verificación de webhook de WhatsApp
- `POST /webhook` — Recibir mensajes entrantes

### Conversaciones (requiere API key)

```bash
# Agregar header: x-api-key: tu-api-key-secreta

# Obtener todas las conversaciones
GET /conversations

# Obtener conversaciones por teléfono
GET /conversations/:phone

# Obtener estadísticas
GET /conversations/stats
```

Ejemplo:

```bash
curl -H "x-api-key: tu-api-key-secreta" \
  http://localhost:3000/conversations/stats
```

## Estructura del Proyecto

```
src/
├── app.ts                    # Servidor Express
├── config/env.ts            # Configuración de entorno
├── controllers/
│   ├── conversationController.ts
│   └── webhookController.ts
├── middleware/
│   ├── auth.ts              # Autenticación con API key
│   └── errorHandler.ts      # Manejo de errores
├── routes/
│   ├── conversationRoutes.ts
│   └── webhookRoutes.ts
└── services/
    ├── aiService.ts         # Integración con Ollama
    ├── database.ts          # Persistencia SQLite
    ├── logger.ts            # Logging con Winston
    ├── messageHandler.ts    # Procesamiento de mensajes
    └── whatsappService.ts   # Cliente de WhatsApp API
```

## Testing

```bash
# Ejecutar tests
npm test

# Ejecutar con cobertura
npm run test:coverage
```

## Configuración de IA (Opcional)

1. Instalar Ollama: https://ollama.com
2. Descargar un modelo: `ollama pull llama3.2`
3. Iniciar Ollama: `ollama serve`
4. Establecer `AI_ENABLED=true` en `.env`

## Licencia

ISC