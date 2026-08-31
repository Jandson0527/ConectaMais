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
        {partners.map(partner => (
          <div
            key={partner.id}
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
              <img
                src={partner.avatar}
                alt={partner.name}
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00d2ff' }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>{partner.name}</h3>
                <span style={{ fontSize: '0.78rem', color: '#00d2ff', fontWeight: 600 }}>
                  {partner.roleName || 'Sócio'}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><Mail style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} /> {partner.email}</div>
              <div><Phone style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} /> {partner.phone || 'Sem telefone'}</div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              marginTop: '4px'
            }}>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '4px' }}>Permissões Ativas:</strong>
              • Visualização de todos os leads e funil<br />
              • Acesso a faturamento e fluxo de caixa<br />
              • Gestão e aprovação de vendedores
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
