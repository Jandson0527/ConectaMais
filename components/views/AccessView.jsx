'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  ShieldCheck,
  Plus,
  CheckCircle,
  UserCheck,
  Percent,
  Mail,
  Phone
} from 'lucide-react';

export default function AccessView() {
  const { users, openModal, currentUser } = useCRM();
  const partners = users.filter(u => u.role !== 'vendedor');

  return (
    <section className="view-panel active" id="view-access">
      
      <div className="view-header">
        <div>
          <h1 className="view-title">Sócios & Gestão de Acessos</h1>
          <p className="view-subtitle">Controle de sócios diretores, níveis de permissão comercial e faturamento.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('user')}>
          <Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
          <span>+ Cadastrar Sócio</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {users.map(user => (
          <div
            key={user.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00d2ff', filter: user.active === false ? 'grayscale(1)' : 'none' }}
                />
                {user.active === false && (
                  <span style={{ position: 'absolute', bottom: -5, right: -5, background: '#ef4444', color: '#fff', fontSize: '0.6rem', padding: '2px 4px', borderRadius: '4px', fontWeight: 700 }}>INATIVO</span>
                )}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', textDecoration: user.active === false ? 'line-through' : 'none' }}>{user.name}</h3>
                <span style={{ fontSize: '0.78rem', color: '#00d2ff', fontWeight: 600 }}>
                  {user.role === 'vendedor' ? 'Vendedor' : (user.roleName || 'Sócio')}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><Mail style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} /> {user.email}</div>
              {user.phone && <div><Phone style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} /> {user.phone}</div>}
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              marginTop: '4px'
            }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '4px' }}>Permissões ({user.permissions?.length || 0}):</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {(user.permissions || []).map(p => (
                  <span key={p} style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '2px 6px', borderRadius: '4px', color: '#00d2ff', fontSize: '0.7rem' }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {currentUser?.role === 'admin' && (
              <button 
                className="btn btn-secondary sm" 
                style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
                onClick={() => openModal('edit-user', user)}
              >
                <UserCheck style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                Editar Usuário
              </button>
            )}
          </div>
        ))}
      </div>

    </section>
  );
}
