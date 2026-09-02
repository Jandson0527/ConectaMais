'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  ShieldCheck,
  Check,
  Trash2,
  Lock,
  Mail,
  User,
  Power
} from 'lucide-react';

export default function EditUserModal() {
  const { closeModal, activeModal, updateUser, deleteUser, currentUser } = useCRM();

  const user = activeModal?.data;
  const canDeleteUsers = !currentUser?.permissions || currentUser.permissions.includes('delete-users');
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(user?.password || '');
  const [role, setRole] = useState(user?.role || '');
  const [active, setActive] = useState(user?.active !== false);
  const [permissions, setPermissions] = useState(user?.permissions || []);

  if (!user) return null;

  const togglePermission = (perm) => {
    setPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(user.id, {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      active,
      permissions
    });
    closeModal();
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}? Essa ação não pode ser desfeita.`)) {
      deleteUser(user.id);
      closeModal();
    }
  };

  const viewPermissions = [
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

  const actionPermissions = [
    { id: 'create-leads', label: 'Cadastrar Clientes / Vendas' },
    { id: 'edit-leads', label: 'Editar Clientes' },
    { id: 'delete-leads', label: 'Excluir Clientes' },
    { id: 'create-finance', label: 'Cadastrar Transações (Caixa)' },
    { id: 'edit-finance', label: 'Editar Transações' },
    { id: 'delete-finance', label: 'Excluir Transações' },
    { id: 'create-users', label: 'Cadastrar Sócios/Usuários' },
    { id: 'edit-users', label: 'Editar Sócios/Usuários' },
    { id: 'delete-users', label: 'Excluir Sócios/Usuários' },
  ];

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-lg" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ width: '22px', height: '22px', color: 'var(--primary-bright)' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
              Editar Usuário / Permissões
            </h3>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 60px)' }}>
          <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', overflowY: 'auto', flex: 1, minHeight: 0 }}>
            
            {/* Coluna 1: Dados do Usuário */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ color: 'var(--primary-bright)', fontSize: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                Dados Básicos
              </h4>
              
              <div className="form-group">
                <label className="form-label"><User style={{width: 14, height: 14, display:'inline', marginRight: 4}}/> Nome</label>
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              
              <div className="form-group">
                <label className="form-label"><Mail style={{width: 14, height: 14, display:'inline', marginRight: 4}}/> E-mail</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label"><Lock style={{width: 14, height: 14, display:'inline', marginRight: 4}}/> Senha de Acesso</label>
                <input type="text" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Perfil de Usuário</label>
                <select className="form-select" value={role} onChange={e => setRole(e.target.value)} disabled={user.id === 'usr-1'}>
                  <option value="admin">Sócio Diretor (Master)</option>
                  <option value="manager">Sócio / Gestor</option>
                  <option value="vendedor">Vendedor / SDR</option>
                </select>
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
                  <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} disabled={user.id === 'usr-1'} />
                  <span style={{ fontSize: '0.9rem', color: active ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                    <Power style={{ width: 14, height: 14, display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                    {active ? 'Usuário Ativo (Pode fazer login)' : 'Usuário Inativo (Login Bloqueado)'}
                  </span>
                </label>
              </div>

              {user.id !== 'usr-1' && canDeleteUsers && (
                <button type="button" className="btn sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', marginTop: 'auto' }} onClick={handleDelete}>
                  <Trash2 style={{ width: 14, height: 14, marginRight: 6 }} /> Excluir Usuário Permanentemente
                </button>
              )}
            </div>

            {/* Coluna 2: Permissões */}
            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <h4 style={{ color: 'var(--primary-bright)', fontSize: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '10px' }}>
                  Permissões de Telas (Views)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {viewPermissions.map(view => (
                    <label key={view.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={permissions.includes(view.id)} onChange={() => togglePermission(view.id)} disabled={user.id === 'usr-1'} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{view.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '10px' }}>
                  Permissões de Ações (Avançado)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {actionPermissions.map(action => (
                    <label key={action.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={permissions.includes(action.id)} onChange={() => togglePermission(action.id)} disabled={user.id === 'usr-1'} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{action.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Check style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
