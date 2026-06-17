import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
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
      // Login automático após cadastro
      const { error: loginErr } = await signIn(email, password);
      if (loginErr) {
        // Cadastro ok mas login falhou — volta para tela de login
        setMode('login');
        setError(null);
        setLoading(false);
        return;
      }
      navigate('/bolao');
    }
  };

  const toggleMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setError(null);
  };

  return (
    <div className={styles.page}>
      {/* Animated background */}
      <div className={styles.bg}>
        <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
        <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
        <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardBrand}>
          <span className={styles.cardBall}>⚽</span>
          <div>
            <h1 className={styles.cardTitle}>Bolão Copa 2026</h1>
            <p className={styles.cardSubtitle}>EUA · Canadá · México</p>
          </div>
        </div>

        <h2 className={styles.cardHeading}>
          {mode === 'login' ? 'Entrar na Competição' : 'Criar minha Conta'}
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label className={styles.field}>
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
              <label className={styles.field}>
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

          <label className={styles.field}>
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

          <label className={styles.field}>
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

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <button className={styles.toggle} onClick={toggleMode}>
          {mode === 'login'
            ? 'Não tem conta? Cadastre-se'
            : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
}
