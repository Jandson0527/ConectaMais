'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  LayoutDashboard,
  Kanban,
  Users,
  MapPin,
  Tv,
  Wallet,
  UserCheck,
  Calendar,
  ShieldCheck,
  BarChart3,
  ShoppingBag,
  Flame,
  Percent,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

export default function Sidebar() {
  const {
    currentUser,
    isSeller,
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    theme,
    toggleTheme,
    logout,
    leads,
    meetings,
    screens,
    formatCurrency
  } = useCRM();

  const leadsCount = leads.length;
  const kanbanOpenCount = leads.filter(l => l.stage !== 'ganho' && l.stage !== 'perdido').length;
  const meetingsTodayCount = meetings.filter(m => m.date === new Date().toISOString().split('T')[0]).length;

  const pipelineTotal = leads
    .filter(l => l.stage !== 'ganho' && l.stage !== 'perdido')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);

  // Só mostra/permite navegar para telas que o usuário realmente tem permissão de acessar
  const can = (viewId) => !currentUser?.permissions || currentUser.permissions.includes(viewId);

  const handleNavClick = (viewName) => {
    setCurrentView(viewName);
    if (window.innerWidth <= 900) {
      setIsSidebarCollapsed(true);
    }
  };

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
      
      {/* Header */}
      <div className="sidebar-header">
        <a href="#" className="brand-logo" onClick={(e) => {
          e.preventDefault();
          const preferredHome = isSeller() ? 'seller-dashboard' : 'dashboard';
          handleNavClick(can(preferredHome) ? preferredHome : (currentUser?.permissions?.[0] || preferredHome));
        }}>
          <svg className="logo-icon-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cmGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="50%" stopColor="#00b4d8" />
                <stop offset="100%" stopColor="#0077b6" />
              </linearGradient>
              <linearGradient id="cmGradBottom" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="var(--accent-orange)" />
                <stop offset="100%" stopColor="var(--accent-gold)" />
              </linearGradient>
              <linearGradient id="cmPlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-gold)" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <path d="M 74 24 C 62 11 40 11 26 24 C 12 38 12 62 26 76 C 36 86 52 89 65 83 C 58 78 48 76 40 70 C 27 60 27 40 40 30 C 49 23 63 24 74 24 Z" fill="url(#cmGradTop)" />
            <path d="M 26 76 C 39 89 61 89 74 76 C 77 73 74 67 69 67 C 65 67 62 69 59 72 C 49 80 35 79 26 71 C 24 69 22 66 21 63 C 20 68 22 72 26 76 Z" fill="url(#cmGradBottom)" />
            <path d="M 44 37 C 44 34.8 46.4 33.5 48.2 34.6 L 68.5 47.6 C 70.2 48.7 70.2 51.3 68.5 52.4 L 48.2 65.4 Z" fill="url(#cmPlayGrad)" />
          </svg>
          <div className="logo-text">
            <span className="brand-name">conecta</span>
            <span className="brand-highlight">mais</span>
            <span className="brand-plus">+</span>
          </div>
        </a>

        <button
          className="btn-icon sidebar-toggle-btn"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title={isSidebarCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          {isSidebarCollapsed ? <ChevronsRight style={{ width: '18px', height: '18px' }} /> : <ChevronsLeft style={{ width: '18px', height: '18px' }} />}
        </button>
      </div>

      {/* Usuário Ativo */}
      <div className="current-user-card">
        <div className="user-avatar-wrapper">
          <img src={currentUser?.avatar} alt={currentUser?.name} className="user-avatar" />
          <span className="status-indicator online"></span>
        </div>
        <div className="user-info-text">
          <span className="user-name">{currentUser?.name}</span>
          <span className="user-role-badge">
            {currentUser?.role === 'vendedor' ? 'Vendedor Comercial' : (currentUser?.role === 'admin' ? 'Sócio Diretor' : 'Sócia Executiva')}
          </span>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="sidebar-nav">
        
        {/* ==================== VENDEDOR ==================== */}
        {isSeller() ? (
          <>
            <div className="nav-section-title">PAINEL DO VENDEDOR</div>
            {can('seller-dashboard') && (
              <button
                className={`nav-item ${currentView === 'seller-dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('seller-dashboard')}
              >
                <LayoutDashboard style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Meu Painel</span>
              </button>
            )}
            {can('seller-sales') && (
              <button
                className={`nav-item ${currentView === 'seller-sales' ? 'active' : ''}`}
                onClick={() => handleNavClick('seller-sales')}
              >
                <ShoppingBag style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Minhas Vendas</span>
              </button>
            )}
            {can('seller-hotleads') && (
              <button
                className={`nav-item ${currentView === 'seller-hotleads' ? 'active' : ''}`}
                onClick={() => handleNavClick('seller-hotleads')}
              >
                <Flame style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Clientes Quentes</span>
              </button>
            )}
            {can('seller-commissions') && (
              <button
                className={`nav-item ${currentView === 'seller-commissions' ? 'active' : ''}`}
                onClick={() => handleNavClick('seller-commissions')}
              >
                <Percent style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Minhas Comissões</span>
                <span className="nav-counter" style={{ background: 'rgba(251, 191, 36, 0.15)', color: 'var(--accent-gold)' }}>10%</span>
              </button>
            )}
            {can('calendar') && (
              <button
                className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
                onClick={() => handleNavClick('calendar')}
              >
                <Calendar style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Meu Calendário</span>
              </button>
            )}
          </>
        ) : (
          /* ==================== SÓCIOS ==================== */
          <>
            <div className="nav-section-title">PAINEL DOS SÓCIOS</div>
            {can('dashboard') && (
              <button
                className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                <LayoutDashboard style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Dashboard Geral</span>
              </button>
            )}
            {can('kanban') && (
              <button
                className={`nav-item ${currentView === 'kanban' ? 'active' : ''}`}
                onClick={() => handleNavClick('kanban')}
              >
                <Kanban style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Funil de Vendas (CRM)</span>
                <span className="nav-counter">{kanbanOpenCount}</span>
              </button>
            )}
            {can('leads') && (
              <button
                className={`nav-item ${currentView === 'leads' ? 'active' : ''}`}
                onClick={() => handleNavClick('leads')}
              >
                <Users style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Lista de Clientes</span>
                <span className="nav-counter">{leadsCount}</span>
              </button>
            )}
            {can('screens') && (
              <button
                className={`nav-item ${currentView === 'screens' ? 'active' : ''}`}
                onClick={() => handleNavClick('screens')}
              >
                <MapPin style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Rede de Telas (Pontos)</span>
                <span className="nav-counter" style={{ background: 'rgba(0, 210, 255, 0.15)', color: 'var(--primary-bright)' }}>
                  {screens.length} Pontos
                </span>
              </button>
            )}
            {can('plans') && (
              <button
                className={`nav-item ${currentView === 'plans' ? 'active' : ''}`}
                onClick={() => handleNavClick('plans')}
              >
                <Tv style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Planos de TVs</span>
                <span className="nav-counter" style={{ background: 'rgba(251, 191, 36, 0.15)', color: 'var(--accent-gold)' }}>
                  Planos
                </span>
              </button>
            )}
            {can('finance') && (
              <button
                className={`nav-item ${currentView === 'finance' ? 'active' : ''}`}
                onClick={() => handleNavClick('finance')}
              >
                <Wallet style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Financeiro & Caixa</span>
              </button>
            )}
            {can('partner-sellers') && (
              <button
                className={`nav-item ${currentView === 'partner-sellers' ? 'active' : ''}`}
                onClick={() => handleNavClick('partner-sellers')}
              >
                <UserCheck style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Vendedores & Equipe</span>
                <span className="nav-counter" style={{ background: 'rgba(0, 210, 255, 0.15)', color: 'var(--primary-bright)' }}>
                  Comissões
                </span>
              </button>
            )}
            {can('calendar') && (
              <button
                className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
                onClick={() => handleNavClick('calendar')}
              >
                <Calendar style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Reuniões & Agenda</span>
                {meetingsTodayCount > 0 && (
                  <span className="nav-counter alert">{meetingsTodayCount}</span>
                )}
              </button>
            )}

            {(can('access') || can('reports')) && (
              <div className="nav-section-title">SÓCIOS & GESTÃO</div>
            )}
            {can('access') && (
              <button
                className={`nav-item ${currentView === 'access' ? 'active' : ''}`}
                onClick={() => handleNavClick('access')}
              >
                <ShieldCheck style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Sócios & Acessos</span>
              </button>
            )}
            {can('reports') && (
              <button
                className={`nav-item ${currentView === 'reports' ? 'active' : ''}`}
                onClick={() => handleNavClick('reports')}
              >
                <BarChart3 style={{ width: '18px', height: '18px' }} />
                <span className="nav-label">Relatórios & Métricas</span>
              </button>
            )}
          </>
        )}

      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="quick-pipeline-stat">
          <div className="stat-label">Pipeline em Aberto</div>
          <div className="stat-val">{formatCurrency(pipelineTotal)}</div>
          <div className="stat-progress-bar">
            <div className="progress-fill" style={{ width: '70%' }}></div>
          </div>
        </div>

        <div className="sidebar-actions-bottom">
          <button className="btn-theme-toggle" onClick={toggleTheme} title="Alternar Tema Claro/Escuro">
            {theme === 'dark' ? <Moon style={{ width: '16px', height: '16px' }} /> : <Sun style={{ width: '16px', height: '16px' }} />}
            <span className="theme-label">{theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</span>
          </button>
          <button className="btn-theme-toggle btn-logout" onClick={logout} title="Sair do Sistema">
            <LogOut style={{ width: '16px', height: '16px' }} />
            <span className="theme-label">Sair</span>
          </button>
        </div>
      </div>

    </aside>
  );
}
