import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HytalePage.css';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'stdout' | 'stderr' | 'error' | 'system' | 'command' | 'warning';
}

interface ServerStatus {
  running: boolean;
  pid: number | null;
  uptime: number;
}

// Detecta se está acessando localmente ou remotamente
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_URL = isLocalhost 
  ? 'http://localhost:3001/api/hytale' 
  : `${window.location.protocol}//${window.location.host}/api/hytale`;

const WS_URL = isLocalhost 
  ? 'ws://localhost:3001' 
  : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;

const MAX_LOGS = 300; // Máximo de linhas a exibir

const HytalePage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<ServerStatus>({ running: false, pid: null, uptime: 0 });
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [command, setCommand] = useState('');
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  // Auto-scroll para o final dos logs
  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Conectar ao WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
        console.log('WebSocket conectado');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'log') {
          setLogs(prev => {
            const newLogs = [...prev, data.log];
            // Mantém apenas as últimas MAX_LOGS linhas
            return newLogs.slice(-MAX_LOGS);
          });
        } else if (data.type === 'history') {
          // Limita o histórico ao carregar
          setLogs(data.logs.slice(-MAX_LOGS));
        } else if (data.type === 'status') {
          setStatus({ running: data.running, pid: data.pid, uptime: 0 });
        }
      };

      ws.onclose = () => {
        console.log('WebSocket desconectado');
        setConnected(false);
        // Tentar reconectar após 3 segundos
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    // Buscar status inicial
    fetchStatus();

    // Atualizar status a cada 5 segundos
    const statusInterval = setInterval(fetchStatus, 5000);

    return () => {
      wsRef.current?.close();
      clearInterval(statusInterval);
    };
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/status`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Erro ao buscar status:', error);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/start`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchStatus();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Erro ao iniciar servidor:', error);
      alert('Erro ao iniciar servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/stop`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchStatus();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Erro ao parar servidor:', error);
      alert('Erro ao parar servidor');
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    try {
      const response = await fetch(`${API_URL}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: command.trim() }),
      });
      
      const data = await response.json();
      if (data.success) {
        setCommand('');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Erro ao enviar comando:', error);
      alert('Erro ao enviar comando');
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLogClassName = (type: string) => {
    switch (type) {
      case 'error':
      case 'stderr':
        return 'log-error';
      case 'warning':
      case 'warn':
        return 'log-warning';
      case 'system':
        return 'log-system';
      case 'command':
        return 'log-command';
      default:
        return 'log-info';
    }
  };

  return (
    <div className="hytale-page">
      <header className="hytale-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Voltar
        </button>
        <h1>Hytale Server Manager</h1>
        <div className="connection-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '● Conectado' : '○ Desconectado'}
          </span>
        </div>
      </header>

      <div className="hytale-container">
        <div className="control-panel">
          <div className="server-info">
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`info-value ${status.running ? 'running' : 'stopped'}`}>
                {status.running ? '● Online' : '○ Offline'}
              </span>
            </div>
            {status.pid && (
              <div className="info-item">
                <span className="info-label">PID:</span>
                <span className="info-value">{status.pid}</span>
              </div>
            )}
            {status.running && (
              <div className="info-item">
                <span className="info-label">Uptime:</span>
                <span className="info-value">{formatUptime(status.uptime)}</span>
              </div>
            )}
          </div>

          <div className="control-buttons">
            <button
              className="btn btn-start"
              onClick={handleStart}
              disabled={status.running || loading}
            >
              {loading && !status.running ? 'Iniciando...' : 'Iniciar Servidor'}
            </button>
            <button
              className="btn btn-stop"
              onClick={handleStop}
              disabled={!status.running || loading}
            >
              {loading && status.running ? 'Parando...' : 'Parar Servidor'}
            </button>
            <button
              className="btn btn-clear"
              onClick={clearLogs}
            >
              Limpar Logs
            </button>
          </div>

          <form className="command-form" onSubmit={handleSendCommand}>
            <input
              type="text"
              className="command-input"
              placeholder="Digite um comando... (ex: say Olá, list, help)"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={!status.running}
            />
            <button
              type="submit"
              className="btn btn-send"
              disabled={!status.running || !command.trim()}
            >
              Enviar
            </button>
          </form>
        </div>

        <div className="terminal-container">
          <div className="terminal-header">
            <span>Terminal</span>
            <span className="log-count">{logs.length} linhas</span>
          </div>
          <div className="terminal">
            {logs.length === 0 ? (
              <div className="terminal-empty">
                Aguardando logs do servidor...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`log-entry ${getLogClassName(log.type)}`}>
                  <span className="log-timestamp">
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HytalePage;
