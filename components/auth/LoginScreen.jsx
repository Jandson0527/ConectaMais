'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export default function LoginScreen() {
  const { users, login, switchUser, closeModal, activeModal } = useCRM();
  
  const [email, setEmail] = useState('jandson@conectamais.com.br');
  const [password, setPassword] = useState('conecta123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const isVisible = activeModal?.type === 'login';
  if (!isVisible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const success = login(email, password);
    if (success) {
      closeModal();
    } else {
      setErrorMessage('E-mail ou senha inválidos.');
    }
  };

  const handleQuickLogin = (user) => {
    setEmail(user.email);
    setPassword(user.password || 'conecta123');
    switchUser(user.id);
    closeModal();
  };

  return (
    <div className="login-screen-overlay">
      <div className="login-card-container">
        
        <div className="login-header">
          <div className="login-brand-logo">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="loginGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="50%" stopColor="#00b4d8" />
                  <stop offset="100%" stopColor="#0077b6" />
                </linearGradient>
                <linearGradient id="loginGradBottom" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="var(--accent-orange)" />
                  <stop offset="100%" stopColor="var(--accent-gold)" />
                </linearGradient>
                <linearGradient id="loginPlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-gold)" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              <path d="M 74 24 C 62 11 40 11 26 24 C 12 38 12 62 26 76 C 36 86 52 89 65 83 C 58 78 48 76 40 70 C 27 60 27 40 40 30 C 49 23 63 24 74 24 Z" fill="url(#loginGradTop)" />
              <path d="M 26 76 C 39 89 61 89 74 76 C 77 73 74 67 69 67 C 65 67 62 69 59 72 C 49 80 35 79 26 71 C 24 69 22 66 21 63 C 20 68 22 72 26 76 Z" fill="url(#loginGradBottom)" />
              <path d="M 44 37 C 44 34.8 46.4 33.5 48.2 34.6 L 68.5 47.6 C 70.2 48.7 70.2 51.3 68.5 52.4 L 48.2 65.4 Z" fill="url(#loginPlayGrad)" />
            </svg>
            <div>
              <span className="login-brand-name">conecta</span>
              <span className="login-brand-highlight">mais</span>
              <span className="login-brand-plus">+</span>
            </div>
          </div>
          <p className="login-subtitle">Gestão Inteligente de Marketing Indoor & Vendas</p>
        </div>

        {errorMessage && (
          <div className="login-error-alert active" style={{ display: 'flex' }}>
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="loginEmail">E-mail Corporativo</label>
            <div className="input-icon-wrapper">
              <input
                type="email"
                id="loginEmail"
                placeholder="seu.email@conectamais.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="input-icon-left" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="loginPassword">Senha de Acesso</label>
            <div className="input-icon-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="loginPassword"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="input-icon-left" />
              <button
                type="button"
                className="btn-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                title="Mostrar/Ocultar"
              >
                {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
              </button>
            </div>
          </div>

          <div className="login-options-row">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Lembrar meu acesso</span>
            </label>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Senha demo: <strong>conecta123</strong></span>
          </div>

          <button type="submit" className="btn-login-submit">
            <LogIn style={{ width: '18px', height: '18px' }} />
            <span>Entrar no Sistema</span>
          </button>
        </form>

        {/* Acesso Rápido Demo */}
        <div className="login-quick-partners">
          <div className="quick-partners-title">Acesso Rápido Demo (1 Clique):</div>
          <div className="quick-partners-grid">
            {users.map(u => (
              <button
                key={u.id}
                type="button"
                className="quick-partner-btn"
                onClick={() => handleQuickLogin(u)}
              >
                <img src={u.avatar} alt={u.name} />
                <div className="quick-partner-info">
                  <div className="quick-partner-name">{u.name}</div>
                  <div className="quick-partner-role">{u.role === 'vendedor' ? 'Vendedor (10%)' : 'Sócio'}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
