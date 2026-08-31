import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { LogIn, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginView() {
  const { login } = useCRM();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulando um pequeno atraso para dar feedback visual
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('E-mail ou senha incorretos.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #070b14 0%, #0d1627 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(20, 28, 43, 0.6)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 16px rgba(0, 210, 255, 0.2)'
          }}>
            <LogIn size={32} color="#fff" />
          </div>
          <h1 style={{ 
            color: '#fff', 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            marginBottom: '8px',
            background: 'linear-gradient(to right, #fff, #a0aec0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Conecta Mais
          </h1>
          <p style={{ color: '#8b9bb4', fontSize: '0.95rem' }}>
            Faça login para acessar o sistema
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
              E-mail
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '14px 14px 14px 44px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00d2ff'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '14px 14px 14px 44px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00d2ff'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'transform 0.2s, boxShadow 0.2s',
              boxShadow: '0 8px 16px rgba(0, 210, 255, 0.25)'
            }}
            onMouseOver={(e) => !isLoading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !isLoading && (e.target.style.transform = 'translateY(0)')}
          >
            {isLoading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
