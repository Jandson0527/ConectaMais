'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { LogIn, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginView() {
  const { login } = useCRM();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('E-mail ou senha incorretos.');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="login-page">
      <aside className="login-page-brand">
        <div className="login-page-brand-logo">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pageGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="50%" stopColor="#00b4d8" />
                <stop offset="100%" stopColor="#0077b6" />
              </linearGradient>
              <linearGradient id="pageGradBottom" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="var(--accent-orange)" />
                <stop offset="100%" stopColor="var(--accent-gold)" />
              </linearGradient>
              <linearGradient id="pagePlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-gold)" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <path d="M 74 24 C 62 11 40 11 26 24 C 12 38 12 62 26 76 C 36 86 52 89 65 83 C 58 78 48 76 40 70 C 27 60 27 40 40 30 C 49 23 63 24 74 24 Z" fill="url(#pageGradTop)" />
            <path d="M 26 76 C 39 89 61 89 74 76 C 77 73 74 67 69 67 C 65 67 62 69 59 72 C 49 80 35 79 26 71 C 24 69 22 66 21 63 C 20 68 22 72 26 76 Z" fill="url(#pageGradBottom)" />
            <path d="M 44 37 C 44 34.8 46.4 33.5 48.2 34.6 L 68.5 47.6 C 70.2 48.7 70.2 51.3 68.5 52.4 L 48.2 65.4 Z" fill="url(#pagePlayGrad)" />
          </svg>
          <div className="logo-text">
            <span className="brand-name">conecta</span>
            <span className="brand-highlight">mais</span>
            <span className="brand-plus">+</span>
          </div>
        </div>

        <div className="login-page-tagline">
          <h1>Gestão inteligente de marketing indoor & vendas</h1>
          <p>Acompanhe sua rede de telas, funil de vendas, comissões e faturamento em um só lugar.</p>
        </div>

        <div className="login-page-foot">© {new Date().getFullYear()} Conecta Mais. Todos os direitos reservados.</div>
      </aside>

      <div className="login-page-form-panel">
        <div className="login-page-form-card">
          <h2>Bem-vindo de volta</h2>
          <p className="login-subtitle">Entre com suas credenciais para acessar o sistema.</p>

          {error && (
            <div className="login-error-alert">
              <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="loginPageEmail">E-mail</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon-left" />
                <input
                  type="email"
                  id="loginPageEmail"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="loginPagePassword">Senha</label>
              <div className="input-icon-wrapper">
                <Lock className="input-icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="loginPagePassword"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Mostrar/Ocultar senha"
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login-submit" disabled={isLoading} style={{ marginTop: '0.4rem' }}>
              <LogIn style={{ width: '18px', height: '18px' }} />
              <span>{isLoading ? 'Entrando...' : 'Entrar no sistema'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
