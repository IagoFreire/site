# Hytale Server Manager - Backend

Backend Node.js para gerenciar o servidor Hytale através da interface web.

## Instalação

1. Navegue até a pasta do servidor:
```bash
cd server
```

2. Instale as dependências:
```bash
npm install
```

## Configuração

Edite o arquivo `index.js` e ajuste as seguintes constantes se necessário:

```javascript
const HYTALE_SERVER_PATH = 'C:\\Users\\Iago\\Documents\\Hytale Server\\2026.01.13-50e69c385\\Server';
const HYTALE_EXECUTABLE = 'HytaleServer.exe';
```

## Executar

### Modo Produção
```bash
npm start
```

### Modo Desenvolvimento (com auto-reload)
```bash
npm run dev
```

O servidor irá rodar na porta **3001**.

## API Endpoints

### GET /api/hytale/status
Retorna o status atual do servidor Hytale.

**Resposta:**
```json
{
  "running": true,
  "pid": 12345,
  "uptime": 3600
}
```

### GET /api/hytale/logs
Retorna os últimos logs do servidor.

**Query Parameters:**
- `limit` (opcional): Número de logs a retornar (padrão: 100)

### POST /api/hytale/start
Inicia o servidor Hytale.

### POST /api/hytale/stop
Para o servidor Hytale.

### POST /api/hytale/command
Envia um comando para o servidor Hytale.

**Body:**
```json
{
  "command": "say Hello World"
}
```

## WebSocket

O servidor WebSocket roda na mesma porta do servidor HTTP (3001).

**URL:** `ws://localhost:3001`

### Mensagens enviadas pelo servidor:

#### Log Entry
```json
{
  "type": "log",
  "log": {
    "timestamp": "2026-01-19T12:00:00.000Z",
    "message": "Server started",
    "type": "info"
  }
}
```

#### History (ao conectar)
```json
{
  "type": "history",
  "logs": [...]
}
```

#### Status Update
```json
{
  "type": "status",
  "running": true,
  "pid": 12345
}
```

## Segurança

⚠️ **IMPORTANTE**: Este servidor não possui autenticação! Use apenas em redes confiáveis.

Para uso em produção, considere adicionar:
- Autenticação JWT
- HTTPS
- Rate limiting
- Firewall configurado corretamente
