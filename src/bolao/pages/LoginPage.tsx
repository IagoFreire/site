import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

type Mode = 'login' | 'register';

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === 'login') {
      const { error: err } = await signIn(email, password);
      if (err) { setError(err); setLoading(false); return; }
      navigate('/bolao');
    } else {
      if (!username.trim() || !displayName.trim()) {
        setError('Preencha todos os campos.');
        setLoading(false);
        return;
      }
      const { error: err } = await signUp(email, password, username.trim(), displayName.trim());
      if (err) { setError(err); setLoading(false); return; }
      setSuccess('Conta criada! Verifique seu e-mail para confirmar (ou entre direto se a confirmação não for obrigatória).');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1" />
        <div className="login-bg__orb login-bg__orb--2" />
        <div className="login-bg__orb login-bg__orb--3" />
      </div>

      <div className="login-card">
        <div className="login-card__brand">
          <span className="login-card__ball">⚽</span>
          <div>
            <h1 className="login-card__title">Bolão Copa 2026</h1>
            <p className="login-card__subtitle">EUA · Canadá · México</p>
          </div>
        </div>

        <h2 className="login-card__heading">
          {mode === 'login' ? 'Entrar na Competição' : 'Criar minha Conta'}
        </h2>

        {success && <div className="login-success">{success}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label className="login-field">
                <span>Nome de exibição</span>
                <input
                  type="text"
                  placeholder="João Silva"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
              <label className="login-field">
                <span>Usuário (sem espaços)</span>
                <input
                  type="text"
                  placeholder="joaosilva"
                  value={username}
                  onChange={e => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                  autoComplete="username"
                  required
                />
              </label>
            </>
          )}

          <label className="login-field">
            <span>E-mail</span>
            <input
              type="email"
              placeholder="joao@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="login-field">
            <span>Senha</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <span className="login-spinner" /> : mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <button className="login-toggle" onClick={toggleMode}>
          {mode === 'login'
            ? 'Não tem conta? Cadastre-se'
            : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
}
