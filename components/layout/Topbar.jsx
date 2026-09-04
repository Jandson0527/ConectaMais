'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Search,
  PlusCircle,
  MinusCircle,
  HardDriveDownload,
  Bell,
  FileSpreadsheet,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  Calendar,
  DollarSign,
  Menu,
  LogOut
} from 'lucide-react';

export default function Topbar() {
  const {
    openModal,
    searchQuery,
    setSearchQuery,
    isSeller,
    currentUser,
    notifications,
    markNotificationsAsRead,
    exportCSV,
    exportJSON,
    importJSON,
    resetDemoData,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  } = useCRM();

  const canCreateFinance = !currentUser?.permissions || currentUser.permissions.includes('create-finance');
  const canCreateLeads = !currentUser?.permissions || currentUser.permissions.includes('create-leads');

  const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  const unreadNotifs = notifications.filter(n => !n.read);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === 'string') {
        importJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setIsDataDropdownOpen(false);
  };

  return (
    <header className="topbar">
      
      <div className="topbar-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <Menu style={{ width: '20px', height: '20px' }} />
        </button>

        <div className="global-search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            id="globalSearchInput"
            placeholder="Buscar por cliente, empresa, telefone, e-mail... (Pressione /)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-shortcut">/</span>
        </div>
      </div>

      <div className="topbar-right">
        
        {/* Ações Rápidas */}
        {!isSeller() && canCreateFinance && (
          <button
            className="btn btn-secondary"
            onClick={() => openModal('transaction', 'expense')}
            style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--danger)' }}
            title="Cadastrar Gastos da Empresa"
          >
            <MinusCircle style={{ width: '16px', height: '16px', marginRight: '4px' }} />
            <span className="hide-mobile">+ Novo Gasto</span>
          </button>
        )}

        {canCreateLeads && (
          <button
            className="btn btn-primary"
            onClick={() => openModal('client')}
            title="Cadastrar Novo Cliente / Anunciante"
          >
            <PlusCircle style={{ width: '16px', height: '16px', marginRight: '4px' }} />
            <span className="hide-mobile">{isSeller() ? '+ Nova Venda' : '+ Novo Cliente'}</span>
          </button>
        )}

        <button
          className="btn-icon"
          onClick={() => openModal('login')}
          title="Sair (Logout)"
          style={{ color: '#f87171' }}
        >
          <LogOut style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Exportar / Importar Dados */}
        <div className="dropdown-container" style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            onClick={() => { setIsDataDropdownOpen(!isDataDropdownOpen); setIsNotifDropdownOpen(false); }}
            title="Dados & Backup"
          >
            <HardDriveDownload style={{ width: '18px', height: '18px' }} />
          </button>

          {isDataDropdownOpen && (
            <div className="dropdown-menu active" style={{ display: 'flex', flexDirection: 'column', minWidth: '220px', right: 0, top: '48px', position: 'absolute', zIndex: 1000 }}>
              <button className="dropdown-item" onClick={() => { exportCSV(); setIsDataDropdownOpen(false); }}>
                <FileSpreadsheet style={{ width: '16px', height: '16px' }} />
                <span>Exportar Leads (CSV)</span>
              </button>
              <button className="dropdown-item" onClick={() => { exportJSON(); setIsDataDropdownOpen(false); }}>
                <Download style={{ width: '16px', height: '16px' }} />
                <span>Backup Completo (JSON)</span>
              </button>
              <label className="dropdown-item" style={{ cursor: 'pointer' }}>
                <Upload style={{ width: '16px', height: '16px' }} />
                <span>Restaurar Backup (JSON)</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </label>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item danger"
                onClick={() => {
                  if (confirm('Deseja realmente restaurar todos os dados demo do sistema?')) resetDemoData();
                  setIsDataDropdownOpen(false);
                }}
              >
                <RotateCcw style={{ width: '16px', height: '16px' }} />
                <span>Restaurar Dados Demo</span>
              </button>
            </div>
          )}
        </div>

        {/* Central de Notificações */}
        <div className="notification-wrapper" style={{ position: 'relative' }}>
          <button
            className="btn-icon has-badge"
            onClick={() => { setIsNotifDropdownOpen(!isNotifDropdownOpen); setIsDataDropdownOpen(false); }}
            title="Notificações"
          >
            <Bell style={{ width: '18px', height: '18px' }} />
            {unreadNotifs.length > 0 && <span className="notification-dot"></span>}
          </button>

          {isNotifDropdownOpen && (
            <div className="notification-dropdown active" style={{ display: 'flex', flexDirection: 'column', right: 0, top: '48px', position: 'absolute', zIndex: 1000, width: '320px' }}>
              <div className="notification-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Notificações & Lembretes</h4>
                {unreadNotifs.length > 0 && (
                  <button className="btn-link" onClick={markNotificationsAsRead} style={{ fontSize: '0.75rem', background: 'none', border: 'none', color: 'var(--primary-bright)', cursor: 'pointer' }}>
                    Limpar
                  </button>
                )}
              </div>
              <div className="notification-list" style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Nenhuma notificação no momento.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px',
                        background: n.read ? 'transparent' : 'rgba(0, 210, 255, 0.08)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.82rem'
                      }}
                    >
                      <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>{n.title}</strong>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.35 }}>{n.message}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                        {new Date(n.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
