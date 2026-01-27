# 🌐 Configuração Nginx - Hytale Server Manager

Guia para acessar o Hytale Server Manager de qualquer lugar (internet/rede local).

---

## ✅ O Que Foi Configurado

### 1. Frontend (Arquivos Estáticos)
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
Serve os arquivos do `dist/` (seu site React)

### 2. API Backend (Proxy Reverso)
```nginx
location /api/hytale/ {
    proxy_pass http://127.0.0.1:3001/api/hytale/;
}
```
Redireciona requisições da API para o backend Node.js

### 3. WebSocket (Logs em Tempo Real)
```nginx
location /ws {
    proxy_pass http://127.0.0.1:3001;
}
```
Permite conexão WebSocket para logs em tempo real

---

## 🚀 Como Funcionar

### Passo 1: Build do Frontend

No diretório do projeto:

```bash
npm run build
```

Isso cria/atualiza a pasta `dist/` com os arquivos otimizados.

### Passo 2: Iniciar o Backend

No PC onde o servidor Hytale roda:

```bash
cd server
npm start
```

O backend deve ficar rodando na porta 3001.

### Passo 3: Recarregar o Nginx

No Windows:

```cmd
cd C:\Users\Iago\Documents\Estudos\nginx-1.28.1

# Testar configuração
nginx.exe -t

# Recarregar (se teste OK)
nginx.exe -s reload

# Ou reiniciar completamente
taskkill /F /IM nginx.exe
start nginx.exe
```

### Passo 4: Testar

**Localmente:**
```
http://localhost/hytale
```

**Na rede local (outros PCs):**
```
http://192.168.X.X/hytale
```

**Da internet (com IP fixo):**
```
http://iagofreire.dev/hytale
```

---

## 📋 Checklist de Funcionamento

Marque o que está OK:

- [ ] Frontend buildado (`npm run build` executado)
- [ ] Backend rodando (`npm start` na pasta server)
- [ ] Backend respondendo em `http://localhost:3001/api/hytale/status`
- [ ] Nginx configurado (arquivo editado)
- [ ] Nginx recarregado (`nginx -s reload`)
- [ ] Página carrega em `http://localhost/hytale`
- [ ] Botões funcionam (Iniciar/Parar servidor)
- [ ] Logs aparecem em tempo real
- [ ] Funciona de outro PC na rede

---

## 🔍 Testando Individualmente

### Testar Backend Direto:

Abra no navegador:
```
http://localhost:3001/api/hytale/status
```

Deve retornar JSON tipo:
```json
{
  "running": false,
  "pid": null,
  "uptime": 0
}
```

### Testar Nginx:

```
http://localhost/hytale
```

Deve carregar a página do Hytale Manager.

### Testar API pelo Nginx:

Abra no navegador:
```
http://localhost/api/hytale/status
```

Deve retornar o mesmo JSON do backend.

---

## 🛠️ Estrutura de URLs

### Desenvolvimento (localhost):

| O Que | URL |
|-------|-----|
| Frontend Dev | `http://localhost:5173/hytale` |
| Backend Direto | `http://localhost:3001/api/hytale/...` |
| WebSocket Direto | `ws://localhost:3001` |

### Produção (nginx):

| O Que | URL |
|-------|-----|
| Frontend | `http://iagofreire.dev/hytale` |
| API | `http://iagofreire.dev/api/hytale/...` |
| WebSocket | `ws://iagofreire.dev/ws` |

---

## 🌍 Acessando de Fora

### Na Rede Local:

1. **Descubra o IP do PC:**
   ```cmd
   ipconfig
   ```
   Procure por "Endereço IPv4" (ex: 192.168.1.100)

2. **Acesse de outro PC:**
   ```
   http://192.168.1.100/hytale
   ```

### Da Internet (IP Fixo):

Você já tem IP fixo configurado!

1. **Configure DNS (se ainda não fez):**
   - Aponte `iagofreire.dev` para seu IP público

2. **Configure Port Forwarding no Roteador:**
   - Porta 80 (HTTP) → IP do PC (192.168.1.X)
   - Porta 443 (HTTPS) se configurar SSL

3. **Acesse:**
   ```
   http://iagofreire.dev/hytale
   ```

---

## 🔒 Segurança IMPORTANTE

### ⚠️ SEM AUTENTICAÇÃO!

O sistema atual **NÃO TEM SENHA**. Qualquer pessoa com acesso pode:
- Iniciar/Parar o servidor Hytale
- Ver todos os logs
- Controlar o servidor

### 🔐 Recomendações:

#### Opção 1: Restringir por IP (Básico)

No nginx.conf, adicione:

```nginx
location /hytale {
    # Permitir apenas rede local
    allow 192.168.1.0/24;
    deny all;
    
    try_files $uri $uri/ /index.html;
}
```

#### Opção 2: Autenticação Básica (Intermediário)

```bash
# Instalar htpasswd (se não tiver)
# Criar arquivo de senha
htpasswd -c "C:/Users/Iago/Documents/Estudos/nginx-1.28.1/conf/.htpasswd" admin
```

No nginx.conf:

```nginx
location /hytale {
    auth_basic "Hytale Manager";
    auth_basic_user_file conf/.htpasswd;
    
    try_files $uri $uri/ /index.html;
}

location /api/hytale/ {
    auth_basic "Hytale Manager";
    auth_basic_user_file conf/.htpasswd;
    
    proxy_pass http://127.0.0.1:3001/api/hytale/;
    # ... resto da config
}
```

#### Opção 3: VPN (Avançado)

Configure uma VPN (WireGuard, OpenVPN) e acesse apenas por ela.

---

## 🐛 Troubleshooting

### Problema: Página carrega mas botões não funcionam

**Causa:** Backend não está rodando ou nginx não está fazendo proxy corretamente

**Solução:**
1. Verifique se backend está rodando:
   ```
   http://localhost:3001/api/hytale/status
   ```

2. Veja logs do nginx:
   ```
   C:\Users\Iago\Documents\Estudos\nginx-1.28.1\logs\error.log
   ```

3. Teste proxy:
   ```
   http://localhost/api/hytale/status
   ```

### Problema: WebSocket não conecta (logs não aparecem)

**Causa:** Configuração WebSocket incorreta ou firewall

**Solução:**
1. Abra console do navegador (F12)
2. Veja erro de WebSocket
3. Verifique se nginx está fazendo upgrade de conexão
4. Desabilite firewall temporariamente para testar

### Problema: Funciona local mas não da internet

**Causa:** Port forwarding não configurado ou firewall bloqueando

**Solução:**
1. Configure port forwarding no roteador Archer C5:
   - Porta Externa: 80
   - Porta Interna: 80
   - IP: (IP do seu PC na rede local)

2. Verifique firewall do Windows:
   ```powershell
   # Permitir porta 80
   New-NetFirewallRule -DisplayName "Nginx HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
   ```

3. Teste se porta está aberta:
   - Site: https://www.yougetsignal.com/tools/open-ports/
   - Porta: 80
   - IP: Seu IP público

### Problema: Backend não aceita conexões remotas

**Causa:** Backend escutando apenas em localhost

**Solução:**

Edite `server/index.js`:

```javascript
// Antes
const server = app.listen(PORT, () => {

// Depois (escuta em todas as interfaces)
const server = app.listen(PORT, '0.0.0.0', () => {
```

---

## 📊 Logs Úteis

### Nginx:
```
C:\Users\Iago\Documents\Estudos\nginx-1.28.1\logs\error.log
C:\Users\Iago\Documents\Estudos\nginx-1.28.1\logs\access.log
```

### Backend:
```
# Terminal onde executou npm start
```

### Frontend (Navegador):
```
F12 → Console
F12 → Network → WS (WebSocket)
```

---

## 🔄 Workflow Completo

### Desenvolvimento Local:

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
npm run dev

# Acessar: http://localhost:5173/hytale
```

### Produção (Nginx):

```bash
# 1. Build do frontend
npm run build

# 2. Iniciar backend
cd server
npm start

# 3. Recarregar nginx
cd C:\Users\Iago\Documents\Estudos\nginx-1.28.1
nginx.exe -s reload

# Acessar: http://iagofreire.dev/hytale
```

---

## 📝 Comandos Nginx Úteis

```cmd
cd C:\Users\Iago\Documents\Estudos\nginx-1.28.1

# Testar configuração
nginx.exe -t

# Iniciar
start nginx.exe

# Recarregar (aplicar mudanças)
nginx.exe -s reload

# Parar graciosamente
nginx.exe -s quit

# Parar imediatamente
nginx.exe -s stop

# Forçar parada
taskkill /F /IM nginx.exe
```

---

## ✨ Resumo Rápido

**Para funcionar de fora:**

1. ✅ Frontend buildado: `npm run build`
2. ✅ Backend rodando: `cd server && npm start`
3. ✅ Nginx configurado: Já está!
4. ✅ Nginx recarregado: `nginx.exe -s reload`
5. ✅ Acesse: `http://iagofreire.dev/hytale`

**Pronto! 🎉**

---

## 🎯 Próximos Passos (Opcional)

- [ ] Adicionar HTTPS (SSL/TLS)
- [ ] Configurar autenticação
- [ ] Adicionar rate limiting
- [ ] Configurar logs de auditoria
- [ ] Adicionar monitoramento
- [ ] Configurar backup automático
