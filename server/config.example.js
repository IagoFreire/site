// Configurações do Hytale Server Manager
// Copie este arquivo para config.js e ajuste conforme necessário

export const config = {
  // Porta do servidor backend
  port: 3001,

  // Caminho completo do servidor Hytale
  hytaleServerPath: 'C:\\Users\\Iago\\Documents\\Hytale Server\\2026.01.13-50e69c385\\Server',

  // Nome do executável do servidor
  hytaleExecutable: 'HytaleServer.exe',

  // Máximo de linhas de log a manter em memória
  maxLogs: 1000,

  // Timeout para parada forçada do servidor (em segundos)
  stopTimeout: 5,

  // CORS - origens permitidas (use '*' para permitir todas)
  corsOrigins: '*',

  // WebSocket - configurações
  websocket: {
    // Intervalo de ping para manter conexão ativa (ms)
    pingInterval: 30000,
  },

  // Comandos personalizados (opcional)
  customCommands: {
    // Exemplo: criar atalhos para comandos complexos
    // 'restart': 'stop && sleep 5 && start',
  }
};
