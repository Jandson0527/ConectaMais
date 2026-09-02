'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Tv,
  Check,
  Plus,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function PlansView() {
  const { plans, currentUser, openModal, formatCurrency } = useCRM();
  const canCreateLeads = !currentUser?.permissions || currentUser.permissions.includes('create-leads');

  return (
    <section className="view-panel active" id="view-plans">

      <div className="view-header">
        <div>
          <h1 className="view-title">Planos de TVs & Mídia Indoor</h1>
          <p className="view-subtitle">Conheça a grade de planos comerciais de veiculação na rede de telas Conecta Mais.</p>
        </div>
        {canCreateLeads && (
          <button className="btn btn-primary" onClick={() => openModal('client')}>
            <Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
            <span>+ Cadastrar Cliente no Plano</span>
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {plans.map(plan => {
          const isTop = plan.isPopular;
          return (
            <div
              key={plan.id}
              style={{
                background: isTop ? 'linear-gradient(180deg, rgba(217, 119, 6, 0.1) 0%, var(--bg-card) 45%)' : 'var(--bg-card)',
                border: `1.5px solid ${isTop ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {isTop && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '16px',
                  background: 'var(--gradient-gold)',
                  color: '#000',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  👑 Mais Vendido
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>{plan.badge}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800 }}>{plan.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{plan.tvs} {plan.tvs === 1 ? 'TV instalada' : 'TVs na rede'}</span>
                </div>
              </div>

              <div style={{ margin: '8px 0' }}>
                {plan.monthlyPrice && (
                  <div>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                      {formatCurrency(plan.monthlyPrice)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / mês</span>
                  </div>
                )}
                {plan.quarterlyPrice && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', marginTop: '2px', fontWeight: 600 }}>
                    ou {formatCurrency(plan.quarterlyPrice)} no Trimestral
                  </div>
                )}
                {plan.fixedPrice && (
                  <div>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                      {formatCurrency(plan.fixedPrice)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> (campanha)</span>
                  </div>
                )}
              </div>

              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {plan.tagline || plan.description}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check style={{ width: '14px', height: '14px', color: 'var(--success)' }} />
                  <span>{plan.tvs} Telas em estabelecimentos parceiros</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check style={{ width: '14px', height: '14px', color: 'var(--success)' }} />
                  <span>{plan.changesPerMonth || 1} Alteração de anúncio / mês</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check style={{ width: '14px', height: '14px', color: 'var(--success)' }} />
                  <span>Foto Estática ou Vídeo Motion Graphics</span>
                </div>
              </div>

              <button
                className="btn btn-primary sm"
                style={{ marginTop: 'auto', justifyContent: 'center', fontWeight: 700 }}
                onClick={() => openModal('client', { planId: plan.id })}
              >
                Vender Este Plano <ArrowRight style={{ width: '14px', height: '14px', marginLeft: '4px' }} />
              </button>
            </div>
          );
        })}
      </div>

    </section>
  );
}
