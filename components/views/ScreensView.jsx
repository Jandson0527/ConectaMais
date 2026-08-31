'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  MapPin,
  Plus,
  Tv,
  Users,
  Edit3,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function ScreensView() {
  const { screens, openModal, deleteScreen } = useCRM();

  return (
    <section className="view-panel active" id="view-screens">
      
      <div className="view-header">
        <div>
          <h1 className="view-title">Rede de Telas & Pontos Comerciais</h1>
          <p className="view-subtitle">Gerencie os estabelecimentos parceiros com TVs físicas instaladas para veiculação de anúncios.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('screen')}>
          <Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
          <span>+ Novo Ponto de Tela</span>
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {screens.map(screen => {
          const isActive = screen.status === 'active';
          return (
            <div
              key={screen.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
                    {screen.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#00d2ff', fontWeight: 600 }}>
                    {screen.segment}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: isActive ? '#10b981' : '#fbbf24',
                  border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                }}>
                  {isActive ? '● Ativa' : '● Manutenção'}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin style={{ width: '15px', height: '15px', color: 'var(--primary)', flexShrink: 0 }} />
                  <span>{screen.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users style={{ width: '15px', height: '15px', color: 'var(--accent-gold)', flexShrink: 0 }} />
                  <span>Público Estimado: <strong>{screen.audienceEst}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tv style={{ width: '15px', height: '15px', color: '#00d2ff', flexShrink: 0 }} />
                  <span>Telas no Local: <strong>{screen.tvsCount} TV (Full HD)</strong></span>
                </div>
              </div>

              {screen.notes && (
                <div style={{
                  background: 'var(--bg-surface)',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)'
                }}>
                  {screen.notes}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="btn btn-secondary sm"
                  onClick={() => openModal('edit-screen', screen)}
                >
                  <Edit3 style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                  Editar
                </button>
                <button
                  className="btn btn-secondary sm"
                  style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  onClick={() => {
                    if (confirm(`Excluir ponto ${screen.name}?`)) deleteScreen(screen.id);
                  }}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
