'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  Users,
  Check
} from 'lucide-react';

export default function SwitchUserModal() {
  const {
    closeModal,
    users,
    currentUser,
    switchUser
  } = useCRM();

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-sm" style={{ maxWidth: '440px' }}>
        
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users style={{ width: '20px', height: '20px', color: 'var(--primary-bright)' }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800 }}>
              Alternar Usuário Ativo
            </h3>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Selecione o perfil desejado para simular a visão daquele usuário:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {users.map(u => {
              const isSelected = u.id === currentUser?.id;
              return (
                <div
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(0, 210, 255, 0.15)' : 'var(--bg-surface)',
                    border: `1.5px solid ${isSelected ? 'var(--primary-bright)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={u.avatar}
                      alt={u.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>{u.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: u.role === 'vendedor' ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                        {u.roleName || (u.role === 'vendedor' ? 'Vendedor Comercial (10%)' : 'Sócio')}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                      <Check style={{ width: '13px', height: '13px', strokeWidth: 3 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
