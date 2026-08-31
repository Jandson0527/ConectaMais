'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function PermissionModal() {
  const { closeModal, activeModal, updateUserPermissions } = useCRM();
  
  const user = activeModal?.data;
  const initialPermissions = user?.permissions || [];
  
  const [permissions, setPermissions] = useState(initialPermissions);

  if (!user) return null;

  const togglePermission = (perm) => {
    setPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserPermissions(user.id, permissions);
    closeModal();
  };

  const allViews = [
    { id: 'dashboard', label: 'Dashboard Geral' },
    { id: 'kanban', label: 'Funil de Vendas (CRM)' },
    { id: 'leads', label: 'Lista de Clientes' },
    { id: 'screens', label: 'Rede de Telas' },
    { id: 'plans', label: 'Planos' },
    { id: 'finance', label: 'Financeiro' },
    { id: 'partner-sellers', label: 'Vendedores & Equipe' },
    { id: 'calendar', label: 'Reuniões & Agenda' },
    { id: 'access', label: 'Sócios & Acessos' },
    { id: 'reports', label: 'Relatórios & Métricas' },
    { id: 'seller-dashboard', label: 'Painel Vendedor' },
    { id: 'seller-sales', label: 'Minhas Vendas' },
    { id: 'seller-hotleads', label: 'Clientes Quentes' },
    { id: 'seller-commissions', label: 'Minhas Comissões' }
  ];

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-md" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ width: '22px', height: '22px', color: '#00d2ff' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>
              Permissões: {user.name}
            </h3>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '10px' }}>
              Selecione exatamente quais telas este usuário poderá visualizar e interagir no menu.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {allViews.map(view => (
                <label key={view.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '10px', 
                  background: 'var(--bg-input)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.includes(view.id)}
                    onChange={() => togglePermission(view.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#ffffff' }}>{view.label}</span>
                </label>
              ))}
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Check style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>Salvar Permissões</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
