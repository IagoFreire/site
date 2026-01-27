import express from 'express';
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Configuração do servidor Hytale
const HYTALE_SERVER_PATH = 'C:\\Users\\Iago\\Documents\\Hytale Server\\2026.01.13-50e69c385\\Server';
const HYTALE_EXECUTABLE = 'HytaleServer.jar';
const HYTALE_ASSETS = 'Assets.zip'; // Arquivo de assets
const USE_JAVA = true; // true para arquivos .jar, false para .exe

let serverProcess = null;
let serverLogs = [];
const MAX_LOGS = 300; // Máximo de linhas de log a manter na memória

app.use(cors());
app.use(express.json());

// Função para adicionar log
function addLog(message, type = 'info') {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message: message.toString().trim(),
    type
  };
  serverLogs.push(logEntry);
  if (serverLogs.length > MAX_LOGS) {
    serverLogs.shift();
  }
  // Broadcast para todos os clientes WebSocket
  broadcastLog(logEntry);
}

// Verificar se o servidor está rodando
app.get('/api/hytale/status', (req, res) => {
  res.json({
    running: serverProcess !== null && !serverProcess.killed,
    pid: serverProcess?.pid || null,
    uptime: serverProcess?.uptime || 0
  });
});

// Obter logs
app.get('/api/hytale/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  res.json({
    logs: serverLogs.slice(-limit)
  });
});

// Iniciar servidor
app.post('/api/hytale/start', (req, res) => {
  if (serverProcess && !serverProcess.killed) {
    return res.status(400).json({ 
      success: false, 
      message: 'Servidor já está rodando' 
    });
  }

  try {
    // Verificar se o diretório existe
    if (!fs.existsSync(HYTALE_SERVER_PATH)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Diretório do servidor não encontrado' 
      });
    }

    // Verificar se o executável existe
    const executablePath = join(HYTALE_SERVER_PATH, HYTALE_EXECUTABLE);
    if (!fs.existsSync(executablePath)) {
      return res.status(400).json({ 
        success: false, 
        message: `Arquivo não encontrado: ${HYTALE_EXECUTABLE}` 
      });
    }

    // Verificar se os assets existem (se especificado)
    if (HYTALE_ASSETS) {
      const assetsPath = join(HYTALE_SERVER_PATH, HYTALE_ASSETS);
      if (!fs.existsSync(assetsPath)) {
        return res.status(400).json({ 
          success: false, 
          message: `Assets não encontrados: ${HYTALE_ASSETS}` 
        });
      }
    }

    // Limpar logs anteriores
    serverLogs = [];
    addLog('Iniciando servidor Hytale...', 'system');

    // Spawnar o processo do servidor
    let command, args;
    if (USE_JAVA && HYTALE_EXECUTABLE.endsWith('.jar')) {
      // Para arquivos JAR, usar Java
      command = 'java';
      args = ['-jar', HYTALE_EXECUTABLE];
      
      // Adicionar argumentos de assets se especificado
      if (HYTALE_ASSETS) {
        args.push('--assets', HYTALE_ASSETS);
      }
      
      // Adicionar parâmetro para aceitar plugins early
      args.push('--accept-early-plugins');
      
      const argsStr = HYTALE_ASSETS ? `--assets ${HYTALE_ASSETS} --accept-early-plugins` : '--accept-early-plugins';
      addLog(`Executando: java -jar ${HYTALE_EXECUTABLE} ${argsStr}`, 'system');
    } else {
      // Para executáveis .exe ou .bat
      command = HYTALE_EXECUTABLE;
      args = [];
      addLog(`Executando: ${HYTALE_EXECUTABLE}`, 'system');
    }

    serverProcess = spawn(command, args, {
      cwd: HYTALE_SERVER_PATH,
      shell: true
    });

    serverProcess.startTime = Date.now();

    // Capturar stdout
    serverProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          // Detectar warnings
          if (line.match(/WARNING|WARN\]/i)) {
            addLog(line, 'warning');
          } else {
            addLog(line, 'stdout');
          }
        }
      });
    });

    // Capturar stderr
    serverProcess.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          // Detectar warnings no stderr também
          if (line.match(/WARNING|WARN\]/i)) {
            addLog(line, 'warning');
          } else {
            addLog(line, 'stderr');
          }
        }
      });
    });

    // Capturar quando o processo terminar
    serverProcess.on('close', (code) => {
      addLog(`Servidor encerrado com código ${code}`, 'system');
      serverProcess = null;
    });

    serverProcess.on('error', (error) => {
      addLog(`Erro ao iniciar servidor: ${error.message}`, 'error');
      serverProcess = null;
    });

    // Adicionar propriedade de uptime
    Object.defineProperty(serverProcess, 'uptime', {
      get: function() {
        return serverProcess && serverProcess.startTime 
          ? Math.floor((Date.now() - serverProcess.startTime) / 1000)
          : 0;
      }
    });

    res.json({ 
      success: true, 
      message: 'Servidor iniciado com sucesso',
      pid: serverProcess.pid 
    });
  } catch (error) {
    addLog(`Erro ao iniciar servidor: ${error.message}`, 'error');
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Parar servidor
app.post('/api/hytale/stop', (req, res) => {
  if (!serverProcess || serverProcess.killed) {
    return res.status(400).json({ 
      success: false, 
      message: 'Servidor não está rodando' 
    });
  }

  try {
    addLog('Parando servidor...', 'system');
    
    // Tentar parar graciosamente primeiro
    serverProcess.stdin.write('stop\n');
    
    // Se não parar em 5 segundos, força o encerramento
    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill('SIGTERM');
        setTimeout(() => {
          if (serverProcess && !serverProcess.killed) {
            serverProcess.kill('SIGKILL');
          }
        }, 2000);
      }
    }, 5000);

    res.json({ 
      success: true, 
      message: 'Comando de parada enviado' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Enviar comando para o servidor
app.post('/api/hytale/command', (req, res) => {
  if (!serverProcess || serverProcess.killed) {
    return res.status(400).json({ 
      success: false, 
      message: 'Servidor não está rodando' 
    });
  }

  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ 
      success: false, 
      message: 'Comando não fornecido' 
    });
  }

  try {
    addLog(`> ${command}`, 'command');
    serverProcess.stdin.write(command + '\n');
    res.json({ 
      success: true, 
      message: 'Comando enviado' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Deletar mundo (APENAS DELETA, NÃO REINICIA)
app.post('/api/hytale/repair-chunks', async (req, res) => {
  try {
    const wasRunning = serverProcess && !serverProcess.killed;
    
    // Verificar se servidor está rodando
    if (wasRunning) {
      addLog('⚠ ATENÇÃO: Servidor está rodando!', 'error');
      addLog('PARE O SERVIDOR PRIMEIRO antes de deletar o mundo', 'error');
      return res.status(400).json({
        success: false,
        message: 'Servidor está rodando! Pare o servidor primeiro.',
        chunksFound: 0,
        filesDeleted: 0,
        serverRestarted: false
      });
    }

    // Analisar logs para encontrar chunks corrompidos
    const corruptedChunks = new Set();
    const errorPatterns = [
      /Failed to load chunk!\s+(-?\d+),\s+(-?\d+)/g,
      /Failed to set chunk ticking!\s+(-?\d+),\s+(-?\d+)/g,
      /ChunkStore.*Failed.*chunk.*(-?\d+),\s+(-?\d+)/g
    ];
    
    serverLogs.forEach(log => {
      errorPatterns.forEach(pattern => {
        const matches = [...log.message.matchAll(pattern)];
        matches.forEach(match => {
          if (match[1] && match[2]) {
            corruptedChunks.add(`${match[1]},${match[2]}`);
          }
        });
      });
    });

    if (corruptedChunks.size === 0) {
      return res.json({
        success: true,
        message: 'Nenhum chunk corrompido encontrado nos logs',
        chunksFound: 0,
        filesDeleted: 0,
        serverRestarted: false
      });
    }

    addLog(`Encontrados ${corruptedChunks.size} chunks corrompidos únicos`, 'system');
    addLog('Iniciando reparação profunda do mundo...', 'system');
    
    // MODO AGRESSIVO: Deletar pastas inteiras de mundo
    const { execSync } = await import('child_process');
    const { join: pathJoin } = await import('path');
    
    let deletedFolders = 0;
    const worldPaths = [
      pathJoin(HYTALE_SERVER_PATH, 'worlds'),
      pathJoin(HYTALE_SERVER_PATH, 'world'),
      pathJoin(HYTALE_SERVER_PATH, 'saves')
    ];

    // Fazer backup antes de deletar
    const backupName = `world_backup_${Date.now()}`;
    const backupPath = pathJoin(HYTALE_SERVER_PATH, backupName);
    
    addLog('Criando backup do mundo antes de deletar...', 'system');
    
    for (const worldPath of worldPaths) {
      addLog(`Verificando: ${worldPath}`, 'system');
      
      if (fs.existsSync(worldPath)) {
        addLog(`✓ Pasta encontrada: ${worldPath}`, 'system');
        const worldName = worldPath.split(/[\\/]/).pop();
        
        try {
          // Criar backup
          const backupDest = pathJoin(backupPath, worldName);
          
          try {
            addLog(`Criando backup em: ${backupDest}`, 'system');
            execSync(`xcopy "${worldPath}" "${backupDest}" /E /I /H /Y /Q`, { 
              shell: true,
              stdio: 'pipe',
              timeout: 30000
            });
            addLog(`✓ Backup criado: ${backupName}/${worldName}`, 'system');
          } catch (backupErr) {
            addLog(`⚠ Aviso: Backup falhou, continuando com deleção`, 'system');
          }
          
          // MÉTODO 1: Tentar com Node.js rmSync
          addLog(`Método 1: Tentando deletar com rmSync...`, 'system');
          try {
            const { rmSync } = await import('fs');
            rmSync(worldPath, { recursive: true, force: true, maxRetries: 3 });
            deletedFolders++;
            addLog(`✓ Mundo deletado com rmSync: ${worldName}`, 'system');
            continue; // Se funcionar, pula para próximo
          } catch (rmErr) {
            addLog(`✗ rmSync falhou: ${rmErr.message}`, 'system');
          }
          
          // MÉTODO 2: Tentar com comando Windows
          addLog(`Método 2: Tentando deletar com rmdir...`, 'system');
          try {
            execSync(`rmdir /S /Q "${worldPath}"`, { 
              shell: true,
              stdio: 'pipe',
              timeout: 30000
            });
            
            // Verificar se realmente deletou
            if (!fs.existsSync(worldPath)) {
              deletedFolders++;
              addLog(`✓ Mundo deletado com rmdir: ${worldName}`, 'system');
              continue;
            } else {
              addLog(`✗ rmdir não deletou completamente`, 'system');
            }
          } catch (rmdirErr) {
            addLog(`✗ rmdir falhou: ${rmdirErr.message}`, 'system');
          }
          
          // MÉTODO 3: Tentar com PowerShell
          addLog(`Método 3: Tentando deletar com PowerShell...`, 'system');
          try {
            execSync(`powershell -Command "Remove-Item -Recurse -Force '${worldPath}'"`, { 
              shell: true,
              stdio: 'pipe',
              timeout: 30000
            });
            
            // Verificar se realmente deletou
            if (!fs.existsSync(worldPath)) {
              deletedFolders++;
              addLog(`✓ Mundo deletado com PowerShell: ${worldName}`, 'system');
            } else {
              addLog(`✗ PowerShell não deletou completamente`, 'system');
            }
          } catch (psErr) {
            addLog(`✗ PowerShell falhou: ${psErr.message}`, 'system');
          }
          
        } catch (err) {
          addLog(`✗ ERRO FATAL ao processar ${worldPath}: ${err.message}`, 'error');
        }
      } else {
        addLog(`✗ Pasta não existe: ${worldPath}`, 'system');
      }
    }

    // Verificar o que foi deletado
    let remainingPaths = [];
    for (const worldPath of worldPaths) {
      if (fs.existsSync(worldPath)) {
        remainingPaths.push(worldPath);
        addLog(`⚠ ATENÇÃO: Pasta ainda existe: ${worldPath}`, 'error');
      }
    }

    if (deletedFolders === 0) {
      addLog('✗ FALHA: Nenhuma pasta foi deletada!', 'error');
      addLog('Verifique: 1) Servidor está parado? 2) Tem permissões? 3) Pastas existem?', 'system');
      
      return res.json({
        success: false,
        message: `Nenhuma pasta foi deletada! Pastas encontradas: ${worldPaths.filter(p => fs.existsSync(p)).length}`,
        chunksFound: corruptedChunks.size,
        filesDeleted: 0,
        serverRestarted: false,
        details: `Verifique os logs. Pastas que existem: ${remainingPaths.join(', ')}`
      });
    }

    if (remainingPaths.length > 0) {
      addLog(`⚠ ${remainingPaths.length} pasta(s) não foram deletadas`, 'error');
    }

    addLog(`✓ Deleção concluída: ${deletedFolders} mundo(s) deletado(s)`, 'system');
    addLog('Inicie o servidor manualmente para gerar novo mundo', 'system');

    res.json({
      success: true,
      message: `Mundo deletado com sucesso! ${deletedFolders} pasta(s) removida(s)`,
      chunksFound: corruptedChunks.size,
      filesDeleted: deletedFolders,
      serverRestarted: false
    });

  } catch (error) {
    addLog(`Erro ao reparar chunks: ${error.message}`, 'error');
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Iniciar servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

// Configurar WebSocket
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');
  clients.add(ws);

  // Enviar logs existentes para o novo cliente
  ws.send(JSON.stringify({
    type: 'history',
    logs: serverLogs.slice(-100)
  }));

  // Enviar status atual
  ws.send(JSON.stringify({
    type: 'status',
    running: serverProcess !== null && !serverProcess.killed,
    pid: serverProcess?.pid || null
  }));

  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('Erro no WebSocket:', error);
    clients.delete(ws);
  });
});

function broadcastLog(logEntry) {
  const message = JSON.stringify({
    type: 'log',
    log: logEntry
  });

  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      try {
        client.send(message);
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  });
}

// Cleanup ao encerrar
process.on('SIGINT', () => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
  process.exit();
});

console.log('Servidor de controle do Hytale iniciado!');
